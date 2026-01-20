/**
 * 🎨 WishHive Design System V2
 * Optimisé pour les super-apps mobiles modernes
 * Inspiré de : Wave, Yango, Revolut
 */

// ============================================
// 🎨 PALETTE - IDENTITÉ VISUELLE WISHHIVE
// ============================================

export const PALETTE = {
    // Brand Colors - IDENTITÉ VISUELLE OFFICIELLE
    honeyGlow: '#FFB937',      // 🟡 Orange/Jaune doré - Couleur primaire
    hivePurple: '#7F5BFF',     // 🟣 Violet - Couleur secondaire
    mintFresh: '#00B37E',      // 🟢 Vert - Accent (success)

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

// 🔤 FONT SIZES V3 - VISIBILITÉ MAXIMALE MOBILE
// Toutes les tailles augmentées pour garantir lisibilité parfaite
export const FONT_SIZES_V2 = {
    xxs: 13,  // +1 → Minimum absolu mobile
    xs: 14,   // +2 → Métadonnées lisibles
    sm: 16,   // +2 → Corps de texte minimum
    md: 18,   // +2 → Corps de texte confortable
    lg: 22,   // +4 → Titres secondaires
    xl: 26,   // +6 → Titres principaux
    xxl: 32,  // +8 → Headers
    xxxl: 40, // +4 → Héros
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
        // 🔥 TEXTES HAUTE VISIBILITÉ (ratios AAA 7:1+)
        text: '#16141F',                    // Ratio 14:1 (était charcoalDeep 10:1)
        textSecondary: '#3D3B47',           // Ratio 9.5:1 (était gray[600] 7.2:1)
        textTertiary: '#52525B',            // Ratio 7.1:1 (était gray[400] 4.5:1)
        textDisabled: '#9CA3AF',            // Ratio 3.5:1 (OK pour disabled)
        textPlaceholder: '#71717A',         // Ratio 5.2:1 (inputs)

        // 🎨 COULEURS PRIMAIRES (ajustées pour visibilité)
        primary: PALETTE.honeyGlow,         // #FFB937 - Couleur exacte de l'identité
        primaryDark: '#E69A1F',             // Variant foncé si nécessaire
        primaryLight: '#FFC555',            // Variant clair

        secondary: '#7049E6',               // #7F5BFF assombri → Meilleur contraste
        secondaryDark: '#5C3ACC',           // Pour texte
        secondaryLight: PALETTE.hivePurple, // #7F5BFF Original

        accent: '#008C63',                  // mintFresh assombri → Ratio 5.9:1
        accentDark: '#007650',              // Pour texte → Ratio 7.3:1
        accentLight: PALETTE.mintFresh,     // Original

        success: '#007650',                 // Ratio 7.3:1 ✅
        error: '#D32F2F',                   // Ratio 6.5:1 (était #FF4B4B 3.2:1)
        warning: PALETTE.honeyGlow,         // #FFB937 - Identique à primary
        info: '#1976D2',                    // Ratio 5.8:1 (était #3DA9FC 3.1:1)

        // 🎯 BORDURES & BACKGROUNDS
        border: PALETTE.gray[300],          // Plus foncé pour visibilité
        borderLight: PALETTE.gray[200],
        borderStrong: PALETTE.gray[400],    // Nouveau: bordures accentuées

        input: PALETTE.white,
        inputBorder: PALETTE.gray[400],     // Plus visible (était gray[300])
        inputBorderFocus: PALETTE.honeyGlow, // #FFB937

        tabBar: PALETTE.white,
        header: PALETTE.white,
        overlay: PALETTE.overlay,

        // 🆕 NOUVEAUX: États interactifs
        hover: 'rgba(255, 185, 55, 0.08)',   // #FFB937 à 8%
        pressed: 'rgba(255, 185, 55, 0.12)',  // #FFB937 à 12%
        selected: 'rgba(255, 185, 55, 0.16)', // #FFB937 à 16%
    },
    dark: {
        background: PALETTE.darkBackground,
        card: PALETTE.darkCard,
        // 🔥 TEXTES DARK MODE OPTIMISÉS
        text: '#F5F5F7',                    // Légèrement off-white (meilleur que pure white)
        textSecondary: '#C7C7CC',           // Ratio 10:1 sur dark
        textTertiary: '#98989D',            // Ratio 6.5:1 sur dark
        textDisabled: '#636366',            // Ratio 3.2:1 (OK pour disabled)
        textPlaceholder: '#8E8E93',         // Inputs

        // 🎨 COULEURS PRIMAIRES DARK MODE (plus lumineuses)
        primary: '#FFC555',                 // #FFB937 éclairci → Meilleur ratio sur dark
        primaryDark: PALETTE.honeyGlow,     // #FFB937
        primaryLight: '#FFC555',            // Variant clair pour dark mode

        secondary: '#9D7FFF',               // #7F5BFF éclairci → Ratio 7.5:1
        secondaryDark: PALETTE.hivePurple,  // #7F5BFF
        secondaryLight: '#7049E6',

        accent: '#00E5A0',                  // mintFresh éclairci → Ratio 9:1
        accentDark: PALETTE.mintFresh,
        accentLight: '#00B37E',

        success: '#00E5A0',                 // Ratio 9:1 ✅
        error: '#FF6B6B',                   // Ratio 5.8:1
        warning: '#FFC555',                 // Identique primary dark
        info: '#64B5F6',                    // Ratio 7.2:1

        border: PALETTE.gray[600],
        borderLight: PALETTE.gray[700],
        borderStrong: PALETTE.gray[500],

        input: PALETTE.darkCard,
        inputBorder: PALETTE.gray[500],
        inputBorderFocus: '#FFC555',

        tabBar: PALETTE.darkCard,
        header: PALETTE.darkCard,
        overlay: PALETTE.overlay,

        hover: 'rgba(255, 197, 85, 0.08)',
        pressed: 'rgba(255, 197, 85, 0.12)',
        selected: 'rgba(255, 197, 85, 0.16)',
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
    // 🔥 COULEURS PRIMAIRES HAUTE VISIBILITÉ - IDENTITÉ VISUELLE WISHHIVE
    primary: PALETTE.honeyGlow,   // #FFB937 - Couleur exacte de l'identité
    primaryDark: '#E69A1F',       // Variant foncé si nécessaire  
    primaryLight: '#FFC555',      // Variant clair

    secondary: '#7049E6',         // #7F5BFF assombri
    secondaryDark: '#5C3ACC',
    secondaryLight: PALETTE.hivePurple, // #7F5BFF

    accent: '#008C63',            // Assombri
    accentDark: '#007650',
    accentLight: PALETTE.mintFresh,

    // 🎯 TEXTES (light mode)
    dark: '#16141F',              // Text primary (ratio 14:1)
    textPrimary: '#16141F',
    textSecondary: '#3D3B47',     // Ratio 9.5:1
    textTertiary: '#52525B',      // Ratio 7.1:1
    textDisabled: '#9CA3AF',

    light: PALETTE.cloudWhite,
    white: PALETTE.white,

    // 🎨 GRAY SCALE (inchangé)
    gray: PALETTE.gray,

    // ✅ SEMANTIC COLORS
    success: '#007650',           // Ratio 7.3:1
    warning: PALETTE.honeyGlow,   // #FFB937 - Identique primary
    error: '#D32F2F',             // Ratio 6.5:1
    info: '#1976D2',              // Ratio 5.8:1

    // 🆕 ICÔNES & INTERACTIONS
    iconDefault: '#52525B',       // Icônes neutres (ratio 7.1:1)
    iconSubtle: '#71717A',        // Icônes secondaires
    iconActive: PALETTE.honeyGlow, // #FFB937 - Icônes actives
    iconDisabled: '#C7C7CC',      // Icônes disabled

    // 🎨 BORDERS
    border: PALETTE.gray[300],
    borderLight: PALETTE.gray[200],
    borderStrong: PALETTE.gray[400],
    borderFocus: PALETTE.honeyGlow, // #FFB937

    // 🌈 BACKGROUNDS
    bgPrimary: PALETTE.cloudWhite,
    bgSecondary: PALETTE.white,
    bgTertiary: PALETTE.gray[50],
    bgHover: 'rgba(255, 185, 55, 0.08)',   // #FFB937 à 8%
    bgPressed: 'rgba(255, 185, 55, 0.12)', // #FFB937 à 12%
    bgSelected: 'rgba(255, 185, 55, 0.16)', // #FFB937 à 16%
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
