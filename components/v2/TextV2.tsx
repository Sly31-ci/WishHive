/**
 * 📝 TextV2 - Typographie Premium avec Design System V2
 * 
 * Features:
 * - Utilise les tokens de typographie V2 (Outfit, Inter, JetBrains Mono)
 * - Variants prédéfinis (h1, h2, body, caption, etc.)
 * - Props pour overrides faciles (color, align, weight)
 * - Support gradients pour titres (optionnel)
 */

import React from 'react';
import {
    Text,
    TextProps,
    TextStyle,
    StyleSheet,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view'; // Nécessite installation si gradient texte
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeV2, brand, light, textStyles, fonts } from '@/theme/v2';

// Types de styles supportés
type TextVariant =
    | 'displayXL' | 'displayLG' | 'displayMD' | 'displaySM'
    | 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
    | 'bodyLG' | 'body' | 'bodySM' | 'bodyXS'
    | 'bodyBold' | 'bodySMBold'
    | 'caption' | 'captionBold' | 'captionSM'
    | 'label' | 'labelSM'
    | 'mono' | 'monoSM';

type TextColor =
    | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse'
    | 'primaryColored' | 'secondaryColored' | 'accentColored'
    | 'success' | 'error' | 'warning' | 'info';

interface TextV2Props extends TextProps {
    variant?: TextVariant;
    color?: TextColor | string;
    align?: TextStyle['textAlign'];
    weight?: TextStyle['fontWeight'];
    italic?: boolean;
    gradient?: boolean; // Gradient text (Primary gradient)
    children: React.ReactNode;
}

export default function TextV2({
    variant = 'body',
    color = 'primary',
    align = 'left',
    weight,
    italic = false,
    gradient = false,
    style,
    children,
    ...props
}: TextV2Props) {

    // 1. Get base style from variant
    const getVariantStyle = (): TextStyle => {
        return textStyles[variant] || textStyles.body;
    };

    // 2. Get color value
    const getColorValue = (): string => {
        // Si c'est un code couleur direct (#...)
        if (color.startsWith('#') || color.startsWith('rgb')) {
            return color;
        }

        // Mapping des tokens couleurs
        const colorMap: Record<TextColor, string> = {
            primary: light.text.primary,
            secondary: light.text.secondary,
            tertiary: light.text.tertiary,
            disabled: light.text.disabled,
            inverse: light.text.inverse,

            primaryColored: light.text.primaryColored,
            secondaryColored: light.text.secondaryColored,
            accentColored: light.text.accentColored,

            success: light.semantic.successText,
            error: light.semantic.errorText,
            warning: light.semantic.warningText,
            info: light.semantic.infoText,
        };

        return colorMap[color as TextColor] || light.text.primary;
    };

    const finalStyle: TextStyle = {
        ...getVariantStyle(),
        color: getColorValue(),
        textAlign: align,
        fontStyle: italic ? 'italic' : 'normal',
        ...(weight && { fontWeight: weight }),
    };

    // 3. Render Gradient Text if requested
    // Note: Nécessite @react-native-masked-view/masked-view
    if (gradient) {
        return (
            <MaskedView
                maskElement={
                    <Text style={[finalStyle, style, { opacity: 1 }]} {...props}>
                        {children}
                    </Text>
                }
            >
                <LinearGradient
                    colors={[brand.honeyGlow, brand.hivePurple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    {/* Le Text ici sert juste à donner la taille au MaskedView, il est invisible */}
                    <Text style={[finalStyle, style, { opacity: 0 }]} {...props}>
                        {children}
                    </Text>
                </LinearGradient>
            </MaskedView>
        );
    }

    // 4. Standard Render
    return (
        <Text style={[finalStyle, style]} {...props}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    // Styles additionnels si nécessaire
});
