# 🎨 WishHive V2 - Design Specifications

## 📱 Aperçu des Maquettes

Les maquettes complètes ont été générées et se trouvent dans le dossier `.gemini/` :

1. **home_feed_mockup.png** - Écran principal du fil social
2. **wishlist_detail_mockup.png** - Vue détaillée d'une wishlist
3. **marketplace_mockup.png** - Découverte et marketplace
4. **profile_mockup.png** - Profil utilisateur avec gamification
5. **navigation_components.png** - Système de navigation (tabs + headers)
6. **design_system.png** - Charte graphique complète

---

## 🎨 DESIGN SYSTEM - Spécifications Techniques

### Palette de Couleurs

#### Couleurs Principales
```typescript
export const BRAND_COLORS = {
  // Signature WishHive
  honeyGold: '#FFA500',      // Couleur principale, signature
  hivePurple: '#6B44FF',     // Accent social, gamification
  
  // Neutrals
  deepSpace: '#0A0A0A',      // Backgrounds mode sombre
  pureWhite: '#FFFFFF',      // Cards, surfaces
  softCream: '#F8F6F3',      // Background mode clair
  
  // Semantic
  success: '#00D68F',        // Vert menthe moderne
  error: '#FF3B57',          // Rouge vibrant
  warning: '#FFB800',        // Utilise le gold
  info: '#4A90E2',          // Bleu ciel
}
```

#### Gradients
```typescript
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #FFA500 0%, #FF6B6B 100%)',
  subtle: 'linear-gradient(180deg, #F8F6F3 0%, #FFFFFF 100%)',
  dark: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)',
  purple: 'linear-gradient(135deg, #6B44FF 0%, #9D6DFF 100%)',
}
```

#### Gray Scale
```typescript
export const GRAYS = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
}
```

---

### Typography

#### Font Family
```typescript
// iOS
fontFamily: 'SF Pro Display'  // Headers
fontFamily: 'SF Pro Text'     // Body

// Android/Web
fontFamily: 'Inter'
```

#### Type Scale
```typescript
export const FONT_SIZES = {
  display: 32,    // Screen titles
  h1: 28,         // Section headers
  h2: 24,         // Card titles
  h3: 20,         // Subsections
  bodyLg: 17,     // Main content
  body: 15,       // Secondary content
  caption: 13,    // Labels, metadata
  small: 11,      // Badges, counts
}

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

export const LINE_HEIGHTS = {
  tight: 1.2,     // Headers
  normal: 1.5,    // Body
  relaxed: 1.75,  // Long text
}
```

---

### Spacing System

```typescript
export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
}
```

---

### Border Radius

```typescript
export const BORDER_RADIUS = {
  sm: 8,      // Buttons, chips
  md: 12,     // Inputs, small cards
  lg: 16,     // Cards, modals
  xl: 24,     // Hero cards
  full: 9999, // Pills, avatars
}
```

---

### Shadows (Elevation)

```typescript
export const SHADOWS = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: '#FFA500', // Gold glow for FAB
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.20,
    shadowRadius: 48,
    elevation: 12,
  },
}
```

---

## 🧩 COMPOSANTS - Spécifications Détaillées

### 1. Bottom Navigation

```typescript
const BOTTOM_TAB_BAR = {
  height: 64,
  paddingBottom: SAFE_AREA_BOTTOM, // iOS safe area
  backgroundColor: '#FFFFFF',
  backdropBlur: 20,
  opacity: 0.95,
  borderTop: {
    width: 1,
    color: 'rgba(0,0,0,0.05)',
  },
  
  // Icons
  iconSize: 24,
  iconActiveColor: GRADIENTS.primary,
  iconInactiveColor: GRAYS[400],
  
  // Labels
  labelSize: 11,
  labelWeight: '500',
  labelActiveColor: BRAND_COLORS.honeyGold,
  labelInactiveColor: GRAYS[500],
  
  // Tabs
  tabs: [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'discover', icon: 'search', label: 'Discover' },
    { id: 'create', icon: 'plus', label: '', isFAB: true },
    { id: 'wishlists', icon: 'list', label: 'Lists' },
    { id: 'profile', icon: 'user', label: 'Profile' },
  ],
}
```

### 2. Floating Action Button (FAB)

```typescript
const FAB = {
  // Dimensions
  width: 56,
  height: 56,
  borderRadius: 28, // Perfect circle
  
  // Position
  position: 'absolute',
  bottom: 48, // Above tab bar center
  zIndex: 10,
  
  // Style
  background: GRADIENTS.primary,
  shadow: SHADOWS.xl,
  
  // Icon
  iconSize: 28,
  iconColor: '#FFFFFF',
  
  // Animation
  pressScale: 0.95,
  bounceEffect: {
    toValue: 1.02,
    useNativeDriver: true,
    friction: 3,
  },
}
```

### 3. Wishlist Card

