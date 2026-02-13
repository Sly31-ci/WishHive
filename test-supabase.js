const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://localhost:8000';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY4OTE1NzMxLCJleHAiOjIwODQyNzU3MzF9.hngs38z7DMyaERLwxNEl0x-u8ThSJgZMKt_4dPl0ug8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('🔍 Test de connexion à Supabase Local...\n');
    console.log('URL:', supabaseUrl);
    console.log('');

    // Test 1: Récupérer les profils
    console.log('📋 Test 1: Récupération des profils');
    const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*');

    if (usersError) {
        console.error('❌ Erreur:', usersError.message);
        console.error('   Code:', usersError.code);
        console.error('   Détails:', usersError.details);
    } else {
        console.log('✅ Succès! Utilisateurs trouvés:', users.length);
        if (users.length > 0) {
            console.log('   Premier profil:', users[0].username);
        }
    }

    console.log('');

    // Test 2: Récupérer les wishlists
    console.log('📋 Test 2: Récupération des wishlists');
    const { data: wishlists, error: wishlistsError } = await supabase
        .from('wishlists')
        .select('*');

    if (wishlistsError) {
        console.error('❌ Erreur:', wishlistsError.message);
        console.error('   Code:', wishlistsError.code);
    } else {
        console.log('✅ Succès! Wishlists trouvées:', wishlists.length);
        if (wishlists.length > 0) {
            console.log('   Première wishlist:', wishlists[0].title);
        }
    }

    console.log('');

    // Test 3: Récupérer les items
    console.log('📋 Test 3: Récupération des items de wishlist');
    const { data: items, error: itemsError } = await supabase
        .from('wishlist_items')
        .select('*');

    if (itemsError) {
        console.error('❌ Erreur:', itemsError.message);
        console.error('   Code:', itemsError.code);
    } else {
        console.log('✅ Succès! Items trouvés:', items.length);
        if (items.length > 0) {
            console.log('   Premier item:', items[0].custom_title || 'Sans titre');
        }
    }

    console.log('');

    // Test 4: Test de requête avec jointure
    console.log('📋 Test 4: Requête avec jointure (wishlists + items)');
    const { data: wishlistsWithItems, error: joinError } = await supabase
        .from('wishlists')
        .select(`
      *,
      wishlist_items (*)
    `);

    if (joinError) {
        console.error('❌ Erreur:', joinError.message);
    } else {
        console.log('✅ Succès! Wishlists avec items:', wishlistsWithItems.length);
        if (wishlistsWithItems.length > 0 && wishlistsWithItems[0].wishlist_items) {
            console.log('   Items dans la première wishlist:', wishlistsWithItems[0].wishlist_items.length);
        }
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('🎉 Tests terminés!');
    console.log('='.repeat(60));

    // Résumé
    const allSuccess = !usersError && !wishlistsError && !itemsError && !joinError;

    if (allSuccess) {
        console.log('\n✅ Tous les tests ont réussi!');
        console.log('   Votre connexion à Supabase Local fonctionne parfaitement.');
        console.log('\n📚 Prochaines étapes:');
        console.log('   1. Créez le schéma de base de données (voir QUICKSTART_SUPABASE.md)');
        console.log('   2. Configurez l\'authentification dans votre application');
        console.log('   3. Commencez à développer vos fonctionnalités!');
    } else {
        console.log('\n⚠️  Certains tests ont échoué.');
        console.log('   Vérifiez que:');
        console.log('   1. Supabase est bien démarré (docker compose ps)');
        console.log('   2. Le schéma de base de données est créé');
        console.log('   3. Les tables existent dans Supabase Studio');
    }

    console.log('');
}

// Exécuter les tests
testConnection().catch(error => {
    console.error('\n❌ Erreur fatale:', error.message);
    console.error('\nVérifiez que Supabase est bien démarré:');
    console.error('  cd ~/projects/supabase-local/supabase/docker');
    console.error('  docker compose ps');
    process.exit(1);
});
