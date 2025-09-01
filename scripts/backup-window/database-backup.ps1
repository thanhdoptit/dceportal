# Parse command line arguments
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('Full', 'Differential', 'Log', 'All')]
    [string]$BackupType = 'Full',

    [string]$DatabaseName = "webdce",

    [string]$BackupPath = "C:\DceWeb\app\backup\BackupDB",

    [switch]$Compress,

    [switch]$Verify,

    [switch]$Cleanup
)

function Start-DCEDatabaseBackup {
    param(
        [Parameter(Mandatory=$true)]
        [ValidateSet('Full', 'Differential', 'Log', 'All')]
        [string]$BackupType = 'Full',

        [string]$DatabaseName = "webdce",  # Default database name

        [string]$BackupPath = "C:\DceWeb\app\backup\BackupDB",

        [switch]$Compress,

        [switch]$Verify,

        [switch]$Cleanup
    )

    Write-Host "Starting database backup..." -ForegroundColor Green

    # Get database password from environment or .env file
    $dbPassword = [Environment]::GetEnvironmentVariable("DB_PASS", "Process")
    if (-not $dbPassword) {
        $dbPassword = [Environment]::GetEnvironmentVariable("DB_PASS", "User")
    }
    if (-not $dbPassword) {
        $dbPassword = [Environment]::GetEnvironmentVariable("DB_PASS", "Machine")
    }
    if (-not $dbPassword) {
        # Try to read from .env file
        $envFile = "C:\DceWeb\app\backend\.env"
        if (Test-Path $envFile) {
            $envContent = Get-Content $envFile
            $dbPasswordLine = $envContent | Where-Object { $_ -match "DB_PASS\s*=" }
            if ($dbPasswordLine) {
                $dbPassword = $dbPasswordLine -replace "DB_PASS\s*=\s*", ""
            }
        }
    }

    if (-not $dbPassword) {
        Write-Host "Error: Database password not found. Please set DB_PASS environment variable or configure in .env file." -ForegroundColor Red
        return $null
    }

    # Create backup directory
    New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupReport = @{
        Timestamp = Get-Date
        Type = $BackupType
        Database = $DatabaseName
        Files = @()
        Success = $false
        Errors = @()
        Duration = 0
    }

    $backupTimer = [System.Diagnostics.Stopwatch]::StartNew()

    try {
        switch ($BackupType) {
            'Full' {
                Write-Host "  Creating full backup..." -ForegroundColor Yellow
                $backupFile = "$BackupPath\${DatabaseName}_FULL_$timestamp.bak"

                $backupQuery = @"
BACKUP DATABASE [$DatabaseName]
TO DISK = '$backupFile'
WITH
    CHECKSUM,
    STATS = 10
"@

                sqlcmd -S "localhost\MSSQLSERVER1" -U sa -P $dbPassword -Q $backupQuery

                if ($LASTEXITCODE -eq 0) {
                    $backupReport.Files += $backupFile
                    Write-Host "  Full backup completed: $backupFile" -ForegroundColor Green
                } else {
                    throw "Full backup failed with exit code: $LASTEXITCODE"
                }
            }

            'Differential' {
                Write-Host "  Creating differential backup..." -ForegroundColor Yellow
                $backupFile = "$BackupPath\${DatabaseName}_DIFF_$timestamp.bak"

                $backupQuery = @"
BACKUP DATABASE [$DatabaseName]
TO DISK = '$backupFile'
WITH
    DIFFERENTIAL,
    CHECKSUM,
    STATS = 10
"@

                sqlcmd -S "localhost\MSSQLSERVER1" -U sa -P $dbPassword -Q $backupQuery

                if ($LASTEXITCODE -eq 0) {
                    $backupReport.Files += $backupFile
                    Write-Host "  Differential backup completed: $backupFile" -ForegroundColor Green
                } else {
                    throw "Differential backup failed with exit code: $LASTEXITCODE"
                }
            }

            'Log' {
                Write-Host "  Creating transaction log backup..." -ForegroundColor Yellow
                $backupFile = "$BackupPath\${DatabaseName}_LOG_$timestamp.trn"

                $backupQuery = @"
BACKUP LOG [$DatabaseName]
TO DISK = '$backupFile'
WITH
    CHECKSUM,
    STATS = 10
"@

                sqlcmd -S "localhost\MSSQLSERVER1" -U sa -P $dbPassword -Q $backupQuery

                if ($LASTEXITCODE -eq 0) {
                    $backupReport.Files += $backupFile
                    Write-Host "  Transaction log backup completed: $backupFile" -ForegroundColor Green
                } else {
                    throw "Transaction log backup failed with exit code: $LASTEXITCODE"
                }
            }

            'All' {
                Write-Host "  Creating all backup types..." -ForegroundColor Yellow

                # Full backup
                Start-DCEDatabaseBackup -BackupType 'Full' -DatabaseName $DatabaseName -BackupPath $BackupPath

                # Differential backup
                Start-DCEDatabaseBackup -BackupType 'Differential' -DatabaseName $DatabaseName -BackupPath $BackupPath

                # Transaction log backup
                Start-DCEDatabaseBackup -BackupType 'Log' -DatabaseName $DatabaseName -BackupPath $BackupPath
            }
        }

        # Verify backup if requested
        if ($Verify) {
            Write-Host "  Verifying backup..." -ForegroundColor Yellow
            foreach ($backupFile in $backupReport.Files) {
                if (Test-Path $backupFile) {
                    $verifyQuery = "RESTORE VERIFYONLY FROM DISK = '$backupFile'"
                    sqlcmd -S "localhost\MSSQLSERVER1" -U sa -P $dbPassword -Q $verifyQuery

                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "  Backup verification passed: $backupFile" -ForegroundColor Green
                    } else {
                        $backupReport.Errors += "Verification failed for: $backupFile"
                        Write-Host "  Backup verification failed: $backupFile" -ForegroundColor Red
                    }
                } else {
                    $backupReport.Errors += "Backup file not found: $backupFile"
                    Write-Host "  Backup file not found: $backupFile" -ForegroundColor Red
                }
            }
        }

        # Cleanup old backups (always run for 7-day retention)
        Write-Host "  Cleaning up old backups..." -ForegroundColor Yellow
        Remove-DCEOldBackups -BackupPath $BackupPath -RetentionDays 7

        $backupReport.Success = ($backupReport.Errors.Count -eq 0)

    } catch {
        $backupReport.Errors += $_.Exception.Message
        Write-Host "  Backup failed: $($_.Exception.Message)" -ForegroundColor Red
    } finally {
        $backupTimer.Stop()
        $backupReport.Duration = $backupTimer.Elapsed.TotalSeconds
    }

    # Save backup report
    $reportFile = "C:\DceWeb\app\backup\BackupLogs\db-backup-$timestamp.json"
    New-Item -ItemType Directory -Path "C:\DceWeb\app\backup\BackupLogs" -Force | Out-Null
    $backupReport | ConvertTo-Json -Depth 10 | Out-File $reportFile -Encoding UTF8

    return $backupReport
}

