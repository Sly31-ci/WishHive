import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet } from 'react-native';
import { useSearchParams } from 'expo-router';

export default function WishlistDetail() {
  const { id } = useSearchParams() as { id?: string };

  return (
    <GestureHandlerRootView style={styles.flex}>
      <View style={styles.container}>
        <Text style={styles.title}>Wishlist</Text>
        <Text>ID: {id ?? 'unknown'}</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
});
