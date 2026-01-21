/**
 * 👤 AvatarV2 - Avatar Premium avec Design System V2
 * 
 * Features:
 * - Sizes: xs, sm, md, lg, xl, xxl, huge
 * - Image support avec fallback
 * - Initials fallback
 * - Status indicator (online, offline, busy, away)
 * - Progress ring (gamification)
 * - Badge overlay
 * - Pressable avec animation
 */

import React from 'react';
import {
    View,
    Image,
    Text,
    Pressable,
    ViewStyle,
    StyleSheet,
    ImageSourcePropType,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { ThemeV2, brand, light, spacing, radius } from '@/theme/v2';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'huge';
type StatusType = 'online' | 'offline' | 'busy' | 'away';

interface AvatarV2Props {
    source?: ImageSourcePropType;
    name?: string; // For initials fallback
    size?: AvatarSize;
    status?: StatusType;
    progress?: number; // 0-100 for progress ring
    badge?: React.ReactNode; // Badge overlay (e.g., level number)
    onPress?: () => void;
    style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AvatarV2({
    source,
    name,
    size = 'md',
    status,
    progress,
    badge,
    onPress,
    style,
}: AvatarV2Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        if (onPress) {
            scale.value = withTiming(0.95, { duration: 100 });
        }
    };

    const handlePressOut = () => {
        if (onPress) {
            scale.value = withSpring(1, { damping: 10, stiffness: 300 });
        }
    };

    // Size mapping
    const getSizeValue = (): number => {
        const sizes = {
            xs: 24,
            sm: 32,
            md: 40,
            lg: 48,
            xl: 64,
            xxl: 80,
            huge: 120,
        };
        return sizes[size];
    };

    const sizeValue = getSizeValue();

    // Get initials from name
    const getInitials = (): string => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Status indicator color
    const getStatusColor = (): string => {
        const colors = {
            online: light.semantic.success,
            offline: light.text.disabled,
            busy: light.semantic.error,
            away: light.semantic.warning,
        };
        return status ? colors[status] : 'transparent';
    };

    // Progress ring
    const renderProgressRing = () => {
        if (progress === undefined) return null;

        const strokeWidth = size === 'xs' || size === 'sm' ? 2 : 3;
        const radius = (sizeValue + strokeWidth * 2) / 2;
        const circumference = 2 * Math.PI * (radius - strokeWidth);
        const progressOffset = circumference - (progress / 100) * circumference;

        return (
            <Svg
                width={sizeValue + strokeWidth * 4}
                height={sizeValue + strokeWidth * 4}
                style={styles.progressRing}
            >
                {/* Background circle */}
                <Circle
                    cx={(sizeValue + strokeWidth * 4) / 2}
                    cy={(sizeValue + strokeWidth * 4) / 2}
                    r={radius - strokeWidth}
                    stroke={light.border.light}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <Circle
                    cx={(sizeValue + strokeWidth * 4) / 2}
                    cy={(sizeValue + strokeWidth * 4) / 2}
                    r={radius - strokeWidth}
                    stroke={brand.honeyGlow}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${(sizeValue + strokeWidth * 4) / 2} ${(sizeValue + strokeWidth * 4) / 2})`}
                />
            </Svg>
        );
    };

    const Component = onPress ? AnimatedPressable : Animated.View;

    return (
        <View style={[styles.container, style]}>
            {/* Progress Ring */}
            {renderProgressRing()}

            {/* Avatar */}
            <Component
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                // @ts-ignore
                disabled={!onPress}
                style={[
                    styles.avatar,
                    {
                        width: sizeValue,
                        height: sizeValue,
                        borderRadius: sizeValue / 2,
                    },
                    animatedStyle,
                ]}
            >
                {source ? (
                    <Image
                        source={source}
                        style={{
                            width: sizeValue,
                            height: sizeValue,
                            borderRadius: sizeValue / 2,
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        style={[
                            styles.fallback,
                            {
                                width: sizeValue,
                                height: sizeValue,
                                borderRadius: sizeValue / 2,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.initials,
                                {
                                    fontSize: sizeValue * 0.4,
                                },
                            ]}
                        >
                            {getInitials()}
                        </Text>
                    </View>
                )}

                {/* Status Indicator */}
                {status && (
                    <View
                        style={[
                            styles.statusIndicator,
                            {
                                width: sizeValue * 0.25,
                                height: sizeValue * 0.25,
                                borderRadius: (sizeValue * 0.25) / 2,
                                backgroundColor: getStatusColor(),
                                borderWidth: sizeValue > 40 ? 2 : 1.5,
                            },
                        ]}
                    />
                )}

                {/* Badge Overlay */}
                {badge && (
                    <View
                        style={[
                            styles.badge,
                            {
                                width: sizeValue * 0.4,
                                height: sizeValue * 0.4,
                                borderRadius: (sizeValue * 0.4) / 2,
                            },
                        ]}
                    >
                        {badge}
                    </View>
                )}
            </Component>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressRing: {
        position: 'absolute',
    },
    avatar: {
        overflow: 'hidden',
        backgroundColor: light.background.secondary,
    },
    fallback: {
        backgroundColor: brand.honeyGlow,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderColor: light.surface.card,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: brand.hivePurple,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: light.surface.card,
    },
});
