/**
 * ⚡ WishHive Design System V2 - Animations
 * 
 * Courbes d'easing, durées et configurations pour Reanimated
 * Inspiré par iOS, Material Design et Framer Motion
 */

import { Easing } from 'react-native-reanimated';

// ============================================
// ⏱️ DURATIONS (ms)
// ============================================

export const DURATIONS = {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
    slowest: 1200,
} as const;

// ============================================
// 📐 EASING CURVES
// ============================================

export const EASINGS = {
    // Standard easings
    linear: Easing.linear,

    // Ease in/out
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),

    // Cubic bezier (custom)
    smooth: Easing.bezier(0.4, 0, 0.2, 1),        // Material Design standard
    spring: Easing.bezier(0.68, -0.55, 0.265, 1.55), // Bouncy spring
    snappy: Easing.bezier(0.4, 0, 0, 1),          // Quick snap
    gentle: Easing.bezier(0.25, 0.1, 0.25, 1),    // Gentle ease

    // iOS-like
    ios: Easing.bezier(0.42, 0, 0.58, 1),

    // Elastic
    elastic: Easing.elastic(1),

    // Bounce
    bounce: Easing.bounce,
} as const;

// ============================================
// 🎯 ANIMATION CONFIGS - Predefined
// ============================================

export const ANIMATION_CONFIGS = {
    // Fade animations
    fadeIn: {
        duration: DURATIONS.normal,
        easing: EASINGS.smooth,
    },

    fadeOut: {
        duration: DURATIONS.fast,
        easing: EASINGS.smooth,
    },

    // Scale animations
    scaleIn: {
        duration: DURATIONS.normal,
        easing: EASINGS.spring,
    },

    scaleOut: {
        duration: DURATIONS.fast,
        easing: EASINGS.smooth,
    },

    // Slide animations
    slideIn: {
        duration: DURATIONS.normal,
        easing: EASINGS.smooth,
    },

    slideOut: {
        duration: DURATIONS.fast,
        easing: EASINGS.snappy,
    },

    // Spring animations (bouncy)
    springGentle: {
        damping: 15,
        stiffness: 150,
        mass: 1,
    },

    springBouncy: {
        damping: 10,
        stiffness: 200,
        mass: 0.8,
    },

    springSnappy: {
        damping: 20,
        stiffness: 300,
        mass: 0.5,
    },

    // Button press
    buttonPress: {
        duration: DURATIONS.instant,
        easing: EASINGS.smooth,
    },

    buttonRelease: {
        duration: DURATIONS.fast,
        easing: EASINGS.spring,
    },

    // Modal animations
    modalEnter: {
        duration: DURATIONS.slow,
        easing: EASINGS.smooth,
    },

    modalExit: {
        duration: DURATIONS.normal,
        easing: EASINGS.snappy,
    },

    // Tab switch
    tabSwitch: {
        duration: DURATIONS.normal,
        easing: EASINGS.ios,
    },

    // Scroll animations
    scrollSmooth: {
        duration: DURATIONS.slow,
        easing: EASINGS.gentle,
    },

    // Micro-interactions
    microBounce: {
        duration: DURATIONS.fast,
        easing: EASINGS.spring,
    },

    microScale: {
        duration: DURATIONS.instant,
        easing: EASINGS.smooth,
    },
} as const;

// ============================================
// 🎬 ENTRANCE ANIMATIONS - For Reanimated
// ============================================

export const ENTRANCE_ANIMATIONS = {
    // Fade
    fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: ANIMATION_CONFIGS.fadeIn,
    },

    // Fade + Scale
    fadeInScale: {
        from: { opacity: 0, transform: [{ scale: 0.9 }] },
        to: { opacity: 1, transform: [{ scale: 1 }] },
        config: ANIMATION_CONFIGS.scaleIn,
    },

    // Fade + Slide from bottom
    fadeInUp: {
        from: { opacity: 0, transform: [{ translateY: 20 }] },
        to: { opacity: 1, transform: [{ translateY: 0 }] },
        config: ANIMATION_CONFIGS.slideIn,
    },

    // Fade + Slide from top
    fadeInDown: {
        from: { opacity: 0, transform: [{ translateY: -20 }] },
        to: { opacity: 1, transform: [{ translateY: 0 }] },
        config: ANIMATION_CONFIGS.slideIn,
    },

    // Fade + Slide from left
    fadeInLeft: {
        from: { opacity: 0, transform: [{ translateX: -20 }] },
        to: { opacity: 1, transform: [{ translateX: 0 }] },
        config: ANIMATION_CONFIGS.slideIn,
    },

    // Fade + Slide from right
    fadeInRight: {
        from: { opacity: 0, transform: [{ translateX: 20 }] },
        to: { opacity: 1, transform: [{ translateX: 0 }] },
        config: ANIMATION_CONFIGS.slideIn,
    },

    // Spring bounce
    bounceIn: {
        from: { opacity: 0, transform: [{ scale: 0.3 }] },
        to: { opacity: 1, transform: [{ scale: 1 }] },
        config: ANIMATION_CONFIGS.springBouncy,
    },
} as const;

// ============================================
// 🎬 EXIT ANIMATIONS
// ============================================

export const EXIT_ANIMATIONS = {
    fadeOut: {
        from: { opacity: 1 },
        to: { opacity: 0 },
        config: ANIMATION_CONFIGS.fadeOut,
    },

    fadeOutScale: {
        from: { opacity: 1, transform: [{ scale: 1 }] },
        to: { opacity: 0, transform: [{ scale: 0.9 }] },
        config: ANIMATION_CONFIGS.scaleOut,
    },

    fadeOutDown: {
        from: { opacity: 1, transform: [{ translateY: 0 }] },
        to: { opacity: 0, transform: [{ translateY: 20 }] },
        config: ANIMATION_CONFIGS.slideOut,
    },

    fadeOutUp: {
        from: { opacity: 1, transform: [{ translateY: 0 }] },
        to: { opacity: 0, transform: [{ translateY: -20 }] },
        config: ANIMATION_CONFIGS.slideOut,
    },
} as const;

// ============================================
// 🎯 GESTURE ANIMATIONS
// ============================================

export const GESTURE_CONFIGS = {
    // Swipe thresholds
    swipeThreshold: 50,
    swipeVelocityThreshold: 500,

    // Pan gesture
    panDecay: 0.998,
    panClamp: { min: -300, max: 300 },

    // Pinch gesture
    pinchMin: 0.5,
    pinchMax: 3,

    // Rotation
    rotationClamp: { min: -45, max: 45 },
} as const;

// ============================================
// 📦 EXPORTS
// ============================================

export const AnimationsV2 = {
    durations: DURATIONS,
    easings: EASINGS,
    configs: ANIMATION_CONFIGS,
    entrance: ENTRANCE_ANIMATIONS,
    exit: EXIT_ANIMATIONS,
    gestures: GESTURE_CONFIGS,
} as const;

export default AnimationsV2;
