import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, User, Bell, Lock, LogOut } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/Input';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

export default function SettingsScreen() {
    const { profile, signOut, refreshProfile } = useAuth();
    const [username, setUsername] = useState(profile?.username || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [saving, setSaving] = useState(false);

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: username.trim(),
                    bio: bio.trim(),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', profile?.id);

            if (error) throw error;

            await refreshProfile();
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    router.replace('/(auth)/login');
                },
            },
        ]);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Settings',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile</Text>
                    <Card>
                        <Input
                            label="Username"
                            value={username}
                            onChangeText={setUsername}
                            icon={<User size={20} color={COLORS.gray[400]} />}
                        />
                        <Input
                            label="Bio"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            numberOfLines={3}
                            style={styles.textArea}
                        />
                        <Button
                            title="Save Changes"
                            onPress={handleSaveProfile}
                            loading={saving}
                            style={styles.saveButton}
                        />
                    </Card>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <Card>
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Bell size={20} color={COLORS.dark} />
                                <Text style={styles.settingLabel}>Notifications</Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: COLORS.gray[200], true: COLORS.primary }}
                            />
                        </View>
                    </Card>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <Card>
                        <TouchableOpacity style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Lock size={20} color={COLORS.dark} />
                                <Text style={styles.settingLabel}>Change Password</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.settingRow}
                            onPress={handleSignOut}
                        >
                            <View style={styles.settingInfo}>
                                <LogOut size={20} color={COLORS.error} />
                                <Text style={[styles.settingLabel, styles.dangerText]}>
                                    Sign Out
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Card>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
        padding: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    saveButton: {
        marginTop: SPACING.md,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    settingLabel: {
        fontSize: FONT_SIZES.md,
        color: COLORS.dark,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.gray[200],
        marginVertical: SPACING.md,
    },
    dangerText: {
        color: COLORS.error,
    },
});
