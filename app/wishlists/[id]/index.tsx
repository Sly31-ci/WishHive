import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
    FlatList,
} from 'react-native';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import {
    ArrowLeft,
    Share2,
    Trash2,
    Gift,
    CheckCircle,
    Clock,
    ArrowUpDown,
    Palette,
} from 'lucide-react-native';
import { WishlistThemeSelector } from '@/components/WishlistThemeSelector';
import ShareWishlistButton from '@/components/ShareWishlistButton';
import { WishlistTheme, DEFAULT_THEME } from '@/constants/wishlistThemes';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';
import * as Haptics from 'expo-haptics';
import { wishlistEvents, EVENTS } from '@/lib/events';
import { SwipeableItem } from '@/components/SwipeableItem';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ReorganizeToolbar } from '@/components/ReorganizeToolbar';
import { getPriorityLabel, getPriorityColor } from '@/constants/priorities';

type Wishlist = Database['public']['Tables']['wishlists']['Row'];
type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'] & {
    product?: Database['public']['Tables']['products']['Row'] | null;
};

export default function WishlistDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    // Reordering State (fallback : drag disabled)
    const [isReordering, setIsReordering] = useState(false);
    const [originalItems, setOriginalItems] = useState<WishlistItem[]>([]);
    const [savingOrder, setSavingOrder] = useState(false);

    // Customization State
    const [showThemeSelector, setShowThemeSelector] = useState(false);

    const currentTheme = wishlist?.theme && typeof wishlist.theme === 'object'
        ? (wishlist.theme as unknown as WishlistTheme)
        : DEFAULT_THEME;

    const handleSaveTheme = async (newTheme: WishlistTheme) => {
        try {
            const { error } = await supabase
                .from('wishlists')
                .update({ theme: newTheme })
                .eq('id', id);

            if (error) throw error;

            setWishlist(prev => prev ? { ...prev, theme: newTheme } : null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error('Error saving theme:', error);
            Alert.alert('Error', 'Failed to save theme');
        }
    };

    useEffect(() => {
        if (id) loadWishlistDetails();
    }, [id]);

    useEffect(() => {
        const handleItemAdded = (data: { wishlistId: string; item: any }) => {
            if (data.wishlistId === id) {
                loadWishlistDetails();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        };

        wishlistEvents.on(EVENTS.ITEM_ADDED, handleItemAdded);
        return () => { wishlistEvents.off(EVENTS.ITEM_ADDED, handleItemAdded); };
    }, [id]);

    const loadWishlistDetails = async () => {
        try {
            const { data: wishlistData, error: wishlistError } = await supabase
                .from('wishlists')
                .select('*')
                .eq('id', id as string)
                .single();

            if (wishlistError) throw wishlistError;
            setWishlist(wishlistData);
            setIsOwner(user?.id === wishlistData.owner_id);

            const { data: itemsData, error: itemsError } = await supabase
                .from('wishlist_items')
                .select('*, product:products(*)')
                .eq('wishlist_id', id as string)
                .order('priority', { ascending: false });

            if (itemsError) throw itemsError;
            setItems(itemsData || []);
        } catch (error) {
            console.error('Error loading wishlist:', error);
            Alert.alert('Error', 'Failed to load wishlist details');
        } finally {
            setLoading(false);
        }
    };

    // Share handled by ShareWishlistButton component

    const toggleReorder = () => {
        if (isReordering) {
            setIsReordering(false);
            setItems(originalItems);
        } else {
            setOriginalItems(items);
            setIsReordering(true);
            Haptics.selectionAsync();
        }
    };

    const handleSaveOrder = async () => {
        setSavingOrder(true);

        try {
            const updates = items.map((item, index) => ({
                id: item.id,
                priority: (items.length - index) * 10,
                wishlist_id: id as string,
            }));

            const { error } = await supabase
                .from('wishlist_items')
                .upsert(updates);

            if (error) throw error;

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsReordering(false);
            loadWishlistDetails();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', "Impossible d'enregistrer l'ordre.");
        } finally {
            setSavingOrder(false);
        }
    };

    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const handleDeleteItem = (itemId: string) => {
        setItemToDelete(itemId);
        setDeleteConfirmVisible(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const { error } = await supabase
                .from('wishlist_items')
                .delete()
                .eq('id', itemToDelete);

            if (error) throw error;

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            loadWishlistDetails();
        } catch {
            Alert.alert('Error', 'Failed to delete item');
        } finally {
            setDeleteConfirmVisible(false);
            setItemToDelete(null);
        }
    };

    const [wishlistDeleteDialogVisible, setWishlistDeleteDialogVisible] = useState(false);

    const handleDeleteWishlist = async () => {
        try {
            await supabase.from('wishlist_items').delete().eq('wishlist_id', id);
            await supabase.from('wishlists').delete().eq('id', id);

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(() => router.replace('/(tabs)/wishlists'), 300);
        } catch {
            Alert.alert('Erreur', 'Impossible de supprimer cette wishlist.');
        } finally {
            setWishlistDeleteDialogVisible(false);
        }
    };

    const renderItem = ({ item }: { item: WishlistItem }) => {
        const title = item.custom_title || item.product?.title || 'Untitled Item';
        const price = item.custom_price || item.product?.price;
        const currency = item.product?.currency || 'USD';
        const imageUrl = item.custom_images?.[0] || item.product?.images?.[0];

        return (
            <SwipeableItem
                onDelete={() => handleDeleteItem(item.id)}
                disabled={!isOwner}
            >
                <Card style={styles.itemCard}>
                    <View style={styles.itemContent}>
                        <View style={styles.itemImageContainer}>
                            {imageUrl ? (
                                <Image source={{ uri: imageUrl }} style={styles.itemImage} />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Gift size={24} color={COLORS.gray[400]} />
                                </View>
                            )}
                        </View>

                        <View style={styles.itemDetails}>
                            <Text style={styles.itemTitle} numberOfLines={2}>
                                {title}
                            </Text>

                            {price !== undefined && price !== null && (
                                <Text style={styles.itemPrice}>
                                    {currency} {price.toFixed(2)}
                                </Text>
                            )}

                            <View style={styles.itemsRow}>
                                <View style={styles.itemMeta}>
                                    <View style={[
                                        styles.priorityBadge,
                                        { backgroundColor: getPriorityColor(item.priority) + '20' }
                                    ]}>
                                        <Text style={[
                                            styles.priorityText,
                                            { color: getPriorityColor(item.priority) }
                                        ]}>
                                            {getPriorityLabel(item.priority)} priority
                                        </Text>
                                    </View>

                                    {item.is_purchased && (
                                        <View style={styles.purchasedBadge}>
                                            <CheckCircle size={12} color={COLORS.success} />
                                            <Text style={styles.purchasedText}>Purchased</Text>
                                        </View>
                                    )}
                                </View>

                                {isOwner && (
                                    <TouchableOpacity
                                        style={styles.deleteIconButton}
                                        onPress={() => handleDeleteItem(item.id)}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Trash2 size={18} color={COLORS.error} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </Card>
            </SwipeableItem>
        );
    };

    const renderHeader = () => {
        const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
            const style = [
                styles.headerContent,
                { backgroundColor: currentTheme.gradient ? 'transparent' : currentTheme.primaryColor }
            ];

            if (currentTheme.gradient) {
                return (
                    <LinearGradient
                        colors={[currentTheme.primaryColor, currentTheme.secondaryColor]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={style}
                    >
                        {children}
                    </LinearGradient>
                );
            }

            return <View style={style}>{children}</View>;
        };

        const textColor = currentTheme.template === 'minimal' ? COLORS.dark : COLORS.white;
        const subTextColor = currentTheme.template === 'minimal' ? COLORS.gray[600] : 'rgba(255,255,255,0.8)';

        return (
            <HeaderWrapper>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                        <ArrowLeft size={24} color={COLORS.dark} />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />

                    {wishlist && (
                        <ShareWishlistButton
                            wishlistId={wishlist.id}
                            wishlistTitle={wishlist.title}
                            variant="icon"
                        />
                    )}

                    {isOwner && (
                        <>
                            <TouchableOpacity
                                style={[styles.headerButton, isReordering && styles.activeButton]}
                                onPress={toggleReorder}
                            >
                                <ArrowUpDown size={24} color={isReordering ? COLORS.primary : COLORS.dark} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={() => setShowThemeSelector(true)}
                            >
                                <Palette size={24} color={COLORS.dark} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.headerButton, { backgroundColor: COLORS.error + '10' }]}
                                onPress={() => setWishlistDeleteDialogVisible(true)}
                            >
                                <Trash2 size={24} color={COLORS.error} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: textColor }]}>
                        {currentTheme.emoji} {wishlist?.title}
                    </Text>

                    <View style={styles.badges}>
                        <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Text style={[styles.badgeText, { color: textColor }]}>{wishlist?.type}</Text>
                        </View>

                        <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Text style={[styles.badgeText, { color: textColor }]}>{wishlist?.privacy}</Text>
                        </View>
                    </View>
                </View>

                {wishlist?.description && (
                    <Text style={[styles.description, { color: subTextColor }]}>{wishlist.description}</Text>
                )}

                {wishlist?.due_date && (
                    <View style={styles.dateContainer}>
                        <Clock size={14} color={subTextColor} />
                        <Text style={[styles.dateText, { color: subTextColor }]}>
                            {new Date(wishlist.due_date).toLocaleDateString()}
                        </Text>
                    </View>
                )}
            </HeaderWrapper>
        );
    };

    const renderEmpty = () => {
        if (loading) return null;

        return (
            <View style={styles.emptyState}>
                <Gift size={48} color={COLORS.gray[300]} />
                <Text style={styles.emptyText}>No wishes yet</Text>

                {isOwner && (
                    <Text style={styles.emptySubtext}>
                        Start adding items to your wishlist!
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            {isReordering && (
                <ReorganizeToolbar
                    onCancel={toggleReorder}
                    onSave={handleSaveOrder}
                    loading={savingOrder}
                    hasChanges={true}
                />
            )}

            <WishlistThemeSelector
                visible={showThemeSelector}
                onClose={() => setShowThemeSelector(false)}
                currentTheme={currentTheme}
                wishlistTitle={wishlist?.title || 'Wishlist'}
                onSave={handleSaveTheme}
            />

            <ConfirmDialog
                visible={deleteConfirmVisible}
                title="Retirer cet item ?"
                message="Cet item sera retiré de ta wishlist. Tu pourras toujours le rajouter plus tard ! 💫"
                confirmText="Oui, retirer"
                cancelText="Non, garder"
                type="warning"
                emoji="✨"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirmVisible(false)}
            />

            <ConfirmDialog
                visible={wishlistDeleteDialogVisible}
                title="Supprimer cette wishlist ?"
                message="Cette action est irréversible. Tous les items de cette wishlist seront définitivement supprimés. 😢"
                confirmText="Oui, supprimer"
                cancelText="Non, garder"
                type="danger"
                emoji="🗑️"
                onConfirm={handleDeleteWishlist}
                onCancel={() => setWishlistDeleteDialogVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    activeButton: {
        backgroundColor: COLORS.primary + '20',
        borderColor: COLORS.primary,
        borderWidth: 1,
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
        marginBottom: SPACING.md,
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
        marginBottom: SPACING.sm,
    },
    badges: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginRight: SPACING.md,
    },
    badge: {
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
    },
    badgeText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
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
    list: {
        gap: SPACING.md,
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
    itemsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    deleteIconButton: {
        padding: 4,
    },
});
