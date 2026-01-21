/**
 * 🔤 WishHive Design System V2 - Typography
 * 
 * Fonts modernes et professionnelles:
 * - Outfit: Display/Headers (geometric, friendly)
 * - Inter: Body text (highly legible)
 * - JetBrains Mono: Code/Numbers (monospace)
 */

// ============================================
// 🎨 FONT FAMILIES
// ============================================

export const FONTS = {
    display: 'Outfit',           // Headers, titles
    body: 'Inter',               // Body text, paragraphs
    mono: 'JetBrains Mono',      // Code, numbers, monospace

    // Fallbacks
    displayFallback: 'System',
    bodyFallback: 'System',
    monoFallback: 'Courier',
} as const;

// ============================================
// 📏 FONT WEIGHTS
// ============================================

export const WEIGHTS = {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
} as const;

// ============================================
// 📐 FONT SIZES - Mobile First
// ============================================

export const SIZES = {
    // Display sizes (headers)
    display: {
        xl: 48,    // Hero titles
        lg: 40,    // Page titles
        md: 32,    // Section titles
        sm: 28,    // Subsection titles
    },

    // Heading sizes
    heading: {
        xl: 24,    // H1
        lg: 20,    // H2
        md: 18,    // H3
        sm: 16,    // H4
        xs: 14,    // H5
    },

    // Body sizes
    body: {
        lg: 18,    // Large body
        md: 16,    // Default body
        sm: 14,    // Small body
        xs: 12,    // Extra small
    },

    // Caption/Label sizes
    caption: {
        lg: 13,
        md: 12,
        sm: 11,
        xs: 10,
    },
} as const;

// ============================================
// 📏 LINE HEIGHTS
// ============================================

export const LINE_HEIGHTS = {
    // Display line heights (tighter)
    display: {
        xl: 56,    // 1.167
        lg: 48,    // 1.2
        md: 38,    // 1.188
        sm: 34,    // 1.214
    },

    // Heading line heights
    heading: {
        xl: 32,    // 1.333
        lg: 28,    // 1.4
        md: 26,    // 1.444
        sm: 24,    // 1.5
        xs: 20,    // 1.429
    },

    // Body line heights (more relaxed)
    body: {
        lg: 28,    // 1.556
        md: 24,    // 1.5
        sm: 20,    // 1.429
        xs: 18,    // 1.5
    },

    // Caption line heights
    caption: {
        lg: 18,    // 1.385
        md: 16,    // 1.333
        sm: 14,    // 1.273
        xs: 12,    // 1.2
    },
} as const;

// ============================================
// 📝 LETTER SPACING
// ============================================

export const LETTER_SPACING = {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
} as const;

// ============================================
// 🎯 TEXT STYLES - Predefined Combinations
// ============================================

