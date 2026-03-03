@echo off
echo ============================================
echo BRAIDLY AUTH TEST
echo ============================================
echo.
echo This script helps test authentication issues.
echo.
echo STEP 1: Check .env file
echo   1. Open .env file in root directory
echo   2. Make sure these variables are set:
echo      VITE_SUPABASE_URL=https://your-project.supabase.co
echo      VITE_SUPABASE_ANON_KEY=your-anon-key
echo.
echo STEP 2: Check Supabase Project
echo   1. Go to: https://app.supabase.com
echo   2. Check your project URL matches .env
echo   3. Get anon key from: Settings > API
echo.
echo STEP 3: Test Signup (Manual)
echo   1. Open browser to: http://localhost:3001/signup
echo   2. Fill in form with test credentials:
echo      Email: test@example.com
echo      Password: Test123456
echo      Full Name: Test User
echo      Phone: 1234567890
echo      Role: Customer
echo   3. Click "Sign Up"
echo   4. Should see success message
echo.
echo STEP 4: Test Login
echo   1. Go to: http://localhost:3001/login
echo   2. Enter same credentials
echo   3. Click "Login"
echo   4. Should redirect to dashboard
echo.
echo STEP 5: Check Console Errors
echo   1. Open DevTools (F12)
echo   2. Go to Console tab
echo   3. Look for any red error messages
echo   4. Share errors if any
echo.
echo ============================================
echo COMMON ERRORS & FIXES
echo ============================================
echo.
echo ERROR: "Invalid email or password"
echo   FIX: User doesn't exist. Sign up first.
echo.
echo ERROR: "Failed to create user profile"
echo   FIX: Run the RLS fix SQL in Supabase
echo.
echo ERROR: "Email not confirmed"
echo   FIX: In Supabase, disable email confirmation:
echo        1. Go to Authentication > Providers > Email
echo        2. Uncheck "Confirm email"
echo        3. Click Save
echo.
echo ERROR: "Network error" or "Failed to fetch"
echo   FIX: Check .env file has correct Supabase URL
echo.
echo ============================================
echo QUICK FIXES
echo ============================================
echo.
echo 1. Run RLS fix: Double-click RUN_RLS_FIX.bat
echo 2. Check .env: Make sure credentials are correct
echo 3. Disable email confirmation in Supabase
echo 4. Restart React app if needed
echo.
pause