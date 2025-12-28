# ✅ SQL CORRIGÉ - Copier-Coller dans Supabase

## 🎯 **Code à Exécuter**

```sql
-- Étape 1 : Supprimer l'ancienne contrainte
ALTER TABLE wishlists 
DROP CONSTRAINT IF EXISTS type_check;

-- Étape 2 : Ajouter contrainte minimale
ALTER TABLE wishlists
ADD CONSTRAINT type_not_empty 
CHECK (type IS NOT NULL AND length(trim(type)) > 0);

-- Étape 3 : Vérifier (CORRIGÉ)
SELECT 
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'wishlists' 
AND tc.constraint_type = 'CHECK'
AND tc.constraint_name LIKE '%type%';
```

---

## 📋 **Instructions**

1. **Supabase** → https://app.supabase.com
2. **Projet WishHive** → SQL Editor
3. **New Query**
4. **Copier-coller** le code ci-dessus
5. **RUN** (▶ bouton ou Ctrl+Enter)

---

## ✅ **Résultat Attendu**

Vous devriez voir :

```
Query 1: Success. No rows returned (ALTER TABLE)
Query 2: Success. No rows returned (ALTER TABLE)
Query 3: Results

constraint_name  | check_clause
-----------------|------------------
type_not_empty   | ((type IS NOT NULL) AND (length(trim(type)) > 0))
```

**Si vous voyez ça** → ✅ **C'EST RÉUSSI !**

---

## 🧪 **Test Final**

Dans l'app WishHive :
1. Create Wishlist
2. Tap "+ Custom"
3. Emoji: 🎓
4. Label: Graduation
5. Title: "My Graduation"
6. **Create** → ✅ Devrait fonctionner !

---

_SQL corrigé le ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}_
