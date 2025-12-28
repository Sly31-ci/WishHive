/**
 * 📏 WishHive Design System - Spacing & Layout Tokens
 * 
 * Système d'espacement 8pt-grid avec respirations Wave-style
 */

// ============================================
// 📐 SPACING SCALE (8pt grid)
// ============================================

export const SPACING = {
    xxs: 4,   // Micro spacing
    xs: 8,    // Tight spacing
    sm: 12,   // Small spacing
    md: 20,   // Medium (était 16, augmenté pour respiration)
    lg: 28,   // Large (était 24)
    xl: 40,   // Extra large (était 32)
    xxl: 56,  // Double XL (était 48)
    xxxl: 72, // Triple XL
} as const;

// ============================================
// 🎨 BORDER RADIUS (Soft & modern)
// ============================================

export const BORDER_RADIUS = {
    none: 0,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36,
    full: 9999, // Pill shape
} as const;

// ============================================
// 📱 LAYOUT CONSTANTS
// ============================================

export const LAYOUT = {
    // Safe areas (pour notches iOS, etc.)
    safeArea: {
        top: 48,
        bottom: 34,
    },

    // Touch targets (iOS HIG & Material guidelines)
    touchTarget: {
        min: 44,        // Minimum légal
        recommended: 56, // Recommandé Wave-style
    },

    // Headers
    headerHeight: 64,
    headerHeightCompact: 56,

    // Tab bar
    tabBarHeight: 64,
    tabBarHeightCompact: 56,

    // Floating Action Button
    fab: {
        size: 56,
        sizeSmall: 44,
        offset: 20,
    },

    // Container max width (tablettes)
    maxWidth: 428,

    // Card padding (respirant)
    cardPadding: 20,
    cardPaddingLarge: 28,

    // Screen horizontal padding
    screenPadding: 20,
    screenPaddingLarge: 28,
} as const;

// ============================================
// 🎭 SHADOWS (Subtils, Wave-style)
// ============================================

export const SHADOWS = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    xs: {
        shadowColor: '#1E1C2E',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: '#1E1C2E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#1E1C2E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#1E1C2E',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: '#1E1C2E',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 12,
    },
} as const;

// ============================================
// 🎬 ANIMATION TIMINGS
// ============================================

export const ANIMATIONS = {
    // Durées (ms)
    duration: {
        instant: 100,
        fast: 150,
        normal: 250,
        slow: 350,
        slower: 500,
    },

    // Easings
    easing: {
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // Scale values
    scale: {
        tap: 0.96,
        press: 0.94,
        bounce: 1.05,
    },
} as const;

// ============================================
// 📐 Z-INDEX HIERARCHY
// ============================================

export const Z_INDEX = {
    base: 0,
    card: 1,
    cardElevated: 2,
    dropdown: 10,
    sticky: 100,
    header: 1000,
    overlay: 2000,
    modal: 3000,
    toast: 4000,
    tooltip: 5000,
} as const;

// ============================================
// 📱 RESPONSIVE BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
    small: 375,    // iPhone SE, petits Android
    medium: 390,   // iPhone 12/13/14
    large: 428,    // iPhone 14 Pro Max
    tablet: 768,   // iPads
} as const;

// ============================================
// 📦 EXPORTS
// ============================================

export default {
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    layout: LAYOUT,
    shadows: SHADOWS,
    animations: ANIMATIONS,
    zIndex: Z_INDEX,
    breakpoints: BREAKPOINTS,
};
