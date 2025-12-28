/**
 * 🎯 WishHive Design System - Semantic Design Tokens
 * 
 * Layer d'abstraction sémantique au-dessus des tokens atomiques.
 * Usage contextuel intelligent des couleurs.
 */

import Colors from './colors';
import { TYPOGRAPHY } from './typography';
import { SPACING, BORDER_RADIUS, SHADOWS } from './spacing';

// ============================================
// 📦 LAYOUT HELPERS
// ============================================

const { cardPadding, screenPadding, touchTarget } = {
    cardPadding: 20,
    screenPadding: 20,
    touchTarget: { min: 44, recommended: 56 }
};

export const LAYOUT = {
    cardPadding,
    screenPadding,
    touchTarget,
} as const;

// ============================================
// 🔘 BUTTON TOKENS (Semantic)
// ============================================

export const BUTTON_TOKENS = {
    // Primary CTA
    primary: {
        background: Colors.brand.honeyGlow,      // #E69100 ✨ Brand
        text: Colors.light.backgroundElevated,   // White
        border: 'transparent',
        shadow: SHADOWS.md,
        typography: TYPOGRAPHY.buttonMedium,

        hover: {
            background: '#CF7D00', // -10% lum
        },
        pressed: {
            background: '#B87100', // -15% lum
        },
        disabled: {
            background: Colors.gray[200],
            text: Colors.gray[400],
        },
    },

    // Secondary
    secondary: {
        background: Colors.brand.hivePurple,     // #6B44FF ✨ Brand
        text: Colors.light.backgroundElevated,
        border: 'transparent',
        shadow: SHADOWS.md,
        typography: TYPOGRAPHY.buttonMedium,

        hover: {
            background: '#5932D9',
        },
        pressed: {
            background: '#4A28B8',
        },
        disabled: {
            background: Colors.gray[200],
            text: Colors.gray[400],
        },
    },

    // Outline (brand color sur border)
    outline: {
        background: 'transparent',
        text: Colors.light.primaryText,          // #B87100 (variant haute visibilité)
        border: Colors.brand.honeyGlow,          // #E69100 ✨ Brand
        shadow: SHADOWS.none,
        typography: TYPOGRAPHY.buttonMedium,

        hover: {
            background: Colors.light.hover,       // Brand 8%
        },
        pressed: {
            background: Colors.light.pressed,     // Brand 12%
        },
        disabled: {
            border: Colors.gray[200],
            text: Colors.gray[400],
        },
    },

    // Ghost (subtil)
    ghost: {
        background: 'transparent',
        text: Colors.light.textPrimary,
        border: 'transparent',
        shadow: SHADOWS.none,
        typography: TYPOGRAPHY.buttonMedium,

        hover: {
            background: Colors.gray[100],
        },
        pressed: {
            background: Colors.gray[200],
        },
        disabled: {
            text: Colors.gray[400],
        },
    },

    // Danger
    danger: {
        background: Colors.light.errorBg,        // #FF4B4B
        text: Colors.light.backgroundElevated,
        border: 'transparent',
        shadow: SHADOWS.md,
        typography: TYPOGRAPHY.buttonMedium,

        hover: {
            background: '#E63939',
        },
        pressed: {
            background: '#D32F2F',
        },
        disabled: {
            background: Colors.gray[200],
            text: Colors.gray[400],
        },
    },
} as const;

// ============================================
// 📝 INPUT TOKENS
// ============================================

export const INPUT_TOKENS = {
    default: {
        background: Colors.light.card,
        text: Colors.light.textPrimary,
        placeholder: Colors.light.textPlaceholder,
        border: Colors.light.inputBorder,        // gray[400]
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        typography: TYPOGRAPHY.bodyMedium,
        minHeight: 56,                            // Touch-friendly
    },

    focused: {
        borderColor: Colors.brand.honeyGlow,     // #E69100 ✨ Brand
        borderWidth: 2,
        shadow: SHADOWS.sm,
    },

    error: {
        borderColor: Colors.light.error,
        borderWidth: 2,
    },

    disabled: {
        background: Colors.gray[100],
        text: Colors.light.textDisabled,
        borderColor: Colors.light.borderLight,
    },
} as const;

