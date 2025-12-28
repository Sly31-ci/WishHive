import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { generateSlug } from '@/lib/slug';
import { analytics } from '@/lib/analytics';

const WISHLIST_TYPES = [
  { value: 'birthday', label: 'Birthday', emoji: '🎂' },
  { value: 'wedding', label: 'Wedding', emoji: '💍' },
  { value: 'christmas', label: 'Christmas', emoji: '🎄' },
  { value: 'baby', label: 'Baby', emoji: '👶' },
  { value: 'general', label: 'General', emoji: '🎁' },
];

const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public', description: 'Anyone can find and view' },
  { value: 'private', label: 'Private', description: 'Only you can see' },
  { value: 'code_only', label: 'Code Only', description: 'Need code to access' },
];

export default function CreateWishlistScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('general');
  const [customType, setCustomType] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🎁');
  const [privacy, setPrivacy] = useState('public');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!user) return;

    if (!title.trim()) {
      showToast({
        type: 'warning',
        message: '📝 Please enter a title',
      });
      return;
    }

    try {
      setLoading(true);

      // Utiliser customType si type === 'custom'
      const finalType = type === 'custom' && customType
        ? customType.toLowerCase().trim()
        : type;

      const { data, error } = await (supabase
        .from('wishlists') as any)
        .insert({
          owner_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          type: finalType as any,
          privacy: privacy as any,
          slug: generateSlug(title.trim()),
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        showToast({
          type: 'success',
          message: '🎉 Wishlist created!',
        });

        analytics.track('Wishlist Created', {
          wishlist_id: data.id,
          type: data.type,
        });

        router.back();
        router.push(`/wishlists/${data.id}`);
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        message: err.message || 'Failed to create wishlist',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Wishlist</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="My Birthday Wishlist"
            placeholderTextColor={COLORS.gray[400]}
            value={title}
            onChangeText={setTitle}
            autoFocus={false}
            editable={!loading}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Optional description..."
            placeholderTextColor={COLORS.gray[400]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        {/* Event Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Event Type</Text>
          <View style={styles.typeGrid}>
            {WISHLIST_TYPES.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.typeCard,
                  type === item.value && styles.typeCardActive,
                ]}
                onPress={() => setType(item.value)}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={styles.typeEmoji}>{item.emoji}</Text>
                <Text style={[
                  styles.typeText,
                  type === item.value && styles.typeTextActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Custom Type Button */}
            <TouchableOpacity
              style={[
                styles.typeCard,
                styles.customTypeCard,
                type === 'custom' && styles.typeCardActive,
              ]}
              onPress={() => setType('custom')}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Plus size={28} color={type === 'custom' ? COLORS.primary : COLORS.gray[600]} />
              <Text style={[
                styles.typeText,
                type === 'custom' && styles.typeTextActive
              ]}>
                Custom
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Type Inputs */}
          {type === 'custom' && (
            <View style={styles.customInputsContainer}>
              <View style={styles.customInputRow}>
                <View style={styles.emojiInputWrapper}>
                  <Text style={styles.customInputLabel}>Emoji</Text>
                  <TextInput
                    style={[styles.input, styles.emojiInput]}
                    placeholder="🎓"
                    value={customEmoji}
                    onChangeText={setCustomEmoji}
                    maxLength={2}
                    editable={!loading}
                  />
                </View>
                <View style={styles.labelInputWrapper}>
                  <Text style={styles.customInputLabel}>Label</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Graduation"
                    placeholderTextColor={COLORS.gray[400]}
                    value={customType}
                    onChangeText={setCustomType}
                    autoFocus
                    editable={!loading}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Privacy */}
        <View style={styles.field}>
          <Text style={styles.label}>Privacy</Text>
          {PRIVACY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.privacyOption,
                privacy === option.value && styles.privacyOptionActive,
              ]}
              onPress={() => setPrivacy(option.value)}
              disabled={loading}
              activeOpacity={0.7}
            >
              <View style={styles.radio}>
                {privacy === option.value && <View style={styles.radioDot} />}
              </View>
              <View style={styles.privacyText}>
                <Text style={styles.privacyLabel}>{option.label}</Text>
                <Text style={styles.privacyDesc}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creating...' : 'Create Wishlist'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.dark,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  field: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
    minHeight: 52,
  },
  textArea: {
    minHeight: 100,
    paddingTop: SPACING.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  typeCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  typeCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  typeEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  typeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  typeTextActive: {
    color: COLORS.primary,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  privacyOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  privacyText: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  privacyDesc: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md + 4,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  customTypeCard: {
    borderStyle: 'dashed',
  },
  customInputsContainer: {
    marginTop: SPACING.md,
  },
  customInputRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  emojiInputWrapper: {
    width: '25%',
  },
  labelInputWrapper: {
    flex: 1,
  },
  customInputLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  emojiInput: {
    textAlign: 'center',
    fontSize: FONT_SIZES.xl,
  },
});
