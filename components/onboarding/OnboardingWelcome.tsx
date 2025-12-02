/**
 * Onboarding Welcome Screen
 * 
 * First step of onboarding - welcome message and value proposition
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Gift, Users, Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Button } from '../Button';
import { Card } from '../Card';

interface OnboardingWelcomeProps {
    onNext: () => void;
}

export default function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
    const benefits = [
        {
            icon: <Gift color={Colors.primary} size={32} />,
            title: 'Create Wishlists',
            description: 'For birthdays, weddings, holidays, and more',
        },
        {
            icon: <Users color={Colors.accent} size={32} />,
            title: 'Share with Loved Ones',
            description: 'Let family and friends know what you really want',
        },
        {
            icon: <Sparkles color={Colors.secondary} size={32} />,
            title: 'Earn Rewards',
            description: 'Get points and badges for creating and gifting',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <Text style={styles.logoText}>🎯 WishHive</Text>
                    <Text style={styles.tagline}>Make Wishes Real</Text>
                    <Text style={styles.subtitle}>
                        The fun, social way to create, share, and fulfill wishlists
                    </Text>
                </View>

                {/* Benefits */}
                <View style={styles.benefits}>
                    {benefits.map((benefit, index) => (
                        <Card key={index} style={styles.benefitCard}>
                            <View style={styles.iconContainer}>{benefit.icon}</View>
                            <View style={styles.benefitContent}>
                                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                                <Text style={styles.benefitDescription}>
                                    {benefit.description}
                                </Text>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressDot} />
                    <View style={[styles.progressDot, styles.progressDotInactive]} />
                    <View style={[styles.progressDot, styles.progressDotInactive]} />
                </View>

                <Text style={styles.step}>Step 1 of 3</Text>
            </View>

            {/* CTA */}
            <View style={styles.footer}>
                <Button onPress={onNext} style={styles.button}>
                    Get Started
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    hero: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.gray,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    benefits: {
        gap: 16,
        marginBottom: 32,
    },
    benefitCard: {
        flexDirection: 'row',
        padding: 16,
        gap: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.light,
        alignItems: 'center',
        justifyContent: 'center',
    },
    benefitContent: {
        flex: 1,
        justifyContent: 'center',
    },
    benefitTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark,
        marginBottom: 4,
    },
    benefitDescription: {
        fontSize: 14,
        color: Colors.gray,
        lineHeight: 20,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
    },
    progressDotInactive: {
        backgroundColor: Colors.gray + '40',
    },
    step: {
        fontSize: 14,
        color: Colors.gray,
        textAlign: 'center',
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
    },
    button: {
        paddingVertical: 16,
    },
});
