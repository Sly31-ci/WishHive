-- ============================================
-- SUPPRESSION CONTRAINTE type_check - VERSION CORRIGÉE
-- ============================================

-- Étape 1 : Supprimer l'ancienne contrainte
ALTER TABLE wishlists 
DROP CONSTRAINT IF EXISTS type_check;

-- Étape 2 : Ajouter contrainte minimale (type non vide)
ALTER TABLE wishlists
ADD CONSTRAINT type_not_empty 
CHECK (type IS NOT NULL AND length(trim(type)) > 0);

-- Étape 3 : Vérifier les contraintes (CORRIGÉ)
SELECT 
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'wishlists' 
AND tc.constraint_type = 'CHECK'
AND tc.constraint_name LIKE '%type%';
