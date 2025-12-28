const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this to .env

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.log('Please add SUPABASE_SERVICE_ROLE_KEY to your .env file');
    console.log('You can find it in: Supabase Dashboard > Settings > API > service_role key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createUsers() {
    console.log('🚀 Creating test users...\n');

    // User 1: Standard User
    console.log('Creating standard user...');
    const { data: user1, error: error1 } = await supabase.auth.admin.createUser({
        email: 'user@wishhive.app',
        password: 'WishHive2024!',
        email_confirm: true,
        user_metadata: {
            username: 'demo_user'
        }
    });

    if (error1) {
        console.error('❌ Error creating user:', error1.message);
    } else {
        console.log('✅ Standard user created:', user1.user.email);
        console.log('   User ID:', user1.user.id);
    }

    // User 2: Seller
    console.log('\nCreating seller user...');
    const { data: user2, error: error2 } = await supabase.auth.admin.createUser({
        email: 'seller@wishhive.app',
        password: 'WishHive2024!',
        email_confirm: true,
        user_metadata: {
            username: 'demo_seller'
        }
    });

    if (error2) {
        console.error('❌ Error creating seller:', error2.message);
    } else {
        console.log('✅ Seller user created:', user2.user.email);
        console.log('   User ID:', user2.user.id);

        // Create seller record
        console.log('\nCreating seller record...');
        const { data: seller, error: sellerError } = await supabase
            .from('sellers')
            .insert({
                user_id: user2.user.id,
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
            console.log('✅ Seller record created:', seller.shop_name);
        }
    }

    console.log('\n✨ User creation complete!\n');
    console.log('📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Standard User:');
    console.log('  Email: user@wishhive.app');
    console.log('  Password: WishHive2024!');
    console.log('');
    console.log('Seller:');
    console.log('  Email: seller@wishhive.app');
    console.log('  Password: WishHive2024!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

createUsers().catch(console.error);
