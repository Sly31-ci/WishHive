import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '@/constants/theme';

interface StatusBadgeProps {
    label: string;
    variant?: 'success' | 'purple' | 'neutral';
}

export function StatusBadge({ label, variant = 'neutral' }: StatusBadgeProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return {
                    bg: '#DEF7EC',
                    text: '#03543F',
                };
            case 'purple':
                return {
                    bg: '#F5F3FF',
                    text: '#5B21B6',
                };
            default:
                return {
                    bg: '#F3F4F6',
                    text: '#374151',
                };
        }
    };

    const styles_variant = getVariantStyles();

    return (
        <View style={[styles.container, { backgroundColor: styles_variant.bg }]}>
            <Text style={[styles.text, { color: styles_variant.text }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
    },
});
