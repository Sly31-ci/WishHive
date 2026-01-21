# 🎨 REFONTE V2.0 - Plan d'Implémentation

**Date de début**: 2026-01-21  
**Version cible**: V2.0  
**Backup de sécurité**: ✅ v1.5-stable-before-refonte

---

## 🎯 Objectif de la Refonte

Transformer WishHive en une application **moderne, addictive et visuellement impressionnante** en s'inspirant des meilleures applications au monde.

### 🌟 Inspirations Principales

| App | Éléments Empruntés | Impact |
|-----|-------------------|---------|
| **Instagram** | Feed Discovery, Stories, réactions rapides | Engagement social ⭐⭐⭐⭐⭐ |
| **TikTok** | Scroll infini vertical, micro-interactions | Addictivité ⭐⭐⭐⭐⭐ |
| **Pinterest** | Masonry Grid, cards visuelles | Découverte visuelle ⭐⭐⭐⭐⭐ |
| **Notion** | Interface épurée, personnalisation | Expérience utilisateur ⭐⭐⭐⭐ |
| **Airbnb** | Cards premium, design chaleureux | Professionnalisme ⭐⭐⭐⭐⭐ |
| **Stripe** | Glassmorphism, animations subtiles | Modernité ⭐⭐⭐⭐⭐ |

---

## 🚀 Phases d'Implémentation

### **Phase 1: Fondations (Semaine 1)** 🏗️
**Objectif**: Mettre en place le nouveau design system et les outils

#### 1.1 Nouveau Design System V2
- [ ] Créer `theme/v2/colors.ts` avec palette premium
- [ ] Créer `theme/v2/typography.ts` avec Google Fonts (Outfit, Inter)
- [ ] Créer `theme/v2/shadows.ts` avec système de profondeur
- [ ] Créer `theme/v2/animations.ts` avec courbes d'easing
- [ ] Créer `theme/v2/gradients.ts` avec gradients modernes

#### 1.2 Installation Dépendances
```bash
npm install --save \
  @shopify/flash-list \
  lottie-react-native \
  react-native-svg \
  victory-native \
  @react-native-masked-view/masked-view
```

#### 1.3 Composants de Base V2
- [ ] `components/v2/Button.tsx` - Nouveau design avec glassmorphism
- [ ] `components/v2/Card.tsx` - Cards premium avec ombres
- [ ] `components/v2/Input.tsx` - Inputs modernes
- [ ] `components/v2/Badge.tsx` - Badges animés
- [ ] `components/v2/Avatar.tsx` - Avatars avec rings

#### 1.4 Navigation Refonte
- [ ] Nouveau Bottom Tab Bar avec FAB central
- [ ] Animations de transition entre tabs
- [ ] Haptic feedback sur interactions
- [ ] Badge notifications dynamiques

**Livrables Phase 1**:
- ✅ Design System V2 complet
- ✅ Composants de base fonctionnels
- ✅ Navigation moderne avec animations
- ✅ Documentation technique

---

### **Phase 2: Home Feed Discovery (Semaine 2)** 📱
**Objectif**: Créer le nouveau feed addictif style Instagram/TikTok

#### 2.1 Nouveau Layout Home
- [ ] Créer `app/(tabs)/home-v2.tsx`
- [ ] Header minimaliste avec logo + notifications
- [ ] Tabs "For You" / "Following" style TikTok
- [ ] Pull-to-refresh avec animation custom

#### 2.2 Stories Wishlists
- [ ] Composant `components/v2/WishlistStories.tsx`
- [ ] Scroll horizontal avec snap
- [ ] Indicateur 24h (ring progress)
- [ ] Animation d'apparition
- [ ] Création de story depuis création wishlist

#### 2.3 Feed Cards
- [ ] Composant `components/v2/FeedWishlistCard.tsx`
- [ ] Full-width cards avec images hero
- [ ] Galerie d'images (carousel)
- [ ] Réactions rapides (double-tap ❤️)
- [ ] Progress bar visuelle (funded %)
- [ ] Stats en footer (likes, comments, shares)

#### 2.4 Infinite Scroll
- [ ] Intégration `@shopify/flash-list`
- [ ] Pagination automatique
- [ ] Skeleton loaders premium
- [ ] Empty state avec illustration

