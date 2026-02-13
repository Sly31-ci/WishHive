# 🗺️ WishHive Roadmap

Ce document trace la feuille de route du développement de WishHive, de la conception initiale au lancement et aux évolutions futures.

**Dernière mise à jour** : Février 2026
**Statut Global** : 🚀 Infrastructure locale stable ! Lancement de la Refonte V2.

---

## 🟢 Phase 1 : Fondation & Architecture (Terminée)
- [x] Initialisation Expo (React Native)
- [x] Configuration Supabase (Tables & Auth)
- [x] Configuration RLS & Sécurité

---

## 🟢 Phase 2 : Fonctionnalités Core (Terminée)
- [x] Authentification complète
- [x] Gestion des Wishlists (CRUD)
- [x] Gamification (Points & Badges)

---

## 🟢 Phase 3 : Expérience Développeur (Terminée)
- [x] Mode Dev (Profile Selector)
- [x] Scripts d'automatisation (migrations, RLS)
- [x] Documentation technique consolidée

---

## 🟢 Phase 4 : UX & Polissage (Terminée)
- [x] Correction critique des inputs mobiles (Native UI)
- [x] Optimisation des formulaires de création
- [x] Support des types d'événements personnalisés (Emoji + Label)
- [x] Feedback haptique et animations

---

## 🟢 Phase 5 : Viralité & Web Viewer (Terminée)
- [x] **Web Viewer Public** hosting sur GitHub Pages
- [x] **Universal Links** (iOS) & **App Links** (Android)
- [x] Partage dynamique via QR Code et Native Share
- [x] Support Privacy "Code Only"

---

## 🟡 Phase 6 : Infrastructure & Refonte V2 (En Cours)
- [x] **Environnement Local** : Supabase Local (Docker) & Migration Cloud → Local
- [x] **Dockerisation** : Containerisation complète de l'application Expo
- [ ] **Design System V2** : Implémentation de la nouvelle identité visuelle "Hive Purple"
- [ ] **Magic Add V2** : Optimisation de l'ajout d'items par URL (Simplification extrême)
- [ ] **Social System V2** : Finalisation des notifications et du chat live
- [ ] **Group Gifting (Cagnotte)** : Refonte de l'interface de contribution

---

## 🔵 Phase 7 : Intelligence & Scale (Futur)
- [ ] **AI Gift Stylist** : Suggestions de cadeaux basées sur le profil
- [ ] **Browser Extension** : Ajouter des items depuis n'importe quel site
- [x] **Social System V2** : Chat live, replies, @mentions, reactions
- [ ] **Notifications Push** : Firebase Cloud Messaging (FCM) integration
- [ ] **App Stores** : Soumission finale (App Store & Play Store)

---

## 📊 État des Modules

| Module | Statut | Note |
|--------|--------|------|
| **Infrastructure** | ✅ 100% | Docker + Supabase Local + CI Ready |
| **Wishlist Creation** | ✅ 100% | Native UI + Custom Types |
| **Web Viewer** | ✅ 100% | Live sur GitHub Pages |
| **Deep Linking** | ✅ 100% | Universal & App Links |
| **Social (Chat/Notifs)**| 🟡 85% | Schémas OK, UI à polir |
| **Marketplace** | 🟡 50% | Browsing OK, Checkout reporté post-V2 |
| **Gamification** | ✅ 100% | Points/Badges/Transactions migrés |

---

**Légende** :
- ✅ : Terminé
- 🟡 : En cours
- 🔵 : Projeté

