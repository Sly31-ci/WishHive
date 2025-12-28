/**
 * 📝 Wishlist Detail Screen - Version Complète
 * Conserve TOUTES les fonctionnalités V1 avec le design moderne V2
 * 
 * Fonctionnalités :
 * - ✅ Customization (theme/couleurs)
 * - ✅ Partage (ShareWishlistButton)
 * - ✅ Réorganisation (drag & drop)
 * - ✅ Delete wishlist
 * - ✅ Delete items via button
 * - ✅ Group gifts (cagnotte)
 * - ✅ Priority badges
 * - ✅ Purchased status
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Alert,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Image } from 'expo-image';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import {
    ArrowLeft,
    Share2,
    Trash2,
    Gift,
    CheckCircle,
    Clock,
    Plus,
    MessageSquare,
    ChevronUp,
    ChevronDown,
    MoreVertical,
    ArrowUpDown,
    Palette,
} from 'lucide-react-native';
import { WishlistThemeSelector } from '@/components/WishlistThemeSelector';
import { InteractionsModal } from '@/components/InteractionsModal';
import { AnonymousInteraction } from '@/components/AnonymousInteraction';
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
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ReorganizeToolbar } from '@/components/ReorganizeToolbar';
import { getPriorityLabel, getPriorityColor, getPriorityEmoji } from '@/constants/priorities';
import * as Linking from 'expo-linking';
import { cache } from '@/lib/cache';

type Wishlist = Database['public']['Tables']['wishlists']['Row'];
type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'] & {
    product?: Database['public']['Tables']['products']['Row'] | null;
    group_gift?: Database['public']['Tables']['group_gifts']['Row'] | null;
};

import { PRIORITY_OPTIONS } from '@/constants/priorities';
import { StatusBadge } from '@/components/StatusBadge';
import { WishlistItemRow } from '@/components/WishlistItemRow';
import { EmptyState } from '@/components/EmptyState';
import Button from '@/components/Button';
import { Heart, MessageCircle } from 'lucide-react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

export default function WishlistDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    // Reordering State
    const [isReordering, setIsReordering] = useState(false);
    const [originalItems, setOriginalItems] = useState<WishlistItem[]>([]);
    const [savingOrder, setSavingOrder] = useState(false);
    const [interactions, setInteractions] = useState<any[]>([]);
    const [showInteractionsModal, setShowInteractionsModal] = useState(false);

    // Interaction State
    const [interactionsSummary, setInteractionsSummary] = useState<Record<string, number>>({});
    const [interactionModalVisible, setInteractionModalVisible] = useState(false);
    const [interactionType, setInteractionType] = useState<'reaction' | 'comment'>('reaction');

    // Customization State
    const [showThemeSelector, setShowThemeSelector] = useState(false);

    // Pagination State
    const [pagination, setPagination] = useState({ page: 0, hasMore: true, loadingMore: false });
    const PAGE_SIZE = 15;

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
        if (id) {
            loadCachedDetails();
            loadWishlistDetails();

            // Real-time reactions and comments
            const channel = supabase
                .channel(`wishlist_live_${id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'wishlist_interactions',
                        filter: `wishlist_id=eq.${id}`,
                    },
                    (payload) => {
                        const newInteraction = payload.new;

                        // Update interactions list
                        setInteractions(prev => [newInteraction, ...prev]);

                        // Update summary if reaction
                        if (newInteraction.interaction_type === 'reaction') {
                            setInteractionsSummary(prev => ({
                                ...prev,
                                [newInteraction.content]: (prev[newInteraction.content] || 0) + 1
                            }));
                        } else if (newInteraction.interaction_type === 'comment') {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [id]);

    const loadCachedDetails = async () => {
        if (!id) return;
        const cachedWishlist = await cache.get<Wishlist>(`wishlist_${id}`);
        const cachedItems = await cache.get<WishlistItem[]>(`wishlist_items_${id}`);

        if (cachedWishlist) {
            setWishlist(cachedWishlist);
            setIsOwner(user?.id === cachedWishlist.owner_id);
        }
        if (cachedItems && cachedItems.length > 0) {
            // Deduplicate cache data
            const unique = Array.from(new Map(cachedItems.map(item => [item.id, item])).values());
            setItems(unique);
            setLoading(false);
        }
    };

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

    const loadWishlistDetails = async (isFirstLoad = true) => {
        if (isFirstLoad && !savingOrder) {
            setLoading(true);
            setPagination({ page: 0, hasMore: true, loadingMore: false });
        } else if (!isFirstLoad) {
            setPagination(prev => ({ ...prev, loadingMore: true }));
        }

        try {
            if (isFirstLoad) {
                const { data: wishlistData, error: wishlistError } = await supabase
                    .from('wishlists')
                    .select('*, owner_profile:profiles(username)')
                    .eq('id', id as string)
                    .single();

                if (wishlistError) throw wishlistError;
                setWishlist(wishlistData);
                setIsOwner(user?.id === wishlistData.owner_id);

                // Fetch interactions summary etc
                const { data: interData } = await supabase
                    .from('wishlist_interactions')
                    .select('*')
                    .eq('wishlist_id', id as string)
                    .order('created_at', { ascending: false });

                if (interData) {
                    setInteractions(interData);
                    // Generate summary for header
                    const summary = interData
                        .filter(i => i.interaction_type === 'reaction')
                        .reduce((acc: any, curr) => {
                            acc[curr.content] = (acc[curr.content] || 0) + 1;
                            return acc;
                        }, {});
                    setInteractionsSummary(summary);
                }
            }

            const start = isFirstLoad ? 0 : pagination.page * PAGE_SIZE;
            const end = start + PAGE_SIZE - 1;

            const { data: itemsData, error: itemsError } = await supabase
                .from('wishlist_items')
                .select('*, product:products(*)')
                .eq('wishlist_id', id as string)
                .order('priority', { ascending: false })
                .range(start, end);

            if (itemsError) throw itemsError;

            let newItems: WishlistItem[] = [];

            if (itemsData && itemsData.length > 0) {
                const itemIds = itemsData.map(i => i.id);
                const { data: giftsData } = await supabase
                    .from('group_gifts')
                    .select('*')
                    .in('item_id', itemIds);

                const giftsMap = new Map();
                if (giftsData) {
                    giftsData.forEach(gift => {
                        if (!giftsMap.has(gift.item_id)) {
                            giftsMap.set(gift.item_id, gift);
                        }
                    });
                }

                newItems = itemsData.map(item => ({
                    ...item,
                    group_gift: giftsMap.get(item.id) || null
                }));
            }

            if (isFirstLoad) {
                setItems(newItems);
                setPagination({
                    page: 1,
                    hasMore: newItems.length === PAGE_SIZE,
                    loadingMore: false
                });

                // Update cache with fresh data
                cache.set(`wishlist_items_${id}`, newItems);
            } else {
                setItems(prev => {
                    const existingIds = new Set(prev.map(item => item.id));
                    const uniqueNew = newItems.filter(item => !existingIds.has(item.id));
                    const updated = [...prev, ...uniqueNew];

                    // Update cache with merged data
                    cache.set(`wishlist_items_${id}`, updated);

                    return updated;
                });

                setPagination(prev => ({
                    page: prev.page + 1,
                    hasMore: newItems.length === PAGE_SIZE,
                    loadingMore: false
                }));
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
            Alert.alert('Error', 'Failed to load wishlist details');
        } finally {
            setLoading(false);
            setPagination(prev => ({ ...prev, loadingMore: false }));

            if (wishlist) {
                cache.set(`wishlist_${id}`, wishlist);
            }
        }
    };

    const handleLoadMore = () => {
        if (pagination.hasMore && !pagination.loadingMore && !loading && !isReordering) {
            loadWishlistDetails(false);
        }
    };

    const toggleReorder = () => {
        if (isReordering) {
            setIsReordering(false);
            setItems(originalItems);
        } else {
            setOriginalItems([...items]);
            setIsReordering(true);
            Haptics.selectionAsync();
        }
    };

    const handleMoveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < items.length) {
            const [movedItem] = newItems.splice(index, 1);
            newItems.splice(targetIndex, 0, movedItem);
            setItems(newItems);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const changePriority = (item: WishlistItem) => {
        if (!isOwner || isReordering) return;

        Alert.alert(
            'Changer la priorité',
            'Sélectionnez le niveau de priorité pour ce souhait :',
            PRIORITY_OPTIONS.map(opt => ({
                text: opt.label,
                onPress: () => handleUpdatePriority(item.id, opt.value)
            })).concat([{ text: 'Annuler', style: 'cancel' } as any])
        );
    };

    const handleUpdatePriority = async (itemId: string, newPriority: number) => {
        try {
            const { error } = await supabase
                .from('wishlist_items')
                .update({ priority: newPriority })
                .eq('id', itemId);

            if (error) throw error;

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            loadWishlistDetails(); // Re-fetch to get correctly sorted list
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Impossible de modifier la priorité.');
        }
    };

    const handleTogglePurchase = async (item: WishlistItem) => {
        try {
            const newStatus = !item.is_purchased;
            const { error } = await supabase
                .from('wishlist_items')
                .update({
                    is_purchased: newStatus,
                    purchased_at: newStatus ? new Date().toISOString() : null
                })
                .eq('id', item.id);

            if (error) throw error;

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            // Optimistic update
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_purchased: newStatus } : i));

        } catch (error) {
            console.error('Error toggling purchase:', error);
            Alert.alert('Erreur', 'Impossible de modifier le statut.');
        }
    };

    const handleSaveOrder = async () => {
        setSavingOrder(true);

        try {
            const updates = items.map((item, index) => ({
                id: item.id,
                priority: Math.min(5, Math.max(1, Math.floor(((items.length - 1 - index) / Math.max(1, items.length - 1)) * 4) + 1)),
                wishlist_id: id as string,
            }));

            const { error } = await supabase
                .from('wishlist_items')
                .upsert(updates);

            if (error) throw error;

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsReordering(false);
            loadWishlistDetails(true);
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

    const handleOpenItemUrl = async (item: any) => {
        const url = item.custom_url || item.product?.external_url;
        if (url) {
            try {
                const canOpen = await Linking.canOpenURL(url);
                if (canOpen) {
                    await Linking.openURL(url);
                } else {
                    if (item.product_id) {
                        router.push(`/product/${item.product_id}`);
                    } else {
                        Alert.alert("Lien non supporté", "Cet article n'a pas de lien d'achat valide.");
                    }
                }
            } catch (error) {
                console.error('Error opening URL:', error);
                if (item.product_id) {
                    router.push(`/product/${item.product_id}`);
                }
            }
        } else if (item.product_id) {
            router.push(`/product/${item.product_id}`);
        } else {
            Alert.alert("Info", "Cet article n'a pas de lien d'achat renseigné.");
        }
    };

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


    const renderItem = ({ item, index }: { item: WishlistItem; index: number }) => {
        return (
            <View style={[
                { paddingHorizontal: SPACING.lg },
            ]}>
                <WishlistItemRow
                    title={item.custom_title || item.product?.title || 'Untitled Item'}
                    price={item.custom_price || item.product?.price}
                    currency={item.product?.currency}
                    imageUrl={item.custom_images?.[0] || item.product?.images?.[0]}
                    checked={item.is_purchased}
                    onToggle={() => handleTogglePurchase(item)}
                    onDelete={() => handleDeleteItem(item.id)}
                    isOwner={isOwner}
                    index={index}
                    priorityColor={getPriorityColor(item.priority)}
                    priorityEmoji={getPriorityEmoji(item.priority)}
                    onEdit={() => router.push(`/wishlists/${id}/edit-item/${item.id}` as any)}
                    groupGift={item.group_gift}
                    isReordering={isReordering}
                    isActive={false}
                    onPress={() => handleOpenItemUrl(item)}
                />
            </View>
        );
    };

    const handleInteractionSubmit = async (data: { type: 'reaction' | 'comment'; content: string; authorName: string }) => {
        if (!id) return;

        try {
            const { error } = await supabase
                .from('wishlist_interactions')
                .insert({
                    wishlist_id: id as string,
                    interaction_type: data.type,
                    content: data.content,
                    author_name: data.authorName,
                });

            if (error) throw error;
            Alert.alert('Merci !', 'Votre interaction a été envoyée.');
            loadWishlistDetails(false); // Refresh stats

        } catch (error) {
            console.error('Error sending interaction:', error);
            Alert.alert('Erreur', 'Impossible d\'envoyer votre réaction.');
        }
    };

    const openGuestInteraction = (type: 'reaction' | 'comment') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setInteractionType(type);
        setInteractionModalVisible(true);
    };

    const renderHeader = () => {
        if (!wishlist) return null;

        const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
            const style = [
                styles.headerContent,
                { backgroundColor: currentTheme.gradient ? 'transparent' : currentTheme.primaryColor },
                isReordering && { borderBottomWidth: 4, borderBottomColor: COLORS.primary }
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

        const completedItems = items.filter(item => item.is_purchased).length;
        const totalItems = items.length;
        const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

        return (
            <HeaderWrapper>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                        <ArrowLeft size={24} color={textColor} />
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />

                    <View style={styles.actionGroup}>
                        {wishlist && (
                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={() => router.push(`/wishlists/${id}/chat` as any)}
                            >
                                <MessageSquare size={22} color={textColor} />
                            </TouchableOpacity>
                        )}
                        {wishlist && (
                            <ShareWishlistButton
                                wishlistId={wishlist.id}
                                wishlistTitle={wishlist.title}
                                variant="icon"
                            />
                        )}

                        {isOwner && (
                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    Alert.alert(
                                        'Actions',
                                        'Choisissez une action',
                                        [
                                            {
                                                text: isReordering ? '✓ Terminer la réorganisation' : '↕️ Réorganiser',
                                                onPress: toggleReorder
                                            },
                                            {
                                                text: '🎨 Personnaliser le thème',
                                                onPress: () => setShowThemeSelector(true)
                                            },
                                            {
                                                text: `📬 Interactions${interactions.length > 0 ? ` (${interactions.length})` : ''}`,
                                                onPress: () => setShowInteractionsModal(true)
                                            },
                                            {
                                                text: '🗑️ Supprimer la wishlist',
                                                onPress: () => setWishlistDeleteDialogVisible(true),
                                                style: 'destructive'
                                            },
                                            {
                                                text: 'Annuler',
                                                style: 'cancel'
                                            }
                                        ]
                                    );
                                }}
                            >
                                <MoreVertical size={22} color={textColor} />
                                {(interactions.length > 0 || isReordering) && (
                                    <View style={styles.unreadBadge} />
                                )}
                            </TouchableOpacity>
                        )}

                        {!isOwner && (
                            <>
                                <TouchableOpacity
                                    style={styles.headerButton}
                                    onPress={() => openGuestInteraction('comment')}
                                >
                                    <MessageCircle size={22} color={textColor} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.headerButton, { backgroundColor: COLORS.error + '20' }]}
                                    onPress={() => openGuestInteraction('reaction')}
                                >
                                    <Heart size={22} color={COLORS.error} fill={COLORS.error} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                <View style={styles.cleanHeaderContent}>
                    <View style={styles.emojiContainer}>
                        <Text style={styles.bigEmoji}>{currentTheme.emoji}</Text>
                    </View>
                    <View style={styles.titleInfo}>
                        <Text style={[styles.cleanTitle, { color: textColor }]}>
                            {wishlist?.title}
                        </Text>
                        <View style={styles.creatorRow}>
                            <Text style={[styles.creatorLabel, { color: subTextColor }]}>Par </Text>
                            <Text style={[styles.creatorName, { color: textColor }]}>
                                {(wishlist as any).owner_profile?.username || 'Utilisateur'}
                            </Text>
                        </View>
                        {wishlist?.description && (
                            <Text style={[styles.cleanDescription, { color: subTextColor, marginTop: 4 }]} numberOfLines={2}>
                                {wishlist.description}
                            </Text>
                        )}

                        {Object.keys(interactionsSummary).length > 0 && (
                            <View style={styles.headerReactions}>
                                {Object.entries(interactionsSummary).map(([emoji, count]) => (
                                    <View key={emoji} style={styles.headerReactionBadge}>
                                        <Text style={styles.headerReactionEmoji}>{emoji}</Text>
                                        <Text style={styles.headerReactionCount}>{count}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Progress Card Section */}
                <View style={[styles.progressCard, { backgroundColor: currentTheme.template === 'minimal' ? COLORS.gray[50] : 'rgba(255,255,255,0.15)' }]}>
                    <View style={styles.progressHeader}>
                        <Text style={[styles.progressLabel, { color: subTextColor }]}>Progress</Text>
                        <StatusBadge
                            label={`${completedItems}/${totalItems} items`}
                            variant={progress === 100 ? "success" : "purple"}
                        />
                    </View>
                    <View style={[styles.cleanProgressBarContainer, { backgroundColor: currentTheme.template === 'minimal' ? COLORS.white : 'rgba(255,255,255,0.2)' }]}>
                        <View
                            style={[
                                styles.cleanProgressBarFill,
                                {
                                    width: `${progress}%`,
                                    backgroundColor: currentTheme.template === 'minimal' ? currentTheme.primaryColor : COLORS.white,
                                }
                            ]}
                        />
                    </View>
                </View>
            </HeaderWrapper>
        );
    };

    const ListHeader = () => (
        <View style={styles.listHeader}>
            {renderHeader()}
        </View>
    );

    const renderEmpty = () => {
        if (loading) return null;

        return (
            <EmptyState
                emoji="🎁"
                title="No items yet"
                description="Start adding items to your wishlist to share it with friends!"
                actionLabel={isOwner ? "Add Item" : undefined}
                onAction={isOwner ? () => router.push(`/wishlists/${id}/add-item`) : undefined}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={{ paddingBottom: 100 }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() =>
                    pagination.loadingMore ? (
                        <ActivityIndicator style={{ marginVertical: 20 }} color={COLORS.primary} />
                    ) : null
                }
            />

            {isOwner && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push(`/wishlists/${id}/add-item`)}
                >
                    <Plus size={28} color="#FFFFFF" />
                </TouchableOpacity>
            )}

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

            <InteractionsModal
                visible={showInteractionsModal}
                onClose={() => setShowInteractionsModal(false)}
                interactions={interactions}
                wishlistThemeColor={currentTheme.primaryColor}
            />

            <AnonymousInteraction
                visible={interactionModalVisible}
                onClose={() => setInteractionModalVisible(false)}
                onSubmit={handleInteractionSubmit}
                initialType={interactionType}
                wishlistThemeColor={currentTheme.primaryColor}
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
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionGroup: {
        flexDirection: 'row',
        gap: SPACING.sm,
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: 60,
        paddingBottom: SPACING.md,
    },
    headerContent: {
        paddingBottom: SPACING.xl,
    },
    cleanHeaderContent: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.xl,
        alignItems: 'center',
        gap: SPACING.lg,
    },
    emojiContainer: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.xxl,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigEmoji: {
        fontSize: 48,
    },
    titleInfo: {
        flex: 1,
    },
    cleanTitle: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '800',
        marginBottom: 4,
    },
    cleanDescription: {
        fontSize: FONT_SIZES.md,
        opacity: 0.9,
    },
    progressCard: {
        marginHorizontal: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xxl,
        marginBottom: SPACING.xl,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    progressValue: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
    },
    cleanProgressBarContainer: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    cleanProgressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    listHeader: {
        backgroundColor: 'transparent',
    },
    itemsToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.light,
        borderTopLeftRadius: BORDER_RADIUS.xxl,
        borderTopRightRadius: BORDER_RADIUS.xxl,
        marginTop: -BORDER_RADIUS.xxl,
    },
    itemsTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
    },
    activeButton: {
        backgroundColor: COLORS.primary + '20',
        borderColor: COLORS.primary,
        borderWidth: 1,
    },
    fab: {
        position: 'absolute',
        bottom: SPACING.xl,
        right: SPACING.lg,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    creatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    creatorLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
    },
    creatorName: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
    },
    headerReactions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 10,
    },
    headerReactionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    headerReactionEmoji: {
        fontSize: 14,
    },
    headerReactionCount: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.white,
    },
    unreadBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
        borderWidth: 1,
        borderColor: COLORS.white,
    },
});
