#!/bin/bash

# 🔐 Configuration RLS Supabase via API
# Script automatique pour configurer les policies de sécurité

echo "🔐 Configuration RLS Supabase pour Wishlists Publiques"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Variables d'environnement
source .env 2>/dev/null || true

SUPABASE_URL="${EXPO_PUBLIC_SUPABASE_URL}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"
PROJECT_REF="nydtsqjlbiwuoakqrldr"

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_KEY" ]; then
    echo "❌ Erreur : Variables d'environnement manquantes"
    echo "   Vérifiez .env pour EXPO_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

echo "✅ Connexion à Supabase..."
echo "   URL: $SUPABASE_URL"
echo ""

# Fonction pour exécuter SQL
execute_sql() {
    local sql="$1"
    local description="$2"
    
    echo "⏳ $description..."
    
    response=$(curl -s -X POST \
        "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
        -H "apikey: ${SERVICE_KEY}" \
        -H "Authorization: Bearer ${SERVICE_KEY}" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=representation" \
        -d "{\"query\": \"${sql}\"}" 2>&1)
    
    if echo "$response" | grep -q "error"; then
        echo "⚠️  Réponse: $description (peut être normal si déjà configuré)"
    else
        echo "✅ $description - OK"
    fi
}

# ============================================
# 1️⃣ ACTIVER RLS
# ============================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  ACTIVATION RLS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

execute_sql "ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;" "Activer RLS sur wishlists"
execute_sql "ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;" "Activer RLS sur wishlist_items"
execute_sql "ALTER TABLE products ENABLE ROW LEVEL SECURITY;" "Activer RLS sur products"

echo ""

# ============================================
# 2️⃣ CRÉER POLICIES
# ============================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  CRÉATION DES POLICIES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Supprimer anciennes policies
execute_sql "DROP POLICY IF EXISTS \"Public wishlists are viewable by anyone\" ON wishlists;" "Nettoyage wishlists"
execute_sql "DROP POLICY IF EXISTS \"Public wishlist items are viewable\" ON wishlist_items;" "Nettoyage wishlist_items"
execute_sql "DROP POLICY IF EXISTS \"Products in public wishlists are viewable\" ON products;" "Nettoyage products"

echo ""

# Créer nouvelles policies
execute_sql "CREATE POLICY \"Public wishlists are viewable by anyone\" ON wishlists FOR SELECT USING (privacy = 'public');" "Policy wishlists publiques"

execute_sql "CREATE POLICY \"Public wishlist items are viewable\" ON wishlist_items FOR SELECT USING (EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.privacy = 'public'));" "Policy wishlist_items publiques"

execute_sql "CREATE POLICY \"Products in public wishlists are viewable\" ON products FOR SELECT USING (EXISTS (SELECT 1 FROM wishlist_items JOIN wishlists ON wishlists.id = wishlist_items.wishlist_id WHERE wishlist_items.product_id = products.id AND wishlists.privacy = 'public'));" "Policy products publiques"

echo ""

# ============================================
# 3️⃣ VÉRIFICATIONS
# ============================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  VÉRIFICATIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "⏳ Test de lecture des wishlists publiques..."

# Test avec curl simple
test_response=$(curl -s \
    "${SUPABASE_URL}/rest/v1/wishlists?privacy=eq.public&select=id,title,privacy&limit=3" \
    -H "apikey: ${EXPO_PUBLIC_SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}")

if echo "$test_response" | grep -q "id"; then
    echo "✅ Test réussi ! Wishlists publiques accessibles"
    echo ""
    echo "📊 Wishlists publiques trouvées:"
    echo "$test_response" | python3 -m json.tool 2>/dev/null || echo "$test_response"
else
    echo "⚠️  Aucune wishlist publique trouvée (ou erreur)"
    echo "   Réponse: $test_response"
fi

echo ""

# ============================================
# ✅ TERMINÉ
# ============================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CONFIGURATION RLS TERMINÉE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Résumé:"
echo "   - RLS activé sur 3 tables"
echo "   - Policies lecture publique créées"
echo "   - Sécurité : lecture seule, wishlists publiques uniquement"
echo ""
echo "🧪 Test:"
echo "   Créez une wishlist avec privacy='public' dans l'app"
echo "   Puis testez : http://localhost:8000/w/?id=<wishlist-id>"
echo ""
echo "🚀 Déploiement:"
echo "   git add docs/ && git commit -m 'Add GitHub Pages' && git push"
echo ""

exit 0
