/**
 * Product URL Input Component
 * 
 * Allow users to paste a product URL and automatically
 * extract product data via web scraping.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Link, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { extractProductFromURL, ProductMetadata, isScrapableURL } from '@/lib/scraping-service';
import Button from './Button';
import { Card } from './Card';
import { Input } from './Input';

interface ProductURLInputProps {
    onProductExtracted: (product: ProductMetadata) => void;
    onCancel?: () => void;
}

export default function ProductURLInput({
    onProductExtracted,
    onCancel,
}: ProductURLInputProps) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractedProduct, setExtractedProduct] = useState<ProductMetadata | null>(null);

    // Editable fields
    const [editedTitle, setEditedTitle] = useState('');
    const [editedPrice, setEditedPrice] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    const handleFetchProduct = async () => {
        if (!url.trim()) {
            setError('Please enter a valid URL');
            return;
        }

        if (!isScrapableURL(url)) {
            setError('This URL cannot be processed. Please enter a different URL or add the product manually.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setExtractedProduct(null);

        try {
            const result = await extractProductFromURL(url);

            if (result.success && result.data) {
                setExtractedProduct(result.data);
                setEditedTitle(result.data.title);
                setEditedPrice(result.data.price);
                setEditedDescription(result.data.description);
            } else {
                setError(result.error || 'Failed to extract product data');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        if (!extractedProduct) return;

        const finalProduct: ProductMetadata = {
            ...extractedProduct,
            title: editedTitle || extractedProduct.title,
            price: editedPrice || extractedProduct.price,
            description: editedDescription || extractedProduct.description,
        };

        onProductExtracted(finalProduct);
    };

    const handleReset = () => {
        setUrl('');
        setExtractedProduct(null);
        setError(null);
        setEditedTitle('');
        setEditedPrice('');
        setEditedDescription('');
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <View style={styles.header}>
                    <Link color={COLORS.primary} size={24} />
                    <Text style={styles.title}>Add from URL</Text>
                </View>

                <Text style={styles.subtitle}>
                    Paste a link to a product from any online store
                </Text>

                {!extractedProduct ? (
                    <>
                        <Input
                            placeholder="https://example.com/product"
                            value={url}
                            onChangeText={setUrl}
                            keyboardType="url"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                        />

                        {error && (
                            <View style={styles.errorContainer}>
                                <AlertCircle color={COLORS.error} size={20} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <View style={styles.buttonRow}>
                            {onCancel && (
                                <Button
                                    title="Cancel"
                                    variant="outline"
                                    onPress={onCancel}
                                    style={styles.halfButton}
                                    disabled={isLoading}
                                />
                            )}
                            <Button
                                title={isLoading ? "" : "Fetch Product"}
                                onPress={handleFetchProduct}
                                style={onCancel ? styles.halfButton : undefined}
                                disabled={isLoading || !url.trim()}
                                icon={isLoading ? <ActivityIndicator color={COLORS.white} /> : undefined}
                            />
                        </View>

                        <Text style={styles.hint}>
                            Supported: Amazon, Etsy, eBay, Shopify stores, and most e-commerce sites
                        </Text>
                    </>
                ) : (
                    <>
                        <View style={styles.successBanner}>
                            <CheckCircle2 color={COLORS.success} size={24} />
                            <Text style={styles.successText}>Found it! ✨</Text>
                        </View>

                        {extractedProduct.images.length > 0 && (
                            <Image
                                source={{ uri: extractedProduct.images[0] }}
                                style={styles.productImage}
                                resizeMode="cover"
                            />
                        )}

                        <Text style={styles.label}>Title</Text>
                        <Input
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                            placeholder="Product title"
                        />

                        <Text style={styles.label}>Price</Text>
                        <Input
                            value={editedPrice}
                            onChangeText={setEditedPrice}
                            placeholder="0.00"
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Description (Optional)</Text>
                        <Input
                            value={editedDescription}
                            onChangeText={setEditedDescription}
                            placeholder="Product description"
                            multiline
                            numberOfLines={3}
                        />

                        {extractedProduct.images.length > 1 && (
                            <>
                                <Text style={styles.label}>Additional Images</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                                    {extractedProduct.images.slice(1, 4).map((img, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: img }}
                                            style={styles.thumbnailImage}
                                        />
                                    ))}
                                </ScrollView>
                            </>
                        )}

                        <View style={styles.buttonRow}>
                            <Button
                                title="Start Over"
                                variant="outline"
                                onPress={handleReset}
                                style={styles.halfButton}
                            />
                            <Button
                                title="Add to Wishlist"
                                onPress={handleConfirm}
                                style={styles.halfButton}
                                disabled={!editedTitle.trim()}
                            />
                        </View>
                    </>
                )}
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        margin: 16,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.gray[500],
        marginBottom: 24,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        backgroundColor: COLORS.error + '10',
        borderRadius: 8,
        marginTop: 12,
    },
    errorText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.error,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    halfButton: {
        flex: 1,
    },
    hint: {
        fontSize: 12,
        color: COLORS.gray[500],
        textAlign: 'center',
        marginTop: 12,
    },
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        backgroundColor: COLORS.success + '10',
        borderRadius: 8,
        marginBottom: 16,
    },
    successText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.success,
    },
    productImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 8,
        marginTop: 12,
    },
    imageScroll: {
        marginTop: 8,
        marginBottom: 16,
    },
    thumbnailImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 8,
    },
});
