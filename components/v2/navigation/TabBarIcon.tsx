/**
 * 🏠 TabBarIcon - Icône animée pour la navigation V2
 * 
 * Features:
 * - Animation de scale/bounce à l'activation
 * - Changement de couleur dynamique
 * - Dot indicateur si actif
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
    FadeIn,
    FadeOut
} from 'react-native-reanimated';
import { brand, light } from '@/theme/v2';
import { LucideIcon } from 'lucide-react-native';

interface TabBarIconProps {
    focused: boolean;
    icon: LucideIcon;
    color: string;
    size: number;
    name: string; // Pour l'accessibilité ou debug
}

export default function TabBarIcon({ focused, icon: Icon, color, size, name }: TabBarIconProps) {
    const scale = useSharedValue(focused ? 1 : 0.8);
    const translateY = useSharedValue(focused ? -2 : 0);

    useEffect(() => {
        if (focused) {
            scale.value = withSpring(1.2, { damping: 10, stiffness: 200 }); // Petit effet bounce
            translateY.value = withSpring(-4);
        } else {
            scale.value = withTiming(1, { duration: 200 });
            translateY.value = withTiming(0);
        }
    }, [focused]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
                { translateY: translateY.value }
            ],
        };
    });

    // On utilise la props color qui vient de react-navigation habituellement,
    // mais ici on peut forcer nos couleurs si besoin.
    const activeColor = brand.hivePurple;
    const inactiveColor = light.text.tertiary;

    return (
        <View style={styles.container}>
            <Animated.View style={animatedStyle}>
                <Icon
                    size={size}
                    color={focused ? activeColor : inactiveColor}
                    strokeWidth={focused ? 2.5 : 2}
                />
            </Animated.View>

            {/* Petit point indicateur sous l'icône active */}
            {focused && (
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    style={styles.dot}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
    },
    dot: {
        position: 'absolute',
        bottom: -6,
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: brand.honeyGlow,
    }
});
