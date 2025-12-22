import { supabase } from './supabase';
import { Database } from '@/types/database';

export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'] & {
    sender?: {
        username: string;
        avatar_url: string | null;
    };
};

export type ChatRoom = Database['public']['Tables']['chat_rooms']['Row'];

export const chatService = {
    /**
     * Fetch messages for a specific room
     */
    async getMessages(roomId: string, limit = 50) {
        const { data, error } = await supabase
            .from('chat_messages')
            .select(`
                *,
                sender:profiles(username, avatar_url)
            `)
            .eq('room_id', roomId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return (data || []).reverse() as ChatMessage[];
    },

    /**
     * Send a message to a room
     */
    async sendMessage(roomId: string, senderId: string, content: string) {
        const { data, error } = await supabase
            .from('chat_messages')
            .insert({
                room_id: roomId,
                sender_id: senderId,
                content,
            })
            .select()
            .single();

        if (error) throw error;
        return data as ChatMessage;
    },

    /**
     * Subscribe to new messages in a room
     */
    subscribeToMessages(roomId: string, onNewMessage: (message: ChatMessage) => void) {
        return supabase
            .channel(`room:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `room_id=eq.${roomId}`,
                },
                async (payload) => {
                    // Fetch full message with sender profile
                    const { data, error } = await supabase
                        .from('chat_messages')
                        .select(`
                            *,
                            sender:profiles(username, avatar_url)
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (!error && data) {
                        onNewMessage(data as ChatMessage);
                    }
                }
            )
            .subscribe();
    },

    /**
     * Get or create a private chat room between two users
     */
    async getOrCreatePrivateRoom(userA: string, userB: string) {
        // This logic usually depends on how you store "participants"
        // For simplicity, let's assume we search for a 'private' room with target_id null 
        // and handle participant mapping in a separate table or metadata.
        // Let's use metadata for now if your schema is simple.

        // This is a placeholder for more complex logic
        const { data, error } = await supabase
            .from('chat_rooms')
            .select('*')
            .eq('type', 'private')
            .or(`name.eq.${userA}-${userB},name.eq.${userB}-${userA}`)
            .single();

        if (data) return data;

        const { data: newRoom, error: createError } = await supabase
            .from('chat_rooms')
            .insert({
                type: 'private',
                name: `${userA}-${userB}`,
            })
            .select()
            .single();

        if (createError) throw createError;
        return newRoom;
    }
};
