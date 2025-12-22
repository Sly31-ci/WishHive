import { Platform } from 'react-native';
import { Mixpanel } from 'mixpanel-react-native';
import Constants from 'expo-constants';

const MIXPANEL_TOKEN = Constants.expoConfig?.extra?.mixpanelToken || process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;

const trackAutomaticEvents = true;
const isNative = Platform.OS !== 'web';
const mixpanel = (MIXPANEL_TOKEN && isNative) ? new Mixpanel(MIXPANEL_TOKEN, trackAutomaticEvents) : null;

if (mixpanel) {
    mixpanel.init();
}

export const analytics = {
    track: (eventName: string, properties?: Record<string, any>) => {
        if (__DEV__) {
            console.log(`[Analytics] Event: ${eventName}`, properties);
        }
        mixpanel?.track(eventName, properties);
    },

    identify: (userId: string, properties?: Record<string, any>) => {
        if (__DEV__) {
            console.log(`[Analytics] Identify: ${userId}`, properties);
        }
        mixpanel?.identify(userId);
        if (properties) {
            mixpanel?.getPeople().set(properties);
        }
    },

    reset: () => {
        if (__DEV__) {
            console.log('[Analytics] Reset');
        }
        mixpanel?.reset();
    },

    setProfile: (properties: Record<string, any>) => {
        mixpanel?.getPeople().set(properties);
    }
};
