import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS } from '@/constants/theme';

interface SkeletonLoaderProps {
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
    variant?: 'rectangle' | 'circle' | 'text';
}

export function SkeletonLoader({
    width = '100%',
    height = 20,
    borderRadius = BORDER_RADIUS.sm,
    style,
    variant = 'rectangle',
}: SkeletonLoaderProps) {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        );
        animation.start();

        return () => animation.stop();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    const computedBorderRadius = variant === 'circle'
        ? (typeof height === 'number' ? height / 2 : 50)
        : borderRadius;

    const computedWidth = variant === 'circle'
        ? height
        : width;

    return (
        <View
            style={[
                styles.container,
                {
                    width: computedWidth,
                    height,
                    borderRadius: computedBorderRadius,
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            >
                <LinearGradient
                    colors={[
                        COLORS.gray[200],
                        COLORS.gray[100],
                        COLORS.gray[200],
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>
        </View>
    );
}

// Pre-built skeleton variants for common use cases
export function SkeletonText({ lines = 1, style }: { lines?: number; style?: ViewStyle }) {
    return (
        <View style={[styles.textContainer, style]}>
            {Array.from({ length: lines }).map((_, index) => (
                <SkeletonLoader
                    key={index}
                    height={14}
                    width={index === lines - 1 ? '60%' : '100%'}
                    style={index > 0 ? styles.textLine : undefined}
                />
            ))}
        </View>
    );
}

export function SkeletonAvatar({ size = 48 }: { size?: number }) {
    return <SkeletonLoader variant="circle" height={size} />;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.gray[200],
        overflow: 'hidden',
    },
    textContainer: {
        gap: 8,
    },
    textLine: {
        marginTop: 8,
    },
});
