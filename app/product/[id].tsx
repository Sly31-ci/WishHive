/**
 * 📦 Product Detail Screen V2 - Refonte UX/UI
 * - 1 CTA unique massif
 * - Modal simplifié
 * - Image fullscreen immersive
 * - Info seller inline
 * - Animations fluides
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Alert,
    Modal,
    FlatList,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ArrowLeft, Share2, Heart, Store, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import {
    COLORS,
    SPACING,
    FONT_SIZES,
    BORDER_RADIUS,
    SHADOWS,
} from '@/constants/theme';
import { Database } from '@/types/database';
import { useWishlists } from '@/hooks/useWishlists';

type Product = Database['public']['Tables']['products']['Row'];
type Seller = Database['public']['Tables']['sellers']['Row'];

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const productId = Array.isArray(id) ? id[0] : id;
    const { user } = useAuth();
    const { wishlists } = useWishlists();
    const [product, setProduct] = useState<Product | null>(null);
    const [seller, setSeller] = useState<Seller | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showWishlistModal, setShowWishlistModal] = useState(false);
    const [addingToWishlist, setAddingToWishlist] = useState(false);

    useEffect(() => {
        if (productId) {
            loadProductDetails();
        }
    }, [productId]);

    const loadProductDetails = async () => {
        try {
            const productId = Array.isArray(id) ? id[0] : id;
            if (!productId) return;

            const { data, error: productError } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (productError) throw productError;

            const productData = data as Product;
            setProduct(productData);

            if (productData.seller_id) {
                const { data: sellerData, error: sellerError } = await supabase
                    .from('sellers')
                    .select('*')
                    .eq('id', productData.seller_id)
                    .single();

                if (!sellerError && sellerData) {
                    setSeller(sellerData);
                }
            }
        } catch (error) {
            console.error('Error loading product:', error);
            Alert.alert('Error', 'Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToWishlist = async (wishlistId: string) => {
        if (!product) return;

        try {
            setAddingToWishlist(true);
            const { error } = await supabase.from('wishlist_items').insert({
                wishlist_id: wishlistId,
                product_id: product.id,
                priority: 3, // 'Souhaité' par défaut
            });

            if (error) throw error;

            setShowWishlistModal(false);
            Alert.alert('Success ✨', 'Added to your wishlist!');
        } catch (error) {
            Alert.alert('Error', 'Failed to add to wishlist');
        } finally {
            setAddingToWishlist(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Product not found</Text>
                <Button
                    title="Go Back"
                    onPress={() => router.back()}
                    variant="ghost"
                    style={{ marginTop: SPACING.lg }}
                />
            </View>
        );
    }

    const images = product.images as string[] || [];

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
                        <TouchableOpacity style={styles.headerButton}>
                            <Share2 size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Image Gallery - Fullscreen */}
                    <View style={styles.galleryContainer}>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={(e) => {
                                const offset = e.nativeEvent.contentOffset.x;
                                setActiveImageIndex(Math.round(offset / width));
                            }}
                            scrollEventThrottle={16}
                        >
                            {images.length > 0 ? (
                                images.map((img, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: img }}
                                        style={styles.image}
                                    />
                                ))
                            ) : (
                                <View style={[styles.image, styles.placeholderImage]}>
                                    <Store size={64} color={COLORS.gray[300]} />
                                </View>
                            )}
                        </ScrollView>

                        {/* Pagination Dots */}
                        {images.length > 1 && (
                            <View style={styles.pagination}>
                                {images.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.paginationDot,
                                            index === activeImageIndex && styles.paginationDotActive,
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Content */}
                    <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.content}>
                        {/* Title & Price */}
                        <View style={styles.headerSection}>
                            <Text style={styles.title}>{product.title}</Text>
                            <Text style={styles.price}>
                                {product.currency} {product.price.toFixed(2)}
                            </Text>
                        </View>

                        {/* Seller Info - Inline */}
                        {seller && (
                            <Animated.View entering={FadeIn.delay(200)}>
                                <TouchableOpacity
                                    style={styles.sellerCard}
                                    onPress={() => router.push(`/seller/${seller.id}`)}
                                >
                                    <View style={styles.sellerIcon}>
                                        <Store size={18} color={COLORS.primary} />
                                    </View>
                                    <View style={styles.sellerInfo}>
                                        <Text style={styles.sellerLabel}>Sold by</Text>
                                        <Text style={styles.sellerName}>{seller.shop_name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        {/* Description */}
                        <Animated.View entering={FadeIn.delay(250)} style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>{product.description}</Text>
                        </Animated.View>
                    </Animated.View>
                </ScrollView>

                {/* CTA UNIQUE - Fixé en bas */}
                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.footer}>
                    <Button
                        title="Add to Wishlist"
                        onPress={() => setShowWishlistModal(true)}
                        size="lg"
                        fullWidth
                        icon={<Heart size={24} color="#FFFFFF" />}
                        iconPosition="left"
                    />
                </Animated.View>

                {/* Modal de sélection wishlist - Simplifié */}
                <Modal
                    visible={showWishlistModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowWishlistModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <Animated.View entering={FadeInDown.springify()} style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Add to Wishlist</Text>
                                <TouchableOpacity onPress={() => setShowWishlistModal(false)}>
                                    <X size={24} color={COLORS.dark} />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={wishlists}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => (
                                    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
                                        <TouchableOpacity
                                            style={styles.wishlistItem}
                                            onPress={() => handleAddToWishlist(item.id)}
                                            disabled={addingToWishlist}
                                        >
                                            <View>
                                                <Text style={styles.wishlistName}>{item.title}</Text>
                                                <Text style={styles.wishlistType}>{item.type}</Text>
                                            </View>
                                            <Heart size={20} color={COLORS.primary} />
                                        </TouchableOpacity>
                                    </Animated.View>
                                )}
                                ListEmptyComponent={
                                    <View style={styles.emptyWishlist}>
                                        <Text style={styles.emptyText}>
                                            No wishlists found.{'\n'}Create one first!
                                        </Text>
                                        <Button
                                            title="Create Wishlist"
                                            onPress={() => {
                                                setShowWishlistModal(false);
                                                router.push('/wishlists/create');
                                            }}
                                            size="sm"
                                            style={{ marginTop: SPACING.md }}
                                        />
                                    </View>
                                }
                            />
                        </Animated.View>
                    </View>
                </Modal>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.light,
        padding: SPACING.xl,
    },
    loadingText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[500],
    },
    errorText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.dark,
        fontWeight: '600',
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.md,
        marginHorizontal: SPACING.md,
    },
    galleryContainer: {
        height: height * 0.45, // 45% de la hauteur d'écran
        backgroundColor: COLORS.white,
        position: 'relative',
    },
    image: {
        width: width,
        height: height * 0.45,
        resizeMode: 'cover',
    },
    placeholderImage: {
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagination: {
        position: 'absolute',
        bottom: SPACING.lg,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        gap: SPACING.xs,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    paginationDotActive: {
        backgroundColor: COLORS.primary,
        width: 24,
    },
    content: {
        padding: SPACING.lg,
    },
    headerSection: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.sm,
        lineHeight: 32,
    },
    price: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.primary,
    },
    sellerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray[50],
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
    },
    sellerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    sellerInfo: {
        flex: 1,
    },
    sellerLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
        marginBottom: 2,
    },
    sellerName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.sm,
    },
    description: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        lineHeight: 24,
    },
    footer: {
        padding: SPACING.lg,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[100],
        ...SHADOWS.lg,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    modalTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
    },
    wishlistItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    wishlistName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 2,
    },
    wishlistType: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
        textTransform: 'capitalize',
    },
    emptyWishlist: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        textAlign: 'center',
        lineHeight: 22,
    },
});
