import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BackgroundSettings } from '../constants/wishlistThemes';
import { generateEmojiPositions, getEmojiCount } from '../utils/background';

interface EmojiWallBackgroundProps {
    settings: BackgroundSettings;
    containerWidth?: number;
    containerHeight?: number;
}

export default function EmojiWallBackground({
    settings,
    containerWidth = Dimensions.get('window').width,
    containerHeight = 600,
}: EmojiWallBackgroundProps) {
    if (settings.type !== 'emoji' || !settings.emojis || settings.emojis.length === 0) {
        return null;
    }

    const count = getEmojiCount(settings.emojiDensity || 'medium');
    const positions = generateEmojiPositions(
        count,
        settings.emojiPattern || 'scattered',
        containerWidth,
        containerHeight
    );

    return (
        <View style={[styles.container, { width: containerWidth, height: containerHeight }]} pointerEvents="none">
            {positions.map((pos, index) => (
                <Text
                    key={index}
                    style={[
                        styles.emoji,
                        {
                            left: pos.x,
                            top: pos.y,
                            fontSize: settings.emojiSize || 40,
                            opacity: settings.emojiOpacity || 0.15,
                            transform: settings.emojiRotation ? [{ rotate: `${pos.rotation}deg` }] : [],
                        },
                    ]}
                >
                    {settings.emojis[index % settings.emojis.length]}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
    },
    emoji: {
        position: 'absolute',
    },
});
