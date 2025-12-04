import { supabase } from './lib/supabase';

/**
 * Script de test de connexion à Supabase
 * Vérifie que la base de données est accessible et que les tables existent
 */

async function testSupabaseConnection() {
    console.log('🔍 Test de connexion à Supabase...\n');

    try {
        // Test 1: Connexion de base
        console.log('1️⃣ Test de connexion de base...');
        const { data: healthCheck, error: healthError } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);

        if (healthError) {
            console.error('❌ Erreur de connexion:', healthError.message);
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

        for (const table of tables) {
            const { error } = await supabase
                .from(table)
                .select('*')
                .limit(1);

            if (error) {
                console.log(`❌ Table "${table}": ${error.message}`);
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

        console.log('\n✅ Tous les tests sont passés avec succès!');
        console.log('🔗 URL Supabase:', process.env.EXPO_PUBLIC_SUPABASE_URL);

        return true;

    } catch (error) {
        console.error('❌ Erreur inattendue:', error);
        return false;
    }
}

// Exécuter le test
testSupabaseConnection()
    .then((success) => {
        if (!success) {
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error('❌ Erreur fatale:', error);
        process.exit(1);
    });
