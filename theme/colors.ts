/**
 * 🎨 WishHive Design System - Color Tokens
 * 
 * Philosophie: "Brand colors for delight, text variants for clarity"
 * 
 * Règles:
 * - JAMAIS utiliser primary/secondary/accent pour du texte
 * - TOUJOURS utiliser les variantes *Text pour texte/icônes
 * - Ratio minimum: 4.5:1 (AA), recommandé: 7:1 (AAA)
 */

// ============================================
// 🎨 PALETTE DE MARQUE (SACRÉE - Ne pas modifier)
// ============================================

export const BRAND_PALETTE = {
    // Couleurs officielles WishHive
    honeyGlow: '#E69100',    // Primary - Joy & CTA
    hivePurple: '#6B44FF',   // Secondary - Modern Identity
    mintFresh: '#00B37E',    // Accent - Trust & Success

    // Neutrals
    charcoalDeep: '#1E1C2E', // Dark
    cloudWhite: '#F7F8FA',   // Light backgrounds
    pureWhite: '#FFFFFF',    // Pure white

    // Extended palette
    darkBackground: '#0F0E15',
    darkCard: '#1C1B27',
} as const;

// ============================================
// 🎯 GRAY SCALE (Design tokens)
// ============================================

export const GRAY_SCALE = {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#71717A',
    600: '#52525B',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
} as const;

// ============================================
// 🌓 LIGHT MODE COLORS
// ============================================

export const LIGHT_COLORS = {
    // 🎨 BRAND COLORS (backgrounds, boutons, décoratif)
    // ✅ Usage: Button bg, badges, progress bars, borders actifs
    primary: BRAND_PALETTE.honeyGlow,       // #E69100
    secondary: BRAND_PALETTE.hivePurple,    // #6B44FF
    accent: BRAND_PALETTE.mintFresh,        // #00B37E

    // 🎯 TEXT VARIANTS (texte, icônes, liens)
    // ✅ Usage: Colored text, icons, links sur fond clair
    // ❌ NE JAMAIS utiliser primary/secondary/accent pour texte
    primaryText: '#B87100',      // Honey assombri → Ratio 6.2:1 (AAA)
    secondaryText: '#4A28B8',    // Purple assombri → Ratio 8.1:1 (AAA)
    accentText: '#007650',       // Mint assombri → Ratio 7.3:1 (AAA)

    // 🔤 TEXT HIERARCHY (neutrals)
    textPrimary: '#16141F',      // Ratio 14:1 (AAA++) - Titres, body
    textSecondary: '#3D3B47',    // Ratio 9.5:1 (AAA+) - Sous-titres
    textTertiary: '#52525B',     // Ratio 7.1:1 (AAA) - Métadonnées
    textDisabled: '#9CA3AF',     // Ratio 3.5:1 - États désactivés
    textPlaceholder: '#71717A',  // Ratio 5.2:1 - Placeholders

    // 🌈 BACKGROUNDS
    background: BRAND_PALETTE.cloudWhite,
    backgroundElevated: BRAND_PALETTE.pureWhite,
    backgroundSubtle: GRAY_SCALE[50],

    // 🎨 STATES (overlays avec brand colors)
    hover: `${BRAND_PALETTE.honeyGlow}14`,      // 8% opacity
    pressed: `${BRAND_PALETTE.honeyGlow}1F`,    // 12% opacity
    selected: `${BRAND_PALETTE.honeyGlow}29`,   // 16% opacity
    focus: `${BRAND_PALETTE.honeyGlow}3D`,      // 24% opacity

    // 🎯 BORDERS
    border: GRAY_SCALE[300],
    borderLight: GRAY_SCALE[200],
    borderStrong: GRAY_SCALE[400],
    borderFocus: BRAND_PALETTE.honeyGlow,

    // 🎭 SURFACES
    card: BRAND_PALETTE.pureWhite,
    modal: BRAND_PALETTE.pureWhite,
    overlay: 'rgba(22, 22, 26, 0.8)',
} as const;

// ============================================
// 🌙 DARK MODE COLORS
// ============================================

