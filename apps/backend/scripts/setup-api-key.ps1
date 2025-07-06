Write-Host "Perplexity API Key Setup Guide" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Current Status: API Key Invalid/Expired" -ForegroundColor Red
Write-Host ""
Write-Host "Steps to Get New API Key:" -ForegroundColor Yellow
Write-Host "1. Visit: https://www.perplexity.ai/settings/api" -ForegroundColor White
Write-Host "2. Sign up or log in to your account" -ForegroundColor White
Write-Host "3. Click 'Generate API Key'" -ForegroundColor White
Write-Host "4. Copy the new key (should start with 'pplx-')" -ForegroundColor White
Write-Host ""
Write-Host "Update Your Environment:" -ForegroundColor Yellow
Write-Host "5. Replace the key in your .env file:" -ForegroundColor White
Write-Host "   PERPLEXITY_API_KEY=your_new_key_here" -ForegroundColor Green
Write-Host ""
Write-Host "6. Restart your backend:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "Alternative:" -ForegroundColor Yellow
Write-Host "Your app works perfectly in development mode!" -ForegroundColor Green
Write-Host "Users get helpful responses while you fix the API." -ForegroundColor Green
Write-Host ""
Write-Host "Current .env file:" -ForegroundColor Cyan
$envContent = Get-Content ".env" | Select-String "PERPLEXITY"
Write-Host $envContent -ForegroundColor Gray