function Remove-DCEOldBackups {
    param(
        [string]$BackupPath,
        [int]$RetentionDays = 7
    )

    Write-Host "Removing backups older than $RetentionDays days..." -ForegroundColor Yellow

    $cutoffDate = (Get-Date).AddDays(-$RetentionDays)
    $oldBackups = Get-ChildItem -Path $BackupPath -Filter "*.bak" | Where-Object {$_.CreationTime -lt $cutoffDate}

    if ($oldBackups) {
        $deletedCount = 0
        foreach ($backup in $oldBackups) {
            try {
                Remove-Item $backup.FullName -Force
                $deletedCount++
                Write-Host "  Deleted: $($backup.Name)" -ForegroundColor Cyan
            } catch {
                Write-Host "  Failed to delete: $($backup.Name)" -ForegroundColor Red
            }
        }
        Write-Host "  Deleted $deletedCount old backup files" -ForegroundColor Green
    } else {
        Write-Host "  No old backups to delete" -ForegroundColor Yellow
    }
}

# Functions available:
# - Start-DCEDatabaseBackup
# - Remove-DCEOldBackups
# - Test-DCEDatabaseRestore

# Execute the backup
Start-DCEDatabaseBackup -BackupType $BackupType -DatabaseName $DatabaseName -BackupPath $BackupPath -Compress:$Compress -Verify:$Verify -Cleanup:$Cleanup
