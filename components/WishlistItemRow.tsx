import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle, Circle, Trash2, Edit2, Gift, GripVertical } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface WishlistItemRowProps {
    title: string;
    price?: number | null;
    currency?: string;
    imageUrl?: string | null;
    checked: boolean;
    onToggle: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
    isOwner: boolean;
    index: number;
    priorityColor?: string;
    priorityEmoji?: string;
    groupGift?: {
        current_amount: number;
        target_amount: number;
    } | null;
    isReordering?: boolean;
    drag?: () => void;
    isActive?: boolean;
}

export function WishlistItemRow({
    title,
    price,
    currency = 'USD',
    imageUrl,
    checked,
    onToggle,
    onDelete,
    onEdit,
    isOwner,
    index,
    priorityColor,
    priorityEmoji,
    groupGift,
    isReordering,
    drag,
    isActive
}: WishlistItemRowProps) {
    const giftProgress = groupGift ? (groupGift.current_amount / groupGift.target_amount) * 100 : 0;

    return (
        <Animated.View
            entering={FadeInRight.delay(index * 50)}
            style={[
                styles.container,
                checked && styles.checkedContainer,
                isActive && styles.activeContainer
            ]}
        >
            <View style={styles.mainRow}>
                {isReordering ? (
                    <TouchableOpacity
                        onLongPress={drag}
                        onPressIn={drag}
                        style={styles.dragHandle}
                        activeOpacity={0.8}
                    >
                        <GripVertical size={22} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={onToggle}
                        style={styles.checkButton}
                        activeOpacity={0.7}
                    >
                        {checked ? (
                            <CheckCircle size={24} color={COLORS.success} />
                        ) : (
                            <Circle size={24} color={COLORS.gray[300]} />
                        )}
                    </TouchableOpacity>
                )}

                <View style={styles.imageWrapper}>
                    <View style={styles.imageContainer}>
                        {imageUrl ? (
                            <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Gift size={24} color={COLORS.gray[400]} />
                            </View>
                        )}
                    </View>
                    {priorityColor && (
                        <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]}>
                            {priorityEmoji && <Text style={styles.priorityEmoji}>{priorityEmoji}</Text>}
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, checked && styles.checkedText]} numberOfLines={1}>
                            {title}
                        </Text>
                        {groupGift && (
                            <View style={styles.cagnotteBadge}>
                                <Gift size={10} color={COLORS.primary} />
                                <Text style={styles.cagnotteBadgeText}>Cagnotte</Text>
                            </View>
                        )}
                    </View>
                    {price !== undefined && price !== null && (
                        <Text style={[styles.price, checked && styles.checkedText]}>
                            {currency} {price.toFixed(2)}
                        </Text>
                    )}
                </View>

                {isOwner && (
                    <View style={styles.actions}>
                        {onEdit && (
                            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                                <Edit2 size={18} color={COLORS.gray[400]} />
                            </TouchableOpacity>
                        )}
                        {onDelete && (
                            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                                <Trash2 size={18} color={COLORS.error + '90'} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            {groupGift && (
                <View style={styles.cagnotteProgressContainer}>
                    <View style={styles.cagnotteBarBackground}>
                        <View
                            style={[
                                styles.cagnotteBarFill,
                                { width: `${Math.min(100, giftProgress)}%` }
                            ]}
                        />
                    </View>
                    <View style={styles.cagnotteInfo}>
                        <Text style={styles.cagnotteText}>
                            {currency} {groupGift.current_amount} / {groupGift.target_amount}
                        </Text>
                        <Text style={styles.cagnottePercent}>{Math.round(giftProgress)}%</Text>
                    </View>
                </View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.gray[100],
        padding: SPACING.md,
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkedContainer: {
        backgroundColor: COLORS.gray[50],
        borderColor: 'transparent',
    },
    activeContainer: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 10,
    },
    checkButton: {
        marginRight: SPACING.sm,
    },
    imageWrapper: {
        position: 'relative',
        width: 60,
        height: 60,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: COLORS.gray[100],
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    priorityIndicator: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
        zIndex: 100,
    },
    priorityEmoji: {
        fontSize: 12,
        textAlign: 'center',
        paddingTop: 0,
    },
    dragHandle: {
        paddingRight: SPACING.md,
        justifyContent: 'center',
        alignItems: 'center',
        height: 48, // Match image height for better touch area
    },
    content: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    title: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        flexShrink: 1,
    },
    cagnotteBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    cagnotteBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
    },
    price: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[500],
        marginTop: 2,
    },
    checkedText: {
        color: COLORS.gray[400],
        textDecorationLine: 'line-through',
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.xs,
    },
    actionButton: {
        padding: 8,
        borderRadius: BORDER_RADIUS.md,
    },
    cagnotteProgressContainer: {
        marginTop: SPACING.md,
        paddingLeft: 40, // Match checkbox + image spacing
    },
    cagnotteBarBackground: {
        height: 6,
        backgroundColor: COLORS.gray[100],
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 4,
    },
    cagnotteBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    cagnotteInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cagnotteText: {
        fontSize: 10,
        color: COLORS.gray[500],
    },
    cagnottePercent: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
    },
});