#### 2.5 Algorithme Feed
- [ ] Feed "For You": trending wishlists
- [ ] Feed "Following": wishlists d'amis
- [ ] Score de pertinence (views, reactions, date)
- [ ] Cache et optimisation

**Livrables Phase 2**:
- ✅ Feed Discovery fonctionnel
- ✅ Stories wishlists 24h
- ✅ Infinite scroll performant
- ✅ Réactions rapides

---

### **Phase 3: Wishlist Visuelle (Semaine 3)** 🎨
**Objectif**: Refonte de la page détail wishlist avec Masonry Grid

#### 3.1 Header Hero
- [ ] Cover image full-width (comme Airbnb)
- [ ] Overlay gradient pour lisibilité
- [ ] Avatar créateur + nom wishlist
- [ ] Bouton back flottant (glassmorphism)

#### 3.2 Stats Bar
- [ ] Progress ring pour % funded
- [ ] Nombre d'items
- [ ] Nombre de contributeurs (avatars stacked)
- [ ] Date de l'événement (countdown)

#### 3.3 Masonry Grid
- [ ] Composant `components/v2/MasonryGrid.tsx`
- [ ] Layout dynamique responsive
- [ ] Lazy loading des images
- [ ] Animation d'apparition staggered
- [ ] Quick preview au tap (modal)

#### 3.4 Quick Actions
- [ ] Floating Action Button (FAB) pour ajouter item
- [ ] Bouton share flottant
- [ ] Bouton edit (owner only)
- [ ] Menu kebab (3 dots)

#### 3.5 Mode Collaboratif
- [ ] Affichage contributeurs en temps réel
- [ ] Indicateur "Someone is viewing"
- [ ] Live updates des réactions
- [ ] Chat flottant (bubble)

**Livrables Phase 3**:
- ✅ Wishlist visuelle premium
- ✅ Masonry Grid performant
- ✅ Quick actions fluides
- ✅ Mode collaboratif live

---

### **Phase 4: Création & Marketplace (Semaine 4)** 🛍️
**Objectif**: Simplifier la création et moderniser le marketplace

#### 4.1 Templates Pré-conçus
- [ ] Écran `app/wishlists/create-v2.tsx`
- [ ] Templates pour chaque événement
- [ ] Preview instantané
- [ ] 1-tap création
- [ ] Smart defaults avec AI

#### 4.2 Multi-step Wizard
- [ ] Step 1: Choix template
- [ ] Step 2: Infos de base (titre, date)
- [ ] Step 3: Personnalisation (theme)
- [ ] Step 4: Privacy settings
- [ ] Step 5: Confirmation
- [ ] Progress indicator en haut

#### 4.3 Marketplace Grid
- [ ] Écran `app/(tabs)/marketplace-v2.tsx`
- [ ] Grid 2 colonnes avec cards
- [ ] Search bar sticky
- [ ] Filter chips horizontaux
- [ ] Infinite scroll
- [ ] Quick add gesture (swipe)

#### 4.4 Product Detail
- [ ] Modal full-screen
- [ ] Galerie images (swipeable)
- [ ] AR Preview (phase future)
- [ ] Reviews et ratings
- [ ] Bouton "Add to Wishlist" sticky
- [ ] Sélection wishlist rapide

**Livrables Phase 4**:
- ✅ Création simplifiée (templates)
- ✅ Wizard multi-étapes
- ✅ Marketplace moderne
- ✅ Product detail premium

---

### **Phase 5: Gamification & Profil (Semaine 5)** 🏆
**Objectif**: Rendre la gamification visible et attractive

#### 5.1 Profil Redesign
- [ ] Écran `app/(tabs)/profile-v2.tsx`
- [ ] Header avec avatar large
- [ ] Username + badge level
- [ ] Bio courte (editable)
- [ ] Stats cards (wishlists, gifts, points)

#### 5.2 Progress Dashboard
- [ ] Level progress bar premium
- [ ] Points actuels / points to next level
- [ ] Graphique progression (Victory charts)
- [ ] Streak counter (jours consécutifs)

