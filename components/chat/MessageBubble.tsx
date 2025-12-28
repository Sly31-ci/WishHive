import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Reply, MessageSquare } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/constants/theme';
import Animated, { FadeIn, SlideInRight, SlideInLeft } from 'react-native-reanimated';

/**
 * Highlights @mentions in text
 */
const FormattedText = ({ text, isMe }: { text: string; isMe: boolean }) => {
    const parts = text.split(/(@\w+)/g);
    return (
        <Text>
            {parts.map((part, i) => {
                if (part.startsWith('@')) {
                    return (
                        <Text key={i} style={[styles.mention, isMe ? styles.myMention : styles.otherMention]}>
                            {part}
                        </Text>
                    );
                }
                return <Text key={i}>{part}</Text>;
            })}
        </Text>
    );
};

export interface ChatMessage {
    id: string;
    content: string;
    sender: {
        id: string;
        username: string;
        avatar_url?: string;
    };
    created_at: string;
    is_me: boolean;
    parent?: {
        id: string;
        content: string;
        sender_name: string;
    } | null;
    reactions?: Array<{
        emoji: string;
        count: number;
        user_reacted: boolean;
    }>;
}

interface MessageBubbleProps {
    message: ChatMessage;
    onReply?: (message: ChatMessage) => void;
    onReaction?: (messageId: string, emoji: string) => void;
    onLongPress?: (message: ChatMessage) => void;
    onPressParent?: (parentId: string) => void;
}

export const MessageBubble = ({
    message,
    onReply,
    onReaction,
    onLongPress,
    onPressParent
}: MessageBubbleProps) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Animated.View
            entering={message.is_me ? SlideInRight : SlideInLeft}
            style={[
                styles.container,
                message.is_me ? styles.myMessageContainer : styles.otherMessageContainer
            ]}
        >
            {!message.is_me && (
                <Image
                    source={{ uri: message.sender.avatar_url || 'https://ui-avatars.com/api/?name=' + message.sender.username }}
                    style={styles.avatar}
                />
            )}

            <View style={[
                styles.bubbleWrapper,
                message.is_me ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }
            ]}>
                {!message.is_me && (
                    <Text style={styles.senderName}>{message.sender.username}</Text>
                )}

                <TouchableOpacity
                    onLongPress={() => onLongPress?.(message)}
                    activeOpacity={0.9}
                    style={[
                        styles.bubble,
                        message.is_me ? styles.myBubble : styles.otherBubble
                    ]}
                >
                    {/* Reply Preview */}
                    {message.parent && (
                        <TouchableOpacity
                            onPress={() => onPressParent?.(message.parent!.id)}
                            style={styles.replyPreview}
                        >
                            <View style={styles.replyLine} />
                            <View>
                                <Text style={styles.replySender}>{message.parent.sender_name}</Text>
                                <Text style={styles.replyText} numberOfLines={1}>{message.parent.content}</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    <View style={styles.content}>
                        <FormattedText text={message.content} isMe={message.is_me} />
                    </View>

                    <Text style={[
                        styles.time,
                        message.is_me ? styles.myTime : styles.otherTime
                    ]}>
                        {formatTime(message.created_at)}
                    </Text>
                </TouchableOpacity>

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                    <View style={styles.reactionsRow}>
                        {message.reactions.map((reaction, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => onReaction?.(message.id, reaction.emoji)}
                                style={[
                                    styles.reactionBadge,
                                    reaction.user_reacted && styles.userReactedBadge
                                ]}
                            >
                                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                                <Text style={[
                                    styles.reactionCount,
                                    reaction.user_reacted && styles.userReactedText
                                ]}>
                                    {reaction.count}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: SPACING.xs,
        paddingHorizontal: SPACING.md,
        alignItems: 'flex-end',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    otherMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: SPACING.sm,
        backgroundColor: COLORS.gray[200],
    },
    bubbleWrapper: {
        maxWidth: '80%',
    },
    senderName: {
        fontSize: 12,
        color: COLORS.gray[500],
        marginBottom: 2,
        marginLeft: 4,
        fontWeight: '600',
    },
    bubble: {
        borderRadius: 18,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        minWidth: 60,
    },
    myBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.gray[100],
    },
    content: {
        paddingVertical: 2,
    },
    myContent: {
        color: COLORS.white,
    },
    otherContent: {
        color: COLORS.dark,
    },
    time: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 2,
    },
    myTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    otherTime: {
        color: COLORS.gray[400],
    },
    replyPreview: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 6,
        borderRadius: 8,
        marginBottom: 6,
    },
    replyLine: {
        width: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
        marginRight: 8,
    },
    replySender: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
    },
    replyText: {
        fontSize: 11,
        color: COLORS.gray[600],
    },
    reactionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: -8,
        marginHorizontal: 4,
    },
    reactionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: 4,
        borderWidth: 1,
        borderColor: COLORS.gray[100],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        elevation: 1,
    },
    userReactedBadge: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10',
    },
    reactionEmoji: {
        fontSize: 12,
    },
    reactionCount: {
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 2,
        color: COLORS.gray[600],
    },
    userReactedText: {
        color: COLORS.primary,
    },
    mention: {
        fontWeight: '700',
    },
    myMention: {
        color: COLORS.white,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    otherMention: {
        color: COLORS.primary,
        backgroundColor: COLORS.primary + '10',
    },
});
