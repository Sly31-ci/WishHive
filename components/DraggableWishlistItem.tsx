import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist'; // Optional: Use default decorator
import { GripVertical, Gift } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Card } from './Card';
import { getPriorityColor, getPriorityLabel } from '@/constants/priorities';
import { Database } from '@/types/database';

type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'] & {
    product?: Database['public']['Tables']['products']['Row'] | null;
};

interface DraggableWishlistItemProps {
    item: WishlistItem;
    drag: () => void;
    isActive: boolean;
}

export function DraggableWishlistItem({ item, drag, isActive }: DraggableWishlistItemProps) {
    const title = item.custom_title || item.product?.title || 'Untitled Item';
    const imageUrl = item.custom_images?.[0] || item.product?.images?.[0];

    return (
        <ScaleDecorator>
            <TouchableOpacity
                onLongPress={drag}
                disabled={isActive}
                style={[
                    styles.container,
                    isActive && styles.activeContainer
                ]}
            >
                <Card style={[styles.card, isActive && styles.activeCard]}>
                    <View style={styles.content}>
                        {/* Drag Handle */}
                        <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
                            <GripVertical size={24} color={COLORS.gray[400]} />
                        </TouchableOpacity>

                        {/* Image */}
                        <View style={styles.imageContainer}>
                            {imageUrl ? (
                                <Image source={{ uri: imageUrl }} style={styles.image} />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Gift size={20} color={COLORS.gray[400]} />
                                </View>
                            )}
                        </View>

                        {/* Details */}
                        <View style={styles.details}>
                            <Text style={styles.title} numberOfLines={1}>
                                {title}
                            </Text>
                            <View style={styles.metaRow}>
                                <View style={[
                                    styles.priorityBadge,
                                    { backgroundColor: getPriorityColor(item.priority) + '20' }
                                ]}>
                                    <Text style={[
                                        styles.priorityText,
                                        { color: getPriorityColor(item.priority) }
                                    ]}>
                                        {getPriorityLabel(item.priority)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        </ScaleDecorator>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    activeContainer: {
        opacity: 0.9,
    },
    card: {
        padding: SPACING.sm,
    },
    activeCard: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    dragHandle: {
        padding: SPACING.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        backgroundColor: COLORS.gray[100],
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
    details: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priorityBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 9,
        fontWeight: '600',
    },
});
