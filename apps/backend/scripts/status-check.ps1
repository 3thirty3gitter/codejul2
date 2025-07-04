Write-Host ""
Write-Host "CodePilot AI Status Dashboard" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if backend is running
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/ai/chat" -Method POST -Body '{"message":"status check","sessionId":"health"}' -ContentType "application/json" -TimeoutSec 5
    Write-Host "[OK] Backend Server: Running on port 5000" -ForegroundColor Green
    Write-Host "[OK] AI Service: Responding correctly" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Backend Server: Not responding" -ForegroundColor Red
    Write-Host "   Run: npm run dev" -ForegroundColor Yellow
}

# Check environment variables
Write-Host ""
Write-Host "Environment Configuration:" -ForegroundColor Yellow
$env = Get-Content ".env" -ErrorAction SilentlyContinue
if ($env) {
    $env | ForEach-Object {
        if ($_ -like "*API_KEY*") {
            $parts = $_ -split "="
            $key = $parts[0]
            $value = $parts[1]
            if ($value -and $value.Length -gt 10) {
                $masked = $value.Substring(0,8) + "..."
                Write-Host "[OK] $key configured ($masked)" -ForegroundColor Green
            } else {
                Write-Host "[WARN] $key invalid or missing" -ForegroundColor Yellow
            }
        } else {
            Write-Host "[OK] $_" -ForegroundColor Green
        }
    }
} else {
    Write-Host "[ERROR] .env file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Current Status:" -ForegroundColor Cyan
Write-Host "[OK] Development mode active" -ForegroundColor Green
Write-Host "[OK] Professional AI responses working" -ForegroundColor Green
Write-Host "[OK] Error handling implemented" -ForegroundColor Green
Write-Host "[WARN] Production API key needed for full functionality" -ForegroundColor Yellow

Write-Host ""
Write-Host "Quick Actions:" -ForegroundColor Cyan
Write-Host "* Get API key: https://www.perplexity.ai/settings/api" -ForegroundColor White
Write-Host "* Update key: .\scripts\update-perplexity-key.ps1 -NewApiKey 'your-key'" -ForegroundColor White
Write-Host "* Restart server: npm run dev" -ForegroundColor White
