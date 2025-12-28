/**
 * 🃏 CardV2 - Card component optimisée pour super-apps
 * - Padding augmenté (24px vs 16px)
 * - Shadows plus subtiles
 * - Pressable avec feedback
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
} from 'react-native-reanimated';
import {
    COLORS_V2,
    BORDER_RADIUS_V2,
    SHADOWS_V2,
    SPACING_V2,
    ANIMATIONS,
} from '@/constants/theme-v2';

interface CardV2Props {
    children: React.ReactNode;
    onPress?: () => void;
    variant?: 'elevated' | 'outlined' | 'flat';
    padding?: keyof typeof SPACING_V2 | number;
    style?: ViewStyle;
    animated?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CardV2({
    children,
    onPress,
    variant = 'elevated',
    padding = 'lg',
    style,
    animated = true,
}: CardV2Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        if (onPress && animated) {
            scale.value = withTiming(0.98, {
                duration: ANIMATIONS.duration.fast,
            });
        }
    };

    const handlePressOut = () => {
        if (onPress && animated) {
            scale.value = withSpring(1, {
                damping: 10,
                stiffness: 300,
            });
        }
    };

    const getCardStyle = (): ViewStyle => {
        const variantStyles: Record<string, ViewStyle> = {
            elevated: {
                backgroundColor: COLORS_V2.white,
                ...SHADOWS_V2.sm,
            },
            outlined: {
                backgroundColor: COLORS_V2.white,
                borderWidth: 1,
                borderColor: COLORS_V2.gray[200],
            },
            flat: {
                backgroundColor: COLORS_V2.gray[50],
            },
        };

        const paddingValue = typeof padding === 'number'
            ? padding
            : SPACING_V2[padding];

        return {
            borderRadius: BORDER_RADIUS_V2.lg,
            padding: paddingValue,
            ...variantStyles[variant],
        };
    };

    const Component = onPress ? AnimatedPressable : View;
    const componentStyle = onPress && animated ? [getCardStyle(), animatedStyle, style] : [getCardStyle(), style];

    return (
        <Component
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={componentStyle}
        >
            {children}
        </Component>
    );
}
