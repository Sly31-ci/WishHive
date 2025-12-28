# WishHive - Guide de Démarrage

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- Node.js 18 ou supérieur
- Watchman (pour macOS/Linux)
- Expo Go sur votre appareil mobile

## 🚀 Installation Rapide

### 1. Cloner et installer
```bash
git clone <url-du-repo>
cd WishHive
npm install
```

### 2. Configuration Supabase
1. Créez un projet sur [supabase.com](https://supabase.com).
2. Récupérez votre **URL** et **Anon Key**.
3. Créez un fichier `.env` à la racine :
   ```bash
   cp .env.example .env
   ```
4. Remplissez le `.env` avec vos accès.

### 3. Initialisation de la Base de Données
Exécutez les scripts automatisés situés dans le dossier `scripts/` :

```bash
# 1. Configurer les tables et migrations
# Copier le contenu de supabase/migrations/ vers SQL Editor de Supabase

# 2. Configurer la sécurité RLS automatiquement
./scripts/configure-rls.sh

# 3. Configurer le stockage (images)
./scripts/setup-storage.sh
```

## 🎯 Lancer l'application

### Mode Développement
```bash
npx expo start --clear
```

- Utilisez **Expo Go** pour tester sur mobile réel.
- Le **Profile Selector** flottant (en mode DEV) vous permet de basculer entre User, Seller et Admin sans mot de passe.

## 🌍 Web Viewer (Public Share)

Le Web Viewer est auto-hébergé sur GitHub Pages. Pour le mettre à jour :
1. Les fichiers sont dans `docs/`.
2. Configurez GitHub Pages pour pointer vers le dossier `/docs` de la branche `main`.
3. URL : `https://Sly31-ci.github.io/WishHive/`

## 📁 Structure du Projet

- `app/` : Routes mobiles (Expo Router).
- `components/` : Composants UI atomiques.
- `docs/` : Documentation + Web Viewer statique.
- `scripts/` : Outils de maintenance et migrations.
- `supabase/` : Fichiers SQL et schémas.

## ✅ État des Fonctionnalités

- ✅ **Authentification** : Email/Pass + Social foundations.
- ✅ **Wishlists** : Création avec types d'événements personnalisés.
- ✅ **Partage** : Génération de QR codes et liens GitHub Pages.
- ✅ **Deep Linking** : Ouverture automatique de l'app via les liens web.
- ✅ **Sécurité** : RLS configuré partout.

## 🐛 Dépannage

### Problème de Cache Metro
```bash
rm -rf .expo node_modules/.cache
npx expo start --clear
```

### Script de Test Supabase
```bash
node scripts/test-supabase.js
```

---

**WishHive** - Make Wishes Real.

