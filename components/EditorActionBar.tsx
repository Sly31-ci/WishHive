import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Undo, Redo, RotateCcw, Save } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';
import * as Haptics from 'expo-haptics';

interface EditorActionBarProps {
    canUndo: boolean;
    canRedo: boolean;
    hasChanges: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onReset: () => void;
    onSave: () => void;
}

export default function EditorActionBar({
    canUndo,
    canRedo,
    hasChanges,
    onUndo,
    onRedo,
    onReset,
    onSave,
}: EditorActionBarProps) {
    const handleUndo = () => {
        if (canUndo) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onUndo();
        }
    };

    const handleRedo = () => {
        if (canRedo) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onRedo();
        }
    };

    const handleReset = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        onReset();
    };

    const handleSave = () => {
        if (hasChanges) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onSave();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftActions}>
                {/* Undo */}
                <TouchableOpacity
                    onPress={handleUndo}
                    disabled={!canUndo}
                    style={[styles.actionButton, !canUndo && styles.disabled]}
                >
                    <Undo size={20} color={canUndo ? COLORS.dark : COLORS.gray[400]} />
                    <Text style={[styles.actionText, !canUndo && styles.disabledText]}>
                        Annuler
                    </Text>
                </TouchableOpacity>

                {/* Redo */}
                <TouchableOpacity
                    onPress={handleRedo}
                    disabled={!canRedo}
                    style={[styles.actionButton, !canRedo && styles.disabled]}
                >
                    <Redo size={20} color={canRedo ? COLORS.dark : COLORS.gray[400]} />
                    <Text style={[styles.actionText, !canRedo && styles.disabledText]}>
                        Refaire
                    </Text>
                </TouchableOpacity>

                {/* Reset */}
                <TouchableOpacity
                    onPress={handleReset}
                    style={styles.actionButton}
                >
                    <RotateCcw size={20} color={COLORS.warning} />
                    <Text style={[styles.actionText, { color: COLORS.warning }]}>
                        Réinitialiser
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Save */}
            <TouchableOpacity
                onPress={handleSave}
                disabled={!hasChanges}
                style={[
                    styles.saveButton,
                    !hasChanges && styles.saveButtonDisabled,
                ]}
            >
                <Save size={20} color={COLORS.white} />
                <Text style={styles.saveText}>Enregistrer</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
    },
    leftActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: COLORS.gray[100],
    },
    disabled: {
        opacity: 0.5,
    },
    actionText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '500',
        color: COLORS.dark,
    },
    disabledText: {
        color: COLORS.gray[400],
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.primary,
    },
    saveButtonDisabled: {
        backgroundColor: COLORS.gray[300],
        opacity: 0.6,
    },
    saveText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.white,
    },
});
