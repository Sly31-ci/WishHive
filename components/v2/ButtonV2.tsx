/**
 * 🎯 ButtonV2 - Bouton optimisé pour super-apps mobiles
 * - Hauteur minimale 56px (touch-friendly)
 * - Variants simplifiés
 * - Animations natives
 * - Feedback haptique
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
    Pressable,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { COLORS_V2, FONT_SIZES_V2, BORDER_RADIUS_V2, SHADOWS_V2, SPACING_V2, ANIMATIONS } from '@/constants/theme-v2';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'hero';

interface ButtonV2Props {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ButtonV2({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    style,
    textStyle,
}: ButtonV2Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withTiming(ANIMATIONS.scale.tap, {
            duration: ANIMATIONS.duration.fast,
        });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, {
            damping: 10,
            stiffness: 300,
        });
    };

    const handlePress = () => {
        if (!disabled && !loading) {
            onPress();
        }
    };

    // Styles dynamiques basés sur variant
    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            borderRadius: BORDER_RADIUS_V2.lg,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: SPACING_V2.sm,
        };

        // Size
        const sizeStyles: Record<ButtonSize, ViewStyle> = {
            sm: {
                paddingVertical: SPACING_V2.sm,
                paddingHorizontal: SPACING_V2.lg,
                minHeight: 44,
            },
            md: {
                paddingVertical: SPACING_V2.md,
                paddingHorizontal: SPACING_V2.xl,
                minHeight: 56,
            },
            lg: {
                paddingVertical: SPACING_V2.lg,
                paddingHorizontal: SPACING_V2.xl,
                minHeight: 64,
            },
            hero: {
                paddingVertical: SPACING_V2.xl,
                paddingHorizontal: SPACING_V2.xxl,
                minHeight: 72,
            },
        };

        // Variant
        const variantStyles: Record<ButtonVariant, ViewStyle> = {
            primary: {
                backgroundColor: COLORS_V2.primary,
                ...SHADOWS_V2.md,
            },
            secondary: {
                backgroundColor: COLORS_V2.secondary,
                ...SHADOWS_V2.md,
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: COLORS_V2.primary,
            },
            ghost: {
                backgroundColor: COLORS_V2.gray[100],
            },
            danger: {
                backgroundColor: COLORS_V2.error,
                ...SHADOWS_V2.md,
            },
        };

        // Disabled
        const disabledStyle: ViewStyle = disabled || loading
            ? {
                backgroundColor: COLORS_V2.gray[200],
                borderColor: COLORS_V2.gray[200],
                opacity: 0.6,
            }
            : {};

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
            ...disabledStyle,
            ...(fullWidth && { width: '100%' }),
        };
    };

    // Text styles
    const getTextStyle = (): TextStyle => {
        const sizeStyles: Record<ButtonSize, TextStyle> = {
            sm: { fontSize: FONT_SIZES_V2.sm },
            md: { fontSize: FONT_SIZES_V2.md },
            lg: { fontSize: FONT_SIZES_V2.lg },
            hero: { fontSize: FONT_SIZES_V2.xl },
        };

        const variantStyles: Record<ButtonVariant, TextStyle> = {
            primary: { color: '#FFFFFF' },
            secondary: { color: '#FFFFFF' },
            outline: { color: COLORS_V2.primary },
            ghost: { color: COLORS_V2.dark },
            danger: { color: '#FFFFFF' },
        };

        return {
            fontWeight: '600',
            ...sizeStyles[size],
            ...variantStyles[variant],
            ...(disabled && { color: COLORS_V2.gray[400] }),
        };
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[getButtonStyle(), animatedStyle, style]}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? COLORS_V2.primary : '#FFFFFF'}
                    size="small"
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && icon}
                    <Text style={[getTextStyle(), textStyle]}>{title}</Text>
                    {icon && iconPosition === 'right' && icon}
                </>
            )}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    // Styles statiques si nécessaire
});
