import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    Palette,
    Image as ImageIcon,
    Music,
    Sparkles,
    Check,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

type Theme = {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundImage?: string;
};

const PRESET_THEMES: Theme[] = [
    {
        id: 'birthday',
        name: '🎂 Birthday Party',
        primaryColor: '#FFB86B',
        secondaryColor: '#FF6B9D',
    },
    {
        id: 'wedding',
        name: '💍 Wedding',
        primaryColor: '#FFB6C1',
        secondaryColor: '#E6E6FA',
    },
    {
        id: 'christmas',
        name: '🎄 Christmas',
        primaryColor: '#2BD4A5',
        secondaryColor: '#FF6B6B',
    },
    {
        id: 'baby',
        name: '👶 Baby Shower',
        primaryColor: '#87CEEB',
        secondaryColor: '#FFB6C1',
    },
    {
        id: 'graduation',
        name: '🎓 Graduation',
        primaryColor: '#6C63FF',
        secondaryColor: '#FFD700',
    },
    {
        id: 'minimalist',
        name: '✨ Minimalist',
        primaryColor: '#0F1724',
        secondaryColor: '#F7FAFC',
    },
];

const COLOR_PALETTE = [
    '#6C63FF', '#FFB86B', '#2BD4A5', '#FF6B6B',
    '#FFB6C1', '#87CEEB', '#FFD700', '#E6E6FA',
    '#0F1724', '#64748B', '#F7FAFC', '#2C3E50',
];

