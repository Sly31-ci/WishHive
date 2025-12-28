import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    TextInput,
} from 'react-native';
import { X, Check, Palette, LayoutGrid, Type } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { WishlistTheme, WISHLIST_TEMPLATES, DEFAULT_THEME } from '@/constants/wishlistThemes';
import { ThemePreview } from './ThemePreview';
import { ColorPicker } from './ColorPicker';
import Button from './Button';
import TypographyEditor from './TypographyEditor';
import LiveThemePreview from './LiveThemePreview';
import EditorActionBar from './EditorActionBar';
import { DEFAULT_TYPOGRAPHY } from '@/constants/wishlistThemes';
import { useThemeEditor } from '@/hooks/useThemeEditor';
import * as Haptics from 'expo-haptics';

interface WishlistThemeSelectorProps {
    visible: boolean;
    onClose: () => void;
    currentTheme: WishlistTheme;
    wishlistTitle: string;
    onSave: (theme: WishlistTheme) => void;
}

export function WishlistThemeSelector({
    visible,
    onClose,
    currentTheme,
    wishlistTitle,
    onSave,
}: WishlistThemeSelectorProps) {
    const [activeTab, setActiveTab] = useState<'templates' | 'custom' | 'text'>('templates');

    // Use theme editor hook for undo/redo functionality
    const {
        theme,
        updateTheme,
        undo,
        redo,
        reset,
        canUndo,
        canRedo,
        hasChanges,
    } = useThemeEditor(currentTheme);

    const handleSave = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onSave(theme);
        onClose();
    };

    const handleTemplateSelect = (template: WishlistTheme) => {
        Haptics.selectionAsync();
        updateTheme(template);
    };

    const handleColorChange = (key: 'primaryColor' | 'secondaryColor' | 'accentColor', color: string) => {
        updateTheme({ [key]: color });
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Personnaliser</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={COLORS.dark} />
                    </TouchableOpacity>
                </View>

                {/* Preview Section */}
                <View style={styles.previewSection}>
                    <LiveThemePreview
                        theme={theme}
                        wishlistTitle={wishlistTitle}
                    />
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'templates' && styles.activeTab]}
                        onPress={() => setActiveTab('templates')}
                    >
                        <LayoutGrid size={20} color={activeTab === 'templates' ? COLORS.primary : COLORS.gray[500]} />
                        <Text style={[styles.tabText, activeTab === 'templates' && styles.activeTabText]}>Templates</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'custom' && styles.activeTab]}
                        onPress={() => setActiveTab('custom')}
                    >
                        <Palette size={20} color={activeTab === 'custom' ? COLORS.primary : COLORS.gray[500]} />
                        <Text style={[styles.tabText, activeTab === 'custom' && styles.activeTabText]}>Personnalisé</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'text' && styles.activeTab]}
                        onPress={() => setActiveTab('text')}
                    >
                        <Type size={20} color={activeTab === 'text' ? COLORS.primary : COLORS.gray[500]} />
                        <Text style={[styles.tabText, activeTab === 'text' && styles.activeTabText]}>Texte</Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView style={styles.content}>
                    {activeTab === 'templates' ? (
                        <View style={styles.grid}>
                            {WISHLIST_TEMPLATES.map((template) => (
                                <TouchableOpacity
                                    key={template.template}
                                    style={[
                                        styles.templateCard,
                                        theme.template === template.template && styles.selectedTemplate
                                    ]}
                                    onPress={() => handleTemplateSelect(template)}
                                >
                                    <ThemePreview theme={template} size="small" />
                                    <Text style={styles.templateName}>{template.style}</Text>
                                    {theme.template === template.template && (
                                        <View style={styles.checkBadge}>
                                            <Check size={12} color={COLORS.white} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : activeTab === 'custom' ? (
                        <View style={styles.customForm}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Emoji</Text>
                                <TextInput
                                    style={styles.emojiInput}
                                    value={theme.emoji}
                                    onChangeText={(text) => updateTheme({ emoji: text })}
                                    maxLength={2}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={styles.label}>Dégradé</Text>
                                <Switch
                                    value={theme.gradient}
                                    onValueChange={(val) => updateTheme({ gradient: val })}
                                    trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
                                />
                            </View>

                            <ColorPicker
                                label="Couleur principale"
                                selectedColor={theme.primaryColor}
                                onColorChange={(c) => handleColorChange('primaryColor', c)}
                            />

                            {theme.gradient && (
                                <ColorPicker
                                    label="Couleur secondaire"
                                    selectedColor={theme.secondaryColor}
                                    onColorChange={(c) => handleColorChange('secondaryColor', c)}
                                />
                            )}

                            <ColorPicker
                                label="Couleur accentuation"
                                selectedColor={theme.accentColor}
                                onColorChange={(c) => handleColorChange('accentColor', c)}
                            />
                        </View>
                    ) : activeTab === 'text' ? (
                        <TypographyEditor
                            typography={theme.typography || DEFAULT_TYPOGRAPHY}
                            backgroundColor={theme.primaryColor}
                            onChange={(typography) => updateTheme({ typography })}
                        />
                    ) : null}
                </ScrollView>

                {/* Action Bar */}
                <EditorActionBar
                    canUndo={canUndo}
                    canRedo={canRedo}
                    hasChanges={hasChanges}
                    onUndo={undo}
                    onRedo={redo}
                    onReset={reset}
                    onSave={handleSave}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    header: {
        padding: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
        backgroundColor: COLORS.white,
    },
    headerTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
    },
    closeButton: {
        padding: 4,
    },
    previewSection: {
        padding: SPACING.lg,
        alignItems: 'center',
        backgroundColor: COLORS.gray[50],
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: 4,
        margin: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 8,
        borderRadius: BORDER_RADIUS.sm,
    },
    activeTab: {
        backgroundColor: COLORS.primary + '10',
    },
    tabText: {
        fontWeight: '600',
        color: COLORS.gray[500],
    },
    activeTabText: {
        color: COLORS.primary,
    },
    content: {
        flex: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SPACING.md,
        gap: SPACING.md,
    },
    templateCard: {
        width: '47%',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        ...SHADOWS.sm,
    },
    selectedTemplate: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '05',
    },
    templateName: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.dark,
        textTransform: 'capitalize',
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.primary,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customForm: {
        padding: SPACING.md,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginBottom: 8,
    },
    emojiInput: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: 32,
        textAlign: 'center',
        width: 80,
        alignSelf: 'center',
        backgroundColor: COLORS.white,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    footer: {
        padding: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
        backgroundColor: COLORS.white,
        marginBottom: 20, // Safe area
    },
});
