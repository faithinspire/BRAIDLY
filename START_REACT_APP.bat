@echo off
echo ========================================
echo   STARTING BRAIDLY REACT APP
echo ========================================
echo.
echo Killing any existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Starting development server...
echo.
echo ========================================
echo   APP WILL OPEN AT: http://localhost:3000
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.
npm run dev
pause
