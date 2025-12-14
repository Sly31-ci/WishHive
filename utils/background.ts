import { ViewStyle } from 'react-native';
import { BackgroundSettings, CardStyleSettings } from '../constants/wishlistThemes';
import { COLORS, SHADOWS } from '../constants/theme';

/**
 * Génère les positions pour le mur d'emojis selon le motif choisi
 */
export function generateEmojiPositions(
    count: number,
    pattern: 'grid' | 'diagonal' | 'random' | 'scattered',
    containerWidth: number = 400,
    containerHeight: number = 600
): Array<{ x: number; y: number; rotation: number }> {
    const positions: Array<{ x: number; y: number; rotation: number }> = [];

    switch (pattern) {
        case 'grid':
            const cols = Math.ceil(Math.sqrt(count));
            const rows = Math.ceil(count / cols);
            const cellWidth = containerWidth / cols;
            const cellHeight = containerHeight / rows;

            for (let i = 0; i < count; i++) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                positions.push({
                    x: col * cellWidth + cellWidth / 2,
                    y: row * cellHeight + cellHeight / 2,
                    rotation: 0,
                });
            }
            break;

        case 'diagonal':
            const diagonalSpacing = Math.sqrt((containerWidth * containerHeight) / count);
            let x = 0;
            let y = 0;

            for (let i = 0; i < count; i++) {
                positions.push({
                    x: x % containerWidth,
                    y: y % containerHeight,
                    rotation: Math.random() * 30 - 15,
                });
                x += diagonalSpacing;
                y += diagonalSpacing * 0.7;
            }
            break;

        case 'random':
            for (let i = 0; i < count; i++) {
                positions.push({
                    x: Math.random() * containerWidth,
                    y: Math.random() * containerHeight,
                    rotation: Math.random() * 360,
                });
            }
            break;

        case 'scattered':
            // Distribution plus naturelle avec zones de densité variable
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                const radius = Math.random() * Math.min(containerWidth, containerHeight) / 2;
                positions.push({
                    x: containerWidth / 2 + Math.cos(angle) * radius,
                    y: containerHeight / 2 + Math.sin(angle) * radius,
                    rotation: Math.random() * 360,
                });
            }
            break;
    }

    return positions;
}

/**
 * Convertit les paramètres de style de carte en styles React Native
 */
export function getCardStyle(cardStyle?: CardStyleSettings, accentColor?: string): ViewStyle {
    if (!cardStyle) return {};

    const baseStyle: ViewStyle = {
        borderRadius: cardStyle.borderRadius,
        borderWidth: cardStyle.borderWidth,
        borderColor: cardStyle.borderColor || accentColor || COLORS.gray[300],
    };

    // Shadow
    if (cardStyle.shadow) {
        const shadowMap = {
            light: SHADOWS.sm,
            medium: SHADOWS.md,
            strong: SHADOWS.lg,
        };
        Object.assign(baseStyle, shadowMap[cardStyle.shadowIntensity || 'light']);
    }

    // Background opacity
    if (cardStyle.backgroundColor) {
        const opacity = cardStyle.backgroundOpacity || 1.0;
        const hex = cardStyle.backgroundColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        baseStyle.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Effects
    switch (cardStyle.effect) {
        case 'glassmorphism':
            Object.assign(baseStyle, {
                backgroundColor: `rgba(255, 255, 255, ${cardStyle.backgroundOpacity || 0.1})`,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                // Note: backdrop-filter not supported in React Native
            });
            break;

        case 'neon':
            Object.assign(baseStyle, {
                borderWidth: 2,
                borderColor: accentColor || COLORS.primary,
                shadowColor: accentColor || COLORS.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 10,
            });
            break;

        case 'honey':
            Object.assign(baseStyle, {
                backgroundColor: '#FFB937',
                borderWidth: 2,
                borderColor: '#F59E0B',
                shadowColor: '#FFB937',
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
            });
            break;
    }

    return baseStyle;
}

/**
 * Obtient le nombre d'emojis selon la densité
 */
export function getEmojiCount(density: 'low' | 'medium' | 'high'): number {
    const densityMap = {
        low: 20,
        medium: 40,
        high: 60,
    };
    return densityMap[density];
}

/**
 * Applique les filtres d'image (pour utilisation avec expo-image ou react-native-image-filter)
 */
export function getImageFilterStyle(filter?: BackgroundSettings['imageFilter']) {
    if (!filter) return {};

    // Note: Ces filtres nécessitent une bibliothèque comme expo-image-manipulator
    // ou react-native-image-filter-kit pour fonctionner réellement
    return {
        blur: filter.blur || 0,
        brightness: filter.brightness || 1.0,
        contrast: filter.contrast || 1.0,
        // Vignette nécessite un composant custom ou SVG
    };
}
