import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Register the device for push notifications and return the Expo Push Token
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
    if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
    }

    const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

    if (!projectId) {
        console.log('Project ID not found in expo config');
    }

    try {
        const token = (await Notifications.getExpoPushTokenAsync({
            projectId,
        })).data;

        console.log('Expo Push Token:', token);

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FFCC33',
            });
        }

        return token;
    } catch (e) {
        console.error('Error getting push token:', e);
        return null;
    }
}

/**
 * Save the push token for the current user in Supabase
 */
export async function savePushTokenInSupabase(token: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // We assume the profiles table has a push_token column
    // If not, we should probably add it or use a separate user_devices table
    const { error } = await supabase
        .from('profiles')
        .update({
            settings: {
                ...(await getUserSettings(user.id)),
                push_token: token
            }
        })
        .eq('id', user.id);

    if (error) {
        console.error('Error saving push token in Supabase:', error);
    }
}

async function getUserSettings(userId: string) {
    const { data } = await supabase.from('profiles').select('settings').eq('id', userId).single();
    return data?.settings || {};
}
