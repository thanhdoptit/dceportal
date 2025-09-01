# DCE System Maintenance Script
Write-Host "DCE System Maintenance - 08/24/2025 16:25:47" -ForegroundColor Green

# Health check
Write-Host "Running health check..." -ForegroundColor Yellow
& "D:\Project\app\scripts\test-monitoring.ps1"

# Backup check
Write-Host "Running backup check..." -ForegroundColor Yellow
& "D:\Project\app\scripts\smart-backup.ps1"

# Cleanup old logs (keep 30 days)
Write-Host "Cleaning up old logs..." -ForegroundColor Yellow
$oldLogs = Get-ChildItem "D:\Project\app\logs" -Recurse -File | Where-Object {$_.CreationTime -lt (Get-Date).AddDays(-30)}
if ($oldLogs) {
    $oldLogs | Remove-Item -Force
    Write-Host "Cleaned up $($oldLogs.Count) old log files" -ForegroundColor Green
}

Write-Host "Maintenance completed" -ForegroundColor Green
