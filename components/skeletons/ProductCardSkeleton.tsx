import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonLoader, SkeletonText } from '../SkeletonLoader';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

export function ProductCardSkeleton() {
    return (
        <View style={styles.card}>
            {/* Product image */}
            <SkeletonLoader height={150} width="100%" borderRadius={BORDER_RADIUS.md} />

            {/* Product info */}
            <View style={styles.info}>
                <SkeletonLoader height={16} width="80%" />
                <SkeletonLoader height={12} width="50%" style={{ marginTop: 8 }} />
                <SkeletonLoader height={20} width={80} style={{ marginTop: 12 }} />
            </View>
        </View>
    );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
    return (
        <View style={styles.grid}>
            {Array.from({ length: count }).map((_, index) => (
                <View key={index} style={styles.gridItem}>
                    <ProductCardSkeleton />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        ...SHADOWS.sm,
    },
    info: {
        padding: SPACING.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SPACING.sm,
    },
    gridItem: {
        width: '50%',
        padding: SPACING.sm,
    },
});
