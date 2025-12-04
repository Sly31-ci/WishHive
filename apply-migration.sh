#!/bin/bash

# Script pour appliquer la migration de correction du profil
# Ce script applique la migration directement via l'API Supabase

echo "🔧 Application de la migration de correction du profil..."
echo ""

# Lire le fichier SQL
MIGRATION_SQL=$(cat supabase/migrations/20251204000000_fix_profile_creation.sql)

# Charger les variables d'environnement
source .env

# Afficher les informations
echo "📊 Informations:"
echo "   URL: $EXPO_PUBLIC_SUPABASE_URL"
echo ""

# Instructions pour l'utilisateur
echo "⚠️  IMPORTANT: Cette migration doit être appliquée via l'interface Supabase"
echo ""
echo "📝 Étapes à suivre:"
echo ""
echo "1. Ouvrez votre dashboard Supabase:"
echo "   https://supabase.com/dashboard/project/nydtsqjlbiwuoakqrldr"
echo ""
echo "2. Allez dans 'SQL Editor' (dans le menu de gauche)"
echo ""
echo "3. Créez une nouvelle requête et collez le contenu de:"
echo "   supabase/migrations/20251204000000_fix_profile_creation.sql"
echo ""
echo "4. Exécutez la requête (bouton 'Run' ou Ctrl+Enter)"
echo ""
echo "5. Vérifiez qu'il n'y a pas d'erreurs"
echo ""
echo "✅ Une fois la migration appliquée, réessayez de créer un compte!"
echo ""
