import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WishlistTheme } from '@/constants/wishlistThemes';
import { getTypographyStyle } from '@/utils/typography';
import { BORDER_RADIUS, SHADOWS, COLORS, FONT_SIZES } from '@/constants/theme';

interface ThemePreviewProps {
    theme: WishlistTheme;
    title?: string;
    size?: 'small' | 'medium' | 'large';
    style?: any;
}

export function ThemePreview({ theme, title = 'Wishlist', size = 'medium', style }: ThemePreviewProps) {
    const isGradient = theme.gradient;

    const widthMap = {
        small: 60,
        medium: 120,
        large: '100%',
    };

    const heightMap = {
        small: 60,
        medium: 80,
        large: 120,
    };

    const containerStyle = {
        width: widthMap[size],
        height: heightMap[size],
        ...style,
    };

    const Content = () => (
        <View style={styles.contentContainer}>
            <Text style={[styles.emoji, size === 'small' && styles.emojiSmall]}>
                {theme.emoji}
            </Text>
            {size !== 'small' && (
                <Text
                    style={[
                        styles.title,
                        theme.typography && getTypographyStyle(theme.typography),
                    ]}
                    numberOfLines={1}
                >
                    {title}
                </Text>
            )}
        </View>
    );

    if (isGradient) {
        return (
            <LinearGradient
                colors={[theme.primaryColor, theme.secondaryColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.container, containerStyle]}
            >
                <Content />
            </LinearGradient>
        );
    }

    return (
        <View style={[styles.container, containerStyle, { backgroundColor: theme.primaryColor }]}>
            <Content />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    contentContainer: {
        alignItems: 'center',
        gap: 8,
    },
    emoji: {
        fontSize: 24,
    },
    emojiSmall: {
        fontSize: 20,
    },
    title: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: FONT_SIZES.md,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        paddingHorizontal: 8,
    },
});
