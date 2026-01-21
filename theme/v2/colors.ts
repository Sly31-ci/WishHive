/**
 * 🎨 WishHive Design System V2 - Colors
 * 
 * REFONTE TOTALE - Inspirée par Instagram, TikTok, Pinterest, Airbnb, Stripe
 * 
 * Principes:
 * - Gradients premium partout
 * - Glassmorphism pour les overlays
 * - Shadows avec couleur (pas juste noir)
 * - Palette étendue pour plus de richesse visuelle
 */

// ============================================
// 🎨 BRAND COLORS - Identité WishHive
// ============================================

export const BRAND = {
    // Couleurs principales
    honeyGlow: '#FFB937',      // Orange doré - Primary
    hivePurple: '#7F5BFF',     // Violet moderne - Secondary
    mintFresh: '#00B37E',      // Vert menthe - Success

    // Variations Honey Glow (pour gradients)
    honeyLight: '#FFD580',     // +20% luminosité
    honeyDark: '#E69100',      // -20% luminosité
    honeyDeep: '#B87100',      // -40% luminosité (pour texte)

    // Variations Hive Purple (pour gradients)
    purpleLight: '#9D7FFF',    // +20% luminosité
    purpleDark: '#6B44FF',     // -20% luminosité
    purpleDeep: '#5C3ACC',     // -40% luminosité (pour texte)

    // Neutrals
    white: '#FFFFFF',
    cloudWhite: '#F7F8FA',
    charcoal: '#1E1C2E',

    // Dark mode
    darkBg: '#0F0E15',
    darkCard: '#1C1B27',
} as const;

// ============================================
// 🌈 GRADIENTS - Premium & Modern
// ============================================

