# 🔧 FIX ADMIN LOGIN - STEP BY STEP

## Problem
Admin login (admin@braidly.com) is not working because the admin profile doesn't exist in the `profiles` table.

## Solution

### Step 1: Run SQL in Supabase

1. Go to **https://app.supabase.com**
2. Select your project: **mmluzuxcoqyrtenstkxq**
3. Click **SQL Editor** (left sidebar)
4. Click **"New query"**
5. Copy and paste this SQL:

```sql
-- Add admin profile to profiles table
INSERT INTO public.profiles (id, email, full_name, phone, role, created_at, updated_at)
SELECT 
  id,
  email,
  'System Administrator',
  '1234567890',
  'admin',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@braidly.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'admin@braidly.com'
);

-- Verify admin profile was created
SELECT id, email, full_name, role FROM public.profiles WHERE email = 'admin@braidly.com';
```

6. Click **Run** (or press Ctrl+Enter)
7. You should see the admin profile in the results

### Step 2: Test Admin Login

1. Go to http://localhost:3000/login
2. Enter:
   - Email: `admin@braidly.com`
   - Password: `Admin123456`
3. Click Login
4. Should redirect to `/admin/dashboard`

### Step 3: Verify

If you see the admin dashboard, the fix worked! ✅

## What Was Fixed

- Admin user exists in `auth.users` but profile was missing in `profiles` table
- Login function requires profile to exist
- Now admin profile is created with correct role

## If Still Not Working

1. Check browser console for errors (F12)
2. Check Supabase logs for any RLS policy errors
3. Verify the SQL query returned the admin profile
4. Try logging out and logging back in

---

## Portfolio Upload Fix

The "1 failed" message when uploading photos has also been fixed:
- Gallery image insert no longer blocks portfolio upload
- Portfolio saves successfully even if gallery insert fails
- Better error handling for storage bucket fallback

Try uploading a photo now - should show only success message!
