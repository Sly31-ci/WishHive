/**
 * Script de migration Supabase Cloud → Supabase Local
 * 
 * Ce script migre toutes les données de votre instance Supabase Cloud
 * vers votre instance Supabase Local.
 * 
 * Usage:
 *   1. Créez un fichier .env.migration avec vos clés
 *   2. Exécutez: node scripts/migrate-supabase-data.js
 */

require('dotenv').config({ path: '.env.migration' });
const { createClient } = require('@supabase/supabase-js');

// Configuration
const CLOUD_URL = process.env.CLOUD_SUPABASE_URL;
const CLOUD_KEY = process.env.CLOUD_SUPABASE_SERVICE_KEY;
const LOCAL_URL = process.env.LOCAL_SUPABASE_URL || 'http://localhost:8000';
const LOCAL_KEY = process.env.LOCAL_SUPABASE_SERVICE_KEY;

// Tables à migrer (dans l'ordre pour respecter les contraintes de clés étrangères)
const TABLES_TO_MIGRATE = [
    // 'users', // Skip public.users (does not exist), handled via Auth Admin

    // Core tables (no dependencies)
    'profiles',
    'badges',
    'public_themes',

    // Seller/Product chain
    'sellers', // depends on profiles
    'products', // depends on sellers

    // Wishlist chain
    'wishlists', // depends on profiles
    'wishlist_items', // depends on wishlists + products
    'wishlist_interactions', // depends on wishlists

    // Order chain
    'orders', // depends on profiles, sellers, products, wishlist_items
    'purchase_verifications', // depends on orders

    // Social features
    'follows', // depends on profiles
    'reactions', // depends on profiles + wishlists

    // Gamification
    'transactions', // depends on profiles
    'user_badges', // depends on profiles + badges
    'referrals', // depends on profiles

    // Communication
    'notifications', // depends on profiles
    'chat_messages', // depends on profiles (if chat exists)
    'chat_reactions', // depends on chat_messages
];

// Créer les clients Supabase
const cloudSupabase = createClient(CLOUD_URL, CLOUD_KEY);
const localSupabase = createClient(LOCAL_URL, LOCAL_KEY);

// Statistiques
const stats = {
    totalTables: 0,
    totalRecords: 0,
    successfulTables: 0,
    failedTables: 0,
    errors: [],
};

/**
 * Migrer les utilisateurs (Auth)
 */
async function migrateAuthUsers() {
    console.log(`\n📋 Migration des utilisateurs (Auth)`);
    console.log('─'.repeat(60));

    try {
        console.log(`  ⬇️  Récupération des utilisateurs depuis le cloud...`);

        let allUsers = [];
        let page = 1;
        const perPage = 50;

        // Paginate through users
        while (true) {
            const { data: { users }, error } = await cloudSupabase.auth.admin.listUsers({
                page: page,
                perPage: perPage
            });

            if (error) throw error;
            if (!users || users.length === 0) break;

            allUsers = [...allUsers, ...users];
            page++;
        }

        console.log(`  ✓ ${allUsers.length} utilisateurs récupérés`);
        console.log(`  ⬆️  Insertion des utilisateurs dans la base locale...`);

        let createdCount = 0;
        let skippedCount = 0;

        for (const user of allUsers) {
            try {
                // Check if user exists
                const { data: { user: existingUser }, error: getError } = await localSupabase.auth.admin.getUserById(user.id);

                if (existingUser) {
                    skippedCount++;
                    continue;
                }

                // Create user in local auth
                // Note: We cannot migrate the password hash via API.
                // We set a temporary password or users must reset it.
                const { error: createError } = await localSupabase.auth.admin.createUser({
                    id: user.id, // KEEP THE SAME ID
                    email: user.email,
                    password: 'password123', // Default temporary password
                    email_confirm: true,
                    user_metadata: user.user_metadata
                });

                if (createError) {
                    // Ignore if already exists (safe check)
                    if (!createError.message.includes('already registered')) {
                        console.warn(`  ⚠️  Erreur création user ${user.email}: ${createError.message}`);
                    } else {
                        skippedCount++;
                    }
                } else {
                    createdCount++;
                }

            } catch (uErr) {
                console.warn(`  ⚠️  Erreur traitement user ${user.email}: ${uErr.message}`);
            }

            process.stdout.write(`\r  traités: ${createdCount + skippedCount}/${allUsers.length}`);
        }

        console.log(`\n  ✅ Auth Users terminé: ${createdCount} créés, ${skippedCount} existants`);

    } catch (error) {
        console.error(`  ❌ Erreur migration Auth: ${error.message}`);
        throw error;
    }
}

