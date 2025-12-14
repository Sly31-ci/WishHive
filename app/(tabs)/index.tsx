import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, TrendingUp, Gift, Sparkles, Search, Bell, Trophy } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type Wishlist = Database['public']['Tables']['wishlists']['Row'];

export default function HomeScreen() {
  const { profile } = useAuth();
  const [trendingWishlists, setTrendingWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingWishlists();
  }, []);

  const loadTrendingWishlists = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('privacy', 'public')
        .eq('is_active', true)
        .order('view_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTrendingWishlists(data || []);
    } catch (error) {
      console.error('Error loading trending wishlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWishlistCard = ({ item }: { item: Wishlist }) => (
    <TouchableOpacity
      style={styles.trendingCard}
      onPress={() => router.push(`/wishlists/${item.id}`)}
    >
      <View style={styles.trendingCardHeader}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{item.type}</Text>
        </View>
      </View>
      <Text style={styles.trendingTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.trendingViews}>{item.view_count} views</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <View>
          <Text style={styles.greeting}>Hello, {profile?.username}!</Text>
          <Text style={styles.subtitle}>What wishes will you make today?</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Search size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Bell size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <View style={styles.pointsBadge}>
            <Sparkles size={16} color={COLORS.accent} />
            <Text style={styles.pointsText}>{profile?.points || 0}</Text>
          </View>
        </View>

      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/wishlists/create')}
            >
              <View style={styles.actionIcon}>
                <Plus size={24} color={COLORS.white} />
              </View>
              <Text style={styles.actionText}>Create Wishlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/marketplace')}
            >
              <View style={[styles.actionIcon, styles.actionIconSecondary]}>
                <Gift size={24} color={COLORS.white} />
              </View>
              <Text style={styles.actionText}>Browse Gifts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/leaderboard')}
            >
              <View style={[styles.actionIcon, styles.actionIconTertiary]}>
                <Trophy size={24} color={COLORS.white} />
              </View>
              <Text style={styles.actionText}>Leaderboard</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Trending Wishlists</Text>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : trendingWishlists.length > 0 ? (
            <FlatList
              data={trendingWishlists}
              renderItem={renderWishlistCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingList}
            />
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No trending wishlists yet. Be the first to create one!
              </Text>
              <Button
                title="Create Wishlist"
                onPress={() => router.push('/wishlists/create')}
                size="sm"
                style={styles.emptyButton}
              />
            </Card>
          )}
        </View>

        <View style={styles.levelCard}>
          <Text style={styles.levelTitle}>Level {profile?.level || 1}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((profile?.points || 0) % 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.levelText}>
            {100 - ((profile?.points || 0) % 100)} points to next level
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  greeting: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.dark,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginTop: SPACING.xs,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  pointsText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.accent,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  quickActions: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconSecondary: {
    backgroundColor: COLORS.secondary,
  },
  actionIconTertiary: {
    backgroundColor: COLORS.accent,
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'center',
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
  trendingList: {
    gap: SPACING.md,
  },
  trendingCard: {
    width: 200,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  trendingCardHeader: {
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'capitalize',
  },
  trendingTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  trendingViews: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.gray[500],
    padding: SPACING.lg,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  emptyButton: {
    marginTop: SPACING.sm,
  },
  levelCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  levelTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  levelText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
});
