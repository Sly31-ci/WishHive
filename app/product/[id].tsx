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
import {
    ArrowLeft,
    Share2,
    Heart,
    ShoppingCart,
    Store,
    Check,
    Plus,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';
import { useWishlists } from '@/hooks/useWishlists';

type Product = Database['public']['Tables']['products']['Row'];
type Seller = Database['public']['Tables']['sellers']['Row'];

const { width } = Dimensions.get('window');

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
                priority: 2,
            });

            if (error) throw error;

            setShowWishlistModal(false);
            Alert.alert('Success', 'Added to wishlist!');
        } catch (error) {
            Alert.alert('Error', 'Failed to add to wishlist');
        } finally {
            setAddingToWishlist(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centerContainer}>
                <Text>Product not found</Text>
                <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 20 }} />
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
                <ScrollView>
                    {/* Image Gallery */}
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

                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{product.title}</Text>
                            <Text style={styles.price}>
                                {product.currency} {product.price.toFixed(2)}
                            </Text>
                        </View>

                        {seller && (
                            <TouchableOpacity
                                style={styles.sellerCard}
                                onPress={() => router.push(`/seller/${seller.id}`)}
                            >
                                <View style={styles.sellerIcon}>
                                    <Store size={20} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.sellerLabel}>Sold by</Text>
                                    <Text style={styles.sellerName}>{seller.shop_name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>{product.description}</Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title="Add to Wishlist"
                        onPress={() => setShowWishlistModal(true)}
                        icon={<Heart size={20} color={COLORS.white} />}
                        style={styles.wishlistButton}
                    />
                    <Button
                        title="Buy Now"
                        onPress={() => { }} // Implement buy flow
                        variant="outline"
                        icon={<ShoppingCart size={20} color={COLORS.primary} />}
                        style={styles.buyButton}
                    />
                </View>

                {/* Wishlist Selection Modal */}
                <Modal
                    visible={showWishlistModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowWishlistModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Select Wishlist</Text>
                                <TouchableOpacity onPress={() => setShowWishlistModal(false)}>
                                    <Text style={styles.closeButton}>Close</Text>
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={wishlists}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.wishlistItem}
                                        onPress={() => handleAddToWishlist(item.id)}
                                        disabled={addingToWishlist}
                                    >
                                        <View>
                                            <Text style={styles.wishlistName}>{item.title}</Text>
                                            <Text style={styles.wishlistType}>{item.type}</Text>
                                        </View>
                                        <Plus size={20} color={COLORS.primary} />
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <View style={styles.emptyWishlist}>
                                        <Text>No wishlists found. Create one first!</Text>
                                        <Button
                                            title="Create Wishlist"
                                            onPress={() => {
                                                setShowWishlistModal(false);
                                                router.push('/wishlists/create');
                                            }}
                                            size="sm"
                                            style={{ marginTop: 10 }}
                                        />
                                    </View>
                                }
                            />
                        </View>
                    </View>
                </Modal>
            </View>
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
    galleryContainer: {
        height: 300,
        backgroundColor: COLORS.white,
        position: 'relative',
    },
    image: {
        width: width,
        height: 300,
        resizeMode: 'cover',
    },
    placeholderImage: {
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagination: {
        position: 'absolute',
        bottom: SPACING.md,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        gap: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    paginationDotActive: {
        backgroundColor: COLORS.primary,
    },
    content: {
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    price: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.primary,
    },
    sellerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    sellerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    sellerLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    sellerName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
    section: {
        marginBottom: SPACING.lg,
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
        borderTopColor: COLORS.gray[200],
        flexDirection: 'row',
        gap: SPACING.md,
    },
    wishlistButton: {
        flex: 1,
    },
    buyButton: {
        flex: 1,
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
    closeButton: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
    wishlistItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    wishlistName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
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
});
