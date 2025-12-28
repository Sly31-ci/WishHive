import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Bell, TrendingUp, Sparkles, Heart, MessageSquare } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getUnreadCount } from '@/lib/notifications';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { WishlistCard } from '@/components/WishlistCard';
import { EmptyState } from '@/components/EmptyState';
import { AnonymousInteraction } from '@/components/AnonymousInteraction';
import { theme } from '@/theme';
import { Text as DSText, H1, H2, H3, Body, Caption } from '@/components/Text';
import Icon from '@/components/Icon';
import { Database } from '@/types/database';
import Colors from '@/theme/colors';

// Backward compatibility aliases
const COLORS = {
  ...Colors.light,
  white: Colors.brand.pureWhite,
  gray: Colors.gray,
  dark: Colors.light.textPrimary,
};
const SPACING = theme.spacing;
const FONT_SIZES = theme.typography.sizes;
const BORDER_RADIUS = theme.borderRadius;
const SHADOWS = theme.shadows;

type Wishlist = Database['public']['Tables']['wishlists']['Row'];

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { profile } = useAuth();
  const [trendingWishlists, setTrendingWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);

  useEffect(() => {
    loadTrendingWishlists();
    loadUnreadCount();

    if (profile?.id) {
      const channel = supabase
        .channel(`home_notifications_${profile.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${profile.id}`,
          },
          () => {
            setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile?.id]);

  const loadUnreadCount = async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
  };

  const handleReaction = (wishlistId: string) => {
    setSelectedWishlistId(wishlistId);
    setReactionModalVisible(true);
  };

  const handleReactionSubmit = async (data: { type: 'reaction' | 'comment'; content: string; authorName: string }) => {
    if (!selectedWishlistId) return;

    try {
      const { error } = await supabase
        .from('wishlist_interactions')
        .insert({
          wishlist_id: selectedWishlistId,
          interaction_type: data.type,
          content: data.content,
          author_name: data.authorName,
          author_id: profile?.id || null,
        });

      if (error) throw error;
      Alert.alert('Success', 'Your reaction has been sent! ✨');
      loadTrendingWishlists(); // Optionally refresh to see count update if implemented
    } catch (error) {
      console.error('Error sending reaction:', error);
      Alert.alert('Error', 'Failed to send reaction.');
    } finally {
      setReactionModalVisible(false);
    }
  };

  const loadTrendingWishlists = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          items:wishlist_items(id, is_purchased),
          interactions:wishlist_interactions(id, interaction_type, content, author_id)
        `)
        .eq('privacy', 'public')
        .eq('is_active', true)
        .order('view_count', { ascending: false })
        .limit(6);

      if (error) throw error;

      // Transform data to include stats
      const wishlistsWithStats = (data || []).map(w => {
        const items = (w as any).items || [];
        const interactions = (w as any).interactions || [];
        const reactions = interactions.filter((i: any) => i.interaction_type === 'reaction');

        const reactions_summary = reactions.reduce((acc: any, curr: any) => {
          acc[curr.content] = (acc[curr.content] || 0) + 1;
          return acc;
        }, {});

        const currentUserReaction = reactions.find((r: any) => r.author_id === profile?.id)?.content || null;

        return {
          ...w,
          total_items: items.length,
          purchased_items: items.filter((i: any) => i.is_purchased).length,
          reactions_summary,
          currentUserReaction
        };
      });

      setTrendingWishlists(wishlistsWithStats);
    } catch (error) {
      console.error('Error loading trending wishlists:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTrendingWishlists();
  };

  // Calcul de la progression pour level
  const currentLevelProgress = ((profile?.points || 0) % 100);
  const pointsToNextLevel = 100 - currentLevelProgress;

  return (
    <View style={styles.container}>
      {/* Header Simplifié - 2 éléments max */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <H2 color="primary">Hi, {profile?.username}! 👋</H2>
          <Body color="secondary">What wishes will you make today?</Body>
        </View>
        <TouchableOpacity
          onPress={() => {
            router.push('/notifications');
            setUnreadCount(0); // Arbitrarily clear for UX until refetch
          }}
          style={styles.notificationButton}
        >
          <Icon name="Bell" size="md" variant="default" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brand.honeyGlow}
            colors={[theme.colors.brand.honeyGlow]}
          />
        }
      >
        {/* CTA Principal UNIQUE - Style Hero */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.heroSection}>
            <Button
              title="Create Wishlist"
              onPress={() => router.push('/wishlists/create')}
              size="hero"
              fullWidth
              iconPosition="left"
            />
            <Caption color="secondary" centered>
              Start your first wishlist in seconds ✨
            </Caption>
          </View>
        </Animated.View>

        {/* Level Progress - Inline & Minimaliste */}
        <Animated.View entering={FadeIn.delay(200)}>
          <View style={styles.levelSection}>
            <View style={styles.levelHeader}>
              <View style={styles.levelInfo}>
                <Icon name="Sparkles" size="sm" variant="active" />
                <Body color="secondary">
                  Level {profile?.level || 1} • {profile?.points || 0} pts
                </Body>
              </View>
              <Caption color="tertiary">
                {pointsToNextLevel} to next
              </Caption>
            </View>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: `${currentLevelProgress}%` },
                ]}
                entering={FadeIn.delay(300).duration(800)}
              />
            </View>
          </View>
        </Animated.View>

        {/* Trending Section - Ultra Simplifié */}
        <Animated.View entering={FadeIn.delay(300)}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="TrendingUp" size="sm" variant="active" />
              <H3 color="primary">Trending Now</H3>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : trendingWishlists.length === 0 ? (
              <EmptyState
                emoji="✨"
                title="No wishlists yet"
                description="Create your first wishlist and start adding items you love"
                actionLabel="Create Wishlist"
                onAction={() => router.push('/wishlists/create')}
              />
            ) : (
              <Animated.View
                style={styles.trendingListVertical}
                entering={FadeIn.delay(300)}
              >
                {trendingWishlists.map((wishlist, index) => (
                  <Animated.View
                    key={wishlist.id}
                    entering={FadeInDown.delay(index * 100).springify()}
                  >
                    <WishlistCard
                      wishlist={wishlist}
                      onPress={() => router.push(`/wishlists/${wishlist.id}`)}
                      onReact={() => handleReaction(wishlist.id)}
                      currentUserReaction={(wishlist as any).currentUserReaction}
                    />
                  </Animated.View>
                ))}
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      <AnonymousInteraction
        visible={reactionModalVisible}
        onClose={() => setReactionModalVisible(false)}
        onSubmit={handleReactionSubmit}
        initialType="reaction"
        hasReacted={!!trendingWishlists.find(w => w.id === selectedWishlistId && (w as any).currentUserReaction)}
      />
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
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    lineHeight: 20,
  },
  notificationButton: {
    position: 'relative',
    padding: SPACING.sm,
    marginLeft: SPACING.md,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  heroHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  levelSection: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.xs,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  levelText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.dark,
  },
  levelProgress: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.dark,
  },
  trendingListVertical: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.sm,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  loadingContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.gray[500],
    fontSize: FONT_SIZES.sm,
  },
  emptyCard: {
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
});
