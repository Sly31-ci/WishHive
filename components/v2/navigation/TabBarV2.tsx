import React from 'react';
import { View, StyleSheet, Platform, Dimensions, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { light, shadowsLight, radius, spacing } from '@/theme/v2';
import TabBarIcon from './TabBarIcon';
import CustomFAB from './CustomFAB';

// On simule pour l'instant l'import des icônes pour l'exemple, 
// dans la vraie implémentation, elles viendront de la config de navigation
import { Home, Search, MessageSquare, User } from 'lucide-react-native';

// Hauteur de la TabBar
const TAB_BAR_HEIGHT = 80;
const { width } = Dimensions.get('window');

// Ce composant sera utilisé comme `tabBar` dans `Tabs` de Expo Router
export default function TabBarV2({ state, descriptors, navigation }: BottomTabBarProps) {

    return (
        <View style={styles.container}>
            {/* Le FAB est rendu en dehors du flux normal de la row des tabs */}
            <CustomFAB onPress={() => router.push('/wishlists/create')} />

            <View style={styles.tabBarBackground}>
                {/* Glassmorphism Effect */}
                <BlurView
                    style={StyleSheet.absoluteFill}
                    intensity={80}
                    tint="light"
                />

                {/* Tab Items Row */}
                <View style={styles.tabsRow}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        // Si c'est la route "add" (le bouton central), on ne l'affiche pas ici
                        // car il est géré par le CustomFAB
                        if (route.name === 'add') {
                            return <View key={route.key} style={styles.spacer} />;
                        }

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        // Mapping basique des icônes pour l'exemple
                        // Dans la vraie app, on récupérera l'icône depuis `options`
                        let Icon = Home;
                        if (route.name === 'index') Icon = Home;
                        if (route.name === 'marketplace') Icon = Search;
                        if (route.name === 'wishlists') Icon = MessageSquare; // Temporary mapping
                        if (route.name === 'profile') Icon = User;

                        return (
                            <Pressable
                                key={route.key}
                                onPress={onPress}
                                style={styles.tabItem}
                            >
                                <TabBarIcon
                                    focused={isFocused}
                                    icon={Icon}
                                    color=""
                                    size={24}
                                    name={route.name}
                                />
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: TAB_BAR_HEIGHT + 30, // Un peu plus haut pour laisser place au FAB
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    tabBarBackground: {
        width: width,
        height: TAB_BAR_HEIGHT,
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Fallback semi-transparent
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        ...shadowsLight.lg, // Grosse ombre vers le haut
        overflow: 'hidden', // Pour le BlurView et le border radius
    },
    tabsRow: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    spacer: {
        width: 70, // Espace pour le bouton central
    }
});
