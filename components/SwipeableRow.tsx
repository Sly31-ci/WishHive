import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BORDER_RADIUS, SPACING } from '@/constants/theme';

interface SwipeableRowProps {
    children: React.ReactNode;
    onDelete: () => void;
    enabled?: boolean;
}

const TRANSLATE_X_THRESHOLD = -80;

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
    children,
    onDelete,
    enabled = true
}) => {
    const { theme } = useTheme();
    const translateX = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .enabled(enabled)
        .activeOffsetX([-10, 10]) // Don't activate on vertical scroll
        .onUpdate((event) => {
            // Only allow swiping left
            translateX.value = Math.min(0, Math.max(event.translationX, -100));
        })
        .onEnd(() => {
            const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD;
            if (shouldBeDismissed) {
                // Animate completely away before calling onDelete
                translateX.value = withTiming(-1000, undefined, (isFinished) => {
                    if (isFinished) {
                        runOnJS(onDelete)();
                    }
                });
            } else {
                translateX.value = withSpring(0);
            }
        });

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const rIconContainerStyle = useAnimatedStyle(() => {
        const opacity = withTiming(translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0.5);
        return { opacity };
    });

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: theme.error + '20' }]}>
                <Animated.View style={[styles.icon, rIconContainerStyle]}>
                    <Trash2 color={theme.error} size={24} />
                </Animated.View>
            </View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.item, rStyle]}>
                    {children}
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
        marginBottom: SPACING.sm,
    },
    item: {
        width: '100%',
    },
    iconContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: SPACING.xl,
    },
    icon: {
        width: 24,
        height: 24,
    },
});
