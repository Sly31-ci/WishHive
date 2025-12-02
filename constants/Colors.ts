/**
 * Color palette for WishHive
 */
export const Colors = {
    // Primary colors
    primary: '#6C63FF',
    accent: '#FFB86B',
    secondary: '#2BD4A5',

    // Neutral colors
    dark: '#0F1724',
    light: '#F7FAFC',
    gray: '#64748B',

    // Text colors
    text: '#0F1724',
    textSecondary: '#64748B',
    textLight: '#94A3B8',

    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',

    // Status colors
    success: '#2BD4A5',
    warning: '#FFB86B',
    error: '#FF6B6B',
    info: '#6C63FF',

    // Border colors
    border: '#E2E8F0',
    borderLight: '#F1F5F9',

    // Wishlist type colors
    birthday: '#FFB86B',
    wedding: '#FFB6C1',
    christmas: '#2BD4A5',
    baby: '#87CEEB',
    general: '#6C63FF',

    // Badge tier colors
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',

    // Overlay colors
    overlay: 'rgba(15, 23, 36, 0.5)',
    overlayLight: 'rgba(15, 23, 36, 0.2)',
};

/**
 * Spacing scale
 */
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

/**
 * Border radius scale
 */
export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

/**
 * Typography scale
 */
export const Typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 28,
        fontWeight: '700' as const,
        lineHeight: 36,
    },
    h3: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
    },
    h4: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
    },
};

/**
 * Shadow presets
 */
export const Shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
};
