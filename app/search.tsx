import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Search as SearchIcon, User, Gift, Store } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';

type SearchResult = {
    type: 'user' | 'wishlist' | 'product';
    id: string;
    title: string;
    subtitle?: string;
    image?: string;
};

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'users' | 'wishlists' | 'products'>('all');

    const handleSearch = async (text: string) => {
        setQuery(text);
        if (text.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const searchResults: SearchResult[] = [];

            // Search Users
            if (activeTab === 'all' || activeTab === 'users') {
                const { data: users } = await supabase
                    .from('profiles')
                    .select('*')
                    .ilike('username', `%${text}%`)
                    .limit(5);

                users?.forEach(user => {
                    searchResults.push({
                        type: 'user',
                        id: user.id,
                        title: user.username,
                        subtitle: user.full_name || undefined,
                        image: user.avatar_url || undefined,
                    });
                });
            }

            // Search Wishlists
            if (activeTab === 'all' || activeTab === 'wishlists') {
                const { data: wishlists } = await supabase
                    .from('wishlists')
                    .select('*')
                    .eq('privacy', 'public')
                    .ilike('title', `%${text}%`)
                    .limit(5);

                wishlists?.forEach(list => {
                    searchResults.push({
                        type: 'wishlist',
                        id: list.id,
                        title: list.title,
                        subtitle: list.type,
                    });
                });
            }

            // Search Products
            if (activeTab === 'all' || activeTab === 'products') {
                const { data: products } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('title', `%${text}%`)
                    .limit(5);

                products?.forEach(prod => {
                    searchResults.push({
                        type: 'product',
                        id: prod.id,
                        title: prod.title,
                        subtitle: `${prod.currency} ${prod.price}`,
                        image: prod.images?.[0],
                    });
                });
            }

            setResults(searchResults);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (item: SearchResult) => {
        switch (item.type) {
            case 'user':
                router.push(`/user/${item.id}`);
                break;
            case 'wishlist':
                router.push(`/wishlist/${item.id}`);
                break;
            case 'product':
                router.push(`/product/${item.id}`);
                break;
        }
    };

    const renderItem = ({ item }: { item: SearchResult }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handlePress(item)}
        >
            <View style={styles.iconContainer}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.resultImage} />
                ) : (
                    <View style={styles.placeholderIcon}>
                        {item.type === 'user' && <User size={20} color={COLORS.gray[500]} />}
                        {item.type === 'wishlist' && <Gift size={20} color={COLORS.gray[500]} />}
                        {item.type === 'product' && <Store size={20} color={COLORS.gray[500]} />}
                    </View>
                )}
            </View>
            <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                {item.subtitle && (
                    <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                )}
            </View>
            <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{item.type}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft size={24} color={COLORS.dark} />
                    </TouchableOpacity>
                    <View style={styles.searchBox}>
                        <SearchIcon size={20} color={COLORS.gray[400]} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search users, wishlists, products..."
                            value={query}
                            onChangeText={handleSearch}
                            autoFocus
                        />
                    </View>
                </View>

                <View style={styles.tabs}>
                    {(['all', 'users', 'wishlists', 'products'] as const).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => {
                                setActiveTab(tab);
                                handleSearch(query);
                            }}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={(item) => `${item.type}-${item.id}`}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        query.length > 0 && !loading ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No results found</Text>
                            </View>
                        ) : null
                    }
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: SPACING.md,
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
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    tab: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.gray[200],
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.gray[600],
    },
    activeTabText: {
        color: COLORS.white,
    },
    list: {
        padding: SPACING.lg,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.sm,
    },
    iconContainer: {
        marginRight: SPACING.md,
    },
    resultImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    placeholderIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultInfo: {
        flex: 1,
    },
    resultTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
    resultSubtitle: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    typeBadge: {
        backgroundColor: COLORS.gray[100],
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    typeText: {
        fontSize: 10,
        color: COLORS.gray[600],
        textTransform: 'capitalize',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    emptyText: {
        color: COLORS.gray[500],
    },
});
