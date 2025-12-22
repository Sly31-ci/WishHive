import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Trophy, User, TrendingUp } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function LeaderboardScreen() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('points', { ascending: false })
                .limit(20);

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadLeaderboard();
    };

    const renderItem = ({ item, index }: { item: Profile; index: number }) => {
        let rankColor = COLORS.gray[500];
        let rankIcon = null;

        if (index === 0) {
            rankColor = '#FFD700'; // Gold
            rankIcon = <Trophy size={20} color={rankColor} fill={rankColor} />;
        } else if (index === 1) {
            rankColor = '#C0C0C0'; // Silver
            rankIcon = <Trophy size={20} color={rankColor} fill={rankColor} />;
        } else if (index === 2) {
            rankColor = '#CD7F32'; // Bronze
            rankIcon = <Trophy size={20} color={rankColor} fill={rankColor} />;
        }

        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => router.push(`/user/${item.id}`)}
            >
                <View style={styles.rankContainer}>
                    {rankIcon || <Text style={styles.rankText}>{index + 1}</Text>}
                </View>

                <View style={styles.avatarContainer}>
                    {item.avatar_url ? (
                        <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                    ) : (
                        <View style={styles.placeholderAvatar}>
                            <User size={20} color={COLORS.white} />
                        </View>
                    )}
                </View>

                <View style={styles.userInfo}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.level}>Level {item.level}</Text>
                </View>

                <View style={styles.pointsContainer}>
                    <TrendingUp size={16} color={COLORS.primary} />
                    <Text style={styles.points}>{item.points}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Leaderboard',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.container}>
                <View style={styles.header}>
                    <Trophy size={48} color={COLORS.primary} />
                    <Text style={styles.title}>Top Wishers</Text>
                    <Text style={styles.subtitle}>
                        Earn points by creating wishlists and granting wishes!
                    </Text>
                </View>

                {loading ? (
                    <View style={styles.centerContainer}>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={users}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={COLORS.primary}
                                colors={[COLORS.primary]}
                            />
                        }
                    />
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
    header: {
        alignItems: 'center',
        padding: SPACING.xl,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginTop: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        textAlign: 'center',
        marginTop: SPACING.xs,
    },
    list: {
        padding: SPACING.md,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.sm,
    },
    rankContainer: {
        width: 30,
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    rankText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.gray[500],
    },
    avatarContainer: {
        marginRight: SPACING.md,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    placeholderAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
    level: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    points: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        color: COLORS.primary,
    },
});
