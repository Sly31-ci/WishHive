/**
 * 📏 WishHive Design System V2 - Spacing
 * 
 * Système d'espacement cohérent basé sur une échelle de 4px
 * Inspiré par Tailwind CSS et Material Design
 */

// ============================================
// 📐 BASE UNIT
// ============================================

const BASE_UNIT = 4;

// ============================================
// 📏 SPACING SCALE
// ============================================

export const SPACING = {
    // Extra small
    xxs: BASE_UNIT * 1,      // 4px
    xs: BASE_UNIT * 2,       // 8px

    // Small
    sm: BASE_UNIT * 3,       // 12px
    md: BASE_UNIT * 4,       // 16px

    // Medium
    lg: BASE_UNIT * 5,       // 20px
    xl: BASE_UNIT * 6,       // 24px

    // Large
    xxl: BASE_UNIT * 8,      // 32px
    xxxl: BASE_UNIT * 10,    // 40px

    // Extra large
    huge: BASE_UNIT * 12,    // 48px
    massive: BASE_UNIT * 16, // 64px
} as const;

// ============================================
// 📐 BORDER RADIUS
// ============================================

export const RADIUS = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,  // Fully rounded
} as const;

// ============================================
// 📏 CONTAINER SIZES
// ============================================

export const CONTAINER = {
    // Max widths for content
    xs: 320,
    sm: 480,
    md: 640,
    lg: 768,
    xl: 1024,
    xxl: 1280,

    // Padding
    paddingHorizontal: SPACING.lg,  // 20px
    paddingVertical: SPACING.md,    // 16px
} as const;

// ============================================
// 🎯 ICON SIZES
// ============================================

export const ICON_SIZES = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 40,
    huge: 48,
} as const;

// ============================================
// 🎯 AVATAR SIZES
// ============================================

export const AVATAR_SIZES = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    xxl: 80,
    huge: 120,
} as const;

// ============================================
// 🎯 BUTTON HEIGHTS
// ============================================

export const BUTTON_HEIGHTS = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
    hero: 64,
} as const;

// ============================================
// 🎯 INPUT HEIGHTS
// ============================================

export const INPUT_HEIGHTS = {
    sm: 36,
    md: 44,
    lg: 52,
} as const;

// ============================================
// 📦 EXPORTS
// ============================================

export const SpacingV2 = {
    spacing: SPACING,
    radius: RADIUS,
    container: CONTAINER,
    iconSizes: ICON_SIZES,
    avatarSizes: AVATAR_SIZES,
    buttonHeights: BUTTON_HEIGHTS,
    inputHeights: INPUT_HEIGHTS,
} as const;

export default SpacingV2;
