/**
 * 🎨 WishHive Design System V2
 * 
 * Design System complet inspiré par:
 * - Instagram (Feed, Stories, Interactions)
 * - TikTok (Scroll infini, Micro-interactions)
 * - Pinterest (Masonry Grid, Visual Cards)
 * - Notion (Interface épurée, Personnalisation)
 * - Airbnb (Cards premium, Design chaleureux)
 * - Stripe (Glassmorphism, Animations subtiles)
 * 
 * @version 2.0.0
 * @author WishHive Team
 */

import ColorsV2 from './colors';
import TypographyV2 from './typography';
import ShadowsV2 from './shadows';
import AnimationsV2 from './animations';
import SpacingV2 from './spacing';

// ============================================
// 🎯 THEME V2 - Complete Design System
// ============================================

export const ThemeV2 = {
    colors: ColorsV2,
    typography: TypographyV2,
    shadows: ShadowsV2,
    animations: AnimationsV2,
    spacing: SpacingV2.spacing,
    radius: SpacingV2.radius,
    container: SpacingV2.container,
    iconSizes: SpacingV2.iconSizes,
    avatarSizes: SpacingV2.avatarSizes,
    buttonHeights: SpacingV2.buttonHeights,
    inputHeights: SpacingV2.inputHeights,
} as const;

// ============================================
// 🎨 QUICK ACCESS - Most Used Tokens
// ============================================

// Colors
export const { brand, gradients, gray, light, dark, glass } = ColorsV2;

// Typography
export const { fonts, weights, sizes, lineHeights, styles: textStyles } = TypographyV2;

// Shadows
export const { light: shadowsLight, dark: shadowsDark } = ShadowsV2;

// Animations
export const { durations, easings, configs: animationConfigs } = AnimationsV2;

// Spacing
export const { spacing, radius, iconSizes, avatarSizes } = SpacingV2;

// ============================================
// 🎯 HELPER FUNCTIONS
// ============================================

/**
 * Get color based on theme mode
 */
export const getColor = (mode: 'light' | 'dark', colorPath: string) => {
    const colors = mode === 'light' ? light : dark;
    const path = colorPath.split('.');
    let value: any = colors;

    for (const key of path) {
        value = value[key];
        if (value === undefined) return undefined;
    }

    return value;
};

/**
 * Get shadow based on theme mode
 */
export const getShadow = (mode: 'light' | 'dark', size: keyof typeof shadowsLight) => {
    return mode === 'light' ? shadowsLight[size] : shadowsDark[size];
};

/**
 * Get text style
 */
export const getTextStyle = (style: keyof typeof textStyles) => {
    return textStyles[style];
};

/**
 * Get spacing value
 */
export const getSpacing = (...values: (keyof typeof spacing)[]) => {
    return values.map(v => spacing[v]);
};

// ============================================
// 📦 EXPORTS
// ============================================

export default ThemeV2;

// Re-export individual modules
export { ColorsV2, TypographyV2, ShadowsV2, AnimationsV2, SpacingV2 };

// Export types
export type ThemeMode = 'light' | 'dark';
export type ColorToken = keyof typeof light;
export type ShadowSize = keyof typeof shadowsLight;
export type TextStyle = keyof typeof textStyles;
export type SpacingValue = keyof typeof spacing;
export type RadiusValue = keyof typeof radius;
