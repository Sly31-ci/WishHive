/**
 * 🔤 WishHive Design System - Typography Tokens
 * 
 * Optimisé pour:
 * - Lisibilité mobile maximale
 * - Hiérarchie claire
 * - Accessibilité WCAG AAA
 */

import { TextStyle } from 'react-native';

// ============================================
// 📏 FONT SIZES (Augmentés pour mobile)
// ============================================

export const FONT_SIZES = {
    xxs: 13,  // Minimum absolu (badges, tags)
    xs: 14,   // Métadonnées, captions
    sm: 16,   // Corps de texte minimum recommandé
    md: 18,   // Corps de texte confortable
    lg: 22,   // Sous-titres, section headers
    xl: 26,   // Titres principaux
    xxl: 32,  // Headers, page titles
    xxxl: 40, // Hero titles
    huge: 56, // CTA ultra-large (rare)
} as const;

// ============================================
// 📐 LINE HEIGHTS (Respirants)
// ============================================

export const LINE_HEIGHTS = {
    tight: 1.2,    // Titres serrés
    normal: 1.4,   // Titres normaux
    relaxed: 1.6,  // Corps de texte
    loose: 1.8,    // Texte aéré (paragraphes)
} as const;

// ============================================
// 💪 FONT WEIGHTS
// ============================================

export const FONT_WEIGHTS = {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    extrabold: '800' as TextStyle['fontWeight'],
} as const;

// ============================================
// 🎨 TYPOGRAPHY PRESETS (Wave-style)
// ============================================

export const TYPOGRAPHY = {
    // 📰 DISPLAY (Hero sections)
    displayLarge: {
        fontSize: FONT_SIZES.huge,
        lineHeight: FONT_SIZES.huge * LINE_HEIGHTS.tight,
        fontWeight: FONT_WEIGHTS.bold,
        letterSpacing: -0.5,
    },
    displayMedium: {
        fontSize: FONT_SIZES.xxxl,
        lineHeight: FONT_SIZES.xxxl * LINE_HEIGHTS.tight,
        fontWeight: FONT_WEIGHTS.bold,
        letterSpacing: -0.3,
    },
    displaySmall: {
        fontSize: FONT_SIZES.xxl,
        lineHeight: FONT_SIZES.xxl * LINE_HEIGHTS.normal,
        fontWeight: FONT_WEIGHTS.bold,
    },

    // 📝 HEADINGS
    h1: {
        fontSize: FONT_SIZES.xxl,
        lineHeight: FONT_SIZES.xxl * LINE_HEIGHTS.normal,
        fontWeight: FONT_WEIGHTS.bold,
    },
    h2: {
        fontSize: FONT_SIZES.xl,
        lineHeight: FONT_SIZES.xl * LINE_HEIGHTS.normal,
        fontWeight: FONT_WEIGHTS.bold,
    },
    h3: {
        fontSize: FONT_SIZES.lg,
        lineHeight: FONT_SIZES.lg * LINE_HEIGHTS.normal,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    h4: {
        fontSize: FONT_SIZES.md,
        lineHeight: FONT_SIZES.md * LINE_HEIGHTS.normal,
        fontWeight: FONT_WEIGHTS.semibold,
    },

    // 📄 BODY TEXT
    bodyLarge: {
        fontSize: FONT_SIZES.md,
        lineHeight: FONT_SIZES.md * LINE_HEIGHTS.relaxed,
        fontWeight: FONT_WEIGHTS.regular,
    },
    bodyMedium: {
        fontSize: FONT_SIZES.sm,
        lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.relaxed,
        fontWeight: FONT_WEIGHTS.regular,
    },
    bodySmall: {
        fontSize: FONT_SIZES.xs,
        lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.relaxed,
        fontWeight: FONT_WEIGHTS.regular,
    },

    // 🏷️ LABELS & UI
    labelLarge: {
        fontSize: FONT_SIZES.sm,
        lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.normal,
        fontWeight: FONT_WEIGHTS.medium,
    },
    labelMedium: {
        fontSize: FONT_SIZES.xs,
        lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.normal,
        fontWeight: FONT_WEIGHTS.medium,
    },
    labelSmall: {
        fontSize: FONT_SIZES.xxs,
        lineHeight: FONT_SIZES.xxs * LINE_HEIGHTS.normal,
        fontWeight: FONT_WEIGHTS.medium,
    },

    // 📌 CAPTIONS
    caption: {
        fontSize: FONT_SIZES.xs,
        lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.normal,
        fontWeight: FONT_WEIGHTS.regular,
    },
    captionBold: {
        fontSize: FONT_SIZES.xs,
        lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.normal,
        fontWeight: FONT_WEIGHTS.semibold,
    },

    // 🔘 BUTTON TEXT
    buttonLarge: {
        fontSize: FONT_SIZES.md,
        lineHeight: FONT_SIZES.md * LINE_HEIGHTS.tight,
        fontWeight: FONT_WEIGHTS.semibold,
        letterSpacing: 0.3,
    },
    buttonMedium: {
        fontSize: FONT_SIZES.sm,
        lineHeight: FONT_SIZES.sm * LINE_HEIGHTS.tight,
        fontWeight: FONT_WEIGHTS.semibold,
        letterSpacing: 0.2,
    },
    buttonSmall: {
        fontSize: FONT_SIZES.xs,
        lineHeight: FONT_SIZES.xs * LINE_HEIGHTS.tight,
        fontWeight: FONT_WEIGHTS.medium,
    },
} as const;

// ============================================
// 🎯 HELPER: Get responsive font size
// ============================================

export const getResponsiveFontSize = (
    base: number,
    screenWidth: number
): number => {
    // iPhone SE (375px) et moins: -2px
    if (screenWidth < 375) {
        return Math.max(base - 2, 13); // Min 13px
    }
    // iPhone 14 Pro Max (428px) et plus: +2px
    if (screenWidth > 428) {
        return base + 2;
    }
    // Standard (375-428px): size par défaut
    return base;
};

// ============================================
// 📦 EXPORTS
// ============================================

export type TypographyPreset = keyof typeof TYPOGRAPHY;

export default {
    sizes: FONT_SIZES,
    lineHeights: LINE_HEIGHTS,
    weights: FONT_WEIGHTS,
    presets: TYPOGRAPHY,
    getResponsiveSize: getResponsiveFontSize,
};
