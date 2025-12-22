import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const SENTRY_DSN = Constants.expoConfig?.extra?.sentryDsn || process.env.EXPO_PUBLIC_SENTRY_DSN;

export const initSentry = () => {
    if (Platform.OS === 'web') return; // Sentry react-native can be finicky on web

    if (!SENTRY_DSN) {
        if (__DEV__) {
            console.warn('Sentry DSN not found, skipping initialization');
        }
        return;
    }

    Sentry.init({
        dsn: SENTRY_DSN,
        debug: __DEV__,
        environment: __DEV__ ? 'development' : 'production',
        tracesSampleRate: 1.0,
    });
};

export { Sentry };
