import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ArrowLeft, Search, Plus, Link as LinkIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';
import { useProducts } from '@/hooks/useProducts';
import { emitItemAdded } from '@/lib/events';
import { getRandomSuccessMessage, getErrorMessage } from '@/lib/messages';
import * as Haptics from 'expo-haptics';

type Product = Database['public']['Tables']['products']['Row'];

export default function AddItemScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const { products, loading: productsLoading, searchProducts } = useProducts();
    const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
    const [searchQuery, setSearchQuery] = useState('');

    // Custom item state
    const [customTitle, setCustomTitle] = useState('');
    const [customUrl, setCustomUrl] = useState('');
    const [customPrice, setCustomPrice] = useState('');
    const [customNote, setCustomNote] = useState('');
    const [adding, setAdding] = useState(false);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        searchProducts(text);
    };

    const handleAddProduct = async (product: Product) => {
        try {
            setAdding(true);
            const wishlistId = Array.isArray(id) ? id[0] : id;
            const { data, error } = await supabase.from('wishlist_items').insert({
                wishlist_id: wishlistId as string,
                product_id: product.id,
                priority: 3,
            }).select().single();

            if (error) throw error;

            // Emit event for real-time update
            emitItemAdded(wishlistId as string, data);

            // Success haptic feedback
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Show fun success message
            const successMsg = getRandomSuccessMessage('ITEM_ADDED');
            Alert.alert(successMsg.title, successMsg.message, [
                { text: 'Awesome!', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Add product error:', error);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Oops!', getErrorMessage(error));
        } finally {
            setAdding(false);
        }
    };

    const handleAddCustomItem = async () => {
        if (!customTitle.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }

        try {
            setAdding(true);
            const wishlistId = Array.isArray(id) ? id[0] : id;
            const { data, error } = await supabase.from('wishlist_items').insert({
                wishlist_id: wishlistId as string,
                custom_title: customTitle.trim(),
                custom_url: customUrl.trim() || null,
                custom_price: customPrice ? parseFloat(customPrice) : null,
                note: customNote.trim() || null,
                priority: 3,
            }).select().single();

            if (error) throw error;

            // Emit event for real-time update
            emitItemAdded(wishlistId as string, data);

            // Success haptic feedback
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Show fun success message
            const successMsg = getRandomSuccessMessage('ITEM_ADDED');
            Alert.alert(successMsg.title, successMsg.message, [
                { text: 'Awesome!', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Add custom item error:', error);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Oops!', getErrorMessage(error));
        } finally {
            setAdding(false);
        }
    };

    const renderSearchTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.searchBox}>
                <Search size={20} color={COLORS.gray[400]} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search marketplace..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholderTextColor={COLORS.gray[400]}
                />
            </View>

            <ScrollView style={styles.resultsList}>
                {products.map((product) => (
                    <TouchableOpacity
                        key={product.id}
                        style={styles.productCard}
                        onPress={() => handleAddProduct(product)}
                        disabled={adding}
                    >
                        <Image
                            source={{ uri: product.images?.[0] }}
                            style={styles.productImage}
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productTitle} numberOfLines={2}>
                                {product.title}
                            </Text>
                            <Text style={styles.productPrice}>
                                {product.currency} {product.price.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.addButton}>
                            <Plus size={20} color={COLORS.primary} />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderCustomTab = () => (
        <ScrollView style={styles.tabContent}>
            <Card>
                <Input
                    label="Item Name"
                    placeholder="e.g. Vintage Camera"
                    value={customTitle}
                    onChangeText={setCustomTitle}
                />

                <Input
                    label="Link (Optional)"
                    placeholder="https://..."
                    value={customUrl}
                    onChangeText={setCustomUrl}
                    autoCapitalize="none"
                    keyboardType="url"
                    icon={<LinkIcon size={20} color={COLORS.gray[400]} />}
                />

                <Input
                    label="Price Estimate (Optional)"
                    placeholder="0.00"
                    value={customPrice}
                    onChangeText={setCustomPrice}
                    keyboardType="numeric"
                />

                <Input
                    label="Note (Optional)"
                    placeholder="Size, color, or other details..."
                    value={customNote}
                    onChangeText={setCustomNote}
                    multiline
                    numberOfLines={3}
                    style={styles.textArea}
                />

                <Button
                    title="Add to Wishlist"
                    onPress={handleAddCustomItem}
                    loading={adding}
                    style={styles.submitButton}
                />
            </Card>
        </ScrollView>
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Add Item',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <View style={styles.container}>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'search' && styles.activeTab]}
                        onPress={() => setActiveTab('search')}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'search' && styles.activeTabText,
                            ]}
                        >
                            Search Marketplace
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'custom' && styles.activeTab]}
                        onPress={() => setActiveTab('custom')}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'custom' && styles.activeTabText,
                            ]}
                        >
                            Add Custom Item
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'search' ? renderSearchTab() : renderCustomTab()}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    tabs: {
        flexDirection: 'row',
        padding: SPACING.md,
        gap: SPACING.md,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    activeTab: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    tabText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[600],
    },
    activeTabText: {
        color: COLORS.white,
    },
    tabContent: {
        flex: 1,
        padding: SPACING.md,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        height: 48,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    searchInput: {
        flex: 1,
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZES.md,
        color: COLORS.dark,
    },
    resultsList: {
        flex: 1,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.sm,
        marginBottom: SPACING.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: COLORS.gray[100],
    },
    productInfo: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    productTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        color: COLORS.primary,
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        marginTop: SPACING.md,
    },
});
