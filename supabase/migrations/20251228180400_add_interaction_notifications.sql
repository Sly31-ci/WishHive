-- Migration: Add notifications for reactions, messages and views
-- Created: 2025-12-28

-- 1. Ensure notification types are flexible or updated
-- (Assuming a check constraint might exist, we try to update types)
DO $$ 
BEGIN
    ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
    ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
    CHECK (type IN ('follow', 'like', 'gift', 'system', 'message', 'view'));
EXCEPTION
    WHEN undefined_table THEN
        -- Table doesn't exist yet, handle gracefully if needed or let it fail
        RAISE NOTICE 'Notifications table not found';
END $$;

-- 2. Update increment_view_count to generate notifications
CREATE OR REPLACE FUNCTION increment_view_count(p_wishlist_id uuid)
RETURNS void AS $$
DECLARE
  v_owner_id uuid;
  v_title text;
BEGIN
  -- Increment count
  UPDATE wishlists
  SET view_count = view_count + 1
  WHERE id = p_wishlist_id
  RETURNING owner_id, title INTO v_owner_id, v_title;

  -- Notify owner (if not the one viewing)
  IF v_owner_id IS NOT NULL AND (auth.uid() IS NULL OR v_owner_id != auth.uid()) THEN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      v_owner_id, 
      'view', -- Changed to specific type
      'Nouvelle visite ! 👁️', 
      'Quelqu''un vient de consulter votre liste "' || v_title || '".',
      jsonb_build_object('wishlist_id', p_wishlist_id, 'action', 'view')
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger for interactions (reactions and messages)
CREATE OR REPLACE FUNCTION handle_new_interaction_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_owner_id uuid;
  v_title text;
BEGIN
  SELECT owner_id, title INTO v_owner_id, v_title
  FROM wishlists WHERE id = NEW.wishlist_id;

  -- Don't notify if the action is done by the owner themselves
  IF v_owner_id IS NOT NULL AND (auth.uid() IS NULL OR v_owner_id != auth.uid()) THEN
    IF NEW.interaction_type = 'reaction' THEN
      INSERT INTO notifications (user_id, type, title, message, data)
      VALUES (
        v_owner_id, 
        'like', 
        'Nouvelle réaction ! ✨', 
        'Quelqu''un a ajouté "' || NEW.content || '" à votre liste "' || v_title || '".',
        jsonb_build_object('wishlist_id', NEW.wishlist_id, 'interaction_id', NEW.id, 'emoji', NEW.content)
      );
    ELSIF NEW.interaction_type = 'comment' THEN
      INSERT INTO notifications (user_id, type, title, message, data)
      VALUES (
        v_owner_id, 
        'message', -- Changed to specific type
        'Nouveau message ! 💬', 
        'Vous avez reçu un petit mot doux sur votre liste "' || v_title || '".',
        jsonb_build_object('wishlist_id', NEW.wishlist_id, 'interaction_id', NEW.id)
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_wishlist_interaction_notify ON wishlist_interactions;
CREATE TRIGGER on_wishlist_interaction_notify
  AFTER INSERT ON wishlist_interactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_interaction_notification();

-- 4. Add index for faster notification lookups
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE read = false;
