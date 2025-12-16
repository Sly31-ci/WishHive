import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { WishlistTheme } from '../constants/wishlistThemes';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import { getTypographyStyle } from '../utils/typography';
import { getCardStyle } from '../utils/background';
import ThemeBackground from './ThemeBackground';

interface LiveThemePreviewProps {
    theme: WishlistTheme;
    wishlistTitle: string;
    sampleItems?: Array<{ title: string; price?: string }>;
}

const DEFAULT_SAMPLE_ITEMS: Array<{ title: string; price?: string }> = [];

export default function LiveThemePreview({
    theme,
    wishlistTitle,
    sampleItems = DEFAULT_SAMPLE_ITEMS,
}: LiveThemePreviewProps) {
    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            <ThemeBackground
                settings={theme.background}
                width={screenWidth}
                height={sampleItems.length > 0 ? 400 : 180}
            >
                <View style={[styles.content, sampleItems.length === 0 && styles.contentCentered]}>
                    {/* Header avec titre */}
                    <View style={[styles.header, sampleItems.length === 0 && styles.headerNoMargin]}>
                        <Text
                            style={[
                                styles.title,
                                theme.typography && getTypographyStyle(theme.typography),
                                sampleItems.length === 0 && styles.titleLarge
                            ]}
                            numberOfLines={2}
                        >
                            {wishlistTitle}
                        </Text>
                        {sampleItems.length > 0 && (
                            <Text style={styles.subtitle}>
                                {sampleItems.length} cadeaux
                            </Text>
                        )}
                    </View>

                    {/* Sample items avec card style */}
                    {sampleItems.length > 0 && (
                        <ScrollView
                            style={styles.itemsList}
                            showsVerticalScrollIndicator={false}
                        >
                            {sampleItems.map((item, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.itemCard,
                                        getCardStyle(theme.cardStyle, theme.accentColor),
                                    ]}
                                >
                                    <View style={styles.itemContent}>
                                        <View style={styles.itemImage} />
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemTitle} numberOfLines={1}>
                                                {item.title}
                                            </Text>
                                            {item.price && (
                                                <Text style={styles.itemPrice}>{item.price}</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </ThemeBackground>

            {/* Label */}
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Aperçu en direct</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        marginBottom: SPACING.md,
    },
    content: {
        flex: 1,
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
    itemsList: {
        flex: 1,
    },
    itemCard: {
        marginBottom: SPACING.md,
        padding: SPACING.md,
        backgroundColor: COLORS.white,
    },
    itemContent: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.gray[200],
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '500',
    },
    labelContainer: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
    },
    label: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.white,
        fontWeight: '500',
    },
    contentCentered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerNoMargin: {
        marginBottom: 0,
        alignItems: 'center',
    },
    titleLarge: {
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 0,
    },
});
