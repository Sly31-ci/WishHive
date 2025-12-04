import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DevProfileSelector } from '@/components/DevProfileSelector';

// Development mode - bypass authentication
const DEV_MODE = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

console.log('🔧 DEV_MODE:', DEV_MODE);
console.log('🔧 EXPO_PUBLIC_DEV_MODE:', process.env.EXPO_PUBLIC_DEV_MODE);

function RootLayoutContent() {
  useFrameworkReady();
  const { session, loading } = useAuth();

  useEffect(() => {
    console.log('🔧 Navigation check - DEV_MODE:', DEV_MODE, 'loading:', loading, 'session:', !!session);

    // In DEV_MODE, skip authentication and go directly to tabs
    if (DEV_MODE) {
      console.log('✅ DEV_MODE active - redirecting to tabs');
      // Use setTimeout to ensure component is mounted before navigation
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
      return;
    }

    if (!loading) {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [session, loading]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="wishlists/create" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <DevProfileSelector />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
