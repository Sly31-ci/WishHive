/**
 * 🎯 Button Component - Design System Compliant
 * Utilise semantic tokens pour cohérence et accessibilité
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
import { theme, buttonTokens } from '@/theme';

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
        scale.value = withTiming(theme.animations.scale.tap, {
            duration: theme.animations.duration.fast,
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
            borderRadius: theme.borderRadius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: theme.spacing.sm,
        };

        // Size styles (touch-friendly)
        const sizeStyles: Record<ButtonSize, ViewStyle> = {
            sm: {
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.lg,
                minHeight: theme.layout.touchTarget.min,  // 44px
            },
            md: {
                paddingVertical: theme.spacing.md,
                paddingHorizontal: theme.spacing.xl,
                minHeight: theme.layout.touchTarget.recommended,  // 56px
            },
            lg: {
                paddingVertical: theme.spacing.lg,
                paddingHorizontal: theme.spacing.xl,
                minHeight: 64,
            },
            hero: {
                paddingVertical: theme.spacing.xl,
                paddingHorizontal: theme.spacing.xxl,
                minHeight: 72,
            },
        };

        // Variant styles (semantic tokens)
        const variantStyles: Record<ButtonVariant, ViewStyle> = {
            primary: {
                backgroundColor: buttonTokens.primary.background,  // #E69100 ✨ Brand
                ...buttonTokens.primary.shadow,
            },
            secondary: {
                backgroundColor: buttonTokens.secondary.background,  // #6B44FF ✨ Brand
                ...buttonTokens.secondary.shadow,
            },
            outline: {
                backgroundColor: buttonTokens.outline.background,
                borderWidth: 2,
                borderColor: buttonTokens.outline.border,  // #E69100 ✨ Brand
            },
            ghost: {
                backgroundColor: buttonTokens.ghost.background,
            },
            danger: {
                backgroundColor: buttonTokens.danger.background,
                ...buttonTokens.danger.shadow,
            },
        };

        // Disabled state
        const disabledStyle: ViewStyle = disabled || loading
            ? {
                backgroundColor: buttonTokens.primary.disabled.background,
                borderColor: buttonTokens.primary.disabled.background,
                opacity: 0.6,
                ...theme.shadows.none,
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

    // Text styles (semantic tokens)
    const getTextStyle = (): TextStyle => {
        const sizeStyles: Record<ButtonSize, TextStyle> = {
            sm: { ...theme.typography.presets.buttonSmall },
            md: { ...theme.typography.presets.buttonMedium },
            lg: { ...theme.typography.presets.buttonLarge },
            hero: { ...theme.typography.presets.buttonLarge },
        };

        // Texte sur boutons utilise toujours white (ratio OK sur brand colors)
        const variantTextColors: Record<ButtonVariant, TextStyle> = {
            primary: { color: buttonTokens.primary.text },       // White
            secondary: { color: buttonTokens.secondary.text },   // White
            outline: { color: buttonTokens.outline.text },       // primaryText (#B87100)
            ghost: { color: buttonTokens.ghost.text },           // textPrimary
            danger: { color: buttonTokens.danger.text },         // White
        };

        return {
            ...sizeStyles[size],
            ...variantTextColors[variant],
            ...(disabled && { color: buttonTokens.primary.disabled.text }),
        };
    };

    // Loading indicator color
    const getLoadingColor = () => {
        if (variant === 'outline' || variant === 'ghost') {
            return theme.colors.light.primaryText;
        }
        return buttonTokens.primary.text;  // White pour primary/secondary/danger
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
                    color={getLoadingColor()}
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
