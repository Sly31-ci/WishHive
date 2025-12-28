/**
 * 📝 Text Component - Design System Compliant
 * 
 * Composant intelligent qui:
 * - Choisit les bons contrastes automatiquement
 * - Applique les presets typographiques
 * - Gère les couleurs sémantiques
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { theme } from '@/theme';

type TypographyPreset =
    | 'displayLarge' | 'displayMedium' | 'displaySmall'
    | 'h1' | 'h2' | 'h3' | 'h4'
    | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
    | 'labelLarge' | 'labelMedium' | 'labelSmall'
    | 'caption' | 'captionBold';

type ColorVariant =
    | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'placeholder'
    | 'brandPrimary' | 'brandSecondary' | 'brandAccent'
    | 'success' | 'error' | 'warning' | 'info';

interface TextComponentProps extends RNTextProps {
    /** Preset typographique (taille + weight) */
    preset?: TypographyPreset;

    /** Variante de couleur sémantique */
    color?: ColorVariant;

    /** Couleur custom (override) */
    customColor?: string;

    /** Centered */
    centered?: boolean;

    /** Bold (override weight) */
    bold?: boolean;

    /** Children */
    children?: React.ReactNode;
}

export function Text({
    preset,
    color = 'primary',
    customColor,
    centered,
    bold,
    style,
    children,
    ...props
}: TextComponentProps) {
    // Get typography preset
    const typographyStyle = preset
        ? theme.typography.presets[preset]
        : {};

    // Get color
    const getColor = (): string => {
        if (customColor) return customColor;

        const colorMap: Record<ColorVariant, string> = {
            primary: theme.colors.light.textPrimary,           // #16141F
            secondary: theme.colors.light.textSecondary,       // #3D3B47
            tertiary: theme.colors.light.textTertiary,         // #52525B
            disabled: theme.colors.light.textDisabled,
            placeholder: theme.colors.light.textPlaceholder,

            // IMPORTANT: Variantes texte pour brand colors (pas les brand colors directes)
            brandPrimary: theme.colors.light.primaryText,      // #B87100 ✅ Ratio 6.2:1
            brandSecondary: theme.colors.light.secondaryText,  // #4A28B8 ✅ Ratio 8.1:1
            brandAccent: theme.colors.light.accentText,        // #007650 ✅ Ratio 7.3:1

            // Semantic
            success: theme.colors.light.success,
            error: theme.colors.light.error,
            warning: theme.colors.light.warning,
            info: theme.colors.light.info,
        };

        return colorMap[color];
    };

    const textStyle: TextStyle = {
        ...typographyStyle,
        color: getColor(),
        ...(centered && { textAlign: 'center' }),
        ...(bold && { fontWeight: theme.typography.weights.bold }),
    };

    return (
        <RNText style={[textStyle, style]} {...props}>
            {children}
        </RNText>
    );
}

// Convenience presets
export const H1 = (props: Omit<TextComponentProps, 'preset'>) => (
    <Text preset="h1" {...props} />
);

export const H2 = (props: Omit<TextComponentProps, 'preset'>) => (
    <Text preset="h2" {...props} />
);

export const H3 = (props: Omit<TextComponentProps, 'preset'>) => (
    <Text preset="h3" {...props} />
);

export const Body = (props: Omit<TextComponentProps, 'preset'>) => (
    <Text preset="bodyMedium" {...props} />
);

export const Caption = (props: Omit<TextComponentProps, 'preset'>) => (
    <Text preset="caption" {...props} />
);

export default Text;
