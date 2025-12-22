# 🗺️ WishHive Roadmap

Ce document trace la feuille de route du développement de WishHive, de la conception initiale au lancement et aux évolutions futures.

**Dernière mise à jour** : 22 Décembre 2025
**Statut Global** : 🚀 Phase 5 (Fonctionnalités Avancées) complétée à 80%

---

## 🟢 Phase 1 : Fondation & Architecture (Terminée)
**Objectif** : Mettre en place les bases solides du projet.

- [x] **Initialisation du projet**
  - [x] Création projet Expo (React Native)
  - [x] Configuration TypeScript
  - [x] Installation des dépendances (Expo Router, Lucide, etc.)
  - [x] Configuration ESLint/Prettier

- [x] **Architecture Backend (Supabase)**
  - [x] Modélisation de la base de données (12 tables)
  - [x] Création des migrations SQL
  - [x] Configuration des Row Level Security (RLS)
  - [x] Triggers pour l'automatisation (points, timestamps)

- [x] **Structure Frontend**
  - [x] Mise en place Expo Router (File-based routing)
  - [x] Création des contextes (AuthContext)
  - [x] Création des hooks personnalisés (useWishlists, useGamification)
  - [x] Composants UI de base (Button, Input, Card)

---

## 🟢 Phase 2 : Fonctionnalités Core (Terminée)
**Objectif** : Implémenter les fonctionnalités essentielles de l'application.

- [x] **Authentification**
  - [x] Login / Signup / Logout
  - [x] Gestion de session persistante
  - [x] **Correction** : Bug de création de profil (Trigger fix)

- [x] **Gestion des Wishlists**
  - [x] Création de listes (titre, type, confidentialité)
  - [x] Ajout d'items (produits ou custom)
  - [x] Affichage et détails des listes
  - [x] Suppression et modification

- [x] **Marketplace & Vendeurs**
  - [x] Profils vendeurs
  - [x] Catalogue produits
  - [x] Dashboard vendeur (mockup)

- [x] **Gamification**
  - [x] Système de points et niveaux
  - [x] Badges et achievements
  - [x] Leaderboard

---

## 🟡 Phase 3 : Expérience Développeur & Tests (En Cours)
**Objectif** : Faciliter le développement et assurer la stabilité.

- [x] **Mode Développement**
  - [x] Variable d'environnement `EXPO_PUBLIC_DEV_MODE`
  - [x] Système de profils mockés (User, Seller, Admin)
  - [x] Sélecteur de profil flottant
  - [x] Bypass authentification en dev

- [x] **Vérification Système**
  - [x] Script de test connexion Supabase (`test-supabase.js`)
  - [x] Rapport de connexion (`SUPABASE_CONNECTION_REPORT.md`)
  - [x] Documentation du mode Dev (`MODE_DEV.md`)

---

## 🟠 Phase 4 : Lancement & Vérification (À Faire)
**Objectif** : Tester l'application en conditions réelles et corriger les bugs.

- [x] **Tests Utilisateurs**
  - [x] Création de compte réel
  - [x] Parcours complet : Créer wishlist -> Ajouter item -> Partager
  - [x] Parcours achat : Voir wishlist -> Choisir cadeau -> "Acheter"

- [x] **Tests Vendeurs**
  - [x] Inscription vendeur
  - [x] Création de produit
  - [x] Gestion des commandes

- [x] **Polissage UI/UX**
  - [x] Animations de transition (Reanimated)
  - [x] Feedback visuel (Toasts, Loaders, Skeleton)
  - [x] Empty states (écrans vides)
  - [x] Mode sombre (vérification complète)
  - [x] **P1 Haptics** : Foundation haptiques sur tous les boutons
  - [x] **P2 Offline** : Système de cache pour consultation hors-ligne

---

## 🔵 Phase 5 : Fonctionnalités Avancées (Futur)
**Objectif** : Enrichir l'application avec des fonctionnalités "Wow".

- [x] **Social & Viralité**
  - [x] Partage natif (iOS/Android sheet)
  - [x] Génération d'images OG pour les liens partagés
  - [x] Notifications Réelles (Database + Push foundations)
  - [x] **Social V2** : Cagnotte collective et Chat temps-réel

- [ ] **Paiement & Commandes**
  - [ ] Intégration Stripe (Paiements réels)
  - [ ] Gestion des adresses de livraison
  - [ ] Suivi de commande temps réel

- [x] **IA & Smart Features**
  - [x] Scanner de reçus (OCR) pour validation par image
  - [ ] Suggestions de cadeaux par IA
  - [ ] Parsing automatique de liens (Scraping)

---

## 🟣 Phase 6 : Production & Scale
**Objectif** : Préparer l'application pour les stores.

- [ ] **Optimisation**
  - [ ] Performance audit (Lighthouse/Flashlight)
  - [ ] Optimisation des images (CDN)
  - [ ] Code splitting & Lazy loading

- [ ] **Déploiement**
  - [ ] Configuration EAS Build
  - [ ] Soumission Apple App Store
  - [ ] Soumission Google Play Store
  - [ ] Landing page web

---

## 📊 Vue d'ensemble des Écrans Implémentés

| Module | Écrans | Statut |
|--------|--------|--------|
| **Auth** | Login, Signup | ✅ Prêt |
| **Tabs** | Home, Wishlists, Marketplace, Profile | ✅ Prêt |
| **Wishlists** | Create, Edit, Details, Add Item | ✅ Prêt |
| **Social** | Leaderboard, Notifications, Friend Circles | ✅ Prêt |
| **Seller** | Dashboard, Profile, Product Details | ✅ Prêt |
| **User** | Public Profile, Settings, Rewards | ✅ Prêt |
| **Purchase** | One-Click Gift, Split Pay | ✅ Prêt |

---

**Légende** :
- ✅ : Terminé et fonctionnel
- 🟡 : En cours / Partiellement fonctionnel
- 🟠 : À faire prochainement
- 🔵 : Prévu pour plus tard
