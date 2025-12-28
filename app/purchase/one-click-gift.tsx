import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Switch,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    Zap,
    Gift,
    MessageCircle,
    Package,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

export default function OneClickGiftScreen() {
    const { productId, wishlistId } = useLocalSearchParams<{ productId: string; wishlistId: string }>();
    const { user } = useAuth();
    const [productTitle, setProductTitle] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productImage, setProductImage] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [includeGiftWrap, setIncludeGiftWrap] = useState(true);
    const [giftMessage, setGiftMessage] = useState('');
    const [deliveryOption, setDeliveryOption] = useState<'recipient' | 'self'>('recipient');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGiftData();
    }, [productId, wishlistId]);

    const loadGiftData = async () => {
        if (!productId || !wishlistId || !user) return;

        try {
            // Load product
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('title, price, images')
                .eq('id', productId)
                .single();

            if (productError) throw productError;

            setProductTitle(product.title);
            setProductPrice(product.price);
            setProductImage(product.images?.[0] || '');

            // Load wishlist owner (recipient)
            const { data: wishlist, error: wishlistError } = await supabase
                .from('wishlists')
                .select(`
                    owner_id,
                    profiles:owner_id (
                        username
                    )
                `)
                .eq('id', wishlistId)
                .single();

            if (wishlistError) throw wishlistError;

            setRecipientName(wishlist.profiles?.username || 'Unknown');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!productId || !wishlistId || !user) return;

        Alert.alert(
            'Confirm Purchase',
            `Purchase "${productTitle}" for $${productPrice.toFixed(2)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Purchase',
                    onPress: async () => {
                        try {
                            // Create order
                            const { data: order, error: orderError } = await supabase
                                .from('orders')
                                .insert({
                                    buyer_id: user.id,
                                    product_id: productId,
                                    wishlist_id: wishlistId,
                                    is_anonymous: isAnonymous,
                                    gift_wrap: includeGiftWrap,
                                    gift_message: giftMessage || null,
                                    delivery_to: deliveryOption,
                                    status: 'pending',
                                    total_amount: productPrice + (includeGiftWrap ? 5 : 0),
                                })
                                .select()
                                .single();

                            if (orderError) throw orderError;

                            // Mark wishlist item as purchased
                            await supabase
                                .from('wishlist_items')
                                .update({ purchased: true, purchased_by: user.id })
                                .eq('wishlist_id', wishlistId)
                                .eq('product_id', productId);

                            // Award points
                            await supabase.rpc('increment_points', {
                                user_id: user.id,
                                points_to_add: 50,
                            });

                            Alert.alert(
                                'Success! 🎉',
                                'Gift purchased successfully! You earned 50 points.',
                                [
                                    {
                                        text: 'View Order',
                                        onPress: () => router.push(`/orders/${order.id}`),
                                    },
                                    {
                                        text: 'Done',
                                        onPress: () => router.back(),
                                    },
                                ]
                            );
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    const giftWrapCost = 5;
    const totalCost = productPrice + (includeGiftWrap ? giftWrapCost : 0);

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'One-Click Gift',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.content}>
                {/* Quick Purchase Badge */}
                <Card style={styles.quickBadge}>
                    <Zap size={20} color={COLORS.accent} />
                    <Text style={styles.quickText}>Express Checkout</Text>
                </Card>

                {/* Product Info */}
                <Card style={styles.productCard}>
                    <Text style={styles.productTitle}>{productTitle}</Text>
                    <Text style={styles.productPrice}>${productPrice.toFixed(2)}</Text>
                    <Text style={styles.recipientText}>For: {recipientName}</Text>
                </Card>

                {/* Gift Options */}
                <Card style={styles.optionsCard}>
                    <Text style={styles.sectionTitle}>Gift Options</Text>

                    {/* Anonymous */}
                    <View style={styles.option}>
                        <View style={styles.optionInfo}>
                            <Text style={styles.optionLabel}>Send Anonymously</Text>
                            <Text style={styles.optionDescription}>
                                Hide your identity from the recipient
                            </Text>
                        </View>
                        <Switch
                            value={isAnonymous}
                            onValueChange={setIsAnonymous}
                            trackColor={{ false: COLORS.border, true: COLORS.primary + '50' }}
                            thumbColor={isAnonymous ? COLORS.primary : COLORS.background}
                        />
                    </View>

                    {/* Gift Wrap */}
                    <View style={styles.option}>
                        <View style={styles.optionInfo}>
                            <Text style={styles.optionLabel}>Gift Wrapping (+${giftWrapCost})</Text>
                            <Text style={styles.optionDescription}>
                                Beautiful gift wrapping included
                            </Text>
                        </View>
                        <Switch
                            value={includeGiftWrap}
                            onValueChange={setIncludeGiftWrap}
                            trackColor={{ false: COLORS.border, true: COLORS.primary + '50' }}
                            thumbColor={includeGiftWrap ? COLORS.primary : COLORS.background}
                        />
                    </View>

                    {/* Gift Message */}
                    {!isAnonymous && (
                        <View style={styles.messageSection}>
                            <View style={styles.messageHeader}>
                                <MessageCircle size={16} color={COLORS.primary} />
                                <Text style={styles.optionLabel}>Gift Message (Optional)</Text>
                            </View>
                            <Input
                                placeholder="Add a personal message..."
                                value={giftMessage}
                                onChangeText={setGiftMessage}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    )}
                </Card>

                {/* Delivery Options */}
                <Card style={styles.deliveryCard}>
                    <Text style={styles.sectionTitle}>Delivery</Text>

                    <TouchableOpacity
                        style={[
                            styles.deliveryOption,
                            deliveryOption === 'recipient' && styles.selectedDelivery,
                        ]}
                        onPress={() => setDeliveryOption('recipient')}
                    >
                        <Package size={20} color={deliveryOption === 'recipient' ? COLORS.primary : COLORS.textSecondary} />
                        <View style={styles.deliveryInfo}>
                            <Text style={[
                                styles.deliveryLabel,
                                deliveryOption === 'recipient' && styles.selectedDeliveryText,
                            ]}>
                                Deliver to Recipient
                            </Text>
                            <Text style={styles.deliveryDescription}>
                                Send directly to {recipientName}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.deliveryOption,
                            deliveryOption === 'self' && styles.selectedDelivery,
                        ]}
                        onPress={() => setDeliveryOption('self')}
                    >
                        <Gift size={20} color={deliveryOption === 'self' ? COLORS.primary : COLORS.textSecondary} />
                        <View style={styles.deliveryInfo}>
                            <Text style={[
                                styles.deliveryLabel,
                                deliveryOption === 'self' && styles.selectedDeliveryText,
                            ]}>
                                Deliver to Me
                            </Text>
                            <Text style={styles.deliveryDescription}>
                                I'll give it in person
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Card>

                {/* Total */}
                <Card style={styles.totalCard}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Product</Text>
                        <Text style={styles.totalValue}>${productPrice.toFixed(2)}</Text>
                    </View>
                    {includeGiftWrap && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Gift Wrapping</Text>
                            <Text style={styles.totalValue}>${giftWrapCost.toFixed(2)}</Text>
                        </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.grandTotalLabel}>Total</Text>
                        <Text style={styles.grandTotalValue}>${totalCost.toFixed(2)}</Text>
                    </View>
                </Card>

                {/* Purchase Button */}
                <Button
                    title="Complete Purchase"
                    onPress={handlePurchase}
                    style={styles.purchaseButton}
                />

                {/* Reward Info */}
                <Card style={styles.rewardCard}>
                    <Zap size={16} color={COLORS.accent} />
                    <Text style={styles.rewardText}>Earn 50 points with this purchase!</Text>
                </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACING.md,
    },
    quickBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
        marginBottom: SPACING.md,
        backgroundColor: COLORS.accent + '20',
        borderColor: COLORS.accent,
        borderWidth: 1,
    },
    quickText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.accent,
    },
    productCard: {
        marginBottom: SPACING.md,
        alignItems: 'center',
    },
    productTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
        textAlign: 'center',
    },
    productPrice: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: SPACING.sm,
    },
    recipientText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    optionsCard: {
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    optionInfo: {
        flex: 1,
    },
    optionLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    optionDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    messageSection: {
        marginTop: SPACING.md,
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.sm,
    },
    deliveryCard: {
        marginBottom: SPACING.md,
    },
    deliveryOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.border,
        marginBottom: SPACING.sm,
    },
    selectedDelivery: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10',
    },
    deliveryInfo: {
        marginLeft: SPACING.md,
        flex: 1,
    },
    deliveryLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    selectedDeliveryText: {
        color: COLORS.primary,
    },
    deliveryDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    totalCard: {
        marginBottom: SPACING.md,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.xs,
    },
    totalLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    totalValue: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.dark,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.sm,
    },
    grandTotalLabel: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
    },
    grandTotalValue: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.primary,
    },
    purchaseButton: {
        marginBottom: SPACING.md,
    },
    rewardCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.accent + '10',
        borderColor: COLORS.accent + '30',
        borderWidth: 1,
    },
    rewardText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
        color: COLORS.accent,
    },
});
