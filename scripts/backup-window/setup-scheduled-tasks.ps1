# DCE System - Setup Scheduled Tasks
# Script de tao scheduled tasks cho backup

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('Daily', 'Weekly', 'Both', 'None')]
    [string]$CleanupStrategy = 'Both'
)

Write-Host "=== DCE System - Setup Scheduled Tasks ===" -ForegroundColor Green
Write-Host "Thoi gian: $(Get-Date)" -ForegroundColor Yellow
Write-Host "Cleanup Strategy: $CleanupStrategy" -ForegroundColor Cyan

# Kiem tra quyen admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "Script can chay voi quyen Administrator" -ForegroundColor Red
    Write-Host "Vui long chay PowerShell as Administrator" -ForegroundColor Yellow
    exit 1
}

try {
    # 1. Tao Scheduled Task cho Backup Hang Ngay
    Write-Host "`n1. Tao Scheduled Task cho Backup Hang Ngay..." -ForegroundColor Cyan

    # Quyet dinh co cleanup trong backup hang ngay khong
    $backupArgs = "-ExecutionPolicy Bypass -File `"C:\DceWeb\app\Scripts\backup\run-backup.ps1`" -BackupType All -Compress"
    if ($CleanupStrategy -eq 'Daily' -or $CleanupStrategy -eq 'Both') {
        $backupArgs += " -Cleanup"
        Write-Host "   Backup hang ngay se cleanup sau khi backup" -ForegroundColor Yellow
    } else {
        Write-Host "   Backup hang ngay chi backup, khong cleanup" -ForegroundColor Yellow
    }

    $backupAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument $backupArgs
    $backupTrigger = New-ScheduledTaskTrigger -Daily -At 11pm
    $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

    # Xoa task cu neu ton tai
    Unregister-ScheduledTask -TaskName "DCE-Backup-Daily" -Confirm:$false -ErrorAction SilentlyContinue

    # Tao task moi
    Register-ScheduledTask -TaskName "DCE-Backup-Daily" -Action $backupAction -Trigger $backupTrigger -Principal $principal -Description "DCE System Daily Backup"

    Write-Host "Backup task da duoc tao: DCE-Backup-Daily" -ForegroundColor Green
    Write-Host "   Chay hang ngay luc 11:00 PM" -ForegroundColor Cyan

    # 2. Tao Scheduled Task cho Cleanup Hang Tuan
    if ($CleanupStrategy -eq 'Weekly' -or $CleanupStrategy -eq 'Both') {
        Write-Host "`n2. Tao Scheduled Task cho Cleanup Hang Tuan..." -ForegroundColor Cyan

        $cleanupAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"C:\DceWeb\app\Scripts\backup\cleanup.ps1`" -All"
        $cleanupTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 3am

        # Xoa task cu neu ton tai
        Unregister-ScheduledTask -TaskName "DCE-Backup-Cleanup" -Confirm:$false -ErrorAction SilentlyContinue

        # Tao task moi
        Register-ScheduledTask -TaskName "DCE-Backup-Cleanup" -Action $cleanupAction -Trigger $cleanupTrigger -Principal $principal -Description "DCE System Weekly Backup Cleanup"

        Write-Host "Cleanup task da duoc tao: DCE-Backup-Cleanup" -ForegroundColor Green
        Write-Host "   Chay hang tuan Chu nhat luc 3:00 AM" -ForegroundColor Cyan
    } else {
        Write-Host "`n2. Bo qua tao Cleanup task hang tuan" -ForegroundColor Yellow
    }

    # 3. Hien thi danh sach tasks da tao
    Write-Host "`n3. Danh sach Scheduled Tasks:" -ForegroundColor Cyan

    $tasks = Get-ScheduledTask | Where-Object {$_.TaskName -like "DCE-*"}
    foreach ($task in $tasks) {
        Write-Host "   $($task.TaskName): $($task.State)" -ForegroundColor Yellow
    }

    # 4. Huong dan kiem tra
    Write-Host "`n4. Huong dan kiem tra:" -ForegroundColor Cyan
    Write-Host "   - Mo Task Scheduler: taskschd.msc" -ForegroundColor White
    Write-Host "   - Tim tasks trong thu muc: Task Scheduler Library" -ForegroundColor White
    Write-Host "   - Kiem tra logs trong: Event Viewer > Windows Logs > Application" -ForegroundColor White

    # 5. Test chay task
    Write-Host "`n5. Test chay backup task..." -ForegroundColor Cyan
    Start-ScheduledTask -TaskName "DCE-Backup-Daily"
    Write-Host "Backup task da duoc kich hoat" -ForegroundColor Green

} catch {
    Write-Host "Loi khi tao scheduled tasks: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nSetup Scheduled Tasks hoan tat!" -ForegroundColor Green
Write-Host "Backup system se chay tu dong theo lich da dinh." -ForegroundColor Cyan
