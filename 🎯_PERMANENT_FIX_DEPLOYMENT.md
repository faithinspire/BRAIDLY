# PERMANENT FIX DEPLOYMENT GUIDE

## OVERVIEW
This guide deploys the complete permanent fix for Braidly authentication, RLS, and database issues.

## WHAT'S BEING FIXED
1. ✅ RLS policies blocking all database access (403 Forbidden)
2. ✅ Profile not auto-created on signup
3. ✅ Login failing with "User profile not found"
4. ✅ Uploads failing due to storage policies
5. ✅ Braider profile cannot be saved
6. ✅ Schema inconsistencies

## DEPLOYMENT STEPS

### STEP 1: Deploy Database Schema Fix
**File:** `🔥_PERMANENT_SCHEMA_FIX.sql`

1. Go to: https://app.supabase.com
2. Select: braidly project
3. Click: SQL Editor → New Query
4. Copy entire content from `🔥_PERMANENT_SCHEMA_FIX.sql`
5. Paste into SQL Editor
6. Click: Run
7. Wait for: "SCHEMA FIX COMPLETE"

**What this does:**
- Drops old profiles table
- Recreates with correct structure
- Enables RLS with correct policies
- Creates auto-profile trigger
- Creates braider_profiles table

### STEP 2: Deploy Storage Bucket Policies
**File:** `🔥_STORAGE_BUCKET_POLICIES.sql`

1. Go to: https://app.supabase.com
2. Select: braidly project
3. Click: SQL Editor → New Query
4. Copy entire content from `🔥_STORAGE_BUCKET_POLICIES.sql`
5. Paste into SQL Editor
6. Click: Run
7. Wait for: "Storage bucket policies created successfully"

**What this does:**
- Creates policies for avatars bucket
- Creates policies for portfolio bucket
- Creates policies for gallery bucket
- Allows authenticated users to upload/download

### STEP 3: Verify Database Setup
**File:** `🔥_VERIFY_SETUP.sql` (create this)

Run this verification query:

```sql
-- Check profiles table
SELECT COUNT(*) as profiles_count FROM public.profiles;

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Check policies exist
SELECT policyname FROM pg_policies 
WHERE tablename = 'profiles';

-- Check trigger exists
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_schema = 'public' AND event_object_table = 'users';
```

**Expected results:**
- profiles_count: 0 (empty, ready for new users)
- rowsecurity: true (RLS enabled)
- policyname: 4 policies listed
- trigger_name: on_auth_user_created

### STEP 4: Update App Code
**Files already updated:**
- ✅ `src/auth/authService.js` - Login with retry logic
- ✅ `src/auth/authService.js` - Signup with profile creation
- ✅ `public/sw.js` - Fixed service worker

**No additional code changes needed.**

### STEP 5: Clear Browser Cache & Test
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear cache: Ctrl+Shift+Delete
3. Close browser completely
4. Reopen browser
5. Go to: http://localhost:3003

### STEP 6: Test Signup Flow
1. Click: Signup
2. Enter: Email, Password, Name, Phone
3. Select: Role (Customer or Braider)
4. Click: Sign Up
5. Expected: Success message, redirected to login

**Console should show:**
```
📝 Signup attempt: [email]
✅ Auth user created: [uuid]
✅ Profile auto-created by trigger
✅ Signup complete
```

### STEP 7: Test Login Flow
1. Click: Login
2. Enter: Email, Password
3. Click: Login
4. Expected: Logged in, redirected to dashboard

**Console should show:**
```
🔐 Login attempt: [email]
✅ Auth successful, fetching profile...
✅ Profile found on attempt 1
✅ Login successful
```

### STEP 8: Test Upload
1. Go to: Profile Settings
2. Upload: Avatar image
3. Expected: Upload succeeds, image displays

**Console should show:**
```
📤 Uploading avatar...
✅ Avatar uploaded successfully
```

### STEP 9: Test Braider Profile (if braider)
1. Go to: Braider Dashboard
2. Update: Bio, Rating, etc.
3. Click: Save
4. Expected: Profile saves successfully

**Console should show:**
```
💾 Saving braider profile...
✅ Braider profile saved
```

## TROUBLESHOOTING

### If you see "permission denied for schema public"
- RLS policies are still wrong
- Re-run `🔥_PERMANENT_SCHEMA_FIX.sql`
- Verify policies were created

### If you see "User profile not found"
- Profile wasn't created by trigger
- Check trigger exists: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created'`
- Re-run schema fix

### If uploads fail
- Storage policies not deployed
- Re-run `🔥_STORAGE_BUCKET_POLICIES.sql`
- Verify buckets exist: avatars, portfolio, gallery

### If braider profile won't save
- Foreign key constraint issue
- Check braider_profiles table exists
- Verify user_id references profiles.id

## ROLLBACK (if needed)
If something goes wrong:

1. Go to: Supabase Dashboard
2. Click: Database → Backups
3. Restore from backup before deployment
4. Contact support if needed

## FINAL VERIFICATION

After all steps, run this query to confirm everything is working:

```sql
SELECT 
  'Profiles table' as component,
  COUNT(*) as status
FROM public.profiles
UNION ALL
SELECT 
  'RLS enabled',
  CASE WHEN rowsecurity THEN 1 ELSE 0 END
FROM pg_tables 
WHERE tablename = 'profiles'
UNION ALL
SELECT 
  'Policies count',
  COUNT(*)
FROM pg_policies 
WHERE tablename = 'profiles'
UNION ALL
SELECT 
  'Trigger exists',
  CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

## SUCCESS CRITERIA
After deployment:
- ✅ Signup → Profile auto-created
- ✅ Login → Profile fetched successfully
- ✅ No 403 Forbidden errors
- ✅ No "permission denied" errors
- ✅ Uploads work
- ✅ Braider profile saves
- ✅ All console logs show success

## NEXT STEPS
1. Commit changes to Git
2. Deploy to Vercel
3. Test in production
4. Monitor for errors
