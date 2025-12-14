import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { getPointsForNextLevel, getLevelProgress } from '@/lib/badgeEngine';

interface LevelProgressBarProps {
    currentLevel: number;
    currentPoints: number;
    showDetails?: boolean;
}

export function LevelProgressBar({
    currentLevel,
    currentPoints,
    showDetails = true,
}: LevelProgressBarProps) {
    const nextLevelPoints = getPointsForNextLevel(currentLevel);
    const progress = getLevelProgress(currentPoints, currentLevel);
    const pointsNeeded = nextLevelPoints - currentPoints;

    return (
        <View style={styles.container}>
            {showDetails && (
                <View style={styles.header}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelLabel}>Niveau</Text>
                        <Text style={styles.levelNumber}>{currentLevel}</Text>
                    </View>

                    <View style={styles.pointsInfo}>
                        <Text style={styles.pointsText}>
                            {currentPoints.toLocaleString()} pts
                        </Text>
                        <Text style={styles.nextLevelText}>
                            {pointsNeeded.toLocaleString()} pts pour niveau {currentLevel + 1}
                        </Text>
                    </View>
                </View>
            )}

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            {
                                width: `${progress}%`,
                            },
                        ]}
                    >
                        {/* Shimmer Effect */}
                        <View style={styles.shimmer} />
                    </View>
                </View>

                {/* Percentage Label */}
                {showDetails && (
                    <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
                )}
            </View>

            {/* Milestones */}
            {showDetails && (
                <View style={styles.milestones}>
                    <View style={styles.milestone}>
                        <View style={[styles.milestoneMarker, styles.milestoneReached]} />
                        <Text style={styles.milestoneLabel}>Niv. {currentLevel}</Text>
                    </View>

                    <View style={styles.milestone}>
                        <View style={styles.milestoneMarker} />
                        <Text style={styles.milestoneLabel}>Niv. {currentLevel + 1}</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        gap: SPACING.xs,
    },
    levelLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.white,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    levelNumber: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '800',
        color: COLORS.white,
    },
    pointsInfo: {
        alignItems: 'flex-end',
    },
    pointsText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.dark,
    },
    nextLevelText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[600],
        marginTop: 2,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    progressBarBackground: {
        flex: 1,
        height: 12,
        backgroundColor: COLORS.gray[200],
        borderRadius: BORDER_RADIUS.full,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.full,
        position: 'relative',
        overflow: 'hidden',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        transform: [{ skewX: '-20deg' }],
    },
    percentageText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[600],
        minWidth: 40,
        textAlign: 'right',
    },
    milestones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.sm,
    },
    milestone: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    milestoneMarker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.gray[300],
    },
    milestoneReached: {
        backgroundColor: COLORS.primary,
    },
    milestoneLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[600],
    },
});
