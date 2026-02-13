# Architecture Technique - WishHive

## Vue d'ensemble

WishHive est une application hybride composée d'une application mobile cross-platform (React Native/Expo) et d'un Web Viewer statique (GitHub Pages). Le backend est basé sur Supabase, avec un environnement de développement local entièrement dockerisé.

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

### Backend & Infrastructure
- **BaaS** : Supabase (Cloud & Local via Docker)
- **Database** : PostgreSQL (Architecture modulaire en schémas)
- **Authentication** : Supabase Auth (JWT, OTP, Emails via Inbucket)
- **Storage** : Supabase Storage (S3-compatible)
- **Containerization** : Docker Compose (App + Backend Local)

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
├── components/            # Composants UI (Design System V2)
├── database/              # SQL & Migrations
│   └── schema/           # Schémas modulaires (core, chat, notifications...)
├── docs/                  # Documentation & Web Viewer
├── scripts/               # Scripts d'automatisation (Import, Migration, Tests)
├── lib/                   # Services & Provider Supabase
├── Dockerfile             # Configuration container Frontend
└── docker-compose.yml     # Orchestration Infrastructure locale
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

**Version** : 1.5.0  
**Dernière mise à jour** : Février 2026

