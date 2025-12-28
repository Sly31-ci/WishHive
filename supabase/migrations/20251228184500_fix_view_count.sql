-- Migration Fix: View count increment and NULL safety
-- Purpose: Fix view count always being 0 due to potential NULL values and parameter mismatches

-- 1. Update increment_view_count with COALESCE and GRANT
CREATE OR REPLACE FUNCTION increment_view_count(p_wishlist_id uuid)
RETURNS void AS $$
DECLARE
  v_owner_id uuid;
  v_title text;
BEGIN
  -- Increment count safely (handling potential NULL with COALESCE)
  UPDATE wishlists
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = p_wishlist_id
  RETURNING owner_id, title INTO v_owner_id, v_title;

  -- Notify owner (if not the one viewing)
  -- auth.uid() is null for anonymous web visitors
  IF v_owner_id IS NOT NULL AND (auth.uid() IS NULL OR v_owner_id != auth.uid()) THEN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      v_owner_id, 
      'view',
      'Nouvelle visite ! 👁️', 
      'Quelqu''un vient de consulter votre liste "' || v_title || '".',
      jsonb_build_object('wishlist_id', p_wishlist_id, 'action', 'view')
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure public can call this function
GRANT EXECUTE ON FUNCTION increment_view_count(uuid) TO anon;
GRANT EXECUTE ON FUNCTION increment_view_count(uuid) TO authenticated;

-- 3. Also fix handle_new_interaction_notification to use author_id correctly
CREATE OR REPLACE FUNCTION handle_new_interaction_notification()
RETURNS TRIGGER AS $$
DECLARE
  v_owner_id uuid;
  v_title text;
BEGIN
  SELECT owner_id, title INTO v_owner_id, v_title
  FROM wishlists WHERE id = NEW.wishlist_id;

  -- Don't notify if the action is done by the owner themselves
  -- NEW.author_id captures the ID of the person reacting
  IF v_owner_id IS NOT NULL AND (NEW.author_id IS NULL OR v_owner_id != NEW.author_id) THEN
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
        'message', 
        'Nouveau message ! 💬', 
        'Vous avez reçu un petit mot doux sur votre liste "' || v_title || '".',
        jsonb_build_object('wishlist_id', NEW.wishlist_id, 'interaction_id', NEW.id)
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
