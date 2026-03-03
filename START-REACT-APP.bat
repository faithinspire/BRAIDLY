@echo off
echo.
echo ========================================
echo   BRAIDLY REACT APP - QUICK START
echo ========================================
echo.
echo This will:
echo 1. Copy assets to public folder
echo 2. Install dependencies (if needed)
echo 3. Start the React development server
echo.
echo Press any key to continue...
pause >nul

echo.
echo [1/3] Copying assets...
if not exist "public" mkdir public
xcopy /E /I /Y assets public\assets >nul 2>&1
echo Done!

echo.
echo [2/3] Installing dependencies...
echo (This may take 2-3 minutes on first run)
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: npm install failed!
    echo Make sure Node.js is installed from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo.
echo [3/3] Starting React app...
echo.
echo ========================================
echo   Browser will open automatically!
echo ========================================
echo.
echo URL: http://localhost:3000
echo.
echo LOGIN CREDENTIALS:
echo   Email: customer@braidly.com
echo   Password: Customer123!
echo.
echo Press Ctrl+C to stop the server when done.
echo.
call npm run dev
