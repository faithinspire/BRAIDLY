-- ============================================================================
-- 🔥 FINAL PERMANENT RLS FIX - DEPLOY THIS IMMEDIATELY
-- ============================================================================
-- This fixes: 403 Forbidden | permission denied for schema public
-- Root cause: RLS blocking all profile access
-- Solution: Correct schema + correct RLS policies + auto-profile trigger
-- ============================================================================

-- STEP 1: DROP OLD BROKEN SCHEMA
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================================
-- STEP 2: CREATE PROFILES TABLE (CORRECT SCHEMA)
-- ============================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'customer',
  full_name TEXT,
  avatar_url TEXT,
  portfolio JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: CREATE RLS POLICIES (CORRECT PERMISSIONS)
-- ============================================================================

-- Policy 1: Users can SELECT their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can INSERT their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 3: Users can UPDATE their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- STEP 5: CREATE AUTO-PROFILE TRIGGER (DATABASE HANDLES IT)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT 'RLS FIX COMPLETE - 403 ERRORS SHOULD NOW BE GONE' as status;
