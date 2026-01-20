# 🔄 Migration des Wishlists Existantes - Guide Complet

## 🎯 Objectif

Mettre à jour **toutes les wishlists existantes** qui n'ont pas été customisées pour qu'elles utilisent le nouveau thème par défaut WishHive (#FFB937 orange + #7F5BFF violet).

---

## 📋 Ce Qui Est Migré

### **Wishlists Concernées** ✅
- Wishlists avec l'ancien thème minimal gris
- Wishlists sans `theme_data` (utilisent le défaut)
- Wishlists créées avant la mise à jour

### **Wishlists NON Touchées** ⏭️
- Wishlists déjà customisées par les utilisateurs
- Wishlists avec un template spécifique (Noël, Anniversaire, etc.)
- Wishlists avec des couleurs personnalisées

---

## 🛠️ Méthodes de Migration

### **Méthode 1 : Via l'App Mobile** (Recommandé)

1. **Accéder à la page de migration** :
   ```
   Navigation → Admin → Migrate Themes
   ou directement : /admin/migrate-themes
   ```

2. **Lancer la migration** :
   - Appuyez sur "Lancer la Migration"
   - Confirmez l'action
   - Attendez la fin du processus

3. **Vérifier les résultats** :
   - Nombre de wishlists migrées
   - Nombre de wishlists ignorées
   - Erreurs éventuelles

### **Méthode 2 : Via Script Node.js**

```bash
# Depuis le terminal
cd /home/syzon/Téléchargements/WishHive

# Exécuter le script
npx ts-node scripts/migrate-wishlists-theme.ts
```

### **Méthode 3 : Via Code**

```typescript
import { migrateWishlistsToDefaultTheme } from './scripts/migrate-wishlists-theme';

// Exécuter la migration
const result = await migrateWishlistsToDefaultTheme();

console.log('Résultat:', result);
// {
//   success: true,
//   updated: 15,
//   errors: 0,
//   skipped: 5,
//   total: 20
// }
```

---

## 📊 Exemple de Résultat

```
🔄 Début de la migration des wishlists...

📊 20 wishlists trouvées

✅ 15 wishlists à migrer
⏭️  5 wishlists déjà customisées (ignorées)

✅ Migré: "Ma Wishlist de Noël" → Thème WishHive
✅ Migré: "Anniversaire 2026" → Thème WishHive
✅ Migré: "Liste Cadeaux" → Thème WishHive
...

==================================================
📊 RÉSUMÉ DE LA MIGRATION
==================================================
✅ Succès: 15 wishlists
❌ Erreurs: 0 wishlists
⏭️  Ignorées: 5 wishlists (déjà customisées)
📈 Total: 20 wishlists
==================================================
```

---

## 🔍 Détection de l'Ancien Thème

Le script détecte automatiquement les wishlists avec l'ancien thème :

```typescript
function isOldDefaultTheme(wishlist) {
    // Pas de theme_data = ancien défaut
    if (!wishlist.theme_data) {
        return true;
    }

    const theme = JSON.parse(wishlist.theme_data);

    // Vérifie si c'est le thème minimal gris
    return (
        theme.template === 'minimal' &&
        theme.primaryColor === '#1F2937' &&
        theme.secondaryColor === '#F3F4F6' &&
        theme.emoji === '🌙'
    );
}
```

---

## 🎨 Transformation Appliquée

### **AVANT** (Ancien thème)
```json
{
  "template": "minimal",
  "primaryColor": "#1F2937",
  "secondaryColor": "#F3F4F6",
  "accentColor": "#6B7280",
  "emoji": "🌙",
  "gradient": false,
  "style": "minimal"
}
```

### **APRÈS** (Nouveau thème WishHive)
```json
{
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
}
```

---

## ⚠️ Sécurité et Rollback

### **Rollback (Annuler la Migration)**

Si vous souhaitez annuler la migration :

**Via l'app** :
```
Admin → Migrate Themes → Bouton "Rollback (Annuler)"
```

**Via code** :
```typescript
import { rollbackMigration } from './scripts/migrate-wishlists-theme';

const result = await rollbackMigration();
console.log(`${result.rolledBack} wishlists restaurées`);
```

### **Test sur Une Seule Wishlist**

Avant de migrer toutes les wishlists, testez sur une seule :

```typescript
import { testMigrationOnOne } from './scripts/migrate-wishlists-theme';

const result = await testMigrationOnOne('wishlist-id-123');
```

---

## 📝 Checklist Avant Migration

- [ ] **Backup de la base de données** (recommandé)
- [ ] **Test sur une wishlist** de développement
- [ ] **Vérifier les permissions** Supabase
- [ ] **Informer les utilisateurs** (optionnel)
- [ ] **Planifier un moment** avec peu de trafic

---

## 🎯 Résultats Attendus

### **Wishlists Migrées**
```
┌────────────────────────────────┐
│  🐝 Ma Wishlist                │  ← Emoji abeille
│  ══════════════════════════    │  ← Ligne orange
│                                │
│  ┌──────────────────────────┐ │
│  │  📦 Item 1               │ │  ← Bordure orange
│  │  [🟡 Ajouter]            │ │  ← Bouton orange
│  └──────────────────────────┘ │
└────────────────────────────────┘
```

### **Wishlists Ignorées** (Déjà Customisées)
```
┌────────────────────────────────┐
│  🎄 Noël 2026                  │  ← Template Noël
│  ══════════════════════════    │  ← Couleurs custom
│  (Pas touché par la migration) │
└────────────────────────────────┘
```

---

## 🚀 Commandes Rapides

### **Migration Complète**
```bash
# Node.js
npx ts-node scripts/migrate-wishlists-theme.ts

# Ou via l'app
# Navigation → /admin/migrate-themes → "Lancer la Migration"
```

### **Rollback**
```bash
# Via code
import { rollbackMigration } from './scripts/migrate-wishlists-theme';
await rollbackMigration();
```

### **Test**
```typescript
import { testMigrationOnOne } from './scripts/migrate-wishlists-theme';
await testMigrationOnOne('wishlist-id');
```

---

## 📊 Statistiques Attendues

Pour une app typique avec 100 wishlists :

```
📊 Estimation :
├─ 60-70 wishlists migrées (ancien thème)
├─ 20-30 wishlists ignorées (déjà customisées)
└─ 10-20 wishlists avec templates spéciaux
```

---

## ✅ Vérification Post-Migration

### **1. Vérifier visuellement**
- Ouvrez quelques wishlists
- Vérifiez les couleurs orange/violet
- Vérifiez l'emoji 🐝

### **2. Vérifier en base de données**
```sql
-- Compter les wishlists avec le nouveau thème
SELECT COUNT(*) 
FROM wishlists 
WHERE theme_data::jsonb->>'primaryColor' = '#FFB937';

-- Compter les wishlists avec l'ancien thème
SELECT COUNT(*) 
FROM wishlists 
WHERE theme_data::jsonb->>'primaryColor' = '#1F2937';
```

### **3. Vérifier les logs**
- Consultez les logs de migration
- Vérifiez qu'il n'y a pas d'erreurs
- Confirmez le nombre de wishlists migrées

---

## 🎉 Résultat Final

Après la migration :

```
✅ Toutes les wishlists non customisées utilisent le thème WishHive
✅ Identité visuelle cohérente dans toute l'app
✅ Les wishlists customisées sont préservées
✅ Les utilisateurs peuvent toujours customiser
```

---

## 📞 Support

En cas de problème :

1. **Vérifier les logs** de la migration
2. **Tester le rollback** si nécessaire
3. **Vérifier les permissions** Supabase
4. **Consulter la documentation** Supabase

---

**Fichiers créés** :
- `scripts/migrate-wishlists-theme.ts` - Script de migration
- `app/admin/migrate-themes.tsx` - Interface de migration
- `.agent/wishlist-migration-guide.md` - Ce guide

**Status** : ✅ Prêt à migrer  
**Sécurité** : ✅ Rollback disponible  
**Test** : ✅ Test unitaire disponible
