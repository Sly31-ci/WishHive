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
import { ArrowLeft, Mail, Send } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { Input } from '@/components/Input';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

export default function ForgotPasswordScreen() {
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleResetPassword = async () => {
        if (!email.trim()) {
            showToast({
                type: 'warning',
                message: 'Renseigne ton adresse email.',
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            showToast({
                type: 'error',
                message: 'Entre une adresse email valide.',
            });
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: 'wishhive://reset-password',
            });

            if (error) throw error;

            setEmailSent(true);
            showToast({
                type: 'success',
                message: 'Un email de réinitialisation vient de t’être envoyé.',
                duration: 5000,
            });
        } catch (err: any) {
            const message = err.message?.includes('rate limit')
                ? 'Tu as fait trop de demandes, réessaie dans quelques minutes.'
                : 'Impossible d’envoyer l’email. Réessaie dans un instant.';

            showToast({
                type: 'error',
                message,
            });
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerTitle: 'Vérifie tes emails',
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()}>
                                <ArrowLeft size={24} color={COLORS.dark} />
                            </TouchableOpacity>
                        ),
                    }}
                />
                <View style={styles.container}>
                    <Card style={styles.successCard}>
                        <View style={styles.successIcon}>
                            <Mail size={48} color={COLORS.success} />
                        </View>
                        <Text style={styles.successTitle}>Lien envoyé 📬</Text>
                        <Text style={styles.successText}>
                            Nous avons envoyé un lien de réinitialisation à{'\n'}
                            <Text style={styles.emailText}>{email}</Text>
                        </Text>
                        <Text style={styles.hintText}>
                            Si tu ne le vois pas, pense à vérifier tes spams ou réessaie dans quelques minutes.
                        </Text>
                        <Button
                            title="Retour à la connexion"
                            onPress={() => router.replace('/(auth)/login')}
                            style={styles.button}
                        />
                        <TouchableOpacity
                            onPress={() => setEmailSent(false)}
                            style={styles.resendLink}
                        >
                            <Text style={styles.resendText}>Utiliser une autre adresse</Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Mot de passe oublié',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
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
                            <Mail size={48} color={COLORS.primary} />
                        </View>

                        <Text style={styles.title}>Réinitialise ton mot de passe</Text>
                        <Text style={styles.subtitle}>
                            Entre l&apos;adresse email associée à ton compte. Nous t&apos;enverrons un lien pour choisir un nouveau mot de passe.
                        </Text>

                        <Input
                            label="Email"
                            placeholder="toi@example.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            icon={<Mail size={20} color={COLORS.gray[400]} />}
                        />

                        <Button
                            title="Envoyer le lien"
                            onPress={handleResetPassword}
                            loading={loading}
                            style={styles.button}
                            icon={<Send size={20} color={COLORS.white} />}
                        />

                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backLink}
                        >
                            <Text style={styles.backLinkText}>← Retour à la connexion</Text>
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
    successCard: {
        margin: SPACING.lg,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: `${COLORS.success}20`,
        justifyContent: 'center',
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
    successTitle: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.dark,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    successText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        textAlign: 'center',
        marginBottom: SPACING.lg,
        lineHeight: 24,
    },
    emailText: {
        fontWeight: '600',
        color: COLORS.primary,
    },
    hintText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[500],
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    button: {
        marginTop: SPACING.md,
        width: '100%',
    },
    backLink: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    backLinkText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.primary,
        fontWeight: '600',
    },
    resendLink: {
        marginTop: SPACING.lg,
    },
    resendText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[500],
        textDecorationLine: 'underline',
    },
});
