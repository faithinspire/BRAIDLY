# PowerShell script to update all logo references in HTML files
# This replaces braidly-logo.svg with the user's provided image

$oldLogo = "braidly-logo.svg"
$newLogo = "WhatsApp Image 2026-02-25 at 3.18.01 AM.jpeg"

# Get all HTML files
$htmlFiles = Get-ChildItem -Path . -Filter *.html -Recurse | Where-Object { $_.FullName -notlike "*\.git\*" }

$updatedCount = 0
$totalFiles = 0

Write-Host "Starting logo update process..." -ForegroundColor Cyan
Write-Host "Old logo: $oldLogo" -ForegroundColor Yellow
Write-Host "New logo: $newLogo" -ForegroundColor Green
Write-Host ""

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    if ($content -match $oldLogo) {
        $totalFiles++
        Write-Host "Updating: $($file.Name)" -ForegroundColor Yellow
        
        # Replace the logo path
        $newContent = $content -replace $oldLogo, $newLogo
        
        # Add transparent background style if not present
        $newContent = $newContent -replace '(<img[^>]*src="[^"]*WhatsApp Image[^"]*"[^>]*)(>)', '$1 style="background: transparent;">$2'
        $newContent = $newContent -replace 'style="([^"]*)"[^>]*style="background: transparent;"', 'style="$1 background: transparent;"'
        
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        $updatedCount++
        Write-Host "  ✓ Updated successfully" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Update Complete!" -ForegroundColor Green
Write-Host "Files scanned: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "Files with old logo: $totalFiles" -ForegroundColor Yellow
Write-Host "Files updated: $updatedCount" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Clear browser cache (Ctrl+Shift+Delete)" -ForegroundColor White
Write-Host "2. Open FINAL_UPDATE_SUMMARY.html to verify changes" -ForegroundColor White
Write-Host "3. Test the landing page (index.html)" -ForegroundColor White
