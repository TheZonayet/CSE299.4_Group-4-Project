# Gemini AI Setup Script
# This script helps you configure the Gemini API key for ASURE

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ASURE - Gemini AI Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
$envPath = ".\server\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "Error: .env file not found at $envPath" -ForegroundColor Red
    Write-Host "Please create the .env file first!" -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Get your Gemini API Key" -ForegroundColor Green
Write-Host "---------------------------------------"
Write-Host "1. Visit: https://makersuite.google.com/app/apikey" -ForegroundColor Yellow
Write-Host "2. Sign in with your Google account"
Write-Host "3. Click 'Create API Key'"
Write-Host "4. Copy your API key"
Write-Host ""

# Prompt for API key
$apiKey = Read-Host "Enter your Gemini API Key (or press Enter to skip)"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host ""
    Write-Host "Skipped API key configuration." -ForegroundColor Yellow
    Write-Host "You can manually edit server/.env and add:" -ForegroundColor Yellow
    Write-Host "GEMINI_API_KEY=your_api_key_here" -ForegroundColor Cyan
    exit 0
}

# Validate API key format (basic check)
if ($apiKey.Length -lt 30) {
    Write-Host ""
    Write-Host "Warning: API key seems too short. Please verify it's correct." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Updating .env file..." -ForegroundColor Green
Write-Host "---------------------------------------"

try {
    # Read .env content
    $envContent = Get-Content $envPath -Raw
    
    # Check if GEMINI_API_KEY already exists
    if ($envContent -match "GEMINI_API_KEY=") {
        # Replace existing key
        $envContent = $envContent -replace "GEMINI_API_KEY=.*", "GEMINI_API_KEY=$apiKey"
        Write-Host "✓ Updated existing GEMINI_API_KEY" -ForegroundColor Green
    }
    else {
        # Add new key
        $envContent += "`nGEMINI_API_KEY=$apiKey`n"
        Write-Host "✓ Added GEMINI_API_KEY to .env" -ForegroundColor Green
    }
    
    # Write back to file
    Set-Content -Path $envPath -Value $envContent -NoNewline
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   Configuration Complete! ✓" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart the server: cd server; node index.js" -ForegroundColor White
    Write-Host "2. Test AI features in the application" -ForegroundColor White
    Write-Host ""
    Write-Host "Documentation: GEMINI_AI_GUIDE.md" -ForegroundColor Cyan
    Write-Host ""
    
}
catch {
    Write-Host ""
    Write-Host "Error: Failed to update .env file" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Please manually add this line to server/.env:" -ForegroundColor Yellow
    Write-Host "GEMINI_API_KEY=$apiKey" -ForegroundColor Cyan
    exit 1
}
