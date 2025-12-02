import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Trigger light haptic feedback
 */
export function lightHaptic() {
    if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
}

/**
 * Trigger medium haptic feedback
 */
export function mediumHaptic() {
    if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
}

/**
 * Trigger heavy haptic feedback
 */
export function heavyHaptic() {
    if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
}

/**
 * Trigger success haptic feedback
 */
export function successHaptic() {
    if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
}

/**
 * Trigger warning haptic feedback
 */
export function warningHaptic() {
    if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
}

/**
 * Trigger error haptic feedback
 */
export function errorHaptic() {
    if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
}

/**
 * Trigger selection haptic feedback
 */
export function selectionHaptic() {
    if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
    }
}
