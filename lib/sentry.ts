import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const SENTRY_DSN = Constants.expoConfig?.extra?.sentryDsn || process.env.EXPO_PUBLIC_SENTRY_DSN;

export const initSentry = () => {
    if (Platform.OS === 'web') return false;

    if (!SENTRY_DSN || SENTRY_DSN === '00000000-0000-0000-0000-000000000000' || SENTRY_DSN === 'YOUR_SENTRY_DSN_HERE') {
        return false;
    }

    try {
        Sentry.init({
            dsn: SENTRY_DSN,
            debug: __DEV__,
            environment: __DEV__ ? 'development' : 'production',
            tracesSampleRate: 1.0,
            enableNative: (Platform.OS as string) !== 'web',
        });
        return true;
    } catch (e) {
        if (__DEV__) {
            console.log('Sentry initialization failed', e);
        }
        return false;
    }
};

export { Sentry };
