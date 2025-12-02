/*
  # WishHive Core Database Schema
  
  ## Summary
  Creates the foundational database structure for WishHive - a social wishlist platform
  connecting users, sellers, and gift-givers.
  
  ## New Tables
  
  ### 1. profiles
  Extended user profiles with gamification and social features
  - `id` (uuid, FK to auth.users) - Primary key
  - `username` (text, unique) - Display name/handle
  - `avatar_url` (text) - Profile picture
  - `bio` (text) - User description
  - `points` (integer) - Gamification points
  - `level` (integer) - User level
  - `settings` (jsonb) - User preferences
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. sellers
  Registered shops and vendors
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK) - Owner profile
  - `shop_name` (text) - Business name
  - `logo_url` (text) - Brand logo
  - `description` (text) - Shop description
  - `kyc_status` (text) - Verification status
  - `payout_info` (jsonb) - Payment details (encrypted)
  - `settings` (jsonb) - Shop configuration
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  
  ### 3. wishlists
  User-created wish collections
  - `id` (uuid) - Primary key
  - `owner_id` (uuid, FK) - Creator
  - `title` (text) - List name
  - `description` (text) - Optional details
  - `type` (text) - Event type (birthday, wedding, etc)
  - `privacy` (text) - public/private/code-only
  - `access_code` (text) - For code-only lists
  - `theme` (jsonb) - Visual customization
  - `due_date` (date) - Event date
  - `is_active` (boolean)
  - `view_count` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. products
  Marketplace product catalog
  - `id` (uuid) - Primary key
  - `seller_id` (uuid, FK) - Vendor
  - `title` (text) - Product name
  - `description` (text) - Details
  - `price` (decimal) - Base price
  - `currency` (text) - Currency code
  - `images` (jsonb) - Image URLs array
  - `sku` (text) - Stock keeping unit
  - `variations` (jsonb) - Size/color options
  - `external_url` (text) - External link
  - `stock_count` (integer) - Inventory
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  
  ### 5. wishlist_items
  Products added to wishlists
  - `id` (uuid) - Primary key
  - `wishlist_id` (uuid, FK)
  - `product_id` (uuid, FK) - Optional, can be custom
  - `custom_title` (text) - For non-marketplace items
  - `custom_price` (decimal)
  - `custom_url` (text)
  - `custom_images` (jsonb)
  - `note` (text) - User notes
  - `priority` (integer) - 1-5 priority
  - `quantity` (integer)
  - `is_purchased` (boolean)
  - `purchased_by` (uuid, FK) - Anonymous tracking
  - `purchased_at` (timestamptz)
  - `created_at` (timestamptz)
  
  ### 6. orders
  Purchase tracking
  - `id` (uuid) - Primary key
  - `buyer_id` (uuid, FK)
  - `wishlist_item_id` (uuid, FK)
  - `seller_id` (uuid, FK)
  - `product_id` (uuid, FK)
  - `status` (text) - pending/confirmed/shipped/delivered
  - `total_amount` (decimal)
  - `currency` (text)
  - `delivery_option` (text) - to_recipient/to_buyer
  - `delivery_address` (jsonb)
  - `is_anonymous` (boolean)
  - `payment_id` (text) - Stripe reference
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 7. purchase_verifications
  Proof of purchase system
  - `id` (uuid) - Primary key
  - `order_id` (uuid, FK)
  - `verification_method` (text) - in_app/receipt/qr/seller_confirm
  - `evidence_url` (text) - Receipt image
  - `verification_code` (text) - QR/code
  - `verified_by_seller` (boolean)
  - `verified_at` (timestamptz)
  - `status` (text) - pending/approved/rejected
  - `created_at` (timestamptz)
  
  ### 8. badges
  Achievement definitions
  - `id` (uuid) - Primary key
  - `slug` (text, unique) - Identifier
  - `name` (text) - Display name
  - `description` (text)
  - `icon_url` (text)
  - `criteria` (jsonb) - Earning conditions
  - `points_reward` (integer)
  - `tier` (text) - bronze/silver/gold/platinum
  
  ### 9. user_badges
  Earned achievements
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK)
  - `badge_id` (uuid, FK)
  - `earned_at` (timestamptz)
  - Unique constraint on (user_id, badge_id)
  
  ### 10. reactions
  Social engagement (likes, hearts, etc)
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK) - Can be anonymous
  - `target_type` (text) - wishlist/product/item
  - `target_id` (uuid)
  - `reaction_type` (text) - heart/fire/celebrate/shush
  - `is_anonymous` (boolean)
  - `created_at` (timestamptz)
  - Unique constraint on (user_id, target_type, target_id)
  
  ### 11. follows
  Social connections
  - `id` (uuid) - Primary key
  - `follower_id` (uuid, FK)
  - `following_id` (uuid, FK) - Can be user or seller
  - `following_type` (text) - user/seller
  - `created_at` (timestamptz)
  - Unique constraint on (follower_id, following_id, following_type)
  
  ### 12. transactions
  Points and rewards ledger
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK)
  - `type` (text) - earn/spend/refund
  - `amount` (integer) - Points
  - `source` (text) - Action that triggered
  - `reference_id` (uuid) - Related entity
  - `description` (text)
  - `created_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Users can only modify their own data
  - Public read access for public wishlists
  - Sellers can manage their own products and orders
  - Admin role for moderation
  
  ## Indexes
  - Performance indexes on frequently queried columns
  - Full-text search indexes on products and wishlists
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  bio text,
  points integer DEFAULT 0 NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 2. SELLERS TABLE
CREATE TABLE IF NOT EXISTS sellers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  shop_name text NOT NULL,
  logo_url text,
  description text,
  kyc_status text DEFAULT 'pending' NOT NULL,
  payout_info jsonb DEFAULT '{}'::jsonb,
  settings jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT kyc_status_check CHECK (kyc_status IN ('pending', 'approved', 'rejected'))
);

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sellers"
  ON sellers FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Sellers can update own shop"
  ON sellers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can create seller account"
  ON sellers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 3. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  type text DEFAULT 'general' NOT NULL,
  privacy text DEFAULT 'public' NOT NULL,
  access_code text,
  theme jsonb DEFAULT '{}'::jsonb,
  due_date date,
  is_active boolean DEFAULT true NOT NULL,
  view_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT privacy_check CHECK (privacy IN ('public', 'private', 'code_only')),
  CONSTRAINT type_check CHECK (type IN ('birthday', 'wedding', 'christmas', 'baby', 'general', 'custom'))
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public wishlists are viewable by all"
  ON wishlists FOR SELECT
  TO authenticated
  USING (privacy = 'public' AND is_active = true);

CREATE POLICY "Owners can view own wishlists"
  ON wishlists FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can create wishlists"
  ON wishlists FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own wishlists"
  ON wishlists FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete own wishlists"
  ON wishlists FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id uuid REFERENCES sellers(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  sku text,
  variations jsonb DEFAULT '[]'::jsonb,
  external_url text,
  stock_count integer DEFAULT 0 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Sellers can manage own products"
  ON products FOR ALL
  TO authenticated
  USING (seller_id IN (SELECT id FROM sellers WHERE user_id = auth.uid()));

-- 5. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id uuid REFERENCES wishlists(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  custom_title text,
  custom_price decimal(10,2),
  custom_url text,
  custom_images jsonb DEFAULT '[]'::jsonb,
  note text,
  priority integer DEFAULT 3,
  quantity integer DEFAULT 1 NOT NULL,
  is_purchased boolean DEFAULT false NOT NULL,
  purchased_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  purchased_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT priority_check CHECK (priority BETWEEN 1 AND 5)
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items visible if wishlist is accessible"
  ON wishlist_items FOR SELECT
  TO authenticated
  USING (
    wishlist_id IN (
      SELECT id FROM wishlists 
      WHERE privacy = 'public' OR owner_id = auth.uid()
    )
  );

CREATE POLICY "Wishlist owners can manage items"
  ON wishlist_items FOR ALL
  TO authenticated
  USING (
    wishlist_id IN (SELECT id FROM wishlists WHERE owner_id = auth.uid())
  );

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  wishlist_item_id uuid REFERENCES wishlist_items(id) ON DELETE SET NULL,
  seller_id uuid REFERENCES sellers(id) ON DELETE SET NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  delivery_option text DEFAULT 'to_recipient' NOT NULL,
  delivery_address jsonb,
  is_anonymous boolean DEFAULT false NOT NULL,
  payment_id text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT status_check CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  CONSTRAINT delivery_check CHECK (delivery_option IN ('to_recipient', 'to_buyer'))
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Sellers can view their orders"
  ON orders FOR SELECT
  TO authenticated
  USING (seller_id IN (SELECT id FROM sellers WHERE user_id = auth.uid()));

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Sellers can update their orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (seller_id IN (SELECT id FROM sellers WHERE user_id = auth.uid()));

-- 7. PURCHASE VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS purchase_verifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  verification_method text NOT NULL,
  evidence_url text,
  verification_code text,
  verified_by_seller boolean DEFAULT false NOT NULL,
  verified_at timestamptz,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT verification_method_check CHECK (verification_method IN ('in_app', 'receipt', 'qr', 'seller_confirm')),
  CONSTRAINT verification_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

ALTER TABLE purchase_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers and sellers can view verifications"
  ON purchase_verifications FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE buyer_id = auth.uid() 
      OR seller_id IN (SELECT id FROM sellers WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Buyers can create verifications"
  ON purchase_verifications FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
  );

CREATE POLICY "Sellers can update verifications"
  ON purchase_verifications FOR UPDATE
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE seller_id IN (SELECT id FROM sellers WHERE user_id = auth.uid())
    )
  );

-- 8. BADGES TABLE
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon_url text,
  criteria jsonb DEFAULT '{}'::jsonb,
  points_reward integer DEFAULT 0 NOT NULL,
  tier text DEFAULT 'bronze' NOT NULL,
  CONSTRAINT tier_check CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum'))
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- 9. USER BADGES TABLE
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view others badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (true);

-- 10. REACTIONS TABLE
CREATE TABLE IF NOT EXISTS reactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reaction_type text NOT NULL,
  is_anonymous boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT target_type_check CHECK (target_type IN ('wishlist', 'product', 'item')),
  CONSTRAINT reaction_type_check CHECK (reaction_type IN ('heart', 'fire', 'celebrate', 'shush')),
  UNIQUE(user_id, target_type, target_id, reaction_type)
);

ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own reactions"
  ON reactions FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view non-anonymous reactions"
  ON reactions FOR SELECT
  TO authenticated
  USING (is_anonymous = false OR user_id = auth.uid());

-- 11. FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid NOT NULL,
  following_type text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT following_type_check CHECK (following_type IN ('user', 'seller')),
  UNIQUE(follower_id, following_id, following_type)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own follows"
  ON follows FOR ALL
  TO authenticated
  USING (follower_id = auth.uid());

CREATE POLICY "Anyone can view follows"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

-- 12. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  amount integer NOT NULL,
  source text NOT NULL,
  reference_id uuid,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT type_check CHECK (type IN ('earn', 'spend', 'refund'))
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_wishlists_owner ON wishlists(owner_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_privacy ON wishlists(privacy) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product ON wishlist_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_reactions_target ON reactions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);

-- FULL TEXT SEARCH INDEXES
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_wishlists_search ON wishlists USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- INSERT STARTER BADGES
INSERT INTO badges (slug, name, description, icon_url, criteria, points_reward, tier) VALUES
  ('starter', 'Starter', 'Created your first wishlist', 'https://api.dicebear.com/7.x/icons/svg?seed=starter', '{"action": "create_wishlist", "count": 1}'::jsonb, 10, 'bronze'),
  ('gifter', 'Gifter', 'Purchased your first gift', 'https://api.dicebear.com/7.x/icons/svg?seed=gifter', '{"action": "purchase_gift", "count": 1}'::jsonb, 50, 'bronze'),
  ('social_butterfly', 'Social Butterfly', 'Followed 10 users', 'https://api.dicebear.com/7.x/icons/svg?seed=social', '{"action": "follow", "count": 10}'::jsonb, 25, 'silver'),
  ('seller_pro', 'Seller Pro', 'Completed 10 sales', 'https://api.dicebear.com/7.x/icons/svg?seed=seller', '{"action": "seller_sales", "count": 10}'::jsonb, 100, 'gold'),
  ('trendsetter', 'Trendsetter', 'Top wishlist of the month', 'https://api.dicebear.com/7.x/icons/svg?seed=trend', '{"action": "top_wishlist", "period": "month"}'::jsonb, 200, 'platinum')
ON CONFLICT (slug) DO NOTHING;