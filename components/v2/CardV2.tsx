/**
 * 🎴 CardV2 - Card Premium avec Design System V2
 * 
 * Features:
 * - Glassmorphism (blur + transparency)
 * - Shadows colorées
 * - Variants: default, elevated, outlined, glass
 * - Pressable avec animation
 * - Gradient borders (optionnel)
 */

import React from 'react';
import {
    View,
    Pressable,
    ViewStyle,
    StyleSheet,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ThemeV2, brand, light, shadowsLight, spacing, radius, glass } from '@/theme/v2';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardV2Props {
    children: React.ReactNode;
    variant?: CardVariant;
    padding?: CardPadding;
    onPress?: () => void;
    style?: ViewStyle;
    pressable?: boolean;
    glassBlur?: number; // Blur intensity for glass variant
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CardV2({
    children,
    variant = 'default',
    padding = 'md',
    onPress,
    style,
    pressable = false,
    glassBlur = 20,
}: CardV2Props) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    const handlePressIn = () => {
        if (pressable || onPress) {
            scale.value = withTiming(0.98, { duration: 100 });
            opacity.value = withTiming(0.9, { duration: 100 });
        }
    };

    const handlePressOut = () => {
        if (pressable || onPress) {
            scale.value = withSpring(1, { damping: 10, stiffness: 300 });
            opacity.value = withTiming(1, { duration: 150 });
        }
    };

    // Padding styles
    const getPaddingStyle = (): ViewStyle => {
        const paddings = {
            none: {},
            sm: { padding: spacing.md },
            md: { padding: spacing.lg },
            lg: { padding: spacing.xl },
        };
        return paddings[padding];
    };

    // Variant styles
    const getVariantStyle = (): ViewStyle => {
        const variants: Record<CardVariant, ViewStyle> = {
            default: {
                backgroundColor: light.surface.card,
                ...shadowsLight.sm,
            },
            elevated: {
                backgroundColor: light.surface.elevated,
                ...shadowsLight.md,
            },
            outlined: {
                backgroundColor: light.surface.card,
                borderWidth: 1,
                borderColor: light.border.default,
            },
            glass: {
                backgroundColor: glass.light.background,
                borderWidth: 1,
                borderColor: glass.light.border,
                overflow: 'hidden',
            },
            gradient: {
                backgroundColor: 'transparent',
                overflow: 'hidden',
                ...shadowsLight.primary,
            },
        };
        return variants[variant];
    };

    const baseStyle: ViewStyle = {
        borderRadius: radius.lg,
        overflow: 'hidden',
    };

    // Glass variant with blur
    if (variant === 'glass') {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={!onPress && !pressable}
                style={[baseStyle, getVariantStyle(), animatedStyle, style]}
            >
                <BlurView
                    style={StyleSheet.absoluteFill}
                    intensity={glassBlur}
                    tint="light"
                />
                <View style={[getPaddingStyle(), { backgroundColor: 'transparent' }]}>
                    {children}
                </View>
            </AnimatedPressable>
        );
    }

    // Gradient variant with border
    if (variant === 'gradient') {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={!onPress && !pressable}
                style={[baseStyle, animatedStyle, style]}
            >
                <LinearGradient
                    colors={[brand.honeyGlow, brand.hivePurple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBorder}
                >
                    <View style={[styles.gradientInner, getPaddingStyle()]}>
                        {children}
                    </View>
                </LinearGradient>
            </AnimatedPressable>
        );
    }

    // Default, elevated, outlined variants
    const Component = onPress || pressable ? AnimatedPressable : Animated.View;

    return (
        <Component
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            // @ts-ignore
            disabled={!onPress && !pressable}
            style={[baseStyle, getVariantStyle(), getPaddingStyle(), animatedStyle, style]}
        >
            {children}
        </Component>
    );
}

const styles = StyleSheet.create({
    gradientBorder: {
        padding: 2, // Border width
        borderRadius: radius.lg,
    },
    gradientInner: {
        backgroundColor: light.surface.card,
        borderRadius: radius.lg - 2,
    },
});
