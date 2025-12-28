/**
 * 🎨 WishHive Design System - Main Export
 * 
 * Point d'entrée unique pour tous les tokens de design.
 * Usage: import { theme } from '@/theme'
 */

import Colors from './colors';
import Typography from './typography';
import Spacing from './spacing';
import SemanticTokens from './semantic';

// ============================================
// 🎨 THEME OBJECT (Central source of truth)
// ============================================

export const theme = {
    // Atomic tokens
    colors: Colors,
    typography: Typography,
    spacing: Spacing.spacing,
    borderRadius: Spacing.borderRadius,
    shadows: Spacing.shadows,
    animations: Spacing.animations,
    layout: Spacing.layout,
    zIndex: Spacing.zIndex,
    breakpoints: Spacing.breakpoints,

    // Semantic tokens (usage contextuel)
    semantic: SemanticTokens,
} as const;

// ============================================
// 🎯 SHORTCUTS (Aliases pratiques)
// ============================================

// Colors - Quick access
export const { light: lightColors, dark: darkColors, brand: brandColors, gray: grayColors } = Colors;

// Typography - Quick access
export const { presets: typographyPresets, sizes: fontSizes, weights: fontWeights } = Typography;

// Spacing - Quick access
export const { spacing, borderRadius, shadows, layout, animations } = Spacing;

// Semantic - Quick access
export const { button: buttonTokens, input: inputTokens, card: cardTokens, badge: badgeTokens, icon: iconTokens } = SemanticTokens;

// ============================================
// 🎨 USAGE CONSTANTS (Backward compatibility)
// ============================================

// Pour migration progressive depuis constants/theme.ts
export const COLORS = lightColors;
export const FONT_SIZES = fontSizes;
export const SPACING = spacing;
export const BORDER_RADIUS = borderRadius;
export const SHADOWS = shadows;
export const LAYOUT = layout;

// ============================================
// 🎯 TYPE EXPORTS
// ============================================

export type Theme = typeof theme;
export type ColorMode = 'light' | 'dark';
export type ColorTokens = typeof lightColors;
export type TypographyPreset = keyof typeof typographyPresets;
export type SpacingValue = keyof typeof spacing;
export type BorderRadiusValue = keyof typeof borderRadius;
export type ShadowValue = keyof typeof shadows;

// ============================================
// 📦 DEFAULT EXPORT
// ============================================

export default theme;