/**
 * Migrer une table
 */
async function migrateTable(tableName) {
    console.log(`\n📋 Migration de la table: ${tableName}`);
    console.log('─'.repeat(60));

    try {
        // 1. Récupérer toutes les données de la table cloud
        console.log(`  ⬇️  Récupération des données depuis le cloud...`);
        const { data: cloudData, error: fetchError } = await cloudSupabase
            .from(tableName)
            .select('*');

        if (fetchError) {
            // Check if error is because table doesn't exist
            if (fetchError.code === '42P01') {
                console.log(`  ℹ️  Table ${tableName} n'existe pas sur le cloud (ignorée)`);
                return;
            }
            throw new Error(`Erreur lors de la récupération: ${fetchError.message}`);
        }

        if (!cloudData || cloudData.length === 0) {
            console.log(`  ℹ️  Table vide, aucune donnée à migrer`);
            stats.successfulTables++;
            return;
        }

        console.log(`  ✓ ${cloudData.length} enregistrements récupérés`);

        // 2. Supprimer les données existantes dans la table locale (optionnel)
        console.log(`  🗑️  Nettoyage de la table locale...`);
        const { error: deleteError } = await localSupabase
            .from(tableName)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Supprimer tout sauf un ID impossible

        if (deleteError && !deleteError.message.includes('0 rows')) {
            console.warn(`  ⚠️  Avertissement lors du nettoyage: ${deleteError.message}`);
        }

        // 3. Insérer les données dans la table locale
        console.log(`  ⬆️  Insertion des données dans la base locale...`);

        // Insérer par lots de 100 pour éviter les timeouts
        const batchSize = 100;
        let inserted = 0;

        for (let i = 0; i < cloudData.length; i += batchSize) {
            const batch = cloudData.slice(i, i + batchSize);

            const { error: insertError } = await localSupabase
                .from(tableName)
                .insert(batch);

            if (insertError) {
                // If it's a foreign key violation, it might be due to missing parent data (e.g. users)
                // or wrong order. We log critical info.
                throw new Error(`Erreur lors de l'insertion du lot ${i / batchSize + 1}: ${insertError.message}`);
            }

            inserted += batch.length;
            process.stdout.write(`\r  ⬆️  Insertion: ${inserted}/${cloudData.length} enregistrements`);
        }

        console.log(`\n  ✅ Migration réussie: ${cloudData.length} enregistrements`);
        stats.successfulTables++;
        stats.totalRecords += cloudData.length;

    } catch (error) {
        console.error(`  ❌ Erreur: ${error.message}`);
        stats.failedTables++;
        stats.errors.push({ table: tableName, error: error.message });
    }
}

/**
 * Vérifier la connexion aux deux instances
 */
async function checkConnections() {
    console.log('\n🔍 Vérification des connexions...\n');

    // Vérifier Supabase Cloud
    console.log('  ☁️  Supabase Cloud...');
    try {
        // We use profiles to check public schema access
        const { data, error } = await cloudSupabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist
            // Try Auth check as backup
            const { data: uData, error: uError } = await cloudSupabase.auth.admin.listUsers({ page: 1, perPage: 1 });
            if (uError) throw uError;
        }
        console.log('  ✅ Connexion Cloud OK');
    } catch (error) {
        console.error('  ❌ Erreur de connexion Cloud:', error.message);
        console.error('\n⚠️  Vérifiez vos credentials Supabase Cloud dans .env.migration');
        process.exit(1);
    }

    // Vérifier Supabase Local
    console.log('  🏠 Supabase Local...');
    try {
        const { data, error } = await localSupabase.from('profiles').select('count', { count: 'exact', head: true });
        // Even if table empty or error, verify connection via Auth
        const { data: uData, error: uError } = await localSupabase.auth.admin.listUsers({ page: 1, perPage: 1 });
        if (uError) throw uError;

        console.log('  ✅ Connexion Local OK');
    } catch (error) {
        console.error('  ❌ Erreur de connexion Local:', error.message);
        console.error('\n⚠️  Vérifiez que Supabase Local est démarré et accessible');
        process.exit(1);
    }

    console.log('\n✅ Toutes les connexions sont OK!\n');
}

