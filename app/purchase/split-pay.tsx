import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    FlatList,
    Share,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    Users,
    DollarSign,
    UserPlus,
    Copy,
    Share2,
    CheckCircle,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

type Contributor = {
    id: string;
    user_id: string;
    username: string;
    avatar_url: string | null;
    amount: number;
    paid: boolean;
    paid_at: string | null;
};

export default function SplitPayScreen() {
    const { productId } = useLocalSearchParams<{ productId: string }>();
    const { user } = useAuth();
    const [productTitle, setProductTitle] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [targetAmount, setTargetAmount] = useState(0);
    const [currentAmount, setCurrentAmount] = useState(0);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [myContribution, setMyContribution] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [splitPayId, setSplitPayId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSplitPayData();
    }, [productId]);

    const loadSplitPayData = async () => {
        if (!productId || !user) return;

        try {
            // Load product details
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('title, price')
                .eq('id', productId)
                .single();

            if (productError) throw productError;

            setProductTitle(product.title);
            setProductPrice(product.price);

            // Check if split pay already exists for this product
            const { data: existingSplit, error: splitError } = await supabase
                .from('split_payments')
                .select('*')
                .eq('product_id', productId)
                .eq('status', 'active')
                .single();

            if (existingSplit) {
                setSplitPayId(existingSplit.id);
                setTargetAmount(existingSplit.target_amount);
                setCurrentAmount(existingSplit.current_amount);

                // Load contributors
                const { data: contribData, error: contribError } = await supabase
                    .from('split_contributors')
                    .select(`
                        id,
                        user_id,
                        amount,
                        paid,
                        paid_at,
                        profiles:user_id (
                            username,
                            avatar_url
                        )
                    `)
                    .eq('split_payment_id', existingSplit.id);

                if (contribError) throw contribError;

                const formattedContribs = contribData?.map((c: any) => ({
                    id: c.id,
                    user_id: c.user_id,
                    username: c.profiles?.username || 'Unknown',
                    avatar_url: c.profiles?.avatar_url,
                    amount: c.amount,
                    paid: c.paid,
                    paid_at: c.paid_at,
                })) || [];

                setContributors(formattedContribs);
            } else {
                setTargetAmount(product.price);
            }
        } catch (error: any) {
            console.error('Error loading split pay:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSplitPay = async () => {
        if (!productId || !user) return;

        try {
            const { data, error } = await supabase
                .from('split_payments')
                .insert({
                    product_id: productId,
                    organizer_id: user.id,
                    target_amount: targetAmount,
                    current_amount: 0,
                    status: 'active',
                })
                .select()
                .single();

            if (error) throw error;

            setSplitPayId(data.id);
            Alert.alert('Success', 'Split payment created! Invite contributors now.');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleInviteContributor = async () => {
        if (!inviteEmail.trim() || !splitPayId || !user) return;

        try {
            // Find user by email
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id, username')
                .eq('email', inviteEmail.toLowerCase())
                .single();

            if (profileError) {
                Alert.alert('Error', 'User not found');
                return;
            }

            // Check if already a contributor
            const existing = contributors.find(c => c.user_id === profile.id);
            if (existing) {
                Alert.alert('Error', 'User is already a contributor');
                return;
            }

            // Add contributor
            const { error: insertError } = await supabase
                .from('split_contributors')
                .insert({
                    split_payment_id: splitPayId,
                    user_id: profile.id,
                    amount: 0,
                    paid: false,
                });

            if (insertError) throw insertError;

            setInviteEmail('');
            loadSplitPayData();
            Alert.alert('Success', `${profile.username} invited!`);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleContribute = async () => {
        const amount = parseFloat(myContribution);
        if (!amount || amount <= 0 || !splitPayId || !user) return;

        if (amount > (targetAmount - currentAmount)) {
            Alert.alert('Error', 'Amount exceeds remaining balance');
            return;
        }

        try {
            // Find my contributor record
            const myContrib = contributors.find(c => c.user_id === user.id);

            if (myContrib) {
                // Update existing contribution
                const { error: updateError } = await supabase
                    .from('split_contributors')
                    .update({
                        amount: myContrib.amount + amount,
                        paid: true,
                        paid_at: new Date().toISOString(),
                    })
                    .eq('id', myContrib.id);

                if (updateError) throw updateError;
            } else {
                // Create new contribution
                const { error: insertError } = await supabase
                    .from('split_contributors')
                    .insert({
                        split_payment_id: splitPayId,
                        user_id: user.id,
                        amount: amount,
                        paid: true,
                        paid_at: new Date().toISOString(),
                    });

                if (insertError) throw insertError;
            }

            // Update total amount
            const { error: updateSplitError } = await supabase
                .from('split_payments')
                .update({
                    current_amount: currentAmount + amount,
                })
                .eq('id', splitPayId);

            if (updateSplitError) throw updateSplitError;

            setMyContribution('');
            loadSplitPayData();
            Alert.alert('Success', 'Contribution added!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleShareLink = async () => {
        if (!splitPayId) return;

        const shareUrl = `wishhive://split-pay/${splitPayId}`;
        try {
            await Share.share({
                message: `Join me in buying "${productTitle}"! Contribute here: ${shareUrl}`,
            });
        } catch (error: any) {
            console.error('Error sharing:', error);
        }
    };

    const progressPercentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
    const remainingAmount = targetAmount - currentAmount;

    const renderContributor = ({ item }: { item: Contributor }) => (
        <View style={styles.contributorItem}>
            <View style={styles.contributorInfo}>
                <View style={styles.contributorAvatar}>
                    <Users size={16} color={COLORS.primary} />
                </View>
                <View style={styles.contributorDetails}>
                    <Text style={styles.contributorName}>{item.username}</Text>
                    <Text style={styles.contributorAmount}>
                        ${item.amount.toFixed(2)}
                    </Text>
                </View>
            </View>
            {item.paid && (
                <View style={styles.paidBadge}>
                    <CheckCircle size={16} color={COLORS.success} />
                    <Text style={styles.paidText}>Paid</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Split Payment',
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
                    <Text style={styles.productPrice}>${productPrice.toFixed(2)}</Text>
                </Card>

                {splitPayId ? (
                    <>
                        {/* Progress */}
                        <Card style={styles.progressCard}>
                            <View style={styles.progressHeader}>
                                <Text style={styles.progressLabel}>Total Collected</Text>
                                <Text style={styles.progressAmount}>
                                    ${currentAmount.toFixed(2)} / ${targetAmount.toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.progressBarContainer}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        { width: `${Math.min(progressPercentage, 100)}%` },
                                    ]}
                                />
                            </View>
                            <Text style={styles.remainingText}>
                                ${remainingAmount.toFixed(2)} remaining
                            </Text>
                        </Card>

                        {/* My Contribution */}
                        <Card style={styles.contributeCard}>
                            <Text style={styles.sectionTitle}>Your Contribution</Text>
                            <Input
                                placeholder="Enter amount"
                                value={myContribution}
                                onChangeText={setMyContribution}
                                keyboardType="decimal-pad"
                            />
                            <Button
                                title="Contribute"
                                onPress={handleContribute}
                                disabled={!myContribution || parseFloat(myContribution) <= 0}
                            />
                        </Card>

                        {/* Invite Contributors */}
                        <Card style={styles.inviteCard}>
                            <View style={styles.inviteHeader}>
                                <UserPlus size={20} color={COLORS.primary} />
                                <Text style={styles.sectionTitle}>Invite Contributors</Text>
                            </View>
                            <Input
                                placeholder="Enter email address"
                                value={inviteEmail}
                                onChangeText={setInviteEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <View style={styles.inviteActions}>
                                <Button
                                    title="Send Invitation"
                                    onPress={handleInviteContributor}
                                    disabled={!inviteEmail.trim()}
                                    style={styles.inviteButton}
                                />
                                <TouchableOpacity
                                    onPress={handleShareLink}
                                    style={styles.shareButton}
                                >
                                    <Share2 size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        </Card>

                        {/* Contributors List */}
                        <Card style={styles.contributorsCard}>
                            <Text style={styles.sectionTitle}>
                                Contributors ({contributors.length})
                            </Text>
                            <FlatList
                                data={contributors}
                                renderItem={renderContributor}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>
                                        No contributors yet. Invite friends to join!
                                    </Text>
                                }
                            />
                        </Card>
                    </>
                ) : (
                    <Card style={styles.createCard}>
                        <DollarSign size={48} color={COLORS.primary} />
                        <Text style={styles.createTitle}>Start Split Payment</Text>
                        <Text style={styles.createDescription}>
                            Create a split payment to share the cost with friends
                        </Text>
                        <Button
                            title="Create Split Payment"
                            onPress={handleCreateSplitPay}
                            style={styles.createButton}
                        />
                    </Card>
                )}
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
    },
    progressCard: {
        marginBottom: SPACING.md,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    progressLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    progressAmount: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
    },
    progressBarContainer: {
        height: 12,
        backgroundColor: COLORS.backgroundSecondary,
        borderRadius: BORDER_RADIUS.sm,
        overflow: 'hidden',
        marginBottom: SPACING.sm,
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.success,
    },
    remainingText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    contributeCard: {
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    inviteCard: {
        marginBottom: SPACING.md,
    },
    inviteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    inviteActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    inviteButton: {
        flex: 1,
    },
    shareButton: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: COLORS.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contributorsCard: {
        marginBottom: SPACING.md,
    },
    contributorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    contributorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    contributorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    contributorDetails: {
        flex: 1,
    },
    contributorName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
    contributorAmount: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.success,
        fontWeight: '500',
    },
    paidBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        backgroundColor: COLORS.success + '20',
        borderRadius: BORDER_RADIUS.sm,
    },
    paidText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.success,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontSize: FONT_SIZES.sm,
        paddingVertical: SPACING.lg,
    },
    createCard: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
    },
    createTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginTop: SPACING.md,
        marginBottom: SPACING.xs,
    },
    createDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    createButton: {
        minWidth: 200,
    },
});
