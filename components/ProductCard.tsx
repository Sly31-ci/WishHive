import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, ShoppingCart } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    currency: string;
    imageUrl?: string;
    sellerName: string;
    onPress: () => void;
    onAddToWishlist?: () => void;
}

export function ProductCard({
    title,
    price,
    currency,
    imageUrl,
    sellerName,
    onPress,
    onAddToWishlist,
}: ProductCardProps) {
    const formatPrice = (price: number, currency: string) => {
        const symbols: Record<string, string> = {
            USD: '$',
            EUR: '€',
            GBP: '£',
        };
        return `${symbols[currency] || currency} ${price.toFixed(2)}`;
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholder]}>
                        <ShoppingCart size={40} color={COLORS.gray[500]} />
                    </View>
                )}
                {onAddToWishlist && (
                    <TouchableOpacity
                        style={styles.wishlistButton}
                        onPress={onAddToWishlist}
                    >
                        <Heart size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>

                <Text style={styles.seller} numberOfLines={1}>
                    by {sellerName}
                </Text>

                <Text style={styles.price}>
                    {formatPrice(price, currency)}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
        marginBottom: 16,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    placeholder: {
        backgroundColor: COLORS.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wishlistButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 4,
    },
    seller: {
        fontSize: 13,
        color: COLORS.gray[500],
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
    },
});
