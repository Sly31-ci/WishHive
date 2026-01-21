/**
 * 🌑 WishHive Design System V2 - Shadows
 * 
 * Système de profondeur avec ombres colorées (pas juste noir)
 * Inspiré par Material Design 3 et iOS
 */

import { BRAND } from './colors';

// ============================================
// 🎨 SHADOW COLORS
// ============================================

const SHADOW_COLORS = {
    // Primary shadows (Honey Glow tint)
    primary: 'rgba(255, 185, 55, 0.25)',
    primaryLight: 'rgba(255, 185, 55, 0.15)',
    primaryDark: 'rgba(255, 185, 55, 0.35)',

    // Secondary shadows (Hive Purple tint)
    secondary: 'rgba(127, 91, 255, 0.25)',
    secondaryLight: 'rgba(127, 91, 255, 0.15)',
    secondaryDark: 'rgba(127, 91, 255, 0.35)',

    // Neutral shadows
    neutral: 'rgba(30, 28, 46, 0.15)',
    neutralLight: 'rgba(30, 28, 46, 0.08)',
    neutralDark: 'rgba(30, 28, 46, 0.25)',

    // Dark mode shadows
    darkMode: 'rgba(0, 0, 0, 0.5)',
    darkModeLight: 'rgba(0, 0, 0, 0.3)',
} as const;

// ============================================
// 📏 SHADOW PRESETS - Light Mode
// ============================================

export const SHADOWS_LIGHT = {
    // No shadow
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },

    // Extra small - Subtle depth
    xs: {
        shadowColor: SHADOW_COLORS.neutralLight,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },

    // Small - Cards, buttons
    sm: {
        shadowColor: SHADOW_COLORS.neutral,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },

    // Medium - Elevated cards
    md: {
        shadowColor: SHADOW_COLORS.neutral,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 8,
    },

    // Large - Modals, sheets
    lg: {
        shadowColor: SHADOW_COLORS.neutralDark,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 24,
        elevation: 12,
    },

    // Extra large - Floating elements
    xl: {
        shadowColor: SHADOW_COLORS.neutralDark,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 1,
        shadowRadius: 32,
        elevation: 16,
    },

    // Colored shadows
    primary: {
        shadowColor: SHADOW_COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 8,
    },

    primaryLarge: {
        shadowColor: SHADOW_COLORS.primaryDark,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 24,
        elevation: 12,
    },

    secondary: {
        shadowColor: SHADOW_COLORS.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 8,
    },

    secondaryLarge: {
        shadowColor: SHADOW_COLORS.secondaryDark,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 24,
        elevation: 12,
    },
} as const;

// ============================================
// 🌙 SHADOW PRESETS - Dark Mode
// ============================================

export const SHADOWS_DARK = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },

    xs: {
        shadowColor: SHADOW_COLORS.darkModeLight,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },

    sm: {
        shadowColor: SHADOW_COLORS.darkMode,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },

    md: {
        shadowColor: SHADOW_COLORS.darkMode,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 8,
    },

    lg: {
        shadowColor: SHADOW_COLORS.darkMode,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 24,
        elevation: 12,
    },

    xl: {
        shadowColor: SHADOW_COLORS.darkMode,
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 1,
        shadowRadius: 32,
        elevation: 16,
    },

    primary: {
        shadowColor: SHADOW_COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 8,
    },

    primaryLarge: {
        shadowColor: SHADOW_COLORS.primaryDark,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 24,
        elevation: 12,
    },

    secondary: {
        shadowColor: SHADOW_COLORS.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 8,
    },

    secondaryLarge: {
        shadowColor: SHADOW_COLORS.secondaryDark,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 24,
        elevation: 12,
    },
} as const;

// ============================================
// 📦 EXPORTS
// ============================================

export const ShadowsV2 = {
    light: SHADOWS_LIGHT,
    dark: SHADOWS_DARK,
    colors: SHADOW_COLORS,
} as const;

export default ShadowsV2;
