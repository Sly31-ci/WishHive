/**
 * 🎨 WishHive - Background Gradient System
 * 
 * RÈGLE OBLIGATOIRE :
 * Toutes les interfaces doivent utiliser le gradient :
 * - Haut (30-35%) : Honey Glow (#FFB937)
 * - Bas (65-70%) : Blanc (#FFFFFF)
 * 
 * Usage dans les composants :
 * ```tsx
 * import { GradientBackground } from '@/theme/backgrounds';
 * 
 * <GradientBackground>
 *   {/ * Votre contenu * /}
 * </GradientBackground>
 * ```
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BRAND_PALETTE } from './colors';

// ============================================
// 🌈 GRADIENT CONFIGURATION
// ============================================

export const GRADIENT_CONFIG = {
    // Gradient principal : Honey Glow → Blanc
    primary: {
        colors: [BRAND_PALETTE.honeyGlow, BRAND_PALETTE.pureWhite],
        locations: [0, 0.35], // 35% Honey Glow, 65% Blanc
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },

    // Variante plus douce (pour certains écrans)
    soft: {
        colors: [
            'rgba(255, 185, 55, 0.15)', // Honey Glow 15%
            BRAND_PALETTE.pureWhite
        ],
        locations: [0, 0.3],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },

    // Variante inversée (pour modals)
    inverse: {
        colors: [BRAND_PALETTE.pureWhite, BRAND_PALETTE.honeyGlow],
        locations: [0.65, 1],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    },
} as const;

// ============================================
// 🎨 GRADIENT BACKGROUND COMPONENT
// ============================================

interface GradientBackgroundProps {
    children: React.ReactNode;
    variant?: 'primary' | 'soft' | 'inverse';
    style?: ViewStyle;
}

export function GradientBackground({
    children,
    variant = 'primary',
    style
}: GradientBackgroundProps) {
    const config = GRADIENT_CONFIG[variant];

    return (
        <LinearGradient
            colors={config.colors}
            locations={config.locations}
            start={config.start}
            end={config.end}
            style={[styles.gradient, style]}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});

// ============================================
// 🎯 HELPER FUNCTIONS
// ============================================

/**
 * Retourne les couleurs du gradient pour usage direct
 */
export function getGradientColors(variant: 'primary' | 'soft' | 'inverse' = 'primary') {
    return GRADIENT_CONFIG[variant].colors;
}

/**
 * Retourne le style de background pour les composants non-gradient
 * (utilise la couleur de fin du gradient)
 */
export function getFallbackBackground(variant: 'primary' | 'soft' | 'inverse' = 'primary') {
    const colors = GRADIENT_CONFIG[variant].colors;
    return colors[colors.length - 1];
}
