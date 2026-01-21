/**
 * 📝 InputV2 - Input Premium avec Design System V2
 * 
 * Features:
 * - Focus states avec animations
 * - Label flottant
 * - Helper text & error states
 * - Icon support (left/right)
 * - Variants: default, outlined, filled
 * - Sizes: sm, md, lg
 */

import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    ViewStyle,
    TextStyle,
    StyleSheet,
    TextInputProps,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
} from 'react-native-reanimated';
import { ThemeV2, brand, light, spacing, radius, textStyles, durations } from '@/theme/v2';

type InputVariant = 'default' | 'outlined' | 'filled';
type InputSize = 'sm' | 'md' | 'lg';

interface InputV2Props extends TextInputProps {
    label?: string;
    helperText?: string;
    error?: string;
    variant?: InputVariant;
    size?: InputSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

export default function InputV2({
    label,
    helperText,
    error,
    variant = 'outlined',
    size = 'md',
    leftIcon,
    rightIcon,
    containerStyle,
    style,
    ...textInputProps
}: InputV2Props) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const borderColor = useSharedValue(light.border.default);
    const labelScale = useSharedValue(hasValue || isFocused ? 0.85 : 1);
    const labelY = useSharedValue(hasValue || isFocused ? -24 : 0);

    const animatedBorderStyle = useAnimatedStyle(() => {
        return {
            borderColor: borderColor.value,
        };
    });

    const animatedLabelStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: labelScale.value },
                { translateY: labelY.value },
            ],
        };
    });

    const handleFocus = () => {
        setIsFocused(true);
        borderColor.value = withTiming(error ? light.semantic.error : brand.honeyGlow, {
            duration: durations.fast,
        });
        if (label) {
            labelScale.value = withSpring(0.85, { damping: 15, stiffness: 200 });
            labelY.value = withSpring(-24, { damping: 15, stiffness: 200 });
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        borderColor.value = withTiming(error ? light.semantic.error : light.border.default, {
            duration: durations.fast,
        });
        if (label && !hasValue) {
            labelScale.value = withSpring(1, { damping: 15, stiffness: 200 });
            labelY.value = withSpring(0, { damping: 15, stiffness: 200 });
        }
    };

    const handleChangeText = (text: string) => {
        setHasValue(text.length > 0);
        textInputProps.onChangeText?.(text);
    };

    // Size styles
    const getSizeStyle = (): ViewStyle => {
        const sizes = {
            sm: { height: 40, paddingHorizontal: spacing.md },
            md: { height: 48, paddingHorizontal: spacing.lg },
            lg: { height: 56, paddingHorizontal: spacing.xl },
        };
        return sizes[size];
    };

    // Variant styles
    const getVariantStyle = (): ViewStyle => {
        const variants: Record<InputVariant, ViewStyle> = {
            default: {
                borderBottomWidth: 2,
                borderBottomColor: light.border.default,
                backgroundColor: 'transparent',
            },
            outlined: {
                borderWidth: 2,
                borderColor: light.border.default,
                borderRadius: radius.md,
                backgroundColor: light.surface.card,
            },
            filled: {
                borderWidth: 0,
                borderRadius: radius.md,
                backgroundColor: light.background.secondary,
            },
        };
        return variants[variant];
    };

    const textSizeStyle: TextStyle = {
        fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18,
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Floating Label */}
            {label && (
                <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
                    <Text
                        style={[
                            styles.label,
                            {
                                color: error
                                    ? light.semantic.error
                                    : isFocused
                                        ? brand.honeyGlow
                                        : light.text.secondary,
                            },
                        ]}
                    >
                        {label}
                    </Text>
                </Animated.View>
            )}

            {/* Input Container */}
            <Animated.View
                style={[
                    styles.inputContainer,
                    getSizeStyle(),
                    getVariantStyle(),
                    variant === 'outlined' && animatedBorderStyle,
                    error && styles.errorBorder,
                ]}
            >
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                <TextInput
                    {...textInputProps}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={handleChangeText}
                    style={[
                        styles.input,
                        textSizeStyle,
                        { color: light.text.primary },
                        leftIcon && { paddingLeft: spacing.sm },
                        rightIcon && { paddingRight: spacing.sm },
                        style,
                    ]}
                    placeholderTextColor={light.text.placeholder}
                />

                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </Animated.View>

            {/* Helper Text / Error */}
            {(helperText || error) && (
                <Text
                    style={[
                        styles.helperText,
                        error && { color: light.semantic.error },
                    ]}
                >
                    {error || helperText}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    labelContainer: {
        position: 'absolute',
        left: spacing.lg,
        top: 14,
        zIndex: 1,
        backgroundColor: light.surface.card,
        paddingHorizontal: spacing.xs,
        transformOrigin: 'left center',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontWeight: '400',
    },
    leftIcon: {
        marginRight: spacing.sm,
    },
    rightIcon: {
        marginLeft: spacing.sm,
    },
    errorBorder: {
        borderColor: light.semantic.error,
    },
    helperText: {
        fontSize: 12,
        color: light.text.tertiary,
        marginTop: spacing.xs,
        marginLeft: spacing.lg,
    },
});
