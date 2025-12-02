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
import { ArrowLeft, User as UserIcon, Award, TrendingUp } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Wishlist = Database['public']['Tables']['wishlists']['Row'];
type Badge = Database['public']['Tables']['badges']['Row'];
type UserBadge = Database['public']['Tables']['user_badges']['Row'] & {
    badges: Badge;
};

export default function PublicProfileScreen() {
    const { id } = useLocalSearchParams();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);
    const [badges, setBadges] = useState<UserBadge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadProfile();
        }
    }, [id]);

    const loadProfile = async () => {
        try {
            // Load profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (profileError) throw profileError;
            setProfile(profileData);

            // Load public wishlists
            const { data: wishlistsData } = await supabase
                .from('wishlists')
                .select('*')
                .eq('owner_id', id)
                .eq('privacy', 'public')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            setWishlists(wishlistsData || []);

            // Load badges
            const { data: badgesData } = await supabase
                .from('user_badges')
                .select('*, badges(*)')
                .eq('user_id', id)
                .order('earned_at', { ascending: false });

            setBadges(badgesData as UserBadge[] || []);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderWishlist = ({ item }: { item: Wishlist }) => (
        <TouchableOpacity
            style={styles.wishlistCard}
            onPress={() => router.push(`/wishlist/${item.id}`)}
        >
            <View style={styles.wishlistHeader}>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.type}</Text>
                </View>
            </View>
            <Text style={styles.wishlistTitle} numberOfLines={2}>
                {item.title}
            </Text>
            <Text style={styles.wishlistViews}>{item.view_count} views</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.centerContainer}>
                <Text>User not found</Text>
            </View>
        );
    }

    const tierColors = {
        bronze: COLORS.accent,
        silver: COLORS.gray[400],
        gold: '#FFD700',
        platinum: COLORS.primary,
    };

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
                    <View style={styles.avatarContainer}>
                        {profile.avatar_url ? (
                            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
                        ) : (
                            <View style={styles.placeholderAvatar}>
                                <UserIcon size={48} color={COLORS.white} />
                            </View>
                        )}
                    </View>

                    <Text style={styles.username}>@{profile.username}</Text>
                    {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <TrendingUp size={20} color={COLORS.primary} />
                            <Text style={styles.statValue}>{profile.points}</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Award size={20} color={COLORS.accent} />
                            <Text style={styles.statValue}>{badges.length}</Text>
                            <Text style={styles.statLabel}>Badges</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    {badges.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Badges</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesList}>
                                {badges.map((badge) => (
                                    <View key={badge.id} style={styles.badgeItem}>
                                        <View style={[
                                            styles.badgeIcon,
                                            { backgroundColor: tierColors[badge.badges.tier] + '20' }
                                        ]}>
                                            <Award size={24} color={tierColors[badge.badges.tier]} />
                                        </View>
                                        <Text style={styles.badgeName}>{badge.badges.name}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Public Wishlists</Text>
                        {wishlists.length > 0 ? (
                            <FlatList
                                data={wishlists}
                                renderItem={renderWishlist}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.wishlistsList}
                            />
                        ) : (
                            <Text style={styles.emptyText}>No public wishlists</Text>
                        )}
                    </View>
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
        paddingTop: 100,
        paddingBottom: SPACING.lg,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    avatarContainer: {
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    placeholderAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    bio: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        textAlign: 'center',
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.md,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xl,
    },
    statItem: {
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
    },
    statLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: COLORS.gray[300],
    },
    content: {
        padding: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    badgesList: {
        flexDirection: 'row',
    },
    badgeItem: {
        alignItems: 'center',
        marginRight: SPACING.lg,
        width: 80,
    },
    badgeIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    badgeName: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.dark,
        textAlign: 'center',
    },
    wishlistsList: {
        gap: SPACING.md,
    },
    wishlistCard: {
        width: 200,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    wishlistHeader: {
        marginBottom: SPACING.sm,
    },
    typeBadge: {
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    typeText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.primary,
        textTransform: 'capitalize',
    },
    wishlistTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 4,
    },
    wishlistViews: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    emptyText: {
        color: COLORS.gray[500],
        fontStyle: 'italic',
    },
});
