# 🔧 Solution : Migration des Wishlists - Problème RLS Détecté

## ❌ Problème Identifié

Les updates ne fonctionnent pas car **Supabase RLS (Row Level Security)** bloque les modifications.

Les wishlists ont toujours `theme: {}` après la migration, ce qui signifie que les policies RLS empêchent l'update.

---

## 🔐 Solutions Possibles

### **Solution 1 : Via Supabase Dashboard** (Recommandé)

1. **Connectez-vous à Supabase Dashboard**
   - https://supabase.com/dashboard

2. **Allez dans SQL Editor**

3. **Exécutez cette requête SQL** :

```sql
-- Mettre à jour toutes les wishlists avec theme vide
UPDATE wishlists
SET theme = '{
  "template": "hive",
  "primaryColor": "#FFB937",
  "secondaryColor": "#7F5BFF",
  "accentColor": "#00B37E",
  "emoji": "🐝",
  "gradient": true,
  "style": "trendy",
  "pattern": null,
  "background": {
    "type": "solid",
    "solidColor": "#FFFFFF"
  },
  "cardStyle": {
    "shape": "rounded",
    "borderRadius": 16,
    "borderWidth": 1,
    "borderColor": "#FFB937",
    "shadow": true,
    "shadowIntensity": "light",
    "effect": "none",
    "backgroundOpacity": 1.0
  }
}'::jsonb
WHERE theme = '{}'::jsonb OR theme IS NULL;
```

4. **Vérifiez le résultat** :

```sql
SELECT id, title, theme->>'primaryColor' as color, theme->>'emoji' as emoji
FROM wishlists;
```

---

### **Solution 2 : Modifier les Policies RLS**

1. **Allez dans Authentication → Policies**

2. **Pour la table `wishlists`, ajoutez une policy UPDATE** :

```sql
CREATE POLICY "Allow service role to update wishlists"
ON wishlists
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);
```

3. **Puis relancez le script avec service_role_key**

---

### **Solution 3 : Update Manuel par Wishlist**

Si vous avez peu de wishlists, vous pouvez les mettre à jour manuellement dans Supabase Dashboard :

1. Table Editor → wishlists
2. Pour chaque wishlist avec `theme: {}`
3. Cliquez sur Edit
4. Dans le champ `theme`, collez :

```json
{
  "template": "hive",
  "primaryColor": "#FFB937",
  "secondaryColor": "#7F5BFF",
  "accentColor": "#00B37E",
  "emoji": "🐝",
  "gradient": true,
  "style": "trendy"
}
```

---

## ✅ Vérification Après Migration

Après avoir appliqué une des solutions, vérifiez :

```bash
node scripts/check-wishlists-structure.js
```

Vous devriez voir :
```json
{
  "theme": {
    "primaryColor": "#FFB937",
    "secondaryColor": "#7F5BFF",
    "emoji": "🐝",
    ...
  }
}
```

---

## 🎯 Wishlists à Migrer

D'après la dernière vérification :

- ✅ **"Test"** - Déjà avec thème Hive
- ❌ **"My Birthday Wishlist"** - theme vide
- ❌ **"Anniversaire de Maxime"** - theme vide
- ❌ **"Mi list"** - theme vide

**3 wishlists** nécessitent la migration.

---

## 📝 Requête SQL Recommandée

Voici la requête SQL complète à exécuter dans Supabase Dashboard :

```sql
-- 1. Vérifier les wishlists avec theme vide
SELECT id, title, theme
FROM wishlists
WHERE theme = '{}'::jsonb OR theme IS NULL;

-- 2. Mettre à jour avec le thème WishHive
UPDATE wishlists
SET theme = '{
  "template": "hive",
  "primaryColor": "#FFB937",
  "secondaryColor": "#7F5BFF",
  "accentColor": "#00B37E",
  "emoji": "🐝",
  "gradient": true,
  "style": "trendy",
  "pattern": null,
  "background": {
    "type": "solid",
    "solidColor": "#FFFFFF"
  },
  "cardStyle": {
    "shape": "rounded",
    "borderRadius": 16,
    "borderWidth": 1,
    "borderColor": "#FFB937",
    "shadow": true,
    "shadowIntensity": "light",
    "effect": "none",
    "backgroundOpacity": 1.0
  }
}'::jsonb
WHERE theme = '{}'::jsonb OR theme IS NULL;

-- 3. Vérifier le résultat
SELECT 
  id, 
  title, 
  theme->>'primaryColor' as primary_color,
  theme->>'emoji' as emoji,
  theme->>'template' as template
FROM wishlists;
```

---

## 🚀 Après la Migration SQL

Une fois la requête SQL exécutée :

1. **Redémarrez l'app** (pull to refresh)
2. **Les wishlists devraient afficher** :
   - 🐝 Emoji abeille
   - 🟡 Couleurs orange #FFB937
   - 🟣 Accents violet #7F5BFF

---

**Voulez-vous que je vous guide pour exécuter la requête SQL dans Supabase Dashboard ?**
