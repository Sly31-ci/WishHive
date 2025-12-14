import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
// @ts-ignore - Slider is available in React Native
import Slider from '@react-native-community/slider';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

interface TypographySliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (value: number) => void;
    warning?: string;
}

export default function TypographySlider({
    label,
    value,
    min,
    max,
    step = 1,
    unit = '',
    onChange,
    warning,
}: TypographySliderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>
                    {value}{unit}
                </Text>
            </View>

            <Slider
                style={styles.slider}
                minimumValue={min}
                maximumValue={max}
                step={step}
                value={value}
                onValueChange={onChange}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.gray[300]}
                thumbTintColor={COLORS.primary}
            />

            <View style={styles.range}>
                <Text style={styles.rangeText}>{min}{unit}</Text>
                <Text style={styles.rangeText}>{max}{unit}</Text>
            </View>

            {warning && (
                <Text style={styles.warning}>⚠️ {warning}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
        color: COLORS.dark,
    },
    value: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.primary,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    range: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -8,
    },
    rangeText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    warning: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.warning,
        marginTop: SPACING.xs,
    },
});