// ============================================
// 🎴 CARD TOKENS
// ============================================

export const CARD_TOKENS = {
    default: {
        background: Colors.light.card,
        border: Colors.light.borderLight,
        borderRadius: BORDER_RADIUS.lg,
        padding: LAYOUT.cardPadding,              // 20px
        shadow: SHADOWS.sm,
    },

    elevated: {
        background: Colors.light.card,
        border: 'transparent',
        borderRadius: BORDER_RADIUS.lg,
        padding: LAYOUT.cardPadding,
        shadow: SHADOWS.md,
    },

    interactive: {
        background: Colors.light.card,
        border: 'transparent',
        borderRadius: BORDER_RADIUS.lg,
        padding: LAYOUT.cardPadding,
        shadow: SHADOWS.sm,

        hover: {
            shadow: SHADOWS.md,
        },
        pressed: {
            shadow: SHADOWS.xs,
            background: Colors.gray[50],
        },
    },
} as const;

// ============================================
// 🏷️ BADGE TOKENS
// ============================================

export const BADGE_TOKENS = {
    // Brand badges (couleurs de marque)
    primary: {
        background: Colors.brand.honeyGlow,      // #E69100 ✨
        text: Colors.light.backgroundElevated,
        borderRadius: BORDER_RADIUS.full,
        padding: { horizontal: SPACING.sm, vertical: SPACING.xxs },
        typography: TYPOGRAPHY.labelSmall,
    },

    secondary: {
        background: Colors.brand.hivePurple,     // #6B44FF ✨
        text: Colors.light.backgroundElevated,
        borderRadius: BORDER_RADIUS.full,
        padding: { horizontal: SPACING.sm, vertical: SPACING.xxs },
        typography: TYPOGRAPHY.labelSmall,
    },

    // Semantic badges (variants texte pour subtilité)
    success: {
        background: Colors.light.successSubtle,
        text: Colors.light.success,              // #007650
        borderRadius: BORDER_RADIUS.full,
        padding: { horizontal: SPACING.sm, vertical: SPACING.xxs },
        typography: TYPOGRAPHY.labelSmall,
    },

    error: {
        background: Colors.light.errorSubtle,
        text: Colors.light.error,
        borderRadius: BORDER_RADIUS.full,
        padding: { horizontal: SPACING.sm, vertical: SPACING.xxs },
        typography: TYPOGRAPHY.labelSmall,
    },

    warning: {
        background: Colors.light.warningSubtle,
        text: Colors.light.warning,
        borderRadius: BORDER_RADIUS.full,
        padding: { horizontal: SPACING.sm, vertical: SPACING.xxs },
        typography: TYPOGRAPHY.labelSmall,
    },

    // Neutral badge
    neutral: {
        background: Colors.gray[100],
        text: Colors.light.textSecondary,
        borderRadius: BORDER_RADIUS.full,
        padding: { horizontal: SPACING.sm, vertical: SPACING.xxs },
        typography: TYPOGRAPHY.labelSmall,
    },
} as const;

// ============================================
// 🎨 ICON TOKENS (Contextual)
// ============================================

export const ICON_TOKENS = {
    sizes: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 28,
        xl: 32,
    },

    colors: {
        // Icônes neutres
        default: Colors.light.icons.default,      // #52525B (ratio 7.1:1)
        subtle: Colors.light.icons.subtle,        // #71717A

        // Icônes actives (utiliser variantes texte)
        active: Colors.light.primaryText,         // #B87100 (pas primary!)
        activeSecondary: Colors.light.secondaryText,
        activeAccent: Colors.light.accentText,

        // États
        disabled: Colors.light.icons.disabled,

        // Semantic
        success: Colors.light.success,
        error: Colors.light.error,
        warning: Colors.light.warning,
        info: Colors.light.info,
    },
} as const;

// ============================================
// 📦 EXPORTS
// ============================================

export const SemanticTokens = {
    button: BUTTON_TOKENS,
    input: INPUT_TOKENS,
    card: CARD_TOKENS,
    badge: BADGE_TOKENS,
    icon: ICON_TOKENS,
    layout: LAYOUT,
} as const;

export default SemanticTokens;
