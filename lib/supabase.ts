import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Validation des variables d'environnement
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Configuration Supabase manquante!');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Défini' : '✗ Manquant');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Défini' : '✗ Manquant');
  throw new Error(
    'Les variables d\'environnement Supabase ne sont pas définies. ' +
    'Vérifiez que votre fichier .env contient EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY, ' +
    'puis redémarrez le serveur Expo avec: npx expo start -c'
  );
}

// Validation du format de l'URL
try {
  const url = new URL(supabaseUrl);
  if (!url.hostname.includes('supabase')) {
    console.warn('⚠️  L\'URL Supabase ne semble pas être une URL Supabase valide:', supabaseUrl);
  }
  console.log('✓ Configuration Supabase validée:', url.hostname);
} catch (error) {
  console.error('❌ URL Supabase invalide:', supabaseUrl);
  throw new Error('EXPO_PUBLIC_SUPABASE_URL n\'est pas une URL valide');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'wishhive-mobile',
    },
  },
});