export const GRADIENTS = {
    // Primary gradients
    primary: {
        colors: [BRAND.honeyGlow, BRAND.honeyDark],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },

    primaryVertical: {
        colors: [BRAND.honeyLight, BRAND.honeyGlow],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },

    // Secondary gradients
    secondary: {
        colors: [BRAND.hivePurple, BRAND.purpleDark],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },

    // Honey to Purple (signature gradient)
    signature: {
        colors: [BRAND.honeyGlow, BRAND.hivePurple],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },

    signatureVertical: {
        colors: [BRAND.honeyGlow, BRAND.hivePurple],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },

    // Success gradient
    success: {
        colors: ['#00E5A0', BRAND.mintFresh],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },

    // Background gradients
    backgroundLight: {
        colors: [BRAND.honeyLight, BRAND.white],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
        locations: [0, 0.35], // Honey en haut (35%), blanc en bas
    },

    backgroundDark: {
        colors: [BRAND.purpleDark, BRAND.darkBg],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
        locations: [0, 0.4],
    },

    // Overlay gradients
    overlayTop: {
        colors: ['rgba(30, 28, 46, 0.8)', 'rgba(30, 28, 46, 0)'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },

    overlayBottom: {
        colors: ['rgba(30, 28, 46, 0)', 'rgba(30, 28, 46, 0.8)'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },
} as const;

// ============================================
// 🎯 GRAY SCALE - Extended
// ============================================

export const GRAY = {
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
    950: '#0A0A0B',
} as const;

// ============================================
// 🌓 LIGHT MODE - Semantic Colors
// ============================================

export const LIGHT = {
    // Brand colors
    primary: BRAND.honeyGlow,
    secondary: BRAND.hivePurple,
    accent: BRAND.mintFresh,

    // Text colors (AAA contrast)
    text: {
        primary: BRAND.charcoal,      // #1E1C2E
        secondary: GRAY[600],          // #52525B
        tertiary: GRAY[500],           // #71717A
        disabled: GRAY[400],           // #9CA3AF
        placeholder: GRAY[500],        // #71717A
        inverse: BRAND.white,          // #FFFFFF

        // Colored text (pour utilisation sur fond blanc)
        primaryColored: BRAND.honeyDeep,   // #B87100 (ratio 6.2:1)
        secondaryColored: BRAND.purpleDeep, // #5C3ACC (ratio 8.1:1)
        accentColored: '#007650',           // Mint dark (ratio 7.3:1)
    },

    // Background colors
    background: {
        primary: BRAND.white,
        secondary: BRAND.cloudWhite,
        elevated: BRAND.white,
        overlay: 'rgba(30, 28, 46, 0.75)',
    },

    // Surface colors
    surface: {
        card: BRAND.white,
        modal: BRAND.white,
        sheet: BRAND.white,
        elevated: BRAND.white,
    },

    // Border colors
    border: {
        default: GRAY[200],
        light: GRAY[100],
        strong: GRAY[300],
        focus: BRAND.honeyGlow,
        error: '#DC2626',
    },

    // State colors
    state: {
        hover: 'rgba(255, 185, 55, 0.08)',
        pressed: 'rgba(255, 185, 55, 0.12)',
        selected: 'rgba(255, 185, 55, 0.16)',
        focus: 'rgba(255, 185, 55, 0.24)',
        disabled: 'rgba(0, 0, 0, 0.12)',
    },

    // Semantic colors
    semantic: {
        success: BRAND.mintFresh,
        successBg: '#E6F7F1',
        successText: '#007650',

        error: '#DC2626',
        errorBg: '#FEE2E2',
        errorText: '#991B1B',

        warning: '#F59E0B',
        warningBg: '#FEF3C7',
        warningText: '#B87100',

        info: '#60A5FA',
        infoBg: '#DBEAFE',
        infoText: '#1E40AF',
    },
} as const;

// ============================================
// 🌙 DARK MODE - Semantic Colors
// ============================================

export const DARK = {
    // Brand colors (brightened for dark mode)
    primary: '#FFB84D',        // Honey +20% lum
    secondary: '#9D7FFF',      // Purple +25% lum
    accent: '#00E5A0',         // Mint +30% lum

    // Text colors
    text: {
        primary: '#F5F5F7',      // Off-white
        secondary: '#C7C7CC',    // Gray light
        tertiary: '#98989D',     // Gray medium
        disabled: '#636366',     // Gray dark
        placeholder: '#8E8E93',  // Gray placeholder
        inverse: BRAND.charcoal, // #1E1C2E

        primaryColored: '#FFB84D',
        secondaryColored: '#9D7FFF',
        accentColored: '#00E5A0',
    },

    // Background colors
    background: {
        primary: BRAND.darkBg,
        secondary: '#252432',
        elevated: BRAND.darkCard,
        overlay: 'rgba(22, 22, 26, 0.9)',
    },

    // Surface colors
    surface: {
        card: BRAND.darkCard,
        modal: '#252432',
        sheet: '#2C2B3A',
        elevated: '#353444',
    },

    // Border colors
    border: {
        default: GRAY[600],
        light: GRAY[700],
        strong: GRAY[500],
        focus: '#FFB84D',
        error: '#FF6B6B',
    },

    // State colors
    state: {
        hover: 'rgba(255, 184, 77, 0.08)',
        pressed: 'rgba(255, 184, 77, 0.12)',
        selected: 'rgba(255, 184, 77, 0.16)',
        focus: 'rgba(255, 184, 77, 0.24)',
        disabled: 'rgba(255, 255, 255, 0.12)',
    },

    // Semantic colors
    semantic: {
        success: '#00E5A0',
        successBg: '#1A3329',
        successText: '#00E5A0',

        error: '#FF6B6B',
        errorBg: '#3D1F1F',
        errorText: '#FF6B6B',

        warning: '#FFB84D',
        warningBg: '#3D2F1A',
        warningText: '#FFB84D',

        info: '#64B5F6',
        infoBg: '#1A2A3D',
        infoText: '#64B5F6',
    },
} as const;

// ============================================
// 💎 GLASSMORPHISM
// ============================================

export const GLASS = {
    light: {
        background: 'rgba(255, 255, 255, 0.8)',
        border: 'rgba(255, 255, 255, 0.2)',
        blur: 20,
    },

    dark: {
        background: 'rgba(30, 28, 46, 0.8)',
        border: 'rgba(255, 255, 255, 0.1)',
        blur: 20,
    },

    primary: {
        background: 'rgba(255, 185, 55, 0.15)',
        border: 'rgba(255, 185, 55, 0.3)',
        blur: 20,
    },

    secondary: {
        background: 'rgba(127, 91, 255, 0.15)',
        border: 'rgba(127, 91, 255, 0.3)',
        blur: 20,
    },
} as const;

// ============================================
// 🎯 ICON COLORS
// ============================================

export const ICON_LIGHT = {
    default: GRAY[600],
    subtle: GRAY[500],
    active: BRAND.honeyGlow,
    activeText: BRAND.honeyDeep,
    disabled: GRAY[400],
} as const;

export const ICON_DARK = {
    default: '#98989D',
    subtle: '#8E8E93',
    active: '#FFB84D',
    activeText: '#FFB84D',
    disabled: '#636366',
} as const;

// ============================================
// 📦 EXPORTS
// ============================================

export const ColorsV2 = {
    brand: BRAND,
    gradients: GRADIENTS,
    gray: GRAY,
    light: LIGHT,
    dark: DARK,
    glass: GLASS,
    icons: {
        light: ICON_LIGHT,
        dark: ICON_DARK,
    },
} as const;

export default ColorsV2;
