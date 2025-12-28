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
    Truck,
    CheckCircle,
    Clock,
    Heart,
    MessageCircle,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import Button from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

type GiftStatus = 'pending' | 'shipped' | 'delivered' | 'thanked';

type Gift = {
    id: string;
    product_title: string;
    product_image: string | null;
    sender_username: string | null;
    is_anonymous: boolean;
    status: GiftStatus;
    tracking_number: string | null;
    delivery_date: string | null;
    thank_you_sent: boolean;
    created_at: string;
};

const STATUS_CONFIG = {
    pending: {
        icon: Clock,
        color: COLORS.warning,
        label: 'Pending',
        description: 'Gift is being prepared',
    },
    shipped: {
        icon: Truck,
        color: COLORS.info,
        label: 'Shipped',
        description: 'On the way to you',
    },
    delivered: {
        icon: Package,
        color: COLORS.success,
        label: 'Delivered',
        description: 'Gift has arrived',
    },
    thanked: {
        icon: Heart,
        color: COLORS.primary,
        label: 'Thanked',
        description: 'Thank you sent',
    },
};

export default function GiftTrackerScreen() {
    const { user } = useAuth();
    const [receivedGifts, setReceivedGifts] = useState<Gift[]>([]);
    const [sentGifts, setSentGifts] = useState<Gift[]>([]);
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGifts();
    }, []);

    const loadGifts = async () => {
        if (!user) return;

        try {
            // Load received gifts
            const { data: received, error: receivedError } = await supabase
                .from('orders')
                .select(`
                    id,
                    status,
                    tracking_number,
                    delivery_date,
                    is_anonymous,
                    created_at,
                    wishlist_items (
                        products (
                            title,
                            images
                        )
                    ),
                    profiles:buyer_id (
                        username
                    ),
                    thank_you_messages (
                        id
                    )
                `)
                .eq('recipient_id', user.id)
                .order('created_at', { ascending: false });

            if (receivedError) throw receivedError;

            const formattedReceived = received?.map((g: any) => ({
                id: g.id,
                product_title: g.wishlist_items?.products?.title || 'Unknown Product',
                product_image: g.wishlist_items?.products?.images?.[0] || null,
                sender_username: g.is_anonymous ? null : g.profiles?.username,
                is_anonymous: g.is_anonymous,
                status: g.status === 'delivered'
                    ? (g.thank_you_messages?.length > 0 ? 'thanked' : 'delivered')
                    : g.status,
                tracking_number: g.tracking_number,
                delivery_date: g.delivery_date,
                thank_you_sent: g.thank_you_messages?.length > 0,
                created_at: g.created_at,
            })) || [];

            setReceivedGifts(formattedReceived);

            // Load sent gifts
            const { data: sent, error: sentError } = await supabase
                .from('orders')
                .select(`
                    id,
                    status,
                    tracking_number,
                    delivery_date,
                    created_at,
                    wishlist_items (
                        products (
                            title,
                            images
                        )
                    ),
                    profiles:recipient_id (
                        username
                    )
                `)
                .eq('buyer_id', user.id)
                .order('created_at', { ascending: false });

            if (sentError) throw sentError;

            const formattedSent = sent?.map((g: any) => ({
                id: g.id,
                product_title: g.wishlist_items?.products?.title || 'Unknown Product',
                product_image: g.wishlist_items?.products?.images?.[0] || null,
                sender_username: g.profiles?.username,
                is_anonymous: false,
                status: g.status,
                tracking_number: g.tracking_number,
                delivery_date: g.delivery_date,
                thank_you_sent: false,
                created_at: g.created_at,
            })) || [];

            setSentGifts(formattedSent);
        } catch (error: any) {
            console.error('Error loading gifts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendThankYou = async (giftId: string, senderUsername: string | null) => {
        if (!user) return;

        router.push({
            pathname: '/messages/compose',
            params: {
                orderId: giftId,
                recipient: senderUsername || 'Anonymous Gifter',
            },
        });
    };

    const renderGift = ({ item }: { item: Gift }) => {
        const statusConfig = STATUS_CONFIG[item.status];
        const StatusIcon = statusConfig.icon;

        return (
            <Card style={styles.giftCard}>
                <View style={styles.giftHeader}>
                    <View style={styles.productInfo}>
                        <Text style={styles.productTitle}>{item.product_title}</Text>
                        <Text style={styles.giftMeta}>
                            {activeTab === 'received'
                                ? `From: ${item.is_anonymous ? '🎁 Anonymous' : item.sender_username}`
                                : `To: ${item.sender_username}`
                            }
                        </Text>
                        <Text style={styles.giftDate}>
                            {new Date(item.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
                        <StatusIcon size={16} color={statusConfig.color} />
                        <Text style={[styles.statusLabel, { color: statusConfig.color }]}>
                            {statusConfig.label}
                        </Text>
                    </View>
                    <Text style={styles.statusDescription}>{statusConfig.description}</Text>
                </View>

                {item.tracking_number && (
                    <View style={styles.trackingContainer}>
                        <Truck size={16} color={COLORS.textSecondary} />
                        <Text style={styles.trackingNumber}>
                            Tracking: {item.tracking_number}
                        </Text>
                    </View>
                )}

                {item.delivery_date && (
                    <View style={styles.deliveryContainer}>
                        <Package size={16} color={COLORS.textSecondary} />
                        <Text style={styles.deliveryDate}>
                            Delivered: {new Date(item.delivery_date).toLocaleDateString()}
                        </Text>
                    </View>
                )}

                {activeTab === 'received' && item.status === 'delivered' && !item.thank_you_sent && !item.is_anonymous && (
                    <Button
                        title="Send Thank You"
                        onPress={() => handleSendThankYou(item.id, item.sender_username)}
                        variant="outline"
                        style={styles.thankYouButton}
                    />
                )}

                {item.thank_you_sent && (
                    <View style={styles.thankedBadge}>
                        <Heart size={14} color={COLORS.primary} />
                        <Text style={styles.thankedText}>Thank you sent ❤️</Text>
                    </View>
                )}
            </Card>
        );
    };

    const gifts = activeTab === 'received' ? receivedGifts : sentGifts;

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Gift Tracker',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'received' && styles.activeTab]}
                    onPress={() => setActiveTab('received')}
                >
                    <Package size={20} color={activeTab === 'received' ? COLORS.primary : COLORS.textSecondary} />
                    <Text style={[styles.tabText, activeTab === 'received' && styles.activeTabText]}>
                        Received ({receivedGifts.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
                    onPress={() => setActiveTab('sent')}
                >
                    <Heart size={20} color={activeTab === 'sent' ? COLORS.primary : COLORS.textSecondary} />
                    <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>
                        Sent ({sentGifts.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={gifts}
                renderItem={renderGift}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Card style={styles.emptyCard}>
                        <Package size={48} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>
                            {activeTab === 'received' ? 'No gifts received yet' : 'No gifts sent yet'}
                        </Text>
                        <Text style={styles.emptySubtext}>
                            {activeTab === 'received'
                                ? 'Gifts you receive will appear here'
                                : 'Gifts you send will appear here'
                            }
                        </Text>
                    </Card>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.backgroundSecondary,
        padding: SPACING.xs,
        gap: SPACING.xs,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.sm,
    },
    activeTab: {
        backgroundColor: COLORS.background,
    },
    tabText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
        color: COLORS.textSecondary,
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    listContent: {
        padding: SPACING.md,
    },
    giftCard: {
        marginBottom: SPACING.md,
    },
    giftHeader: {
        marginBottom: SPACING.md,
    },
    productInfo: {
        flex: 1,
    },
    productTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    giftMeta: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    giftDate: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
    },
    statusContainer: {
        marginBottom: SPACING.sm,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        alignSelf: 'flex-start',
        marginBottom: SPACING.xs,
    },
    statusLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    statusDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    trackingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: BORDER_RADIUS.sm,
        marginBottom: SPACING.xs,
    },
    trackingNumber: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.dark,
        fontFamily: 'monospace',
    },
    deliveryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        backgroundColor: COLORS.success + '10',
        borderRadius: BORDER_RADIUS.sm,
        marginBottom: SPACING.sm,
    },
    deliveryDate: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.success,
        fontWeight: '500',
    },
    thankYouButton: {
        marginTop: SPACING.sm,
    },
    thankedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        backgroundColor: COLORS.primary + '10',
        borderRadius: BORDER_RADIUS.sm,
        alignSelf: 'flex-start',
        marginTop: SPACING.sm,
    },
    thankedText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '500',
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
        marginTop: SPACING.xl,
    },
    emptyText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        marginBottom: SPACING.xs,
    },
    emptySubtext: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textLight,
        textAlign: 'center',
    },
});
