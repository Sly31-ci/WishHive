/**
 * Test de connexion Supabase - Version Node.js simple
 * Ce script teste la connexion à Supabase sans dépendances React Native
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

async function testSupabaseConnection() {
    console.log('🔍 Test de connexion à Supabase...\n');
    console.log('🔗 URL:', supabaseUrl);
    console.log('');

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ Variables d\'environnement manquantes!');
        console.error('   Vérifiez EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY dans .env');
        return false;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
        // Test 1: Connexion de base
        console.log('1️⃣ Test de connexion de base...');
        const { data, error } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Erreur de connexion:', error.message);
            return false;
        }
        console.log('✅ Connexion établie\n');

        // Test 2: Vérification des tables
        console.log('2️⃣ Vérification des tables...');

        const tables = [
            'profiles',
            'wishlists',
            'products',
            'badges',
            'user_badges',
            'sellers',
            'wishlist_items'
        ];

        let allTablesOk = true;
        for (const table of tables) {
            const { error } = await supabase
                .from(table)
                .select('*')
                .limit(1);

            if (error) {
                console.log(`❌ Table "${table}": ${error.message}`);
                allTablesOk = false;
            } else {
                console.log(`✅ Table "${table}": OK`);
            }
        }

        console.log('\n3️⃣ Statistiques de la base de données:');

        // Compter les profils
        const { count: profileCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
        console.log(`   📊 Profils: ${profileCount || 0}`);

        // Compter les wishlists
        const { count: wishlistCount } = await supabase
            .from('wishlists')
            .select('*', { count: 'exact', head: true });
        console.log(`   📋 Wishlists: ${wishlistCount || 0}`);

        // Compter les produits
        const { count: productCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });
        console.log(`   🛍️  Produits: ${productCount || 0}`);

        // Compter les badges
        const { count: badgeCount } = await supabase
            .from('badges')
            .select('*', { count: 'exact', head: true });
        console.log(`   🏆 Badges: ${badgeCount || 0}`);

        // Compter les vendeurs
        const { count: sellerCount } = await supabase
            .from('sellers')
            .select('*', { count: 'exact', head: true });
        console.log(`   🏪 Vendeurs: ${sellerCount || 0}`);

        console.log('\n' + (allTablesOk ? '✅' : '⚠️') + ' Test terminé!');

        return allTablesOk;

    } catch (error) {
        console.error('❌ Erreur inattendue:', error.message);
        return false;
    }
}

// Exécuter le test
testSupabaseConnection()
    .then((success) => {
        process.exit(success ? 0 : 1);
    })
    .catch((error) => {
        console.error('❌ Erreur fatale:', error.message);
        process.exit(1);
    });
