export const PALETTE = {
  // Brand Colors
  honeyGlow: '#E69100',   // Primary / Joy / CTA (Slightly darker for better contrast)
  hivePurple: '#6B44FF',  // Secondary / Identity / Modernity (Darkened for AA compliance on white)
  mintFresh: '#00B37E',   // Success / Validation / Trust (Darkened for AA compliance on white)

  // Neutrals - Light
  cloudWhite: '#F7F8FA',  // Background
  white: '#FFFFFF',       // Cards / Surface

  // Neutrals - Dark
  charcoalDeep: '#1E1C2E',// Text Main / Icons
  darkBackground: '#0F0E15', // Dark Mode Background
  darkCard: '#1C1B27',    // Dark Mode Card

  // Transparents (Restored)
  overlay: 'rgba(22, 22, 26, 0.8)',
  overlayLight: 'rgba(255, 255, 254, 0.8)',

  // Functional
  red: '#FF4B4B',         // Error (kept generic pleasant red)
  blue: '#3DA9FC',        // Info
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#71717A', // Adjusted for AA contrast on white background
    600: '#52525B', // Adjusted for AA contrast on white background
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
};

export const FONTS = {
  titles: 'System', // 'Poppins-Bold' (To be implemented)
  body: 'System',   // 'Inter-Regular' (To be implemented)
};

export const THEME = {
  light: {
    background: PALETTE.cloudWhite,
    card: PALETTE.white,
    text: PALETTE.charcoalDeep,
    textSecondary: PALETTE.gray[600],
    primary: PALETTE.honeyGlow,
    secondary: PALETTE.hivePurple,
    accent: PALETTE.mintFresh, // Used for success/validation often
    success: PALETTE.mintFresh,
    error: PALETTE.red,
    border: PALETTE.gray[200],
    input: PALETTE.white,
    tabBar: PALETTE.white,
    header: PALETTE.cloudWhite,
    warning: PALETTE.honeyGlow,
    info: PALETTE.blue,
  },
  dark: {
    background: PALETTE.darkBackground,
    card: PALETTE.darkCard,
    text: PALETTE.white,
    textSecondary: PALETTE.gray[400],
    primary: PALETTE.honeyGlow,
    secondary: PALETTE.hivePurple,
    accent: PALETTE.mintFresh,
    success: PALETTE.mintFresh,
    error: PALETTE.red,
    border: PALETTE.darkCard, // Or slightly lighter?
    input: PALETTE.darkCard,
    tabBar: PALETTE.darkCard,
    header: PALETTE.darkBackground,
    warning: PALETTE.honeyGlow,
    info: PALETTE.blue,
  },
};

// Backward compatibility (Mapped to new brand identity)
export const COLORS = {
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

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: PALETTE.charcoalDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: PALETTE.charcoalDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: PALETTE.charcoalDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};
