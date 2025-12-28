# 🎨 WishHive Design System - Guide d'Implémentation

## 📁 Structure Créée

```
theme/
├── colors.ts      # Tokens de couleurs (brand + variants)
├── typography.ts  # Tailles, weights, presets
├── spacing.ts     # Spacing, shadows, layout, animations
├── semantic.ts    # Tokens contextuels (button, input, etc.)
└── index.ts       # Point d'entrée centralisé
```

---

## ✅ Phase 1: TERMINÉE

- ✅ Color tokens (brand + text variants)
- ✅ Typography system
- ✅ Spacing & layout tokens
- ✅ Semantic tokens (button, input, card, badge, icon)
- ✅ Central export

---

## 🚀 Phase 2: Mise à Jour Composants Core

### 2.1 Button Component

**Objectif** : Utiliser les semantic tokens au lieu de couleurs hardcodées

```typescript
// ❌ AVANT (Button.tsx actuel)
backgroundColor: COLORS.primary,  // #E69100 hardcodé
textColor: '#FFFFFF',            // Hardcodé

// ✅ APRÈS (avec theme)
import { buttonTokens } from '@/theme';

backgroundColor: buttonTokens.primary.background,
textColor: buttonTokens.primary.text,
```

**Fichier à modifier** : `components/Button.tsx`

**Modifications** :
1. Importer `buttonTokens` depuis `@/theme`
2. Remplacer toutes les couleurs hardcodées par tokens
3. Utiliser `typography.presets.buttonMedium` pour texte
4. Appliquer `shadows` depuis tokens

---

### 2.2 Text Component (NOUVEAU)

**Objectif** : Créer un composant Text intelligent qui choisit automatiquement le bon contraste

```typescript
// components/Text.tsx
import { theme } from '@/theme';

<Text preset="h1" color="primary">
    // Auto-select: primaryText (#B87100) sur fond clair
    // Auto-select: primary (#FFB84D) sur fond dark
</Text>
```

---

### 2.3 Icon Component (Wrapper)

**Objectif** : Wrapper autour de lucide-react-native avec couleurs cohérentes

```typescript
// components/Icon.tsx
import { iconTokens } from '@/theme';

<Icon 
    name="Heart"
    variant="active"  // Auto → primaryText (#B87100), pas primary!
    size="md"         // Auto → 24px
/>
```

---

### 2.4 Card Component

**Modification** : `components/Card.tsx`

```typescript
// ❌ AVANT
backgroundColor: COLORS.white,
borderRadius: 16,  // Hardcodé
shadow: { shadowColor: '#000', ... },  // Hardcodé

// ✅ APRÈS
import { cardTokens } from '@/theme';

backgroundColor: cardTokens.default.background,
borderRadius: cardTokens.default.borderRadius,
...cardTokens.default.shadow,
```

---

## 🎯 Phase 3: Migration Écrans

### 3.1 Home Screen (`app/(tabs)/index.tsx`)

**Problèmes actuels** :
- Textes utilisant `gray[500]` (ratio insuffisant)
- Icônes utilisant couleurs de marque directement
- Font sizes trop petites

**Corrections** :
```typescript
// ❌ AVANT
<Text style={{ color: COLORS.gray[500] }}>  // Ratio 4.2:1
    Subtitle text
</Text>

// ✅ APRÈS
import { lightColors, typographyPresets } from '@/theme';

<Text style={{ 
    color: lightColors.textSecondary,  // #3D3B47 → Ratio 9.5:1
    ...typographyPresets.bodyMedium 
}}>
    Subtitle text
</Text>
```

---

### 3.2 WishlistCard (`components/WishlistCard.tsx`)

**Problèmes** :
- Icônes `<Eye>`, `<Calendar>` avec `gray[500]`
- Progress bar utilisant primary directement
- Footer trop chargé

**Corrections** :
```typescript
// Icons
<Eye 
    size={iconTokens.sizes.sm}         // 20px
    color={iconTokens.colors.default}  // #52525B (ratio 7.1:1)
/>

// Progress bar (OK d'utiliser brand color)
<View style={{ 
    backgroundColor: brandColors.honeyGlow  // ✨ Brand (fill OK)
}} />

// Métadonnées
<Text style={{ 
    color: lightColors.textTertiary,  // #52525B
    ...typographyPresets.caption 
}}>
    {wishlist.view_count} views
</Text>
```

---

### 3.3 Chat Screen (`app/wishlists/[id]/chat.tsx`)

**Problèmes** :
- @ button peu visible
- Typing indicator subtil
- Send button disabled state flou

