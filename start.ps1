# Asure Application Launcher
# Run this script to start all services

Write-Host "🚀 Starting Asure Application..." -ForegroundColor Cyan
Write-Host ""

# Check MongoDB Service
Write-Host "📊 Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service MongoDB* -ErrorAction SilentlyContinue

if ($mongoService -and $mongoService.Status -eq 'Running') {
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB service not found or not running" -ForegroundColor Red
    Write-Host "   Attempting to start MongoDB service..." -ForegroundColor Yellow
    try {
        Start-Service MongoDB -ErrorAction Stop
        Write-Host "✅ MongoDB started successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Could not start MongoDB service" -ForegroundColor Red
        Write-Host "   Please start MongoDB manually or use MongoDB Atlas" -ForegroundColor Yellow
    }
}

Start-Sleep -Seconds 1
Write-Host ""

# Start Backend
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PSScriptRoot
    Set-Location server
    npm run dev
}

Start-Sleep -Seconds 3

# Check if backend started
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/ping" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    if ($response.Content -eq "pong") {
        Write-Host "✅ Backend server running on http://localhost:4000" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Backend may still be starting..." -ForegroundColor Yellow
}

Write-Host ""

# Start Frontend
Write-Host "🎨 Starting Frontend..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PSScriptRoot
    npm run dev
}

Start-Sleep -Seconds 3
Write-Host "✅ Frontend server running on http://localhost:5173" -ForegroundColor Green

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 All services started successfully!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "🔌 Backend:   http://localhost:4000" -ForegroundColor White
Write-Host "💾 MongoDB:   mongodb://localhost:27017" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Open browser
Write-Host "🌐 Opening application in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

# Keep script running and monitor jobs
try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        # Check if jobs are still running
        if ($backendJob.State -ne 'Running' -or $frontendJob.State -ne 'Running') {
            Write-Host "⚠️  One or more services stopped unexpectedly" -ForegroundColor Red
            break
        }
    }
} finally {
    # Cleanup
    Write-Host ""
    Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
    
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
    
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
