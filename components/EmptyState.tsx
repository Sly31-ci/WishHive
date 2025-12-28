import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import Button from './Button';

interface EmptyStateProps {
    emoji: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ emoji, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    onPress={onAction}
                    style={styles.button}
                    size="md"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: SPACING.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 64,
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    description: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[500],
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    button: {
        minWidth: 160,
    },
});