**Corrections** :
```typescript
// @ Button
<TouchableOpacity style={{
    backgroundColor: lightColors.hover,  // Brand 8% opacity
    borderRadius: borderRadius.full,
    padding: spacing.sm,
}}>
    <AtSign 
        size={iconTokens.sizes.sm}
        color={iconTokens.colors.active}  // primaryText, pas primary!
    />
</TouchableOpacity>

// Send button disabled
disabled && {
    backgroundColor: buttonTokens.primary.disabled.background,
}
```

---

## 📋 Migration Checklist

### Composants Core
- [ ] `components/Button.tsx` → Semantic tokens
- [ ] `components/Card.tsx` → Semantic tokens
- [ ] `components/Text.tsx` → **CRÉER** (nouveau)
- [ ] `components/Icon.tsx` → **CRÉER** (wrapper)
- [ ] `components/Input.tsx` → Semantic tokens
- [ ] `components/Badge.tsx` → Semantic tokens

### Écrans Prioritaires
- [ ] `app/(tabs)/index.tsx` (Home)
- [ ] `app/(tabs)/wishlists.tsx`
- [ ] `app/wishlists/[id]/index.tsx` (Detail)
- [ ] `app/wishlists/[id]/chat.tsx`
- [ ] `components/WishlistCard.tsx`
- [ ] `components/ProductCard.tsx`

### Vérifications Globales
- [ ] Remplacer tous `COLORS.primary` (texte) → `lightColors.primaryText`
- [ ] Remplacer tous `gray[500]` (texte) → `textSecondary` ou `textTertiary`
- [ ] Remplacer tous hardcoded font sizes → `fontSizes.*` ou `presets.*`
- [ ] Remplacer tous hardcoded spacing → `spacing.*`
- [ ] Remplacer tous hardcoded borderRadius → `borderRadius.*`

---

## 🎯 Règles d'Or

### ❌ JAMAIS FAIRE
```typescript
// ❌ Couleur de marque pour texte
<Text color={brandColors.honeyGlow}>Link</Text>  // Ratio 3.2:1

// ❌ Font size hardcodée
fontSize: 14,

// ❌ Spacing hardcodé
paddingHorizontal: 16,

// ❌ Shadow hardcodée
shadowColor: '#000',
shadowOpacity: 0.1,
```

### ✅ TOUJOURS FAIRE
```typescript
// ✅ Variante texte
<Text color={lightColors.primaryText}>Link</Text>  // Ratio 6.2:1

// ✅ Font size depuis tokens
fontSize: fontSizes.sm,  // ou ...typographyPresets.bodyMedium

// ✅ Spacing depuis tokens
paddingHorizontal: spacing.md,

// ✅ Shadow depuis tokens
...shadows.sm,
```

---

## 🎨 Quick Reference

### Couleurs de Marque (Backgrounds/Boutons uniquement)
```typescript
primary:   brandColors.honeyGlow    // #E69100 ✨
secondary: brandColors.hivePurple   // #6B44FF ✨
accent:    brandColors.mintFresh    // #00B37E ✨
```

### Couleurs Texte (Toujours utiliser)
```typescript
// Texte coloré
primaryText:   lightColors.primaryText    // #B87100 (ratio 6.2:1)
secondaryText: lightColors.secondaryText  // #4A28B8 (ratio 8.1:1)
accentText:    lightColors.accentText     // #007650 (ratio 7.3:1)

// Texte neutre
textPrimary:   lightColors.textPrimary    // #16141F (ratio 14:1)
textSecondary: lightColors.textSecondary  // #3D3B47 (ratio 9.5:1)
textTertiary:  lightColors.textTertiary   // #52525B (ratio 7.1:1)
```

### Icônes
```typescript
default: iconTokens.colors.default        // #52525B (ratio 7.1:1)
active:  iconTokens.colors.active         // #B87100 (primaryText)
subtle:  iconTokens.colors.subtle         // #71717A
```

### Typography Presets
```typescript
h1:          typographyPresets.h1           // 32px, bold
h2:          typographyPresets.h2           // 26px, bold
bodyLarge:   typographyPresets.bodyLarge    // 18px, regular
bodyMedium:  typographyPresets.bodyMedium   // 16px, regular
caption:     typographyPresets.caption      // 14px, regular
```

---

## 🚀 Prochaines Étapes

1. **Implémenter Button.tsx avec semantic tokens**
2. **Créer Text.tsx intelligent**
3. **Créer Icon.tsx wrapper**
4. **Migrer Home screen (proof of concept)**
5. **Script d'audit automatique** (detect hardcoded values)

---

**Status** : Phase 1 (Structure) ✅ TERMINÉE  
**Prochaine** : Phase 2 (Composants) 🔄 EN COURS
