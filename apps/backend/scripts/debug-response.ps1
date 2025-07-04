Write-Host "CodePilot AI Response Debug Tool" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

try {
    Write-Host "`nMaking test request..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/ai/chat" -Method POST -Body '{"message":"debug test","sessionId":"debug"}' -ContentType "application/json" -TimeoutSec 10
    
    Write-Host "`n? Request successful!" -ForegroundColor Green
    Write-Host "Response Type: $($response.GetType().Name)" -ForegroundColor Cyan
    
    Write-Host "`nResponse Properties:" -ForegroundColor Yellow
    $response.PSObject.Properties | ForEach-Object {
        Write-Host "  $($_.Name): $($_.TypeNameOfValue)" -ForegroundColor White
    }
    
    Write-Host "`nFull Response Structure:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray
    
    Write-Host "`nTesting Response Access:" -ForegroundColor Yellow
    if ($response.response) {
        $responseText = $response.response
        $preview = if ($responseText.Length -gt 50) { $responseText.Substring(0,50) + "..." } else { $responseText }
        Write-Host "? response property exists: $preview" -ForegroundColor Green
    } elseif ($response.reply) {
        $responseText = $response.reply
        $preview = if ($responseText.Length -gt 50) { $responseText.Substring(0,50) + "..." } else { $responseText }
        Write-Host "? reply property exists: $preview" -ForegroundColor Green
    } else {
        Write-Host "? Neither 'response' nor 'reply' property found" -ForegroundColor Red
        Write-Host "Available properties: $($response.PSObject.Properties.Name -join ', ')" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "`n? Request failed:" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}
