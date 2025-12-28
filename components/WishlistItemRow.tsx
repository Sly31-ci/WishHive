import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle, Circle, Trash2, Edit2, Gift, ChevronUp, ChevronDown } from 'lucide-react-native';
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
    groupGift?: {
        current_amount: number;
        target_amount: number;
    } | null;
    isReordering?: boolean;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
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
    groupGift,
    isReordering,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast
}: WishlistItemRowProps) {
    const giftProgress = groupGift ? (groupGift.current_amount / groupGift.target_amount) * 100 : 0;

    return (
        <Animated.View
            entering={FadeInRight.delay(index * 50)}
            style={[styles.container, checked && styles.checkedContainer]}
        >
            <View style={styles.mainRow}>
                {isReordering ? (
                    <View style={styles.reorderControls}>
                        <TouchableOpacity
                            onPress={onMoveUp}
                            disabled={isFirst}
                            style={[styles.reorderButton, isFirst && { opacity: 0.2 }]}
                        >
                            <ChevronUp size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onMoveDown}
                            disabled={isLast}
                            style={[styles.reorderButton, isLast && { opacity: 0.2 }]}
                        >
                            <ChevronDown size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
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

                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Gift size={20} color={COLORS.gray[400]} />
                        </View>
                    )}
                    {priorityColor && (
                        <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
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
    checkButton: {
        marginRight: SPACING.sm,
    },
    imageContainer: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.gray[100],
        overflow: 'hidden',
        position: 'relative',
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
        top: 0,
        right: 0,
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 2,
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    reorderControls: {
        flexDirection: 'column',
        marginRight: SPACING.md,
        gap: 2,
    },
    reorderButton: {
        padding: 4,
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
