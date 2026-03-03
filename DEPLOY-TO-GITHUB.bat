@echo off
echo.
echo ========================================
echo   DEPLOYING BRAIDLY TO GITHUB
echo ========================================
echo.
echo Repository: https://github.com/faithinspire/BRAIDLY.git
echo.
echo This will:
echo 1. Remove old remote (if exists)
echo 2. Add your GitHub repository
echo 3. Commit all changes
echo 4. Force push to main branch
echo.
pause

echo.
echo [1/5] Initializing Git...
git init

echo.
echo [2/5] Removing old remote (if exists)...
git remote remove origin 2>nul

echo.
echo [3/5] Adding your GitHub repository...
git remote add origin https://github.com/faithinspire/BRAIDLY.git

echo.
echo [4/5] Adding and committing all files...
git add .
git commit -m "Complete Braidly React App - Fully Functional with Soft Animated Theme"

echo.
echo [5/5] Pushing to GitHub (force push to replace old code)...
git branch -M main
git push -u origin main --force

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your code has been pushed to:
echo https://github.com/faithinspire/BRAIDLY.git
echo.
echo The old code has been replaced with the new React app.
echo.
pause
