import { Tabs } from 'expo-router';
import React from 'react';
import TabBarV2 from '@/components/v2/navigation/TabBarV2';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <TabBarV2 {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="wishlists"
        options={{
          title: 'Wishlists',
        }}
      />

      {/* Placeholder for Add Button logic in TabBarV2 */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Create',
        }}
      />

      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Shop',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
