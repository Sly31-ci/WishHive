/**
 * 📱 HeaderV2 - Header simplifié pour super-apps
 * - Maximum 3 éléments (left / center / right)
 * - Hauteur optimisée 64px
 * - Safe area automatique
 * - Variants: default, transparent, large
 */

import React from 'react';
import { View, Text, StyleSheet, StatusBar, ViewStyle, TextStyle, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    COLORS,
    FONT_SIZES,
    SPACING,
    LAYOUT,
    SHADOWS,
} from '@/constants/theme';

type HeaderVariant = 'default' | 'transparent' | 'large';

interface HeaderV2Props {
    title?: string;
    subtitle?: string;
    leftComponent?: React.ReactNode;
    rightComponent?: React.ReactNode;
    variant?: HeaderVariant;
    style?: ViewStyle;
    showBorder?: boolean;
}

export function HeaderV2({
    title,
    subtitle,
    leftComponent,
    rightComponent,
    variant = 'default',
    style,
    showBorder = true,
}: HeaderV2Props) {
    const insets = useSafeAreaInsets();

    const getHeaderStyle = (): ViewStyle => {
        const variantStyles: Record<HeaderVariant, ViewStyle> = {
            default: {
                backgroundColor: COLORS.white,
                ...SHADOWS.xs,
            },
            transparent: {
                backgroundColor: 'transparent',
            },
            large: {
                backgroundColor: COLORS.white,
                paddingBottom: SPACING.lg,
            },
        };

        return {
            paddingTop: insets.top || SPACING.md,
            paddingBottom: variant === 'large' ? SPACING.lg : SPACING.md,
            paddingHorizontal: SPACING.lg,
            borderBottomWidth: showBorder && variant !== 'transparent' ? 1 : 0,
            borderBottomColor: COLORS.gray[100],
            ...variantStyles[variant],
        };
    };

    const getTitleStyle = (): TextStyle => {
        return {
            fontSize: variant === 'large' ? FONT_SIZES.xxxl : FONT_SIZES.xxl,
            fontWeight: '700',
            color: COLORS.dark,
        };
    };

    return (
        <View style={[getHeaderStyle(), style]}>
            <StatusBar
                barStyle={variant === 'transparent' ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />

            <View style={styles.content}>
                {/* Left Section */}
                <View style={styles.section}>
                    {leftComponent}
                </View>

                {/* Center Section */}
                <View style={styles.centerSection}>
                    {title && (
                        <View>
                            <Text style={getTitleStyle()} numberOfLines={1}>
                                {title}
                            </Text>
                            {subtitle && (
                                <Text style={styles.subtitle} numberOfLines={1}>
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Right Section */}
                <View style={[styles.section, styles.rightSection]}>
                    {rightComponent}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: LAYOUT.headerHeight - SPACING.md * 2,
    },
    section: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    centerSection: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: SPACING.md,
    },
    rightSection: {
        justifyContent: 'flex-end',
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        marginTop: SPACING.xxs,
    },
});
