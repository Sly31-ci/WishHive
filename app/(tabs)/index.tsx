import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, ScrollView, RefreshControl } from 'react-native'; // FlashList later for perf
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FlatList as FlashList } from 'react-native';
// import { FlashList } from '@shopify/flash-list';
import {
    Bell,
    Search,
    Sparkles
} from 'lucide-react-native';

import { ThemeV2, brand, light, spacing, glass } from '@/theme/v2';
import TextV2 from '@/components/v2/TextV2';
import ButtonV2 from '@/components/v2/ButtonV2';
import TabBarIcon from '@/components/v2/navigation/TabBarIcon';

import StoriesRail from '@/components/v2/feed/StoriesRail';
import FeedCardV2, { FeedItem } from '@/components/v2/feed/FeedCardV2';

import { MOCK_STORIES, MOCK_FEED } from '@/constants/mocks';

export default function HomeV2() {
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const renderHeader = () => (
        <View>
            <StoriesRail
                stories={MOCK_STORIES}
                onStoryPress={(id) => console.log('Story press', id)}
                onAddStory={() => console.log('Add story')}
            />
            {/* Filter Chips could go here */}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" />

            {/* Top Bar Floating */}
            <View style={styles.topBar}>
                <View style={styles.logoContainer}>
                    <TextV2 variant="h3" gradient style={{ fontSize: 24 }}>WishHive</TextV2>
                </View>

                {/* Feed Toggle */}
                <View style={styles.tabToggle}>
                    <TextV2
                        variant="h4"
                        color={activeTab === 'foryou' ? 'primary' : 'tertiary'}
                        onPress={() => setActiveTab('foryou')}
                        style={{ marginRight: 16 }}
                    >
                        For You
                    </TextV2>
                    <View style={styles.divider} />
                    <TextV2
                        variant="h4"
                        color={activeTab === 'following' ? 'primary' : 'tertiary'}
                        onPress={() => setActiveTab('following')}
                        style={{ marginLeft: 16 }}
                    >
                        Following
                    </TextV2>
                </View>

                {/* Actions Right */}
                <View style={styles.topActions}>
                    <Search color={light.text.primary} size={24} style={{ marginRight: 16 }} />
                    <Bell color={light.text.primary} size={24} />
                    <View style={styles.badge} />
                </View>
            </View>

            {/* Feed List */}
            <FlashList
                data={MOCK_FEED}
                renderItem={({ item }) => (
                    <FeedCardV2
                        item={item}
                        onPress={() => console.log('Press card', item.id)}
                        onLike={() => console.log('Like', item.id)}
                        onComment={() => console.log('Comment', item.id)}
                        onShare={() => console.log('Share', item.id)}
                    />
                )}
                estimatedItemSize={450}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }} // Space for TabBar
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={brand.honeyGlow} />
                }
            />

        </SafeAreaView>
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
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        backgroundColor: light.background.primary,
        zIndex: 10,
    },
    logoContainer: {
        flex: 1,
    },
    tabToggle: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        width: 1,
        height: 16,
        backgroundColor: light.border.default,
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
        borderWidth: 1.5,
        borderColor: light.background.primary,
    }
});
