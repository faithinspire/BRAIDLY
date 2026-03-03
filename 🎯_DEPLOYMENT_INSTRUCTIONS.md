# 🎯 COMPLETE DEPLOYMENT INSTRUCTIONS

## STATUS: PHASE 1 & 4 COMPLETE ✅

**What's been done:**
- ✅ Phase 1: Deleted all legacy files (supabase folder, duplicate auth, unused hooks, V2 files)
- ✅ Phase 4: Rewritten auth service (removed retry loops, strict flow)
- ✅ Created Phase 2 SQL (schema rebuild with correct RLS)
- ✅ Created Phase 3 SQL (storage buckets)

**What you need to do:**
- Deploy Phase 2 SQL to Supabase
- Create storage buckets in Supabase UI
- Deploy Phase 3 SQL to Supabase
- Test signup/login

---

## STEP 1: DEPLOY PHASE 2 SQL (CRITICAL)

This fixes the 403 Forbidden errors by rebuilding the schema with correct RLS policies.

### Instructions:
1. Go to: https://app.supabase.com/project/_/sql/new
2. Copy ALL content from: `PHASE_2_REBUILD_SUPABASE.sql`
3. Paste into Supabase SQL Editor
4. Click "Run"
5. Wait for completion (should see: "PHASE 2 COMPLETE - SCHEMA REBUILT WITH CORRECT RLS")

### What this does:
- Drops old broken tables
- Creates new `profiles` table with correct structure
- Creates `braider_profiles` table
- Creates auto-profile trigger (profiles auto-created on signup)
- Enables RLS with correct policies
- Allows users to access their own data

---

## STEP 2: CREATE STORAGE BUCKETS (UI)

### Instructions:
1. Go to: https://app.supabase.com/project/_/storage/buckets
2. Click "Create new bucket"
3. Create these 3 buckets (all PUBLIC):
   - `avatars`
   - `portfolio`
   - `landing`

### Important:
- Make sure each bucket is set to PUBLIC
- Do NOT enable RLS on buckets yet

---

## STEP 3: DEPLOY PHASE 3 SQL (STORAGE POLICIES)

This sets up permissions for image uploads.

### Instructions:
1. Go to: https://app.supabase.com/project/_/sql/new
2. Copy ALL content from: `PHASE_3_STORAGE_BUCKETS.sql`
3. Paste into Supabase SQL Editor
4. Click "Run"
5. Wait for completion (should see: "PHASE 3 COMPLETE - STORAGE BUCKETS CONFIGURED")

### What this does:
- Creates policies for avatars bucket
- Creates policies for portfolio bucket
- Creates policies for landing bucket
- Allows users to upload their own images
- Allows public read access

---

## STEP 4: TEST SIGNUP & LOGIN

### Test Signup:
1. Go to: http://localhost:3000/signup
2. Fill in form:
   - Email: test@example.com
   - Password: Test123456
   - Full Name: Test User
   - Phone: 555-1234
   - Role: Customer
3. Click "Sign Up"
4. Check browser console for logs
5. Should see: "✅ Signup complete"

### Test Login:
1. Go to: http://localhost:3000/login
2. Enter credentials from signup
3. Click "Login"
4. Check browser console for logs
5. Should see: "✅ Login successful"
6. Should redirect to dashboard

### What to look for:
- ✅ No 403 Forbidden errors
- ✅ No "permission denied for schema public"
- ✅ No "User profile not found"
- ✅ Profile fetches successfully
- ✅ Redirects to correct dashboard

---

## TROUBLESHOOTING

### If you see "403 Forbidden" or "permission denied":
- Phase 2 SQL was not deployed correctly
- Go back to Step 1 and re-run the SQL
- Make sure you copied the ENTIRE file

### If profile is not created:
- Check that Phase 2 SQL ran successfully
- Check Supabase logs for trigger errors
- Try manual profile creation (app will do this automatically)

### If storage upload fails:
- Make sure buckets are created and PUBLIC
- Make sure Phase 3 SQL was deployed
- Check bucket policies in Supabase UI

---

## NEXT PHASES (After testing)

### Phase 5: UI/UX Rebuild
- Fix manifest.json
- Fix meta tags
- Make navbar bold
- Add animations
- Mobile-first responsive design

### Phase 6: Code Quality
- Remove duplicate files
- Normalize naming
- Clean up unused code

---

## FINAL VALIDATION CHECKLIST

After deployment, verify:
- ✅ Signup → Login works without error
- ✅ Profile is fetched without 403
- ✅ Images upload & display correctly
- ✅ Dashboard loads per role
- ✅ Mobile UI is clean and responsive
- ✅ App installs as PWA
- ✅ No console errors
- ✅ No retry loops
- ✅ No permission denied errors

---

## FILES CREATED

- `PHASE_2_REBUILD_SUPABASE.sql` - Schema rebuild (deploy to Supabase)
- `PHASE_3_STORAGE_BUCKETS.sql` - Storage policies (deploy to Supabase)
- `src/auth/authService.js` - Updated auth service (already deployed)

---

## CRITICAL NOTES

1. **Deploy Phase 2 FIRST** - This is the blocker for everything
2. **Create buckets in UI** - Cannot be done via SQL
3. **Deploy Phase 3 AFTER buckets exist** - Policies need buckets to exist
4. **Test immediately** - Verify each step works before moving on
5. **Check console logs** - They show exactly what's happening

---

## SUPPORT

If something fails:
1. Check the error message in browser console
2. Check Supabase logs
3. Re-run the SQL file
4. Make sure you copied the ENTIRE file (not partial)
5. Make sure you're in the correct Supabase project

