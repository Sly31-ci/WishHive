# Architecture Technique - WishHive

## Vue d'ensemble

WishHive est une application mobile cross-platform construite avec React Native et Expo, utilisant Supabase comme backend.

## Stack Technique

### Frontend
- **Framework** : React Native 0.81.4
- **Runtime** : Expo SDK 54
- **Langage** : TypeScript 5.9
- **Navigation** : Expo Router 6.0
- **State Management** : React Context API
- **UI Components** : Custom components + Lucide icons

### Backend
- **BaaS** : Supabase
- **Database** : PostgreSQL
- **Authentication** : Supabase Auth
- **Storage** : Supabase Storage (pour images)
- **Real-time** : Supabase Realtime

### Sécurité
- Row Level Security (RLS) sur toutes les tables
- Authentification JWT
- Policies PostgreSQL pour contrôle d'accès

## Architecture de la Base de Données

### Tables Principales

#### 1. profiles
Profils utilisateurs étendus avec gamification
- Points et niveaux
- Avatar et bio
- Paramètres personnalisés

#### 2. wishlists
Collections de souhaits
- Types d'événements (anniversaire, mariage, etc.)
- Niveaux de confidentialité (public, privé, code)
- Compteur de vues

#### 3. wishlist_items
Produits dans les wishlists
- Référence produit marketplace OU custom
- Priorité (1-5)
- Statut d'achat

#### 4. products
Catalogue marketplace
- Géré par les vendeurs
- Prix, variations, stock
- Images multiples

#### 5. sellers
Boutiques et vendeurs
- Vérification KYC
- Informations de paiement
- Analytics

#### 6. orders
Suivi des achats
- Statuts (pending → confirmed → shipped → delivered)
- Options de livraison
- Mode anonyme

#### 7. badges & user_badges
Système d'achievements
- 4 tiers (bronze, silver, gold, platinum)
- Critères d'obtention
- Récompenses en points

#### 8. reactions
Engagement social
- Types : heart, fire, celebrate, shush
- Mode anonyme supporté

#### 9. follows
Connexions sociales
- Suivre utilisateurs ou vendeurs

#### 10. transactions
Ledger points et récompenses
- Types : earn, spend, refund
- Traçabilité complète

#### 11. notifications
Système d'alertes temps-réel
- Types : follow, like, gift, system
- Statut de lecture et métadonnées

#### 12. friend_circles & circle_members
Organisation sociale
- Cercles privés (Famille, Amis, etc.)
- Gestion des membres par email

#### 13. collaborative_wishlists
Édition partagée
- Rôles : owner, editor, viewer
- Historique d'activités (wishlist_activities)

#### 14. group_gifts & gift_contributions
Cagnotte collective
- Objectif de financement
- Suivi des contributions individuelles

#### 15. chat_rooms & chat_messages
Communication temps-réel
- Salons contextuels (Cercle ou Wishlist)
- Support Supabase Realtime

## Architecture Frontend

### Structure des Dossiers

```
app/
├── (auth)/           # Groupe de routes authentification
│   ├── login.tsx
│   └── signup.tsx
├── (tabs)/           # Navigation principale
│   ├── index.tsx     # Home/Feed
│   ├── wishlists.tsx # Mes wishlists
│   ├── marketplace.tsx
│   └── profile.tsx
└── wishlists/        # Gestion wishlists
    └── create.tsx

components/
├── Badge.tsx         # Affichage achievements
├── Button.tsx        # Bouton réutilisable
├── Card.tsx          # Container de base
├── Input.tsx         # Champ de saisie
├── ProductCard.tsx   # Carte produit
└── WishlistCard.tsx  # Carte wishlist

hooks/
├── useGamification.ts # Points, badges, transactions
├── useProducts.ts     # Marketplace
└── useWishlists.ts    # CRUD wishlists

lib/
├── supabase.ts       # Client Supabase
├── utils.ts          # Fonctions utilitaires
├── haptics.ts        # Retour haptique
└── sharing.ts        # Partage wishlists
```

### Flux de Données

1. **Authentification**
   ```
   User → AuthContext → Supabase Auth → Profile Creation
   ```

2. **Création Wishlist**
   ```
   User Input → useWishlists.createWishlist() → Supabase → RLS Check → Insert
   ```

3. **Gamification**
   ```
   Action → useGamification.awardPoints() → Transaction Insert → Profile Update
   ```

4. **Chat & Temps-Réel**
   ```
   Message → chatService.sendMessage() → Supabase Insert → Realtime Broadcast → Subscriber Update
   ```

## Patterns de Code

### Custom Hooks
Tous les appels Supabase sont encapsulés dans des hooks :
- Séparation des préoccupations
- Réutilisabilité
- Gestion d'état cohérente

### Context API
- `AuthContext` : État d'authentification global
- Évite prop drilling
- Single source of truth

### TypeScript
- Types stricts pour database
- Interfaces pour tous les composants
- Type safety end-to-end

## Sécurité

### Row Level Security (RLS)

Exemples de policies :

```sql
-- Users peuvent voir leurs propres wishlists
CREATE POLICY "Owners can view own wishlists"
  ON wishlists FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- Wishlists publiques visibles par tous
CREATE POLICY "Public wishlists are viewable by all"
  ON wishlists FOR SELECT
  TO authenticated
  USING (privacy = 'public' AND is_active = true);
```

### Validation
- Contraintes CHECK en database
- Validation côté client avec TypeScript
- Sanitization des inputs

## Performance

### Optimisations Database
- Index sur colonnes fréquemment requêtées
- Full-text search indexes
- Pagination des résultats

### Optimisations Frontend
- Lazy loading des images
- Memoization avec React.memo
- Debouncing des recherches

## Déploiement

### Web
```bash
npm run build:web
# → Génère dist/ statique
```

### Mobile
```bash
eas build --platform ios
eas build --platform android
# → Génère .ipa et .apk
```

## Monitoring & Analytics

### Implémenté
- **Sentry** : Error tracking en production
- **Mixpanel** : Analytics comportemental
- **Expo Haptics** : Feedback tactile foundation
- **Deep Linking** : Routage via scheme `wishhive://`

### À implémenter
- Test de charge et scalabilité
- A/B testing framework
- Performance monitoring avancé (Flashlight)

## Évolutions Futures

### Phase 3
- Paiements intégrés (Stripe)
- Recommandations IA
- App desktop (Electron)
- Extensions navigateur
- API publique
- Webhooks pour intégrations

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024
