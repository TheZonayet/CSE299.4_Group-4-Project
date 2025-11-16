# ASURE Application Startup Script
Write-Host "🚀 Starting ASURE Application..." -ForegroundColor Cyan

# Check if MongoDB is running
Write-Host "`n📊 Checking MongoDB status..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue

if ($null -eq $mongoProcess) {
    Write-Host "⚠️  MongoDB is not running!" -ForegroundColor Red
    Write-Host "Please start MongoDB first:" -ForegroundColor Yellow
    Write-Host "  1. Run as Administrator: Start-Service MongoDB" -ForegroundColor White
    Write-Host "  2. Or manually: mongod --dbpath C:\data\db" -ForegroundColor White
    Write-Host "`nPress any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "✅ MongoDB is running" -ForegroundColor Green

# Check if node_modules exist
Write-Host "`n📦 Checking dependencies..." -ForegroundColor Yellow

if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

if (-Not (Test-Path "server/node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location server
    npm install
    Pop-Location
}

Write-Host "✅ All dependencies installed" -ForegroundColor Green

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "`n⚠️  Creating .env file..." -ForegroundColor Yellow
    "VITE_API_BASE=http://localhost:4000" | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created" -ForegroundColor Green
}

# Start the servers
Write-Host "`n🚀 Starting servers..." -ForegroundColor Cyan
Write-Host "   Backend will run on: http://localhost:4000" -ForegroundColor White
Write-Host "   Frontend will run on: http://localhost:5173" -ForegroundColor White
Write-Host "`n📝 Opening browser in 5 seconds..." -ForegroundColor Yellow
Write-Host "   Press Ctrl+C in any terminal to stop the servers" -ForegroundColor Gray

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Cyan; npm start"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in current window
Write-Host "`n🎨 Frontend Server Starting..." -ForegroundColor Cyan

# Open browser after delay
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 5
    Start-Process "http://localhost:5173"
} | Out-Null

# Start frontend dev server
npm run dev
