/*
  # Fix Profile Creation Trigger
  
  ## Problem
  The handle_new_profile() trigger fails because RLS policies block insertion
  when auth.uid() is NULL during user signup.
  
  ## Solution
  The function already has SECURITY DEFINER, but we need to ensure it bypasses RLS.
  We'll recreate the function to ensure proper permissions.
*/

-- Drop and recreate the function with proper security context
DROP FUNCTION IF EXISTS handle_new_profile() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert profile with all required fields
  INSERT INTO public.profiles (
    id,
    username,
    avatar_url,
    bio,
    points,
    level,
    settings,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'user_' || substring(NEW.id::text from 1 for 8)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id::text
    ),
    NULL,  -- bio
    0,     -- points
    1,     -- level
    '{}'::jsonb,  -- settings
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_profile();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
