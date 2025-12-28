-- 🔐 SUPABASE RLS POLICIES - WISHLISTS PUBLIQUES
-- À exécuter dans Supabase SQL Editor
-- https://app.supabase.com/project/_/sql

-- ============================================
-- 1️⃣ ACTIVER RLS SUR LES TABLES
-- ============================================

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2️⃣ WISHLISTS - Lecture publique
-- ============================================

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Public wishlists are viewable by anyone" ON wishlists;

-- Créer nouvelle policy
CREATE POLICY "Public wishlists are viewable by anyone"
ON wishlists FOR SELECT
USING (privacy = 'public');

-- ============================================
-- 3️⃣ WISHLIST_ITEMS - Lecture si wishlist publique
-- ============================================

DROP POLICY IF EXISTS "Public wishlist items are viewable" ON wishlist_items;

CREATE POLICY "Public wishlist items are viewable"
ON wishlist_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM wishlists 
    WHERE wishlists.id = wishlist_items.wishlist_id 
    AND wishlists.privacy = 'public'
  )
);

-- ============================================
-- 4️⃣ PRODUCTS - Lecture si dans wishlist publique
-- ============================================

DROP POLICY IF EXISTS "Products in public wishlists are viewable" ON products;

CREATE POLICY "Products in public wishlists are viewable"
ON products FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM wishlist_items
    JOIN wishlists ON wishlists.id = wishlist_items.wishlist_id
    WHERE wishlist_items.product_id = products.id
    AND wishlists.privacy = 'public'
  )
);

-- ============================================
-- 5️⃣ VÉRIFICATIONS
-- ============================================

-- Test 1 : Wishlists publiques visibles
SELECT COUNT(*) as public_wishlists 
FROM wishlists 
WHERE privacy = 'public';

-- Test 2 : Items de wishlists publiques visibles
SELECT COUNT(*) as public_items
FROM wishlist_items wi
JOIN wishlists w ON w.id = wi.wishlist_id
WHERE w.privacy = 'public';

-- Test 3 : Lister les wishlists publiques
SELECT id, title, type, privacy, created_at
FROM wishlists
WHERE privacy = 'public'
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- 6️⃣ SECURITY CHECKS
-- ============================================

-- Vérifier que RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('wishlists', 'wishlist_items', 'products');

-- Devrait retourner rowsecurity = true pour les 3 tables

-- Lister toutes les policies
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('wishlists', 'wishlist_items', 'products')
ORDER BY tablename, policyname;

-- ============================================
-- 7️⃣ ROLLBACK (si besoin)
-- ============================================

-- ATTENTION : Désactive la sécurité ! Utiliser seulement en dev/test

-- DROP POLICY "Public wishlists are viewable by anyone" ON wishlists;
-- DROP POLICY "Public wishlist items are viewable" ON wishlist_items;
-- DROP POLICY "Products in public wishlists are viewable" ON products;

-- ALTER TABLE wishlists DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE wishlist_items DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- ============================================
-- ✅ CONFIGURATION TERMINÉE
-- ============================================

-- Résumé :
-- - RLS activé sur 3 tables
-- - Lecture publique limitée aux wishlists public
-- - Écriture bloquée (aucune policy INSERT/UPDATE/DELETE)
-- - Utilisation sécurisée avec clé anon uniquement

-- Test final :
-- Copier une wishlist ID publique et tester dans le navigateur :
-- https://<username>.github.io/WishHive/w/?id=<wishlist-id>
