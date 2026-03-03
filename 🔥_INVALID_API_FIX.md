# 🔥 INVALID API ERROR - IMMEDIATE FIX

## Problem

"Invalid API" error when trying to login or signup. This means Supabase credentials are invalid or missing.

---

## Root Cause

The `.env` file has Supabase credentials, but they might be:
1. Expired
2. Invalid
3. From wrong project
4. Not loaded properly

---

## Solution

### Step 1: Get Fresh Supabase Credentials (2 minutes)

1. Go to **Supabase Dashboard**: https://app.supabase.com
2. Select your **Braidly project**
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon Key** (long string starting with `eyJ...`)

### Step 2: Update .env File (1 minute)

Replace the credentials in `.env`:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_URL.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

**Example**:
```
VITE_SUPABASE_URL=https://mmluzuxcoqyrtenstkxq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tbHV6dXhjb3F5cnRlbnN0a3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MjgwNzEsImV4cCI6MjA4NTIwNDcxOX0.c8fGCzUxFNOW9s7Q-8JPwBEMsfQHflGex108fXXZpTc
```

### Step 3: Restart Dev Server (2 minutes)

1. Stop dev server (Ctrl+C)
2. Clear cache:
   ```bash
   rm -rf node_modules/.vite
   ```
3. Restart dev server:
   ```bash
   npm run dev
   ```

### Step 4: Clear Browser Cache (1 minute)

1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Click **Clear site data**
4. Refresh page (Ctrl+Shift+R)

### Step 5: Test Login/Signup (2 minutes)

1. Go to http://localhost:3002/signup
2. Try to create account
3. Expected: ✅ Works without "Invalid API" error

---

## Verification

### Check if Credentials are Valid

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Run this command:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```
4. Verify both show values (not undefined)

### Check Supabase Connection

1. Go to **Network** tab in DevTools
2. Try to signup
3. Look for requests to `supabase.co`
4. Check response status (should be 200, not 401/403)

---

## Common Issues

### Issue: "Invalid API Key"
**Cause**: Anon key is wrong or expired
**Solution**: Get fresh key from Supabase Dashboard

### Issue: "Project not found"
**Cause**: Project URL is wrong
**Solution**: Verify URL matches your Supabase project

### Issue: Still getting error after restart
**Cause**: Browser cache not cleared
**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Environment variables not loading
**Cause**: Dev server not restarted
**Solution**: Stop and restart dev server

---

## Step-by-Step Fix

```
1. Get credentials from Supabase Dashboard
   ↓
2. Update .env file with new credentials
   ↓
3. Stop dev server (Ctrl+C)
   ↓
4. Clear Vite cache (rm -rf node_modules/.vite)
   ↓
5. Restart dev server (npm run dev)
   ↓
6. Clear browser cache (DevTools > Application > Clear site data)
   ↓
7. Hard refresh browser (Ctrl+Shift+R)
   ↓
8. Test login/signup
   ↓
✅ Should work now!
```

---

## Credentials Format

### Correct Format
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IjEyMzQ1Njc4OTAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.xxxxx
```

### Wrong Format (Don't use)
```
VITE_SUPABASE_URL=mmluzuxcoqyrtenstkxq.supabase.co  ❌ Missing https://
VITE_SUPABASE_ANON_KEY=invalid_key_123  ❌ Too short
```

---

## After Fix

Once login/signup works:

1. ✅ Test avatar upload
2. ✅ Test portfolio upload
3. ✅ Test profile save
4. ✅ Commit changes to Git
5. ✅ Deploy to Vercel

---

## Support

If still getting errors:

1. Check browser console for exact error message
2. Verify Supabase project is active
3. Verify credentials are from correct project
4. Check Supabase status page
5. Try creating new Supabase project

---

**Status**: Follow steps above to fix immediately
**Time**: ~10 minutes total
