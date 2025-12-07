# Start Frontend Only
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   STARTING FRONTEND SERVER" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot\frontend
npm run dev
