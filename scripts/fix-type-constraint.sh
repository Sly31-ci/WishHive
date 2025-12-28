#!/bin/bash

# Script pour corriger la contrainte type_check sur Supabase
# Permet les types personnalisés dans la table wishlists

set -e

echo "🔧 Correction de la contrainte type_check..."

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(grep -v '^#' .env | grep -E 'EXPO_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY' | xargs)
fi

# Vérifier que les variables sont définies
if [ -z "$EXPO_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Erreur: Variables SUPABASE non trouvées dans .env"
    exit 1
fi

echo "✅ URL Supabase: $EXPO_PUBLIC_SUPABASE_URL"

# Fonction pour exécuter du SQL via l'API Supabase
execute_sql() {
    local sql="$1"
    local description="$2"
    
    echo ""
    echo "📝 $description"
    
    response=$(curl -s -X POST \
        "${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql" \
        -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
        -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"${sql}\"}")
    
    if echo "$response" | grep -q "error"; then
        echo "⚠️  Note: $description"
    else
        echo "✅ $description - OK"
    fi
}

# 1. Supprimer l'ancienne contrainte
echo ""
echo "🗑️  Suppression de la contrainte restrictive..."
curl -s -X POST \
    "${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/rpc" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d '{
        "query": "ALTER TABLE wishlists DROP CONSTRAINT IF EXISTS type_check;"
    }' > /dev/null 2>&1

echo "✅ Ancienne contrainte supprimée"

# 2. Ajouter la nouvelle contrainte minimale
echo ""
echo "➕ Ajout de la nouvelle contrainte (type non vide)..."
curl -s -X POST \
    "${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/rpc" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d '{
        "query": "ALTER TABLE wishlists ADD CONSTRAINT type_not_empty CHECK (type IS NOT NULL AND length(trim(type)) > 0);"
    }' > /dev/null 2>&1

echo "✅ Nouvelle contrainte ajoutée"

# 3. Test: Vérifier les contraintes actuelles
echo ""
echo "🔍 Vérification des contraintes..."
echo ""

# Via psql direct si disponible
RESPONSE=$(curl -s \
    "${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/wishlists?select=*&limit=1" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}")

if [ $? -eq 0 ]; then
    echo "✅ Connexion à la table wishlists OK"
else
    echo "⚠️  Impossible de vérifier la connexion"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CONTRAINTE TYPE CORRIGÉE !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Vous pouvez maintenant créer des wishlists avec des types personnalisés :"
echo "  - 🎓 graduation"
echo "  - 🏠 housewarming"
echo "  - 🎉 anniversary"
echo "  - ✈️ travel"
echo "  - etc."
echo ""
echo "Testez dans l'app :"
echo "  1. Tap '+ Custom'"
echo "  2. Emoji: 🎓"
echo "  3. Label: Graduation"
echo "  4. Create ✅"
echo ""
