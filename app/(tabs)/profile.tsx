/**
 * 👤 Profile Screen V2 - Refonte UX/UI
 * - Avatar 2x plus grand
 * - Stats inline
 * - Badges simplifiés (3 max)
 * - Menu épuré
 * - Animations fluides
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
    LogOut,
    Settings,
    Award,
    TrendingUp,
    Sparkles,
    User as UserIcon,
    Package,
    Camera,
    ChevronRight,
    Store,
} from 'lucide-react-native';
import { SvgUri } from 'react-native-svg';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { SimpleAvatarPicker } from '@/components/SimpleAvatarPicker';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { useTheme } from '@/contexts/ThemeContext';
import { theme } from '@/theme';
import { H1, H2, Body, Caption } from '@/components/Text';
import Icon from '@/components/Icon';
import Colors from '@/theme/colors';
import * as ImagePicker from 'expo-image-picker';
import { analytics } from '@/lib/analytics';
import { decode } from 'base64-arraybuffer';

// Backward compatibility
const COLORS = {
    ...Colors.light,
    white: Colors.brand.pureWhite,
    gray: Colors.gray,
    dark: Colors.light.textPrimary,
};
const SPACING = theme.spacing;
const FONT_SIZES = theme.typography.sizes;
const BORDER_RADIUS = theme.borderRadius;
import { Database } from '@/types/database';

type Badge = Database['public']['Tables']['badges']['Row'];
type UserBadge = Database['public']['Tables']['user_badges']['Row'] & {
    badges: Badge;
};

export default function ProfileScreen() {
    const { user, profile, signOut } = useAuth();
    const [badges, setBadges] = useState<UserBadge[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editUsername, setEditUsername] = useState('');
    const [editBio, setEditBio] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadBadges();
    }, [user]);

    const loadBadges = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_badges')
                .select('*, badges(*)')
                .eq('user_id', user.id)
                .order('earned_at', { ascending: false })
                .limit(3); // Limité à 3 badges pour simplicité

            if (error) throw error;
            setBadges(data as UserBadge[] || []);
        } catch (error) {
            console.error('Error loading badges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartEditing = () => {
        setEditUsername(profile?.username || '');
        setEditBio(profile?.bio || '');
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        if (!editUsername.trim()) {
            Alert.alert('Error', 'Username cannot be empty');
            return;
        }

        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: editUsername.trim(),
                    bio: editBio.trim() || null,
                })
                .eq('id', user.id);

            if (error) throw error;

            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully! ✨');
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to save profile changes');
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    router.replace('/(auth)/login');
                },
            },
        ]);
    };

    const handleAvatarUpdate = async (url: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: url })
                .eq('id', user?.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating avatar:', error);
            Alert.alert('Error', 'Failed to update avatar');
        }
    };

    const tierColors = {
        bronze: COLORS.accent,
        silver: COLORS.gray[400],
        gold: '#FFD700',
        platinum: COLORS.primary,
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header avec Avatar Géant */}
            <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={() => setShowAvatarPicker(true)}
                    activeOpacity={0.8}
                >
                    {profile?.avatar_url ? (
                        (profile.avatar_url as string).includes('dicebear.com') ? (
                            <View style={[styles.avatar, { overflow: 'hidden' }]}>
                                <SvgUri uri={profile.avatar_url as string} width="100%" height="100%" />
                            </View>
                        ) : (
                            <Image
                                source={{ uri: profile.avatar_url }}
                                style={styles.avatar}
                            />
                        )
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <UserIcon size={56} color={COLORS.white} />
                        </View>
                    )}
                    <View style={styles.editBadge}>
                        <Camera size={16} color={COLORS.white} />
                    </View>
                </TouchableOpacity>

                {isEditing ? (
                    <Animated.View entering={FadeIn.duration(200)} style={styles.editForm}>
                        <Input
                            label="Username"
                            value={editUsername}
                            onChangeText={setEditUsername}
                            placeholder="Your username"
                            containerStyle={styles.editInput}
                        />
                        <Input
                            label="Bio"
                            value={editBio}
                            onChangeText={setEditBio}
                            placeholder="Tell us about yourself..."
                            multiline
                            numberOfLines={2}
                            containerStyle={styles.editInput}
                        />
                        <View style={styles.editActions}>
                            <Button
                                title="Cancel"
                                onPress={() => setIsEditing(false)}
                                variant="ghost"
                                size="sm"
                            />
                            <Button
                                title="Save"
                                onPress={handleSaveProfile}
                                loading={saving}
                                size="sm"
                            />
                        </View>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.userInfo}>
                        <Text style={styles.username}>@{profile?.username}</Text>
                        {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
                        <TouchableOpacity onPress={handleStartEditing} style={styles.editProfileButton}>
                            <Text style={styles.editProfileText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {/* Stats Inline - Sur une seule ligne */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Sparkles size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.statValue}>{profile?.points || 0}</Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <TrendingUp size={20} color={COLORS.success} />
                        </View>
                        <Text style={styles.statValue}>Level {profile?.level || 1}</Text>
                        <Text style={styles.statLabel}>Current</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Award size={20} color={COLORS.accent} />
                        </View>
                        <Text style={styles.statValue}>{badges.length}</Text>
                        <Text style={styles.statLabel}>Badges</Text>
                    </View>
                </Animated.View>
            </Animated.View>

            <View style={styles.content}>
                {/* Badges Section - Ultra Simplifié (3 max, horizontal) */}
                {badges.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <Card style={styles.section} padding="lg">
                            <View style={styles.sectionHeader}>
                                <Award size={18} color={COLORS.primary} />
                                <Text style={styles.sectionTitle}>Latest Achievements</Text>
                            </View>

                            <View style={styles.badgesRow}>
                                {badges.map((userBadge, index) => (
                                    <Animated.View
                                        key={userBadge.id}
                                        entering={FadeInDown.delay(350 + index * 50).springify()}
                                        style={styles.badgeItem}
                                    >
                                        <View
                                            style={[
                                                styles.badgeIcon,
                                                {
                                                    backgroundColor: tierColors[userBadge.badges.tier] + '20',
                                                },
                                            ]}
                                        >
                                            <Award
                                                size={20}
                                                color={tierColors[userBadge.badges.tier]}
                                            />
                                        </View>
                                        <Text style={styles.badgeName} numberOfLines={1}>
                                            {userBadge.badges.name}
                                        </Text>
                                    </Animated.View>
                                ))}
                            </View>
                        </Card>
                    </Animated.View>
                )}

                {/* Menu simplifié */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    <Card style={styles.section} padding="md">
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/settings')}
                        >
                            <View style={styles.menuLeft}>
                                <Settings size={22} color={COLORS.dark} />
                                <Text style={styles.menuText}>Settings</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/seller-dashboard')}
                        >
                            <View style={styles.menuLeft}>
                                <Store size={22} color={COLORS.dark} />
                                <Text style={styles.menuText}>Seller Dashboard</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/orders')}
                        >
                            <View style={styles.menuLeft}>
                                <Package size={22} color={COLORS.dark} />
                                <Text style={styles.menuText}>My Orders</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuItem, styles.menuItemLast]}
                            onPress={handleSignOut}
                        >
                            <View style={styles.menuLeft}>
                                <LogOut size={22} color={COLORS.error} />
                                <Text style={[styles.menuText, styles.menuTextDanger]}>
                                    Sign Out
                                </Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>
                    </Card>
                </Animated.View>
            </View>

            <SimpleAvatarPicker
                visible={showAvatarPicker}
                currentAvatarUrl={profile?.avatar_url}
                onClose={() => setShowAvatarPicker(false)}
                onSelect={handleAvatarUpdate}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    header: {
        backgroundColor: COLORS.white,
        paddingTop: SPACING.xxl,
        paddingBottom: SPACING.xl,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    avatarContainer: {
        marginBottom: SPACING.lg,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: COLORS.primary,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        padding: 8,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    userInfo: {
        alignItems: 'center',
        width: '100%',
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
        marginBottom: SPACING.md,
        lineHeight: 22,
    },
    editProfileButton: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.gray[100],
        marginTop: SPACING.xs,
    },
    editProfileText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        fontWeight: '600',
    },
    editForm: {
        width: '100%',
    },
    editInput: {
        marginBottom: SPACING.md,
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.md,
        marginTop: SPACING.sm,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.lg,
        marginTop: SPACING.lg,
        paddingTop: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[100],
        width: '100%',
    },
    statItem: {
        alignItems: 'center',
        minWidth: 80,
    },
    statIconContainer: {
        marginBottom: SPACING.xs,
    },
    statValue: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.xxs,
    },
    statLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: COLORS.gray[200],
    },
    content: {
        padding: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
    badgesRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        flexWrap: 'wrap',
    },
    badgeItem: {
        alignItems: 'center',
        gap: SPACING.xs,
        flex: 1,
        minWidth: 80,
        maxWidth: 100,
    },
    badgeIcon: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeName: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.dark,
        textAlign: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[100],
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    menuText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.dark,
        fontWeight: '500',
    },
    menuTextDanger: {
        color: COLORS.error,
    },
});
