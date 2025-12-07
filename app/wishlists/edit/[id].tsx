import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ArrowLeft, Calendar, Trash2 } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

const WISHLIST_TYPES = [
    { value: 'birthday', label: 'Birthday', emoji: '🎂' },
    { value: 'wedding', label: 'Wedding', emoji: '💍' },
    { value: 'christmas', label: 'Christmas', emoji: '🎄' },
    { value: 'baby', label: 'Baby', emoji: '👶' },
    { value: 'general', label: 'General', emoji: '🎁' },
    { value: 'custom', label: 'Custom', emoji: '✨' },
];

const PRIVACY_OPTIONS = [
    {
        value: 'public',
        label: 'Public',
        description: 'Anyone can find and view',
    },
    {
        value: 'private',
        label: 'Private',
        description: 'Only you can see',
    },
    {
        value: 'code_only',
        label: 'Code Only',
        description: 'Need code to access',
    },
];

export default function EditWishlistScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('general');
    const [privacy, setPrivacy] = useState('public');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

    useEffect(() => {
        if (id) {
            loadWishlist();
        }
    }, [id]);

    const loadWishlist = async () => {
        try {
            const { data, error } = await supabase
                .from('wishlists')
                .select('*')
                .eq('id', id as string)
                .single();

            if (error) throw error;

            if (data.owner_id !== user?.id) {
                Alert.alert('Error', 'You do not have permission to edit this wishlist');
                router.back();
                return;
            }

            setTitle(data.title);
            setDescription(data.description || '');
            setType(data.type);
            setPrivacy(data.privacy);
            setDueDate(data.due_date || '');
        } catch (error) {
            console.error('Error loading wishlist:', error);
            Alert.alert('Error', 'Failed to load wishlist details');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!title.trim()) {
            setError('Please enter a title');
            return;
        }

        try {
            setSaving(true);
            setError('');

            const accessCode =
                privacy === 'code_only'
                    ? Math.random().toString(36).substring(2, 10).toUpperCase()
                    : null;

            const updateData = {
                title: title.trim(),
                description: description.trim() || null,
                type: type as any,
                privacy: privacy as any,
                access_code: accessCode,
                due_date: dueDate || null,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('wishlists')
                .update(updateData)
                .eq('id', id as string);

            if (error) throw error;

            router.back();
        } catch (err: any) {
            setError(err.message || 'Failed to update wishlist');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        setDeleteConfirmVisible(true);
    };

    const confirmDelete = async () => {
        try {
            const { error } = await supabase
                .from('wishlists')
                .delete()
                .eq('id', id as string);
            if (error) throw error;
            router.replace('/(tabs)/wishlists');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete wishlist');
        } finally {
            setDeleteConfirmVisible(false);
        }
    };

    // ... existing render ...

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Edit Wishlist',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={handleDelete}>
                            <Trash2 size={24} color={COLORS.error} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Card>
                        {/* ... existing inputs ... */}

                        <Input
                            label="Wishlist Title"
                            placeholder="My Birthday Wishlist"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Input
                            label="Description (Optional)"
                            placeholder="Tell people what this wishlist is for..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            style={styles.textArea}
                        />

                        <View style={styles.section}>
                            <Text style={styles.label}>Event Type</Text>
                            <View style={styles.typeGrid}>
                                {WISHLIST_TYPES.map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={[
                                            styles.typeCard,
                                            type === item.value && styles.typeCardSelected,
                                        ]}
                                        onPress={() => setType(item.value)}
                                    >
                                        <Text style={styles.typeEmoji}>{item.emoji}</Text>
                                        <Text
                                            style={[
                                                styles.typeLabel,
                                                type === item.value && styles.typeLabelSelected,
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>Privacy</Text>
                            {PRIVACY_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.privacyCard,
                                        privacy === option.value && styles.privacyCardSelected,
                                    ]}
                                    onPress={() => setPrivacy(option.value)}
                                >
                                    <View style={styles.radioOuter}>
                                        {privacy === option.value && (
                                            <View style={styles.radioInner} />
                                        )}
                                    </View>
                                    <View style={styles.privacyContent}>
                                        <Text style={styles.privacyLabel}>{option.label}</Text>
                                        <Text style={styles.privacyDescription}>
                                            {option.description}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Input
                            label="Due Date (Optional)"
                            placeholder="YYYY-MM-DD"
                            value={dueDate}
                            onChangeText={setDueDate}
                            icon={<Calendar size={20} color={COLORS.gray[400]} />}
                        />

                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <Button
                            title="Save Changes"
                            onPress={handleUpdate}
                            loading={saving}
                            style={styles.button}
                        />

                        <Button
                            title="Delete Wishlist"
                            onPress={handleDelete}
                            variant="outline"
                            style={[styles.button, { borderColor: COLORS.error }] as any}
                            textStyle={{ color: COLORS.error }}
                            icon={<Trash2 size={20} color={COLORS.error} />}
                        />
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>

            <ConfirmDialog
                visible={deleteConfirmVisible}
                title="Delete Wishlist"
                message="Are you sure you want to delete this wishlist? This action cannot be undone."
                confirmText="Delete"
                isDestructive
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirmVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.sm,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    typeCard: {
        width: '31%',
        aspectRatio: 1,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    typeCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10',
    },
    typeEmoji: {
        fontSize: FONT_SIZES.xxxl,
    },
    typeLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.gray[600],
    },
    typeLabelSelected: {
        color: COLORS.primary,
    },
    privacyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        gap: SPACING.md,
    },
    privacyCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 2,
        borderColor: COLORS.gray[400],
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.primary,
    },
    privacyContent: {
        flex: 1,
    },
    privacyLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 2,
    },
    privacyDescription: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[600],
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    error: {
        color: COLORS.error,
        fontSize: FONT_SIZES.sm,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    button: {
        marginTop: SPACING.md,
    },
});
