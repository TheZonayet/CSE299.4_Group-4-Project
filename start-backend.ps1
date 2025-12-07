# Start Backend Only
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   STARTING BACKEND SERVER" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot\backend
npm start
