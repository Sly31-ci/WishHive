import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Animated,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { X, Share2, Award } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { Database } from '@/types/database';
import * as Haptics from 'expo-haptics';

type Badge = Database['public']['Tables']['badges']['Row'];

interface BadgeUnlockedModalProps {
    visible: boolean;
    badge: Badge | null;
    onClose: () => void;
    onShare?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function BadgeUnlockedModal({
    visible,
    badge,
    onClose,
    onShare,
}: BadgeUnlockedModalProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const confettiAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible && badge) {
            // Haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Start animations
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(confettiAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0);
            rotateAnim.setValue(0);
            confettiAnim.setValue(0);
        }
    }, [visible, badge]);

    if (!badge) return null;

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const confettiOpacity = confettiAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1, 0],
    });

    const confettiTranslateY = confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100],
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Confetti Effect */}
                    {[...Array(20)].map((_, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.confetti,
                                {
                                    left: `${(i * 5) % 100}%`,
                                    opacity: confettiOpacity,
                                    transform: [
                                        { translateY: confettiTranslateY },
                                        { rotate: `${i * 18}deg` },
                                    ],
                                    backgroundColor: [
                                        COLORS.primary,
                                        COLORS.secondary,
                                        COLORS.accent,
                                        COLORS.success,
                                    ][i % 4],
                                },
                            ]}
                        />
                    ))}

                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <X size={24} color={COLORS.gray[600]} />
                    </TouchableOpacity>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.title}>🎉 Badge Débloqué !</Text>

                        {/* Badge Icon */}
                        <Animated.View
                            style={[
                                styles.badgeContainer,
                                {
                                    transform: [{ rotate }],
                                },
                            ]}
                        >
                            {badge.icon_url ? (
                                <SvgUri
                                    uri={badge.icon_url}
                                    width={120}
                                    height={120}
                                />
                            ) : (
                                <View style={styles.defaultIcon}>
                                    <Award size={60} color={COLORS.primary} />
                                </View>
                            )}
                        </Animated.View>

                        {/* Badge Info */}
                        <View style={styles.badgeInfo}>
                            <Text style={styles.badgeName}>{badge.name}</Text>
                            <Text style={styles.badgeDescription}>{badge.description}</Text>

                            {/* Tier Badge */}
                            <View style={[styles.tierBadge, getTierStyle(badge.tier)]}>
                                <Text style={styles.tierText}>{badge.tier.toUpperCase()}</Text>
                            </View>

                            {/* Points Reward */}
                            {badge.points_reward > 0 && (
                                <View style={styles.pointsContainer}>
                                    <Text style={styles.pointsLabel}>Points gagnés</Text>
                                    <Text style={styles.pointsValue}>+{badge.points_reward}</Text>
                                </View>
                            )}
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            {onShare && (
                                <TouchableOpacity
                                    style={[styles.button, styles.shareButton]}
                                    onPress={onShare}
                                >
                                    <Share2 size={20} color={COLORS.white} />
                                    <Text style={styles.shareButtonText}>Partager</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[styles.button, styles.closeButtonBottom]}
                                onPress={onClose}
                            >
                                <Text style={styles.closeButtonText}>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

function getTierStyle(tier: string) {
    switch (tier) {
        case 'bronze':
            return { backgroundColor: '#CD7F32' };
        case 'silver':
            return { backgroundColor: '#C0C0C0' };
        case 'gold':
            return { backgroundColor: '#FFD700' };
        case 'platinum':
            return { backgroundColor: '#E5E4E2' };
        default:
            return { backgroundColor: COLORS.gray[400] };
    }
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        ...SHADOWS.lg,
    },
    confetti: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        top: -20,
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        color: COLORS.dark,
        marginBottom: SPACING.xl,
        textAlign: 'center',
    },
    badgeContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: COLORS.gray[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.md,
    },
    defaultIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeInfo: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    badgeName: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    badgeDescription: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        textAlign: 'center',
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    tierBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
        marginBottom: SPACING.md,
    },
    tierText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
        color: COLORS.white,
        letterSpacing: 1,
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.success + '10',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
    },
    pointsLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.success,
        fontWeight: '600',
    },
    pointsValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '800',
        color: COLORS.success,
    },
    actions: {
        width: '100%',
        gap: SPACING.sm,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        gap: SPACING.sm,
    },
    shareButton: {
        backgroundColor: COLORS.primary,
        ...SHADOWS.sm,
    },
    shareButtonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.white,
    },
    closeButtonBottom: {
        backgroundColor: COLORS.gray[100],
    },
    closeButtonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.gray[700],
    },
});
