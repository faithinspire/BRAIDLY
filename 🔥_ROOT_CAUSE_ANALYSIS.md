# ROOT CAUSE ANALYSIS - BRAIDLY AUTH FAILURE

## SYMPTOMS
- Signup succeeds (auth user created)
- Login fails with "User profile not found"
- Console: `GET /profiles → 403 Forbidden`
- Error: `permission denied for schema public`
- Uploads fail
- Braider profile cannot be saved

## ROOT CAUSES IDENTIFIED

### 1. RLS POLICIES ARE BLOCKING ALL ACCESS
**Evidence:**
- 403 Forbidden on profiles table
- "permission denied for schema public"
- Happens on both SELECT and INSERT

**Why:**
- RLS is enabled on profiles table
- No policies allow authenticated users to access their own profiles
- Policies may be missing or incorrectly configured

### 2. PROFILE NOT AUTO-CREATED ON SIGNUP
**Evidence:**
- Auth user is created successfully
- Profile fetch returns empty
- Manual insert also fails (403)

**Why:**
- No database trigger to auto-create profile on signup
- App tries to create profile but RLS blocks it
- Orphan auth users created without profiles

### 3. SCHEMA/POLICY MISMATCH
**Evidence:**
- Policies may reference wrong columns
- Foreign key constraints may be missing
- Profile table may not have correct structure

**Why:**
- Multiple schema versions created and not cleaned up
- Policies not aligned with table structure
- No validation of schema integrity

## PERMANENT FIX STRATEGY

### Phase 1: SCHEMA RESET
- Drop and recreate profiles table with correct structure
- Ensure UUID primary key matches auth.users.id
- Add all required columns
- Add proper constraints

### Phase 2: RLS POLICIES (CORRECT)
- Enable RLS on profiles
- Create policy: users can SELECT their own profile
- Create policy: users can UPDATE their own profile
- Create policy: users can INSERT their own profile
- Ensure no policies block authenticated users

### Phase 3: AUTO-PROFILE CREATION
- Create database trigger on auth.users INSERT
- Automatically create profile row
- Assign default role (customer)
- Set is_active = true

### Phase 4: APP LOGIC REWRITE
- Signup: Create auth user, wait for trigger, verify profile exists
- Login: Fetch profile, if missing create it, then proceed
- Never throw "User profile not found" without recovery

### Phase 5: STORAGE POLICIES
- Fix bucket policies for avatars and portfolio
- Ensure auth.uid() can upload
- Ensure files are accessible

## EXPECTED OUTCOME
After fix:
- ✅ Signup → Profile auto-created
- ✅ Login → Profile fetched successfully
- ✅ No 403 errors
- ✅ Uploads work
- ✅ Braider profile saves
