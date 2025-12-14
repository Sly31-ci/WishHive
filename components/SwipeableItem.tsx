import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    withTiming,
} from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';

interface SwipeableItemProps {
    children: React.ReactNode;
    onDelete: () => void;
    disabled?: boolean;
}

const TRANSLATE_X_THRESHOLD = -80;

export const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onDelete, disabled = false }) => {
    const { theme } = useTheme();
    const translateX = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .enabled(!disabled)
        .activeOffsetX([-10, 10])
        .onUpdate((event) => {
            translateX.value = Math.min(0, Math.max(event.translationX, -100));
        })
        .onEnd(() => {
            const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD;
            if (shouldBeDismissed) {
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
            <View style={[styles.iconContainer, { backgroundColor: theme.error }]}>
                <Animated.View style={[styles.icon, rIconContainerStyle]}>
                    <Trash2 color="white" size={24} />
                </Animated.View>
            </View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.item, { backgroundColor: theme.background }, rStyle]}>
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
        marginBottom: SPACING.md,
    },
    item: {
        width: '100%',
        borderRadius: BORDER_RADIUS.lg,
        zIndex: 1,
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

