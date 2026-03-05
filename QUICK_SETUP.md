# ⚡ QUICK SETUP - 10 MINUTES

## Step 1: Verify Supabase Credentials ✅

Your `.env` file already has Supabase credentials:
```
VITE_SUPABASE_URL=https://rsemdjxizhkqaoptdxlc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 2: Setup Database Schema (CRITICAL)

1. Go to https://app.supabase.com
2. Select your project: **rsemdjxizhkqaoptdxlc**
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy ALL content from `supabase/schema.sql`
6. Paste into the SQL editor
7. Click **Run** (or Ctrl+Enter)
8. Wait for success message

## Step 3: Create Storage Buckets

1. In Supabase, go to **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Create 3 buckets (one at a time):
   - Name: `avatars` → Make Public → Create
   - Name: `portfolio` → Make Public → Create
   - Name: `gallery` → Make Public → Create

## Step 4: Test the App

```bash
# Make sure you're in the project directory
cd braidly

# Start the dev server
npm run dev
```

Visit: `http://localhost:5173`

## Step 5: Create Test Account

1. Click **Sign Up**
2. Select **I'm a Customer**
3. Fill in:
   - Full Name: `Test Customer`
   - Email: `test@example.com`
   - Password: `Test123!`
   - Location: `New York, NY`
4. Click **Sign Up**

## Step 6: Test Features

- ✅ You should see the Customer Dashboard
- ✅ Try searching for braiders
- ✅ Try creating a braider account
- ✅ Try admin dashboard

---

## Troubleshooting

### Still seeing "Auth session missing"?
- This is normal when not logged in
- Try signing up with a new account
- Check browser console for other errors

### Database tables not created?
- Go to Supabase SQL Editor
- Run `SELECT * FROM profiles;`
- If error, re-run the schema.sql file

### Storage buckets not working?
- Make sure all 3 buckets are **Public**
- Check bucket names match exactly

### Still having issues?
- Check `.env` file has correct credentials
- Restart dev server: `npm run dev`
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors

---

## Next Steps

Once setup is complete:

1. **Create Test Accounts**
   - Customer account
   - Braider account
   - Admin account

2. **Test All Features**
   - Browse braiders
   - Book appointments
   - Chat system
   - Admin dashboard

3. **Deploy to Production**
   - Follow `DEPLOYMENT_CHECKLIST.md`
   - Push to GitHub
   - Deploy to Vercel

---

**Status**: Ready to Setup  
**Time**: ~10 minutes  
**Difficulty**: Easy
