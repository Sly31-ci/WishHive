-- Missing tables for complete migration (MAPPED FROM CLOUD SCHEMA)

DROP TABLE IF EXISTS chat_reactions CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS wishlist_interactions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- 1. wishlist_interactions
CREATE TABLE wishlist_interactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id uuid REFERENCES wishlists(id) ON DELETE CASCADE NOT NULL,
  item_id uuid DEFAULT NULL, -- Optional relation to a specific item
  interaction_type text NOT NULL,
  content text,
  author_name text,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_anonymous boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT interaction_type_check CHECK (interaction_type IN ('comment', 'reaction'))
);

ALTER TABLE wishlist_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public select" ON wishlist_interactions FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON wishlist_interactions FOR INSERT TO authenticated WITH CHECK (true);

-- 2. chat_messages (Wishlist-based chat)
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id uuid REFERENCES wishlists(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES chat_messages(id) ON DELETE CASCADE,
  mentions jsonb DEFAULT '[]'::jsonb,
  read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public select chat" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Auth insert chat" ON chat_messages FOR INSERT TO authenticated WITH CHECK (true);

-- 3. notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT notifications_type_check CHECK (type IN ('follow', 'like', 'gift', 'system', 'message', 'view'))
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System can insert" ON notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own" ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE INDEX idx_wishlist_interactions_wishlist ON wishlist_interactions(wishlist_id);
CREATE INDEX idx_chat_messages_wishlist ON chat_messages(wishlist_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE read = false;
