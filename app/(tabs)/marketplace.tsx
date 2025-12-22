import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Search, Store } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { FilterChip } from '@/components/FilterChip';
import { TrendingSection } from '@/components/TrendingSection';
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

export default function MarketplaceScreen() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]); // All products with stats
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // Filtered & Sorted
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price_asc' | 'price_desc' | 'trending'>('popular');

  useEffect(() => {
    loadProductsAndStats();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortBy, searchQuery]);

  const loadProductsAndStats = async () => {
    try {
      setLoading(true);
      // Fetch products AND their wishlist items to calculate popularity manually
      const { data, error } = await supabase
        .from('products')
        .select('*, wishlist_items(id, created_at)')
        .eq('is_active', true)
        .limit(100);

      if (error) throw error;

      // Calculate stats
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const productsWithStats = (data || []).map((p: any) => {
        const items = p.wishlist_items || [];
        const times_added = items.length;
        const recent_adds = items.filter((item: any) =>
          new Date(item.created_at) > sevenDaysAgo
        ).length;

        return {
          ...p,
          times_added,
          recent_adds,
        };
      });

      setProducts(productsWithStats);

      // Define trending: At least 1 recent add
      const trending = productsWithStats
        .filter((p: any) => p.recent_adds > 0)
        .sort((a: any, b: any) => b.recent_adds - a.recent_adds)
        .slice(0, 10);

      setTrendingProducts(trending);

    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProductsAndStats();
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'trending':
          return b.recent_adds - a.recent_adds;
        case 'popular':
        default:
          return b.times_added - a.times_added;
      }
    });

    setDisplayedProducts(filtered);
  };

  const ProductCard = React.memo(({ item, theme, sortBy }: { item: Product; theme: any; sortBy: string }) => {
    const images = item.images as string[];
    const imageUrl = images && images.length > 0 ? images[0] : null;
    const isPopular = sortBy === 'popular' && (item as any).times_added > 0;

    return (
      <TouchableOpacity
        style={[styles.productCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Store size={32} color={COLORS.gray[400]} />
            </View>
          )}
          {isPopular && (
            <View style={styles.popularityBadge}>
              <Text style={styles.popularityText}>❤️ {(item as any).times_added}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.productTitle, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.productPrice, { color: theme.primary }]}>
          {item.currency} {item.price.toFixed(2)}
        </Text>
      </TouchableOpacity>
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Marketplace</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.input }]}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.textSecondary}
          />
        </View>
      </View>

      <View style={[styles.sortContainer, { backgroundColor: theme.card }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortContent}>
          <FilterChip
            label="Popular"
            active={sortBy === 'popular'}
            onPress={() => setSortBy('popular')}
            icon="🔥"
          />
          <FilterChip
            label="Newest"
            active={sortBy === 'newest'}
            onPress={() => setSortBy('newest')}
            icon="✨"
          />
          <FilterChip
            label="Price Up"
            active={sortBy === 'price_asc'}
            onPress={() => setSortBy('price_asc')}
            icon="💰"
          />
          <FilterChip
            label="Price Down"
            active={sortBy === 'price_desc'}
            onPress={() => setSortBy('price_desc')}
            icon="💎"
          />
          <FilterChip
            label="Trending"
            active={sortBy === 'trending'}
            onPress={() => setSortBy('trending')}
            icon="📈"
          />
        </ScrollView>
      </View>

      <FlatList
        data={displayedProducts}
        renderItem={({ item }) => <ProductCard item={item} theme={theme} sortBy={sortBy} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
        columnWrapperStyle={styles.productRow}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListHeaderComponent={
          <TrendingSection products={trendingProducts} loading={loading} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Store size={64} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No products found</Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Check back soon for new products!'}
              </Text>
            </View>
          ) : null
        }
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
  searchContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
  },
  sortContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.md,
  },
  sortContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  productGrid: {
    padding: SPACING.lg,
  },
  productRow: {
    gap: SPACING.md,
  },
  productCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  productPrice: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.dark,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  popularityBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  popularityText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.error,
  },
});
