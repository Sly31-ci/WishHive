import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonLoader, SkeletonText } from '../SkeletonLoader';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

export function WishlistCardSkeleton() {
    return (
        <View style={styles.card}>
            {/* Header with emoji and title */}
            <View style={styles.header}>
                <SkeletonLoader variant="circle" height={48} />
                <View style={styles.headerText}>
                    <SkeletonLoader height={18} width="70%" />
                    <SkeletonLoader height={12} width="40%" style={{ marginTop: 8 }} />
                </View>
            </View>

            {/* Description */}
            <SkeletonText lines={2} style={{ marginTop: SPACING.md }} />

            {/* Footer with stats */}
            <View style={styles.footer}>
                <SkeletonLoader height={24} width={80} borderRadius={BORDER_RADIUS.full} />
                <SkeletonLoader height={24} width={60} borderRadius={BORDER_RADIUS.full} />
            </View>
        </View>
    );
}

export function WishlistListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <View style={styles.list}>
            {Array.from({ length: count }).map((_, index) => (
                <WishlistCardSkeleton key={index} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.sm,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    headerText: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: SPACING.sm,
        marginTop: SPACING.lg,
    },
    list: {
        padding: SPACING.lg,
    },
});
