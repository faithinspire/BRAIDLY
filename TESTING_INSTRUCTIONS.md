# TESTING INSTRUCTIONS - PRODUCTION REBUILD PHASE 1

## 🚀 START THE APP

```bash
npm run dev
```

Then open: `http://localhost:5173`

## 🧹 CLEAR BROWSER CACHE

**Chrome/Edge:**
- Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Select "All time"
- Check "Cookies and other site data"
- Check "Cached images and files"
- Click "Clear data"

**Firefox:**
- Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Select "Everything"
- Click "Clear Now"

## ✅ TEST CHECKLIST

### 1. SIGNUP FLOW
- [ ] Go to `/signup`
- [ ] Select "I'm a Customer"
- [ ] Fill in form with test data
- [ ] Create account
- [ ] Should redirect to `/customer/dashboard`
- [ ] No "Demo Mode" message should appear
- [ ] Should show empty state if no braiders exist

### 2. LOGIN FLOW
- [ ] Go to `/login`
- [ ] Enter registered email and password
- [ ] Should redirect to `/customer/dashboard`
- [ ] Should load user profile

### 3. CUSTOMER DASHBOARD
- [ ] Should show "Welcome, [Name]!"
- [ ] Should show stats (0 if no data)
- [ ] Should show search bar
- [ ] Should show empty state if no braiders
- [ ] Should NOT show any "Demo" text
- [ ] Should NOT show placeholder images

### 4. PROFILE PAGE
- [ ] Click "My Profile" button
- [ ] Should navigate to `/customer/profile`
- [ ] Should show editable form
- [ ] Should be able to save changes
- [ ] Should redirect back to dashboard

### 5. ROUTING TESTS
- [ ] Try `/invalid-route` → Should show 404 page
- [ ] Try `/braider/dashboard` as customer → Should redirect to home
- [ ] Try `/admin/dashboard` as customer → Should redirect to home
- [ ] Try accessing protected routes without login → Should redirect to login

### 6. BRAND CONSISTENCY
- [ ] Check Login page → Should say "BRAIDLY" (not "BRAIDELY")
- [ ] Check Signup page → Should say "BRAIDLY" (not "BRAIDELY")
- [ ] Check Navbar → Should show "BRAIDLY"

### 7. PAYMENT HISTORY
- [ ] Go to `/customer/payment-history` (if route exists)
- [ ] Should show empty state if no payments
- [ ] Should NOT show localStorage data
- [ ] Should load from database

### 8. ESCROW PAGE
- [ ] Go to `/customer/escrow` (if route exists)
- [ ] Should show empty state if no escrows
- [ ] Should NOT show localStorage data
- [ ] Should load from database

### 9. CONSOLE CHECK
- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Should see NO errors
- [ ] Should see NO warnings about demo data
- [ ] Should see NO localStorage references

### 10. MOBILE TEST
- [ ] Open DevTools (F12)
- [ ] Click device toggle (mobile view)
- [ ] Test on iPhone 12 size
- [ ] Test on iPad size
- [ ] All pages should be responsive
- [ ] Navigation should work on mobile

## 🐛 COMMON ISSUES & FIXES

### Issue: Still seeing demo data
**Fix**: 
1. Clear browser cache completely
2. Restart dev server: `npm run dev`
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Issue: Getting "BRAIDELY" instead of "BRAIDLY"
**Fix**: 
1. Check if you're on the latest code
2. Clear cache and restart

### Issue: Seeing placeholder images
**Fix**: 
1. Clear cache
2. Restart dev server
3. Check BraiderCard.jsx is updated

### Issue: localStorage data appearing
**Fix**: 
1. Open DevTools
2. Go to Application tab
3. Clear all localStorage
4. Refresh page

### Issue: Routes redirecting unexpectedly
**Fix**: 
1. Check user is logged in
2. Check user role matches route
3. Check App.jsx has latest routing

## 📊 EXPECTED RESULTS

### ✅ CORRECT BEHAVIOR
- No demo data anywhere
- Empty states when no data exists
- Proper error messages
- Smooth navigation
- No console errors
- Responsive on all devices
- Professional UI

### ❌ INCORRECT BEHAVIOR (Report if seen)
- Any "Demo" text
- Placeholder images
- localStorage data
- Unexpected redirects
- Console errors
- Broken navigation
- Unresponsive UI

## 📝 REPORTING ISSUES

If you find any issues:
1. Note the exact steps to reproduce
2. Check the console for errors
3. Take a screenshot
4. Report with:
   - URL where issue occurs
   - Steps to reproduce
   - Expected vs actual behavior
   - Console errors (if any)

## ✨ SUCCESS CRITERIA

Phase 1 is successful when:
- ✅ Zero demo content visible
- ✅ All routes work correctly
- ✅ No unexpected redirects
- ✅ Empty states show when appropriate
- ✅ No console errors
- ✅ Responsive on all devices
- ✅ Professional appearance

---
**Ready to test?** Start with `npm run dev` and follow the checklist above!
