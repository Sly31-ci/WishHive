import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { PublicWishlistHeader } from '@/components/PublicWishlistHeader';
import { AnonymousInteraction } from '@/components/AnonymousInteraction';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';
import { MessageCircle, Heart, Download } from 'lucide-react-native';
import { WishlistTheme, DEFAULT_THEME } from '@/constants/wishlistThemes';
import * as Linking from 'expo-linking';
import { getPriorityLabel, getPriorityColor } from '@/constants/priorities';

type Wishlist = Database['public']['Tables']['wishlists']['Row'];
type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'] & {
    product?: Database['public']['Tables']['products']['Row'] | null;
};

export default function PublicWishlistScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [interactionModalVisible, setInteractionModalVisible] = useState(false);
    const [interactionType, setInteractionType] = useState<'reaction' | 'comment'>('reaction');
    const [activeItem, setActiveItem] = useState<string | null>(null); // For item-specific interactions if needed

    useEffect(() => {
        loadWishlist();
    }, [slug]);

    const loadWishlist = async () => {
        try {
            // Find wishlist by slug
            const { data: wishlistData, error: wishlistError } = await supabase
                .from('wishlists')
                .select('*')
                .eq('slug', slug)
                .single();

            if (wishlistError) throw wishlistError;
            setWishlist(wishlistData);

            // Access Check (Public or Code Only) - Logic handled by RLS mostly, but UI check:
            if (wishlistData.privacy === 'private') {
                // If private, maybe redirect or show error (unless owner, but this is public route)
                // For simplicity, we show it, but RLS might block items if not public.
            }

            const { data: itemsData, error: itemsError } = await supabase
                .from('wishlist_items')
                .select('*, product:products(*)')
                .eq('wishlist_id', wishlistData.id)
                .order('priority', { ascending: false });

            if (itemsError) throw itemsError;
            setItems(itemsData || []);

            // Increment view count
            await supabase.rpc('increment_view_count', { wishlist_id: wishlistData.id }).catch(() => { });
            // Or simpler update if RPC not exists:
            // await supabase.from('wishlists').update({ view_count: wishlistData.view_count + 1 }).eq('id', wishlistData.id);

        } catch (error) {
            console.error('Error loading public wishlist:', error);
            Alert.alert('Erreur', 'Impossible de charger la wishlist. Vérifiez le lien.');
            router.replace('/');
        } finally {
            setLoading(false);
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
        setInteractionType(type);
        setActiveItem(itemId);
        setInteractionModalVisible(true);
    };

    const renderItem = ({ item }: { item: WishlistItem }) => {
        const title = item.custom_title || item.product?.title || 'Untitled Item';
        const price = item.custom_price || item.product?.price;
        const imageUrl = item.custom_images?.[0] || item.product?.images?.[0];

        return (
            <Card style={styles.itemCard}>
                <View style={styles.itemContent}>
                    <View style={styles.itemImageContainer}>
                        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.itemImage} />}
                    </View>
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemTitle}>{title}</Text>
                        {price && <Text style={styles.itemPrice}>{item.product?.currency} {price}</Text>}

                        <View style={[
                            styles.priorityBadge,
                            { backgroundColor: getPriorityColor(item.priority) + '20' }
                        ]}>
                            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                                {getPriorityLabel(item.priority)}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => openInteraction('reaction', item.id)} style={styles.actionButton}>
                        <Heart size={20} color={COLORS.gray[500]} />
                    </TouchableOpacity>
                    {/* Only show 'Want' or 'Buy' button if needed? Maybe later. */}
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
                }
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <AnonymousInteraction
                visible={interactionModalVisible}
                onClose={() => setInteractionModalVisible(false)}
                onSubmit={handleInteractionSubmit}
                initialType={interactionType}
                wishlistThemeColor={themeColor}
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
        justifyContent: 'flex-end',
        marginTop: SPACING.sm,
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
    }
});
