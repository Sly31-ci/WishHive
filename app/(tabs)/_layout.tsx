import { Tabs } from 'expo-router';
import { Home, List, ShoppingBag, User, Plus } from 'lucide-react-native';
import { View, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { BRAND_PALETTE } from '@/theme/colors';

/**
 * 🎨 BOTTOM NAVIGATION - REFONTE PREMIUM (V1.5 Restored)
 * 
 * Design iOS-first :
 * - Hive Purple (#7F5BFF) comme couleur principale
 * - Icônes grandes et lisibles (28px)
 * - Pas de labels (minimaliste)
 * - FAB central Honey Glow
 * - Animations fluides
 */

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND_PALETTE.pureWhite,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarShowLabel: false, // ✅ Minimaliste - pas de labels
        tabBarStyle: {
          backgroundColor: BRAND_PALETTE.hivePurple, // 🟣 Hive Purple
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 12,
          height: Platform.OS === 'ios' ? 85 : 70,
          position: 'absolute',
          elevation: 0,
          shadowColor: BRAND_PALETTE.hivePurple,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Home size={28} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlists"
        options={{
          title: 'Wishlists',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <List size={28} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />

      {/* 🎯 FAB Central - Honey Glow */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused }) => (
            <View style={styles.fabWrapper}>
              <View style={[styles.fab, focused && styles.fabActive]}>
                <Plus size={32} color={BRAND_PALETTE.pureWhite} strokeWidth={3} />
              </View>
            </View>
          ),
          tabBarIconStyle: styles.fabIconStyle,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/wishlists/create');
          },
        }}
      />

      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <ShoppingBag size={28} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <User size={28} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // ✅ Highlight subtil
  },
  fabWrapper: {
    position: 'relative',
    top: -30, // ✅ Élève le FAB
  },
  fabIconStyle: {
    marginTop: -15,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: BRAND_PALETTE.honeyGlow, // 🟡 Honey Glow
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BRAND_PALETTE.honeyGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: BRAND_PALETTE.pureWhite,
  },
  fabActive: {
    transform: [{ scale: 1.05 }], // ✅ Animation subtile au focus
  },
});
