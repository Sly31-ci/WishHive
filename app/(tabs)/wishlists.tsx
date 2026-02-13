import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Calendar, Eye, Trash2 } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import { WishlistCard } from '@/components/WishlistCard';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { AnonymousInteraction } from '@/components/AnonymousInteraction';
import * as Haptics from 'expo-haptics';
import { theme } from '@/theme';
import { H1, H2, Body, Caption } from '@/components/Text';
import Icon from '@/components/Icon';
import Colors from '@/theme/colors';
import { Database } from '@/types/database';
import { useTheme } from '@/contexts/ThemeContext';
import { WishlistListSkeleton } from '@/components/skeletons/WishlistCardSkeleton';
import { analytics } from '@/lib/analytics';
import { cache } from '@/lib/cache';

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

type Wishlist = Database['public']['Tables']['wishlists']['Row'];

export default function WishlistsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, hasMore: true, loadingMore: false });
  const PAGE_SIZE = 10;
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [wishlistToDelete, setWishlistToDelete] = useState<string | null>(null);
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);

  useEffect(() => {
    loadCachedWishlists();
    loadWishlists(true);
  }, [user]);

  const loadCachedWishlists = async () => {
    if (!user) return;
    const cachedData = await cache.get<Wishlist[]>(`wishlists_${user.id}`);
    if (cachedData && cachedData.length > 0) {
      // Deduplicate cache data
      const unique = Array.from(new Map(cachedData.map(item => [item.id, item])).values());
      setWishlists(unique);
      setLoading(false);
    }
  };

  const loadWishlists = async (isRefresh = false) => {
    if (!user) return;

    if (isRefresh) {
      setRefreshing(true);
    } else if (pagination.page === 0) {
      setLoading(true);
    } else {
      setPagination(prev => ({ ...prev, loadingMore: true }));
    }

    try {
      const start = isRefresh ? 0 : pagination.page * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          items:wishlist_items(id, is_purchased),
          interactions:wishlist_interactions(id, interaction_type, content, author_id)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;

      // Transform data to include stats
      const newWishlists = (data || []).map(w => {
        const items = (w as any).items || [];
        const interactions = (w as any).interactions || [];
        const reactions = interactions.filter((i: any) => i.interaction_type === 'reaction');

        const reactions_summary = reactions.reduce((acc: any, curr: any) => {
          acc[curr.content] = (acc[curr.content] || 0) + 1;
          return acc;
        }, {});

        const currentUserReaction = reactions.find((r: any) => r.author_id === user?.id)?.content || null;

        return {
          ...w,
          total_items: items.length,
          purchased_items: items.filter((i: any) => i.is_purchased).length,
          reactions_summary,
          currentUserReaction
        };
      });

      if (isRefresh) {
        setWishlists(newWishlists);
        setPagination({
          page: 1,
          hasMore: newWishlists.length === PAGE_SIZE,
          loadingMore: false
        });

        // Update cache with fresh data
        if (user && newWishlists.length > 0) {
          cache.set(`wishlists_${user.id}`, newWishlists);
        }
      } else {
        setWishlists(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNew = newWishlists.filter(item => !existingIds.has(item.id));
          const updated = [...prev, ...uniqueNew];

          // Update cache with merged data
          if (user && updated.length > 0) {
            cache.set(`wishlists_${user.id}`, updated);
          }

          return updated;
        });

        setPagination(prev => ({
          page: prev.page + 1,
          hasMore: newWishlists.length === PAGE_SIZE,
          loadingMore: false
        }));
      }
    } catch (error) {
      console.error('Error loading wishlists:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setPagination(prev => ({ ...prev, loadingMore: false }));
    }
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
          author_id: user?.id || null,
        });

      if (error) throw error;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Succès', 'Votre réaction a été envoyée ! ✨');
      loadWishlists(true);
    } catch (error) {
      console.error('Error sending reaction:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer la réaction.');
    } finally {
      setReactionModalVisible(false);
    }
  };

  const onRefresh = () => {
    loadWishlists(true);
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !pagination.loadingMore && !loading && !refreshing) {
      loadWishlists();
    }
  };

  const confirmDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWishlistToDelete(id);
    setDeleteDialogVisible(true);
  };

  const handleDeleteWishlist = async () => {
    if (!wishlistToDelete) return;

    try {
      // 1. Delete all items in wishlist (cascade should handle this typically, but manual for safety/clarity)
      const { error: itemsError } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('wishlist_id', wishlistToDelete);

      if (itemsError) throw itemsError;

      // 2. Delete the wishlist
      const { error: wishlistError } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistToDelete);

      if (wishlistError) throw wishlistError;

      // 3. Success Feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // 4. Update local state
      setWishlists(prev => prev.filter(w => w.id !== wishlistToDelete));

      analytics.track('Wishlist Deleted', { wishlist_id: wishlistToDelete });

    } catch (error) {
      console.error('Error deleting wishlist:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setDeleteDialogVisible(false);
      setWishlistToDelete(null);
    }
  };

  const renderWishlistCard = ({ item }: { item: Wishlist }) => (
    <WishlistCard
      wishlist={item}
      onPress={() => router.push(`/wishlists/${item.id}`)}
      onLongPress={() => confirmDelete(item.id)}
      onDelete={() => confirmDelete(item.id)}
      showDelete={true}
      onReact={() => handleReaction(item.id)}
      currentUserReaction={(item as any).currentUserReaction}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#7F5BFF" translucent={false} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wishlists</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/wishlists/create')}
          >
            <Plus size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <WishlistListSkeleton count={3} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#7F5BFF" translucent={false} />
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
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            pagination.loadingMore ? (
              <ActivityIndicator style={{ marginVertical: 20 }} color={COLORS.primary} />
            ) : null
          }
        />
      )}

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Supprimer cette wishlist ?"
        message="Cette action est irréversible. Tous les items de cette wishlist seront définitivement supprimés. 😢"
        confirmText="Oui, supprimer"
        cancelText="Non, garder"
        type="danger"
        emoji="🗑️"
        onConfirm={handleDeleteWishlist}
        onCancel={() => setDeleteDialogVisible(false)}
      />

      <AnonymousInteraction
        visible={reactionModalVisible}
        onClose={() => setReactionModalVisible(false)}
        onSubmit={handleReactionSubmit}
        initialType="reaction"
        hasReacted={!!wishlists.find(w => w.id === selectedWishlistId && (w as any).currentUserReaction)}
      />
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
    paddingTop: SPACING.xxl + 24, // Increased spacing to account for status bar and header height match
    backgroundColor: '#7F5BFF',
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: 'white',
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
  deleteIconButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
});
