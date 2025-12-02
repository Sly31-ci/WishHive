import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Share,
    Alert,
    FlatList,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import {
    ArrowLeft,
    Share2,
    MoreVertical,
    Plus,
    Gift,
    Trash2,
    Edit2,
    CheckCircle,
    Clock,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';
import * as Haptics from '@/lib/haptics';

type Wishlist = Database['public']['Tables']['wishlists']['Row'];
type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'] & {
    product?: Database['public']['Tables']['products']['Row'];
};

export default function WishlistDetailScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (id) {
            loadWishlistDetails();
        }
    }, [id]);

    const loadWishlistDetails = async () => {
        try {
            // Load wishlist info
            const { data: wishlistData, error: wishlistError } = await supabase
                .from('wishlists')
                .select('*')
                .eq('id', id)
                .single();

            if (wishlistError) throw wishlistError;
            setWishlist(wishlistData);
            setIsOwner(user?.id === wishlistData.owner_id);

            // Load items
            const { data: itemsData, error: itemsError } = await supabase
                .from('wishlist_items')
                .select('*, product:products(*)')
                .eq('wishlist_id', id)
                .order('priority', { ascending: false });

            if (itemsError) throw itemsError;
            setItems(itemsData || []);

            // Increment view count if not owner
            if (user?.id !== wishlistData.owner_id) {
                await supabase.rpc('increment_wishlist_views', { wishlist_id: id });
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
            Alert.alert('Error', 'Failed to load wishlist details');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!wishlist) return;
        try {
            await Share.share({
                message: `Check out my wishlist "${wishlist.title}" on WishHive!`,
                url: `https://wishhive.app/wishlist/${wishlist.id}`, // Deep link would go here
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        Alert.alert('Delete Item', 'Are you sure you want to remove this item?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const { error } = await supabase
                            .from('wishlist_items')
                            .delete()
                            .eq('id', itemId);
                        if (error) throw error;
                        Haptics.success();
                        loadWishlistDetails();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete item');
                    }
                },
            },
        ]);
    };

    const renderItem = ({ item }: { item: WishlistItem }) => (
        <Card style={styles.itemCard}>
            <View style={styles.itemContent}>
                <View style={styles.itemImageContainer}>
                    {item.image_url ? (
                        <Image source={{ uri: item.image_url }} style={styles.itemImage} />
                    ) : item.product?.images?.[0] ? (
                        <Image
                            source={{ uri: item.product.images[0] }}
                            style={styles.itemImage}
                        />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Gift size={24} color={COLORS.gray[400]} />
                        </View>
                    )}
                </View>

                <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                        {item.title || item.product?.title}
                    </Text>
                    {item.price && (
                        <Text style={styles.itemPrice}>
                            {item.currency} {item.price.toFixed(2)}
                        </Text>
                    )}

                    <View style={styles.itemMeta}>
                        <View style={[
                            styles.priorityBadge,
                            { backgroundColor: item.priority === 'high' ? COLORS.error + '20' : COLORS.gray[200] }
                        ]}>
                            <Text style={[
                                styles.priorityText,
                                { color: item.priority === 'high' ? COLORS.error : COLORS.gray[600] }
                            ]}>
                                {item.priority} priority
                            </Text>
                        </View>
                        {item.is_purchased && (
                            <View style={styles.purchasedBadge}>
                                <CheckCircle size={12} color={COLORS.success} />
                                <Text style={styles.purchasedText}>Purchased</Text>
                            </View>
                        )}
                    </View>
                </View>

                {isOwner && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteItem(item.id)}
                    >
                        <Trash2 size={20} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                )}
            </View>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!wishlist) {
        return (
            <View style={styles.centerContainer}>
                <Text>Wishlist not found</Text>
                <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 20 }} />
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerTransparent: true,
                    headerLeft: () => (
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => router.back()}
                        >
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                                <Share2 size={24} color={COLORS.dark} />
                            </TouchableOpacity>
                            {isOwner && (
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={() => router.push(`/wishlists/edit/${id}`)}
                                >
                                    <Edit2 size={24} color={COLORS.dark} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ),
                }}
            />

            <ScrollView style={styles.container}>
                <View style={styles.headerContent}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{wishlist.title}</Text>
                        <View style={styles.badges}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{wishlist.type}</Text>
                            </View>
                            <View style={[styles.badge, styles.privacyBadge]}>
                                <Text style={styles.badgeText}>{wishlist.privacy}</Text>
                            </View>
                        </View>
                    </View>

                    {wishlist.description && (
                        <Text style={styles.description}>{wishlist.description}</Text>
                    )}

                    {wishlist.due_date && (
                        <View style={styles.dateContainer}>
                            <Clock size={16} color={COLORS.gray[500]} />
                            <Text style={styles.dateText}>
                                Due {new Date(wishlist.due_date).toLocaleDateString()}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.itemsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Wishes ({items.length})</Text>
                        {isOwner && (
                            <Button
                                title="Add Item"
                                size="sm"
                                icon={<Plus size={16} color={COLORS.white} />}
                                onPress={() => router.push(`/wishlists/${id}/add-item`)}
                            />
                        )}
                    </View>

                    {items.length > 0 ? (
                        <View style={styles.list}>
                            {items.map(item => (
                                <View key={item.id} style={styles.listItemWrapper}>
                                    {renderItem({ item })}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Gift size={48} color={COLORS.gray[300]} />
                            <Text style={styles.emptyText}>No wishes yet</Text>
                            {isOwner && (
                                <Text style={styles.emptySubtext}>
                                    Start adding items to your wishlist!
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginLeft: SPACING.md,
    },
    headerActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginRight: SPACING.md,
    },
    headerContent: {
        padding: SPACING.lg,
        paddingTop: 100,
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: BORDER_RADIUS.xl,
        borderBottomRightRadius: BORDER_RADIUS.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    titleContainer: {
        marginBottom: SPACING.sm,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.sm,
    },
    badges: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    badge: {
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    privacyBadge: {
        backgroundColor: COLORS.gray[200],
    },
    badgeText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.dark,
        textTransform: 'capitalize',
    },
    description: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        lineHeight: 24,
        marginBottom: SPACING.md,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    dateText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[500],
    },
    itemsSection: {
        padding: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
    },
    list: {
        gap: SPACING.md,
    },
    listItemWrapper: {
        marginBottom: SPACING.md,
    },
    itemCard: {
        padding: SPACING.md,
    },
    itemContent: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    itemImageContainer: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        backgroundColor: COLORS.gray[100],
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 8,
    },
    itemMeta: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    purchasedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.success + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    purchasedText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.success,
    },
    deleteButton: {
        padding: SPACING.sm,
    },
    emptyState: {
        alignItems: 'center',
        padding: SPACING.xxl,
        gap: SPACING.md,
    },
    emptyText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.gray[400],
    },
    emptySubtext: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[400],
    },
});
