/**
 * 🎨 WishHive Design System V2
 * Optimisé pour les super-apps mobiles modernes
 * Inspiré de : Wave, Yango, Revolut
 */

// ============================================
// 🎨 PALETTE (Inchangée - Identité de marque)
// ============================================

export const PALETTE = {
    // Brand Colors
    honeyGlow: '#E69100',
    hivePurple: '#6B44FF',
    mintFresh: '#00B37E',

    // Neutrals - Light
    cloudWhite: '#F7F8FA',
    white: '#FFFFFF',

    // Neutrals - Dark
    charcoalDeep: '#1E1C2E',
    darkBackground: '#0F0E15',
    darkCard: '#1C1B27',

    // Transparents
    overlay: 'rgba(22, 22, 26, 0.8)',
    overlayLight: 'rgba(255, 255, 254, 0.8)',

    // Functional
    red: '#FF4B4B',
    blue: '#3DA9FC',
    gray: {
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
    },
};

// ============================================
// 📏 SPACING V2 - Augmenté pour mobile
// ============================================

export const SPACING_V2 = {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 20,   // +4 vs v1
    lg: 28,   // +4 vs v1
    xl: 40,   // +8 vs v1
    xxl: 56,  // +8 vs v1
    xxxl: 72,
};

// ============================================
// 🔤 FONT SIZES V2 - Optimisés lisibilité
// ============================================

export const FONT_SIZES_V2 = {
    xxs: 12,
    xs: 13,   // +1
    sm: 15,   // +1
    md: 17,   // +1
    lg: 20,   // +2
    xl: 24,   // +4
    xxl: 28,  // +4
    xxxl: 36,
    huge: 56, // Pour les CTA héros
};

// ============================================
// 🎭 BORDER RADIUS V2 - Plus doux
// ============================================

export const BORDER_RADIUS_V2 = {
    xs: 8,
    sm: 12,   // +4
    md: 16,   // +4
    lg: 20,   // +4
    xl: 28,   // +4
    xxl: 36,
    full: 9999,
};

// ============================================
// 🌓 THEMES
// ============================================

export const THEME_V2 = {
    light: {
        background: PALETTE.cloudWhite,
        card: PALETTE.white,
        text: PALETTE.charcoalDeep,
        textSecondary: PALETTE.gray[600],
        textTertiary: PALETTE.gray[400],
        primary: PALETTE.honeyGlow,
        secondary: PALETTE.hivePurple,
        accent: PALETTE.mintFresh,
        success: PALETTE.mintFresh,
        error: PALETTE.red,
        border: PALETTE.gray[200],
        borderLight: PALETTE.gray[100],
        input: PALETTE.white,
        inputBorder: PALETTE.gray[300],
        tabBar: PALETTE.white,
        header: PALETTE.white,
        warning: PALETTE.honeyGlow,
        info: PALETTE.blue,
        overlay: PALETTE.overlay,
    },
    dark: {
        background: PALETTE.darkBackground,
        card: PALETTE.darkCard,
        text: PALETTE.white,
        textSecondary: PALETTE.gray[400],
        textTertiary: PALETTE.gray[500],
        primary: PALETTE.honeyGlow,
        secondary: PALETTE.hivePurple,
        accent: PALETTE.mintFresh,
        success: PALETTE.mintFresh,
        error: PALETTE.red,
        border: PALETTE.gray[700],
        borderLight: PALETTE.gray[800],
        input: PALETTE.darkCard,
        inputBorder: PALETTE.gray[600],
        tabBar: PALETTE.darkCard,
        header: PALETTE.darkCard,
        warning: PALETTE.honeyGlow,
        info: PALETTE.blue,
        overlay: PALETTE.overlay,
    },
};

// ============================================
// 🎯 SHADOWS V2 - Plus subtils
// ============================================

export const SHADOWS_V2 = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    xs: {
        shadowColor: PALETTE.charcoalDeep,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: PALETTE.charcoalDeep,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: PALETTE.charcoalDeep,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: PALETTE.charcoalDeep,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 8,
    },
    xl: {
        shadowColor: PALETTE.charcoalDeep,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 12,
    },
};

// ============================================
// ⚡ ANIMATION CONFIGS
// ============================================

export const ANIMATIONS = {
    // Durées
    duration: {
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

    // Scale
    scale: {
        tap: 0.96,
        press: 0.94,
        bounce: 1.05,
    },
};

// ============================================
// 📐 LAYOUT CONSTANTS
// ============================================

export const LAYOUT = {
    // Touch targets minimum (iOS HIG & Material)
    touchTarget: {
        min: 44,
        recommended: 56,
    },

    // Safe area (pour notches, etc.)
    safeArea: {
        top: 48,
        bottom: 34,
    },

    // Container
    maxWidth: 428, // Max width pour centrage sur tablettes

    // Header
    headerHeight: 64,

    // Tab bar
    tabBarHeight: 64,

    // FAB (Floating Action Button)
    fab: {
        size: 56,
        offset: 20,
    },
};

// ============================================
// 🎪 Z-INDEX HIERARCHY
// ============================================

export const Z_INDEX = {
    base: 0,
    card: 1,
    dropdown: 10,
    sticky: 100,
    header: 1000,
    overlay: 2000,
    modal: 3000,
    toast: 4000,
    tooltip: 5000,
};

// ============================================
// 📱 RESPONSIVE BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
    small: 375,    // iPhone SE, petits Android
    medium: 390,   // iPhone 12/13/14
    large: 428,    // iPhone 14 Pro Max
    tablet: 768,   // iPads
};

// ============================================
// 🎨 BACKWARD COMPATIBILITY (Optionnel)
// ============================================

export const COLORS_V2 = {
    primary: PALETTE.honeyGlow,
    secondary: PALETTE.hivePurple,
    accent: PALETTE.mintFresh,
    dark: PALETTE.charcoalDeep,
    light: PALETTE.cloudWhite,
    white: PALETTE.white,
    gray: PALETTE.gray,
    success: PALETTE.mintFresh,
    warning: PALETTE.honeyGlow,
    error: PALETTE.red,
    info: PALETTE.blue,
};

// Export defaults pour migration progressive
export const SPACING = SPACING_V2;
export const FONT_SIZES = FONT_SIZES_V2;
export const BORDER_RADIUS = BORDER_RADIUS_V2;
export const SHADOWS = SHADOWS_V2;
export const COLORS = COLORS_V2;
export const THEME = THEME_V2;

// ============================================
// 🎨 HELPER FUNCTIONS
// ============================================

/**
 * Ajoute de l'opacité à une couleur hex
 * @param hex - Couleur hex (#RRGGBB)
 * @param opacity - Opacité 0-1
 */
export const addOpacity = (hex: string, opacity: number): string => {
    const alpha = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0');
    return `${hex}${alpha}`;
};

/**
 * Retourne le spacing responsive basé sur la largeur d'écran
 */
export const getResponsiveSpacing = (base: number, screenWidth: number): number => {
    if (screenWidth < BREAKPOINTS.small) {
        return Math.max(base - 4, 4); // -4px pour petits écrans
    }
    if (screenWidth > BREAKPOINTS.large) {
        return base + 4; // +4px pour grands écrans
    }
    return base;
};

/**
 * Retourne la font size responsive
 */
export const getResponsiveFontSize = (base: number, screenWidth: number): number => {
    if (screenWidth < BREAKPOINTS.small) {
        return Math.max(base - 2, 12); // -2px, min 12
    }
    if (screenWidth > BREAKPOINTS.large) {
        return base + 2;
    }
    return base;
};
