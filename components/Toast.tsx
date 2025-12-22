import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
    type: ToastType;
    message: string;
    duration?: number; // 0 = no auto-dismiss
    onDismiss?: () => void;
    id?: string;
    index?: number;
}

const TOAST_CONFIG = {
    success: {
        icon: CheckCircle2,
        color: COLORS.success,
        backgroundColor: COLORS.success + '15',
    },
    error: {
        icon: AlertCircle,
        color: COLORS.error,
        backgroundColor: COLORS.error + '15',
    },
    warning: {
        icon: AlertTriangle,
        color: COLORS.warning,
        backgroundColor: COLORS.warning + '15',
    },
    info: {
        icon: Info,
        color: COLORS.info,
        backgroundColor: COLORS.info + '15',
    },
};

export function Toast({
    type,
    message,
    onDismiss,
    index = 0,
}: ToastConfig) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const config = TOAST_CONFIG[type];
    const Icon = config.icon;

    useEffect(() => {
        // Haptic feedback on show
        Haptics.impactAsync(
            type === 'error'
                ? Haptics.ImpactFeedbackStyle.Heavy
                : Haptics.ImpactFeedbackStyle.Medium
        );

        // Entrance animation
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: SPACING.lg + index * 80,
                damping: 15,
                stiffness: 150,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [index]);

    const handleDismiss = () => {
        // Exit animation
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -100,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onDismiss) {
                onDismiss();
            }
        });
    };

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: config.backgroundColor },
                {
                    transform: [{ translateY }],
                    opacity,
                },
            ]}
        >
            <View style={styles.content}>
                <Icon size={24} color={config.color} />
                <Text style={[styles.message, { color: COLORS.dark }]} numberOfLines={2}>
                    {message}
                </Text>
                <TouchableOpacity
                    onPress={handleDismiss}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <X size={20} color={COLORS.gray[500]} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: SPACING.md,
        right: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        ...SHADOWS.md,
        zIndex: 9999,
        ...(Platform.OS === 'ios' && {
            shadowColor: COLORS.dark,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
        }),
        ...(Platform.OS === 'android' && {
            elevation: 8,
        }),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        gap: SPACING.sm,
    },
    message: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
        lineHeight: 20,
    },
    closeButton: {
        padding: SPACING.xs,
    },
});
