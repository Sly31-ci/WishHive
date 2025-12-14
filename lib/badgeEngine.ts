/**
 * Badge Engine - Automatic Badge Attribution System
 * 
 * This module handles the logic for checking user actions and awarding badges
 * when criteria are met. It integrates with the gamification system.
 */

import { supabase } from './supabase';
import { Database } from '@/types/database';

type Badge = Database['public']['Tables']['badges']['Row'];
type UserBadge = Database['public']['Tables']['user_badges']['Row'];

export type BadgeAction =
    | 'create_wishlist'
    | 'purchase_gift'
    | 'follow'
    | 'seller_sales'
    | 'top_wishlist';

export interface BadgeMetadata {
    count?: number;
    period?: 'day' | 'week' | 'month';
    [key: string]: any;
}

export interface BadgeAwardResult {
    awarded: boolean;
    badge?: Badge;
    alreadyHas?: boolean;
    error?: string;
}

/**
 * Check if user meets criteria for a badge and award it
 */
export async function checkAndAwardBadges(
    userId: string,
    action: BadgeAction,
    metadata: BadgeMetadata = {}
): Promise<BadgeAwardResult[]> {
    try {
        // Fetch all badges for this action
        const { data: badges, error: badgesError } = await supabase
            .from('badges')
            .select('*')
            .contains('criteria', { action });

        if (badgesError) throw badgesError;
        if (!badges || badges.length === 0) return [];

        const results: BadgeAwardResult[] = [];

        for (const badge of badges) {
            const result = await checkSingleBadge(userId, badge, metadata);
            results.push(result);
        }

        return results;
    } catch (error) {
        console.error('Error checking badges:', error);
        return [{ awarded: false, error: String(error) }];
    }
}

/**
 * Check a single badge criteria
 */
async function checkSingleBadge(
    userId: string,
    badge: Badge,
    metadata: BadgeMetadata
): Promise<BadgeAwardResult> {
    try {
        // Check if user already has this badge
        const { data: existingBadge } = await supabase
            .from('user_badges')
            .select('*')
            .eq('user_id', userId)
            .eq('badge_id', badge.id)
            .single();

        if (existingBadge) {
            return { awarded: false, alreadyHas: true, badge };
        }

        // Check if criteria is met
        const criteria = badge.criteria as any;
        const meetsC

        riteria = await evaluateCriteria(userId, criteria, metadata);

        if (!meetsCriteria) {
            return { awarded: false, badge };
        }

        // Award the badge
        const { error: awardError } = await supabase
            .from('user_badges')
            .insert({
                user_id: userId,
                badge_id: badge.id,
            });

        if (awardError) throw awardError;

        // Award points
        if (badge.points_reward > 0) {
            await awardPoints(userId, badge.points_reward, `badge_${badge.slug}`);
        }

        return { awarded: true, badge };
    } catch (error) {
        console.error(`Error checking badge ${badge.slug}:`, error);
        return { awarded: false, error: String(error), badge };
    }
}

/**
 * Evaluate if criteria is met based on action and metadata
 */
async function evaluateCriteria(
    userId: string,
    criteria: any,
    metadata: BadgeMetadata
): Promise<boolean> {
    const { action, count, period } = criteria;

    switch (action) {
        case 'create_wishlist':
            return await checkWishlistCount(userId, count || 1);

        case 'purchase_gift':
            return await checkPurchaseCount(userId, count || 1);

        case 'follow':
            return await checkFollowCount(userId, count || 1);

        case 'seller_sales':
            return await checkSellerSales(userId, count || 1);

        case 'top_wishlist':
            return await checkTopWishlist(userId, period);

        default:
            return false;
    }
}

/**
 * Check if user has created enough wishlists
 */
async function checkWishlistCount(userId: string, requiredCount: number): Promise<boolean> {
    const { count } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId);

    return (count || 0) >= requiredCount;
}

/**
 * Check if user has purchased enough gifts
 */
async function checkPurchaseCount(userId: string, requiredCount: number): Promise<boolean> {
    const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('buyer_id', userId)
        .in('status', ['confirmed', 'shipped', 'delivered']);

    return (count || 0) >= requiredCount;
}

/**
 * Check if user follows enough people
 */
async function checkFollowCount(userId: string, requiredCount: number): Promise<boolean> {
    const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

    return (count || 0) >= requiredCount;
}

/**
 * Check if seller has completed enough sales
 */
async function checkSellerSales(userId: string, requiredCount: number): Promise<boolean> {
    // First get seller ID
    const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (!seller) return false;

    const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', seller.id)
        .eq('status', 'delivered');

    return (count || 0) >= requiredCount;
}

/**
 * Check if user has top wishlist of the period
 */
async function checkTopWishlist(userId: string, period?: string): Promise<boolean> {
    // Get user's wishlists
    const { data: wishlists } = await supabase
        .from('wishlists')
        .select('id, view_count')
        .eq('owner_id', userId)
        .order('view_count', { ascending: false })
        .limit(1);

    if (!wishlists || wishlists.length === 0) return false;

    const userTopViews = wishlists[0].view_count;

    // Get global top wishlist
    const { data: globalTop } = await supabase
        .from('wishlists')
        .select('view_count')
        .order('view_count', { ascending: false })
        .limit(1);

    if (!globalTop || globalTop.length === 0) return false;

    // User must have at least 80% of top views to qualify
    return userTopViews >= globalTop[0].view_count * 0.8;
}

/**
 * Award points to user and create transaction record
 */
async function awardPoints(
    userId: string,
    points: number,
    source: string
): Promise<void> {
    try {
        // Update profile points
        const { data: profile } = await supabase
            .from('profiles')
            .select('points, level')
            .eq('id', userId)
            .single();

        if (!profile) return;

        const newPoints = profile.points + points;
        const newLevel = calculateLevel(newPoints);

        await supabase
            .from('profiles')
            .update({
                points: newPoints,
                level: newLevel,
            })
            .eq('id', userId);

        // Create transaction record
        await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                type: 'earn',
                amount: points,
                source,
                description: `Earned ${points} points from ${source}`,
            });
    } catch (error) {
        console.error('Error awarding points:', error);
    }
}

/**
 * Calculate level based on total points
 * Formula: Level = floor(sqrt(points / 100)) + 1
 */
function calculateLevel(points: number): number {
    return Math.floor(Math.sqrt(points / 100)) + 1;
}

/**
 * Get points required for next level
 */
export function getPointsForNextLevel(currentLevel: number): number {
    return (currentLevel) ** 2 * 100;
}

/**
 * Get progress percentage to next level
 */
export function getLevelProgress(currentPoints: number, currentLevel: number): number {
    const currentLevelPoints = (currentLevel - 1) ** 2 * 100;
    const nextLevelPoints = getPointsForNextLevel(currentLevel);
    const pointsInLevel = currentPoints - currentLevelPoints;
    const pointsNeeded = nextLevelPoints - currentLevelPoints;

    return Math.min(100, Math.max(0, (pointsInLevel / pointsNeeded) * 100));
}
