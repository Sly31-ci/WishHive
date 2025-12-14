import { supabase } from './supabase';
import { WishlistTheme } from '../constants/wishlistThemes';

/**
 * Sauvegarde le thème pour une wishlist
 */
export async function saveWishlistTheme(
    wishlistId: string,
    theme: WishlistTheme
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase
            .from('wishlists')
            .update({ theme })
            .eq('id', wishlistId);

        if (error) {
            console.error('Error saving wishlist theme:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error saving wishlist theme:', error);
        return { success: false, error: 'Une erreur est survenue' };
    }
}

/**
 * Récupère le thème d'une wishlist
 */
export async function getWishlistTheme(
    wishlistId: string
): Promise<{ theme: WishlistTheme | null; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('wishlists')
            .select('theme')
            .eq('id', wishlistId)
            .single();

        if (error) {
            console.error('Error getting wishlist theme:', error);
            return { theme: null, error: error.message };
        }

        return { theme: data.theme };
    } catch (error) {
        console.error('Error getting wishlist theme:', error);
        return { theme: null, error: 'Une erreur est survenue' };
    }
}

/**
 * Publie un thème comme template public
 */
export async function publishThemeAsPublic(
    userId: string,
    name: string,
    description: string,
    theme: WishlistTheme,
    tags: string[] = []
): Promise<{ success: boolean; themeId?: string; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('public_themes')
            .insert({
                creator_id: userId,
                name,
                description,
                theme,
                tags,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error publishing theme:', error);
            return { success: false, error: error.message };
        }

        return { success: true, themeId: data.id };
    } catch (error) {
        console.error('Error publishing theme:', error);
        return { success: false, error: 'Une erreur est survenue' };
    }
}

/**
 * Récupère les templates publics
 */
export async function getPublicThemes(
    filters?: { tags?: string[]; featured?: boolean }
): Promise<{ themes: any[]; error?: string }> {
    try {
        let query = supabase
            .from('public_themes')
            .select('*')
            .order('usage_count', { ascending: false });

        if (filters?.featured) {
            query = query.eq('is_featured', true);
        }

        if (filters?.tags && filters.tags.length > 0) {
            query = query.contains('tags', filters.tags);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error getting public themes:', error);
            return { themes: [], error: error.message };
        }

        return { themes: data || [] };
    } catch (error) {
        console.error('Error getting public themes:', error);
        return { themes: [], error: 'Une erreur est survenue' };
    }
}

/**
 * Incrémente le compteur d'utilisation d'un template public
 */
export async function incrementThemeUsage(themeId: string): Promise<void> {
    try {
        // Note: Cette fonction nécessite une fonction RPC côté Supabase
        // Pour l'instant, on fait une simple mise à jour
        const { data } = await supabase
            .from('public_themes')
            .select('usage_count')
            .eq('id', themeId)
            .single();

        if (data) {
            await supabase
                .from('public_themes')
                .update({ usage_count: (data.usage_count || 0) + 1 })
                .eq('id', themeId);
        }
    } catch (error) {
        console.error('Error incrementing theme usage:', error);
    }
}
