
import { createClient } from '@supabase/supabase-js';
import { Database } from './types/database';

const supabase = createClient<Database>('', '');

async function test() {
    // Test 1: Check if wishlist_items is recognized
    const { data, error } = await supabase.from('wishlist_items').select('*');

    // Test 2: Check insert type
    const { error: insertError } = await supabase.from('wishlist_items').insert({
        wishlist_id: '123',
        product_id: '456',
        priority: 'medium',
    });
}
