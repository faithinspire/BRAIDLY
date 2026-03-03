@echo off
echo ============================================
echo QUICK AUTH TEST - BRAIDLY
echo ============================================
echo.
echo STEP 1: Start React App (if not running)
echo   npm run dev
echo   OR
echo   Double-click "⚡_DOUBLE_CLICK_START_REACT_APP.txt"
echo.
echo STEP 2: Open Test Page
echo   Go to: http://localhost:3001/test-supabase
echo.
echo STEP 3: Run Tests
echo   1. Click "Test Supabase Connection" button
echo   2. Check results for errors
echo   3. If green checkmarks ✅, auth is working
echo   4. If red X ❌, follow instructions below
echo.
echo ============================================
echo IF TESTS FAIL:
echo ============================================
echo.
echo ERROR: "Database query failed"
echo   FIX: Run RLS fix SQL in Supabase
echo        1. Open FIX_RLS_SIMPLE.sql
echo        2. Copy all SQL
echo        3. Run in Supabase SQL Editor
echo.
echo ERROR: "Signup failed"
echo   FIX: Disable email confirmation in Supabase
echo        1. Go to Supabase
echo        2. Authentication → Providers → Email
echo        3. Uncheck "Confirm email"
echo        4. Save
echo.
echo ERROR: "Network error"
echo   FIX: Check .env file
echo        1. Open .env file
echo        2. Check VITE_SUPABASE_URL
echo        3. Check VITE_SUPABASE_ANON_KEY
echo        4. Must match your Supabase project
echo.
echo ============================================
echo MANUAL TEST:
echo ============================================
echo.
echo 1. Open: http://localhost:3001/signup
echo 2. Fill form:
echo    Email: test@example.com
echo    Password: Test123456
echo    Full Name: Test User
echo    Phone: 1234567890
echo    Role: Customer
echo 3. Click "Sign Up"
echo 4. Should see success message
echo.
echo 5. Open: http://localhost:3001/login
echo 6. Same credentials
echo 7. Click "Login"
echo 8. Should redirect to dashboard
echo.
echo ============================================
echo STILL NOT WORKING?
echo ============================================
echo.
echo 1. Check browser console (F12 → Console)
echo 2. Look for red error messages
echo 3. Share errors for help
echo.
echo 2. Check Supabase project:
echo    - URL matches .env file
echo    - Anon key matches .env file
echo    - Tables exist (profiles, braider_profiles)
echo.
echo 3. Run emergency fix:
echo    ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
echo    (Run in Supabase SQL Editor)
echo.
pause