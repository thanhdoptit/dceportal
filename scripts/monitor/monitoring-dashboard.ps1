# DCE System - Monitoring Dashboard
# Hiển thị tổng quan hệ thống

Write-Host "=== DCE System Dashboard ===" -ForegroundColor Green
Write-Host "Thoi gian: $(Get-Date)" -ForegroundColor Yellow

# System Resources
$cpu = (Get-WmiObject -Class Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average
$memory = Get-WmiObject -Class Win32_OperatingSystem
$memoryUsage = [math]::Round((($memory.TotalVisibleMemorySize - $memory.FreePhysicalMemory) / $memory.TotalVisibleMemorySize) * 100, 2)
$disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
$diskFree = [math]::Round($disk.FreeSpace / 1GB, 2)

Write-Host "`nSystem Resources:" -ForegroundColor Cyan
Write-Host "CPU Usage: $cpu%" -ForegroundColor $(if($cpu -lt 80) { 'Green' } else { 'Red' })
Write-Host "Memory Usage: $memoryUsage%" -ForegroundColor $(if($memoryUsage -lt 90) { 'Green' } else { 'Red' })
Write-Host "Disk Free: $diskFree GB" -ForegroundColor $(if($diskFree -gt 10) { 'Green' } else { 'Red' })

# Database Status
$sqlService = Get-Service -Name "*SQL*" -ErrorAction SilentlyContinue
Write-Host "`nDatabase Status:" -ForegroundColor Cyan
if ($sqlService) {
    Write-Host "SQL Server: $($sqlService.Status)" -ForegroundColor $(if($sqlService.Status -eq 'Running') { 'Green' } else { 'Red' })
} else {
    Write-Host "SQL Server: Not Found" -ForegroundColor Red
}

# Port Status
Write-Host "`nPort Status:" -ForegroundColor Cyan
$ports = @(1433, 5000, 3000)
foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue -InformationLevel Quiet
    $status = if ($connection) { "Open" } else { "Closed" }
    $color = if ($connection) { "Green" } else { "Red" }
    Write-Host "Port $port`: $status" -ForegroundColor $color
}

# Backup Status
$latestDbBackup = Get-ChildItem "C:\DceWeb\app\backup\BackupDB\" -ErrorAction SilentlyContinue | Sort-Object CreationTime -Descending | Select-Object -First 1
$latestAppBackup = Get-ChildItem "C:\DceWeb\app\backup\BackupApp\" -ErrorAction SilentlyContinue | Sort-Object CreationTime -Descending | Select-Object -First 1

Write-Host "`nBackup Status:" -ForegroundColor Cyan
if ($latestDbBackup) {
    $dbBackupAge = (Get-Date) - $latestDbBackup.CreationTime
    $dbBackupSize = [math]::Round($latestDbBackup.Length / 1MB, 2)
    Write-Host "Latest DB Backup: $($latestDbBackup.Name)" -ForegroundColor Green
    Write-Host "  Age: $([math]::Round($dbBackupAge.TotalHours, 1)) hours ago" -ForegroundColor $(if($dbBackupAge.TotalHours -lt 24) { 'Green' } else { 'Yellow' })
    Write-Host "  Size: $dbBackupSize MB" -ForegroundColor Cyan
} else {
    Write-Host "No database backup found" -ForegroundColor Red
}

if ($latestAppBackup) {
    $appBackupAge = (Get-Date) - $latestAppBackup.CreationTime
    $appBackupSize = [math]::Round($latestAppBackup.Length / 1MB, 2)
    Write-Host "Latest App Backup: $($latestAppBackup.Name)" -ForegroundColor Green
    Write-Host "  Age: $([math]::Round($appBackupAge.TotalHours, 1)) hours ago" -ForegroundColor $(if($appBackupAge.TotalHours -lt 24) { 'Green' } else { 'Yellow' })
    Write-Host "  Size: $appBackupSize MB" -ForegroundColor Cyan
} else {
    Write-Host "No application backup found" -ForegroundColor Red
}

# Application Health
Write-Host "`nApplication Health:" -ForegroundColor Cyan
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Backend: $($backendResponse.StatusCode)" -ForegroundColor $(if($backendResponse.StatusCode -eq 200) { 'Green' } else { 'Red' })
} catch {
    Write-Host "Backend: Connection Failed" -ForegroundColor Red
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Frontend: $($frontendResponse.StatusCode)" -ForegroundColor $(if($frontendResponse.StatusCode -eq 200) { 'Green' } else { 'Red' })
} catch {
    Write-Host "Frontend: Connection Failed" -ForegroundColor Red
}

# System Summary
Write-Host "`nSystem Summary:" -ForegroundColor Cyan
$allGood = $true

if ($cpu -gt 80) { $allGood = $false; Write-Host "⚠️  CPU usage is high" -ForegroundColor Yellow }
if ($memoryUsage -gt 90) { $allGood = $false; Write-Host "⚠️  Memory usage is high" -ForegroundColor Yellow }
if ($diskFree -lt 10) { $allGood = $false; Write-Host "⚠️  Low disk space" -ForegroundColor Yellow }
if (-not $sqlService -or $sqlService.Status -ne 'Running') { $allGood = $false; Write-Host "⚠️  SQL Server not running" -ForegroundColor Yellow }
if (-not $latestDbBackup -or $dbBackupAge.TotalHours -gt 168) { $allGood = $false; Write-Host "⚠️  Database backup is old (>7 days)" -ForegroundColor Yellow }
if (-not $latestAppBackup -or $appBackupAge.TotalHours -gt 168) { $allGood = $false; Write-Host "⚠️  Application backup is old (>7 days)" -ForegroundColor Yellow }

if ($allGood) {
    Write-Host "✅ All systems operational" -ForegroundColor Green
} else {
    Write-Host "❌ Some issues detected" -ForegroundColor Red
}

Write-Host "`n=== Dashboard Completed ===" -ForegroundColor Green
