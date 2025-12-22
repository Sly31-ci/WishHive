import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import Head from 'expo-router/head';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { PublicWishlistHeader } from '@/components/PublicWishlistHeader';
import { AnonymousInteraction } from '@/components/AnonymousInteraction';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';
import { MessageCircle, Heart, Download } from 'lucide-react-native';
import { WishlistTheme, DEFAULT_THEME } from '@/constants/wishlistThemes';
import * as Linking from 'expo-linking';
import * as Haptics from 'expo-haptics';
import { getPriorityLabel, getPriorityColor } from '@/constants/priorities';
import { SkeletonLoader } from '@/components/SkeletonLoader';

type Wishlist = Database['public']['Tables']['wishlists']['Row'];
import { CagnotteModal } from '@/components/CagnotteModal';

type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'] & {
    product?: Database['public']['Tables']['products']['Row'] | null;
    group_gift?: Database['public']['Tables']['group_gifts']['Row'] | null;
};

export default function PublicWishlistScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [participatingItem, setParticipatingItem] = useState<WishlistItem | null>(null);
    const [showCagnotteModal, setShowCagnotteModal] = useState(false);
    const [interactionModalVisible, setInteractionModalVisible] = useState(false);
    const [interactionType, setInteractionType] = useState<'reaction' | 'comment'>('reaction');
    const [activeItem, setActiveItem] = useState<string | null>(null);

    // Pagination State
    const [pagination, setPagination] = useState({ page: 0, hasMore: true, loadingMore: false });
    const PAGE_SIZE = 15;

    useEffect(() => {
        loadWishlist();
    }, [slug]);

    const loadWishlist = async (isFirstLoad = true) => {
        if (isFirstLoad) {
            setLoading(true);
            setPagination({ page: 0, hasMore: true, loadingMore: false });
        } else {
            setPagination(prev => ({ ...prev, loadingMore: true }));
        }

        try {
            // Only load wishlist info on first load
            if (isFirstLoad) {
                const { data: wishlistData, error: wishlistError } = await supabase
                    .from('wishlists')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (wishlistError) throw wishlistError;
                setWishlist(wishlistData);

                // Increment view count
                await (supabase.rpc as any)('increment_view_count', { wishlist_id: wishlistData.id });
            }

            const activeWishlistId = wishlist?.id || (await supabase.from('wishlists').select('id').eq('slug', slug).single()).data?.id;
            if (!activeWishlistId) throw new Error('Wishlist not found');

            const start = isFirstLoad ? 0 : pagination.page * PAGE_SIZE;
            const end = start + PAGE_SIZE - 1;

            const { data: itemsData, error: itemsError } = await supabase
                .from('wishlist_items')
                .select('*, product:products(*), group_gift:group_gifts(*)')
                .eq('wishlist_id', activeWishlistId)
                .order('priority', { ascending: false })
                .range(start, end);

            if (itemsError) throw itemsError;

            const newItems = (itemsData || []).map(item => ({
                ...item,
                group_gift: Array.isArray(item.group_gift) ? item.group_gift[0] : item.group_gift
            }));

            if (isFirstLoad) {
                setItems(newItems);
                setPagination({ page: 1, hasMore: newItems.length === PAGE_SIZE, loadingMore: false });
            } else {
                setItems(prev => [...prev, ...newItems]);
                setPagination(prev => ({
                    page: prev.page + 1,
                    hasMore: newItems.length === PAGE_SIZE,
                    loadingMore: false
                }));
            }
        } catch (error) {
            console.error('Error loading public wishlist:', error);
            Alert.alert('Erreur', 'Impossible de charger la wishlist. Vérifiez le lien.');
            router.replace('/');
        } finally {
            setLoading(false);
            setPagination(prev => ({ ...prev, loadingMore: false }));
        }
    };

    const handleLoadMore = () => {
        if (pagination.hasMore && !pagination.loadingMore && !loading) {
            loadWishlist(false);
        }
    };

    const handleShare = async () => {
        // Share logic
    };

    const handleInteractionSubmit = async (data: { type: 'reaction' | 'comment'; content: string; authorName: string }) => {
        if (!wishlist) return;

        try {
            const { error } = await supabase
                .from('wishlist_interactions')
                .insert({
                    wishlist_id: wishlist.id,
                    interaction_type: data.type,
                    content: data.content,
                    author_name: data.authorName,
                    item_id: activeItem,
                });

            if (error) throw error;
            Alert.alert('Merci !', 'Votre interaction a été envoyée.');

        } catch (error) {
            console.error('Error sending interaction:', error);
            Alert.alert('Erreur', 'Impossible d\'envoyer votre réaction.');
        }
    };

    const openInteraction = (type: 'reaction' | 'comment', itemId: string | null = null) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setInteractionType(type);
        setActiveItem(itemId);
        setInteractionModalVisible(true);
    };

    const handleMarkAsPurchased = async (item: WishlistItem) => {
        // ... (existing alert logic)
    };

    const handleContribute = async (amount: number, message: string) => {
        if (!participatingItem?.group_gift) return;

        try {
            const { error: contribError } = await supabase
                .from('gift_contributions')
                .insert({
                    group_gift_id: participatingItem.group_gift.id,
                    amount,
                    message,
                    user_id: null, // Public users are anonymous by default
                    contributor_name: 'Anonyme',
                });

            if (contribError) throw contribError;

            const newAmount = participatingItem.group_gift.current_amount + amount;
            const isCompleted = newAmount >= participatingItem.group_gift.target_amount;

            const { error: updateError } = await supabase
                .from('group_gifts')
                .update({
                    current_amount: newAmount,
                    status: isCompleted ? 'completed' : 'active'
                })
                .eq('id', participatingItem.group_gift.id);

            if (updateError) throw updateError;

            setItems(prev => prev.map(item => {
                if (item.id === participatingItem.id && item.group_gift) {
                    return {
                        ...item,
                        group_gift: { ...item.group_gift, current_amount: newAmount, status: isCompleted ? 'completed' : 'active' }
                    } as WishlistItem;
                }
                return item;
            }));

            Alert.alert('Merci !', 'Votre participation a bien été enregistrée. 🎁');

        } catch (error) {
            console.error('Contribution failed:', error);
            throw error;
        }
    };

    const renderItem = ({ item }: { item: WishlistItem }) => {
        const title = item.custom_title || item.product?.title || 'Untitled Item';
        const price = item.custom_price || item.product?.price;
        const imageUrl = item.custom_images?.[0] || item.product?.images?.[0];

        return (
            <Card
                style={styles.itemCard}
                accessibilityLabel={`Article: ${title}`}
            >
                <View style={styles.itemContent}>
                    <View style={styles.itemImageContainer}>
                        {imageUrl && (
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.itemImage}
                                contentFit="cover"
                                transition={300}
                                cachePolicy="memory-disk"
                                accessibilityLabel={`Photo de ${title}`}
                            />
                        )}
                    </View>
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemTitle}>{title}</Text>
                        {price && <Text style={styles.itemPrice}>{item.product?.currency || wishlist?.theme?.currency || '€'} {price}</Text>}

                        <View style={[
                            styles.priorityBadge,
                            { backgroundColor: getPriorityColor(item.priority) + '20' }
                        ]}>
                            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                                {getPriorityLabel(item.priority)}
                            </Text>
                        </View>

                        {item.group_gift && (
                            <View style={styles.cagnottePreview}>
                                <View style={styles.cagnotteProgressBg}>
                                    <View
                                        style={[
                                            styles.cagnotteProgressFill,
                                            { width: `${Math.min(100, (item.group_gift.current_amount / item.group_gift.target_amount) * 100)}%` }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.cagnotteText}>
                                    {Math.round((item.group_gift.current_amount / item.group_gift.target_amount) * 100)}% financé
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => openInteraction('reaction', item.id)} style={styles.actionButton}>
                        <Heart size={20} color={COLORS.gray[500]} />
                    </TouchableOpacity>

                    {item.is_purchased && !item.group_gift ? (
                        <View style={styles.purchasedBadge}>
                            <Text style={styles.purchasedText}>Déjà Offert ! 🎁</Text>
                        </View>
                    ) : item.group_gift ? (
                        <TouchableOpacity
                            onPress={() => {
                                setParticipatingItem(item);
                                setShowCagnotteModal(true);
                            }}
                            style={[styles.buyButton, { backgroundColor: themeColor, opacity: item.group_gift.status === 'completed' ? 0.6 : 1 }]}
                            disabled={item.group_gift.status === 'completed'}
                        >
                            <Text style={styles.buyButtonText}>
                                {item.group_gift.status === 'completed' ? 'Cagnotte terminée' : 'Participer 🪙'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => handleMarkAsPurchased(item)}
                            style={[styles.buyButton, { backgroundColor: themeColor }]}
                        >
                            <Text style={styles.buyButtonText}>C'est pour moi !</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Card>
        );
    };

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    if (!wishlist) return null;

    const theme = wishlist.theme as unknown as WishlistTheme;
    const themeColor = theme?.primaryColor || COLORS.primary;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {wishlist && (
                <Head>
                    <title>{`${wishlist.title} | WishHive`}</title>
                    <meta name="description" content={wishlist.description || `Découvrez la liste de souhaits "${wishlist.title}" sur WishHive.`} />
                    <meta property="og:title" content={wishlist.title} />
                    <meta property="og:description" content={wishlist.description || `Découvrez la liste de souhaits "${wishlist.title}" sur WishHive.`} />
                    {items[0]?.custom_images?.[0] || items[0]?.product?.images?.[0] ? (
                        <meta property="og:image" content={items[0]?.custom_images?.[0] || items[0]?.product?.images?.[0]} />
                    ) : null}
                    <meta property="og:type" content="website" />
                    <meta name="twitter:card" content="summary_large_image" />
                </Head>
            )}

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={
                    <PublicWishlistHeader
                        title={wishlist.title}
                        description={wishlist.description}
                        theme={wishlist.theme}
                        onShare={handleShare}
                        dueDate={wishlist.due_date}
                    />
                }
                ListFooterComponent={
                    <View>
                        <View style={styles.footer}>
                            <TouchableOpacity style={[styles.ctaButton, { backgroundColor: themeColor }]}>
                                <Download size={20} color={COLORS.white} />
                                <Text style={styles.ctaText}>Télécharger WishHive</Text>
                            </TouchableOpacity>
                            <View style={styles.fabContainer}>
                                <TouchableOpacity
                                    style={[styles.fab, { backgroundColor: COLORS.white }]}
                                    onPress={() => openInteraction('comment')}
                                >
                                    <MessageCircle size={24} color={themeColor} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.fab, { backgroundColor: themeColor }]}
                                    onPress={() => openInteraction('reaction')}
                                >
                                    <Heart size={24} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {pagination.loadingMore && (
                            <ActivityIndicator style={{ marginVertical: 20 }} color={COLORS.primary} />
                        )}
                    </View>
                }
            />

            <AnonymousInteraction
                visible={interactionModalVisible}
                onClose={() => setInteractionModalVisible(false)}
                onSubmit={handleInteractionSubmit}
                initialType={interactionType}
                wishlistThemeColor={themeColor}
            />

            <CagnotteModal
                visible={showCagnotteModal}
                onClose={() => setShowCagnotteModal(false)}
                onSubmit={handleContribute}
                itemTitle={participatingItem?.product?.title || participatingItem?.custom_title || ''}
                targetAmount={participatingItem?.group_gift?.target_amount || 0}
                currentAmount={participatingItem?.group_gift?.current_amount || 0}
                currency={wishlist?.theme?.currency || '€'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemCard: {
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
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
        backgroundColor: COLORS.gray[100],
        overflow: 'hidden',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemPrice: {
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 4,
    },
    priorityBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    itemActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    buyButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.md,
    },
    buyButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '700',
    },
    purchasedBadge: {
        backgroundColor: COLORS.success + '20',
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.success,
    },
    purchasedText: {
        color: COLORS.success,
        fontSize: 12,
        fontWeight: '700',
    },
    actionButton: {
        padding: 8,
    },
    footer: {
        padding: SPACING.lg,
        alignItems: 'center',
        gap: SPACING.md,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.full,
    },
    ctaText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    fabContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.lg,
    },
    fab: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cagnottePreview: {
        marginTop: 8,
    },
    cagnotteProgressBg: {
        height: 6,
        backgroundColor: COLORS.gray[200],
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 4,
    },
    cagnotteProgressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    cagnotteText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.primary,
    },
});
