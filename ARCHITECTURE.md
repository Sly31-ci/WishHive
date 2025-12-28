# Architecture Technique - WishHive

## Vue d'ensemble

WishHive est une application hybride composée d'une application mobile cross-platform (React Native/Expo) et d'un Web Viewer statique (GitHub Pages) pour le partage public des wishlists. Supabase sert de backend unifié.

## Stack Technique

### Frontend (Mobile)
- **Framework** : React Native (Expo SDK 54)
- **Navigation** : Expo Router v4+
- **Langage** : TypeScript
- **State Management** : React Context API (Auth, Toast, Badges)
- **Animations** : React Native Reanimated v3
- **Haptics** : Expo Haptics

### Frontend (Web Viewer)
- **Hosting** : GitHub Pages (`https://Sly31-ci.github.io/WishHive/`)
- **Techno** : Vanilla HTML5 / CSS3 / JavaScript (optimisé pour mobile)
- **Integration** : Supabase JS Client (Read-only via RLS)
- **SEO** : Dynamic Meta Tags via JavaScript & GitHub Pages structure

### Backend
- **BaaS** : Supabase
- **Database** : PostgreSQL (15+ tables)
- **Authentication** : Supabase Auth (OTP, Email, Social)
- **Storage** : Supabase Storage (Produits, Avatars)
- **Real-time** : Supabase Realtime (Chat, Cagnotte, Live Interactions, Notifications)

### Sécurité
- Row Level Security (RLS) sur TOUTES les tables (Public read-only pour wishlists publiques)
- Authentification JWT
- Contraintes CHECK en DB pour l'intégrité des types (ex: type_not_empty)

## Architecture de la Base de Données

Les tables principales incluent : `profiles`, `wishlists`, `wishlist_items`, `products`, `sellers`, `orders`, `badges`, `reactions`, `follows`, `transactions`, `notifications`, `friend_circles`, `chat_messages`, `group_gifts`.

## Architecture Frontend (Dossiers)

```
project/
├── app/                    # Routes mobiles (Expo Router)
├── components/            # Composants UI React Native
├── docs/                  # Documentation & Web Viewer
│   ├── .well-known/      # AssetLinks (Android) & AASA (iOS)
│   ├── project_history/   # Archives et rapports
│   └── w/                 # Web Viewer Wishlist publique
├── scripts/               # Scripts utilitaires & Migrations
├── lib/                   # Logique métier & Client Supabase
└── supabase/              # Configuration & SQL
```

## Deep Linking & Universal Links

WishHive supporte le routage inter-plateforme :
- **Custom Scheme** : `wishhive://wishlists/[id]`
- **Universal Links (iOS)** : `https://Sly31-ci.github.io/WishHive/w/?id=[id]`
- **App Links (Android)** : `https://Sly31-ci.github.io/WishHive/w/?id=[id]`

##patterns de Code

### Custom Hooks
Encapsulation systématique de la logique Supabase pour la réutilisabilité et la gestion d'erreur centralisée.

### Native UI for Inputs
Les formulaires critiques (ex: Création de wishlist) utilisent des `TextInput` natifs directs pour garantir une expérience mobile fluide (clavier réactif, focus stable).

## Sécurité & RLS

Toute la donnée est protégée par des politiques RLS strictes :
- **Wishlists Privées** : Uniquement accessibles par le `owner_id`.
- **Wishlists Publiques** : Accessibles en `SELECT` pour `anon` et `authenticated`.
- **Écriture** : Uniquement pour l'utilisateur authentifié propriétaire.

## Performance
- Optimisation des index PostgreSQL pour le filtrage par type et privacy.
- Cache Metro nettoyé et scripts optimisés pour le développement.
- Web Viewer ultra-léger sans framework lourd pour une vitesse de chargement maximale.

---

**Version** : 1.1.0  
**Dernière mise à jour** : Décembre 2024 / Janvier 2025

