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
    Image,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ArrowLeft, Send, Users, Info } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { chatService, ChatMessage, ChatRoom } from '@/lib/chat-service';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [room, setRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadRoomAndMessages();

        // Subscribe to new messages
        const subscription = chatService.subscribeToMessages(id, (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
            // Scroll to bottom on new message if near bottom
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [id]);

    const loadRoomAndMessages = async () => {
        setLoading(true);
        try {
            // Load room info
            const { data: roomData, error: roomError } = await supabase
                .from('chat_rooms')
                .select('*')
                .eq('id', id)
                .single();

            if (roomError) throw roomError;
            setRoom(roomData);

            // Load messages
            const msgs = await chatService.getMessages(id);
            setMessages(msgs);
        } catch (error) {
            console.error('Error loading chat:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !user || !id || sending) return;

        const textToSend = inputText.trim();
        setInputText('');
        setSending(true);

        try {
            await chatService.sendMessage(id, user.id, textToSend);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
            console.error('Error sending message:', error);
            setInputText(textToSend); // Restore text on error
        } finally {
            setSending(false);
        }
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isMine = item.sender_id === user?.id;

        return (
            <View style={[styles.messageContainer, isMine ? styles.myMessageContainer : styles.otherMessageContainer]}>
                {!isMine && (
                    <View style={styles.avatar}>
                        <Users size={16} color={COLORS.gray[400]} />
                    </View>
                )}
                <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
                    {!isMine && <Text style={styles.senderName}>{item.sender?.username || 'Utilisateur'}</Text>}
                    <Text style={[styles.messageText, isMine ? styles.myMessageText : styles.otherMessageText]}>
                        {item.content}
                    </Text>
                    <Text style={[styles.timeText, isMine ? styles.myTimeText : styles.otherTimeText]}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
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
                    headerTitle: room?.name || 'Chat',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={styles.headerButton}>
                            <Info size={20} color={COLORS.gray[600]} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Écrivez un message..."
                    value={inputText}
                    onChangeText={setInputText}
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
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButton: {
        padding: 8,
    },
    messagesList: {
        padding: SPACING.md,
        paddingBottom: SPACING.lg,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
        maxWidth: '80%',
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginTop: 4,
    },
    bubble: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    myBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 4,
    },
    senderName: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.gray[500],
        marginBottom: 2,
    },
    messageText: {
        fontSize: FONT_SIZES.md,
        lineHeight: 20,
    },
    myMessageText: {
        color: COLORS.white,
    },
    otherMessageText: {
        color: COLORS.dark,
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimeText: {
        color: 'rgba(255,255,255,0.7)',
    },
    otherTimeText: {
        color: COLORS.gray[400],
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
    },
    input: {
        flex: 1,
        maxHeight: 100,
        backgroundColor: COLORS.gray[50],
        borderRadius: BORDER_RADIUS.full,
        paddingHorizontal: SPACING.md,
        paddingVertical: 8,
        marginRight: SPACING.sm,
        fontSize: FONT_SIZES.md,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.gray[300],
    },
});
