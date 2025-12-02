import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Package, Clock, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'];

export default function OrdersScreen() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadOrders();
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('buyer_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return COLORS.success;
            case 'pending':
                return COLORS.accent;
            case 'cancelled':
                return COLORS.error;
            default:
                return COLORS.gray[500];
        }
    };

    const renderOrder = ({ item }: { item: Order }) => (
        <Card style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View style={styles.orderIdContainer}>
                    <Package size={20} color={COLORS.primary} />
                    <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) + '20' }
                ]}>
                    <Text style={[
                        styles.statusText,
                        { color: getStatusColor(item.status) }
                    ]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.orderInfo}>
                <Text style={styles.orderDate}>
                    {new Date(item.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.orderTotal}>
                    {item.currency} {item.total_amount.toFixed(2)}
                </Text>
            </View>
        </Card>
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'My Orders',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.container}>
                {loading ? (
                    <View style={styles.centerContainer}>
                        <Text>Loading orders...</Text>
                    </View>
                ) : orders.length > 0 ? (
                    <FlatList
                        data={orders}
                        renderItem={renderOrder}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                    />
                ) : (
                    <View style={styles.centerContainer}>
                        <Package size={64} color={COLORS.gray[300]} />
                        <Text style={styles.emptyText}>No orders yet</Text>
                    </View>
                )}
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
    listContent: {
        padding: SPACING.lg,
        gap: SPACING.md,
    },
    orderCard: {
        padding: SPACING.md,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    orderIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    orderId: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    orderInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderDate: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[500],
    },
    orderTotal: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
    },
    emptyText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.lg,
        color: COLORS.gray[500],
    },
});
