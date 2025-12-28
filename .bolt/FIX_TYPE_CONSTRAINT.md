# 🔧 FIX : Erreur "type_check" Constraint

## 🎯 **Problème**

```
Error: new row for relation "wishlists" violates check constraint "type_check"
```

**Cause** : La base de données Supabase a une contrainte CHECK sur la colonne `type` qui n'accepte que certaines valeurs :
- ✅ `birthday`
- ✅ `wedding`
- ✅ `christmas`
- ✅ `baby`
- ✅ `general`
- ❌ `custom` (ou tout autre type personnalisé)

---

## ✅ **Solution**

### **Méthode 1 : Via Supabase SQL Editor** (Recommandé)

1. **Ouvrir Supabase** :
   - [https://app.supabase.com](https://app.supabase.com)
   - Sélectionner votre projet WishHive

2. **SQL Editor** → New Query

3. **Copier-coller ce SQL** :

```sql
-- Supprimer l'ancienne contrainte restrictive
ALTER TABLE wishlists 
DROP CONSTRAINT IF EXISTS type_check;

-- Ajouter une contrainte minimale (type non vide)
ALTER TABLE wishlists
ADD CONSTRAINT type_not_empty 
CHECK (type IS NOT NULL AND length(trim(type)) > 0);
```

4. **Run** (bouton en haut à droite)

5. **Vérifier** :
```sql
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_schema = 'public' 
AND constraint_name LIKE '%type%';
```

---

### **Méthode 2 : Fichier SQL Préparé**

Le fichier `docs/fix-type-constraint.sql` est prêt. Exécutez-le dans Supabase SQL Editor.

---

### **Méthode 3 : Via psql (Avancé)**

```bash
# Si vous avez les credentials Supabase
psql -h db.xxx.supabase.co -U postgres -d postgres << 'EOF'
ALTER TABLE wishlists DROP CONSTRAINT IF EXISTS type_check;
ALTER TABLE wishlists ADD CONSTRAINT type_not_empty CHECK (type IS NOT NULL AND length(trim(type)) > 0);
EOF
```

---

## 🧪 **Test Après Correction**

### **Dans l'app** :

1. Create Wishlist
2. Tap "+ Custom"
3. Emoji : 🎓
4. Label : Graduation
5. Title : "My Graduation Wishlist"
6. **Tap "Create"**
7. ✅ **Doit fonctionner maintenant !**

---

## 🔍 **Vérification des Types Autorisés**

**Avant** (avec contrainte stricte) :
```sql
CHECK (type IN ('birthday', 'wedding', 'christmas', 'baby', 'general'))
```

**Après** (permissif) :
```sql
CHECK (type IS NOT NULL AND length(trim(type)) > 0)
```

**Maintenant accepte** :
- ✅ `birthday`, `wedding`, etc. (types prédéfinis)
- ✅ `graduation` (custom)
- ✅ `housewarming` (custom)
- ✅ `anniversary` (custom)
- ✅ N'importe quel type personnalisé

---

## 📊 **Types Possibles Après Fix**

| Type | Source | Exemple |
|------|--------|---------|
| `birthday` | Prédéfini | 🎂 Birthday |
| `wedding` | Prédéfini | 💍 Wedding |
| `christmas` | Prédéfini | 🎄 Christmas |
| `baby` | Prédéfini | 👶 Baby |
| `general` | Prédéfini | 🎁 General |
| **`graduation`** | **Custom** | **🎓 Graduation** |
| **`housewarming`** | **Custom** | **🏠 Housewarming** |
| **`anniversary`** | **Custom** | **🎉 Anniversary** |
| **`travel`** | **Custom** | **✈️ Travel** |

---

## ⚠️ **Note Importante**

La nouvelle contrainte vérifie seulement que :
1. Le type n'est pas NULL
2. Le type n'est pas vide (après trim)

**Cela permet** :
- ✅ Tous les types personnalisés
- ✅ Flexibilité totale
- ✅ Pas de limitation

**Validation côté app** :
- Input Label a un placeholder et autofocus
- User ne peut pas laisser vide

---

## 🚀 **Commandes Rapides**

```sql
-- Supprimer contrainte
ALTER TABLE wishlists DROP CONSTRAINT IF EXISTS type_check;

-- Ajouter contrainte minimale
ALTER TABLE wishlists
ADD CONSTRAINT type_not_empty 
CHECK (type IS NOT NULL AND length(trim(type)) > 0);

-- Vérifier
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'wishlists' AND constraint_type = 'CHECK';
```

---

**Exécutez le SQL dans Supabase et réessayez de créer une wishlist avec "+ Custom" ! 🎓**

_Guide créé le ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}_
