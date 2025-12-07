import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Store, TrendingUp } from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'] & {
    times_added?: number;
    recent_adds?: number;
};

interface TrendingSectionProps {
    products: Product[];
    loading?: boolean;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ products, loading }) => {
    const { theme } = useTheme();

    const renderItem = ({ item }: { item: Product }) => {
        const images = item.images as string[];
        const imageUrl = images && images.length > 0 ? images[0] : null;

        return (
            <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => router.push(`/product/${item.id}`)}
            >
                <View style={styles.imageContainer}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Store size={24} color={COLORS.gray[400]} />
                        </View>
                    )}
                    <View style={[styles.badge, { backgroundColor: theme.error }]}>
                        <Text style={styles.badgeText}>🔥 Trending</Text>
                    </View>
                </View>

                <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
                    {item.title}
                </Text>

                <Text style={[styles.price, { color: theme.primary }]}>
                    {item.currency} {item.price.toFixed(2)}
                </Text>
            </TouchableOpacity>
        );
    };

    if (loading) return null; // Or skeleton
    if (!products || products.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TrendingUp size={20} color={theme.error} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Gifts</Text>
            </View>

            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    card: {
        width: 160,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        marginRight: SPACING.sm,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        marginBottom: SPACING.sm,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
    title: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        marginBottom: 4,
        height: 36, // limit lines
    },
    price: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
    },
});
