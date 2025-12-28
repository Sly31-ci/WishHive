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
                message: '📝 Please fill in both password fields',
            });
            return;
        }

        if (password.length < 6) {
            showToast({
                type: 'warning',
                message: '🔒 Password must be at least 6 characters',
            });
            return;
        }

        if (password !== confirmPassword) {
            showToast({
                type: 'error',
                message: '❌ Passwords do not match',
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
                message: '✅ Password updated successfully!',
            });

            router.replace('/(tabs)');
        } catch (err: any) {
            showToast({
                type: 'error',
                message: err.message || 'Failed to update password. Please try again.',
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
                    headerTitle: 'Pick a New Password',
                    headerBackVisible: false, // Prevent going back to forgot password
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

                        <Text style={styles.title}>Secure your account</Text>
                        <Text style={styles.subtitle}>
                            Enter a new secure password for your WishHive account.
                        </Text>

                        <Input
                            label="New Password"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon={<Lock size={20} color={COLORS.gray[400]} />}
                        />

                        <Input
                            label="Confirm New Password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            icon={<Lock size={20} color={COLORS.gray[400]} />}
                        />

                        <Button
                            title="Update Password"
                            onPress={handleUpdatePassword}
                            loading={loading}
                            style={styles.button}
                        />

                        <TouchableOpacity
                            onPress={() => router.replace('/(auth)/login')}
                            style={styles.cancelLink}
                        >
                            <Text style={styles.cancelLinkText}>Cancel and return to login</Text>
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
