import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Button from './Button'; // Assuming we have a Button component
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { X, Check } from 'lucide-react-native';

interface ReorganizeToolbarProps {
    onCancel: () => void;
    onSave: () => void;
    loading?: boolean;
    hasChanges?: boolean;
}

export function ReorganizeToolbar({ onCancel, onSave, loading, hasChanges }: ReorganizeToolbarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Button
                    variant="outline"
                    onPress={onCancel}
                    disabled={loading}
                    style={styles.button}
                    title="Annuler"
                    icon={<X size={18} color={COLORS.gray[600]} />}
                />

                <Button
                    variant="primary"
                    onPress={onSave}
                    loading={loading}
                    disabled={!hasChanges}
                    style={styles.button}
                    title="Enregistrer"
                    icon={<Check size={18} color={COLORS.white} />}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.md,
        paddingBottom: SPACING.xl, // For safe area
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    },
    content: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    button: {
        flex: 1,
    },
    cancelText: {
        color: COLORS.gray[600],
        fontWeight: '600',
    },
    saveText: {
        color: COLORS.white,
        fontWeight: '600',
    },
});
