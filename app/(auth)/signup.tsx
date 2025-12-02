import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signUp(email, password, username);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>WishHive</Text>
          <Text style={styles.tagline}>Join the Wishing Community</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Username"
            placeholder="johndoe"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            icon={<User size={20} color={COLORS.gray[400]} />}
          />

          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            icon={<Mail size={20} color={COLORS.gray[400]} />}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={20} color={COLORS.gray[400]} />}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={loading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    fontSize: FONT_SIZES.huge,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[600],
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: SPACING.md,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  link: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