#### 5.3 Badges Showcase
- [ ] Grid de badges earned
- [ ] Badges locked (grisés)
- [ ] Animation unlock (Lottie)
- [ ] Modal détail badge au tap
- [ ] Progress vers prochain badge

#### 5.4 Leaderboard
- [ ] Écran `app/leaderboard-v2.tsx`
- [ ] Top 3 avec podium visuel
- [ ] Liste scrollable
- [ ] Filtres (friends, global, weekly)
- [ ] Position utilisateur highlight

#### 5.5 Achievements Flow
- [ ] Toast animé lors de gain badge
- [ ] Confetti animation
- [ ] Sound effect (optionnel)
- [ ] Share achievement sur social

**Livrables Phase 5**:
- ✅ Profil premium
- ✅ Dashboard de progression
- ✅ Badges showcase
- ✅ Leaderboard compétitif

---

## 🎨 Design System V2 - Spécifications

### Couleurs

```typescript
// Gradients Premium
primary: 'linear-gradient(135deg, #FFB937 0%, #7F5BFF 100%)'
secondary: 'linear-gradient(135deg, #7F5BFF 0%, #6B44FF 100%)'
success: 'linear-gradient(135deg, #00B37E 0%, #00E5A0 100%)'

// Glassmorphism
glass: {
  light: 'rgba(255, 255, 255, 0.8)',
  dark: 'rgba(30, 28, 46, 0.8)',
  blur: 20
}

// Shadows
shadow: {
  sm: '0 2px 8px rgba(127, 91, 255, 0.08)',
  md: '0 8px 24px rgba(127, 91, 255, 0.12)',
  lg: '0 16px 48px rgba(127, 91, 255, 0.16)',
  xl: '0 24px 64px rgba(127, 91, 255, 0.20)'
}
```

### Typographie

```typescript
fonts: {
  display: 'Outfit',      // Headers
  body: 'Inter',          // Body text
  mono: 'JetBrains Mono'  // Code/Numbers
}

weights: {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800
}
```

### Animations

```typescript
durations: {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800
}

easings: {
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  linear: 'linear'
}
```

---

## 📊 Métriques de Succès

### Performance
- [ ] Time to Interactive < 2s
- [ ] Scroll à 60 FPS constant
- [ ] Bundle size < 5MB
- [ ] Images optimisées WebP

### UX
- [ ] User satisfaction > 4.5/5
- [ ] Task completion rate > 90%
- [ ] Learning curve < 5min
- [ ] Retention Day 7 > 40%

### Technique
- [ ] 0 erreurs console
- [ ] TypeScript strict mode
- [ ] Test coverage > 70%
- [ ] Lighthouse score > 90

---

## 🛡️ Points de Contrôle

### Avant chaque phase
- [ ] Commit de sauvegarde
- [ ] Tests fonctionnels passent
- [ ] Documentation à jour
- [ ] Review de code

### Après chaque phase
- [ ] Demo fonctionnelle
- [ ] Screenshots/Vidéos
- [ ] User testing
- [ ] Optimisations perfs

---

## 🔄 Rollback Plan

En cas de problème, restaurer V1.5:

```bash
./restore-backup.sh
```

Ou manuellement:

```bash
git checkout backup-before-v2-refonte
npm install
npm run dev
```

---

## 📝 Notes de Développement

### À Préserver de V1
- ✅ Toute la logique métier (services)
- ✅ Base de données (18 tables)
- ✅ Auth system Supabase
- ✅ Gamification logic
- ✅ RLS policies
- ✅ Triggers & Functions

### À Remplacer
- 🔄 Tous les composants UI
- 🔄 Layouts des screens
- 🔄 Animations
- 🔄 Design tokens
- 🔄 Navigation

### À Améliorer
- ⚡ Performance (Flash List)
- ⚡ Animations (Lottie)
- ⚡ UX (micro-interactions)
- ⚡ Visual design (images, gradients)

---

## 🎯 Prochaine Action

**Que voulez-vous que je commence ?**

1. **Phase 1**: Design System V2 + Composants de base
2. **Phase 2**: Home Feed Discovery
3. **Phase 3**: Wishlist Visuelle
4. **Phase 4**: Création & Marketplace
5. **Phase 5**: Gamification & Profil

**Dites-moi par où commencer ! 🚀**
