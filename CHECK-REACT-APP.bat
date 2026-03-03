@echo off
echo.
echo ========================================
echo   BRAIDLY REACT APP - DIAGNOSTIC CHECK
echo ========================================
echo.

echo [1] Checking if Node.js is installed...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)
echo OK: Node.js is installed
echo.

echo [2] Checking if npm is installed...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
echo OK: npm is installed
echo.

echo [3] Checking if package.json exists...
if exist package.json (
    echo OK: package.json found
) else (
    echo ERROR: package.json not found!
    echo Make sure you're in the project directory
    pause
    exit /b 1
)
echo.

echo [4] Checking if node_modules exists...
if exist node_modules (
    echo OK: node_modules found
) else (
    echo WARNING: node_modules not found!
    echo Run: npm install
    pause
    exit /b 1
)
echo.

echo [5] Checking if src folder exists...
if exist src (
    echo OK: src folder found
) else (
    echo ERROR: src folder not found!
    pause
    exit /b 1
)
echo.

echo [6] Checking if BraiderDashboard.jsx exists...
if exist src\pages\BraiderDashboard.jsx (
    echo OK: BraiderDashboard.jsx found
) else (
    echo ERROR: BraiderDashboard.jsx not found!
    pause
    exit /b 1
)
echo.

echo [7] Checking if all new braider pages exist...
if exist src\pages\BraiderSchedule.jsx (
    echo OK: BraiderSchedule.jsx found
) else (
    echo ERROR: BraiderSchedule.jsx not found!
)
if exist src\pages\BraiderEarnings.jsx (
    echo OK: BraiderEarnings.jsx found
) else (
    echo ERROR: BraiderEarnings.jsx not found!
)
if exist src\pages\BraiderPortfolio.jsx (
    echo OK: BraiderPortfolio.jsx found
) else (
    echo ERROR: BraiderPortfolio.jsx not found!
)
if exist src\pages\BraiderReviews.jsx (
    echo OK: BraiderReviews.jsx found
) else (
    echo ERROR: BraiderReviews.jsx not found!
)
if exist src\pages\BraiderBookings.jsx (
    echo OK: BraiderBookings.jsx found
) else (
    echo ERROR: BraiderBookings.jsx not found!
)
echo.

echo ========================================
echo   DIAGNOSTIC COMPLETE
echo ========================================
echo.
echo If all checks passed, the React app should work.
echo.
echo NEXT STEPS:
echo 1. Run: RESTART-REACT-APP.bat
echo 2. Wait for "ready" message
echo 3. Open: http://localhost:5173
echo 4. Hard refresh: CTRL + SHIFT + R
echo 5. Login as braider
echo.
pause
