@echo off
echo.
echo ========================================
echo   RESTARTING BRAIDLY REACT APP
echo ========================================
echo.
echo This will:
echo 1. Stop any running dev servers
echo 2. Clear the cache
echo 3. Start fresh dev server
echo.
pause

echo.
echo [1/3] Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Clearing npm cache...
call npm cache clean --force

echo.
echo [3/3] Starting dev server...
echo.
echo ========================================
echo   DEV SERVER STARTING...
echo ========================================
echo.
echo Once you see "ready" message:
echo 1. Open browser to: http://localhost:5173
echo 2. Press CTRL + SHIFT + R to hard refresh
echo 3. Login with: braider@braidly.com / Braider123!
echo.
echo ========================================
echo.

call npm run dev

pause
