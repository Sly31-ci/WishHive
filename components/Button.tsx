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
import { COLORS, FONT_SIZES, BORDER_RADIUS, SHADOWS, SPACING, ANIMATIONS } from '@/constants/theme';

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

export default function Button({
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
            borderRadius: BORDER_RADIUS.lg,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: SPACING.sm,
        };

        // Size
        const sizeStyles: Record<ButtonSize, ViewStyle> = {
            sm: {
                paddingVertical: SPACING.sm,
                paddingHorizontal: SPACING.lg,
                minHeight: 44,
            },
            md: {
                paddingVertical: SPACING.md,
                paddingHorizontal: SPACING.xl,
                minHeight: 56,
            },
            lg: {
                paddingVertical: SPACING.lg,
                paddingHorizontal: SPACING.xl,
                minHeight: 64,
            },
            hero: {
                paddingVertical: SPACING.xl,
                paddingHorizontal: SPACING.xxl,
                minHeight: 72,
            },
        };

        // Variant
        const variantStyles: Record<ButtonVariant, ViewStyle> = {
            primary: {
                backgroundColor: COLORS.primary,
                ...SHADOWS.md,
            },
            secondary: {
                backgroundColor: COLORS.secondary,
                ...SHADOWS.md,
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: COLORS.primary,
            },
            ghost: {
                backgroundColor: COLORS.gray[100],
            },
            danger: {
                backgroundColor: COLORS.error,
                ...SHADOWS.md,
            },
        };

        // Disabled
        const disabledStyle: ViewStyle = disabled || loading
            ? {
                backgroundColor: COLORS.gray[200],
                borderColor: COLORS.gray[200],
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
            sm: { fontSize: FONT_SIZES.sm },
            md: { fontSize: FONT_SIZES.md },
            lg: { fontSize: FONT_SIZES.lg },
            hero: { fontSize: FONT_SIZES.xl },
        };

        const variantStyles: Record<ButtonVariant, TextStyle> = {
            primary: { color: '#FFFFFF' },
            secondary: { color: '#FFFFFF' },
            outline: { color: COLORS.primary },
            ghost: { color: COLORS.dark },
            danger: { color: '#FFFFFF' },
        };

        return {
            fontWeight: '600',
            ...sizeStyles[size],
            ...variantStyles[variant],
            ...(disabled && { color: COLORS.gray[400] }),
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
                    color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : '#FFFFFF'}
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
