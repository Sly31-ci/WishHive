import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { checkAndAwardBadges } from '@/lib/badgeEngine';
import { BadgeUnlockedModal } from '@/components/BadgeUnlockedModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/Input';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { generateSlug } from '@/lib/slug';
import { analytics } from '@/lib/analytics';

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

export default function CreateWishlistScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('general');
  const [privacy, setPrivacy] = useState('public');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<any>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const handleCreate = async () => {
    if (!user) return;

    if (!title.trim()) {
      showToast({
        type: 'warning',
        message: '📝 Please enter a title for your wishlist',
      });
      return;
    }

    try {
      setLoading(true);

      const accessCode =
        privacy === 'code_only'
          ? Math.random().toString(36).substring(2, 10).toUpperCase()
          : null;

      const insertData = {
        owner_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        type: type as any,
        privacy: privacy as any,
        access_code: accessCode,
        due_date: dueDate || null,
        slug: generateSlug(title.trim()),
      };

      const { data, error } = await (supabase
        .from('wishlists') as any)
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Check for badge unlock
        if (user) {
          const badgeResults = await checkAndAwardBadges(user.id, 'create_wishlist');
          const awarded = badgeResults.find(r => r.awarded);
          if (awarded && awarded.badge) {
            setUnlockedBadge(awarded.badge);
            setShowBadgeModal(true);
          }
        }

        showToast({
          type: 'success',
          message: '🎉 Wishlist created successfully!',
          duration: 2000,
        });

        analytics.track('Wishlist Created', {
          wishlist_id: data.id,
          type: data.type,
          privacy: data.privacy,
          has_due_date: !!data.due_date,
        });

        router.back();
        router.push(`/wishlists/${data.id}`);
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        message: err.message || '😕 Failed to create wishlist. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BadgeUnlockedModal
        visible={showBadgeModal}
        badge={unlockedBadge}
        onClose={() => setShowBadgeModal(false)}
      />

      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Create Wishlist',
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
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Card>
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



            <Button
              title="Create Wishlist"
              onPress={handleCreate}
              loading={loading}
              style={styles.button}
            />
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
