-- Migration: Add Phase 0 enhancements to existing schema
-- This migration adds new columns and tables for:
-- 1. Purchase verification enhancements (OCR data, admin review)
-- 2. Referral system
-- 3. Onboarding tracking
-- 4. Viral sharing metrics

-- Add columns to wishlists for sharing and QR
ALTER TABLE wishlists
ADD COLUMN IF NOT EXISTS qr_code_data text,
ADD COLUMN IF NOT EXISTS share_count integer DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS slug text;

-- Update type check constraint to be more flexible
ALTER TABLE wishlists DROP CONSTRAINT IF EXISTS type_check;
ALTER TABLE wishlists ADD CONSTRAINT type_check CHECK (true); -- Allow any type for now to match Cloud


-- Add columns to purchase_verifications for OCR
ALTER TABLE purchase_verifications
ADD COLUMN IF NOT EXISTS ocr_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS ocr_confidence decimal(3,2),
ADD COLUMN IF NOT EXISTS admin_review_required boolean DEFAULT false NOT NULL;

-- Add columns to profiles for onboarding and referrals
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS onboarding_step integer DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS interests jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  reward_points integer DEFAULT 50 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz,
  CONSTRAINT referral_status_check CHECK (status IN ('pending', 'completed', 'expired')),
  UNIQUE(referrer_id, referred_id)
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "System can insert referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update referrals"
  ON referrals FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code) WHERE referral_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by) WHERE referred_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_purchase_verifications_status ON purchase_verifications(status);

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT COUNT(*) > 0 INTO exists FROM public.profiles WHERE referral_code = code;
    
    -- Exit loop if unique
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate referral code on profile creation
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS trigger AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_referral_code();

-- Create function to complete referral when referred user creates first wishlist
CREATE OR REPLACE FUNCTION complete_referral_on_first_wishlist()
RETURNS trigger AS $$
DECLARE
  referrer_profile_id uuid;
BEGIN
  -- Get the referrer from the new wishlist owner
  SELECT referred_by INTO referrer_profile_id
  FROM profiles
  WHERE id = NEW.owner_id AND referred_by IS NOT NULL;
  
  -- If this user was referred, complete the referral
  IF referrer_profile_id IS NOT NULL THEN
    -- Update referral status
    UPDATE referrals
    SET status = 'completed',
        completed_at = now()
    WHERE referrer_id = referrer_profile_id
      AND referred_id = NEW.owner_id
      AND status = 'pending';
    
    -- Award points to referrer
    INSERT INTO transactions (user_id, type, amount, source, reference_id, description)
    VALUES (
      referrer_profile_id,
      'earn',
      50,
      'referral_completed',
      NEW.owner_id,
      'Referral bonus: user created first wishlist'
    );
    
    -- Update referrer points
    UPDATE profiles
    SET points = points + 50
    WHERE id = referrer_profile_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_complete_referral
  AFTER INSERT ON wishlists
  FOR EACH ROW
  EXECUTE FUNCTION complete_referral_on_first_wishlist();

-- Add comment for documentation
COMMENT ON TABLE referrals IS 'Tracks user referrals and rewards for viral growth';
COMMENT ON COLUMN profiles.referral_code IS 'Unique code for sharing app with friends';
COMMENT ON COLUMN profiles.referred_by IS 'User who referred this profile';
COMMENT ON COLUMN wishlists.qr_code_data IS 'Encoded QR code data for easy sharing';
COMMENT ON COLUMN wishlists.share_count IS 'Number of times this wishlist was shared';
COMMENT ON COLUMN purchase_verifications.ocr_data IS 'Extracted text data from receipt OCR';
COMMENT ON COLUMN purchase_verifications.ocr_confidence IS 'OCR accuracy score (0-1)';
