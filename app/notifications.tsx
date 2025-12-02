import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Bell, Heart, User, Gift } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

// Mock notification type since we don't have a table yet
type Notification = {
    id: string;
    type: 'follow' | 'like' | 'gift';
    title: string;
    message: string;
    created_at: string;
    read: boolean;
};

export default function NotificationsScreen() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading notifications
        setTimeout(() => {
            setNotifications([
                {
                    id: '1',
                    type: 'follow',
                    title: 'New Follower',
                    message: 'Sarah started following you',
                    created_at: new Date().toISOString(),
                    read: false,
                },
                {
                    id: '2',
                    type: 'gift',
                    title: 'Gift Purchased',
                    message: 'Someone bought an item from your Birthday Wishlist!',
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    read: true,
                },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'follow':
                return <User size={24} color={COLORS.primary} />;
            case 'like':
                return <Heart size={24} color={COLORS.error} />;
            case 'gift':
                return <Gift size={24} color={COLORS.accent} />;
            default:
                return <Bell size={24} color={COLORS.gray[500]} />;
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.item, !item.read && styles.unreadItem]}
        >
            <View style={styles.iconContainer}>
                {getIcon(item.type)}
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>
                    {new Date(item.created_at).toLocaleDateString()}
                </Text>
            </View>
            {!item.read && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Notifications',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.container}>
                {loading ? (
                    <View style={styles.centerContainer}>
                        <Text>Loading...</Text>
                    </View>
                ) : notifications.length > 0 ? (
                    <FlatList
                        data={notifications}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                    />
                ) : (
                    <View style={styles.centerContainer}>
                        <Bell size={64} color={COLORS.gray[300]} />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: SPACING.md,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.sm,
    },
    unreadItem: {
        backgroundColor: COLORS.primary + '05',
    },
    iconContainer: {
        marginRight: SPACING.md,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 2,
    },
    message: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
        marginBottom: 4,
    },
    time: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[400],
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginLeft: SPACING.sm,
    },
    emptyText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.lg,
        color: COLORS.gray[500],
    },
});
