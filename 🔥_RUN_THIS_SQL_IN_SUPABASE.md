# 🔥 RUN THIS SQL TO FIX AUTOMATIC SIGNUP

## The Problem
Supabase Row Level Security (RLS) is blocking automatic profile creation during signup.

## The Solution
Run a SQL script in Supabase to fix permissions and add automatic profile creation.

## STEP-BY-STEP INSTRUCTIONS

### Step 1: Open Supabase SQL Editor

1. Go to: **https://app.supabase.com**
2. Select your project: **mmluzuxcoqyrtenstkxq**
3. Click: **SQL Editor** (left sidebar)
4. Click: **"New query"**

### Step 2: Copy and Paste This SQL

Copy ALL of this SQL and paste it into the SQL Editor:

```sql
-- DISABLE RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.braider_profiles DISABLE ROW LEVEL SECURITY;

-- DROP existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- CREATE new policies
CREATE POLICY "Enable insert for authenticated users" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable update for users based on id" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Fix braider_profiles
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.braider_profiles;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.braider_profiles;

CREATE POLICY "Enable insert for authenticated users" 
ON public.braider_profiles FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" 
ON public.braider_profiles FOR SELECT 
TO authenticated 
USING (true);

ALTER TABLE public.braider_profiles ENABLE ROW LEVEL SECURITY;

-- Create auto-profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    NOW()
  );
  
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'customer') = 'braider' THEN
    INSERT INTO public.braider_profiles (user_id, is_active, verification_status, created_at)
    VALUES (NEW.id, true, 'unverified', NOW());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Run the SQL

1. Click: **"Run"** button (or press Ctrl+Enter)
2. Wait for: **"Success. No rows returned"**
3. If you see any errors, copy them and share with me

### Step 4: Test Signup

1. Go to: **http://localhost:3001/signup**
2. Fill in the form with ANY email (even test@test.com will work now)
3. Click "Sign Up"
4. Should see: "Account created successfully!"
5. Go to: **http://localhost:3001/login**
6. Login with same credentials
7. Should work automatically!

## What This SQL Does

1. ✅ Fixes Row Level Security policies
2. ✅ Allows authenticated users to create profiles
3. ✅ Creates automatic trigger that creates profile when user signs up
4. ✅ Automatically creates braider profile if role is 'braider'
5. ✅ No more manual profile creation needed!

## After Running SQL

Signup and login will work automatically:
- ✅ User signs up → Profile created automatically
- ✅ User logs in → Works immediately
- ✅ No manual steps needed
- ✅ No email confirmation required (if you disabled it)

## Verification

To verify it worked, run this in SQL Editor:

```sql
-- Check if trigger exists
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Should return: on_auth_user_created
```

## Summary

1. Open Supabase SQL Editor
2. Paste the SQL above
3. Click Run
4. Test signup at http://localhost:3001/signup
5. Login should work automatically!

---

**This is a ONE-TIME setup. After running this SQL, signup/login will work automatically forever!**
