/**
 * Onboarding Interests Screen
 * 
 * Second step - let users select their interests for personalization
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Touchable, TouchableOpacity, ScrollView } from 'react-native';
import {
    Shirt,
    Smartphone,
    Home,
    Gamepad2,
    Book,
    Music,
    Coffee,
    Dumbbell,
    Palette,
    Plane,
    Heart,
    Sparkles,
} from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { Button } from '../Button';

interface OnboardingInterestsProps {
    onNext: (interests: string[]) => void;
    onBack: () => void;
}

const INTERESTS = [
    { id: 'fashion', label: 'Fashion', icon: Shirt },
    { id: 'tech', label: 'Tech & Gadgets', icon: Smartphone },
    { id: 'home', label: 'Home & Living', icon: Home },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'books', label: 'Books', icon: Book },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'food', label: 'Food & Drink', icon: Coffee },
    { id: 'fitness', label: 'Fitness & Health', icon: Dumbbell },
    { id: 'art', label: 'Art & Crafts', icon: Palette },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'beauty', label: 'Beauty', icon: Heart },
    { id: 'other', label: 'Other', icon: Sparkles },
];

export default function OnboardingInterests({ onNext, onBack }: OnboardingInterestsProps) {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleInterest = (id: string) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const handleNext = () => {
        if (selected.length >= 3) {
            onNext(selected);
        }
    };

    const isSelected = (id: string) => selected.includes(id);
    const canProceed = selected.length >= 3;

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>What are you into?</Text>
                <Text style={styles.subtitle}>
                    Select at least 3 interests to personalize your experience
                </Text>

                <View style={styles.grid}>
                    {INTERESTS.map((interest) => {
                        const Icon = interest.icon;
                        const active = isSelected(interest.id);

                        return (
                            <TouchableOpacity
                                key={interest.id}
                                style={[
                                    styles.interestCard,
                                    active && styles.interestCardActive,
                                ]}
                                onPress={() => toggleInterest(interest.id)}
                                activeOpacity={0.7}
                            >
                                <Icon
                                    color={active ? COLORS.white : COLORS.primary}
                                    size={32}
                                />
                                <Text
                                    style={[
                                        styles.interestLabel,
                                        active && styles.interestLabelActive,
                                    ]}
                                >
                                    {interest.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressDot, styles.progressDotInactive]} />
                    <View style={styles.progressDot} />
                    <View style={[styles.progressDot, styles.progressDotInactive]} />
                </View>

                <Text style={styles.step}>
                    Step 2 of 3 • {selected.length} selected
                </Text>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    title="Back"
                    variant="outline"
                    onPress={onBack}
                    style={styles.halfButton}
                />
                <Button
                    title="Next"
                    onPress={handleNext}
                    style={styles.halfButton}
                    disabled={!canProceed}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 8,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.gray[500],
        marginBottom: 32,
        lineHeight: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },
    interestCard: {
        width: '47%',
        aspectRatio: 1.2,
        backgroundColor: COLORS.light,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: COLORS.primary + '20',
    },
    interestCardActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    interestLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.dark,
        textAlign: 'center',
    },
    interestLabelActive: {
        color: COLORS.white,
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
        backgroundColor: COLORS.primary,
    },
    progressDotInactive: {
        backgroundColor: COLORS.gray[300],
    },
    step: {
        fontSize: 14,
        color: COLORS.gray[500],
        textAlign: 'center',
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        padding: 24,
        paddingBottom: 40,
        gap: 12,
    },
    halfButton: {
        flex: 1,
    },
});
