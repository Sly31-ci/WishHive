/**
 * Onboarding First Wishlist Screen
 * 
 * Third step - guide users to create their first wishlist
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Cake, Heart, TreePine, Baby, Calendar, Sparkles } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import Button from '../Button';
import { Input } from '../Input';
import { Card } from '../Card';

interface OnboardingFirstWishlistProps {
    onComplete: (wishlistData: { title: string; type: string }) => void;
    onBack: () => void;
    onSkip?: () => void;
}

const WISHLIST_TYPES = [
    { id: 'birthday', label: 'Birthday', icon: Cake, color: COLORS.warning },
    { id: 'wedding', label: 'Wedding', icon: Heart, color: '#E74C3C' },
    { id: 'christmas', label: 'Christmas', icon: TreePine, color: '#27AE60' },
    { id: 'baby', label: 'Baby Shower', icon: Baby, color: '#F39C12' },
    { id: 'custom', label: 'Other Event', icon: Calendar, color: COLORS.primary },
];

export default function OnboardingFirstWishlist({
    onComplete,
    onBack,
    onSkip,
}: OnboardingFirstWishlistProps) {
    const [selectedType, setSelectedType] = useState('birthday');
    const [title, setTitle] = useState('');

    const handleComplete = () => {
        if (title.trim()) {
            onComplete({ title: title.trim(), type: selectedType });
        }
    };

    const getSuggestedTitle = (type: string): string => {
        const suggestions: Record<string, string> = {
            birthday: "My Birthday Wishlist",
            wedding: "Our Wedding Registry",
            christmas: "Christmas Wishlist",
            baby: "Baby Shower Wishlist",
            custom: "My Wishlist",
        };
        return suggestions[type] || "My Wishlist";
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Sparkles color={COLORS.primary} size={40} />
                    <Text style={styles.title}>Create Your First Wishlist!</Text>
                </View>

                <Text style={styles.subtitle}>
                    Let's start with something special
                </Text>

                <Text style={styles.label}>What's the occasion?</Text>
                <View style={styles.typeGrid}>
                    {WISHLIST_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selectedType === type.id;

                        return (
                            <Card
                                key={type.id}
                                style={[
                                    styles.typeCard,
                                    isSelected && { borderColor: type.color, borderWidth: 2 },
                                ]}
                                onPress={() => setSelectedType(type.id)}
                            >
                                <Icon color={type.color} size={28} />
                                <Text style={styles.typeLabel}>{type.label}</Text>
                            </Card>
                        );
                    })}
                </View>

                <Text style={styles.label}>Give it a name</Text>
                <Input
                    placeholder={getSuggestedTitle(selectedType)}
                    value={title}
                    onChangeText={setTitle}
                    autoFocus
                />

                <Card style={styles.infoCard}>
                    <Text style={styles.infoText}>
                        💡 You can add products, set privacy, and customize your wishlist after creation
                    </Text>
                </Card>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressDot, styles.progressDotInactive]} />
                    <View style={[styles.progressDot, styles.progressDotInactive]} />
                    <View style={styles.progressDot} />
                </View>

                <Text style={styles.step}>Step 3 of 3</Text>
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
                    title="Create Wishlist"
                    onPress={handleComplete}
                    style={styles.halfButton}
                    disabled={!title.trim()}
                />
            </View>

            {onSkip && (
                <Button
                    title="Skip for now"
                    variant="ghost"
                    onPress={onSkip}
                    style={styles.skipButton}
                />
            )}
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
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginTop: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.gray[500],
        marginBottom: 32,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 12,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    typeCard: {
        width: '30%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
    },
    typeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.dark,
        textAlign: 'center',
    },
    infoCard: {
        backgroundColor: COLORS.primary + '10',
        padding: 16,
        marginTop: 16,
        marginBottom: 24,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.dark,
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
        paddingBottom: 20,
        gap: 12,
    },
    halfButton: {
        flex: 1,
    },
    skipButton: {
        marginHorizontal: 24,
        marginBottom: 24,
    },
});
