import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

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
    const { theme } = useTheme();

    const handlePress = () => {
        Haptics.selectionAsync();
        onPress();
    };

    return (
        <TouchableOpacity
            style={[
                styles.chip,
                {
                    backgroundColor: active ? theme.primary : theme.card,
                    borderColor: active ? theme.primary : theme.border
                }
            ]}
            onPress={handlePress}
        >
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text
                style={[
                    styles.label,
                    { color: active ? COLORS.white : theme.textSecondary }
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
        paddingHorizontal: SPACING.md,
        paddingVertical: 8,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        gap: SPACING.xs,
        marginRight: SPACING.xs,
    },
    icon: {
        fontSize: 16,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
});
