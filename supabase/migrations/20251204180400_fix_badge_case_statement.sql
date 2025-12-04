/*
  # Fix Badge Check Function - Add ELSE Clause
  
  ## Problem
  The check_and_award_badges function has a CASE statement without an ELSE clause,
  causing "case not found" errors when creating wishlists.
  
  ## Solution
  Add an ELSE clause to handle unknown badge criteria gracefully.
*/

-- Recreate the function with ELSE clause
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
          INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
          PERFORM award_points(p_user_id, v_badge.points_reward, 'badge_earned', v_badge.id, 'Earned badge: ' || v_badge.name);
        END IF;
      
      ELSE
        -- Unknown badge criteria action, skip silently
        NULL;
    END CASE;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
