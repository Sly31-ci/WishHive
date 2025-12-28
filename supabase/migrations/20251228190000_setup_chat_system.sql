-- Migration: Upgrade Chat System (Messages, Replies, Reactions)
-- Created: 2025-12-28

BEGIN;

-- 1. Ensure chat_messages has the required columns for modern features
DO $$ 
BEGIN
    -- Add wishlist_id if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='wishlist_id') THEN
        ALTER TABLE chat_messages ADD COLUMN wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE;
    END IF;

    -- Add parent_id for Replies if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='parent_id') THEN
        ALTER TABLE chat_messages ADD COLUMN parent_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL;
    END IF;

    -- Add mentions for @mentions if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='mentions') THEN
        ALTER TABLE chat_messages ADD COLUMN mentions UUID[] DEFAULT '{}';
    END IF;
END $$;

-- 2. Create chat_reactions table if not exists
CREATE TABLE IF NOT EXISTS chat_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- 3. Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_reactions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for chat_messages (Careful with existing ones)
-- We use OR REPLACE equivalent or just DROP and CREATE
DROP POLICY IF EXISTS "Wishlist chat is visible to authorized users" ON chat_messages;
CREATE POLICY "Wishlist chat is visible to authorized users" ON chat_messages
    FOR SELECT USING (
        (wishlist_id IS NULL) OR -- Keep room-based chat working
        EXISTS (
            SELECT 1 FROM wishlists 
            WHERE id = chat_messages.wishlist_id 
            AND (privacy = 'public' OR owner_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can send messages to wishlists they can see" ON chat_messages;
CREATE POLICY "Users can send messages to wishlists they can see" ON chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        (wishlist_id IS NULL OR EXISTS (
            SELECT 1 FROM wishlists 
            WHERE id = wishlist_id 
            AND (privacy = 'public' OR owner_id = auth.uid())
        ))
    );

-- 5. RLS Policies for chat_reactions
DROP POLICY IF EXISTS "Reactions are visible to authorized users" ON chat_reactions;
CREATE POLICY "Reactions are visible to authorized users" ON chat_reactions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can react to messages" ON chat_reactions;
CREATE POLICY "Users can react to messages" ON chat_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own reactions" ON chat_reactions;
CREATE POLICY "Users can remove their own reactions" ON chat_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Update Notification types
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('follow', 'like', 'gift', 'system', 'message', 'view', 'mention', 'reply'));

-- 7. Trigger for Notifications (Replies and Mentions)
CREATE OR REPLACE FUNCTION handle_chat_notification()
RETURNS TRIGGER AS $$
DECLARE
    v_sender_name TEXT;
    v_parent_sender_id UUID;
    v_mention_id UUID;
    v_target_user_id UUID;
BEGIN
    -- Get sender username
    SELECT username INTO v_sender_name FROM profiles WHERE id = NEW.sender_id;

    -- 1. Handle Mentions
    IF NEW.mentions IS NOT NULL AND array_length(NEW.mentions, 1) > 0 THEN
        FOREACH v_mention_id IN ARRAY NEW.mentions LOOP
            IF v_mention_id != NEW.sender_id THEN
                INSERT INTO notifications (user_id, type, title, message, data)
                VALUES (
                    v_mention_id,
                    'mention',
                    'On parle de vous ! 💬',
                    v_sender_name || ' vous a mentionné dans un chat.',
                    jsonb_build_object('wishlist_id', NEW.wishlist_id, 'message_id', NEW.id, 'type', 'mention')
                );
            END IF;
        END LOOP;
    END IF;

    -- 2. Handle Replies (notify the original message author)
    IF NEW.parent_id IS NOT NULL THEN
        SELECT sender_id INTO v_parent_sender_id FROM chat_messages WHERE id = NEW.parent_id;
        
        IF v_parent_sender_id IS NOT NULL 
           AND v_parent_sender_id != NEW.sender_id 
           AND (NEW.mentions IS NULL OR NOT (v_parent_sender_id = ANY(NEW.mentions))) THEN
            
            INSERT INTO notifications (user_id, type, title, message, data)
            VALUES (
                v_parent_sender_id,
                'reply',
                'Nouveau message ! ↩️',
                v_sender_name || ' a répondu à votre message.',
                jsonb_build_object('wishlist_id', NEW.wishlist_id, 'message_id', NEW.id, 'type', 'reply')
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_chat_message_notify ON chat_messages;
CREATE TRIGGER on_chat_message_notify
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION handle_chat_notification();

COMMIT;
