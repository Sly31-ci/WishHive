import React from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';

interface SwipeableItemProps {
    children: React.ReactNode;
    onDelete: () => void;
    disabled?: boolean;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const TRANSLATE_X_THRESHOLD = -80;

export const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onDelete, disabled = false }) => {
    const { theme } = useTheme();
    const translateX = React.useRef(new Animated.Value(0)).current;

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !disabled,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return !disabled && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            },
            onPanResponderMove: (_, gestureState) => {
                const x = Math.min(0, Math.max(gestureState.dx, -100));
                translateX.setValue(x);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < TRANSLATE_X_THRESHOLD) {
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
            <View style={[styles.iconContainer, { backgroundColor: theme.error }]}>
                <Animated.View style={[styles.icon, { opacity: iconOpacity }]}>
                    <Trash2 color="white" size={24} />
                </Animated.View>
            </View>
            <Animated.View
                style={[styles.item, { backgroundColor: theme.background }, itemStyle]}
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
