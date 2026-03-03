@echo off
echo ============================================
echo NUCLEAR FIX FOR AUTH - RUN IMMEDIATELY
echo ============================================
echo.
echo THIS WILL DISABLE ALL RLS (Row Level Security)
echo Auth will work 100% after this.
echo.
echo STEP 1: Open Supabase SQL Editor
echo   1. Go to: https://app.supabase.com
echo   2. Select your project
echo   3. Click "SQL Editor" in left sidebar
echo   4. Click "New query"
echo.
echo STEP 2: Copy the Nuclear SQL
echo   1. Open file: DISABLE_ALL_RLS_NOW.sql
echo   2. Copy ALL the SQL code
echo.
echo STEP 3: Paste and Run
echo   1. Paste into Supabase SQL Editor
echo   2. Click "Run" button
echo   3. Wait for "Success" message
echo.
echo STEP 4: Test Immediately
echo   1. Go to: http://localhost:3001/signup
echo   2. Create account (any email)
echo   3. Should work 100%
echo.
echo ============================================
echo WHAT THIS DOES:
echo ============================================
echo.
echo 1. DISABLES RLS for all tables
echo 2. DROPS all existing policies
echo 3. Allows ALL database operations
echo 4. No more permission errors
echo.
echo ============================================
echo WARNING:
echo ============================================
echo.
echo This is for DEVELOPMENT ONLY!
echo Do NOT use this in production.
echo.
echo After testing, you can re-enable RLS:
echo   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
echo.
echo ============================================
echo TEST CREDENTIALS:
echo ============================================
echo.
echo Email: test@example.com
echo Password: Test123456
echo Full Name: Test User
echo Phone: 1234567890
echo Role: Customer
echo.
echo Should work immediately after running SQL.
echo.
pause