export default function DesignerModeScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [wishlistTitle, setWishlistTitle] = useState('');
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [customPrimaryColor, setCustomPrimaryColor] = useState(COLORS.primary);
    const [customSecondaryColor, setCustomSecondaryColor] = useState(COLORS.secondary);
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWishlistDesign();
    }, [id]);

    const loadWishlistDesign = async () => {
        if (!id || !user) return;

        try {
            const { data, error } = await supabase
                .from('wishlists')
                .select('title, theme')
                .eq('id', id)
                .single();

            if (error) throw error;

            setWishlistTitle(data.title);

            if (data.theme) {
                const theme = data.theme;
                if (theme.preset) {
                    const preset = PRESET_THEMES.find(t => t.id === theme.preset);
                    if (preset) setSelectedTheme(preset);
                }
                if (theme.primaryColor) setCustomPrimaryColor(theme.primaryColor);
                if (theme.secondaryColor) setCustomSecondaryColor(theme.secondaryColor);
                if (theme.bannerImage) setBannerImage(theme.bannerImage);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTheme = (theme: Theme) => {
        setSelectedTheme(theme);
        setCustomPrimaryColor(theme.primaryColor);
        setCustomSecondaryColor(theme.secondaryColor);
    };

    const handlePickBanner = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please grant camera roll permissions');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setBannerImage(result.assets[0].uri);
        }
    };

    const handleSaveDesign = async () => {
        if (!id || !user) return;

        try {
            let bannerUrl = bannerImage;

            // Upload banner if it's a local file
            if (bannerImage && bannerImage.startsWith('file://')) {
                const fileName = `wishlist-banners/${id}-${Date.now()}.jpg`;
                const response = await fetch(bannerImage);
                const blob = await response.blob();

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('wishlist-assets')
                    .upload(fileName, blob);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('wishlist-assets')
                    .getPublicUrl(fileName);

                bannerUrl = urlData.publicUrl;
            }

            // Save theme configuration
            const themeConfig = {
                preset: selectedTheme?.id || null,
                primaryColor: customPrimaryColor,
                secondaryColor: customSecondaryColor,
                bannerImage: bannerUrl,
            };

            const { error } = await supabase
                .from('wishlists')
                .update({ theme: themeConfig })
                .eq('id', id);

            if (error) throw error;

            Alert.alert('Success', 'Design saved!', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Designer Mode',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.content}>
                {/* Preview Card */}
                <Card style={[styles.previewCard, { borderColor: customPrimaryColor }]}>
                    {bannerImage && (
                        <Image source={{ uri: bannerImage }} style={styles.bannerPreview} />
                    )}
                    <View style={[styles.previewContent, { backgroundColor: customSecondaryColor + '20' }]}>
                        <Text style={[styles.previewTitle, { color: customPrimaryColor }]}>
                            {wishlistTitle}
                        </Text>
                        <Text style={styles.previewSubtitle}>Preview of your wishlist</Text>
                    </View>
                </Card>

                {/* Preset Themes */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Sparkles size={20} color={COLORS.dark} />
                        <Text style={styles.sectionTitle}>Preset Themes</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.themesContainer}>
                            {PRESET_THEMES.map((theme) => (
                                <TouchableOpacity
                                    key={theme.id}
                                    style={[
                                        styles.themeCard,
                                        selectedTheme?.id === theme.id && styles.selectedTheme,
                                    ]}
                                    onPress={() => handleSelectTheme(theme)}
                                >
                                    <View style={styles.themeColors}>
                                        <View
                                            style={[
                                                styles.themeColorBlock,
                                                { backgroundColor: theme.primaryColor },
                                            ]}
                                        />
                                        <View
                                            style={[
                                                styles.themeColorBlock,
                                                { backgroundColor: theme.secondaryColor },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.themeName}>{theme.name}</Text>
                                    {selectedTheme?.id === theme.id && (
                                        <View style={styles.selectedBadge}>
                                            <Check size={12} color={COLORS.background} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Custom Colors */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Palette size={20} color={COLORS.dark} />
                        <Text style={styles.sectionTitle}>Custom Colors</Text>
                    </View>

                    <Text style={styles.colorLabel}>Primary Color</Text>
                    <View style={styles.colorPalette}>
                        {COLOR_PALETTE.map((color) => (
                            <TouchableOpacity
                                key={`primary-${color}`}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color },
                                    customPrimaryColor === color && styles.selectedColor,
                                ]}
                                onPress={() => setCustomPrimaryColor(color)}
                            >
                                {customPrimaryColor === color && (
                                    <Check size={16} color={COLORS.background} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.colorLabel}>Secondary Color</Text>
                    <View style={styles.colorPalette}>
                        {COLOR_PALETTE.map((color) => (
                            <TouchableOpacity
                                key={`secondary-${color}`}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color },
                                    customSecondaryColor === color && styles.selectedColor,
                                ]}
                                onPress={() => setCustomSecondaryColor(color)}
                            >
                                {customSecondaryColor === color && (
                                    <Check size={16} color={COLORS.background} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Banner Image */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ImageIcon size={20} color={COLORS.dark} />
                        <Text style={styles.sectionTitle}>Banner Image</Text>
                    </View>
                    <Button
                        title={bannerImage ? 'Change Banner' : 'Add Banner'}
                        onPress={handlePickBanner}
                        variant="outline"
                    />
                    {bannerImage && (
                        <TouchableOpacity
                            onPress={() => setBannerImage(null)}
                            style={styles.removeBannerButton}
                        >
                            <Text style={styles.removeBannerText}>Remove Banner</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Save Button */}
                <Button
                    title="Save Design"
                    onPress={handleSaveDesign}
                    style={styles.saveButton}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACING.md,
    },
    previewCard: {
        marginBottom: SPACING.lg,
        padding: 0,
        overflow: 'hidden',
        borderWidth: 2,
    },
    bannerPreview: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    previewContent: {
        padding: SPACING.md,
    },
    previewTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        marginBottom: SPACING.xs,
    },
    previewSubtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.dark,
    },
    themesContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    themeCard: {
        width: 120,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.backgroundSecondary,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedTheme: {
        borderColor: COLORS.primary,
    },
    themeColors: {
        flexDirection: 'row',
        gap: SPACING.xs,
        marginBottom: SPACING.sm,
    },
    themeColorBlock: {
        flex: 1,
        height: 40,
        borderRadius: BORDER_RADIUS.sm,
    },
    themeName: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
        color: COLORS.dark,
        textAlign: 'center',
    },
    selectedBadge: {
        position: 'absolute',
        top: SPACING.xs,
        right: SPACING.xs,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.sm,
        marginTop: SPACING.md,
    },
    colorPalette: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    colorOption: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.sm,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: COLORS.dark,
    },
    removeBannerButton: {
        marginTop: SPACING.sm,
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    removeBannerText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        fontWeight: '500',
    },
    saveButton: {
        marginTop: SPACING.md,
        marginBottom: SPACING.xl,
    },
});
