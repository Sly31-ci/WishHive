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
import { router, Stack } from 'expo-router';
import { Lock, ShieldCheck } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/Input';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

export default function ResetPasswordScreen() {
    const { showToast } = useToast();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!password || !confirmPassword) {
            showToast({
                type: 'warning',
                message: 'Remplis les deux champs mot de passe.',
            });
            return;
        }

        if (password.length < 6) {
            showToast({
                type: 'warning',
                message: 'Le mot de passe doit contenir au moins 6 caractères.',
            });
            return;
        }

        if (password !== confirmPassword) {
            showToast({
                type: 'error',
                message: 'Les mots de passe ne correspondent pas.',
            });
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            showToast({
                type: 'success',
                message: 'Ton mot de passe a bien été mis à jour.',
            });

            router.replace('/(tabs)');
        } catch (err: any) {
            showToast({
                type: 'error',
                message: err.message || 'Impossible de mettre à jour le mot de passe. Réessaie plus tard.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Nouveau mot de passe',
                    headerBackVisible: false,
                }}
            />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Card style={styles.card}>
                        <View style={styles.iconContainer}>
                            <ShieldCheck size={48} color={COLORS.primary} />
                        </View>

                        <Text style={styles.title}>Sécurise ton compte</Text>
                        <Text style={styles.subtitle}>
                            Choisis un nouveau mot de passe pour ton compte WishHive.
                        </Text>

                        <Input
                            label="Nouveau mot de passe"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<Lock size={20} color={COLORS.gray[400]} />}
                        />

                        <Input
                            label="Confirme le mot de passe"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            icon={<Lock size={20} color={COLORS.gray[400]} />}
                        />

                        <Button
                            title="Mettre à jour le mot de passe"
                            onPress={handleUpdatePassword}
                            loading={loading}
                            style={styles.button}
                        />

                        <TouchableOpacity
                            onPress={() => router.replace('/(auth)/login')}
                            style={styles.cancelLink}
                        >
                            <Text style={styles.cancelLinkText}>Annuler et revenir à la connexion</Text>
                        </TouchableOpacity>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
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
    card: {
        padding: SPACING.xl,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    button: {
        marginTop: SPACING.lg,
        width: '100%',
    },
    cancelLink: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    cancelLinkText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[500],
        fontWeight: '500',
    },
});
