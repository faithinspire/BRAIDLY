@echo off
echo ============================================
echo BRAIDLY RLS FIX INSTRUCTIONS
echo ============================================
echo.
echo STEP 1: Open Supabase SQL Editor
echo   1. Go to: https://app.supabase.com
echo   2. Select your project
echo   3. Click "SQL Editor" in left sidebar
echo   4. Click "New query"
echo.
echo STEP 2: Copy the SQL
echo   1. Open the file: FIX_RLS_SIMPLE.sql
echo   2. Copy ALL the SQL code
echo.
echo STEP 3: Paste and Run
echo   1. Paste the SQL into Supabase SQL Editor
echo   2. Click "Run" button (or press Ctrl+Enter)
echo   3. Wait for "Success" message
echo.
echo STEP 4: Test Signup/Login
echo   1. Go to: http://localhost:3001/signup
echo   2. Create a new account
echo   3. Login with the new account
echo   4. Should work automatically!
echo.
echo ============================================
echo TROUBLESHOOTING
echo ============================================
echo.
echo If you see errors:
echo   1. Make sure you're logged into Supabase
echo   2. Make sure you selected the correct project
echo   3. Check if tables exist (profiles, braider_profiles)
echo   4. Try running the SQL in sections
echo.
echo ============================================
echo IMPORTANT NOTES
echo ============================================
echo.
echo 1. This is a ONE-TIME setup
echo 2. After running SQL, signup/login will work
echo 3. No email confirmation needed for testing
echo 4. All new users will get profiles automatically
echo.
pause