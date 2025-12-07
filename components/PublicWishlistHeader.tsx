import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { WishlistTheme, DEFAULT_THEME } from '@/constants/wishlistThemes';
import { router } from 'expo-router';

interface PublicWishlistHeaderProps {
    title: string;
    theme: any; // Raw theme from DB
    onShare: () => void;
    description?: string | null;
    dueDate?: string | null;
}

export function PublicWishlistHeader({ title, theme, onShare, description, dueDate }: PublicWishlistHeaderProps) {
    const currentTheme: WishlistTheme = theme && typeof theme === 'object'
        ? (theme as unknown as WishlistTheme)
        : DEFAULT_THEME;

    const HeaderWrapper = ({ children }: { children: React.ReactNode }) => {
        const style = styles.headerBackground;

        if (currentTheme.gradient) {
            return (
                <LinearGradient
                    colors={[currentTheme.primaryColor, currentTheme.secondaryColor]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={style}
                >
                    {children}
                </LinearGradient>
            );
        }
        return (
            <View style={[style, { backgroundColor: currentTheme.primaryColor }]}>
                {children}
            </View>
        );
    };

    const textColor = currentTheme.template === 'minimal' ? COLORS.dark : COLORS.white;
    const subTextColor = currentTheme.template === 'minimal' ? COLORS.gray[600] : 'rgba(255,255,255,0.8)';

    return (
        <View style={styles.container}>
            <HeaderWrapper>
                <View style={styles.actions}>
                    {/* If we had a home button for public users, it would go here. For now, empty or back if inside app context? 
                Actually, usually public view might be standalone. But if navigated within app... 
                Let's assume no back button for pure web public view, but 'Home' for app.
                We'll hide back button for now as per "Design Épuré". 
            */}
                    <View style={{ flex: 1 }} />

                    <TouchableOpacity onPress={onShare} style={styles.iconButton}>
                        <Share2 size={24} color={textColor} />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.title, { color: textColor }]}>
                    {currentTheme.emoji} {title}
                </Text>

                {description && (
                    <Text style={[styles.description, { color: subTextColor }]}>
                        {description}
                    </Text>
                )}
            </HeaderWrapper>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomLeftRadius: BORDER_RADIUS.xl,
        borderBottomRightRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
            web: {
                marginBottom: SPACING.md,
            }
        }),
    },
    headerBackground: {
        padding: SPACING.lg,
        paddingTop: 60, // Safe area approximation
        paddingBottom: SPACING.xl,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: SPACING.md,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        marginBottom: SPACING.sm,
    },
    description: {
        fontSize: FONT_SIZES.md,
        lineHeight: 24,
    },
});

import { Platform } from 'react-native';
