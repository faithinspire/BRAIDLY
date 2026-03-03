# 🔥 DATABASE ERROR FIX - COMPLETE SCHEMA REWRITE

## Problem

"Database error saving new user" when trying to signup. The schema has issues preventing user creation.

---

## Solution

Complete schema rewrite with proper constraints and RLS policies.

---

## Step-by-Step Fix

### Step 1: Delete Old Schema (2 minutes)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Run this SQL:

```sql
-- Drop all tables (in correct order to avoid FK errors)
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.verification_documents CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.gallery_images CASCADE;
DROP TABLE IF EXISTS public.portfolio_images CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.braider_profiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
```

4. Click **Run**
5. Expected: "Query executed successfully"

### Step 2: Run Fresh Schema (3 minutes)

1. Go to **SQL Editor** → **New Query**
2. Copy entire content from: `supabase/schema-fresh-complete.sql`
3. Paste into SQL Editor
4. Click **Run**
5. Expected: "Query executed successfully"

### Step 3: Verify Schema (2 minutes)

1. Go to **SQL Editor** → **New Query**
2. Run this verification query:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

3. Should show these tables:
   - bookings
   - braider_profiles
   - gallery_images
   - notifications
   - payments
   - portfolio_images
   - profiles
   - reviews
   - services
   - verification_documents

### Step 4: Test Signup (3 minutes)

1. Go to http://localhost:3002/signup
2. Fill in form:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Role: Customer
   - Password: TestPassword123
3. Click **Create Account**
4. Expected: ✅ Account created successfully

### Step 5: Test Login (2 minutes)

1. Go to http://localhost:3002/login
2. Enter:
   - Email: test@example.com
   - Password: TestPassword123
3. Click **Login**
4. Expected: ✅ Logged in, redirected to dashboard

---

## What Was Fixed

### Old Schema Issues
- ❌ Conflicting constraints
- ❌ Missing RLS policies
- ❌ Improper cascade deletes
- ❌ Data type mismatches

### New Schema Features
- ✅ Clean, simple structure
- ✅ Proper RLS policies
- ✅ Correct cascade deletes
- ✅ Proper data types
- ✅ No conflicts

---

## Schema Structure

### Core Tables
1. **profiles** - User accounts (linked to auth.users)
2. **braider_profiles** - Braider-specific info
3. **services** - Services offered by braiders
4. **portfolio_images** - Braider portfolio images
5. **gallery_images** - Public gallery images

### Transaction Tables
6. **bookings** - Service bookings
7. **payments** - Payment records
8. **reviews** - Customer reviews

### Support Tables
9. **verification_documents** - Verification files
10. **notifications** - User notifications

---

## RLS Policies

### Profiles Table
- Users can view their own profile
- Users can update their own profile
- Service role can insert profiles

### Braider Profiles Table
- Everyone can view braider profiles
- Braiders can update their own profile

---

## Verification Checklist

- [ ] Old schema deleted
- [ ] New schema created
- [ ] All 10 tables exist
- [ ] Signup works
- [ ] Login works
- [ ] No database errors

---

## Troubleshooting

### Error: "Table already exists"
**Solution**: Run the delete schema SQL first

### Error: "Foreign key constraint failed"
**Solution**: Ensure tables are created in correct order (done automatically)

### Error: "Invalid data type"
**Solution**: Schema is correct, try clearing browser cache

### Signup still fails
**Solution**:
1. Check browser console for exact error
2. Check Supabase logs
3. Verify schema was created correctly

---

## After Fix

Once signup/login works:

1. ✅ Test avatar upload
2. ✅ Test portfolio upload
3. ✅ Test profile save
4. ✅ Commit changes to Git
5. ✅ Deploy to Vercel

---

## Files

### SQL Scripts
- `supabase/schema-fresh-complete.sql` - Fresh schema (USE THIS)
- `supabase/schema-v2-complete.sql` - Old schema (don't use)

---

**Status**: Follow steps above to fix immediately
**Time**: ~15 minutes total
