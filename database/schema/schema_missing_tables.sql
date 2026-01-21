-- Missing tables for complete migration (FIXED to match Cloud schema)

-- Drop existing tables to recreate with correct schema
DROP TABLE IF EXISTS chat_reactions CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS wishlist_interactions CASCADE;

-- 1. wishlist_interactions (comments/reactions on wishlists)
CREATE TABLE wishlist_interactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id uuid REFERENCES wishlists(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE, -- FIXED: was 'user_id'
  interaction_type text NOT NULL,
  content text,
  is_anonymous boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT interaction_type_check CHECK (interaction_type IN ('comment', 'reaction'))
);

ALTER TABLE wishlist_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interactions on accessible wishlists"
  ON wishlist_interactions FOR SELECT
  USING (
    wishlist_id IN (
      SELECT id FROM wishlists WHERE privacy = 'public'
    )
    OR wishlist_id IN (
      SELECT id FROM wishlists WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create interactions"
  ON wishlist_interactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_wishlist_interactions_wishlist ON wishlist_interactions(wishlist_id);
CREATE INDEX idx_wishlist_interactions_author ON wishlist_interactions(author_id);

-- 2. chat_messages (direct messages between users)
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL, -- FIXED: was 'message'
  read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_receiver ON chat_messages(receiver_id);
CREATE INDEX idx_chat_messages_unread ON chat_messages(receiver_id) WHERE read = false;

-- 3. chat_reactions (reactions to chat messages)
CREATE TABLE chat_reactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id uuid REFERENCES chat_messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(message_id, user_id, emoji)
);

ALTER TABLE chat_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reactions on accessible messages"
  ON chat_reactions FOR SELECT
  TO authenticated
  USING (
    message_id IN (
      SELECT id FROM chat_messages 
      WHERE sender_id = auth.uid() OR receiver_id = auth.uid()
    )
  );

CREATE POLICY "Users can add reactions"
  ON chat_reactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_chat_reactions_message ON chat_reactions(message_id);
