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
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Search, Store, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { FilterChip } from '@/components/FilterChip';
import { TrendingSection } from '@/components/TrendingSection';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from '@/constants/theme';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

export default function MarketplaceScreen() {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false); // Search caché par défaut
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'trending'>('popular'); // 3 filtres seulement

  useEffect(() => {
    loadProductsAndStats();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortBy, searchQuery]);

  const loadProductsAndStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, wishlist_items(id, created_at)')
        .eq('is_active', true)
        .limit(100);

      if (error) throw error;

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
        case 'trending':
          return b.recent_adds - a.recent_adds;
        case 'popular':
        default:
          return b.times_added - a.times_added;
      }
    });

    setDisplayedProducts(filtered);
  };

  const ProductCard = React.memo(({ item }: { item: Product }) => {
    const images = item.images as string[];
    const imageUrl = images && images.length > 0 ? images[0] : null;

    return (
      <Card
        onPress={() => router.push(`/product/${item.id}`)}
        style={styles.productCard}
        padding="sm"
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
        </View>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>
          {item.currency} {item.price.toFixed(2)}
        </Text>
      </Card>
    );
  });

  return (
    <View style={styles.container}>
      {/* Header Simplifié */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity
          onPress={() => setSearchExpanded(!searchExpanded)}
          style={styles.searchIcon}
        >
          {searchExpanded ? (
            <X size={24} color={COLORS.dark} />
          ) : (
            <Search size={24} color={COLORS.dark} />
          )}
        </TouchableOpacity>
      </View>

      {/* Search Expandable */}
      {searchExpanded && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={18} color={COLORS.gray[500]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.gray[500]}
              autoFocus
            />
          </View>
        </Animated.View>
      )}

      {/* Filtres simplifiés - 3 max */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
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
            label="Trending"
            active={sortBy === 'trending'}
            onPress={() => setSortBy('trending')}
            icon="📈"
          />
        </ScrollView>
      </View>

      {/* Products Grid */}
      <FlatList
        data={displayedProducts}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
            <ProductCard item={item} />
          </Animated.View>
        )}
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
              <Store size={64} color={COLORS.gray[400]} />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.dark,
  },
  searchIcon: {
    padding: SPACING.sm,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  filterContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  productGrid: {
    padding: SPACING.lg,
  },
  productRow: {
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  productCard: {
    width: CARD_WIDTH,
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  productImage: {
    width: '100%',
    height: '100%',
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
    lineHeight: 18,
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
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.dark,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
});
