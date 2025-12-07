import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { Camera, Image as ImageIcon, X, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { SvgUri } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/constants/theme';
import { DICEBEAR_STYLES, DiceBearStyle, getPresetAvatars, DiceBearAvatar } from '@/lib/dicebear';
import { Button } from './Button';

interface SimpleAvatarPickerProps {
    visible: boolean;
    currentAvatarUrl?: string | null;
    onClose: () => void;
    onSelect: (url: string) => Promise<void>;
}

export const SimpleAvatarPicker: React.FC<SimpleAvatarPickerProps> = ({
    visible,
    currentAvatarUrl,
    onClose,
    onSelect,
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'avatars' | 'photo'>('avatars');
    const [selectedStyle, setSelectedStyle] = useState<DiceBearStyle>('avataaars');
    const [avatars, setAvatars] = useState<DiceBearAvatar[]>([]);
    const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setAvatars(getPresetAvatars(selectedStyle));
    }, [selectedStyle]);

    const handleStyleSelect = (style: DiceBearStyle) => {
        Haptics.selectionAsync();
        setSelectedStyle(style);
    };

    const handleAvatarSelect = (url: string) => {
        Haptics.selectionAsync();
        setSelectedAvatarUrl(url);
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                setUploading(true);
                // Usually we would upload to Supabase Storage here and get URL.
                // For now, we simulate or pass the base64 data URI if the parent handles upload,
                // OR we just use distinct logic. The walkthrough says "On Select: (url: string) => Promise<void>".
                // If we want to support base64, we need to pass a data URI.
                const dataUrl = `data:image/jpeg;base64,${result.assets[0].base64}`;
                setSelectedAvatarUrl(dataUrl);
                setUploading(false);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (selectedAvatarUrl) {
            setUploading(true);
            try {
                await onSelect(selectedAvatarUrl);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                onClose();
            } catch (error) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Choose Avatar</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'avatars' && { borderBottomColor: theme.primary }]}
                        onPress={() => setActiveTab('avatars')}
                    >
                        <Text style={[styles.tabText, { color: activeTab === 'avatars' ? theme.primary : theme.textSecondary }]}>
                            Avatars ✨
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'photo' && { borderBottomColor: theme.primary }]}
                        onPress={() => setActiveTab('photo')}
                    >
                        <Text style={[styles.tabText, { color: activeTab === 'photo' ? theme.primary : theme.textSecondary }]}>
                            My Photo 📸
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'avatars' ? (
                    <View style={styles.content}>
                        {/* Style Selector */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleSelector}>
                            {DICEBEAR_STYLES.map((style) => (
                                <TouchableOpacity
                                    key={style.id}
                                    style={[
                                        styles.styleChip,
                                        selectedStyle === style.id && { backgroundColor: theme.primary + '20', borderColor: theme.primary }
                                    ]}
                                    onPress={() => handleStyleSelect(style.id)}
                                >
                                    <Text style={styles.styleEmoji}>{style.emoji}</Text>
                                    <Text style={[
                                        styles.styleName,
                                        { color: selectedStyle === style.id ? theme.primary : theme.text }
                                    ]}>{style.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Avatar Grid */}
                        <ScrollView contentContainerStyle={styles.grid}>
                            {avatars.map((avatar) => (
                                <TouchableOpacity
                                    key={avatar.seed}
                                    style={[
                                        styles.avatarItem,
                                        selectedAvatarUrl === avatar.url && { borderColor: theme.primary, borderWidth: 3, backgroundColor: theme.primary + '10' }
                                    ]}
                                    onPress={() => handleAvatarSelect(avatar.url)}
                                >
                                    <SvgUri uri={avatar.url} width={64} height={64} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.photoContent}>
                        <View style={[styles.previewContainer, { borderColor: theme.border }]}>
                            {selectedAvatarUrl ? (
                                selectedAvatarUrl.includes('data:image') || !selectedAvatarUrl.includes('dicebear') ? (
                                    <Image source={{ uri: selectedAvatarUrl }} style={styles.previewImage} />
                                ) : (
                                    <SvgUri uri={selectedAvatarUrl} width={150} height={150} />
                                )
                            ) : currentAvatarUrl ? (
                                currentAvatarUrl.includes('dicebear') ? (
                                    <SvgUri uri={currentAvatarUrl} width={150} height={150} />
                                ) : (
                                    <Image source={{ uri: currentAvatarUrl }} style={styles.previewImage} />
                                )
                            ) : (
                                <View style={[styles.placeholder, { backgroundColor: theme.primary }]}>
                                    <ImageIcon size={64} color="white" />
                                </View>
                            )}
                        </View>

                        <Button
                            title="Pick from Gallery"
                            onPress={pickImage}
                            icon={<ImageIcon size={20} color="white" />}
                            style={{ marginTop: SPACING.xl }}
                        />
                    </View>
                )}

                <View style={[styles.footer, { borderTopColor: theme.border }]}>
                    <Button
                        title={uploading ? "Saving..." : "Save Avatar ✨"}
                        onPress={handleSave}
                        disabled={!selectedAvatarUrl || uploading}
                        style={{ width: '100%' }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
    },
    closeButton: {
        padding: SPACING.xs,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabText: {
        fontWeight: '600',
        fontSize: FONT_SIZES.md,
    },
    content: {
        flex: 1,
    },
    styleSelector: {
        flexGrow: 0,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        maxHeight: 70,
    },
    styleChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: 'transparent',
        backgroundColor: '#F0F0F0',
        marginRight: SPACING.sm,
        height: 40,
    },
    styleEmoji: {
        fontSize: 16,
    },
    styleName: {
        fontWeight: '600',
        fontSize: FONT_SIZES.sm,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SPACING.md,
        gap: SPACING.md,
        justifyContent: 'center',
    },
    avatarItem: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    photoContent: {
        flex: 1,
        alignItems: 'center',
        padding: SPACING.xl,
        justifyContent: 'center',
    },
    previewContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: SPACING.lg,
        borderTopWidth: 1,
        paddingBottom: 40,
    },
});
