import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Store } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

export default function MarketplaceScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const images = item.images as string[];
    const imageUrl = images && images.length > 0 ? images[0] : null;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.productImage} />
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
      </TouchableOpacity>
    );
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={COLORS.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray[400]}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Store size={64} color={COLORS.gray[300]} />
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'Try a different search term'
              : 'Check back soon for new products!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productGrid}
          columnWrapperStyle={styles.productRow}
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
});
