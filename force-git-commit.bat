@echo off
echo ========================================
echo FORCE GIT COMMIT - IMAGE FIXES
echo ========================================

REM Configure git user
git config --global user.email "braidly@example.com"
git config --global user.name "Braidly Team"

REM Add all changes
echo Adding all changes...
git add -A

REM Commit changes
echo Committing changes...
git commit -m "Fix: Update all image paths to use existing assets in assets/images folder"

REM Push to GitHub
echo Pushing to GitHub...
git push origin main

echo ========================================
echo DONE! All changes committed and pushed
echo ========================================
pause
