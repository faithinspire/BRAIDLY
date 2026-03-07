#!/usr/bin/env pwsh

Write-Host "Starting Git commit process..." -ForegroundColor Green

# Configure git
git config user.email "developer@braidly.app"
git config user.name "Braidly Developer"

# Add all changes
Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "feat: implement admin dashboard pages (analytics, users, settings) and fix netlify deployment"

# Push
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "Done! All changes pushed to GitHub." -ForegroundColor Green
