import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BackgroundSettings, PRESET_IMAGES } from '../constants/wishlistThemes';
import EmojiWallBackground from './EmojiWallBackground';

interface ThemeBackgroundProps {
    settings?: BackgroundSettings;
    width?: number;
    height?: number;
    children?: React.ReactNode;
}

export default function ThemeBackground({
    settings,
    width = Dimensions.get('window').width,
    height,
    children
}: ThemeBackgroundProps) {
    if (!settings) {
        return <View style={[styles.container, { width, height }]}>{children}</View>;
    }

    const renderBackground = () => {
        switch (settings.type) {
            case 'solid':
                return (
                    <View
                        style={[
                            styles.solid,
                            { backgroundColor: settings.solidColor || '#F3F4F6', width, height }
                        ]}
                    />
                );

            case 'gradient':
                if (!settings.gradientColors || settings.gradientColors.length < 2) {
                    return <View style={[styles.solid, { backgroundColor: '#F3F4F6', width, height }]} />;
                }

                const gradientProps = {
                    vertical: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
                    horizontal: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
                    diagonal: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
                };

                const direction = settings.gradientDirection || 'vertical';

                return (
                    <LinearGradient
                        colors={settings.gradientColors}
                        {...gradientProps[direction]}
                        style={[styles.gradient, { width, height }]}
                    />
                );

            case 'image':
                const imageUrl = settings.imageUrl ||
                    (settings.imagePreset && PRESET_IMAGES[settings.imagePreset as keyof typeof PRESET_IMAGES]?.url);

                if (!imageUrl) {
                    return <View style={[styles.solid, { backgroundColor: '#F3F4F6', width, height }]} />;
                }

                // Note: Les filtres d'image nécessitent expo-image-manipulator ou une lib similaire
                return (
                    <Image
                        source={{ uri: imageUrl }}
                        style={[styles.image, { width, height }]}
                        resizeMode="cover"
                    />
                );

            case 'emoji':
                return (
                    <View style={[styles.solid, { backgroundColor: '#FFFFFF', width, height }]}>
                        <EmojiWallBackground
                            settings={settings}
                            containerWidth={width}
                            containerHeight={height || 600}
                        />
                    </View>
                );

            default:
                return <View style={[styles.solid, { backgroundColor: '#F3F4F6', width, height }]} />;
        }
    };

    return (
        <View style={[styles.container, { width, height }]}>
            {renderBackground()}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    solid: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
