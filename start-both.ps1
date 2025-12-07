# Start Both Frontend and Backend
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   STARTING FULL APPLICATION" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   SERVERS STARTED!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:4000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173`n" -ForegroundColor Yellow
