#!/bin/bash

# Script pour créer le bucket product-images dans Supabase
# Usage: ./setup-storage.sh

echo "🚀 Configuration du bucket Supabase pour les images de produits..."
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Instructions:${NC}"
echo "1. Allez sur votre dashboard Supabase: https://supabase.com/dashboard"
echo "2. Sélectionnez votre projet WishHive"
echo "3. Cliquez sur 'SQL Editor' dans le menu de gauche"
echo "4. Créez une nouvelle requête et collez le SQL ci-dessous:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat << 'EOF'

-- Créer le bucket pour les images de produits
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Activer RLS sur storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Politique: Permettre aux utilisateurs authentifiés d'uploader des images
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique: Permettre l'accès public en lecture
CREATE POLICY "Allow public read access to product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Politique: Permettre aux utilisateurs de modifier leurs propres images
CREATE POLICY "Allow users to update their own product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique: Permettre aux utilisateurs de supprimer leurs propres images
CREATE POLICY "Allow users to delete their own product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

EOF
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ Après avoir exécuté ce SQL, l'upload d'images fonctionnera!${NC}"
echo ""
echo "Alternative rapide via l'interface:"
echo "  1. Storage → New bucket"
echo "  2. Nom: product-images"
echo "  3. Cochez 'Public bucket'"
echo "  4. Créer"
echo ""
