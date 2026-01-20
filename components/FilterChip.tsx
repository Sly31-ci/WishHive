/**
 * 🎯 FilterChip Component - REFONTE PREMIUM
 * 
 * Design iOS-first :
 * - État actif : Honey Glow (#FFB937) avec texte blanc
 * - État inactif : Fond blanc avec bordure grise
 * - Bordures arrondies (pill shape)
 * - Animations fluides au tap
 * - Haptic feedback
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BRAND_PALETTE } from '@/theme/colors';

interface FilterChipProps {
    label: string;
    active: boolean;
    onPress: () => void;
    icon?: string; // Emoji as string
}

export const FilterChip: React.FC<FilterChipProps> = ({
    label,
    active,
    onPress,
    icon,
}) => {
    const handlePress = () => {
        Haptics.selectionAsync();
        onPress();
    };

    return (
        <TouchableOpacity
            style={[
                styles.chip,
                active ? styles.chipActive : styles.chipInactive
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text
                style={[
                    styles.label,
                    active ? styles.labelActive : styles.labelInactive
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999, // ✅ Pill shape
        gap: 6,
        marginRight: 8,
        minHeight: 44, // ✅ Touch target iOS
    },
    chipActive: {
        backgroundColor: BRAND_PALETTE.honeyGlow, // 🟡 Honey Glow
        borderWidth: 0,
        shadowColor: BRAND_PALETTE.honeyGlow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    chipInactive: {
        backgroundColor: BRAND_PALETTE.pureWhite,
        borderWidth: 1.5,
        borderColor: '#E5E7EB', // Gray 200
    },
    icon: {
        fontSize: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    labelActive: {
        color: BRAND_PALETTE.pureWhite, // ✅ Blanc sur Honey Glow
    },
    labelInactive: {
        color: BRAND_PALETTE.grayDark, // ✅ Gris foncé lisible
    },
});
