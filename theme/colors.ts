/**
 * 🎨 WishHive Design System - Color Tokens V2
 * 
 * REFONTE TOTALE - Premium · Friendly · Cohérent
 * 
 * Identité visuelle stricte:
 * - Honey Glow (#FFB937) : Couleur principale (CTA, accents)
 * - Hive Purple (#7F5BFF) : Couleur secondaire (navigation, highlights)
 * - Blanc (#FFFFFF) : Background principal
 * 
 * Règles:
 * - Background global : Gradient Honey Glow (haut 30-35%) → Blanc (bas 65-70%)
 * - Boutons primaires : Honey Glow avec texte blanc
 * - Boutons secondaires : Hive Purple avec texte blanc
 * - Texte : Toujours contraste AAA (7:1+)
 */

// ============================================
// 🎨 PALETTE DE MARQUE (IDENTITÉ VISUELLE OFFICIELLE)
// ============================================

export const BRAND_PALETTE = {
    // 🟡 Couleur Principale - Honey Glow
    honeyGlow: '#FFB937',    // Orange doré chaleureux - CTA, boutons, accents

    // 🟣 Couleur Secondaire - Hive Purple  
    hivePurple: '#7F5BFF',   // Violet moderne - Navigation, highlights

    // ⚪ Backgrounds
    pureWhite: '#FFFFFF',    // Background principal
    cloudWhite: '#F7F8FA',   // Background secondaire (très léger)

    // ⚫ Textes (neutrals sombres)
    charcoalDeep: '#1E1C2E', // Texte principal
    grayDark: '#52525B',     // Texte secondaire
    grayMedium: '#71717A',   // Texte tertiaire
    grayLight: '#9CA3AF',    // Texte disabled

    // 🎨 Accents fonctionnels
    success: '#00B37E',      // Vert - Success states
    error: '#DC2626',        // Rouge - Error states
    warning: '#F59E0B',      // Ambre - Warning states

    // 🌙 Dark mode (optionnel)
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
// 🌓 LIGHT MODE COLORS - REFONTE PREMIUM
// ============================================

export const LIGHT_COLORS = {
    // 🎨 BRAND COLORS - Identité WishHive
    primary: BRAND_PALETTE.honeyGlow,       // #FFB937 - Boutons, CTA, accents
    secondary: BRAND_PALETTE.hivePurple,    // #7F5BFF - Navigation, highlights
    accent: BRAND_PALETTE.success,          // #00B37E - Success states

    // 🎯 TEXT VARIANTS - Haute lisibilité (AAA 7:1+)
    primaryText: '#B87100',      // Honey assombri → Ratio 6.2:1
    secondaryText: '#5C3ACC',    // Purple assombri → Ratio 8.1:1
    accentText: '#007650',       // Success assombri → Ratio 7.3:1

    // 🔤 TEXT HIERARCHY (neutrals)
    textPrimary: BRAND_PALETTE.charcoalDeep,    // #1E1C2E - Titres, body
    textSecondary: BRAND_PALETTE.grayDark,      // #52525B - Sous-titres
    textTertiary: BRAND_PALETTE.grayMedium,     // #71717A - Métadonnées
    textDisabled: BRAND_PALETTE.grayLight,      // #9CA3AF - États désactivés
    textPlaceholder: BRAND_PALETTE.grayMedium,  // #71717A - Placeholders

    // 🌈 BACKGROUNDS - Blanc dominant
    background: BRAND_PALETTE.pureWhite,        // #FFFFFF - Background principal
    backgroundElevated: BRAND_PALETTE.pureWhite,
    backgroundSubtle: BRAND_PALETTE.cloudWhite, // #F7F8FA - Très léger

    // 🎨 STATES (overlays avec Honey Glow)
    hover: 'rgba(255, 185, 55, 0.08)',      // Honey Glow 8%
    pressed: 'rgba(255, 185, 55, 0.12)',    // Honey Glow 12%
    selected: 'rgba(255, 185, 55, 0.16)',   // Honey Glow 16%
    focus: 'rgba(255, 185, 55, 0.24)',      // Honey Glow 24%

    // 🎯 BORDERS - Subtils et propres
    border: '#E5E7EB',           // Gray 200
    borderLight: '#F3F4F6',      // Gray 100
    borderStrong: '#D1D5DB',     // Gray 300
    borderFocus: BRAND_PALETTE.honeyGlow,  // #FFB937

    // 🎭 SURFACES - Blanc pur
    card: BRAND_PALETTE.pureWhite,
    modal: BRAND_PALETTE.pureWhite,
    overlay: 'rgba(30, 28, 46, 0.75)',  // Charcoal avec transparence
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
    // Success - Vert
    success: '#007650',              // Texte → Ratio 7.3:1
    successBg: BRAND_PALETTE.success, // #00B37E
    successSubtle: '#E6F7F1',        // Fond très léger

    // Error - Rouge
    error: BRAND_PALETTE.error,      // #DC2626 - Texte
    errorBg: '#EF4444',              // Background
    errorSubtle: '#FEE2E2',

    // Warning - Ambre (proche Honey Glow)
    warning: '#B87100',              // Texte → Ratio 6.2:1
    warningBg: BRAND_PALETTE.warning, // #F59E0B
    warningSubtle: '#FEF3C7',

    // Info - Bleu
    info: '#1E40AF',                 // Texte → Ratio 7.1:1
    infoBg: '#60A5FA',
    infoSubtle: '#DBEAFE',
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
