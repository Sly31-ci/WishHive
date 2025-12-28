import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { MessageSquare, ArrowLeft, X, AtSign, Send } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/theme';
import { Caption, Body } from '@/components/Text';
import Icon from '@/components/Icon';
import Colors from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import { MessageBubble, ChatMessage } from '@/components/chat/MessageBubble';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';

// Backward compatibility
const COLORS = {
    ...Colors.light,
    white: Colors.brand.pureWhite,
    gray: Colors.gray,
    dark: Colors.light.textPrimary,
};
const SPACING = theme.spacing;
const FONT_SIZES = theme.typography.sizes;
const BORDER_RADIUS = theme.borderRadius;

export default function WishlistChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { profile } = useAuth();
    const [wishlist, setWishlist] = useState<any>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);
    const [mentionSearch, setMentionSearch] = useState<string | null>(null);
    const [mentionSuggestions, setMentionSuggestions] = useState<any[]>([]);
    const flashListRef = useRef<FlatList>(null);

    // Derive participants from messages
    const participants = React.useMemo(() => {
        const usersMap = new Map();
        messages.forEach(msg => {
            if (msg.sender.id !== profile?.id) {
                usersMap.set(msg.sender.id, msg.sender);
            }
        });
        return Array.from(usersMap.values());
    }, [messages, profile?.id]);

    useEffect(() => {
        loadWishlistAndMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`wishlist_chat:${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `wishlist_id=eq.${id}`,
                },
                async (payload) => {
                    const { data, error } = await (supabase
                        .from('chat_messages') as any)
                        .select(`
                            *,
                            sender:profiles(id, username, avatar_url),
                            parent:parent_id(id, content, sender:profiles(username))
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (!error && data) {
                        const formattedMsg: ChatMessage = {
                            id: data.id,
                            content: data.content,
                            sender: data.sender,
                            created_at: data.created_at,
                            is_me: data.sender_id === profile?.id,
                            parent: data.parent ? {
                                id: data.parent.id,
                                content: data.parent.content,
                                sender_name: data.parent.sender.username
                            } : null,
                            reactions: []
                        };
                        setMessages(prev => [...prev, formattedMsg]);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                }
            )
            .on('broadcast', { event: 'typing' }, ({ payload }) => {
                if (payload.userId !== profile?.id) {
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 3000);
                }
            })
            .subscribe();

        // Subscribe to reactions updates
        const reactionsChannel = supabase
            .channel(`chat_reactions:${id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'chat_reactions',
                },
                () => {
                    // Refresh messages to get updated reaction counts
                    // In a more complex app, we'd update only the specific message in state
                    loadWishlistAndMessages();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(reactionsChannel);
        };
    }, [id, profile?.id]);

    const loadWishlistAndMessages = async () => {
        setLoading(true);
        try {
            // Load wishlist info
            const { data: wishlistData } = await supabase
                .from('wishlists')
                .select('title, theme')
                .eq('id', id)
                .single();
            setWishlist(wishlistData);

            // Load messages with reactions
            const { data: msgsData, error } = await (supabase
                .from('chat_messages') as any)
                .select(`
                    *,
                    sender:profiles(id, username, avatar_url),
                    parent:parent_id(id, content, sender:profiles(username)),
                    reactions:chat_reactions(emoji, user_id)
                `)
                .eq('wishlist_id', id)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const formattedMessages: ChatMessage[] = (msgsData || []).map((msg: any) => {
                // Group reactions
                const reactionGroups = (msg.reactions as any[] || []).reduce((acc: any, curr: any) => {
                    if (!acc[curr.emoji]) acc[curr.emoji] = { count: 0, user_reacted: false };
                    acc[curr.emoji].count += 1;
                    if (curr.user_id === profile?.id) acc[curr.emoji].user_reacted = true;
                    return acc;
                }, {});

                return {
                    id: msg.id,
                    content: msg.content,
                    sender: msg.sender,
                    created_at: msg.created_at,
                    is_me: msg.sender_id === profile?.id,
                    parent: msg.parent ? {
                        id: msg.parent.id,
                        content: msg.parent.content,
                        sender_name: msg.parent.sender.username
                    } : null,
                    reactions: Object.entries(reactionGroups).map(([emoji, data]: [string, any]) => ({
                        emoji,
                        count: data.count,
                        user_reacted: data.user_reacted
                    }))
                };
            });

            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error loading chat:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !profile || !id || sending) return;

        const textToSend = inputText.trim();
        const parentId = replyingTo?.id;

        // Extract mentions IDs for notification triggers
        const mentionRegex = /@(\w+)/g;
        const matches = [...textToSend.matchAll(mentionRegex)];
        const mentionedUsernames = matches.map(m => m[1]);

        const mentions: string[] = participants
            .filter(p => mentionedUsernames.includes(p.username))
            .map(p => p.id);

        setInputText('');
        setReplyingTo(null);
        setSending(true);

        try {
            const { error } = await (supabase
                .from('chat_messages') as any)
                .insert({
                    wishlist_id: id,
                    sender_id: profile.id,
                    content: textToSend,
                    parent_id: parentId,
                    mentions: mentions
                });

            if (error) throw error;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error('Error sending message:', error);
            setInputText(textToSend);
            Alert.alert('Erreur', 'Impossible d\'envoyer le message.');
        } finally {
            setSending(false);
        }
    };

    const handleReaction = async (messageId: string, emoji: string) => {
        if (!profile) return;

        try {
            // Check if already reacted
            const { data: existing } = await (supabase
                .from('chat_reactions' as any) as any)
                .select('id')
                .eq('message_id', messageId)
                .eq('user_id', profile.id)
                .eq('emoji', emoji)
                .single();

            if (existing) {
                await (supabase.from('chat_reactions' as any) as any).delete().eq('id', (existing as any).id);
            } else {
                await (supabase.from('chat_reactions' as any) as any).insert({
                    message_id: messageId,
                    user_id: profile.id,
                    emoji: emoji
                });
            }
            // Realtime will update UI theoretically (if we add subscription, for now we manual refresh or rely on local state update)
            loadWishlistAndMessages();
        } catch (error) {
            console.error('Error reacting:', error);
        }
    };

    const handleInputTyping = (text: string) => {
        setInputText(text);

        // Detect mention trigger
        const lastWord = text.split(/\s/).pop() || '';
        if (lastWord.startsWith('@')) {
            const search = lastWord.slice(1);
            setMentionSearch(search);
            const matches = participants.filter(p =>
                p.username.toLowerCase().includes(search.toLowerCase())
            );
            setMentionSuggestions(matches);
        } else {
            setMentionSearch(null);
        }

        // Broadcast typing status
        supabase.channel(`wishlist_chat:${id}`).send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId: profile?.id }
        });
    };

    const handleMentionSelect = (username: string) => {
        const words = inputText.split(/\s/);
        words.pop(); // Remove the partial @mention
        const newText = [...words, `@${username} `].join(' ');
        setInputText(newText);
        setMentionSearch(null);
        setMentionSuggestions([]);
    };

    const handleScrollToMessage = (messageId: string) => {
        const index = messages.findIndex(m => m.id === messageId);
        if (index !== -1) {
            flashListRef.current?.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5
            });
            Haptics.selectionAsync();
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Stack.Screen
                options={{
                    headerTitle: wishlist?.title || 'Chat',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <FlatList
                ref={flashListRef}
                data={messages}
                renderItem={({ item }: { item: ChatMessage }) => (
                    <MessageBubble
                        message={item}
                        onReply={setReplyingTo}
                        onReaction={handleReaction}
                        onLongPress={(msg) => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            setReplyingTo(msg);
                        }}
                        onPressParent={handleScrollToMessage}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flashListRef.current?.scrollToEnd({ animated: true })}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MessageSquare size={48} color={COLORS.gray[200]} />
                        <Text style={styles.emptyText}>Commencez la discussion !</Text>
                    </View>
                }
            />

            {isTyping && (
                <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.typingIndicator}>
                    <Text style={styles.typingText}>Quelqu'un écrit...</Text>
                </Animated.View>
            )}

            <View style={styles.inputWrapper}>
                {mentionSearch !== null && mentionSuggestions.length > 0 && (
                    <Animated.View entering={SlideInDown} style={styles.mentionSuggestionsContainer}>
                        {mentionSuggestions.map(user => (
                            <TouchableOpacity
                                key={user.id}
                                style={styles.suggestionItem}
                                onPress={() => handleMentionSelect(user.username)}
                            >
                                <Image
                                    source={{ uri: user.avatar_url || 'https://ui-avatars.com/api/?name=' + user.username }}
                                    style={styles.suggestionAvatar}
                                />
                                <Text style={styles.suggestionUsername}>{user.username}</Text>
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                )}

                {replyingTo && (
                    <Animated.View entering={SlideInDown} style={styles.replyPreviewBar}>
                        <View style={styles.replyPreviewInfo}>
                            <Text style={styles.replyToWho}>Répondre à {replyingTo.sender.username}</Text>
                            <Text style={styles.replyToWhat} numberOfLines={1}>{replyingTo.content}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setReplyingTo(null)}>
                            <X size={20} color={COLORS.gray[500]} />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.atButton}>
                        <AtSign size={20} color={COLORS.gray[400]} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Écrivez un message..."
                        value={inputText}
                        onChangeText={handleInputTyping}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        disabled={!inputText.trim() || sending}
                    >
                        <Send size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButton: {
        padding: 8,
    },
    messagesList: {
        paddingVertical: SPACING.md,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: SPACING.md,
        color: COLORS.gray[400],
        fontSize: FONT_SIZES.md,
    },
    inputWrapper: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[100],
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    replyPreviewBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.gray[50],
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    replyPreviewInfo: {
        flex: 1,
    },
    replyToWho: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
    },
    replyToWhat: {
        fontSize: 12,
        color: COLORS.gray[600],
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    atButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        maxHeight: 120,
        backgroundColor: COLORS.gray[50],
        borderRadius: 20,
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        fontSize: FONT_SIZES.md,
        marginHorizontal: SPACING.xs,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.gray[300],
    },
    typingIndicator: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: 4,
    },
    typingText: {
        fontSize: 11,
        color: COLORS.gray[400],
        fontStyle: 'italic',
    },
    mentionSuggestionsContainer: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[100],
        maxHeight: 200,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[50],
    },
    suggestionAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: SPACING.sm,
    },
    suggestionUsername: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
});
