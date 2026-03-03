@echo off
REM Deploy Braidly App to Vercel - Bypass GitHub
REM This script deploys directly from your local machine to Vercel

echo.
echo ========================================
echo BRAIDLY APP - VERCEL DEPLOYMENT
echo ========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
)

echo.
echo Step 1: Logging into Vercel...
echo (If browser doesn't open, visit: https://vercel.com/auth/login)
echo.
vercel login

echo.
echo Step 2: Deploying to Vercel...
echo.
vercel --prod

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is now live on Vercel.
echo Check the URL provided above.
echo.
pause
