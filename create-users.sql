-- Create two real user accounts for testing
-- Run this in Supabase SQL Editor

-- Note: You may need to disable email confirmation in Supabase Auth settings
-- Go to: Authentication > Settings > Email Auth > Disable "Enable email confirmations"

-- User 1: Standard User
-- Email: user@wishhive.app
-- Password: WishHive2024!

-- User 2: Seller
-- Email: seller@wishhive.app
-- Password: WishHive2024!

-- These accounts will be created via the Supabase Auth API
-- The profiles will be auto-created by the trigger

-- After creating users, we need to insert a seller record for the seller account
-- First, get the user ID from the auth.users table, then insert into sellers table

-- Example SQL to create seller record (run AFTER user creation):
-- INSERT INTO sellers (id, user_id, shop_name, description, verification_status, rating, total_sales)
-- VALUES (
--   gen_random_uuid(),
--   (SELECT id FROM auth.users WHERE email = 'seller@wishhive.app'),
--   'Demo Shop',
--   'A demo shop for testing seller features',
--   'verified',
--   4.8,
--   0
-- );
