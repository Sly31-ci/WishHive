/**
 * 🍩 StoryCircle - Composant Story style Instagram
 * 
 * Features:
 * - Gradient ring (Honey->Purple)
 * - Animation de scale au press
 * - Indication "Vu" (gris) vs "Nouveau" (gradient)
 * - Support image ou placeholder
 * - Label nom tronqué
 */

import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeV2, brand, light, spacing, radius } from '@/theme/v2';
import TextV2 from '../TextV2';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface StoryCircleProps {
    id: string;
    imageUrl?: string;
    name: string;
    hasUnseen?: boolean;
    isAddStory?: boolean;
    onPress: () => void;
}

export default function StoryCircle({
    id,
    imageUrl,
    name,
    hasUnseen = true,
    isAddStory = false,
    onPress
}: StoryCircleProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withTiming(0.95, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
        onPress();
    };

    // Taille du cercle
    const SIZE = 72;
    const INNER_SIZE = SIZE - 6;

    return (
        <View style={styles.container}>
            <AnimatedPressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.circleContainer, animatedStyle]}
            >
                {/* Gradient Ring (if unseen or add story) */}
                {(hasUnseen || isAddStory) ? (
                    <LinearGradient
                        colors={[brand.honeyGlow, brand.hivePurple]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.ring, { width: SIZE, height: SIZE, borderRadius: SIZE / 2 }]}
                    >
                        <View style={[styles.innerBorder, { width: INNER_SIZE, height: INNER_SIZE, borderRadius: INNER_SIZE / 2 }]}>
                            <Image
                                source={{ uri: imageUrl || 'https://via.placeholder.com/100' }}
                                style={[styles.image, { width: INNER_SIZE - 4, height: INNER_SIZE - 4, borderRadius: (INNER_SIZE - 4) / 2 }]}
                            />
                            {/* Overlay Add Icon */}
                            {isAddStory && (
                                <View style={styles.addOverlay}>
                                    <TextV2 variant="h4" color="#FFF">+</TextV2>
                                </View>
                            )}
                        </View>
                    </LinearGradient>
                ) : (
                    // Seen story (grey ring)
                    <View style={[styles.seenRing, { width: SIZE, height: SIZE, borderRadius: SIZE / 2 }]}>
                        <View style={[styles.innerBorder, { width: INNER_SIZE, height: INNER_SIZE, borderRadius: INNER_SIZE / 2 }]}>
                            <Image
                                source={{ uri: imageUrl || 'https://via.placeholder.com/100' }}
                                style={[styles.image, { width: INNER_SIZE - 4, height: INNER_SIZE - 4, borderRadius: (INNER_SIZE - 4) / 2 }]}
                            />
                        </View>
                    </View>
                )}
            </AnimatedPressable>

            <TextV2
                variant="caption"
                align="center"
                style={styles.name}
                numberOfLines={1}
            >
                {isAddStory ? 'Your Story' : name}
            </TextV2>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: spacing.md,
        width: 76,
    },
    circleContainer: {
        marginBottom: spacing.xs,
    },
    ring: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    seenRing: {
        backgroundColor: light.border.default,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerBorder: {
        backgroundColor: light.background.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: light.background.primary,
    },
    image: {
        backgroundColor: light.background.secondary,
    },
    name: {
        width: '100%',
    },
    addOverlay: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: brand.honeyGlow,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: light.background.primary,
    }
});
