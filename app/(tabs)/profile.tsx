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
  User as UserIcon,
  Crown,
  Package,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type Badge = Database['public']['Tables']['badges']['Row'];
type UserBadge = Database['public']['Tables']['user_badges']['Row'] & {
  badges: Badge;
};

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

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
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(data as UserBadge[] || []);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
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

  const tierColors = {
    bronze: COLORS.accent,
    silver: COLORS.gray[400],
    gold: '#FFD700',
    platinum: COLORS.primary,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <UserIcon size={48} color={COLORS.white} />
            </View>
          )}
        </View>

        <Text style={styles.username}>@{profile?.username}</Text>
        {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <TrendingUp size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{profile?.points || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>

          <View style={styles.statItem}>
            <Crown size={20} color={COLORS.accent} />
            <Text style={styles.statValue}>Level {profile?.level || 1}</Text>
            <Text style={styles.statLabel}>Your Level</Text>
          </View>

          <View style={styles.statItem}>
            <Award size={20} color={COLORS.secondary} />
            <Text style={styles.statValue}>{badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading badges...</Text>
          ) : badges.length > 0 ? (
            <View style={styles.badgesGrid}>
              {badges.map((userBadge) => (
                <View key={userBadge.id} style={styles.badgeCard}>
                  <View
                    style={[
                      styles.badgeIcon,
                      {
                        backgroundColor:
                          tierColors[userBadge.badges.tier] + '20',
                      },
                    ]}
                  >
                    <Award
                      size={24}
                      color={tierColors[userBadge.badges.tier]}
                    />
                  </View>
                  <Text style={styles.badgeName} numberOfLines={1}>
                    {userBadge.badges.name}
                  </Text>
                  <Text style={styles.badgeTier}>{userBadge.badges.tier}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              No badges yet. Complete actions to earn your first badge!
            </Text>
          )}
        </Card>

        <Card style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/settings')}
          >
            <Settings size={20} color={COLORS.dark} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/seller-dashboard')}
          >
            <TrendingUp size={20} color={COLORS.dark} />
            <Text style={styles.menuText}>Seller Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/orders')}
          >
            <Package size={20} color={COLORS.dark} />
            <Text style={styles.menuText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <LogOut size={20} color={COLORS.error} />
            <Text style={[styles.menuText, styles.menuTextDanger]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
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
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
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
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.full,
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
    marginBottom: SPACING.md,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginTop: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    gap: SPACING.xs,
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
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.dark,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  badgeCard: {
    width: '30%',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  badgeIcon: {
    width: 56,
    height: 56,
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
  badgeTier: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    textTransform: 'capitalize',
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.gray[500],
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.gray[500],
    fontSize: FONT_SIZES.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  menuText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
    fontWeight: '600',
  },
  menuTextDanger: {
    color: COLORS.error,
  },
});