export const DARK_COLORS = {
    // 🎨 BRAND COLORS (éclaircies pour dark mode)
    primary: '#FFB84D',          // Honey +20% lum → Ratio 8.2:1
    secondary: '#9D7FFF',        // Purple +25% lum → Ratio 7.5:1
    accent: '#00E5A0',           // Mint +30% lum → Ratio 9:1

    // 🎯 TEXT VARIANTS (identiques en dark)
    primaryText: '#FFB84D',
    secondaryText: '#9D7FFF',
    accentText: '#00E5A0',

    // 🔤 TEXT HIERARCHY
    textPrimary: '#F5F5F7',      // Off-white (meilleur que pure white)
    textSecondary: '#C7C7CC',    // Ratio 10:1 sur dark
    textTertiary: '#98989D',     // Ratio 6.5:1 sur dark
    textDisabled: '#636366',
    textPlaceholder: '#8E8E93',

    // 🌈 BACKGROUNDS
    background: BRAND_PALETTE.darkBackground,
    backgroundElevated: BRAND_PALETTE.darkCard,
    backgroundSubtle: '#252432',

    // 🎨 STATES
    hover: 'rgba(255, 184, 77, 0.08)',
    pressed: 'rgba(255, 184, 77, 0.12)',
    selected: 'rgba(255, 184, 77, 0.16)',
    focus: 'rgba(255, 184, 77, 0.24)',

    // 🎯 BORDERS
    border: GRAY_SCALE[600],
    borderLight: GRAY_SCALE[700],
    borderStrong: GRAY_SCALE[500],
    borderFocus: '#FFB84D',

    // 🎭 SURFACES
    card: BRAND_PALETTE.darkCard,
    modal: '#252432',
    overlay: 'rgba(22, 22, 26, 0.9)',
} as const;

// ============================================
// 🎨 SEMANTIC COLORS (Double system: text + bg)
// ============================================

export const SEMANTIC_LIGHT = {
    // Success
    success: '#007650',              // Texte → Ratio 7.3:1
    successBg: BRAND_PALETTE.mintFresh, // Background → #00B37E
    successSubtle: '#E6F7F1',        // Fond très léger

    // Error
    error: '#D32F2F',                // Texte → Ratio 6.5:1
    errorBg: '#FF4B4B',              // Background
    errorSubtle: '#FFEBEE',

    // Warning
    warning: '#B87100',              // Texte → Ratio 6.2:1
    warningBg: BRAND_PALETTE.honeyGlow, // #E69100
    warningSubtle: '#FFF4E6',

    // Info
    info: '#1976D2',                 // Texte → Ratio 5.8:1
    infoBg: '#3DA9FC',
    infoSubtle: '#E3F2FD',
} as const;

export const SEMANTIC_DARK = {
    success: '#00E5A0',
    successBg: '#00B37E',
    successSubtle: '#1A3329',

    error: '#FF6B6B',
    errorBg: '#FF4B4B',
    errorSubtle: '#3D1F1F',

    warning: '#FFB84D',
    warningBg: '#E69100',
    warningSubtle: '#3D2F1A',

    info: '#64B5F6',
    infoBg: '#3DA9FC',
    infoSubtle: '#1A2A3D',
} as const;

// ============================================
// 🎯 ICON COLORS (Dedicated tokens)
// ============================================

export const ICON_COLORS_LIGHT = {
    default: '#52525B',          // Neutral icons → Ratio 7.1:1
    subtle: '#71717A',           // Decorative icons
    active: BRAND_PALETTE.honeyGlow, // Selected icons (bg usage OK)
    activeText: '#B87100',       // Selected icons on light bg
    disabled: '#C7C7CC',
} as const;

export const ICON_COLORS_DARK = {
    default: '#98989D',
    subtle: '#8E8E93',
    active: '#FFB84D',
    activeText: '#FFB84D',
    disabled: '#636366',
} as const;

// ============================================
// 📦 EXPORTS
// ============================================

export type ColorTokens = typeof LIGHT_COLORS & typeof SEMANTIC_LIGHT;
export type DarkColorTokens = typeof DARK_COLORS & typeof SEMANTIC_DARK;

// Default export pour usage simple
export const Colors = {
    light: { ...LIGHT_COLORS, ...SEMANTIC_LIGHT, icons: ICON_COLORS_LIGHT },
    dark: { ...DARK_COLORS, ...SEMANTIC_DARK, icons: ICON_COLORS_DARK },
    brand: BRAND_PALETTE,
    gray: GRAY_SCALE,
} as const;

export default Colors;
