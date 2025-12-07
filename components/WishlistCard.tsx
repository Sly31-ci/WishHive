import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Eye, Trash2 } from 'lucide-react-native';
import { Card } from './Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { Database } from '@/types/database';
import { WishlistTheme, DEFAULT_THEME } from '@/constants/wishlistThemes';
import { useTheme } from '@/contexts/ThemeContext';

type Wishlist = Database['public']['Tables']['wishlists']['Row'];

interface WishlistCardProps {
    wishlist: Wishlist;
    onPress: () => void;
    onLongPress?: () => void;
    onDelete?: () => void;
    showDelete?: boolean;
}

export function WishlistCard({ wishlist, onPress, onLongPress, onDelete, showDelete }: WishlistCardProps) {
    const { theme: appTheme } = useTheme();

    // Parse theme safely
    const wishlistTheme: WishlistTheme = wishlist.theme && typeof wishlist.theme === 'object'
        ? (wishlist.theme as unknown as WishlistTheme)
        : DEFAULT_THEME;

    const HeaderBackground = ({ children }: { children: React.ReactNode }) => {
        if (wishlistTheme.gradient) {
            return (
                <LinearGradient
                    colors={[wishlistTheme.primaryColor, wishlistTheme.secondaryColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerBackground}
                >
                    {children}
                </LinearGradient>
            );
        }
        return (
            <View style={[styles.headerBackground, { backgroundColor: wishlistTheme.primaryColor }]}>
                {children}
            </View>
        );
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.9}
            delayLongPress={500}
        >
            <Card style={styles.card} variant="elevated">
                <View style={styles.headerContainer}>
                    <HeaderBackground>
                        <View style={styles.headerContent}>
                            <Text style={styles.emoji}>{wishlistTheme.emoji}</Text>
                            <Text style={styles.title} numberOfLines={1}>
                                {wishlist.title}
                            </Text>
                        </View>
                    </HeaderBackground>

                    <View style={styles.badgesOverlay}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{wishlist.privacy}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.body}>
                    {wishlist.description && (
                        <Text style={styles.description} numberOfLines={2}>
                            {wishlist.description}
                        </Text>
                    )}

                    <View style={styles.footer}>
                        <View style={styles.infoRow}>
                            {wishlist.due_date && (
                                <View style={styles.infoItem}>
                                    <Calendar size={14} color={COLORS.gray[500]} />
                                    <Text style={styles.infoText}>
                                        {new Date(wishlist.due_date).toLocaleDateString()}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.infoItem}>
                                <Eye size={14} color={COLORS.gray[500]} />
                                <Text style={styles.infoText}>{wishlist.view_count}</Text>
                            </View>
                        </View>

                        {showDelete && onDelete && (
                            <TouchableOpacity
                                style={[styles.deleteButton, { backgroundColor: appTheme.error + '15' }]}
                                onPress={onDelete}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Trash2 size={16} color={appTheme.error} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Accent strip at bottom */}
                <View style={[styles.accentStrip, { backgroundColor: wishlistTheme.accentColor }]} />
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 0,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.primary + '40', // 40 = 25% opacity for "léger" effect, or just solid? User said "Bord honey glow léger". Let's try lighter opacity or just thin.
    },
    headerContainer: {
        height: 80,
        backgroundColor: COLORS.gray[100],
    },
    headerBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: SPACING.md,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    emoji: {
        fontSize: 24,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.white,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        flex: 1,
    },
    badgesOverlay: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        flexDirection: 'row',
        gap: 4,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.dark,
        textTransform: 'capitalize',
    },
    body: {
        padding: SPACING.md,
    },
    description: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        marginBottom: SPACING.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
    },
    deleteButton: {
        padding: 6,
        borderRadius: 12,
    },
    accentStrip: {
        height: 4,
        width: '100%',
    },
});
