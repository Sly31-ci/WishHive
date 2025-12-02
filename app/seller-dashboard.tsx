import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { router, Stack } from 'expo-router';
import {
    ArrowLeft,
    Package,
    DollarSign,
    TrendingUp,
    Plus,
    Settings,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type Seller = Database['public']['Tables']['sellers']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export default function SellerDashboardScreen() {
    const { user } = useAuth();
    const [seller, setSeller] = useState<Seller | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadSellerData();
        }
    }, [user]);

    const loadSellerData = async () => {
        try {
            const { data: sellerData, error: sellerError } = await supabase
                .from('sellers')
                .select('*')
                .eq('owner_id', user?.id)
                .single();

            if (sellerError) {
                if (sellerError.code === 'PGRST116') {
                    // Not a seller yet
                    setSeller(null);
                } else {
                    throw sellerError;
                }
            } else {
                setSeller(sellerData);

                // Load products
                const { data: productsData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('seller_id', sellerData.id)
                    .order('created_at', { ascending: false });

                setProducts(productsData || []);
            }
        } catch (error) {
            console.error('Error loading seller data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBecomeSeller = async () => {
        // Navigate to seller registration
        // For now, just show a placeholder
        alert('Seller registration coming soon!');
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!seller) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ title: 'Seller Dashboard' }} />
                <View style={styles.centerContainer}>
                    <Package size={64} color={COLORS.primary} />
                    <Text style={styles.emptyTitle}>Become a Seller</Text>
                    <Text style={styles.emptyText}>
                        Start selling your products on WishHive today!
                    </Text>
                    <Button
                        title="Register as Seller"
                        onPress={handleBecomeSeller}
                        style={styles.button}
                    />
                </View>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Seller Dashboard',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity>
                            <Settings size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.container}>
                <View style={styles.statsGrid}>
                    <Card style={styles.statCard}>
                        <DollarSign size={24} color={COLORS.success} />
                        <Text style={styles.statValue}>$0.00</Text>
                        <Text style={styles.statLabel}>Total Sales</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <Package size={24} color={COLORS.primary} />
                        <Text style={styles.statValue}>{products.length}</Text>
                        <Text style={styles.statLabel}>Products</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <TrendingUp size={24} color={COLORS.accent} />
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </Card>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Your Products</Text>
                        <Button
                            title="Add Product"
                            size="sm"
                            icon={<Plus size={16} color={COLORS.white} />}
                            onPress={() => { }} // Navigate to add product
                        />
                    </View>

                    {products.length > 0 ? (
                        <View style={styles.productList}>
                            {products.map((product) => (
                                <Card key={product.id} style={styles.productCard}>
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productTitle}>{product.title}</Text>
                                        <Text style={styles.productPrice}>
                                            {product.currency} {product.price.toFixed(2)}
                                        </Text>
                                        <Text style={styles.productStock}>
                                            Stock: {product.stock_quantity}
                                        </Text>
                                    </View>
                                    <View style={styles.productStatus}>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: product.is_active ? COLORS.success + '20' : COLORS.gray[200] }
                                        ]}>
                                            <Text style={[
                                                styles.statusText,
                                                { color: product.is_active ? COLORS.success : COLORS.gray[600] }
                                            ]}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyText}>No products yet</Text>
                        </Card>
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
        padding: SPACING.xl,
    },
    emptyTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    button: {
        width: '100%',
    },
    statsGrid: {
        flexDirection: 'row',
        padding: SPACING.lg,
        gap: SPACING.md,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: SPACING.md,
    },
    statValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
        marginTop: SPACING.sm,
    },
    statLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    section: {
        padding: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
    },
    productList: {
        gap: SPACING.md,
    },
    productCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    productInfo: {
        flex: 1,
    },
    productTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        color: COLORS.primary,
    },
    productStock: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
        marginTop: 4,
    },
    productStatus: {
        marginLeft: SPACING.md,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    emptyCard: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
});
