import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import { TypographySettings, DEFAULT_TYPOGRAPHY } from '../constants/wishlistThemes';
import { validateTypography } from '../utils/typography';
import FontSelector from './FontSelector';
import TextColorPicker from './TextColorPicker';
import TypographySlider from './TypographySlider';

interface TypographyEditorProps {
    typography: TypographySettings;
    backgroundColor: string;
    onChange: (typography: TypographySettings) => void;
}

export default function TypographyEditor({ typography, backgroundColor, onChange }: TypographyEditorProps) {
    const warnings = validateTypography(typography);

    const updateTypography = (updates: Partial<TypographySettings>) => {
        onChange({ ...typography, ...updates });
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Font Selector */}
            <FontSelector
                selectedFont={typography.fontFamily}
                onFontChange={(font) => updateTypography({ fontFamily: font })}
            />

            {/* Font Size */}
            <TypographySlider
                label="Taille du texte"
                value={typography.fontSize}
                min={14}
                max={48}
                unit="px"
                onChange={(size) => updateTypography({ fontSize: size })}
                warning={
                    typography.fontSize < 16
                        ? 'Taille petite, peut nuire à la lisibilité'
                        : typography.fontSize > 36
                            ? 'Taille très grande'
                            : undefined
                }
            />

            {/* Text Color */}
            <TextColorPicker
                selectedColor={typography.color}
                backgroundColor={backgroundColor}
                onColorChange={(color) => updateTypography({ color })}
            />

            {/* Alignment */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alignement</Text>
                <View style={styles.alignmentButtons}>
                    <TouchableOpacity
                        style={[
                            styles.alignmentButton,
                            typography.alignment === 'left' && styles.alignmentButtonActive,
                        ]}
                        onPress={() => updateTypography({ alignment: 'left' })}
                    >
                        <AlignLeft size={20} color={typography.alignment === 'left' ? COLORS.white : COLORS.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.alignmentButton,
                            typography.alignment === 'center' && styles.alignmentButtonActive,
                        ]}
                        onPress={() => updateTypography({ alignment: 'center' })}
                    >
                        <AlignCenter size={20} color={typography.alignment === 'center' ? COLORS.white : COLORS.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.alignmentButton,
                            typography.alignment === 'right' && styles.alignmentButtonActive,
                        ]}
                        onPress={() => updateTypography({ alignment: 'right' })}
                    >
                        <AlignRight size={20} color={typography.alignment === 'right' ? COLORS.white : COLORS.dark} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Basic Effects */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Effets de base</Text>
                <View style={styles.toggleRow}>
                    <TouchableOpacity
                        style={[styles.toggleButton, typography.bold && styles.toggleButtonActive]}
                        onPress={() => updateTypography({ bold: !typography.bold })}
                    >
                        <Text style={[styles.toggleText, typography.bold && styles.toggleTextActive, { fontWeight: '700' }]}>
                            Gras
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, typography.italic && styles.toggleButtonActive]}
                        onPress={() => updateTypography({ italic: !typography.italic })}
                    >
                        <Text style={[styles.toggleText, typography.italic && styles.toggleTextActive, { fontStyle: 'italic' }]}>
                            Italique
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, typography.uppercase && styles.toggleButtonActive]}
                        onPress={() => updateTypography({ uppercase: !typography.uppercase })}
                    >
                        <Text style={[styles.toggleText, typography.uppercase && styles.toggleTextActive]}>
                            MAJUSCULES
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Shadow Effect */}
            <View style={styles.section}>
                <View style={styles.effectHeader}>
                    <Text style={styles.sectionTitle}>Ombre</Text>
                    <TouchableOpacity
                        style={[styles.toggleSwitch, typography.shadow && styles.toggleSwitchActive]}
                        onPress={() => updateTypography({ shadow: !typography.shadow })}
                    >
                        <Text style={[styles.toggleSwitchText, typography.shadow && styles.toggleSwitchTextActive]}>
                            {typography.shadow ? 'Activé' : 'Désactivé'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {typography.shadow && (
                    <View style={styles.effectControls}>
                        <TypographySlider
                            label="Flou"
                            value={typography.shadowBlur || 4}
                            min={0}
                            max={10}
                            unit="px"
                            onChange={(blur) => updateTypography({ shadowBlur: blur })}
                        />
                    </View>
                )}
            </View>

            {/* Spacing */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Espacement</Text>
                <TypographySlider
                    label="Espacement des lettres"
                    value={typography.letterSpacing}
                    min={-2}
                    max={10}
                    step={0.5}
                    unit="px"
                    onChange={(spacing) => updateTypography({ letterSpacing: spacing })}
                    warning={
                        typography.letterSpacing > 5
                            ? 'Espacement très large'
                            : typography.letterSpacing < -1
                                ? 'Espacement très serré'
                                : undefined
                    }
                />
                <TypographySlider
                    label="Hauteur de ligne"
                    value={typography.lineHeight}
                    min={1.0}
                    max={2.0}
                    step={0.1}
                    onChange={(height) => updateTypography({ lineHeight: height })}
                />
            </View>

            {/* Warnings */}
            {warnings.length > 0 && (
                <View style={styles.warningsContainer}>
                    {warnings.map((warning, index) => (
                        <Text key={index} style={styles.warningText}>
                            ⚠️ {warning}
                        </Text>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.md,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    alignmentButtons: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    alignmentButton: {
        flex: 1,
        padding: SPACING.md,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        alignItems: 'center',
        justifyContent: 'center',
    },
    alignmentButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    toggleRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    toggleButton: {
        flex: 1,
        padding: SPACING.md,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: COLORS.primary + '20',
        borderColor: COLORS.primary,
    },
    toggleText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.dark,
        fontWeight: '500',
    },
    toggleTextActive: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    effectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    toggleSwitch: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        backgroundColor: COLORS.gray[200],
        borderRadius: BORDER_RADIUS.sm,
    },
    toggleSwitchActive: {
        backgroundColor: COLORS.primary,
    },
    toggleSwitchText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[600],
        fontWeight: '500',
    },
    toggleSwitchTextActive: {
        color: COLORS.white,
    },
    effectControls: {
        marginTop: SPACING.sm,
    },
    warningsContainer: {
        backgroundColor: COLORS.warning + '10',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.warning,
        marginTop: SPACING.md,
    },
    warningText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.warning,
        marginBottom: SPACING.xs,
    },
});
