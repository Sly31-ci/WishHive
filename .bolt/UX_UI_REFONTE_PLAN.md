# 📱 WishHive - Plan de Refonte UX/UI

## 🎯 Objectif
Refonte complète du FRONT-END inspirée des super-apps modernes (Wave, Yango) pour une interface plus simple, lisible, moderne et responsive.

---

## 🔍 Analyse des Problèmes Actuels

### ❌ Problèmes identifiés dans le code actuel :

#### 1. **Header surchargé** (Home Screen)
- **Ligne 77-96** : Header contient 4 éléments (Greeting, Search, Notifications, Points Badge)
- Problème : Trop dense, manque de hiérarchie visuelle
- Impact : Utilisateur perdu, ne sait pas où regarder en premier

#### 2. **Actions multiples** (Home Screen)
- **Ligne 110-146** : Section "Quick Actions" avec 3+ boutons
- Problème : Trop d'options dès l'arrivée
- Impact : Paralysie du choix, interface encombrée

#### 3. **Cards trop denses** (Marketplace)
- **Ligne 299-337** : ProductCard avec beaucoup d'informations
- Problème : Image + titre + prix + badge de popularité
- Impact : Visuellement chargé, difficile à scanner

#### 4. **Profile Screen complexe** (Profile)
- **Ligne 168-258** : Header avec avatar + username + bio + stats + edit
- Problème : Trop d'éléments dans une seule section
- Impact : Difficile de comprendre la hiérarchie

#### 5. **Footer avec 2 CTA** (Product Detail)
- **Ligne 227-241** : 2 boutons égaux ("Add to Wishlist" + "Buy Now")
- Problème : Pas d'action principale claire
- Impact : Utilisateur ne sait pas quoi faire en priorité

#### 6. **Modals complexes**
- **Ligne 244-292** (Product Detail) : Modal de sélection de wishlist
- Problème : Trop d'étapes pour une action simple
- Impact : Friction dans le parcours utilisateur

#### 7. **Manque d'espacement**
- Spacing trop serré sur mobile (SPACING.md = 16)
- Impact : Éléments coupés sur petits écrans

---

## 🎨 Principes de la Refonte

### Inspirations : Wave, Yango, Super-apps modernes

1. **1 écran = 1 objectif principal**
2. **Maximum 2-3 actions visibles**
3. **Hiérarchie visuelle extrême** (80% espace, 20% contenu clé)
4. **Actions secondaires cachées** (menus, swipes, bottom sheets)
5. **CTA unique et massif** par écran
6. **Navigation par gestes** (swipe, pull-to-refresh)
7. **Feedback visuel immédiat**

---

## 🛠️ Refonte Écran par Écran

### 1. 🏠 Home Screen (index.tsx)

#### Avant :
- Header avec 4 éléments
- Section Quick Actions avec 3 boutons
- Trending Wishlists horizontal
- Level Card en bas

#### Après :
```
┌─────────────────────────────────┐
│  👋 Hi, Username!               │ <- Simplifié
│  Your wishes today              │
│                          🔔 (3) │ <- Badge notification uniquement
├─────────────────────────────────┤
│                                 │
│    🎯 CREATE WISHLIST           │ <- CTA principal UNIQUE
│    [Bouton géant centré]        │
│                                 │
├─────────────────────────────────┤
│  🔥 Trending Now                │
│  ┌─────┐ ┌─────┐ ┌─────┐       │ <- Cards simplifiées
│  │ Img │ │ Img │ │ Img │       │
│  │Title│ │Title│ │Title│       │
│  └─────┘ └─────┘ └─────┘       │
├─────────────────────────────────┤
│  Level 5 ━━━━━━━○ 80%          │ <- Minimaliste
└─────────────────────────────────┘
```

**Changements clés** :
- ✅ Suppression Search et Points du header (dans menu)
- ✅ 1 seul CTA principal : "Create Wishlist"
- ✅ Trending ultra-simplifié (image + titre only)
- ✅ Level bar inline, pas de card séparée
- ✅ Espacement massif entre sections

---

### 2. 🛍️ Marketplace Screen (marketplace.tsx)

#### Avant :
- Search bar permanente
- 5 filtres horizontaux
- Grid 2 colonnes dense

#### Après :
```
┌─────────────────────────────────┐
│  Marketplace          🔍        │ <- Search en icône
├─────────────────────────────────┤
│  🔥 Popular  ✨ New  💰 Price   │ <- 3 filtres max
├─────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐     │
│  │          │ │          │     │ <- Cards aérées
│  │   IMG    │ │   IMG    │     │
│  │          │ │          │     │
│  │ Title    │ │ Title    │     │
│  │ $99      │ │ $79      │     │
│  └──────────┘ └──────────┘     │
│                                 │
│  ┌──────────┐ ┌──────────┐     │
│  │   ...    │ │   ...    │     │
└─────────────────────────────────┘
```

**Changements clés** :
- ✅ Search hidden par défaut (tap icon pour afficher)
- ✅ 3 filtres essentiels uniquement
- ✅ Cards plus grandes, moins d'info
- ✅ Suppression badge popularité (trop de bruit)
- ✅ Gap entre cards augmenté

---

### 3. 👤 Profile Screen (profile.tsx)

#### Avant :
- Avatar + Edit + Username + Bio + Stats en une section
- Menu items avec icônes multiples

#### Après :
```
┌─────────────────────────────────┐
│         ⚙️                      │ <- Settings en haut
│                                 │
│        ┌─────────┐              │
│        │ Avatar  │              │ <- Avatar géant
│        └─────────┘              │
│                                 │
│      @username                  │
│      Bio here...                │
│                                 │
│   🔥 500 pts • Level 5 • 🏆 12  │ <- Stats inline
│                                 │
├─────────────────────────────────┤
│  My Wishlists              →    │ <- Menu simplifié
│  Seller Dashboard          →    │
│  My Orders                 →    │
│  Sign Out                  →    │
└─────────────────────────────────┘
```

