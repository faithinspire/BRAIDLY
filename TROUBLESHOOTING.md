# 🔧 TROUBLESHOOTING GUIDE

## Issue: "Auth session missing!" Error

### What It Means
This error appears when Supabase can't find an active authentication session. This is **normal** when you're not logged in.

### Solution
1. **Sign Up** - Create a new account
2. **Login** - Use your credentials
3. The error should disappear once authenticated

### If Error Persists After Login
1. Check `.env` file has correct Supabase credentials
2. Restart dev server: `npm run dev`
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Try incognito/private window

---

## Issue: "Database tables not found" Error

### What It Means
The Supabase database schema hasn't been created yet.

### Solution
1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy ALL content from `supabase/schema.sql`
6. Paste into editor
7. Click **Run** (Ctrl+Enter)
8. Wait for success message
9. Refresh the app

---

## Issue: "Storage bucket not found" Error

### What It Means
The storage buckets for file uploads haven't been created.

### Solution
1. Go to https://app.supabase.com
2. Go to **Storage** (left sidebar)
3. Create 3 buckets:
   - Click **Create a new bucket**
   - Name: `avatars`
   - Make it **Public**
   - Click **Create**
   - Repeat for `portfolio` and `gallery`

---

## Issue: App Shows "Loading..." Forever

### What It Means
The app is stuck trying to connect to Supabase.

### Solution
1. Check network connectivity
2. Verify `.env` credentials are correct
3. Check Supabase project is active
4. Restart dev server: `npm run dev`
5. Check browser console for errors

---

## Issue: Can't Sign Up

### What It Means
Supabase Auth isn't working properly.

### Solution
1. Check email format is valid
2. Check password is at least 6 characters
3. Try different email address
4. Check Supabase Auth is enabled
5. Check browser console for specific error

---

## Issue: Can't Login

### What It Means
Credentials aren't being validated.

### Solution
1. Verify email is correct
2. Verify password is correct
3. Check user exists in Supabase Auth
4. Try resetting password
5. Check browser console for errors

---

## Issue: Dashboard Shows Demo Data

### What It Means
The app is using demo/sample data because the database isn't ready.

### Solution
1. This is **normal** during setup
2. Run the database schema (see above)
3. Create storage buckets (see above)
4. Refresh the app
5. Real data should appear

---

## Issue: Chat Not Working

### What It Means
Real-time messaging isn't connecting.

### Solution
1. Check Realtime is enabled in Supabase
2. Go to Supabase → Settings → Realtime
3. Verify `messages` table is in replication
4. Restart dev server
5. Check browser console for WebSocket errors

---

## Issue: File Upload Not Working

### What It Means
Images can't be uploaded to storage.

### Solution
1. Check storage buckets exist (see above)
2. Check buckets are **Public**
3. Check file size isn't too large
4. Check file format is supported (jpg, png, gif)
5. Check browser console for errors

---

## Issue: "WebSocket closed without opened" Error

### What It Means
Vite dev server WebSocket connection failed (not critical).

### Solution
1. This is usually harmless
2. Refresh the page
3. Restart dev server: `npm run dev`
4. Check network connectivity

---

## Issue: Buttons Not Responding

### What It Means
Click events aren't working.

### Solution
1. Check browser console for JavaScript errors
2. Verify component is properly imported
3. Check onClick handler is defined
4. Try refreshing page
5. Try different browser

---

## Issue: Styling Looks Wrong

### What It Means
CSS isn't loading properly.

### Solution
1. Check CSS files exist in `src/pages/` and `src/components/`
2. Verify imports are correct
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Restart dev server: `npm run dev`
5. Try different browser

---

## Issue: Mobile View Looks Broken

### What It Means
Responsive design isn't working.

### Solution
1. Check viewport meta tag in `index.html`
2. Verify CSS media queries are correct
3. Test in actual mobile device (not just browser resize)
4. Check for horizontal scroll
5. Verify button sizes are 48px+

---

## Issue: "Cannot find module" Error

### What It Means
A required file or dependency is missing.

### Solution
1. Run `npm install` to install dependencies
2. Check file paths are correct
3. Verify imports use correct paths
4. Check for typos in import statements
5. Restart dev server

---

## Issue: "CORS Error" in Console

### What It Means
Cross-Origin Resource Sharing is blocked.

### Solution
1. This usually happens with external APIs
2. Check Supabase CORS settings
3. Verify API endpoints are correct
4. Check browser console for specific error
5. May need backend proxy

---

## Issue: Performance is Slow

### What It Means
App is loading slowly or feels sluggish.

### Solution
1. Check network tab in DevTools
2. Look for large files or slow requests
3. Optimize images
4. Check database queries
5. Enable caching
6. Use CDN for static files

---

## Issue: "Unexpected token" Error

### What It Means
JavaScript syntax error.

### Solution
1. Check browser console for line number
2. Look for missing commas, brackets, semicolons
3. Check for typos in code
4. Verify imports are correct
5. Restart dev server

---

## Issue: Environment Variables Not Working

### What It Means
`.env` variables aren't being loaded.

### Solution
1. Verify `.env` file exists in root directory
2. Check variable names start with `VITE_`
3. Verify no spaces around `=`
4. Restart dev server after changing `.env`
5. Check `.env` is not in `.gitignore`

---

## Issue: "Cannot read property of undefined" Error

### What It Means
Trying to access property of null/undefined object.

### Solution
1. Check browser console for line number
2. Add null checks before accessing properties
3. Use optional chaining: `obj?.property`
4. Use fallback values: `obj?.property || 'default'`
5. Check data is loaded before rendering

---

## Issue: Infinite Loading Loop

### What It Means
App keeps loading and never finishes.

### Solution
1. Check for infinite loops in useEffect
2. Verify API calls complete
3. Check for circular dependencies
4. Look for missing return statements
5. Check browser console for errors

---

## Quick Diagnostic Checklist

- [ ] `.env` file exists with correct credentials
- [ ] Supabase project is active
- [ ] Database schema is created
- [ ] Storage buckets are created
- [ ] Browser console has no errors
- [ ] Network tab shows successful requests
- [ ] Dev server is running: `npm run dev`
- [ ] Browser is not in offline mode
- [ ] Cache is cleared
- [ ] Latest code is deployed

---

## Getting Help

### Check These First
1. Browser console (F12 → Console tab)
2. Network tab (F12 → Network tab)
3. This troubleshooting guide
4. Documentation files

### If Still Stuck
1. Check GitHub issues
2. Check Supabase docs
3. Check React docs
4. Create detailed bug report with:
   - Error message
   - Steps to reproduce
   - Browser/OS
   - Screenshots

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| Auth session missing | Not logged in | Sign up or login |
| Database tables not found | Schema not created | Run schema.sql |
| Storage bucket not found | Buckets not created | Create storage buckets |
| CORS error | Cross-origin blocked | Check CORS settings |
| Cannot find module | Missing file/dependency | Run npm install |
| Unexpected token | Syntax error | Check code syntax |
| WebSocket closed | Dev server issue | Restart dev server |
| Cannot read property | Null/undefined | Add null checks |

---

**Last Updated**: March 4, 2026  
**Status**: Complete Troubleshooting Guide
