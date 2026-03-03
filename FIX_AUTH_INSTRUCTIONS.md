# FIX AUTHENTICATION ISSUES - QUICK FIX

## IMMEDIATE FIX FOR AUTHENTICATION ERRORS

### Problem
Users cannot sign up or log in due to database permission errors (RLS - Row Level Security).

### Quick Solution (5 minutes)

1. **Open Supabase SQL Editor**
   - Go to: https://app.supabase.com
   - Select your project
   - Click "SQL Editor" in left sidebar
   - Click "New query"

2. **Copy and Run this SQL:**
```sql
-- FIX 1: Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.braider_profiles DISABLE ROW LEVEL SECURITY;

-- FIX 2: Create auto-profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
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

-- FIX 3: Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- FIX 4: Re-enable RLS with proper policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.braider_profiles ENABLE ROW LEVEL SECURITY;

-- FIX 5: Create RLS policies
DROP POLICY IF EXISTS "Enable read for all users" ON public.profiles;
CREATE POLICY "Enable read for all users" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON public.profiles;
CREATE POLICY "Enable insert for all users" ON public.profiles
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
CREATE POLICY "Enable update for users based on id" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Same for braider_profiles
DROP POLICY IF EXISTS "Enable read for all users" ON public.braider_profiles;
CREATE POLICY "Enable read for all users" ON public.braider_profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.braider_profiles;
CREATE POLICY "Enable insert for authenticated users" ON public.braider_profiles
  FOR INSERT WITH CHECK (true);
```

3. **Run the SQL in Supabase SQL Editor**
   - Copy the entire SQL above
   - Paste into Supabase SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Test Immediately:**
   - Go to: http://localhost:3001/signup
   - Create a new account
   - Should work immediately!

## Alternative Quick Fix (Even Simpler)

If the above doesn't work, try this simpler fix:

```sql
-- SIMPLE FIX: Disable RLS temporarily for testing
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.braider_profiles DISABLE ROW LEVEL SECURITY;
```

## Test Your Fix

After running the SQL:

1. **Test Signup:**
   ```
   Email: test@example.com
   Password: Test123456
   Full Name: Test User
   Phone: 1234567890
   Role: Customer
   ```

2. **Test Login:**
   - Use same credentials
   - Should redirect to dashboard

## If Still Not Working:

1. **Check .env file:**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Disable Email Confirmation in Supabase:**
   - Go to: Authentication → Providers → Email
   - Uncheck "Confirm email"
   - Save

3. **Create test user manually in Supabase:**
   - Go to Authentication → Users
   - Click "Add User"
   - Email: test@example.com
   - Password: Test123456
   - No email confirmation needed

## Quick Test Commands:

```bash
# Check if auth is working
curl -X POST http://localhost:3001/api/test-auth

# Check Supabase connection
curl "https://YOUR_PROJECT.supabase.co/rest/v1/profiles?select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Common Issues & Solutions:

1. **"Invalid login credentials"**
   - Run the SQL fix above
   - Check .env file has correct Supabase URL/key

2. **"User already registered"**
   - User exists, try different email
   - Or delete user from Supabase Auth → Users

3. **"Email not confirmed"**
   - Disable email confirmation in Supabase
   - Or check email for confirmation link

4. **"RLS violation" or "permission denied"**
   - Run the SQL fix above
   - Or run: `ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;`

## Emergency Fix (Last Resort):

If nothing works, temporarily disable all RLS:

```sql
-- Run in Supabase SQL Editor:
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.braider_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
-- Add other tables as needed
```

**WARNING:** Only for development! Re-enable RLS when done testing.

## Need Help?
1. Check browser console (F12 → Console tab)
2. Check network tab for failed requests
3. Share error screenshots

**Most common fix:** Run the SQL at the top of this file in Supabase SQL Editor.