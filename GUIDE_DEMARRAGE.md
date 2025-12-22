# WishHive - Guide de Démarrage

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- Node.js 18 ou supérieur
- npm ou yarn
- Expo CLI : `npm install -g expo-cli`
- Un compte Supabase (gratuit)

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration Supabase

#### Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **Project URL** et **anon key**

#### Exécuter les migrations
1. Dans votre dashboard Supabase, allez dans **SQL Editor**
2. Exécutez les fichiers de migration dans l'ordre :
   - `supabase/migrations/20251202014416_create_wishhive_core_schema.sql`
   - `supabase/migrations/20251202014457_create_functions_and_triggers.sql`

### 3. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos credentials Supabase :

```
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
```

## 🎯 Lancer l'application

### Mode développement

```bash
npm run dev
```

Options disponibles :
- Appuyez sur `w` pour ouvrir dans le navigateur web
- Appuyez sur `i` pour iOS simulator (Mac uniquement)
- Appuyez sur `a` pour Android emulator
- Scannez le QR code avec l'app Expo Go sur votre téléphone

### Build production

#### Web
```bash
npm run build:web
```

#### Mobile (iOS/Android)
```bash
# Installer EAS CLI
npm install -g eas-cli

# Configurer
eas build:configure

# Build iOS
eas build --platform ios

# Build Android
eas build --platform android
```

## 📁 Structure du projet

```
WishHive/
├── app/                    # Écrans et navigation
│   ├── (auth)/            # Authentification
│   ├── (tabs)/            # Navigation principale
│   └── wishlists/         # Gestion wishlists
├── components/            # Composants réutilisables
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── ProductCard.tsx
│   └── WishlistCard.tsx
├── hooks/                 # Hooks personnalisés
│   ├── useGamification.ts
│   ├── useProducts.ts
│   └── useWishlists.ts
├── lib/                   # Utilitaires
│   ├── supabase.ts
│   ├── utils.ts
│   ├── haptics.ts
│   └── sharing.ts
├── constants/             # Constantes et thème
│   └── Colors.ts
├── contexts/              # Contextes React
│   └── AuthContext.tsx
├── types/                 # Types TypeScript
│   └── database.ts
└── supabase/             # Migrations SQL
    └── migrations/
```

## 🎨 Fonctionnalités disponibles

### ✅ Déjà implémenté
- Authentification (signup/login/forgot password)
- Structure de navigation fluide (Expo Router)
- **Design System Premium** (Haptics, Reanimated, Skeleton loaders)
- **Social V2** (Cagnotte collective, Chat temps-réel)
- **Engagement** (Notifications, Reels interactions, Gamification)
- **Performance** (Lazy loading, Memoization, Caching offline)
- **SEO & Viralité** (Deep linking, OG Meta-tags dynamiques)
- Marketplace & Profils vendeurs
- Migrations base de données complètes (15+ tables)

### 🔄 À tester
- Flow complet de contribution à une cagnotte
- Discussion en temps réel dans un salon de chat
- Partage de wishlist et aperçu social rich
- Performance sur un grand nombre d'items (pagination)

## 🐛 Dépannage

### Erreur de connexion Supabase
- Vérifiez vos credentials dans `.env`
- Assurez-vous que les migrations sont exécutées
- Vérifiez que RLS est activé sur les tables

### Erreur Expo
```bash
# Nettoyer le cache
expo start -c
```

### Erreur npm
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
```

## 📚 Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation React Native](https://reactnative.dev/)

## 🎯 Prochaines étapes

1. **Tester l'application** : `npm run dev`
2. **Créer un compte** : Testez le flow d'authentification
3. **Créer une wishlist** : Testez la création et gestion
4. **Explorer le marketplace** : Parcourez les produits
5. **Tester la gamification** : Gagnez des points et badges

---

**Besoin d'aide ?** Consultez le README.md principal ou créez une issue.
