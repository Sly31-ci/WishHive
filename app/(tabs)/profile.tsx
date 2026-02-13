/**
 * 👤 Profile Screen V2 - Refonte UX/UI
 * - Avatar 2x plus grand
 * - Stats inline
 * - Badges simplifiés (3 max)
 * - Menu épuré
 * - Animations fluides
 */

import { StatusBar } from 'expo-status-bar';
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
import { Plus, Calendar, Eye, Trash2, Camera, Settings, Store, Package, LogOut, ChevronRight, User as UserIcon, Heart, Sparkles, Trophy, TrendingUp, Award } from 'lucide-react-native';
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
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor="#7F5BFF" translucent={false} />

            {/* Header with improved height for overlap */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Floating Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <TouchableOpacity onPress={() => setShowAvatarPicker(true)}>
                            {profile?.avatar_url ? (
                                <Image
                                    source={{ uri: profile.avatar_url }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <UserIcon size={40} color={COLORS.white} />
                                </View>
                            )}
                            <View style={styles.editBadge}>
                                <Camera size={12} color={COLORS.white} />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.profileInfo}>
                            <Text style={styles.username}>@{profile?.username}</Text>
                            <Text style={styles.userEmail}>{user?.email}</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{profile?.points || 0}</Text>
                            <Text style={styles.statLabel}>Points</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{profile?.level || 1}</Text>
                            <Text style={styles.statLabel}>Level</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{badges.length}</Text>
                            <Text style={styles.statLabel}>Badges</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Groups */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>MY ACTIVITY</Text>
                    <View style={styles.menuCard}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/wishlists')}
                        >
                            <View style={styles.menuLeft}>
                                <View style={[styles.iconBox, { backgroundColor: '#FFF0F0' }]}>
                                    <Heart size={20} color={COLORS.primary} />
                                </View>
                                <Text style={styles.menuText}>My Wishlists</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/orders')}
                        >
                            <View style={styles.menuLeft}>
                                <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                                    <Package size={20} color={COLORS.info || '#00B0FF'} />
                                </View>
                                <Text style={styles.menuText}>My Orders</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>ACCOUNT</Text>
                    <View style={styles.menuCard}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/seller-dashboard')}
                        >
                            <View style={styles.menuLeft}>
                                <View style={[styles.iconBox, { backgroundColor: '#F0FFF4' }]}>
                                    <Store size={20} color={COLORS.success || '#00C853'} />
                                </View>
                                <Text style={styles.menuText}>Seller Dashboard</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => router.push('/settings')}
                        >
                            <View style={styles.menuLeft}>
                                <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
                                    <Settings size={20} color={COLORS.dark} />
                                </View>
                                <Text style={styles.menuText}>Settings</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.gray[400]} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                >
                    <LogOut size={20} color={COLORS.error} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>

            <SimpleAvatarPicker
                visible={showAvatarPicker}
                currentAvatarUrl={profile?.avatar_url}
                onClose={() => setShowAvatarPicker(false)}
                onSelect={handleAvatarUpdate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background || '#F7F8FA', // Slightly gray background for card contrast
    },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xxl + 24,
        paddingBottom: 60, // Extra space for overlap
        backgroundColor: '#7F5BFF',
    },
    headerTitle: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: 'white',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginTop: -40, // Overlap header
        marginBottom: SPACING.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
    },
    avatarPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        padding: 6,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    profileInfo: {
        marginLeft: SPACING.md,
        flex: 1,
    },
    username: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
    },
    userEmail: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[500],
        marginTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[100],
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
    },
    statLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
        textTransform: 'uppercase',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: COLORS.gray[200],
    },
    sectionContainer: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
        color: COLORS.gray[500],
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
        letterSpacing: 1,
    },
    menuCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        backgroundColor: COLORS.white,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.dark,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.gray[50],
        marginLeft: 56, // Align with text
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
        marginTop: SPACING.sm,
    },
    signOutText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.error,
        fontWeight: '600',
    },
});
