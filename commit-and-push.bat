@echo off
echo Committing changes to GitHub...
git add .
git commit -m "feat: implement admin dashboard pages (analytics, users, settings) and fix netlify deployment"
git push origin main
echo Done! Changes pushed to GitHub.
pause
