# DCE System - Main Backup Script
# Script chính để chạy tất cả backup

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('Database', 'Application', 'All')]
    [string]$BackupType = 'All',

    [Parameter(Mandatory=$false)]
    [ValidateSet('Full', 'Differential', 'Log')]
    [string]$DatabaseBackupType = 'Full',

    [switch]$Verify,

    [switch]$Compress,

    [switch]$Cleanup
)

Write-Host "=== DCE System - Main Backup Script ===" -ForegroundColor Green
Write-Host "Thoi gian: $(Get-Date)" -ForegroundColor Yellow
Write-Host "Backup Type: $BackupType" -ForegroundColor Cyan

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

# Import functions
. $dbBackupScript
. $appBackupScript

$overallSuccess = $true
$backupResults = @()

try {
    # Database Backup
    if ($BackupType -eq 'Database' -or $BackupType -eq 'All') {
        Write-Host "`n1. Running Database Backup..." -ForegroundColor Cyan
        Write-Host "Database Backup Type: $DatabaseBackupType" -ForegroundColor Yellow

        $dbResult = Start-DCEDatabaseBackup -BackupType $DatabaseBackupType -Verify:$Verify

        if ($dbResult -and $dbResult.Success) {
            Write-Host "✅ Database backup completed successfully" -ForegroundColor Green
            $backupResults += @{
                Type = "Database"
                Success = $true
                Files = $dbResult.Files
                Duration = $dbResult.Duration
            }
        } else {
            Write-Host "❌ Database backup failed" -ForegroundColor Red
            $overallSuccess = $false
            $backupResults += @{
                Type = "Database"
                Success = $false
                Errors = $dbResult.Errors
            }
        }
    }

    # Application Backup
    if ($BackupType -eq 'Application' -or $BackupType -eq 'All') {
        Write-Host "`n2. Running Application Backup..." -ForegroundColor Cyan

        $appResult = Start-DCEApplicationBackup -Compress:$Compress

        if ($appResult -and $appResult.Success) {
            Write-Host "✅ Application backup completed successfully" -ForegroundColor Green
            $backupResults += @{
                Type = "Application"
                Success = $true
                Files = $appResult.Files
                Size = $appResult.Size
                Duration = $appResult.Duration
            }
        } else {
            Write-Host "❌ Application backup failed" -ForegroundColor Red
            $overallSuccess = $false
            $backupResults += @{
                Type = "Application"
                Success = $false
                Errors = $appResult.Errors
            }
        }
    }

    # Cleanup if requested
    if ($Cleanup) {
        Write-Host "`n3. Running Cleanup..." -ForegroundColor Cyan

        # Database cleanup
        if ($BackupType -eq 'Database' -or $BackupType -eq 'All') {
            Write-Host "  Cleaning up old database backups..." -ForegroundColor Yellow
            Remove-DCEOldBackups -BackupPath "C:\DceWeb\app\backup\BackupDB" -RetentionDays 7
        }

        # Application cleanup
        if ($BackupType -eq 'Application' -or $BackupType -eq 'All') {
            Write-Host "  Cleaning up old application backups..." -ForegroundColor Yellow
            Remove-DCEOldApplicationBackups -BackupPath "C:\DceWeb\app\backup\BackupApp" -RetentionDays 7
        }

        # Cleanup backup reports
        Write-Host "  Cleaning up old backup reports..." -ForegroundColor Yellow
        $backupReportsPath = "C:\DceWeb\app\backup\BackupLogs"
        if (Test-Path $backupReportsPath) {
            $cutoffDate = (Get-Date).AddDays(-7)
            $oldReports = Get-ChildItem -Path $backupReportsPath -Filter "*.json" | Where-Object {$_.CreationTime -lt $cutoffDate}

            if ($oldReports) {
                $deletedCount = 0
                foreach ($report in $oldReports) {
                    try {
                        Remove-Item $report.FullName -Force
                        $deletedCount++
                    } catch {
                        Write-Host "    Failed to delete: $($report.Name)" -ForegroundColor Red
                    }
                }
                Write-Host "    Deleted $deletedCount old backup reports" -ForegroundColor Green
            } else {
                Write-Host "    No old backup reports to delete" -ForegroundColor Yellow
            }
        }
    }

} catch {
    Write-Host "❌ Backup process failed: $($_.Exception.Message)" -ForegroundColor Red
    $overallSuccess = $false
}

# Generate summary report
Write-Host "`n=== Backup Summary ===" -ForegroundColor Green

foreach ($result in $backupResults) {
    if ($result.Success) {
        Write-Host "✅ $($result.Type) Backup: SUCCESS" -ForegroundColor Green
        if ($result.Files) {
            Write-Host "   Files: $($result.Files.Count)" -ForegroundColor Cyan
        }
        if ($result.Size) {
            Write-Host "   Size: $([math]::Round($result.Size / 1MB, 2)) MB" -ForegroundColor Cyan
        }
        if ($result.Duration) {
            Write-Host "   Duration: $([math]::Round($result.Duration, 2)) seconds" -ForegroundColor Cyan
        }
    } else {
        Write-Host "❌ $($result.Type) Backup: FAILED" -ForegroundColor Red
        if ($result.Errors) {
            foreach ($error in $result.Errors) {
                Write-Host "   Error: $error" -ForegroundColor Red
            }
        }
    }
}

# Save overall report
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$overallReport = @{
    Timestamp = Get-Date
    BackupType = $BackupType
    OverallSuccess = $overallSuccess
    Results = $backupResults
    Parameters = @{
        DatabaseBackupType = $DatabaseBackupType
        Verify = $Verify
        Compress = $Compress
        Cleanup = $Cleanup
    }
}

if ($overallSuccess) {
    Write-Host "`n🎉 All backups completed successfully!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️ Some backups failed. Check the report for details." -ForegroundColor Yellow
    exit 1
}
