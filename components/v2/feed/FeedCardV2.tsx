/**
 * 📰 FeedCardV2 - Carte Wishlist pour le Feed
 * 
 * Features:
 * - Image Hero immersive
 * - Galerie miniatures (optionnel)
 * - Header profil avec avatar
 * - Footer actions (Like, Comment, Share)
 * - Progress bar (funded %)
 */

import React from 'react';
import { View, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemeV2, brand, light, spacing, radius, shadowsLight } from '@/theme/v2';
import TextV2 from '../TextV2';
import AvatarV2 from '../AvatarV2';
import ButtonV2 from '../ButtonV2';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width; // Full width
const IMAGE_HEIGHT = width * 0.8; // Ratio 4:5 (Instagram style)

export interface FeedItem {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    user: {
        id: string;
        name: string;
        avatar: string;
        level: number;
    };
    stats: {
        likes: number;
        comments: number;
        itemsCount: number;
        fundedPercentage: number;
    };
    itemsPreview: string[]; // URLs of items
    createdAt: string;
}

interface FeedCardProps {
    item: FeedItem;
    onPress: () => void;
    onLike: () => void;
    onComment: () => void;
    onShare: () => void;
}

export default function FeedCard({ item, onPress, onLike, onComment, onShare }: FeedCardProps) {

    return (
        <Animated.View entering={FadeIn} style={styles.container}>
            {/* Header Profil */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <AvatarV2
                        size="sm"
                        source={{ uri: item.user.avatar }}
                        badge={
                            <View style={{ backgroundColor: brand.hivePurple, paddingHorizontal: 4, borderRadius: 4 }}>
                                <TextV2 variant="labelSM" color="#FFF" style={{ fontSize: 8 }}>{item.user.level}</TextV2>
                            </View>
                        }
                    />
                    <View style={styles.userText}>
                        <TextV2 variant="captionBold">{item.user.name}</TextV2>
                        <TextV2 variant="captionSM" color="tertiary">2h ago</TextV2>
                    </View>
                </View>
                <Pressable hitSlop={10}>
                    <MoreHorizontal color={light.text.secondary} size={24} />
                </Pressable>
            </View>

            {/* Hero Image / Content */}
            <Pressable onPress={onPress}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.coverImage }} style={styles.heroImage} resizeMode="cover" />

                    {/* Overlay Gradient Bottom */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={styles.imageOverlay}
                    />

                    {/* Funding Progress (Floating) */}
                    <View style={styles.progressBadge}>
                        <TextV2 variant="captionBold" color="#FFF">
                            {item.stats.fundedPercentage}% Funded
                        </TextV2>
                    </View>

                    {/* Title on Image */}
                    <View style={styles.titleOverlay}>
                        <TextV2 variant="h2" color="#FFFFFF" style={styles.titleShadow}>
                            {item.title}
                        </TextV2>
                    </View>
                </View>
            </Pressable>

            {/* Stats & Actions Bar */}
            <View style={styles.actionBar}>
                <View style={styles.actionsLeft}>
                    <Pressable onPress={onLike} style={styles.actionButton}>
                        <Heart size={26} color={light.text.primary} />
                        <TextV2 variant="bodyBold">{item.stats.likes}</TextV2>
                    </Pressable>
                    <Pressable onPress={onComment} style={styles.actionButton}>
                        <MessageCircle size={26} color={light.text.primary} />
                        <TextV2 variant="bodyBold">{item.stats.comments}</TextV2>
                    </Pressable>
                    <Pressable onPress={onShare} style={styles.actionButton}>
                        <Share2 size={26} color={light.text.primary} />
                    </Pressable>
                </View>

                {/* Visual Indicator of items */}
                <View style={styles.itemCount}>
                    <TextV2 variant="caption" color="tertiary">
                        {item.stats.itemsCount} items
                    </TextV2>
                </View>
            </View>

            {/* Description & Comments Preview */}
            <View style={styles.footer}>
                <TextV2 variant="body" numberOfLines={2}>
                    <TextV2 variant="bodyBold">{item.user.name}</TextV2> {item.description}
                </TextV2>
                <Pressable onPress={onComment} style={{ marginTop: 4 }}>
                    <TextV2 variant="caption" color="tertiary">View all {item.stats.comments} comments</TextV2>
                </Pressable>
            </View>

        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.xl,
        backgroundColor: light.background.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    userText: {
        justifyContent: 'center',
    },
    imageContainer: {
        width: CARD_WIDTH,
        height: IMAGE_HEIGHT,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        backgroundColor: light.background.secondary,
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    titleOverlay: {
        position: 'absolute',
        bottom: spacing.lg,
        left: spacing.lg,
        right: spacing.lg,
    },
    titleShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    progressBadge: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    actionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.xs,
    },
    actionsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    itemCount: {
        backgroundColor: light.background.secondary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.sm,
    },
    footer: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
});
