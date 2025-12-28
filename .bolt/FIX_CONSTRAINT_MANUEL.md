# 🚨 GUIDE URGENT : Supprimer Contrainte type_check

## ⚠️ **L'API REST ne peut pas modifier les contraintes**

Le script a échoué car Supabase REST API ne supporte pas `ALTER TABLE`.

**Il faut le faire MANUELLEMENT dans Supabase SQL Editor.**

---

## ✅ **ÉTAPES EXACTES** (2 minutes)

### **1. Ouvrir Supabase Dashboard**

🔗 **[CLIQUER ICI : https://app.supabase.com](https://app.supabase.com)**

---

### **2. Sélectionner le Projet**

- Chercher "WishHive" dans la liste
- Cliquer dessus

---

### **3. Ouvrir SQL Editor**

Dans le menu de gauche :
```
┌─────────────────────┐
│ 🏠 Home            │
│ 📊 Table Editor    │
│ 🔍 SQL Editor   ← CLIQUER ICI
│ 🔐 Authentication  │
│ ⚙️  Settings       │
└─────────────────────┘
```

---

### **4. New Query**

En haut à droite, cliquer :
```
[ + New Query ]
```

---

### **5. Copier-Coller CE CODE**

```sql
-- ============================================
-- SUPPRESSION CONTRAINTE type_check
-- ============================================

-- Étape 1 : Supprimer l'ancienne contrainte
ALTER TABLE wishlists 
DROP CONSTRAINT IF EXISTS type_check;

-- Étape 2 : Ajouter contrainte minimale (type non vide)
ALTER TABLE wishlists
ADD CONSTRAINT type_not_empty 
CHECK (type IS NOT NULL AND length(trim(type)) > 0);

-- Étape 3 : Vérifier
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_schema = 'public' 
AND table_name = 'wishlists'
AND constraint_name LIKE '%type%';
```

---

### **6. RUN (Exécuter)**

En haut à droite :
```
[ ▶ RUN ]  ← CLIQUER ICI
```

ou raccourci : `Ctrl + Enter`

---

### **7. Vérifier le Résultat**

Vous devriez voir :

```
✅ Success. No rows returned

constraint_name    | check_clause
-------------------|------------------
type_not_empty     | ((type IS NOT NULL) AND (length(trim(type)) > 0))
```

**Si vous voyez ça** : ✅ **C'EST BON !**

---

### **8. Tester Dans L'App**

1. Retourner dans l'app WishHive
2. Create Wishlist
3. Tap "+ Custom"
4. Emoji : 🎓
5. Label : Graduation
6. Create
7. ✅ **DEVRAIT FONCTIONNER !**

---

## 🔍 **Si Ça Ne Marche Toujours Pas**

### **Vérifier que la contrainte est bien supprimée** :

```sql
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'wishlists' 
AND constraint_type = 'CHECK';
```

**Résultat attendu** :
```
constraint_name
----------------
type_not_empty     ← Seulement celle-ci
```

**Si vous voyez `type_check`** → La suppression a échoué.

### **Solution Alternative** :

```sql
-- Forcer la suppression
ALTER TABLE wishlists 
DROP CONSTRAINT type_check CASCADE;

-- Puis recréer la contrainte minimale
ALTER TABLE wishlists
ADD CONSTRAINT type_not_empty 
CHECK (type IS NOT NULL AND length(trim(type)) > 0);
```

---

## 🎯 **Avant/Après**

### **AVANT (Restrictif)** ❌
```sql
CHECK (type IN ('birthday', 'wedding', 'christmas', 'baby', 'general'))
```
**Autorise** : Seulement 5 types  
**Bloque** : Tout type custom

### **APRÈS (Permissif)** ✅
```sql
CHECK (type IS NOT NULL AND length(trim(type)) > 0)
```
**Autorise** : N'importe quel type  
**Valide** : Seulement que le type n'est pas vide

---

## 📸 **Screenshots Virtuels**

### **Étape 3 : SQL Editor**
```
┌────────────────────────────────────────┐
│  SQL EDITOR                    + New Query │
├────────────────────────────────────────┤
│                                        │
│  [Votre SQL ici]                       │
│                                        │
│                                        │
│                              [ ▶ RUN ] │
└────────────────────────────────────────┘
```

### **Après RUN**
```
┌────────────────────────────────────────┐
│  ✅ Success. No rows returned          │
├────────────────────────────────────────┤
│  Results (1)                           │
│  ┌──────────────┬───────────────────┐  │
│  │ constraint_  │ check_clause      │  │
│  │ name         │                   │  │
│  ├──────────────┼───────────────────┤  │
│  │ type_not_    │ ((type IS NOT     │  │
│  │ empty        │ NULL) AND ...)    │  │
│  └──────────────┴───────────────────┘  │
└────────────────────────────────────────┘
```

---

## ⚡ **RÉSUMÉ ULTRA-RAPIDE**

1. **https://app.supabase.com** → Projet WishHive
2. **SQL Editor** (menu gauche)
3. **New Query**
4. **Copier le SQL ci-dessus**
5. **RUN** (Ctrl+Enter)
6. **Vérifier** : Voir "type_not_empty"
7. **Tester** l'app

---

**C'EST LA SEULE FAÇON de modifier les contraintes sur Supabase ! 🔧**

_Guide mis à jour le ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}_
