import { View, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { AnimatedEntrance } from './AnimatedEntrance';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined';
  onPress?: () => void;
  activeOpacity?: number;
  haptic?: Haptics.ImpactFeedbackStyle | boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'header' | 'link' | 'none';
  animateEntrance?: boolean;
  entranceDelay?: number;
}

export function Card({
  children,
  style,
  variant = 'default',
  onPress,
  activeOpacity = 0.7,
  haptic = Haptics.ImpactFeedbackStyle.Light,
  accessibilityLabel,
  accessibilityRole,
  animateEntrance = false,
  entranceDelay = 0,
}: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 10, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    }
  };

  const handlePress = () => {
    if (onPress) {
      if (haptic) {
        if (typeof haptic === 'string') {
          Haptics.impactAsync(haptic as Haptics.ImpactFeedbackStyle);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
      onPress();
    }
  };

  const content = (
    <Animated.View
      style={[styles.card, styles[variant], style, animatedStyle]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole || (onPress ? 'button' : 'none')}
    >
      {children}
    </Animated.View>
  );

  let result = content;

  if (onPress) {
    result = (
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={activeOpacity}
      >
        {content}
      </TouchableOpacity>
    );
  }

  if (animateEntrance) {
    return (
      <AnimatedEntrance delay={entranceDelay}>
        {result}
      </AnimatedEntrance>
    );
  }

  return result;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  default: {
    ...SHADOWS.sm,
  },
  elevated: {
    ...SHADOWS.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
});
