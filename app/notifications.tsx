import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Bell, Heart, User, Gift, Eye, MessageSquare } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { getNotifications, markAsRead, Notification } from '@/lib/notifications';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import * as Haptics from 'expo-haptics';



export default function NotificationsScreen() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();

        if (user) {
            const channel = supabase
                .channel(`user_notifications_${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        const newNotif = payload.new as Notification;
                        setNotifications(prev => [newNotif, ...prev]);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);

    const loadNotifications = async () => {
        setLoading(true);
        const data = await getNotifications();
        setNotifications(data);
        setLoading(false);
    };

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'follow':
                return <User size={24} color={COLORS.primary} />;
            case 'like':
                return <Heart size={24} color={COLORS.error} />;
            case 'gift':
                return <Gift size={24} color={COLORS.accent} />;
            case 'message':
                return <MessageSquare size={24} color={COLORS.primary} />;
            case 'view':
                return <Eye size={24} color={COLORS.gray[400]} />;
            default:
                return <Bell size={24} color={COLORS.gray[500]} />;
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.item, !item.read && styles.unreadItem]}
            onPress={() => handleMarkAsRead(item.id)}
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
                    <View style={styles.list}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <View key={i} style={styles.skeletonItem}>
                                <SkeletonLoader width={48} height={48} borderRadius={24} />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <View style={{ marginBottom: 8 }}>
                                        <SkeletonLoader width="60%" height={16} />
                                    </View>
                                    <SkeletonLoader width="90%" height={12} />
                                </View>
                            </View>
                        ))}
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
    skeletonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.sm,
    },
});
