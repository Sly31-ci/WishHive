import React from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BORDER_RADIUS, SPACING } from '@/constants/theme';

interface SwipeableRowProps {
    children: React.ReactNode;
    onDelete: () => void;
    enabled?: boolean;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const TRANSLATE_X_THRESHOLD = -80;

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
    children,
    onDelete,
    enabled = true
}) => {
    const { theme } = useTheme();
    const translateX = React.useRef(new Animated.Value(0)).current;

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => enabled,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return enabled && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            },
            onPanResponderMove: (_, gestureState) => {
                const x = Math.min(0, Math.max(gestureState.dx, -100));
                translateX.setValue(x);
            },
            onPanResponderRelease: (_, gestureState) => {
                const shouldBeDismissed = gestureState.dx < TRANSLATE_X_THRESHOLD;
                if (shouldBeDismissed) {
                    Animated.timing(translateX, {
                        toValue: -SCREEN_WIDTH,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        onDelete();
                    });
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const itemStyle = {
        transform: [{ translateX }],
    };

    const iconOpacity = translateX.interpolate({
        inputRange: [-100, TRANSLATE_X_THRESHOLD, 0],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: theme.error + '20' }]}>
                <Animated.View style={[styles.icon, { opacity: iconOpacity }]}>
                    <Trash2 color={theme.error} size={24} />
                </Animated.View>
            </View>
            <Animated.View
                style={[styles.item, itemStyle]}
                {...panResponder.panHandlers}
            >
                {children}
            </Animated.View>
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
