import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';
import { FONT_FAMILIES } from '../constants/wishlistThemes';

interface FontSelectorProps {
    selectedFont: 'system' | 'fun' | 'minimal' | 'handwritten' | 'elegant' | 'modern';
    onFontChange: (font: 'system' | 'fun' | 'minimal' | 'handwritten' | 'elegant' | 'modern') => void;
}

export default function FontSelector({ selectedFont, onFontChange }: FontSelectorProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Police d'écriture</Text>
            <View style={styles.grid}>
                {(Object.keys(FONT_FAMILIES) as Array<keyof typeof FONT_FAMILIES>).map((fontKey) => {
                    const font = FONT_FAMILIES[fontKey];
                    const isSelected = selectedFont === fontKey;

                    return (
                        <TouchableOpacity
                            key={fontKey}
                            style={[
                                styles.fontCard,
                                isSelected && styles.fontCardSelected,
                            ]}
                            onPress={() => onFontChange(fontKey)}
                        >
                            <Text
                                style={[
                                    styles.fontPreview,
                                    {
                                        fontFamily: font.fontFamily,
                                        fontWeight: ('weight' in font ? font.weight : '400') as any,
                                        fontStyle: ('style' in font ? font.style : 'normal') as any,
                                    },
                                ]}
                            >
                                {font.preview}
                            </Text>
                            <Text style={styles.fontName}>{font.name}</Text>
                            <Text style={styles.fontDescription}>{font.description}</Text>

                            {isSelected && (
                                <View style={styles.checkBadge}>
                                    <Check size={14} color={COLORS.white} />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    fontCard: {
        width: '48%',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        alignItems: 'center',
    },
    fontCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10',
    },
    fontPreview: {
        fontSize: 32,
        marginBottom: SPACING.xs,
    },
    fontName: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 2,
    },
    fontDescription: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[600],
        textAlign: 'center',
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
