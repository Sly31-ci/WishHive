import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    TrendingDown,
    Bell,
    BellOff,
    DollarSign,
    Calendar,
} from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

const { width } = Dimensions.get('window');

type PricePoint = {
    price: number;
    date: string;
};

export default function PriceTrackingScreen() {
    const { productId } = useLocalSearchParams<{ productId: string }>();
    const { user } = useAuth();
    const [productTitle, setProductTitle] = useState('');
    const [currentPrice, setCurrentPrice] = useState(0);
    const [lowestPrice, setLowestPrice] = useState(0);
    const [highestPrice, setHighestPrice] = useState(0);
    const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
    const [alertEnabled, setAlertEnabled] = useState(false);
    const [alertThreshold, setAlertThreshold] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPriceData();
    }, [productId]);

    const loadPriceData = async () => {
        if (!productId || !user) return;

        try {
            // Load product
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('title, price')
                .eq('id', productId)
                .single();

            if (productError) throw productError;

            setProductTitle(product.title);
            setCurrentPrice(product.price);

            // Load price history
            const { data: history, error: historyError } = await supabase
                .from('price_history')
                .select('price, recorded_at')
                .eq('product_id', productId)
                .order('recorded_at', { ascending: true })
                .limit(30);

            if (historyError) throw historyError;

            const formattedHistory = history?.map((h: any) => ({
                price: h.price,
                date: h.recorded_at,
            })) || [];

            setPriceHistory(formattedHistory);

            if (formattedHistory.length > 0) {
                const prices = formattedHistory.map(h => h.price);
                setLowestPrice(Math.min(...prices));
                setHighestPrice(Math.max(...prices));
            }

            // Check for price alert
            const { data: alert, error: alertError } = await supabase
                .from('price_alerts')
                .select('*')
                .eq('product_id', productId)
                .eq('user_id', user.id)
                .eq('is_active', true)
                .single();

            if (alert) {
                setAlertEnabled(true);
                setAlertThreshold(alert.threshold_price);
            }
        } catch (error: any) {
            console.error('Error loading price data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAlert = async () => {
        if (!productId || !user) return;

        try {
            if (alertEnabled) {
                // Disable alert
                const { error } = await supabase
                    .from('price_alerts')
                    .update({ is_active: false })
                    .eq('product_id', productId)
                    .eq('user_id', user.id);

                if (error) throw error;
                setAlertEnabled(false);
                Alert.alert('Success', 'Price alert disabled');
            } else {
                // Enable alert
                const threshold = currentPrice * 0.9; // 10% drop
                const { error } = await supabase
                    .from('price_alerts')
                    .upsert({
                        product_id: productId,
                        user_id: user.id,
                        threshold_price: threshold,
                        is_active: true,
                    });

                if (error) throw error;
                setAlertEnabled(true);
                setAlertThreshold(threshold);
                Alert.alert('Success', `You'll be notified if price drops below $${threshold.toFixed(2)}`);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const chartData = {
        labels: priceHistory.slice(-7).map((p) =>
            new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [{
            data: priceHistory.slice(-7).map(p => p.price),
        }],
    };

    const priceChange = priceHistory.length > 1
        ? currentPrice - priceHistory[priceHistory.length - 2].price
        : 0;
    const priceChangePercent = priceHistory.length > 1
        ? (priceChange / priceHistory[priceHistory.length - 2].price) * 100
        : 0;

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Price Tracking',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.content}>
                {/* Product Info */}
                <Card style={styles.productCard}>
                    <Text style={styles.productTitle}>{productTitle}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.currentPrice}>${currentPrice.toFixed(2)}</Text>
                        {priceChange !== 0 && (
                            <View style={[
                                styles.changeBadge,
                                { backgroundColor: priceChange < 0 ? COLORS.success + '20' : COLORS.error + '20' }
                            ]}>
                                <TrendingDown
                                    size={14}
                                    color={priceChange < 0 ? COLORS.success : COLORS.error}
                                    style={{ transform: [{ rotate: priceChange < 0 ? '0deg' : '180deg' }] }}
                                />
                                <Text style={[
                                    styles.changeText,
                                    { color: priceChange < 0 ? COLORS.success : COLORS.error }
                                ]}>
                                    {priceChangePercent.toFixed(1)}%
                                </Text>
                            </View>
                        )}
                    </View>
                </Card>

                {/* Price Stats */}
                <View style={styles.statsContainer}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statLabel}>Lowest</Text>
                        <Text style={[styles.statValue, { color: COLORS.success }]}>
                            ${lowestPrice.toFixed(2)}
                        </Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statLabel}>Highest</Text>
                        <Text style={[styles.statValue, { color: COLORS.error }]}>
                            ${highestPrice.toFixed(2)}
                        </Text>
                    </Card>
                </View>

                {/* Price Chart */}
                {priceHistory.length > 1 && (
                    <Card style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Price History (Last 7 Days)</Text>
                        <LineChart
                            data={chartData}
                            width={width - SPACING.md * 4}
                            height={200}
                            chartConfig={{
                                backgroundColor: COLORS.background,
                                backgroundGradientFrom: COLORS.background,
                                backgroundGradientTo: COLORS.background,
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                                style: {
                                    borderRadius: BORDER_RADIUS.md,
                                },
                                propsForDots: {
                                    r: '4',
                                    strokeWidth: '2',
                                    stroke: COLORS.primary,
                                },
                            }}
                            bezier
                            style={styles.chart}
                        />
                    </Card>
                )}

                {/* Price Alert */}
                <Card style={styles.alertCard}>
                    <View style={styles.alertHeader}>
                        {alertEnabled ? (
                            <Bell size={24} color={COLORS.primary} />
                        ) : (
                            <BellOff size={24} color={COLORS.textSecondary} />
                        )}
                        <View style={styles.alertInfo}>
                            <Text style={styles.alertTitle}>Price Drop Alert</Text>
                            <Text style={styles.alertDescription}>
                                {alertEnabled
                                    ? `You'll be notified if price drops below $${alertThreshold.toFixed(2)}`
                                    : 'Get notified when the price drops'
                                }
                            </Text>
                        </View>
                    </View>
                    <Button
                        title={alertEnabled ? 'Disable Alert' : 'Enable Alert'}
                        onPress={handleToggleAlert}
                        variant={alertEnabled ? 'outline' : 'primary'}
                    />
                </Card>

                {/* Best Time to Buy */}
                <Card style={styles.recommendationCard}>
                    <Calendar size={24} color={COLORS.accent} />
                    <Text style={styles.recommendationTitle}>Best Time to Buy</Text>
                    <Text style={styles.recommendationText}>
                        {currentPrice === lowestPrice
                            ? '🎉 Now is a great time! Price is at its lowest.'
                            : currentPrice < (lowestPrice + highestPrice) / 2
                                ? '👍 Good time to buy. Price is below average.'
                                : '⏰ Consider waiting. Price is above average.'
                        }
                    </Text>
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
    productCard: {
        marginBottom: SPACING.md,
    },
    productTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.sm,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    currentPrice: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.primary,
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
    },
    changeText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    statValue: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
    },
    chartCard: {
        marginBottom: SPACING.md,
    },
    chartTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    chart: {
        marginVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    alertCard: {
        marginBottom: SPACING.md,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    alertInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    alertTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    alertDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    recommendationCard: {
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    recommendationTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.dark,
        marginTop: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    recommendationText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});
