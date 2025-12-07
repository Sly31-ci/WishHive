-- Add slug column to wishlists
ALTER TABLE wishlists ADD COLUMN IF NOT EXISTS slug text UNIQUE;
CREATE INDEX IF NOT EXISTS idx_wishlists_slug ON wishlists(slug);

-- Create wishlist_interactions table
CREATE TABLE IF NOT EXISTS wishlist_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wishlist_id uuid REFERENCES wishlists(id) ON DELETE CASCADE NOT NULL,
  item_id uuid REFERENCES wishlist_items(id) ON DELETE CASCADE,
  interaction_type text CHECK (interaction_type IN ('reaction', 'comment')) NOT NULL,
  content text NOT NULL,
  author_name text,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS Policies for wishlist_interactions
ALTER TABLE wishlist_interactions ENABLE ROW LEVEL SECURITY;

-- Allow public read of interactions for public wishlists
CREATE POLICY "Public interactions are viewable by everyone" 
ON wishlist_interactions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM wishlists 
    WHERE wishlists.id = wishlist_interactions.wishlist_id 
    AND (wishlists.privacy = 'public' OR wishlists.privacy = 'code_only')
  )
);

-- Allow anyone to insert interactions (anonymous users)
CREATE POLICY "Anyone can insert interactions" 
ON wishlist_interactions FOR INSERT 
WITH CHECK (true);

-- Allow owner to delete interactions
CREATE POLICY "Wishlist owner can delete interactions" 
ON wishlist_interactions FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM wishlists 
    WHERE wishlists.id = wishlist_interactions.wishlist_id 
    AND wishlists.owner_id = auth.uid()
  )
);
