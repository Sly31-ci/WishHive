import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    FlatList,
} from 'react-native';
import { router, Stack } from 'expo-router';
import {
    ArrowLeft,
    Gift,
    Truck,
    Star,
    Zap,
    Trophy,
    Tag,
    Clock,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

type Reward = {
    id: string;
    title: string;
    description: string;
    points_cost: number;
    type: 'coupon' | 'shipping' | 'badge' | 'feature';
    value: string;
    icon: string;
    available_quantity: number | null;
    expires_at: string | null;
};

type RedemptionHistory = {
    id: string;
    reward_title: string;
    points_spent: number;
    redeemed_at: string;
    status: 'active' | 'used' | 'expired';
};

const REWARD_ICONS = {
    coupon: Tag,
    shipping: Truck,
    badge: Star,
    feature: Zap,
};

export default function RewardsShopScreen() {
    const { user } = useAuth();
    const [userPoints, setUserPoints] = useState(0);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [history, setHistory] = useState<RedemptionHistory[]>([]);
    const [activeTab, setActiveTab] = useState<'shop' | 'history'>('shop');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRewardsData();
    }, []);

    const loadRewardsData = async () => {
        if (!user) return;

        try {
            // Load user points
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('points')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;
            setUserPoints(profile.points);

            // Load available rewards
            const { data: rewardsData, error: rewardsError } = await supabase
                .from('rewards')
                .select('*')
                .eq('is_active', true)
                .order('points_cost', { ascending: true });

            if (rewardsError) throw rewardsError;
            setRewards(rewardsData || []);

            // Load redemption history
            const { data: historyData, error: historyError } = await supabase
                .from('reward_redemptions')
                .select(`
                    id,
                    points_spent,
                    redeemed_at,
                    status,
                    rewards (
                        title
                    )
                `)
                .eq('user_id', user.id)
                .order('redeemed_at', { ascending: false })
                .limit(20);

            if (historyError) throw historyError;

            const formattedHistory = historyData?.map((h: any) => ({
                id: h.id,
                reward_title: h.rewards?.title || 'Unknown Reward',
                points_spent: h.points_spent,
                redeemed_at: h.redeemed_at,
                status: h.status,
            })) || [];

            setHistory(formattedHistory);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeemReward = async (reward: Reward) => {
        if (!user) return;

        if (userPoints < reward.points_cost) {
            Alert.alert('Insufficient Points', `You need ${reward.points_cost - userPoints} more points`);
            return;
        }

        Alert.alert(
            'Redeem Reward',
            `Redeem "${reward.title}" for ${reward.points_cost} points?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Redeem',
                    onPress: async () => {
                        try {
                            // Create redemption record
                            const { error: redemptionError } = await supabase
                                .from('reward_redemptions')
                                .insert({
                                    user_id: user.id,
                                    reward_id: reward.id,
                                    points_spent: reward.points_cost,
                                    status: 'active',
                                });

                            if (redemptionError) throw redemptionError;

                            // Deduct points
                            const { error: pointsError } = await supabase
                                .from('profiles')
                                .update({ points: userPoints - reward.points_cost })
                                .eq('id', user.id);

                            if (pointsError) throw pointsError;

                            // Log transaction
                            await supabase.from('transactions').insert({
                                user_id: user.id,
                                type: 'spend',
                                amount: reward.points_cost,
                                description: `Redeemed: ${reward.title}`,
                            });

                            // Update quantity if limited
                            if (reward.available_quantity !== null) {
                                await supabase
                                    .from('rewards')
                                    .update({ available_quantity: reward.available_quantity - 1 })
                                    .eq('id', reward.id);
                            }

                            loadRewardsData();
                            Alert.alert('Success', 'Reward redeemed! Check your history.');
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    const renderReward = ({ item }: { item: Reward }) => {
        const IconComponent = REWARD_ICONS[item.type] || Gift;
        const canAfford = userPoints >= item.points_cost;
        const isAvailable = item.available_quantity === null || item.available_quantity > 0;
        const isExpired = item.expires_at && new Date(item.expires_at) < new Date();

        return (
            <Card style={[styles.rewardCard, !canAfford && styles.disabledCard]}>
                <View style={styles.rewardHeader}>
                    <View style={[styles.rewardIcon, { backgroundColor: COLORS.primary + '20' }]}>
                        <IconComponent size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.rewardInfo}>
                        <Text style={styles.rewardTitle}>{item.title}</Text>
                        <Text style={styles.rewardDescription}>{item.description}</Text>
                        {item.expires_at && (
                            <View style={styles.expiryBadge}>
                                <Clock size={12} color={COLORS.warning} />
                                <Text style={styles.expiryText}>
                                    Expires {new Date(item.expires_at).toLocaleDateString()}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.rewardFooter}>
                    <View style={styles.pointsCost}>
                        <Trophy size={16} color={COLORS.accent} />
                        <Text style={styles.pointsText}>{item.points_cost} points</Text>
                    </View>
                    {item.available_quantity !== null && (
                        <Text style={styles.quantityText}>
                            {item.available_quantity} left
                        </Text>
                    )}
                </View>

                <Button
                    title={!canAfford ? 'Not Enough Points' : !isAvailable ? 'Sold Out' : isExpired ? 'Expired' : 'Redeem'}
                    onPress={() => handleRedeemReward(item)}
                    disabled={!canAfford || !isAvailable || isExpired}
                    style={styles.redeemButton}
                />
            </Card>
        );
    };

    const renderHistory = ({ item }: { item: RedemptionHistory }) => {
        const statusColors = {
            active: COLORS.success,
            used: COLORS.textSecondary,
            expired: COLORS.error,
        };

        return (
            <Card style={styles.historyCard}>
                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>{item.reward_title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
                        <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
                <View style={styles.historyFooter}>
                    <Text style={styles.historyPoints}>-{item.points_spent} points</Text>
                    <Text style={styles.historyDate}>
                        {new Date(item.redeemed_at).toLocaleDateString()}
                    </Text>
                </View>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Rewards Shop',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            {/* Points Balance */}
            <Card style={styles.balanceCard}>
                <View style={styles.balanceContent}>
                    <Trophy size={32} color={COLORS.accent} />
                    <View style={styles.balanceInfo}>
                        <Text style={styles.balanceLabel}>Your Points</Text>
                        <Text style={styles.balanceAmount}>{userPoints.toLocaleString()}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/gamification/earn-points')}
                    style={styles.earnButton}
                >
                    <Zap size={16} color={COLORS.primary} />
                    <Text style={styles.earnButtonText}>Earn More</Text>
                </TouchableOpacity>
            </Card>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'shop' && styles.activeTab]}
                    onPress={() => setActiveTab('shop')}
                >
                    <Gift size={20} color={activeTab === 'shop' ? COLORS.primary : COLORS.textSecondary} />
                    <Text style={[styles.tabText, activeTab === 'shop' && styles.activeTabText]}>
                        Shop
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'history' && styles.activeTab]}
                    onPress={() => setActiveTab('history')}
                >
                    <Clock size={20} color={activeTab === 'history' ? COLORS.primary : COLORS.textSecondary} />
                    <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
                        History
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            {activeTab === 'shop' ? (
                <FlatList
                    data={rewards}
                    renderItem={renderReward}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Card style={styles.emptyCard}>
                            <Gift size={48} color={COLORS.textLight} />
                            <Text style={styles.emptyText}>No rewards available</Text>
                            <Text style={styles.emptySubtext}>Check back later for new rewards!</Text>
                        </Card>
                    }
                />
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderHistory}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Card style={styles.emptyCard}>
                            <Clock size={48} color={COLORS.textLight} />
                            <Text style={styles.emptyText}>No redemptions yet</Text>
                            <Text style={styles.emptySubtext}>Start redeeming rewards to see your history</Text>
                        </Card>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    balanceCard: {
        margin: SPACING.md,
        backgroundColor: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
    },
    balanceContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    balanceInfo: {
        marginLeft: SPACING.md,
        flex: 1,
    },
    balanceLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    balanceAmount: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.dark,
    },
    earnButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: COLORS.primary + '20',
    },
    earnButtonText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.primary,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.backgroundSecondary,
        padding: SPACING.xs,
        gap: SPACING.xs,
        marginHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
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
    rewardCard: {
        marginBottom: SPACING.md,
    },
    disabledCard: {
        opacity: 0.6,
    },
    rewardHeader: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    rewardIcon: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    rewardInfo: {
        flex: 1,
    },
    rewardTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    rewardDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    expiryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.xs,
    },
    expiryText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.warning,
        fontWeight: '500',
    },
    rewardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    pointsCost: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    pointsText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.accent,
    },
    quantityText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    redeemButton: {
        marginTop: SPACING.sm,
    },
    historyCard: {
        marginBottom: SPACING.md,
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    historyTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        flex: 1,
    },
    statusBadge: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
    },
    statusText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    historyFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    historyPoints: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.error,
    },
    historyDate: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
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
