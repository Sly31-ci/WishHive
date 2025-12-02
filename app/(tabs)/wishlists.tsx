import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Calendar, Eye } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type Wishlist = Database['public']['Tables']['wishlists']['Row'];

export default function WishlistsScreen() {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWishlists();
  }, [user]);

  const loadWishlists = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishlists(data || []);
    } catch (error) {
      console.error('Error loading wishlists:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWishlists();
  };

  const renderWishlistCard = ({ item }: { item: Wishlist }) => (
    <TouchableOpacity
      onPress={() => router.push(`/wishlist/${item.id}`)}
      activeOpacity={0.7}
    >
      <Card style={styles.wishlistCard}>
        <View style={styles.cardHeader}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{item.type}</Text>
          </View>
          <View style={styles.privacyBadge}>
            <Text style={styles.privacyText}>{item.privacy}</Text>
          </View>
        </View>

        <Text style={styles.wishlistTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {item.description && (
          <Text style={styles.wishlistDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.cardFooter}>
          {item.due_date && (
            <View style={styles.infoItem}>
              <Calendar size={14} color={COLORS.gray[500]} />
              <Text style={styles.infoText}>
                {new Date(item.due_date).toLocaleDateString()}
              </Text>
            </View>
          )}
          <View style={styles.infoItem}>
            <Eye size={14} color={COLORS.gray[500]} />
            <Text style={styles.infoText}>{item.view_count} views</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading your wishlists...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlists</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/wishlists/create')}
        >
          <Plus size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {wishlists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No wishlists yet</Text>
          <Text style={styles.emptyText}>
            Create your first wishlist to start sharing your wishes with friends
            and family!
          </Text>
          <Button
            title="Create Wishlist"
            onPress={() => router.push('/wishlists/create')}
            icon={<Plus size={20} color={COLORS.white} />}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={wishlists}
          renderItem={renderWishlistCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.dark,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  wishlistCard: {
    marginBottom: SPACING.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'capitalize',
  },
  privacyBadge: {
    backgroundColor: COLORS.gray[200],
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  privacyText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.gray[600],
    textTransform: 'capitalize',
  },
  wishlistTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  wishlistDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginBottom: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyButton: {
    marginTop: SPACING.md,
  },
});
