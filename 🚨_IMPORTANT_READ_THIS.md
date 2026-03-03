# 🚨 CRITICAL: YOU'RE USING THE WRONG URL!

## THE PROBLEM
You were viewing OLD static HTML files that show demo data.
These files have been moved to `_OLD_HTML_FILES_BACKUP` folder.

## THE SOLUTION
The REAL React app with Supabase integration runs on a different port!

═══════════════════════════════════════════════════════════

# ✅ CORRECT URL TO USE:

## React App (FUNCTIONAL - USE THIS):
🟢 http://localhost:3000

This is the REAL app with:
- ✅ Supabase database connection
- ✅ Functional buttons
- ✅ Real data (not demo)
- ✅ Working navigation
- ✅ All features enabled

═══════════════════════════════════════════════════════════

## ❌ WRONG URLs (OLD STATIC FILES - DON'T USE):
🔴 http://localhost:3001/admin-dashboard.html
🔴 http://localhost:3001/braider-dashboard.html
🔴 http://localhost:3001/customer-dashboard.html

These show DEMO data and nothing works!
They have been moved to backup folder.

═══════════════════════════════════════════════════════════

# HOW TO START THE APP

## Step 1: Stop any running servers
Press Ctrl+C in any terminal windows

## Step 2: Start the React app
```bash
npm run dev
```

## Step 3: Open the correct URL
The browser should auto-open to: http://localhost:3000

If not, manually go to: **http://localhost:3000**

═══════════════════════════════════════════════════════════

# TESTING THE FUNCTIONAL APP

## 1. Login Page
URL: http://localhost:3000/login

Test credentials (if you have test data in Supabase):
- Email: admin@braidly.com
- Password: (your test password)

## 2. Admin Dashboard
After login: http://localhost:3000/admin/dashboard

Features that WORK:
✅ User Management button → /admin/users
✅ Verifications button → /admin/verification
✅ Disputes button → /admin/disputes
✅ Analytics button → /admin/analytics
✅ Financial button → /admin/financial
✅ Settings button → /admin/settings

## 3. Braider Dashboard
URL: http://localhost:3000/braider/dashboard

Features that WORK:
✅ Schedule Management → /braider/schedule
✅ Earnings & Payouts → /braider/earnings
✅ Portfolio → /braider/portfolio
✅ Bookings → /braider/bookings
✅ Reviews → /braider/reviews

## 4. Customer Dashboard
URL: http://localhost:3000/customer/dashboard

Features that WORK:
✅ Browse Braiders → /customer/browse
✅ My Bookings → /customer/bookings
✅ Favorites → /customer/favorites
✅ History → /customer/history

═══════════════════════════════════════════════════════════

# IF YOU SEE "NO DATA"

This is NORMAL if your Supabase database is empty!

## Add Test Data:
1. Go to: https://app.supabase.com
2. Select project: mmluzuxcoqyrtenstkxq
3. Go to: Table Editor
4. Add test data to these tables:
   - profiles (users)
   - braider_profiles (braiders)
   - bookings
   - services

## Or Create Account:
1. Go to: http://localhost:3000/signup
2. Create a new account
3. Login and test features

═══════════════════════════════════════════════════════════

# TROUBLESHOOTING

## Problem: Port 3000 already in use
Solution:
```bash
# Kill the process using port 3000
npx kill-port 3000
# Then start again
npm run dev
```

## Problem: "Cannot find module"
Solution:
```bash
npm install
npm run dev
```

## Problem: Blank white screen
Solution:
1. Open browser console (F12)
2. Check for errors
3. Make sure .env file exists
4. Restart dev server

## Problem: "Supabase connection failed"
Solution:
1. Check .env file exists
2. Verify credentials in .env match Supabase
3. Check internet connection
4. Restart dev server

═══════════════════════════════════════════════════════════

# SUMMARY

❌ OLD: http://localhost:3001/admin-dashboard.html (DEMO DATA)
✅ NEW: http://localhost:3000/admin/dashboard (REAL APP)

The React app on port 3000 is FULLY FUNCTIONAL with:
- Real Supabase database
- Working buttons and navigation
- No demo data
- All features enabled

═══════════════════════════════════════════════════════════
