import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const SENTRY_DSN = Constants.expoConfig?.extra?.sentryDsn || process.env.EXPO_PUBLIC_SENTRY_DSN;

export const initSentry = () => {
    if (Platform.OS === 'web') return;

    if (!SENTRY_DSN || SENTRY_DSN === 'YOUR_SENTRY_DSN_HERE') {
        // Silently skip in dev if not configured
        return;
    }

    try {
        Sentry.init({
            dsn: SENTRY_DSN,
            debug: __DEV__,
            environment: __DEV__ ? 'development' : 'production',
            tracesSampleRate: 1.0,
            enableNative: (Platform.OS as string) !== 'web',
        });
    } catch (e) {
        if (__DEV__) {
            console.log('Sentry initialization failed', e);
        }
    }
};

export { Sentry };
