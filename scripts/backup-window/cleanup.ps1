# DCE System - Backup Cleanup Script
# Xóa backup cũ hơn 7 ngày

param(
    [int]$RetentionDays = 7,

    [switch]$Database,

    [switch]$Application,

    [switch]$Reports,

    [switch]$All
)

Write-Host "=== DCE System - Backup Cleanup ===" -ForegroundColor Green
Write-Host "Thoi gian: $(Get-Date)" -ForegroundColor Yellow
Write-Host "Retention: $RetentionDays days" -ForegroundColor Cyan

# Import backup functions
$dbBackupScript = Join-Path $PSScriptRoot "database-backup.ps1"
$appBackupScript = Join-Path $PSScriptRoot "application-backup.ps1"

if (-not (Test-Path $dbBackupScript)) {
    Write-Host "Error: Database backup script not found: $dbBackupScript" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $appBackupScript)) {
    Write-Host "Error: Application backup script not found: $appBackupScript" -ForegroundColor Red
    exit 1
}

# Import functions (dot source to get functions only)
$dbScriptContent = Get-Content $dbBackupScript -Raw
$appScriptContent = Get-Content $appBackupScript -Raw

# Remove the function calls at the end
$dbScriptContent = $dbScriptContent -replace '(?s)# Execute the backup.*$', ''
$appScriptContent = $appScriptContent -replace '(?s)# Execute the backup.*$', ''

# Execute the modified scripts to load functions
Invoke-Expression $dbScriptContent
Invoke-Expression $appScriptContent

$cutoffDate = (Get-Date).AddDays(-$RetentionDays)
$totalDeleted = 0

try {
    # Database cleanup
    if ($Database -or $All) {
        Write-Host "`n1. Cleaning up database backups..." -ForegroundColor Cyan
        Remove-DCEOldBackups -BackupPath "C:\DceWeb\app\backup\BackupDB" -RetentionDays $RetentionDays
    }

    # Application cleanup
    if ($Application -or $All) {
        Write-Host "`n2. Cleaning up application backups..." -ForegroundColor Cyan
        Remove-DCEOldApplicationBackups -BackupPath "C:\DceWeb\app\backup\BackupApp" -RetentionDays $RetentionDays
    }

    # Backup reports cleanup
    if ($Reports -or $All) {
        Write-Host "`n3. Cleaning up backup reports..." -ForegroundColor Cyan
        $backupReportsPath = "C:\DceWeb\app\logs\backup"
        if (Test-Path $backupReportsPath) {
            $oldReports = Get-ChildItem -Path $backupReportsPath -Filter "*.json" | Where-Object {$_.CreationTime -lt $cutoffDate}

            if ($oldReports) {
                $deletedCount = 0
                foreach ($report in $oldReports) {
                    try {
                        Remove-Item $report.FullName -Force
                        $deletedCount++
                        Write-Host "  Deleted: $($report.Name)" -ForegroundColor Cyan
                    } catch {
                        Write-Host "  Failed to delete: $($report.Name)" -ForegroundColor Red
                    }
                }
                Write-Host "  Deleted $deletedCount old backup reports" -ForegroundColor Green
                $totalDeleted += $deletedCount
            } else {
                Write-Host "  No old backup reports to delete" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  Backup reports directory not found" -ForegroundColor Yellow
        }
    }

} catch {
    Write-Host "❌ Cleanup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Cleanup Summary ===" -ForegroundColor Green
Write-Host "Retention period: $RetentionDays days" -ForegroundColor Cyan
Write-Host "Cutoff date: $cutoffDate" -ForegroundColor Cyan
Write-Host "Total items cleaned: $totalDeleted" -ForegroundColor Green

Write-Host "`n🎉 Backup cleanup completed!" -ForegroundColor Green
