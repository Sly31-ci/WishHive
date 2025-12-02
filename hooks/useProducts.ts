import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Product {
    id: string;
    seller_id: string;
    title: string;
    description?: string;
    price: number;
    currency: string;
    images?: string[];
    sku?: string;
    variations?: any[];
    external_url?: string;
    stock_count: number;
    is_active: boolean;
    created_at: string;
    seller?: {
        shop_name: string;
        logo_url?: string;
    };
}

export function useProducts(filters?: { search?: string; sellerId?: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('products')
                .select(`
          *,
          seller:sellers(shop_name, logo_url)
        `)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (filters?.sellerId) {
                query = query.eq('seller_id', filters.sellerId);
            }

            if (filters?.search) {
                query = query.textSearch('title', filters.search);
            }

            const { data, error } = await query;

            if (error) throw error;
            setProducts(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getProduct = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          seller:sellers(shop_name, logo_url, description)
        `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters?.search, filters?.sellerId]);

    return {
        products,
        loading,
        error,
        getProduct,
        refetch: fetchProducts,
    };
}
