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
    COLORS_V2,
    FONT_SIZES_V2,
    SPACING_V2,
    LAYOUT,
    SHADOWS_V2,
} from '@/constants/theme-v2';

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
                backgroundColor: COLORS_V2.white,
                ...SHADOWS_V2.xs,
            },
            transparent: {
                backgroundColor: 'transparent',
            },
            large: {
                backgroundColor: COLORS_V2.white,
                paddingBottom: SPACING_V2.lg,
            },
        };

        return {
            paddingTop: insets.top || SPACING_V2.md,
            paddingBottom: variant === 'large' ? SPACING_V2.lg : SPACING_V2.md,
            paddingHorizontal: SPACING_V2.lg,
            borderBottomWidth: showBorder && variant !== 'transparent' ? 1 : 0,
            borderBottomColor: COLORS_V2.gray[100],
            ...variantStyles[variant],
        };
    };

    const getTitleStyle = (): TextStyle => {
        return {
            fontSize: variant === 'large' ? FONT_SIZES_V2.xxxl : FONT_SIZES_V2.xxl,
            fontWeight: '700',
            color: COLORS_V2.dark,
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
        minHeight: LAYOUT.headerHeight - SPACING_V2.md * 2,
    },
    section: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING_V2.sm,
    },
    centerSection: {
        flex: 1,
        alignItems: 'flex-start',
        paddingHorizontal: SPACING_V2.md,
    },
    rightSection: {
        justifyContent: 'flex-end',
    },
    subtitle: {
        fontSize: FONT_SIZES_V2.sm,
        color: COLORS_V2.gray[600],
        marginTop: SPACING_V2.xxs,
    },
});
