/**
 * 🚆 StoriesRail - Liste horizontale de stories
 * 
 * Features:
 * - Scroll horizontal fluide
 * - FlashList horizontal
 * - Header "Your Story" sticky (optionnel)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import StoryCircle from './StoryCircle';
import { spacing, light } from '@/theme/v2';

interface Story {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    hasUnseen: boolean;
}

interface StoriesRailProps {
    stories: Story[];
    onStoryPress: (id: string) => void;
    onAddStory?: () => void;
}

export default function StoriesRail({ stories, onStoryPress, onAddStory }: StoriesRailProps) {

    // Ajoute l'item "Add Story" au début de la liste virtuellement
    const renderItem = ({ item, index }: { item: Story | 'add-story', index: number }) => {
        if (item === 'add-story') {
            return (
                <StoryCircle
                    id="add"
                    name="Your Story"
                    isAddStory
                    onPress={onAddStory || (() => { })}
                />
            );
        }

        return (
            <StoryCircle
                id={item.id}
                name={item.userName}
                imageUrl={item.userAvatar}
                hasUnseen={item.hasUnseen}
                onPress={() => onStoryPress(item.id)}
            />
        );
    };

    const data = ['add-story' as const, ...stories];

    return (
        <View style={styles.container}>
            <FlashList
                data={data}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={76}
                contentContainerStyle={styles.contentContainer}
            />
            <View style={styles.separator} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 110,
        backgroundColor: light.background.primary,
    },
    contentContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    separator: {
        height: 1,
        backgroundColor: light.border.light,
        marginTop: spacing.sm,
    }
});
