import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Bell, TrendingUp, Sparkles, Plus } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from '@/constants/theme';
import { Database } from '@/types/database';

type Wishlist = Database['public']['Tables']['wishlists']['Row'];

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { profile } = useAuth();
  const [trendingWishlists, setTrendingWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
        .limit(6); // Réduit de 10 à 6 pour moins de surcharge

      if (error) throw error;
      setTrendingWishlists(data || []);
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
          <Text style={styles.greeting}>Hi, {profile?.username}! 👋</Text>
          <Text style={styles.subtitle}>What wishes will you make today?</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          style={styles.notificationButton}
        >
          <Bell size={24} color={COLORS.dark} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
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
              icon={<Plus size={28} color="#FFFFFF" />}
              iconPosition="left"
            />
            <Text style={styles.heroHint}>
              Start your first wishlist in seconds ✨
            </Text>
          </View>
        </Animated.View>

        {/* Level Progress - Inline & Minimaliste */}
        <Animated.View entering={FadeIn.delay(200)}>
          <View style={styles.levelSection}>
            <View style={styles.levelHeader}>
              <View style={styles.levelInfo}>
                <Sparkles size={18} color={COLORS.primary} />
                <Text style={styles.levelText}>
                  Level {profile?.level || 1} • {profile?.points || 0} pts
                </Text>
              </View>
              <Text style={styles.levelProgress}>
                {pointsToNextLevel} to next
              </Text>
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
              <TrendingUp size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Trending Now</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : trendingWishlists.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.trendingList}
              >
                {trendingWishlists.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    entering={FadeInDown.delay(400 + index * 50).springify()}
                  >
                    <Card
                      onPress={() => router.push(`/wishlists/${item.id}`)}
                      style={styles.trendingCard}
                      padding="md"
                    >
                      {/* Image placeholder */}
                      <View style={styles.trendingImage}>
                        <Text style={styles.trendingEmoji}>
                          {item.type === 'birthday' ? '🎂' :
                            item.type === 'wedding' ? '💒' :
                              item.type === 'baby' ? '👶' :
                                item.type === 'holiday' ? '🎄' : '🎁'}
                        </Text>
                      </View>
                      <Text style={styles.trendingTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.trendingViews}>
                        {item.view_count} views
                      </Text>
                    </Card>
                  </Animated.View>
                ))}
              </ScrollView>
            ) : (
              <Card style={styles.emptyCard} padding="xl">
                <Text style={styles.emptyText}>
                  No trending wishlists yet.{'\n'}Be the first to create one! 🚀
                </Text>
              </Card>
            )}
          </View>
        </Animated.View>
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
  trendingList: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  trendingCard: {
    width: width * 0.42, // ~40% de la largeur d'écran
    minWidth: 160,
  },
  trendingImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  trendingEmoji: {
    fontSize: 48,
  },
  trendingTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  trendingViews: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
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
