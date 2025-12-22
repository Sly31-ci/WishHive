import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

import * as Haptics from 'expo-haptics';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  haptic?: boolean;
  accessibilityLabel?: string;
}

export function Input({
  label,
  error,
  icon,
  containerStyle,
  style,
  haptic = true,
  onFocus,
  accessibilityLabel,
  ...props
}: InputProps) {
  const handleFocus = (e: any) => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onFocus) {
      onFocus(e);
    }
  };

  return (
    <View
      style={[styles.container, containerStyle]}
      accessibilityRole="none"
    >
      {label && (
        <Text
          style={styles.label}
          accessibilityRole="header"
        >
          {label}
        </Text>
      )}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[styles.input, icon ? styles.inputWithIcon : undefined, style]}
          placeholderTextColor={COLORS.gray[400]}
          onFocus={handleFocus}
          accessibilityLabel={accessibilityLabel || label}
          {...props}
        />
      </View>
      {error && (
        <Text
          style={styles.errorText}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
  },
  inputWithIcon: {
    marginLeft: SPACING.sm,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
