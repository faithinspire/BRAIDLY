@echo off
echo.
echo ========================================
echo   COMMITTING BRAIDLY TO GITHUB
echo ========================================
echo.
echo This will:
echo 1. Initialize git (if needed)
echo 2. Add all files
echo 3. Commit with message
echo 4. Show you how to push to GitHub
echo.
pause

echo.
echo [1/4] Initializing Git...
git init

echo.
echo [2/4] Adding all files...
git add .

echo.
echo [3/4] Committing files...
git commit -m "Complete Braidly React App - All Dashboards Functional with Bold Theme"

echo.
echo [4/4] Git setup complete!
echo.
echo ========================================
echo   NEXT STEPS TO PUSH TO GITHUB
echo ========================================
echo.
echo 1. Create a new repository on GitHub.com
echo    - Go to: https://github.com/new
echo    - Name it: braidly-app
echo    - Don't initialize with README
echo.
echo 2. Copy the repository URL (it will look like):
echo    https://github.com/YOUR-USERNAME/braidly-app.git
echo.
echo 3. Run these commands (replace with your URL):
echo.
echo    git remote add origin https://github.com/YOUR-USERNAME/braidly-app.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ========================================
echo.
echo Your code is committed locally!
echo Follow the steps above to push to GitHub.
echo.
pause
