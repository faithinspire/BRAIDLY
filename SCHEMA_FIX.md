# 🔧 SCHEMA FIX - STEP BY STEP

## The Error
```
ERROR: 42703: column "recipient_id" does not exist
```

This happens because the SQL is trying to create policies before all tables are created.

## Solution: Clean Database & Reinstall Schema

### Step 1: Delete Old Tables (IMPORTANT)

1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy and run this SQL:

```sql
-- Drop all tables (clean slate)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS braider_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

6. Click **Run**
7. Wait for ✅ success

### Step 2: Run New Schema

1. Click **New Query** again
2. Open file: `supabase/schema.sql` (updated version)
3. Copy ALL the code
4. Paste into Supabase
5. Click **Run**
6. Wait for ✅ success (should take 10-15 seconds)

### Step 3: Create Storage Buckets

1. Go to **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Create 3 buckets:
   - Name: `avatars` → Make Public → Create
   - Name: `portfolio` → Make Public → Create
   - Name: `gallery` → Make Public → Create

### Step 4: Restart Dev Server

```bash
# In terminal:
# Press Ctrl+C to stop
# Then:
npm run dev
```

### Step 5: Clear Cache & Test

1. Press `Ctrl+Shift+Delete`
2. Clear all cache
3. Refresh page
4. Try signing up

---

## Expected Result

✅ No SQL errors  
✅ All tables created  
✅ All indexes created  
✅ All RLS policies created  
✅ Storage buckets ready  
✅ Can sign up  
✅ Can login  

---

## If Still Getting Error

### Check:
1. Did you drop the old tables first?
2. Did you run the NEW schema.sql?
3. Did you wait for ✅ success?
4. Did you restart dev server?

### If Error Persists:
1. Go to Supabase → Tables
2. Check if tables exist
3. If they do, try dropping them again
4. Re-run the schema

---

## Verify Tables Were Created

1. Go to Supabase
2. Click **Tables** (left sidebar)
3. You should see:
   - profiles
   - braider_profiles
   - bookings
   - messages
   - payments
   - reviews

If you don't see all 6 tables, the schema didn't run properly.

---

**Time**: ~5 minutes  
**Difficulty**: Easy  
**Status**: Ready to fix
