import { StatusBar } from 'expo-status-bar';
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
import { Search, Store, Heart } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { FilterChip } from '@/components/FilterChip';
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

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'all' | 'popular' | 'newest' | 'trending'>('all');

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

    // Sort based on selected filter (skip sorting for 'all')
    if (sortBy !== 'all') {
      filtered.sort((a: any, b: any) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'trending':
            return b.recent_adds - a.recent_adds;
          case 'popular':
            return b.times_added - a.times_added;
          default:
            return 0;
        }
      });
    }

    setDisplayedProducts(filtered);
  };

  const ProductCard = React.memo(({ item }: { item: Product }) => {
    const images = item.images as string[];
    const imageUrl = images && images.length > 0 ? images[0] : null;

    // Generate a rating based on times_added (demo data)
    const timesAdded = (item as any).times_added || 0;
    const rating = Math.min(5, Math.max(3, Math.floor(timesAdded / 2) + 3));

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
          {/* Heart icon - Top right with counter (Figma style) */}
          <TouchableOpacity
            style={[
              styles.heartIconTop,
              timesAdded > 0 && styles.heartIconTopActive
            ]}
            onPress={(e) => {
              e.stopPropagation();
              // TODO: Add to favorites functionality
            }}
          >
            <Heart
              size={16}
              color={timesAdded > 0 ? COLORS.white : COLORS.gray[600]}
              fill={timesAdded > 0 ? COLORS.white : 'transparent'}
              strokeWidth={2}
            />
            {timesAdded > 0 && (
              <Text style={styles.heartCounter}>{timesAdded}</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Star Rating (Figma style) */}
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Text key={index} style={styles.star}>
              {index < rating ? '⭐' : '☆'}
            </Text>
          ))}
        </View>

        <Text style={styles.productPrice}>
          {item.currency} {item.price.toFixed(2)}
        </Text>
      </Card>
    );
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#7F5BFF" translucent={false} />

      {/* V2 Header Style (Purple) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
      </View>

      {/* V1.5 Content Style */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={COLORS.gray[500]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray[500]}
          />
        </View>
      </View>

      <FlatList
        data={displayedProducts}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
        columnWrapperStyle={styles.productRow}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Store size={64} color={COLORS.gray[400]} />
              <Text style={styles.emptyTitle}>No products found</Text>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl + 24, // Match Wishlists header height
    paddingBottom: SPACING.lg,
    backgroundColor: '#7F5BFF', // Hive Purple
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: 'white',
  },
  searchContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50], // Standard input bg
    borderRadius: BORDER_RADIUS.md, // Standard radius
    paddingHorizontal: SPACING.md,
    height: 44, // Standard height
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
  },
  productGrid: {
    padding: SPACING.lg,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    paddingBottom: SPACING.sm,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.gray[100],
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
  heartIconTop: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: BORDER_RADIUS.full,
    padding: 6,
  },
  heartIconTopActive: {
    backgroundColor: COLORS.white,
  },
  heartCounter: {
    display: 'none', // Hide counter in V1.5 style usually
  },
  productTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginHorizontal: SPACING.sm,
    marginTop: SPACING.sm,
    marginBottom: 4,
  },
  ratingContainer: {
    display: 'none', // Hide rating in V1.5 style
  },
  star: {
    display: 'none',
  },
  productPrice: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.primary,
    marginHorizontal: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.gray[500],
    marginTop: SPACING.md,
  },
});
