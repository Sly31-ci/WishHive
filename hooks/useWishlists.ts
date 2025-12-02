import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Wishlist {
    id: string;
    owner_id: string;
    title: string;
    description?: string;
    type: string;
    privacy: 'public' | 'private' | 'code_only';
    access_code?: string;
    theme?: any;
    due_date?: string;
    is_active: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
}

export function useWishlists() {
    const { user } = useAuth();
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWishlists = async () => {
        if (!user) {
            setWishlists([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('wishlists')
                .select('*')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWishlists(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createWishlist = async (wishlistData: Partial<Wishlist>) => {
        if (!user) throw new Error('User not authenticated');

        try {
            const { data, error } = await supabase
                .from('wishlists')
                .insert([{ ...wishlistData, owner_id: user.id }])
                .select()
                .single();

            if (error) throw error;

            await fetchWishlists();
            return data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const updateWishlist = async (id: string, updates: Partial<Wishlist>) => {
        try {
            const { error } = await supabase
                .from('wishlists')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            await fetchWishlists();
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const deleteWishlist = async (id: string) => {
        try {
            const { error } = await supabase
                .from('wishlists')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchWishlists();
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    useEffect(() => {
        fetchWishlists();
    }, [user]);

    return {
        wishlists,
        loading,
        error,
        createWishlist,
        updateWishlist,
        deleteWishlist,
        refetch: fetchWishlists,
    };
}
