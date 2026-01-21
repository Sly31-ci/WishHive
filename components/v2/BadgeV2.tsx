/**
 * 🏷️ BadgeV2 - Badge Premium avec Design System V2
 * 
 * Features:
 * - Variants: primary, secondary, success, error, warning, info, neutral
 * - Sizes: sm, md, lg
 * - Styles: filled, outlined, soft
 * - Icon support
 * - Pulse animation (optionnel)
 * - Dot indicator
 */

import React, { useEffect } from 'react';
import {
    View,
    Text,
    ViewStyle,
    TextStyle,
    StyleSheet,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { ThemeV2, brand, light, spacing, radius } from '@/theme/v2';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeStyle = 'filled' | 'outlined' | 'soft';

interface BadgeV2Props {
    label: string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    badgeStyle?: BadgeStyle;
    icon?: React.ReactNode;
    dot?: boolean; // Show dot indicator
    pulse?: boolean; // Pulse animation
    style?: ViewStyle;
}

export default function BadgeV2({
    label,
    variant = 'primary',
    size = 'md',
    badgeStyle = 'filled',
    icon,
    dot = false,
    pulse = false,
    style,
}: BadgeV2Props) {
    const pulseScale = useSharedValue(1);

    useEffect(() => {
        if (pulse) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.1, { duration: 800 }),
                    withTiming(1, { duration: 800 })
                ),
                -1, // Infinite
                false
            );
        }
    }, [pulse]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulseScale.value }],
        };
    });

    // Size styles
    const getSizeStyle = (): ViewStyle & TextStyle => {
        const sizes = {
            sm: {
                paddingVertical: spacing.xxs,
                paddingHorizontal: spacing.xs,
                fontSize: 11,
                height: 20,
            },
            md: {
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
                fontSize: 12,
                height: 24,
            },
            lg: {
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                fontSize: 14,
                height: 32,
            },
        };
        return sizes[size];
    };

    // Variant colors
    const getVariantColors = () => {
        const variants = {
            primary: {
                bg: brand.honeyGlow,
                text: '#FFFFFF',
                border: brand.honeyGlow,
                soft: 'rgba(255, 185, 55, 0.15)',
            },
            secondary: {
                bg: brand.hivePurple,
                text: '#FFFFFF',
                border: brand.hivePurple,
                soft: 'rgba(127, 91, 255, 0.15)',
            },
            success: {
                bg: light.semantic.success,
                text: '#FFFFFF',
                border: light.semantic.success,
                soft: light.semantic.successBg,
            },
            error: {
                bg: light.semantic.error,
                text: '#FFFFFF',
                border: light.semantic.error,
                soft: light.semantic.errorBg,
            },
            warning: {
                bg: light.semantic.warning,
                text: '#FFFFFF',
                border: light.semantic.warning,
                soft: light.semantic.warningBg,
            },
            info: {
                bg: light.semantic.info,
                text: '#FFFFFF',
                border: light.semantic.info,
                soft: light.semantic.infoBg,
            },
            neutral: {
                bg: light.text.secondary,
                text: '#FFFFFF',
                border: light.border.strong,
                soft: light.background.secondary,
            },
        };
        return variants[variant];
    };

    // Badge style
    const getBadgeStyle = (): ViewStyle & TextStyle => {
        const colors = getVariantColors();
        const styles = {
            filled: {
                backgroundColor: colors.bg,
                color: colors.text,
            },
            outlined: {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: colors.border,
                color: colors.bg,
            },
            soft: {
                backgroundColor: colors.soft,
                color: colors.bg,
            },
        };
        return styles[badgeStyle];
    };

    const sizeStyle = getSizeStyle();
    const variantStyle = getBadgeStyle();

    return (
        <Animated.View
            style={[
                styles.badge,
                {
                    paddingVertical: sizeStyle.paddingVertical,
                    paddingHorizontal: sizeStyle.paddingHorizontal,
                    height: sizeStyle.height,
                    backgroundColor: variantStyle.backgroundColor,
                    borderWidth: variantStyle.borderWidth,
                    borderColor: variantStyle.borderColor,
                },
                pulse && animatedStyle,
                style,
            ]}
        >
            {dot && (
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor: badgeStyle === 'filled' ? '#FFFFFF' : variantStyle.color,
                        },
                    ]}
                />
            )}

            {icon && <View style={styles.icon}>{icon}</View>}

            <Text
                style={[
                    styles.label,
                    {
                        fontSize: sizeStyle.fontSize,
                        color: variantStyle.color,
                    },
                ]}
            >
                {label}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.full,
        gap: spacing.xxs,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    icon: {
        marginRight: spacing.xxs,
    },
    label: {
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
