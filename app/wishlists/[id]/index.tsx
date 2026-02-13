import React, { useRef } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, Animated as RNAnimated, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Share2, MoreHorizontal, Plus, Heart, MessageCircle } from 'lucide-react-native';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';

import { ThemeV2, brand, light, spacing, glass, shadowsLight as shadows, gray } from '@/theme/v2';
import TextV2 from '@/components/v2/TextV2';
import ButtonV2 from '@/components/v2/ButtonV2';
import AvatarV2 from '@/components/v2/AvatarV2';
import BadgeV2 from '@/components/v2/BadgeV2';

import { MOCK_FEED, MOCK_WISHLIST_ITEMS, MOCK_STORIES } from '@/constants/mocks';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 350;

export default function WishlistDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const scrollY = useSharedValue(0);

    // Find mock data
    const wishlist = MOCK_FEED.find(w => w.id === id) || MOCK_FEED[0];
    const items = MOCK_WISHLIST_ITEMS; // Just use the same mock items for all for now

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const headerStyle = useAnimatedStyle(() => {
        return {
            height: interpolate(
                scrollY.value,
                [-100, 0, HERO_HEIGHT],
                [HERO_HEIGHT + 100, HERO_HEIGHT, 100],
                Extrapolation.CLAMP
            ),
            transform: [
                {
                    scale: interpolate(
                        scrollY.value,
                        [-100, 0],
                        [1.2, 1],
                        Extrapolation.CLAMP
                    ),
                },
            ],
        };
    });

    const headerBlurStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, HERO_HEIGHT - 100],
                [0, 1],
                Extrapolation.CLAMP
            ),
        };
    });

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        return (
            <Pressable
                style={[styles.itemCard, index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }]}
                onPress={() => console.log('Item press', item.id)}
            >
                <View style={styles.itemImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                    <View style={styles.itemBadgeContainer}>
                        {item.status !== 'open' && (
                            <BadgeV2
                                label={item.status}
                                // @ts-ignore
                                variant={item.status === 'purchased' ? 'success' : 'warning'}
                                size="sm"
                            />
                        )}
                    </View>
                </View>
                <View style={styles.itemContent}>
                    <TextV2 variant="bodySM" numberOfLines={2} style={styles.itemTitle}>{item.name}</TextV2>
                    <TextV2 variant="h4" color="primary">${item.price}</TextV2>

                    {item.fundedAmount && (
                        <View style={styles.fundingContainer}>
                            <View style={styles.fundingBarBg}>
                                <View
                                    style={[
                                        styles.fundingBarFill,
                                        { width: `${(item.fundedAmount / item.price) * 100}%` }
                                    ]}
                                />
                            </View>
                            <TextV2 variant="caption" color="secondary">
                                {Math.round((item.fundedAmount / item.price) * 100)}% funded
                            </TextV2>
                        </View>
                    )}
                </View>
            </Pressable>
        );
    };

    const ListHeader = () => (
        <View style={styles.contentContainer}>
            {/* Info Section */}
            <View style={styles.infoSection}>
                <View style={styles.titleRow}>
                    <TextV2 variant="h1" style={styles.title}>{wishlist.title}</TextV2>
                </View>

                <View style={styles.authorRow}>
                    <AvatarV2
                        source={{ uri: wishlist.user.avatar }}
                        size="md"
                        name={wishlist.user.name}
                    />
                    <View style={styles.authorText}>
                        <TextV2 variant="bodySM" color="secondary">Created by</TextV2>
                        <TextV2 variant="body" weight="600">{wishlist.user.name}</TextV2>
                    </View>
                    <ButtonV2
                        title="Follow"
                        variant="secondary"
                        size="sm"
                        style={{ marginLeft: 'auto' }}
                        onPress={() => console.log('Follow')}
                        gradient={false}
                    />
                </View>

                <TextV2 variant="body" color="secondary" style={styles.description}>
                    {wishlist.description}
                </TextV2>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <TextV2 variant="h3">{wishlist.stats.itemsCount}</TextV2>
                        <TextV2 variant="caption" color="secondary">Items</TextV2>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <TextV2 variant="h3">{wishlist.stats.likes}</TextV2>
                        <TextV2 variant="caption" color="secondary">Likes</TextV2>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <TextV2 variant="h3">{wishlist.stats.fundedPercentage}%</TextV2>
                        <TextV2 variant="caption" color="secondary">Funded</TextV2>
                    </View>
                </View>

                {/* Contributors / Shared With */}
                <View style={styles.contributorsSection}>
                    <TextV2 variant="h4" style={{ marginBottom: 12 }}>Contributors</TextV2>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24, paddingHorizontal: 24 }}>
                        {MOCK_STORIES.map((user, i) => (
                            <View key={user.id} style={{ marginRight: -12 }}>
                                <AvatarV2
                                    source={{ uri: user.userAvatar }}
                                    size="md"
                                    style={{ borderWidth: 2, borderColor: light.background.primary }}
                                />
                            </View>
                        ))}
                        <View style={[styles.moreContributors, { zIndex: -1 }]}>
                            <TextV2 variant="caption" color="primary">+12</TextV2>
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* Filter / Sort Row placeholder */}
            <View style={styles.filterRow}>
                <TextV2 variant="h4">Wishlist Items</TextV2>
                <ButtonV2
                    title="Filter"
                    variant="ghost"
                    size="sm"
                    icon={<MoreHorizontal size={16} color={light.text.secondary} />}
                    onPress={() => console.log('Filter')}
                    gradient={false}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Animated Hero Background */}
            <Animated.View style={[styles.heroContainer, headerStyle]}>
                <Image
                    source={{ uri: wishlist.coverImage }}
                    style={styles.heroImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(255,255,255,1)']}
                    style={styles.gradientOverlay}
                    locations={[0, 0.5, 1]}
                />
            </Animated.View>

            {/* Top Navigation Bar */}
            <View style={styles.topBar}>
                <BlurView intensity={80} tint="light" style={styles.navButtonBlur}>
                    <Pressable style={styles.navButton} onPress={() => router.back()}>
                        <ChevronLeft color={brand.honeyGlow} size={24} />
                    </Pressable>
                </BlurView>

                <View style={styles.rightActions}>
                    <BlurView intensity={80} tint="light" style={[styles.navButtonBlur, { marginRight: 8 }]}>
                        <Pressable style={styles.navButton}>
                            <Share2 color={brand.honeyGlow} size={20} />
                        </Pressable>
                    </BlurView>
                    <BlurView intensity={80} tint="light" style={styles.navButtonBlur}>
                        <Pressable style={styles.navButton}>
                            <MoreHorizontal color={brand.honeyGlow} size={20} />
                        </Pressable>
                    </BlurView>
                </View>
            </View>

            {/* Main Content */}
            <Animated.FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={ListHeader}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
            />

            {/* Floating Action Button */}
            <View style={styles.fabContainer}>
                <ButtonV2
                    title="Add Item"
                    icon={<Plus color="white" size={24} />}
                    gradient
                    style={styles.fab}
                    textStyle={{ fontSize: 16, fontWeight: '600' }}
                    onPress={() => console.log('Add Item')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: light.background.primary,
    },
    heroContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 0,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    topBar: {
        position: 'absolute',
        top: 50,
        left: 24,
        right: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 100,
    },
    navButtonBlur: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    navButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    rightActions: {
        flexDirection: 'row',
    },
    listContent: {
        paddingTop: HERO_HEIGHT - 40, // Overlap slightly
        paddingBottom: 100,
        paddingHorizontal: 24,
    },
    contentContainer: {
        marginBottom: 24,
    },
    infoSection: {
        marginBottom: 24,
    },
    title: {
        marginBottom: 16,
        fontSize: 32,
    },
    titleRow: {
        marginBottom: 16,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    authorText: {
        marginLeft: 12,
    },
    description: {
        marginBottom: 24,
        lineHeight: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: light.background.secondary, // Light gray bg
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: gray[200],
    },
    contributorsSection: {
        marginBottom: 24,
    },
    moreContributors: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: light.background.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -12,
        borderWidth: 2,
        borderColor: light.background.primary,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    itemCard: {
        flex: 0.48, // 2 columns approx
        backgroundColor: light.background.primary,
        borderRadius: 16,
        marginBottom: 16,
        ...shadows.sm,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: gray[100],
    },
    itemImageContainer: {
        height: 140,
        position: 'relative',
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    itemBadgeContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    itemContent: {
        padding: 12,
    },
    itemTitle: {
        marginBottom: 4,
        height: 40,
    },
    fundingContainer: {
        marginTop: 8,
    },
    fundingBarBg: {
        height: 4,
        backgroundColor: gray[200],
        borderRadius: 2,
        marginBottom: 4,
        overflow: 'hidden',
    },
    fundingBarFill: {
        height: '100%',
        backgroundColor: brand.honeyGlow,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 30, // Above tab bar if present, or just bottom
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
    },
    fab: {
        width: 160,
        shadowColor: brand.honeyGlow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    }
});
