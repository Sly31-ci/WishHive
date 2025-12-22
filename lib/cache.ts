import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@wishhive_cache_';

export const cache = {
    /**
     * Save data to storage with a specific key
     */
    set: async (key: string, data: any) => {
        try {
            const jsonValue = JSON.stringify(data);
            await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, jsonValue);
        } catch (e) {
            console.error('Error saving to cache:', e);
        }
    },

    /**
     * Get data from storage by key
     */
    get: async <T>(key: string): Promise<T | null> => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error reading from cache:', e);
            return null;
        }
    },

    /**
     * Clear a specific cache key
     */
    clear: async (key: string) => {
        try {
            await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
        } catch (e) {
            console.error('Error clearing cache:', e);
        }
    },

    /**
     * Clear all app caches
     */
    clearAll: async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
            await AsyncStorage.multiRemove(cacheKeys);
        } catch (e) {
            console.error('Error clearing all caches:', e);
        }
    }
};
