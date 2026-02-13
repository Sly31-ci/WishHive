/*
  # Database Functions and Triggers
  
  ## Summary
  Creates essential database functions and triggers for WishHive automation:
  - Auto-update timestamps
  - Gamification point management
  - Badge awarding system
  - View count tracking
  - Purchase verification automation
  
  ## Functions Created
  
  ### 1. update_updated_at_column()
  Automatically updates the updated_at timestamp on row modification
  
  ### 2. award_points(user_id, points, source, reference)
  Awards points to users and creates transaction records
  
  ### 3. check_and_award_badges(user_id)
  Evaluates user achievements and awards eligible badges
  
  ### 4. increment_view_count(wishlist_id)
  Safely increments wishlist view counter
  
  ### 5. handle_new_profile()
  Creates profile entry when new user signs up
  
  ### 6. handle_purchase_completion()
  Processes order completion, awards points, checks badges
  
  ## Triggers
  - Auto-update timestamps on profiles, wishlists, orders
  - Award points on wishlist creation, purchases, follows
  - Auto-create profile on user signup
*/

-- FUNCTION: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- FUNCTION: Award points to user
CREATE OR REPLACE FUNCTION award_points(
  p_user_id uuid,
  p_amount integer,
  p_source text,
  p_reference_id uuid DEFAULT NULL,
  p_description text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Insert transaction record
  INSERT INTO public.transactions (user_id, type, amount, source, reference_id, description)
  VALUES (p_user_id, 'earn', p_amount, p_source, p_reference_id, p_description);
  
  -- Update user points
  UPDATE public.profiles
  SET points = points + p_amount
  WHERE id = p_user_id;
  
  -- Check if level up is needed (every 100 points = 1 level)
  UPDATE public.profiles
  SET level = (points / 100) + 1
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_badge RECORD;
  v_count integer;
  v_criteria jsonb;
BEGIN
  -- Loop through all badges
  FOR v_badge IN SELECT * FROM badges LOOP
    -- Skip if user already has this badge
    IF EXISTS (SELECT 1 FROM user_badges WHERE user_id = p_user_id AND badge_id = v_badge.id) THEN
      CONTINUE;
    END IF;
    
    v_criteria := v_badge.criteria;
    
    -- Check badge criteria
    CASE v_criteria->>'action'
      WHEN 'create_wishlist' THEN
        SELECT COUNT(*) INTO v_count FROM wishlists WHERE owner_id = p_user_id;
        IF v_count >= (v_criteria->>'count')::integer THEN
          INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
          PERFORM award_points(p_user_id, v_badge.points_reward, 'badge_earned', v_badge.id, 'Earned badge: ' || v_badge.name);
        END IF;
        
      WHEN 'purchase_gift' THEN
        SELECT COUNT(*) INTO v_count FROM orders WHERE buyer_id = p_user_id AND status = 'delivered';
        IF v_count >= (v_criteria->>'count')::integer THEN
          INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
          PERFORM award_points(p_user_id, v_badge.points_reward, 'badge_earned', v_badge.id, 'Earned badge: ' || v_badge.name);
        END IF;
        
      WHEN 'follow' THEN
        SELECT COUNT(*) INTO v_count FROM follows WHERE follower_id = p_user_id;
        IF v_count >= (v_criteria->>'count')::integer THEN
          INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
          PERFORM award_points(p_user_id, v_badge.points_reward, 'badge_earned', v_badge.id, 'Earned badge: ' || v_badge.name);
        END IF;
        
      WHEN 'seller_sales' THEN
        SELECT COUNT(*) INTO v_count 
        FROM orders o
        JOIN sellers s ON o.seller_id = s.id
        WHERE s.user_id = p_user_id AND o.status = 'delivered';
        IF v_count >= (v_criteria->>'count')::integer THEN
          INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
          PERFORM award_points(p_user_id, v_badge.points_reward, 'badge_earned', v_badge.id, 'Earned badge: ' || v_badge.name);
        END IF;
      ELSE
        -- Unknown action, ignore
        NULL;
    END CASE;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Increment view count safely
CREATE OR REPLACE FUNCTION increment_view_count(p_wishlist_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE wishlists
  SET view_count = view_count + 1
  WHERE id = p_wishlist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text from 1 for 8)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id::text)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Handle purchase completion
CREATE OR REPLACE FUNCTION handle_purchase_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_wishlist_owner uuid;
BEGIN
  -- Only process when order is marked as delivered
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    
    -- Award points to buyer
    PERFORM award_points(
      NEW.buyer_id,
      50,
      'gift_purchase',
      NEW.id,
      'Purchased and delivered a gift'
    );
    
    -- Mark wishlist item as purchased
    UPDATE wishlist_items
    SET is_purchased = true,
        purchased_by = NEW.buyer_id,
        purchased_at = now()
    WHERE id = NEW.wishlist_item_id;
    
    -- Get wishlist owner and award them points for receiving gift
    SELECT w.owner_id INTO v_wishlist_owner
    FROM wishlist_items wi
    JOIN wishlists w ON wi.wishlist_id = w.id
    WHERE wi.id = NEW.wishlist_item_id;
    
    IF v_wishlist_owner IS NOT NULL THEN
      PERFORM award_points(
        v_wishlist_owner,
        10,
        'gift_received',
        NEW.id,
        'Received a gift from wishlist'
      );
    END IF;
    
    -- Check badges for buyer
    PERFORM check_and_award_badges(NEW.buyer_id);
    
    -- If this is a seller order, check seller badges
    IF NEW.seller_id IS NOT NULL THEN
      DECLARE
        v_seller_user_id uuid;
      BEGIN
        SELECT user_id INTO v_seller_user_id FROM sellers WHERE id = NEW.seller_id;
        IF v_seller_user_id IS NOT NULL THEN
          PERFORM check_and_award_badges(v_seller_user_id);
        END IF;
      END;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Handle new wishlist creation
CREATE OR REPLACE FUNCTION handle_new_wishlist()
RETURNS TRIGGER AS $$
BEGIN
  -- Award points for creating wishlist
  PERFORM award_points(
    NEW.owner_id,
    20,
    'wishlist_created',
    NEW.id,
    'Created a new wishlist'
  );
  
  -- Check for badges
  PERFORM check_and_award_badges(NEW.owner_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Handle new follow
CREATE OR REPLACE FUNCTION handle_new_follow()
RETURNS TRIGGER AS $$
BEGIN
  -- Award points for following
  PERFORM award_points(
    NEW.follower_id,
    5,
    'followed_user',
    NEW.id,
    'Followed a ' || NEW.following_type
  );
  
  -- Check for social badges
  PERFORM check_and_award_badges(NEW.follower_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- DROP EXISTING TRIGGERS IF ANY
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_wishlists_updated_at ON wishlists;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_wishlist_created ON wishlists;
DROP TRIGGER IF EXISTS on_order_completed ON orders;
DROP TRIGGER IF EXISTS on_follow_created ON follows;

-- CREATE TRIGGERS

-- Auto-update timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wishlists_updated_at
  BEFORE UPDATE ON wishlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_profile();

-- Award points on wishlist creation
CREATE TRIGGER on_wishlist_created
  AFTER INSERT ON wishlists
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_wishlist();

-- Process order completion
CREATE TRIGGER on_order_completed
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_purchase_completion();

-- Award points on follow
CREATE TRIGGER on_follow_created
  AFTER INSERT ON follows
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_follow();