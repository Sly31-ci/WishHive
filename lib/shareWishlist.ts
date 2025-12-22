import { Share, Alert } from 'react-native';
import { supabase } from './supabase';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

/**
 * Partage une wishlist via le système de partage natif
 */
export async function shareWishlist(wishlistId: string, wishlistTitle: string): Promise<string | null> {
    try {
        // Get wishlist slug
        const { data: wishlist, error } = await supabase
            .from('wishlists')
            .select('slug, privacy')
            .eq('id', wishlistId)
            .single();

        if (error || !wishlist) {
            throw new Error('Wishlist not found');
        }

        // Check if wishlist is public
        if (wishlist.privacy !== 'public') {
            Alert.alert(
                'Wishlist privée',
                'Vous devez rendre votre wishlist publique avant de la partager.',
                [{ text: 'OK' }]
            );
            return null;
        }

        // Generate share link
        const shareLink = `https://wishhive.app/w/${wishlist.slug}`;

        // Haptic feedback
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Native share
        const result = await Share.share({
            message: `Découvre ma wishlist "${wishlistTitle}" sur WishHive ! 🎁\n\n${shareLink}`,
            url: shareLink, // iOS only
            title: wishlistTitle
        });

        // Track share event if shared successfully
        if (result.action === Share.sharedAction) {
            await trackShareEvent(wishlistId);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        return shareLink;
    } catch (error) {
        console.error('Error sharing wishlist:', error);
        Alert.alert('Erreur', 'Impossible de partager la wishlist');
        return null;
    }
}

/**
 * Copie le lien de partage dans le presse-papiers
 */
export async function copyShareLink(wishlistId: string): Promise<string | null> {
    try {
        const { data: wishlist } = await supabase
            .from('wishlists')
            .select('slug, privacy')
            .eq('id', wishlistId)
            .single();

        if (!wishlist || wishlist.privacy !== 'public') {
            Alert.alert('Erreur', 'Cette wishlist n\'est pas publique');
            return null;
        }

        const shareLink = `https://wishhive.app/w/${wishlist.slug}`;

        // Copy to clipboard (requires expo-clipboard)
        await Clipboard.setStringAsync(shareLink);

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Copié !', 'Le lien a été copié dans le presse-papiers');

        return shareLink;
    } catch (error) {
        console.error('Error copying link:', error);
        return null;
    }
}

/**
 * Génère un QR code pour la wishlist
 */
export async function generateQRCode(wishlistId: string): Promise<string | null> {
    try {
        const { data: wishlist } = await supabase
            .from('wishlists')
            .select('slug')
            .eq('id', wishlistId)
            .single();

        if (!wishlist) return null;

        const shareLink = `https://wishhive.app/w/${wishlist.slug}`;

        // Generate QR code URL using a service like qr-code-generator
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareLink)}`;

        return qrCodeUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
}

/**
 * Track share event for analytics
 */
async function trackShareEvent(wishlistId: string): Promise<void> {
    try {
        await (supabase
            .from('wishlist_shares')
            .insert({
                wishlist_id: wishlistId,
                shared_at: new Date().toISOString()
            }));
    } catch (error) {
        console.error('Error tracking share event:', error);
        // Don't throw - this is just analytics
    }
}

/**
 * Get share statistics for a wishlist
 */
export async function getShareStats(wishlistId: string): Promise<{
    shareCount: number;
    viewCount: number;
} | null> {
    try {
        // Get share count
        const { count: shareCount } = await (supabase
            .from('wishlist_shares')
            .select('*', { count: 'exact', head: true })
            .eq('wishlist_id', wishlistId));

        // Get view count from wishlist
        const { data: wishlist } = await supabase
            .from('wishlists')
            .select('view_count')
            .eq('id', wishlistId)
            .single();

        return {
            shareCount: shareCount || 0,
            viewCount: wishlist?.view_count || 0
        };
    } catch (error) {
        console.error('Error getting share stats:', error);
        return null;
    }
}
