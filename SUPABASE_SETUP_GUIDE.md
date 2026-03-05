# SUPABASE SETUP GUIDE - BRAIDLY

## Problem: "Could not find the 'email' column of 'profiles' in the schema cache"

This error occurs because the database schema hasn't been deployed to Supabase yet.

---

## STEP 1: Deploy the Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your BRAIDLY project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire content from `supabase/schema-clean.sql`
6. Click **Run** (or press Ctrl+Enter)
7. Wait for it to complete (should see "Success" message)

### Option B: Using Supabase CLI

```bash
supabase db push
```

---

## STEP 2: Create Storage Buckets

After the schema is deployed, create 3 storage buckets:

1. Go to **Storage** in Supabase Dashboard
2. Click **Create a new bucket**
3. Create these 3 buckets (one at a time):
   - **avatars** (for user profile pictures)
   - **portfolios** (for braider portfolio images)
   - **logos** (for business logos)

For each bucket:
- Name: (as listed above)
- Public: Toggle ON (so images are publicly accessible)
- Click **Create bucket**

---

## STEP 3: Set Environment Variables

1. Open `.env` file in your project root
2. Add these variables (get values from Supabase Dashboard):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

To find these values:
- Go to Supabase Dashboard → Settings → API
- Copy the **Project URL** and **Anon Key**

---

## STEP 4: Verify Setup

1. Stop your dev server (Ctrl+C)
2. Run: `npm run dev`
3. Go to http://localhost:5177
4. Try signing up with a test account
5. If signup succeeds, schema is working!

---

## Database Schema Overview

The schema creates 8 tables:

| Table | Purpose |
|-------|---------|
| **profiles** | All users (customers, braiders, admins) |
| **braiders** | Braider-specific data (rating, location, wallet) |
| **customers** | Customer-specific data |
| **portfolios** | Braider portfolio images |
| **bookings** | Appointment bookings |
| **messages** | Chat messages |
| **payments** | Payment records |
| **admin_logs** | Admin activity logs |

---

## Troubleshooting

### Error: "relation 'profiles' already exists"
- Run `supabase/schema-clean.sql` first to drop old tables
- Then run `supabase/schema.sql`

### Error: "permission denied for schema public"
- Check RLS policies in Supabase Dashboard
- Ensure your user has proper permissions

### Signup still fails after schema deployment
- Check browser console for detailed error
- Verify environment variables are set correctly
- Restart dev server after changing `.env`

---

## Next Steps

Once Supabase is set up:
1. Test signup/login flow
2. Browse braiders (Phase 3)
3. Upload portfolio images
4. Set up payments (Phase 5)

