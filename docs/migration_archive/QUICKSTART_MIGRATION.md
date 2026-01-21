# 🚀 Démarrage Rapide : Migration Supabase Cloud → Local

**Temps estimé** : 10-30 minutes (selon la taille de votre base)

---

## 📋 Prérequis

- [x] Supabase Local installé et démarré
- [ ] Accès à votre projet Supabase Cloud
- [ ] Service Role Key de Supabase Cloud

---

## ⚡ Méthode Rapide (Recommandée)

### Étape 1 : Récupérer votre Service Role Key

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet **WishHive**
3. Allez dans **Settings** > **API**
4. Copiez la clé **`service_role`** (⚠️ PAS la clé `anon` !)

### Étape 2 : Configurer le fichier de migration

```bash
cd ~/Téléchargements/WishHive

# Copier le template
cp .env.migration.example .env.migration

# Éditer le fichier
nano .env.migration
```

Remplacez `VOTRE_SERVICE_ROLE_KEY_CLOUD_ICI` par votre vraie clé, puis sauvegardez (Ctrl+O, Enter, Ctrl+X).

### Étape 3 : Lancer la migration

```bash
# Installer dotenv si nécessaire
npm install dotenv

# Lancer le script
node scripts/migrate-supabase-data.js
```

### Étape 4 : Vérifier

```bash
# Tester la connexion
node test-supabase.js

# Ou ouvrir Studio
open http://localhost:3000
```

---

## 🎯 Ce que le script fait

1. ✅ Vérifie les connexions Cloud et Local
2. ✅ Récupère toutes les données depuis le Cloud
3. ✅ Nettoie les tables locales
4. ✅ Importe les données dans Local
5. ✅ Affiche un rapport détaillé

---

## 📊 Tables migrées

Le script migre automatiquement ces tables (dans l'ordre) :

- `users`
- `profiles`
- `wishlists`
- `wishlist_items`
- `follows`
- `notifications`
- `comments`
- `likes`
- `shares`
- `badges`
- `user_badges`
- `achievements`
- `user_achievements`
- `marketplace_items`
- `marketplace_categories`
- `messages`
- `conversations`

---

## ⚠️ Important

### Avant de lancer
- ✅ Assurez-vous que Supabase Local est démarré
- ✅ Faites un backup de vos données Cloud (optionnel mais recommandé)
- ✅ Vérifiez que vous avez la bonne Service Role Key

### Pendant la migration
- ⏳ Ne fermez pas le terminal
- ⏳ La migration peut prendre plusieurs minutes
- ⏳ Vous verrez la progression en temps réel

### Après la migration
- ✅ Vérifiez les données dans Studio
- ✅ Testez votre application
- ✅ Vérifiez que toutes les fonctionnalités marchent

---

## 🆘 Problèmes courants

### "Erreur de connexion Cloud"
**Solution** : Vérifiez votre Service Role Key dans `.env.migration`

### "Erreur de connexion Local"
**Solution** : Vérifiez que Supabase Local est démarré :
```bash
cd ~/projects/supabase-local/supabase/docker
docker compose ps
```

### "Table doesn't exist"
**Solution** : Créez d'abord le schéma dans Supabase Local :
1. Ouvrez http://localhost:3000
2. Allez dans SQL Editor
3. Exécutez le schéma SQL de `QUICKSTART_SUPABASE.md`

### "Permission denied"
**Solution** : Utilisez la Service Role Key, pas la Anon Key

---

## 📚 Documentation complète

Pour plus de détails, consultez :
- **Guide complet** : `GUIDE_MIGRATION_CLOUD_TO_LOCAL.md`
- **Méthodes alternatives** : Export/Import SQL, Supabase CLI

---

## ✅ Checklist

- [ ] Service Role Key récupérée
- [ ] Fichier `.env.migration` configuré
- [ ] Supabase Local démarré
- [ ] Schéma créé dans Local (si première migration)
- [ ] Script de migration exécuté
- [ ] Données vérifiées dans Studio
- [ ] Application testée

---

**Prêt ? Lancez la migration ! 🚀**

```bash
node scripts/migrate-supabase-data.js
```
