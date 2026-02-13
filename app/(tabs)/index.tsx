import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, ScrollView, RefreshControl } from 'react-native'; // FlashList later for perf
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FlatList as FlashList } from 'react-native';
import { useRouter } from 'expo-router';
// import { FlashList } from '@shopify/flash-list';
import {
    Bell,
    Search,
    Sparkles
} from 'lucide-react-native';

import { ThemeV2, brand, light, spacing, glass, gray } from '@/theme/v2';
import TextV2 from '@/components/v2/TextV2';
import ButtonV2 from '@/components/v2/ButtonV2';
import TabBarIcon from '@/components/v2/navigation/TabBarIcon';

// import StoriesRail from '@/components/v2/feed/StoriesRail';
import FeedCardV2, { FeedItem } from '@/components/v2/feed/FeedCardV2';

import { MOCK_FEED } from '@/constants/mocks';

export default function HomeV2() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const renderHeader = () => (
        <View style={{ height: 16 }} />
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor="#7F5BFF" translucent={false} />

            {/* Top Bar Floating */}
            <View style={[styles.topBar, { paddingTop: 80 }]}>
                <View style={styles.logoContainer}>
                    <TextV2 variant="h3" style={{ fontSize: 24, color: '#FFB937' }}>WishHive</TextV2>
                </View>

                {/* Actions Right */}
                <View style={styles.topActions}>
                    <Search color="white" size={24} style={{ marginRight: 16 }} />
                    <Bell color="white" size={24} />
                    <View style={styles.badge} />
                </View>
            </View>

            {/* Feed List */}
            <FlashList
                data={MOCK_FEED}
                renderItem={({ item }) => (
                    <FeedCardV2
                        item={item}
                        onPress={() => router.push(`/wishlists/${item.id}`)}
                        onLike={() => console.log('Like', item.id)}
                        onComment={() => console.log('Comment', item.id)}
                        onShare={() => console.log('Share', item.id)}
                    />
                )}
                // estimatedItemSize={450} // Removed for FlatList
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }} // Space for TabBar
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={brand.honeyGlow} />
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: light.background.primary,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#7F5BFF',
        zIndex: 10,
    },
    logoContainer: {
        flex: 1,
    },
    topActions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: brand.honeyGlow,
        borderWidth: 2,
        borderColor: '#fff',
    }
});