export const TEXT_STYLES = {
    // Display styles
    displayXL: {
        fontFamily: FONTS.display,
        fontSize: SIZES.display.xl,
        lineHeight: LINE_HEIGHTS.display.xl,
        fontWeight: WEIGHTS.bold,
        letterSpacing: LETTER_SPACING.tight,
    },

    displayLG: {
        fontFamily: FONTS.display,
        fontSize: SIZES.display.lg,
        lineHeight: LINE_HEIGHTS.display.lg,
        fontWeight: WEIGHTS.bold,
        letterSpacing: LETTER_SPACING.tight,
    },

    displayMD: {
        fontFamily: FONTS.display,
        fontSize: SIZES.display.md,
        lineHeight: LINE_HEIGHTS.display.md,
        fontWeight: WEIGHTS.semibold,
        letterSpacing: LETTER_SPACING.tight,
    },

    displaySM: {
        fontFamily: FONTS.display,
        fontSize: SIZES.display.sm,
        lineHeight: LINE_HEIGHTS.display.sm,
        fontWeight: WEIGHTS.semibold,
        letterSpacing: LETTER_SPACING.normal,
    },

    // Heading styles
    h1: {
        fontFamily: FONTS.display,
        fontSize: SIZES.heading.xl,
        lineHeight: LINE_HEIGHTS.heading.xl,
        fontWeight: WEIGHTS.bold,
        letterSpacing: LETTER_SPACING.tight,
    },

    h2: {
        fontFamily: FONTS.display,
        fontSize: SIZES.heading.lg,
        lineHeight: LINE_HEIGHTS.heading.lg,
        fontWeight: WEIGHTS.semibold,
        letterSpacing: LETTER_SPACING.normal,
    },

    h3: {
        fontFamily: FONTS.display,
        fontSize: SIZES.heading.md,
        lineHeight: LINE_HEIGHTS.heading.md,
        fontWeight: WEIGHTS.semibold,
        letterSpacing: LETTER_SPACING.normal,
    },

    h4: {
        fontFamily: FONTS.body,
        fontSize: SIZES.heading.sm,
        lineHeight: LINE_HEIGHTS.heading.sm,
        fontWeight: WEIGHTS.semibold,
        letterSpacing: LETTER_SPACING.normal,
    },

    h5: {
        fontFamily: FONTS.body,
        fontSize: SIZES.heading.xs,
        lineHeight: LINE_HEIGHTS.heading.xs,
        fontWeight: WEIGHTS.semibold,
        letterSpacing: LETTER_SPACING.normal,
    },

    // Body styles
    bodyLG: {
        fontFamily: FONTS.body,
        fontSize: SIZES.body.lg,
        lineHeight: LINE_HEIGHTS.body.lg,
        fontWeight: WEIGHTS.regular,
        letterSpacing: LETTER_SPACING.normal,
    },

    body: {
        fontFamily: FONTS.body,
        fontSize: SIZES.body.md,
        lineHeight: LINE_HEIGHTS.body.md,
        fontWeight: WEIGHTS.regular,
        letterSpacing: LETTER_SPACING.normal,
    },

    bodySM: {
        fontFamily: FONTS.body,
        fontSize: SIZES.body.sm,
        lineHeight: LINE_HEIGHTS.body.sm,
        fontWeight: WEIGHTS.regular,
        letterSpacing: LETTER_SPACING.normal,
    },

    bodyXS: {
        fontFamily: FONTS.body,
        fontSize: SIZES.body.xs,
        lineHeight: LINE_HEIGHTS.body.xs,
        fontWeight: WEIGHTS.regular,
        letterSpacing: LETTER_SPACING.normal,
    },

    // Body bold variants
    bodyBold: {
        fontFamily: FONTS.body,
        fontSize: SIZES.body.md,
        lineHeight: LINE_HEIGHTS.body.md,
        fontWeight: WEIGHTS.semibold,
        letterSpacing: LETTER_SPACING.normal,
    },

    bodySMBold: {
        fontFamily: FONTS.body,
        fontSize: SIZES.body.sm,
        lineHeight: LINE_HEIGHTS.body.sm,
        fontWeight: WEIGHTS.semibold,
        letterSpacing: LETTER_SPACING.normal,
    },

    // Caption styles
    caption: {
        fontFamily: FONTS.body,
        fontSize: SIZES.caption.md,
        lineHeight: LINE_HEIGHTS.caption.md,
        fontWeight: WEIGHTS.regular,
        letterSpacing: LETTER_SPACING.wide,
    },

    captionBold: {
        fontFamily: FONTS.body,
        fontSize: SIZES.caption.md,
        lineHeight: LINE_HEIGHTS.caption.md,
        fontWeight: WEIGHTS.semibold,
        letterSpacing: LETTER_SPACING.wide,
    },

    captionSM: {
        fontFamily: FONTS.body,
        fontSize: SIZES.caption.sm,
        lineHeight: LINE_HEIGHTS.caption.sm,
        fontWeight: WEIGHTS.regular,
        letterSpacing: LETTER_SPACING.wider,
    },

    // Label styles (uppercase, bold)
    label: {
        fontFamily: FONTS.body,
        fontSize: SIZES.caption.md,
        lineHeight: LINE_HEIGHTS.caption.md,
        fontWeight: WEIGHTS.bold,
        letterSpacing: LETTER_SPACING.widest,
        textTransform: 'uppercase' as const,
    },

    labelSM: {
        fontFamily: FONTS.body,
        fontSize: SIZES.caption.sm,
        lineHeight: LINE_HEIGHTS.caption.sm,
        fontWeight: WEIGHTS.bold,
        letterSpacing: LETTER_SPACING.widest,
        textTransform: 'uppercase' as const,
    },

    // Monospace styles
    mono: {
        fontFamily: FONTS.mono,
        fontSize: SIZES.body.sm,
        lineHeight: LINE_HEIGHTS.body.sm,
        fontWeight: WEIGHTS.regular,
        letterSpacing: LETTER_SPACING.normal,
    },

    monoSM: {
        fontFamily: FONTS.mono,
        fontSize: SIZES.body.xs,
        lineHeight: LINE_HEIGHTS.body.xs,
        fontWeight: WEIGHTS.regular,
        letterSpacing: LETTER_SPACING.normal,
    },
} as const;

// ============================================
// 📦 EXPORTS
// ============================================

export const TypographyV2 = {
    fonts: FONTS,
    weights: WEIGHTS,
    sizes: SIZES,
    lineHeights: LINE_HEIGHTS,
    letterSpacing: LETTER_SPACING,
    styles: TEXT_STYLES,
} as const;

export default TypographyV2;
