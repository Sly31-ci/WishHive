import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, AlertTriangle, Info, CheckCircle } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';
import { RECOMMENDED_TEXT_COLORS } from '../constants/wishlistThemes';
import { getContrastRatio, getContrastQuality } from '../utils/typography';

interface TextColorPickerProps {
    selectedColor: string;
    backgroundColor: string;
    onColorChange: (color: string) => void;
}

export default function TextColorPicker({ selectedColor, backgroundColor, onColorChange }: TextColorPickerProps) {
    const contrastRatio = getContrastRatio(selectedColor, backgroundColor);
    const contrastQuality = getContrastQuality(contrastRatio);

    // Déterminer quelle palette afficher selon le fond
    const bgLuminance = parseInt(backgroundColor.slice(1), 16);
    const isDarkBg = bgLuminance < 0x808080;
    const recommendedColors = isDarkBg ? RECOMMENDED_TEXT_COLORS.dark : RECOMMENDED_TEXT_COLORS.light;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Couleur du texte</Text>
                {contrastQuality === 'poor' && (
                    <View style={styles.warningBadge}>
                        <AlertTriangle size={14} color={COLORS.warning} />
                        <Text style={styles.warningText}>Faible contraste</Text>
                    </View>
                )}
                {contrastQuality === 'fair' && (
                    <View style={styles.infoBadge}>
                        <Info size={14} color={COLORS.info} />
                        <Text style={styles.infoText}>Contraste moyen</Text>
                    </View>
                )}
                {contrastQuality === 'good' && (
                    <View style={styles.successBadge}>
                        <CheckCircle size={14} color={COLORS.success} />
                        <Text style={styles.successText}>Bon contraste</Text>
                    </View>
                )}
                {contrastQuality === 'excellent' && (
                    <View style={styles.successBadge}>
                        <CheckCircle size={14} color={COLORS.success} />
                        <Text style={styles.successText}>Excellent!</Text>
                    </View>
                )}
            </View>

            {/* Couleurs recommandées */}
            <Text style={styles.subsectionTitle}>Recommandées</Text>
            <View style={styles.colorGrid}>
                {recommendedColors.map((colorOption) => {
                    const isSelected = selectedColor === colorOption.color;

                    return (
                        <TouchableOpacity
                            key={colorOption.color}
                            style={[
                                styles.colorCard,
                                { backgroundColor: colorOption.color },
                                isSelected && styles.colorCardSelected,
                            ]}
                            onPress={() => onColorChange(colorOption.color)}
                        >
                            {isSelected && (
                                <View style={styles.checkIcon}>
                                    <Check size={16} color={COLORS.white} />
                                </View>
                            )}
                            <Text style={[styles.colorName, { color: COLORS.white }]}>
                                {colorOption.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Couleurs vibrantes */}
            <Text style={styles.subsectionTitle}>Vibrantes</Text>
            <View style={styles.colorGrid}>
                {RECOMMENDED_TEXT_COLORS.vibrant.map((colorOption) => {
                    const isSelected = selectedColor === colorOption.color;

                    return (
                        <TouchableOpacity
                            key={colorOption.color}
                            style={[
                                styles.colorCard,
                                { backgroundColor: colorOption.color },
                                isSelected && styles.colorCardSelected,
                            ]}
                            onPress={() => onColorChange(colorOption.color)}
                        >
                            {isSelected && (
                                <View style={styles.checkIcon}>
                                    <Check size={16} color={COLORS.white} />
                                </View>
                            )}
                            <Text style={[styles.colorName, { color: COLORS.white }]}>
                                {colorOption.name}
                            </Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
    subsectionTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
        color: COLORS.gray[600],
        marginBottom: SPACING.sm,
        marginTop: SPACING.sm,
    },
    warningBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.warning + '20',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
        gap: 4,
    },
    warningText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.warning,
        fontWeight: '500',
    },
    infoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.info + '20',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
        gap: 4,
    },
    infoText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.info,
        fontWeight: '500',
    },
    successBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.success + '20',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
        gap: 4,
    },
    successText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.success,
        fontWeight: '500',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    colorCard: {
        width: '48%',
        height: 60,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    colorCardSelected: {
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    checkIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorName: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
