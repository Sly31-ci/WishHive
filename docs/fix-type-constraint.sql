-- Migration pour permettre les types personnalisés dans wishlists

-- 1. Supprimer l'ancienne contrainte type_check
ALTER TABLE wishlists 
DROP CONSTRAINT IF EXISTS type_check;

-- 2. Ajouter une nouvelle contrainte plus permissive
-- Option A : Supprimer complètement la contrainte (recommandé pour custom types)
-- Pas besoin de contrainte, on valide côté app

-- Option B : Ou garder une validation minimale (type doit être non vide)
ALTER TABLE wishlists
ADD CONSTRAINT type_not_empty CHECK (type IS NOT NULL AND length(trim(type)) > 0);

-- 3. Optionnel : Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_wishlists_type ON wishlists(type);

-- 4. Vérification
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_schema = 'public' 
AND constraint_name LIKE '%type%';
