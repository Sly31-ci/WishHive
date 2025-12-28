import { supabase } from './supabase';
import { Database } from '@/types/database';

export type Notification = Database['public']['Tables']['notifications']['Row'];

/**
 * Fetch notifications for the current user
 */
export async function getNotifications(limit = 20): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }

    return data || [];
}

/**
 * Mark a notification as read
 */
export async function markAsRead(id: string): Promise<void> {
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

    if (error) {
        console.error('Error marking notification as read:', error);
    }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

    if (error) {
        console.error('Error marking all as read:', error);
    }
}

/**
 * Create a new notification (usually handled server-side via Edge Functions/DB Triggers, 
 * but useful for direct system notifications or testing)
 */
export async function createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data?: any
): Promise<void> {
    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId,
            type,
            title,
            message,
            data,
        });

    if (error) {
        console.error('Error creating notification:', error);
    }
}

/**
 * Get count of unread notifications
 */
export async function getUnreadCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

    if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }

    return count || 0;
}
