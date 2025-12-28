const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createSellerRecord() {
    console.log('🏪 Creating seller record for seller@wishhive.app...\n');

    // Get the seller user ID
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error('❌ Error fetching users:', userError.message);
        return;
    }

    const sellerUser = users.find(u => u.email === 'seller@wishhive.app');

    if (!sellerUser) {
        console.error('❌ Seller user not found');
        return;
    }

    console.log('✅ Found seller user:', sellerUser.email);
    console.log('   User ID:', sellerUser.id);

    // Create seller record
    console.log('\nCreating seller record...');
    const { data: seller, error: sellerError } = await supabase
        .from('sellers')
        .insert({
            user_id: sellerUser.id,
            shop_name: 'Demo Shop',
            description: 'A demo shop for testing seller features',
            kyc_status: 'approved',
            is_active: true
        })
        .select()
        .single();

    if (sellerError) {
        console.error('❌ Error creating seller record:', sellerError.message);
    } else {
        console.log('✅ Seller record created successfully!');
        console.log('   Shop Name:', seller.shop_name);
        console.log('   KYC Status:', seller.kyc_status);
        console.log('\n🎉 Seller account is now fully configured!\n');
    }
}

createSellerRecord().catch(console.error);
