# Configuration du Bucket Supabase pour les Images de Produits

## Problème
L'upload d'images échoue car le bucket `product-images` n'existe pas dans Supabase Storage.

## Solution 1: Créer le Bucket Manuellement (Recommandé)

### Étapes:
1. Allez sur votre dashboard Supabase: https://supabase.com/dashboard
2. Sélectionnez votre projet WishHive
3. Dans le menu de gauche, cliquez sur **Storage**
4. Cliquez sur **New bucket**
5. Configurez le bucket:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Coché (pour permettre l'accès public aux images)
   - Cliquez sur **Create bucket**

### Configuration des Politiques RLS:

Après avoir créé le bucket, ajoutez ces politiques:

1. **Policy pour Upload** (INSERT):
   ```sql
   CREATE POLICY "Allow authenticated users to upload product images"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (
       bucket_id = 'product-images' AND
       (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

2. **Policy pour Lecture** (SELECT):
   ```sql
   CREATE POLICY "Allow public read access to product images"
   ON storage.objects
   FOR SELECT
   TO public
   USING (bucket_id = 'product-images');
   ```

3. **Policy pour Mise à Jour** (UPDATE):
   ```sql
   CREATE POLICY "Allow users to update their own product images"
   ON storage.objects
   FOR UPDATE
   TO authenticated
   USING (
       bucket_id = 'product-images' AND
       (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

4. **Policy pour Suppression** (DELETE):
   ```sql
   CREATE POLICY "Allow users to delete their own product images"
   ON storage.objects
   FOR DELETE
   TO authenticated
   USING (
       bucket_id = 'product-images' AND
       (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

## Solution 2: Utiliser la Console SQL Supabase

1. Allez dans **SQL Editor** dans votre dashboard Supabase
2. Exécutez ce script:

```sql
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (si pas déjà activé)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow public read access to product images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Allow users to update their own product images"
ON storage.objects FOR UPDATE TO authenticated
USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to delete their own product images"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
```

## Vérification

Après avoir créé le bucket, testez l'upload:
1. Ouvrez l'app
2. Allez dans Seller Dashboard → Add Product
3. Cliquez sur "Add Image"
4. Sélectionnez une image
5. L'image devrait maintenant s'uploader avec succès

## Dépannage

Si l'upload échoue toujours:
- Vérifiez que vous êtes authentifié
- Vérifiez les logs dans la console de l'app
- Vérifiez que le bucket est bien public
- Vérifiez que les politiques RLS sont bien créées
