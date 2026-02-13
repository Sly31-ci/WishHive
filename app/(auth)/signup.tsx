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
import Button from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';
import { getErrorMessage } from '@/lib/errorMessages';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password) {
      setError('Remplis tous les champs pour créer ton compte.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Entre une adresse email valide.');
      return;
    }

    if (password.length < 6) {
      setError('Ton mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await signUp(email.trim(), password, username.trim());

      // Si la confirmation email est activée, la session sera null
      if (!response.data.session) {
        setSuccess(true);
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>Vérifie tes emails 📧</Text>
            <Text style={styles.tagline}>
              Nous t&apos;avons envoyé un lien pour activer ton compte. Clique dessus puis reviens te connecter.
            </Text>
          </View>
          <Button
            title="Aller à la connexion"
            onPress={() => router.replace('/(auth)/login')}
            style={styles.button}
          />
        </View>
      </View>
    );
  }

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
          <Text style={styles.tagline}>Crée ton compte et ta première wishlist.</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nom d'utilisateur"
            placeholder="ex: johndoe"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            icon={<User size={20} color={COLORS.gray[400]} />}
          />

          <Input
            label="Email"
            placeholder="toi@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            icon={<Mail size={20} color={COLORS.gray[400]} />}
          />

          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<Lock size={20} color={COLORS.gray[400]} />}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title="Créer mon compte"
            onPress={handleSignup}
            loading={loading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Tu as déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.link}>Se connecter</Text>
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
    textAlign: 'center',
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
    marginTop: SPACING.sm,
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
