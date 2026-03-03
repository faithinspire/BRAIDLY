Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BRAIDLY REACT APP - QUICK START" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "1. Copy assets to public folder"
Write-Host "2. Install dependencies (if needed)"
Write-Host "3. Start the React development server"
Write-Host ""
Read-Host "Press Enter to continue"

Write-Host ""
Write-Host "[1/3] Copying assets..." -ForegroundColor Green
Copy-Item -Recurse -Force assets public/

Write-Host ""
Write-Host "[2/3] Installing dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "[3/3] Starting React app..." -ForegroundColor Green
Write-Host ""
Write-Host "Browser will open automatically to http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Login with:" -ForegroundColor Cyan
Write-Host "  Email: customer@braidly.com" -ForegroundColor White
Write-Host "  Password: Customer123!" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server when done." -ForegroundColor Yellow
Write-Host ""
npm run dev
