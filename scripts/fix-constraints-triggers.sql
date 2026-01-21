-- Fix constraints and disable conflicting triggers for migration

-- 1. DROP Triggers that cause side effects (points, badges, notifications)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_wishlist_created ON wishlists;
DROP TRIGGER IF EXISTS on_order_completed ON orders;
DROP TRIGGER IF EXISTS on_follow_created ON follows;

-- 2. Relax wishlists type check constraint (Cloud might have legacy or new types)
ALTER TABLE wishlists DROP CONSTRAINT IF EXISTS type_check;
-- Optional: Re-add with more values if we knew them, or just leave it open for now
-- ALTER TABLE wishlists ADD CONSTRAINT type_check CHECK (type IN ('birthday', 'wedding', 'christmas', 'baby', 'general', 'custom', 'other', 'personal'));

-- 3. Relax notifications type check if needed (just in case)
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
