/**
 * ➕ CustomFAB - Bouton Central Navigation V2
 * 
 * Features:
 * - Positionné au centre de la TabBar
 * - Animation de scale au press
 * - Gradient Honey->Purple
 * - Ombre dynamique
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { brand, shadowsLight, radius } from '@/theme/v2';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CustomFABProps {
    onPress: () => void;
}

export default function CustomFAB({ onPress }: CustomFABProps) {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
                { rotate: `${rotation.value}deg` }
            ],
        };
    });

    const handlePressIn = () => {
        scale.value = withTiming(0.9, { duration: 100 });
        rotation.value = withTiming(90, { duration: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
        rotation.value = withTiming(0, { duration: 300 });
        onPress();
    };

    return (
        <View style={styles.container} pointerEvents="box-none">
            <AnimatedPressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.buttonContainer, animatedStyle]}
            >
                <LinearGradient
                    colors={[brand.honeyGlow, brand.hivePurple]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <Plus color="#FFFFFF" size={32} strokeWidth={2.5} />
                </LinearGradient>
            </AnimatedPressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30, // Positionné au-dessus de la tab bar
        alignSelf: 'center',
        zIndex: 10,
    },
    buttonContainer: {
        width: 64,
        height: 64,
        borderRadius: radius.full,
        ...shadowsLight.primaryLarge, // Grosse ombre colorée
        elevation: 8,
    },
    gradient: {
        flex: 1,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF', // Bordure blanche pour détacher du fond
    }
});
