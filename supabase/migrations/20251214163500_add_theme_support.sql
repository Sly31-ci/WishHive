-- Migration: Add theme support to wishlists and create public_themes table
-- Created: 2025-12-14

-- Add theme column to wishlists table
ALTER TABLE wishlists 
ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN wishlists.theme IS 'Custom theme settings for wishlist (typography, background, card style)';

-- Create index for searching by template name
CREATE INDEX IF NOT EXISTS idx_wishlists_theme_template 
ON wishlists ((theme->>'template')) 
WHERE theme IS NOT NULL;

-- Create public_themes table for community-shared templates
CREATE TABLE IF NOT EXISTS public_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    theme JSONB NOT NULL,
    preview_image_url TEXT,
    usage_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public_themes IS 'Community-shared wishlist themes that users can apply';
COMMENT ON COLUMN public_themes.theme IS 'Complete theme configuration (typography, background, card style)';
COMMENT ON COLUMN public_themes.usage_count IS 'Number of times this theme has been applied by users';
COMMENT ON COLUMN public_themes.is_featured IS 'Whether this theme is featured in the gallery';

-- Create indexes for public_themes
CREATE INDEX IF NOT EXISTS idx_public_themes_creator 
ON public_themes(creator_id);

CREATE INDEX IF NOT EXISTS idx_public_themes_usage 
ON public_themes(usage_count DESC);

CREATE INDEX IF NOT EXISTS idx_public_themes_featured 
ON public_themes(is_featured) 
WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_public_themes_tags 
ON public_themes USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE public_themes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public_themes

-- Everyone can view public themes
CREATE POLICY "Public themes are viewable by everyone"
ON public_themes FOR SELECT
USING (true);

-- Users can create their own public themes
CREATE POLICY "Users can create their own public themes"
ON public_themes FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- Users can update their own public themes
CREATE POLICY "Users can update their own public themes"
ON public_themes FOR UPDATE
USING (auth.uid() = creator_id);

-- Users can delete their own public themes
CREATE POLICY "Users can delete their own public themes"
ON public_themes FOR DELETE
USING (auth.uid() = creator_id);

-- Create function to increment theme usage count
CREATE OR REPLACE FUNCTION increment_theme_usage(theme_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public_themes
    SET usage_count = usage_count + 1,
        updated_at = NOW()
    WHERE id = theme_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION increment_theme_usage(UUID) TO authenticated;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_public_themes_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_public_themes_updated_at_trigger
BEFORE UPDATE ON public_themes
FOR EACH ROW
EXECUTE FUNCTION update_public_themes_updated_at();
