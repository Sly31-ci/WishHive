import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/constants/theme';

interface ConfirmDialogProps {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
    emoji?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    visible,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    onConfirm,
    onCancel,
    type = 'danger',
    emoji = '🗑️',
}) => {
    const { theme, colors } = useTheme();

    const getColors = () => {
        switch (type) {
            case 'warning':
                return { bg: theme.warning || '#FFB020', text: colors.white };
            case 'info':
                return { bg: theme.info || '#2196F3', text: colors.white };
            case 'danger':
            default:
                return { bg: theme.error, text: colors.white };
        }
    };

    const typeColors = getColors();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
                <View style={[styles.container, { backgroundColor: theme.card }]}>
                    <View style={[styles.iconContainer, { backgroundColor: typeColors.bg + '20' }]}>
                        <Text style={styles.emoji}>{emoji}</Text>
                    </View>

                    <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                    <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
                            onPress={onCancel}
                        >
                            <Text style={[styles.buttonText, { color: theme.text }]}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.confirmButton,
                                { backgroundColor: typeColors.bg }
                            ]}
                            onPress={onConfirm}
                        >
                            <Text style={[styles.buttonText, { color: typeColors.text }]}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    container: {
        width: '100%',
        maxWidth: 320,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    emoji: {
        fontSize: 32,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: FONT_SIZES.md,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.md,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    confirmButton: {
        // Background color set via props
    },
    buttonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
});
