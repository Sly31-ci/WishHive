import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Text } from 'react-native';

const PRESET_COLORS = [
    '#DC2626', '#EA580C', '#D97706', '#16A34A', // Red, Orange, Amber, Green
    '#0EA5E9', '#2563EB', '#4F46E5', '#7C3AED', // Sky, Blue, Indigo, Violet
    '#DB2777', '#4B5563', '#FFFFFF', '#000000', // Pink, Gray, White, Black
];

interface ColorPickerProps {
    label: string;
    selectedColor: string;
    onColorChange: (color: string) => void;
}

export function ColorPicker({ label, selectedColor, onColorChange }: ColorPickerProps) {
    const handleSelect = (color: string) => {
        Haptics.selectionAsync();
        onColorChange(color);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presets}>
                {PRESET_COLORS.map(color => (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorSwatch,
                            { backgroundColor: color },
                            selectedColor === color && styles.selectedSwatch
                        ]}
                        onPress={() => handleSelect(color)}
                    >
                        {selectedColor === color && <View style={styles.dot} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <View style={[styles.preview, { backgroundColor: selectedColor }]} />
                <TextInput
                    style={styles.input}
                    value={selectedColor}
                    onChangeText={onColorChange}
                    placeholder="#000000"
                    autoCapitalize="characters"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray[700],
    },
    presets: {
        gap: SPACING.sm,
        paddingVertical: 4,
    },
    colorSwatch: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedSwatch: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        transform: [{ scale: 1.1 }],
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.white, // Or black depending on contrast, simplified to white/shadow
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.xs,
    },
    preview: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    input: {
        flex: 1,
        height: 36,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.sm,
        fontSize: 14,
        fontFamily: 'monospace',
    },
});
