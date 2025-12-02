import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Badge {
    id: string;
    slug: string;
    name: string;
    description?: string;
    icon_url?: string;
    criteria: any;
    points_reward: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface UserBadge extends Badge {
    earned_at: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    type: 'earn' | 'spend' | 'refund';
    amount: number;
    source: string;
    reference_id?: string;
    description?: string;
    created_at: string;
}

export function useGamification() {
    const { user } = useAuth();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('points, level')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            if (data) {
                setPoints(data.points);
                setLevel(data.level);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const fetchBadges = async () => {
        try {
            const { data, error } = await supabase
                .from('badges')
                .select('*')
                .order('tier', { ascending: true });

            if (error) throw error;
            setBadges(data || []);
        } catch (err) {
            console.error('Error fetching badges:', err);
        }
    };

    const fetchUserBadges = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_badges')
                .select(`
          *,
          badge:badges(*)
        `)
                .eq('user_id', user.id)
                .order('earned_at', { ascending: false });

            if (error) throw error;
            setUserBadges(data?.map((ub: any) => ({ ...ub.badge, earned_at: ub.earned_at })) || []);
        } catch (err) {
            console.error('Error fetching user badges:', err);
        }
    };

    const fetchTransactions = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            setTransactions(data || []);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        }
    };

    const awardPoints = async (amount: number, source: string, description: string, referenceId?: string) => {
        if (!user) throw new Error('User not authenticated');

        try {
            // Create transaction
            const { error: txError } = await supabase
                .from('transactions')
                .insert([{
                    user_id: user.id,
                    type: 'earn',
                    amount,
                    source,
                    description,
                    reference_id: referenceId,
                }]);

            if (txError) throw txError;

            // Update profile points
            const { error: profileError } = await supabase.rpc('increment_points', {
                user_id: user.id,
                points_to_add: amount,
            });

            if (profileError) throw profileError;

            await fetchProfile();
            await fetchTransactions();
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const checkAndAwardBadge = async (badgeSlug: string) => {
        if (!user) return;

        try {
            // Check if user already has this badge
            const { data: existing } = await supabase
                .from('user_badges')
                .select('id')
                .eq('user_id', user.id)
                .eq('badge_id', (await supabase.from('badges').select('id').eq('slug', badgeSlug).single()).data?.id)
                .single();

            if (existing) return; // Already has badge

            // Get badge details
            const { data: badge, error: badgeError } = await supabase
                .from('badges')
                .select('*')
                .eq('slug', badgeSlug)
                .single();

            if (badgeError || !badge) return;

            // Award badge
            const { error: awardError } = await supabase
                .from('user_badges')
                .insert([{
                    user_id: user.id,
                    badge_id: badge.id,
                }]);

            if (awardError) throw awardError;

            // Award points
            if (badge.points_reward > 0) {
                await awardPoints(badge.points_reward, 'badge_earned', `Earned ${badge.name} badge`, badge.id);
            }

            await fetchUserBadges();
        } catch (err) {
            console.error('Error awarding badge:', err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchProfile(),
                fetchBadges(),
                fetchUserBadges(),
                fetchTransactions(),
            ]);
            setLoading(false);
        };

        loadData();
    }, [user]);

    return {
        badges,
        userBadges,
        transactions,
        points,
        level,
        loading,
        awardPoints,
        checkAndAwardBadge,
        refetch: async () => {
            await fetchProfile();
            await fetchUserBadges();
            await fetchTransactions();
        },
    };
}