/**
 * Afficher le résumé final
 */
function displaySummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE LA MIGRATION');
    console.log('='.repeat(60));
    console.log(`\n  Tables traitées:     ${stats.totalTables}`);
    console.log(`  Tables réussies:     ${stats.successfulTables} ✅`);
    console.log(`  Tables échouées:     ${stats.failedTables} ❌`);
    console.log(`  Total enregistrements: ${stats.totalRecords}`);

    if (stats.errors.length > 0) {
        console.log('\n  ⚠️  Erreurs rencontrées:');
        stats.errors.forEach(({ table, error }) => {
            console.log(`    - ${table}: ${error}`);
        });
    }

    console.log('\n' + '='.repeat(60));

    if (stats.failedTables === 0) {
        console.log('\n🎉 Migration terminée avec succès!');
        console.log('\n📝 Prochaines étapes:');
        console.log('  1. Vérifiez les données dans Supabase Studio (http://localhost:3000)');
        console.log('  2. Testez votre application avec: node test-supabase.js');
        console.log('  3. Vérifiez que toutes les fonctionnalités marchent');
    } else {
        console.log('\n⚠️  La migration a rencontré des erreurs.');
        console.log('  Consultez les erreurs ci-dessus et réessayez.');
    }

    console.log('');
}

/**
 * Fonction principale
 */
async function main() {
    console.log('╔' + '═'.repeat(58) + '╗');
    console.log('║' + ' '.repeat(58) + '║');
    console.log('║' + '  🔄 MIGRATION SUPABASE CLOUD → LOCAL'.padEnd(59) + '║');
    console.log('║' + ' '.repeat(58) + '║');
    console.log('╚' + '═'.repeat(58) + '╝');

    // Vérifier les variables d'environnement
    if (!CLOUD_URL || !CLOUD_KEY) {
        console.error('\n❌ Erreur: Variables d\'environnement manquantes');
        process.exit(1);
    }

    if (!LOCAL_KEY) {
        console.error('\n❌ Erreur: LOCAL_SUPABASE_SERVICE_KEY manquante');
        process.exit(1);
    }

    // Vérifier les connexions
    await checkConnections();

    // Demander confirmation
    console.log('⚠️  ATTENTION: Cette opération va:');
    console.log('  1. Migrer les comptes utilisateurs (Password reset sera nécessaire)');
    console.log('  2. Supprimer les données existantes dans les tables locales');
    console.log('  3. Importer toutes les données depuis Supabase Cloud');
    console.log('');
    console.log('  Tables à migrer:', TABLES_TO_MIGRATE.join(', '));
    console.log('');

    // Note: En production, vous voudriez ajouter une confirmation interactive
    // Pour l'instant, on continue automatiquement après 3 secondes
    console.log('⏳ Démarrage dans 3 secondes... (Ctrl+C pour annuler)');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 0. Migrer Auth
    await migrateAuthUsers();

    // Migrer chaque table
    stats.totalTables = TABLES_TO_MIGRATE.length;

    for (const tableName of TABLES_TO_MIGRATE) {
        await migrateTable(tableName);
    }

    // Afficher le résumé
    displaySummary();
}

// Exécuter le script
main().catch(error => {
    console.error('\n❌ Erreur fatale:', error.message);
    console.error(error.stack);
    process.exit(1);
});
