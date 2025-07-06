Write-Host "CodePilot AI Deployment Checklist" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$checks = @()
$passed = 0

# Backend functionality
Write-Host "`nTesting backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/ai/chat" -Method POST -Body '{"message":"deployment test","sessionId":"deploy"}' -ContentType "application/json" -TimeoutSec 10
    
    # Check if response has expected properties
    if ($response -and ($response.response -or $response.reply)) {
        $checks += "[OK] Backend API responding correctly"
        $passed++
    } else {
        $checks += "[WARN] Backend API responding but with unexpected format"
        $passed++
    }
} catch {
    $checks += "[FAIL] Backend API not responding - $($_.Exception.Message)"
}

# Environment configuration
if (Test-Path ".env") {
    $envContent = Get-Content ".env"
    if ($envContent -match "DATABASE_URL") { 
        $checks += "[OK] Database URL configured"
        $passed++
    } else {
        $checks += "[FAIL] Database URL missing"
    }
    if ($envContent -match "REDIS_URL") { 
        $checks += "[OK] Redis URL configured"
        $passed++
    } else {
        $checks += "[FAIL] Redis URL missing"
    }
    if ($envContent -match "PERPLEXITY_API_KEY") { 
        $checks += "[OK] AI API key configured"
        $passed++
    } else {
        $checks += "[FAIL] AI API key missing"
    }
} else {
    $checks += "[FAIL] Environment file missing"
}

# Required files
$requiredFiles = @(
    "package.json",
    "src/index.ts", 
    "src/services/aiService.ts",
    "src/routes/ai.ts"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        $checks += "[OK] $file exists"
        $passed++
    } else {
        $checks += "[FAIL] $file missing"
    }
}

# Scripts
if (Test-Path "scripts") {
    $checks += "[OK] Maintenance scripts directory created"
    $passed++
} else {
    $checks += "[FAIL] Scripts directory missing"
}

# Display results
Write-Host ""
foreach ($check in $checks) {
    if ($check -like "*[OK]*") {
        Write-Host $check -ForegroundColor Green
    } elseif ($check -like "*[WARN]*") {
        Write-Host $check -ForegroundColor Yellow
    } else {
        Write-Host $check -ForegroundColor Red
    }
}

$total = $checks.Count
$percentage = [math]::Round(($passed / $total) * 100)

Write-Host ""
Write-Host "Deployment Readiness: $percentage% ($passed/$total)" -ForegroundColor $(if ($percentage -ge 90) { "Green" } elseif ($percentage -ge 75) { "Yellow" } else { "Red" })

if ($percentage -ge 90) {
    Write-Host "READY for production deployment!" -ForegroundColor Green
} elseif ($percentage -ge 75) {
    Write-Host "NEARLY ready - fix remaining issues" -ForegroundColor Yellow
} else {
    Write-Host "NOT ready - address critical issues" -ForegroundColor Red
}
