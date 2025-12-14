import { TextStyle } from 'react-native';
import { TypographySettings, FONT_FAMILIES } from '../constants/wishlistThemes';

/**
 * Convertit les paramètres de typographie en styles React Native
 */
export function getTypographyStyle(typography?: TypographySettings): TextStyle {
    if (!typography) return {};

    const fontConfig = FONT_FAMILIES[typography.fontFamily];

    return {
        fontFamily: fontConfig.fontFamily,
        fontSize: typography.fontSize,
        color: typography.color,
        textAlign: typography.alignment,
        fontWeight: typography.bold ? '700' : (fontConfig.weight || '400'),
        fontStyle: typography.italic ? 'italic' : (fontConfig.style || 'normal'),
        textTransform: typography.uppercase ? 'uppercase' : 'none',
        letterSpacing: typography.letterSpacing,
        lineHeight: typography.fontSize * typography.lineHeight,

        // Shadow
        ...(typography.shadow && {
            textShadowColor: typography.shadowColor || '#000000',
            textShadowOffset: typography.shadowOffset || { width: 2, height: 2 },
            textShadowRadius: typography.shadowBlur || 4,
        }),
    };
}

/**
 * Calcule le ratio de contraste entre deux couleurs (WCAG 2.0)
 */
export function getContrastRatio(color1: string, color2: string): number {
    const getLuminance = (hex: string): number => {
        // Convertir hex en RGB
        const rgb = parseInt(hex.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        // Calculer la luminance relative
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Évalue la qualité du contraste
 */
export function getContrastQuality(ratio: number): 'poor' | 'fair' | 'good' | 'excellent' {
    if (ratio < 3) return 'poor';
    if (ratio < 4.5) return 'fair';
    if (ratio < 7) return 'good';
    return 'excellent';
}

/**
 * Valide les paramètres de typographie et retourne des avertissements
 */
export function validateTypography(typography: TypographySettings): string[] {
    const warnings: string[] = [];

    // Taille de police
    if (typography.fontSize < 16) {
        warnings.push('La taille de police est petite, cela peut nuire à la lisibilité');
    }
    if (typography.fontSize > 36) {
        warnings.push('La taille de police est très grande');
    }

    // Shadow
    if (typography.shadow && typography.shadowBlur && typography.shadowBlur > 10) {
        warnings.push('L\'ombre est très prononcée, cela peut réduire la lisibilité');
    }

    // Outline
    if (typography.outline && typography.outlineWidth && typography.outlineWidth > 3) {
        warnings.push('Le contour est très épais');
    }

    // Letter spacing
    if (typography.letterSpacing > 5) {
        warnings.push('L\'espacement des lettres est très large');
    }
    if (typography.letterSpacing < -1) {
        warnings.push('L\'espacement des lettres est très serré');
    }

    // Line height
    if (typography.lineHeight < 1.1) {
        warnings.push('La hauteur de ligne est très serrée');
    }
    if (typography.lineHeight > 1.8) {
        warnings.push('La hauteur de ligne est très espacée');
    }

    return warnings;
}