```typescript
const WISHLIST_CARD = {
  // Container
  width: '100%',
  aspectRatio: 0.8, // 4:5 ratio (Pinterest-like)
  borderRadius: BORDER_RADIUS.lg,
  shadow: SHADOWS.md,
  overflow: 'hidden',
  
  // Header (gradient)
  header: {
    height: 120,
    background: 'customGradient', // User defined
    padding: SPACING.lg,
  },
  
  // Emoji
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  
  // Title
  title: {
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  
  // Username
  username: {
    fontSize: FONT_SIZES.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Progress Bar
  progress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    fillColor: '#FFFFFF',
    marginVertical: SPACING.md,
  },
  
  // Item Previews
  itemPreview: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  
  // Social Actions
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderTop: `1px solid ${GRAYS[100]}`,
  },
}
```

### 4. Product Card (Marketplace)

```typescript
const PRODUCT_CARD = {
  // Container
  width: '48%', // 2 columns with gap
  borderRadius: BORDER_RADIUS.md,
  backgroundColor: '#FFFFFF',
  shadow: SHADOWS.sm,
  
  // Image
  image: {
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  
  // Price Badge
  priceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: BRAND_COLORS.honeyGold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  
  // Heart Badge
  heartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(10px)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    flexDirection: 'row',
    gap: 4,
  },
  
  // Title (below card)
  title: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semibold,
    color: GRAYS[900],
    marginTop: SPACING.sm,
    numberOfLines: 2,
  },
}
```

### 5. Button Components

#### Primary Button
```typescript
const PRIMARY_BUTTON = {
  height: 52,
  paddingHorizontal: SPACING.lg,
  borderRadius: BORDER_RADIUS.full,
  background: GRADIENTS.primary,
  shadow: SHADOWS.md,
  
  text: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#FFFFFF',
  },
}
```

#### Secondary Button
```typescript
const SECONDARY_BUTTON = {
  height: 52,
  paddingHorizontal: SPACING.lg,
  borderRadius: BORDER_RADIUS.full,
  backgroundColor: 'transparent',
  borderWidth: 2,
  borderColor: BRAND_COLORS.honeyGold,
  
  text: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semibold,
    color: BRAND_COLORS.honeyGold,
  },
}
```

#### Ghost Button
```typescript
const GHOST_BUTTON = {
  paddingHorizontal: SPACING.md,
  paddingVertical: SPACING.sm,
  backgroundColor: 'transparent',
  
  text: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    color: GRAYS[700],
  },
}
```

### 6. Input Field

```typescript
const INPUT_FIELD = {
  height: 56,
  paddingHorizontal: SPACING.md,
  borderRadius: BORDER_RADIUS.md,
  borderWidth: 1,
  borderColor: GRAYS[200],
  backgroundColor: '#FFFFFF',
  
  // Focus state
  focus: {
    borderWidth: 2,
    borderColor: BRAND_COLORS.honeyGold,
    backgroundColor: BRAND_COLORS.softCream,
    shadow: SHADOWS.sm,
  },
  
  // Icon
  icon: {
    size: 20,
    color: GRAYS[400],
    marginRight: SPACING.sm,
  },
  
  // Label (floating)
  label: {
    fontSize: FONT_SIZES.caption,
    color: GRAYS[600],
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
  },
}
```

---

## 📐 LAYOUT - Guidelines

### Screen Padding
```typescript
export const SCREEN_PADDING = {
  horizontal: SPACING.lg,  // 24px
  vertical: SPACING.lg,    // 24px
  top: SPACING.xxl,        // 48px (includes status bar)
}
```

### Grid System
```typescript
export const GRID = {
  columns: 2,              // Product grid
  gap: SPACING.md,         // 16px
  cardMinWidth: 160,
}
```

### Safe Areas
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Apply to:
// - Top: Header height + insets.top
// - Bottom: Tab bar height + insets.bottom
// - Horizontal: Screen padding
```

---

## 🎬 ANIMATIONS - Spécifications

### Timing
```typescript
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
}

export const ANIMATION_EASING = {
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
}
```

### Interactions

#### Card Entrance
```typescript
const cardEntrance = {
  from: {
    opacity: 0,
    translateY: 20,
  },
  to: {
    opacity: 1,
    translateY: 0,
  },
  duration: ANIMATION_DURATION.normal,
  delay: (index) => index * 50, // Stagger
}
```

#### Button Press
```typescript
const buttonPress = {
  from: { scale: 1 },
  to: { scale: 0.95 },
  duration: 100,
  haptic: 'impactLight',
}
```

#### FAB Bounce
```typescript
const fabBounce = {
  from: { scale: 0.95 },
  to: { scale: 1.02 },
  duration: 150,
  spring: true,
  haptic: 'impactMedium',
}
```

#### Like Animation
```typescript
const likeAnimation = {
  scale: [1, 1.2, 0.9, 1],
  rotate: [0, -10, 10, 0],
  duration: 500,
  confetti: true,
  haptic: 'notificationSuccess',
}
```

---

## 🌓 DARK MODE

### Color Overrides
```typescript
export const DARK_MODE_COLORS = {
  background: '#0A0A0A',
  card: '#1A1A1A',
  elevated: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.7)',
  textTertiary: 'rgba(255,255,255,0.5)',
  border: 'rgba(255,255,255,0.08)',
  
  // Reduce saturation
  honeyGold: '#E69500',  // -20% sat
  hivePurple: '#5A39D9', // -20% sat
}
```

### Toggle Implementation
```typescript
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';

