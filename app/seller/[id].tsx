import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ArrowLeft, Star, MapPin, Globe } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type Seller = Database['public']['Tables']['sellers']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export default function SellerProfileScreen() {
    const { id } = useLocalSearchParams();
    const [seller, setSeller] = useState<Seller | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadSellerDetails();
        }
    }, [id]);

    const loadSellerDetails = async () => {
        try {
            // Load seller info
            const { data: sellerData, error: sellerError } = await supabase
                .from('sellers')
                .select('*')
                .eq('id', id)
                .single();

            if (sellerError) throw sellerError;
            setSeller(sellerData);

            // Load seller products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', id)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;
            setProducts(productsData || []);
        } catch (error) {
            console.error('Error loading seller:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push(`/product/${item.id}`)}
        >
            <Image
                source={{ uri: item.images?.[0] }}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.productPrice}>
                    {item.currency} {item.price.toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!seller) {
        return (
            <View style={styles.centerContainer}>
                <Text>Seller not found</Text>
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
                }}
            />

            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.coverImage} />
                    <View style={styles.profileInfo}>
                        <View style={styles.avatarContainer}>
                            {seller.logo_url ? (
                                <Image source={{ uri: seller.logo_url }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.placeholderAvatar]}>
                                    <Text style={styles.avatarText}>
                                        {seller.store_name.charAt(0)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.storeName}>{seller.store_name}</Text>
                        {seller.description && (
                            <Text style={styles.description}>{seller.description}</Text>
                        )}

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Star size={16} color={COLORS.accent} fill={COLORS.accent} />
                                <Text style={styles.statText}>{seller.rating.toFixed(1)}</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statText}>{products.length} Products</Text>
                            </View>
                        </View>

                        {seller.website_url && (
                            <View style={styles.linkRow}>
                                <Globe size={16} color={COLORS.primary} />
                                <Text style={styles.linkText}>{seller.website_url}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.productsSection}>
                    <Text style={styles.sectionTitle}>Products</Text>
                    <FlatList
                        data={products}
                        renderItem={renderProduct}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={styles.productRow}
                    />
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
    header: {
        backgroundColor: COLORS.white,
        paddingBottom: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    coverImage: {
        height: 150,
        backgroundColor: COLORS.primary,
    },
    profileInfo: {
        paddingHorizontal: SPACING.lg,
        marginTop: -50,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: COLORS.white,
    },
    placeholderAvatar: {
        backgroundColor: COLORS.gray[200],
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '700',
        color: COLORS.gray[600],
    },
    storeName: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    description: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
    statDivider: {
        width: 1,
        height: 16,
        backgroundColor: COLORS.gray[300],
        marginHorizontal: SPACING.md,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    linkText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
    },
    productsSection: {
        padding: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    productRow: {
        gap: SPACING.md,
    },
    productCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    productImage: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: COLORS.gray[100],
    },
    productInfo: {
        padding: SPACING.sm,
    },
    productTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        color: COLORS.primary,
    },
});
