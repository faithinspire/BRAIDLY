# ⚡ QUICK FIX - 5 MINUTES

## Error
```
ERROR: 42703: column "recipient_id" does not exist
```

## Fix (2 Steps)

### Step 1: Clean Database

Go to Supabase SQL Editor and run:

```sql
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS braider_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

Click **Run** → Wait for ✅

### Step 2: Install New Schema

1. Copy ALL from `supabase/schema.sql`
2. Paste into new SQL Query
3. Click **Run**
4. Wait for ✅

### Step 3: Create Storage Buckets

Storage → Create bucket:
- `avatars` (public)
- `portfolio` (public)
- `gallery` (public)

### Step 4: Restart & Test

```bash
npm run dev
```

Clear cache (Ctrl+Shift+Delete) → Refresh → Try signup

---

## Done! ✅

Should work now.

---

**Time**: 5 min  
**Difficulty**: Easy
