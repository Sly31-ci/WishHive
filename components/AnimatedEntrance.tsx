import React, { useEffect } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    withDelay,
    Easing
} from 'react-native-reanimated';

interface AnimatedEntranceProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    offset?: number;
    type?: 'spring' | 'timing';
}

/**
 * A reusable component to animate children as they enter the screen.
 */
export function AnimatedEntrance({
    children,
    delay = 0,
    duration = 500,
    direction = 'up',
    offset = 50,
    type = 'spring',
}: AnimatedEntranceProps) {
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(
        direction === 'left' ? -offset : direction === 'right' ? offset : 0
    );
    const translateY = useSharedValue(
        direction === 'up' ? offset : direction === 'down' ? -offset : 0
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    });

    useEffect(() => {
        const config = type === 'spring'
            ? { damping: 15, stiffness: 100 }
            : { duration, easing: Easing.out(Easing.back(1.5)) };

        opacity.value = withDelay(delay, withTiming(1, { duration }));

        if (type === 'spring') {
            translateX.value = withDelay(delay, withSpring(0, config));
            translateY.value = withDelay(delay, withSpring(0, config));
        } else {
            translateX.value = withDelay(delay, withTiming(0, config));
            translateY.value = withDelay(delay, withTiming(0, config));
        }
    }, []);

    return (
        <Animated.View style={animatedStyle}>
            {children}
        </Animated.View>
    );
}