**Changements clés** :
- ✅ Avatar 2x plus grand
- ✅ Stats en ligne horizontale
- ✅ Suppression section badges (dans écran dédié)
- ✅ Menu ultra-simple avec texte + flèche
- ✅ Edit profile = tap sur avatar

---

### 4. 📦 Product Detail ([id].tsx)

#### Avant :
- 2 CTA égaux en footer
- Modal de sélection wishlist

#### Après :
```
┌─────────────────────────────────┐
│ ←                          ⋮    │ <- Menu 3 dots
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │      Image Gallery      │   │ <- Fullscreen
│  │      • • •              │   │
│  └─────────────────────────┘   │
│                                 │
│  Product Title                  │
│  $99.99                         │
│                                 │
│  Description here...            │
│                                 │
└─────────────────────────────────┘
│  💜 ADD TO WISHLIST             │ <- CTA unique géant
└─────────────────────────────────┘
```

**Changements clés** :
- ✅ 1 seul CTA : "Add to Wishlist" (primaire)
- ✅ "Buy Now" déplacé dans menu 3 dots
- ✅ Auto-add à wishlist favorite (pas de modal)
- ✅ Image plein écran
- ✅ Seller info déplacée dans description

---

### 5. 📝 Wishlist Detail

#### Après :
```
┌─────────────────────────────────┐
│ ←  My Birthday Wishlist    ⋮   │
├─────────────────────────────────┤
│  ┌─────┐                        │
│  │ IMG │ Item 1         $99  ☐  │ <- Checkbox simple
│  └─────┘                        │
│  ┌─────┐                        │
│  │ IMG │ Item 2         $49  ☐  │
│  └─────┘                        │
│  ┌─────┐                        │
│  │ IMG │ Item 3         $29  ☐  │
│  └─────┘                        │
└─────────────────────────────────┘
│  ➕ Add Item                    │ <- FAB style
└─────────────────────────────────┘
```

**Changements clés** :
- ✅ Liste ultra-simple (image + nom + prix + status)
- ✅ Swipe gauche pour delete
- ✅ Swipe droite pour purchased
- ✅ Pas de boutons visibles (gestures)
- ✅ FAB pour ajouter

---

## 🎨 Nouveau Design System

### Spacing augmenté (mobile-first)
```typescript
export const SPACING_V2 = {
  xs: 6,    // +2
  sm: 12,   // +4
  md: 20,   // +4
  lg: 28,   // +4
  xl: 40,   // +8
  xxl: 56,  // +8
};
```

### Font sizes optimisés
```typescript
export const FONT_SIZES_V2 = {
  xs: 13,   // +1
  sm: 15,   // +1
  md: 17,   // +1
  lg: 20,   // +2
  xl: 24,   // +4
  xxl: 28,  // +4
  xxxl: 36, // +4
  huge: 56, // +8
};
```

### Border radius plus doux
```typescript
export const BORDER_RADIUS_V2 = {
  sm: 12,   // +4
  md: 16,   // +4
  lg: 20,   // +4
  xl: 28,   // +4
  full: 9999,
};
```

### Components simplifiés
- **Button** : Hauteur min 56px (vs 48)
- **Card** : Padding 24px (vs 16)
- **Input** : Hauteur 52px (vs 44)
- **Header** : Hauteur 64px (vs 56)

---

## 📐 Règles de Responsive

### Petits écrans (< 375px)
- Font size -2px partout
- Spacing -4px partout
- 1 colonne forcée
- Images ratio 16:9 (vs square)

### Moyens écrans (375-428px) ✅ STANDARD
- Design par défaut
- 2 colonnes sur grids

### Grands écrans (> 428px)
- Max width 428px, centré
- Ou 3 colonnes sur grids

---

## ✨ Animations & Feedback

### Micro-animations
- **Tap** : Scale 0.96 (100ms)
- **Swipe** : Translate + haptic
- **Load** : Skeleton screens (pas de spinners)
- **Success** : Bounce + confetti
- **Error** : Shake + vibration

### Transitions
- **Navigation** : Slide (300ms, easeOutCubic)
- **Modal** : SlideUp + Fade backdrop
- **Cards** : FadeIn staggered (offset 50ms)

---

## 🎯 Métriques de Succès

### Avant Refonte
- ❌ Header : 4 éléments
- ❌ Home : 3+ CTA
- ❌ Product : 2 CTA égaux
- ❌ Marketplace : 5 filtres
- ❌ Spacing : 16px

### Après Refonte
- ✅ Header : 2 éléments max
- ✅ Home : 1 CTA principal
- ✅ Product : 1 CTA unique
- ✅ Marketplace : 3 filtres
- ✅ Spacing : 24px+

---

## 📋 Plan d'Exécution

### Phase 1 : Design System
1. Créer `constants/theme-v2.ts`
2. Créer composants v2 :
   - `ButtonV2.tsx`
   - `CardV2.tsx`
   - `HeaderV2.tsx`

### Phase 2 : Écrans Core
1. Refonte `app/(tabs)/index.tsx`
2. Refonte `app/(tabs)/marketplace.tsx`
3. Refonte `app/(tabs)/profile.tsx`

### Phase 3 : Écrans Détails
1. Refonte `app/product/[id].tsx`
2. Refonte `app/wishlists/[id]/index.tsx`

### Phase 4 : Écrans Secondaires
1. Refonte settings, notifications, etc.

---

## 🚀 Début de l'implémentation

Prêt à démarrer la Phase 1 ! 🎨
