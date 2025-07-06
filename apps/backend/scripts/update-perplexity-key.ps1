param(
    [Parameter(Mandatory=$true)]
    [string]$NewApiKey
)

Write-Host "?? Updating Perplexity API Key..." -ForegroundColor Cyan

# Backup current .env
Copy-Item ".env" ".env.backup" -Force
Write-Host "? Backed up .env to .env.backup" -ForegroundColor Green

# Update the API key in .env file
$envContent = Get-Content ".env"
$newContent = @()

foreach ($line in $envContent) {
    if ($line -like "*PERPLEXITY_API_KEY*") {
        $newContent += "PERPLEXITY_API_KEY=$NewApiKey"
        Write-Host "? Updated PERPLEXITY_API_KEY" -ForegroundColor Green
    } else {
        $newContent += $line
    }
}

$newContent | Set-Content ".env"

Write-Host ""
Write-Host "?? API Key Updated Successfully!" -ForegroundColor Green
Write-Host "Next: Restart your backend with 'npm run dev'" -ForegroundColor Yellow
Write-Host ""
Write-Host "New .env content:" -ForegroundColor Cyan
Get-Content ".env"
