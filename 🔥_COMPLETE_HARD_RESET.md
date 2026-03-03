# 🔥 COMPLETE HARD RESET - ROOT CAUSE FIX

## PHASE 1: CLEANUP (DELETE EVERYTHING BROKEN)

### Delete Legacy Files
```bash
# Remove all conflicting schema files
rm -f supabase/*.sql
rm -f 🔥*.sql
rm -f ⚡*.sql
rm -f 🎯*.sql
rm -f ✅*.sql
rm -f 🚀*.sql
rm -f 🚨*.sql
rm -f 📋*.sql
rm -f 📊*.sql
```

### Delete Duplicate Auth Code
- Remove: `js/supabase-auth.js` (if exists)
- Remove: `src/services/uploadServiceV2.js` (keep only uploadService.js)
- Remove: `src/pages/BraiderProfileV2.jsx` (keep only BraiderProfile.jsx)
- Remove: `src/pages/BraiderProfileV2.css` (keep only BraiderProfile.css)

### Delete Unused Hooks
- Remove: `src/hooks/useRealtimeEarnings.js`
- Remove: `src/hooks/useRealtimeNotifications.js`
- Remove: `src/hooks/useRealtimePayments.js`
- Remove: `src/hooks/useRealtimeBookings.js`

---

## PHASE 2: REBUILD SUPABASE (CORRECT WAY)

### Step 1: Create Profiles Table (NO RLS YET)
```sql
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer', 'braider')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
```

### Step 2: Create Braider Profiles Table
```sql
DROP TABLE IF EXISTS public.braider_profiles CASCADE;

CREATE TABLE public.braider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_braider_profiles_user_id ON public.braider_profiles(user_id);
```

### Step 3: Create Auto-Profile Trigger
```sql
DROP FUNCTION IF EXISTS public.create_profile_on_signup() CASCADE;

CREATE FUNCTION public.create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_on_signup();
```

### Step 4: Enable RLS with CORRECT Policies
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to INSERT their own profile (for manual creation if trigger fails)
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to UPDATE their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow admins to SELECT all profiles
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT
  USING (auth.jwt()->>'role' = 'admin');

ALTER TABLE public.braider_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to SELECT their own braider profile
CREATE POLICY "braider_select_own" ON public.braider_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to INSERT their own braider profile
CREATE POLICY "braider_insert_own" ON public.braider_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to UPDATE their own braider profile
CREATE POLICY "braider_update_own" ON public.braider_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## PHASE 3: STORAGE BUCKETS (CORRECT)

### Create Buckets
1. Go to Supabase Dashboard
2. Storage → Create new bucket
3. Create: `avatars` (public)
4. Create: `portfolio` (public)
5. Create: `landing` (public)

### Set Bucket Policies
```sql
-- Avatars bucket
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_user_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Portfolio bucket
CREATE POLICY "portfolio_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

CREATE POLICY "portfolio_user_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Landing bucket (public)
CREATE POLICY "landing_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'landing');
```

---

## PHASE 4: AUTH SERVICE (CLEAN)

### File: `src/auth/authService.js`

**Signup:**
1. Create auth user
2. Wait 2 seconds for trigger
3. Verify profile exists (1 retry)
4. If missing, create manually
5. Return success

**Login:**
1. Authenticate
2. Fetch profile (1 attempt, no retries)
3. If missing, create manually
4. Return user data

**NO retry loops**
**NO silent failures**
**Explicit errors only**

---

## PHASE 5: UI/UX REBUILD

### Fix Manifest
- Update `public/manifest.json`
- Fix icon path to valid image
- Remove deprecated meta tags

### Fix Meta Tags
- Replace `apple-mobile-web-app-capable` with `mobile-web-app-capable`
- Add viewport meta tag

### Improve Mobile Layout
- Mobile-first CSS
- Responsive breakpoints
- Touch-friendly buttons

### Make Navbar Bold
- Increase font weight to 700
- Increase padding
- Darker purple background

### Add Animations
- GSAP for landing page background
- Framer Motion for dashboard transitions
- Smooth login animations

---

## PHASE 6: CODE QUALITY

### Remove Duplicates
- One auth service only
- One Supabase client only
- One upload service only

### Normalize Naming
- Consistent file naming
- Consistent function naming
- Consistent variable naming

### Remove Dead Code
- Unused hooks
- Unused components
- Unused utilities

---

## DEPLOYMENT CHECKLIST

- [ ] Phase 1: Delete all legacy files
- [ ] Phase 2: Deploy Supabase schema
- [ ] Phase 3: Create storage buckets
- [ ] Phase 4: Update auth service
- [ ] Phase 5: Fix UI/UX
- [ ] Phase 6: Clean code
- [ ] Test signup → login
- [ ] Test image upload
- [ ] Test mobile layout
- [ ] Commit to Git
- [ ] Deploy to Vercel

---

## VALIDATION

After deployment:
- ✅ Signup creates profile automatically
- ✅ Login fetches profile without 403
- ✅ Images upload and display
- ✅ Mobile layout is responsive
- ✅ No console errors
- ✅ No retry loops
- ✅ No permission denied errors
- ✅ App installs as PWA
