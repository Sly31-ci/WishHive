/**
 * 🎯 ButtonV2 - Bouton Premium avec Design System V2
 * 
 * Features:
 * - Gradients premium
 * - Glassmorphism
 * - Animations fluides (Reanimated)
 * - Haptic feedback
 * - Touch-friendly (min 44px)
 * - Variants: primary, secondary, outline, ghost, danger
 * - Sizes: sm, md, lg, hero
 */

import React from 'react';
import {
    Pressable,
    Text,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeV2, brand, light, shadowsLight, spacing, radius, textStyles, durations } from '@/theme/v2';

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
    gradient?: boolean; // Use gradient background
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
    gradient = true,
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
        scale.value = withTiming(0.96, {
            duration: durations.instant,
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

    // Button styles based on size
    const getSizeStyle = (): ViewStyle => {
        const sizes = {
            sm: {
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.lg,
                minHeight: 44,
            },
            md: {
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.xl,
                minHeight: 56,
            },
            lg: {
                paddingVertical: spacing.lg,
                paddingHorizontal: spacing.xxl,
                minHeight: 64,
            },
            hero: {
                paddingVertical: spacing.xl,
                paddingHorizontal: spacing.xxxl,
                minHeight: 72,
            },
        };
        return sizes[size];
    };

    // Button styles based on variant
    const getVariantStyle = (): ViewStyle => {
        if (disabled || loading) {
            return {
                backgroundColor: light.border.light,
                opacity: 0.6,
            };
        }

        const variants: Record<ButtonVariant, ViewStyle> = {
            primary: gradient
                ? {} // Gradient handled separately
                : {
                    backgroundColor: brand.honeyGlow,
                    ...shadowsLight.primary,
                },
            secondary: gradient
                ? {}
                : {
                    backgroundColor: brand.hivePurple,
                    ...shadowsLight.secondary,
                },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: brand.honeyGlow,
            },
            ghost: {
                backgroundColor: light.state.hover,
            },
            danger: {
                backgroundColor: light.semantic.error,
                ...shadowsLight.md,
            },
        };

        return variants[variant];
    };

    // Text styles
    const getTextStyle = (): TextStyle => {
        const sizeStyles = {
            sm: { fontSize: 14 },
            md: { fontSize: 16 },
            lg: { fontSize: 18 },
            hero: { fontSize: 20 },
        };

        const variantStyles: Record<ButtonVariant, TextStyle> = {
            primary: { color: '#FFFFFF' },
            secondary: { color: '#FFFFFF' },
            outline: { color: brand.honeyGlow },
            ghost: { color: light.text.primary },
            danger: { color: '#FFFFFF' },
        };

        return {
            fontWeight: '600',
            ...sizeStyles[size],
            ...(disabled || loading ? { color: light.text.disabled } : variantStyles[variant]),
        };
    };

    // Should use gradient?
    const useGradient = gradient && !disabled && !loading && (variant === 'primary' || variant === 'secondary');

    const baseStyle: ViewStyle = {
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: spacing.sm,
        overflow: 'hidden',
        ...(fullWidth && { width: '100%' }),
    };

    const buttonContent = (
        <>
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? brand.honeyGlow : '#FFFFFF'}
                    size="small"
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && icon}
                    <Text style={[getTextStyle(), textStyle]}>{title}</Text>
                    {icon && iconPosition === 'right' && icon}
                </>
            )}
        </>
    );

    if (useGradient) {
        const gradientColors = variant === 'primary'
            ? [brand.honeyGlow, brand.honeyDark]
            : [brand.hivePurple, brand.purpleDark];

        return (
            <AnimatedPressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                style={[baseStyle, getSizeStyle(), animatedStyle, style]}
            >
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }}
                />
                {buttonContent}
            </AnimatedPressable>
        );
    }

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[baseStyle, getSizeStyle(), getVariantStyle(), animatedStyle, style]}
        >
            {buttonContent}
        </AnimatedPressable>
    );
}