// Or manual toggle
const [darkMode, setDarkMode] = useState(false);
```

---

## 📱 ÉCRANS - Structure Détaillée

### 1. Home Feed

```typescript
const HOME_FEED_STRUCTURE = {
  header: {
    height: 56,
    logo: 'WishHive with gradient',
    rightActions: ['search', 'notifications', 'avatar'],
  },
  
  storiesBar: {
    height: 100,
    horizontal: true,
    items: 'user profiles with gradient rings',
  },
  
  feed: {
    type: 'FlatList',
    data: 'wishlists',
    renderItem: 'WishlistCard',
    spacing: SPACING.lg,
    pagination: true,
  },
  
  bottomTab: BOTTOM_TAB_BAR,
}
```

### 2. Wishlist Detail

```typescript
const WISHLIST_DETAIL_STRUCTURE = {
  hero: {
    height: 200,
    gradient: 'custom user theme',
    overlay: ['back button', 'menu'],
  },
  
  stickyProgress: {
    height: 80,
    backgroundColor: '#FFFFFF',
    shadow: SHADOWS.sm,
  },
  
  itemsGrid: {
    type: 'MasonryList',
    columns: 2,
    gap: SPACING.md,
    renderItem: 'ProductCard',
  },
  
  fab: FAB,
}
```

### 3. Marketplace

```typescript
const MARKETPLACE_STRUCTURE = {
  header: {
    title: 'Marketplace',
    search: 'expandable',
  },
  
  filters: {
    type: 'ScrollView horizontal',
    items: ['Popular', 'Newest', 'Trending'],
    component: 'FilterChip',
  },
  
  trending: {
    type: 'ScrollView horizontal',
    component: 'TrendingSection',
  },
  
  grid: {
    type: 'FlatList',
    numColumns: 2,
    data: 'products',
    renderItem: 'ProductCard',
  },
}
```

### 4. Profile

```typescript
const PROFILE_STRUCTURE = {
  cover: {
    height: 120,
    gradient: GRADIENTS.purple,
    pattern: 'hexagons',
  },
  
  avatar: {
    size: 96,
    position: 'absolute',
    top: 72, // Overlap cover
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  
  stats: {
    layout: 'row',
    items: ['lists', 'items', 'followers'],
  },
  
  tabs: {
    items: ['My Lists', 'Saved', 'Activity'],
    indicator: BRAND_COLORS.honeyGold,
  },
  
  content: {
    type: 'TabView',
    renderScene: 'dynamic based on tab',
  },
}
```

---

## ✅ CHECKLIST D'IMPLÉMENTATION

### Phase 1: Foundation
- [ ] Créer `/theme` folder avec nouveau design system
- [ ] Définir toutes les couleurs, fonts, spacing
- [ ] Setup dark mode provider
- [ ] Créer composants de base (Button, Input, Card)

### Phase 2: Navigation
- [ ] Refaire Bottom Navigation avec FAB
- [ ] Créer Headers standardsisés
- [ ] Implémenter gestures (swipe back)
- [ ] Ajouter transitions entre écrans

### Phase 3: Écrans
- [ ] Home Feed redesign
- [ ] Wishlist Detail V2
- [ ] Marketplace refonte
- [ ] Profile avec gamification
- [ ] Settings & Onboarding

### Phase 4: Interactions
- [ ] Animations de base
- [ ] Haptic feedback partout
- [ ] Loading states
- [ ] Empty states
- [ ] Error states

### Phase 5: Polish
- [ ] Micro-animations signature
- [ ] Confetti effects
- [ ] Bee loading animation
- [ ] Performance optimization
- [ ] A11y audit

---

## 📐 MESURES CLÉS (Quick Reference)

```
HEIGHTS:
- Status Bar: ~44px (iOS)
- Header: 56px
- Tab Bar: 64px + safe area
- FAB: 56px diameter
- Button: 52px
- Input: 56px

WIDTHS:
- Screen Padding: 24px
- Card Gap: 16px
- Icon: 24px
- FAB: 56px

RADIUS:
- Buttons: 9999px (pill)
- Cards: 16px
- Inputs: 12px
- Small elements: 8px

SHADOWS:
- Cards: MD (0 4px 16px rgba(0,0,0,0.12))
- FAB: XL with gold glow
- Subtle: XS (0 1px 2px rgba(0,0,0,0.05))
```

---

## 🎨 RESSOURCES

### Figma File
- Créer un fichier Figma avec ces specs
- Inclure toutes les variantes (light/dark)
- Exporter composants en assets

### Assets Needed
- [ ] WishHive logo (SVG)
- [ ] Icon set (24px, 48px, 72px)
- [ ] Bee character animation frames
- [ ] Emoji set for wishlists
- [ ] Pattern backgrounds

### Fonts
- SF Pro (iOS native)
- Inter (download for Android/Web)

---

**🐝 WishHive V2** - Where wishes come alive
