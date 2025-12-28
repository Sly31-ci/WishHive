import React from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { X, MessageSquare, Heart, Clock } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '@/constants/theme';
import { Card } from './Card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

interface Interaction {
    id: string;
    interaction_type: 'reaction' | 'comment';
    content: string;
    author_name: string;
    created_at: string;
    item_id?: string;
}

interface InteractionsModalProps {
    visible: boolean;
    onClose: () => void;
    interactions: Interaction[];
    wishlistThemeColor?: string;
}

export function InteractionsModal({
    visible,
    onClose,
    interactions,
    wishlistThemeColor = COLORS.primary
}: InteractionsModalProps) {
    const renderInteraction = ({ item }: { item: Interaction }) => (
        <Card style={styles.interactionCard} padding="md">
            <View style={styles.cardHeader}>
                <View style={styles.authorBadge}>
                    <Text style={styles.authorEmoji}>
                        {item.interaction_type === 'reaction' ? '✨' : '💬'}
                    </Text>
                    <Text style={styles.authorName}>{item.author_name || 'Anonyme'}</Text>
                </View>
                <View style={styles.timeBadge}>
                    <Clock size={12} color={COLORS.gray[400]} />
                    <Text style={styles.timeText}>
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: fr })}
                    </Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                {item.interaction_type === 'reaction' ? (
                    <Text style={styles.reactionText}>{item.content}</Text>
                ) : (
                    <Text style={styles.commentText}>{item.content}</Text>
                )}
            </View>
        </Card>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <MessageSquare size={24} color={wishlistThemeColor} />
                            <Text style={styles.title}>Mur des Douceurs</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={COLORS.gray[500]} />
                        </TouchableOpacity>
                    </View>

                    {interactions.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Heart size={64} color={COLORS.gray[200]} />
                            <Text style={styles.emptyTitle}>Pas encore de messages</Text>
                            <Text style={styles.emptyText}>
                                Partagez votre liste pour recevoir des réactions et des petits mots ! 💫
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={interactions}
                            renderItem={renderInteraction}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.gray[50],
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        height: '80%',
        paddingTop: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
        color: COLORS.dark,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: SPACING.lg,
        gap: SPACING.md,
        paddingBottom: 40,
    },
    interactionCard: {
        backgroundColor: COLORS.white,
        ...SHADOWS.xs,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    authorBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    authorEmoji: {
        fontSize: 16,
    },
    authorName: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        color: COLORS.dark,
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 10,
        color: COLORS.gray[500],
    },
    contentContainer: {
        backgroundColor: COLORS.gray[50],
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
    },
    reactionText: {
        fontSize: 32,
        textAlign: 'center',
    },
    commentText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.dark,
        lineHeight: 22,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xxl,
    },
    emptyTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[500],
        textAlign: 'center',
        lineHeight: 22,
    },
});
