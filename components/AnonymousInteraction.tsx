import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Send, Heart, PartyPopper, ThumbsUp, Star } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/constants/theme';
import Button from './Button';

interface AnonymousInteractionProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: { type: 'reaction' | 'comment'; content: string; authorName: string }) => void;
    initialType?: 'reaction' | 'comment';
    wishlistThemeColor?: string;
}

const REACTIONS = ['❤️', '🎉', '👍', '🔥', '👀', '🎁'];

export function AnonymousInteraction({
    visible,
    onClose,
    onSubmit,
    initialType = 'reaction',
    wishlistThemeColor = COLORS.primary
}: AnonymousInteractionProps) {
    const [type, setType] = useState<'reaction' | 'comment'>(initialType);
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState(REACTIONS[0]);

    const handleSubmit = () => {
        if (type === 'comment' && !content.trim()) return;

        const finalContent = type === 'reaction' ? selectedEmoji : content;
        const finalAuthor = authorName.trim() || 'Anonyme';

        onSubmit({
            type,
            content: finalContent,
            authorName: finalAuthor
        });
        onClose();
        // Reset
        setContent('');
        setAuthorName('');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {type === 'reaction' ? 'Envoyer une réaction' : 'Laisser un message'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={COLORS.gray[500]} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, type === 'reaction' && { borderBottomColor: wishlistThemeColor, borderBottomWidth: 2 }]}
                            onPress={() => setType('reaction')}
                        >
                            <Text style={[styles.tabText, type === 'reaction' && { color: wishlistThemeColor }]}>Réaction</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, type === 'comment' && { borderBottomColor: wishlistThemeColor, borderBottomWidth: 2 }]}
                            onPress={() => setType('comment')}
                        >
                            <Text style={[styles.tabText, type === 'comment' && { color: wishlistThemeColor }]}>Message</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.label}>Votre nom (optionnel)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Tante Michelle"
                            value={authorName}
                            onChangeText={setAuthorName}
                        />

                        {type === 'reaction' ? (
                            <View style={styles.emojis}>
                                {REACTIONS.map(emoji => (
                                    <TouchableOpacity
                                        key={emoji}
                                        style={[
                                            styles.emojiButton,
                                            selectedEmoji === emoji && { backgroundColor: wishlistThemeColor + '20', borderColor: wishlistThemeColor }
                                        ]}
                                        onPress={() => setSelectedEmoji(emoji)}
                                    >
                                        <Text style={styles.emoji}>{emoji}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.label}>Votre message</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Écrivez votre message..."
                                    multiline
                                    numberOfLines={4}
                                    value={content}
                                    onChangeText={setContent}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title="Envoyer"
                            onPress={handleSubmit}
                            style={{ backgroundColor: wishlistThemeColor, width: '100%' }}
                            icon={<Send size={18} color={COLORS.white} />}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
    },
    closeButton: {
        padding: 4,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.md,
        alignItems: 'center',
    },
    tabText: {
        fontWeight: '600',
        color: COLORS.gray[500],
    },
    content: {
        gap: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.gray[700],
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: FONT_SIZES.md,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    emojis: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    emojiButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: COLORS.gray[100],
    },
    emoji: {
        fontSize: 24,
    },
    footer: {
        marginTop: SPACING.lg,
    }
});
