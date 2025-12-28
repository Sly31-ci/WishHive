/**
 * Script de test d'inscription
 * Vérifie que la création de compte crée bien un profil utilisateur
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variables d\'environnement manquantes!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRegistration() {
    const timestamp = Date.now();
    const email = `wishhive.test.${timestamp}@gmail.com`;
    const password = 'password123';
    const username = `user_${timestamp}`;

    console.log('🧪 Test d\'inscription...');
    console.log(`   Email: ${email}`);
    console.log(`   Username: ${username}`);
    console.log('');

    try {
        // 1. Créer l'utilisateur
        console.log('1️⃣ Tentative de création de compte...');
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
                }
            }
        });

        if (authError) {
            console.error('❌ Échec de l\'inscription:', authError.message);
            return false;
        }

        const userId = authData.user?.id;
        console.log('✅ Compte Auth créé avec succès');
        console.log(`   ID: ${userId}`);

        if (!userId) {
            console.error('❌ Pas d\'ID utilisateur retourné');
            return false;
        }

        // 2. Vérifier le profil (attendre un peu que le trigger s'exécute)
        console.log('\n2️⃣ Vérification de la création du profil (Trigger)...');
        console.log('   Attente de 2 secondes...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId);

        if (profileError) {
            console.error('❌ Erreur SQL:', profileError.message);
            return false;
        }

        if (profiles && profiles.length > 0) {
            const profile = profiles[0];
            console.log('✅ Profil trouvé !');
            console.log('   Username:', profile.username);
            console.log('   Points:', profile.points);
            console.log('   Level:', profile.level);
            console.log('\n🎉 SUCCÈS : Le correctif fonctionne !');
            return true;
        } else {
            console.error('❌ Profil introuvable (Tableau vide)');
            console.error('⚠️  La migration n\'a probablement PAS été appliquée.');
            console.error('👉 Veuillez exécuter le script SQL dans Supabase Dashboard.');
            return false;
        }

    } catch (error) {
        console.error('❌ Erreur inattendue:', error.message);
        return false;
    }
}

testRegistration();
