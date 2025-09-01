# Parse command line arguments
param(
    [string]$BackupPath = "C:\DceWeb\app\backup\BackupApp",

    [switch]$IncludeLogs,

    [switch]$IncludeUploads,

    [switch]$IncludeConfig,

    [switch]$Compress,

    [switch]$Cleanup
)

function Start-DCEApplicationBackup {
    param(
        [string]$BackupPath = "C:\DceWeb\app\backup\BackupApp",

        [switch]$IncludeLogs,

        [switch]$IncludeUploads,

        [switch]$IncludeConfig,

        [switch]$Compress,

        [switch]$Cleanup
    )

    Write-Host "Starting smart application backup..." -ForegroundColor Green

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupReport = @{
        Timestamp = Get-Date
        Type = "Application"
        Files = @()
        Success = $false
        Errors = @()
        Duration = 0
        Size = 0
    }

    $backupTimer = [System.Diagnostics.Stopwatch]::StartNew()

    try {
        # Create backup directory
        $backupDir = "$BackupPath\BackupAPP-$timestamp"
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

        # Smart backup - only essential files and directories
        Write-Host "  Backing up essential application files..." -ForegroundColor Yellow

        $essentialItems = @(
            "backend\src",
            "backend\package.json",
            "backend\package-lock.json",
            "frontend\src",
            "frontend\package.json",
            "frontend\package-lock.json",
            "frontend\vite.config.js",
            "frontend\index.html",
            "scripts",
            "uploads"
        )

        $backedUpCount = 0
        foreach ($item in $essentialItems) {
            $sourcePath = "C:\DceWeb\app\$item"
            $destPath = "$backupDir\$item"

            if (Test-Path $sourcePath) {
                # Create destination directory
                $destDir = Split-Path $destPath -Parent
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null

                if (Test-Path $sourcePath -PathType Leaf) {
                    # File
                    Copy-Item -Path $sourcePath -Destination $destPath -Force
                    $backupReport.Files += $destPath
                    Write-Host "    Backed up: $item" -ForegroundColor Green
                } else {
                    # Directory
                    Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
                    $backupReport.Files += $destPath
                    Write-Host "    Backed up: $item" -ForegroundColor Green
                }
                $backedUpCount++
            } else {
                Write-Host "    Not found: $item" -ForegroundColor Yellow
            }
        }

        # Backup configuration files
        if ($IncludeConfig) {
            Write-Host "  Backing up configuration files..." -ForegroundColor Yellow

            $configFiles = @(
                "backend\.env",
                "README.md",
                "config\*"
            )

            foreach ($config in $configFiles) {
                $sourcePath = "C:\DceWeb\app\$config"
                $destPath = "$backupDir\config\$config"

                if (Test-Path $sourcePath) {
                    $destDir = Split-Path $destPath -Parent
                    New-Item -ItemType Directory -Path $destDir -Force | Out-Null

                    Copy-Item -Path $sourcePath -Destination $destPath -Recurse -Force
                    $backupReport.Files += $destPath
                    Write-Host "    Backed up config: $config" -ForegroundColor Green
                }
            }
        }

        # Backup uploads if requested
        if ($IncludeUploads) {
            Write-Host "  Backing up uploads..." -ForegroundColor Yellow
            $uploadsSource = "C:\DceWeb\app\uploads"
            $uploadsBackup = "$backupDir\uploads"

            if (Test-Path $uploadsSource) {
                $robocopyCmd = "robocopy `"$uploadSource`" `"$uploadBackup`" /MIR /Z /MT:64 /R:2 /W:5 /TEE"
                Write-Host "Executing: $robocopyCmd"
                cmd.exe /c $robocopyCmd
                $backupReport.Files += $uploadsBackup
                Write-Host "  Uploads backup completed" -ForegroundColor Green
            } else {
                Write-Host "  Uploads directory not found" -ForegroundColor Yellow
            }
        }

        # Backup logs if requested
        if ($IncludeLogs) {
            Write-Host "  Backing up logs..." -ForegroundColor Yellow
            $logsSource = "C:\DceWeb\app\logs"
            $logsBackup = "$backupDir\logs"

            if (Test-Path $logsSource) {
                Copy-Item -Path $logsSource -Destination $logsBackup -Recurse -Force
                $backupReport.Files += $logsBackup
                Write-Host "  Logs backup completed" -ForegroundColor Green
            } else {
                Write-Host "  Logs directory not found" -ForegroundColor Yellow
            }
        }

        # Create backup manifest
        $manifest = @{
            Timestamp = Get-Date
            Items = $backupReport.Files
            Count = $backedUpCount
            Size = 0
        }

        # Calculate total size
        $totalSize = 0
        foreach ($file in $backupReport.Files) {
            if (Test-Path $file -PathType Leaf) {
                $totalSize += (Get-Item $file).Length
            } else {
                $totalSize += (Get-ChildItem $file -Recurse -File | Measure-Object -Property Length -Sum).Sum
            }
        }

        $manifest.Size = $totalSize
        $backupReport.Size = $totalSize

        # Save manifest
        $manifestFile = "$backupDir\backup-manifest.json"
        $manifest | ConvertTo-Json -Depth 10 | Out-File $manifestFile -Encoding UTF8

        Write-Host "  Smart application backup completed: $backupDir" -ForegroundColor Green
        Write-Host "  Backup size: $([math]::Round($totalSize / 1MB, 2)) MB" -ForegroundColor Cyan
        Write-Host "  Items backed up: $backedUpCount" -ForegroundColor Cyan

        # Always compress backup
        Write-Host "  Compressing backup..." -ForegroundColor Yellow
        # $zipFile = "$BackupPath\BackupApp-$timestamp.zip"
# Đặt path cho file zip
        $zipFile = "$BackupPath\BackupApp-$timestamp.7z"

try {
Write-Host "Compressing backup using 7-Zip..." -ForegroundColor Yellow

# Đường dẫn 7-Zip (đảm bảo đã cài 7zip hoặc copy 7za.exe vào PATH)
$sevenZip = "C:\Program Files\7-Zip\7z.exe"

# Nếu chưa có thư mục chứa file zip thì tạo
if (!(Test-Path $BackupPath)) {
New-Item -ItemType Directory -Path $BackupPath | Out-Null
}

# Thực hiện nén với mức độ cao nhất
& "$sevenZip" a -t7z -mx=9 -mmt=on "$zipFile" "$backupDir\*" | Out-Null

Write-Host "Backup compressed: $zipFile" -ForegroundColor Green

# Xóa thư mục chưa nén
Remove-Item $backupDir -Recurse -Force

# Tính kích thước file nén
$compressedSize = (Get-Item $zipFile).Length
$compressionRatio = [math]::Round(($totalSize - $compressedSize) / $totalSize * 100, 2)

Write-Host "Compressed size: $([math]::Round($compressedSize / 1MB, 2)) MB" -ForegroundColor Cyan
Write-Host "Compression ratio: $compressionRatio%" -ForegroundColor Cyan

$backupReport.Files = @($zipFile)
$backupReport.Size = $compressedSize
$backupReport.CompressionRatio = $compressionRatio
}
catch {
Write-Host "Compression failed: $($_.Exception.Message)" -ForegroundColor Red
$backupReport.Errors += "Compression failed: $($_.Exception.Message)"
}

        # Cleanup old backups (always run for 7-day retention)
        Write-Host "  Cleaning up old backups..." -ForegroundColor Yellow
        Remove-DCEOldApplicationBackups -BackupPath $BackupPath -RetentionDays 7

        $backupReport.Success = ($backupReport.Errors.Count -eq 0)

    } catch {
        $backupReport.Errors += $_.Exception.Message
        Write-Host "  Backup failed: $($_.Exception.Message)" -ForegroundColor Red
    } finally {
        $backupTimer.Stop()
        $backupReport.Duration = $backupTimer.Elapsed.TotalSeconds
    }

    # Save backup report
    $reportFile = "C:\DceWeb\app\backup\BackupLogs\BackupApp-$timestamp.json"
    New-Item -ItemType Directory -Path "C:\DceWeb\app\backup\BackupLogs" -Force | Out-Null
    $backupReport | ConvertTo-Json -Depth 10 | Out-File $reportFile -Encoding UTF8

    return $backupReport
}

function Remove-DCEOldApplicationBackups {
    param(
        [string]$BackupPath,
        [int]$RetentionDays = 7
    )

    Write-Host "Removing application backups older than $RetentionDays days..." -ForegroundColor Yellow

    $cutoffDate = (Get-Date).AddDays(-$RetentionDays)
    $oldBackups = Get-ChildItem -Path $BackupPath -Filter "BackupApp-*" | Where-Object {$_.CreationTime -lt $cutoffDate}

    if ($oldBackups) {
        $deletedCount = 0
        foreach ($backup in $oldBackups) {
            try {
                Remove-Item $backup.FullName -Recurse -Force
                $deletedCount++
                Write-Host "  Deleted: $($backup.Name)" -ForegroundColor Cyan
            } catch {
                Write-Host "  Failed to delete: $($backup.Name)" -ForegroundColor Red
            }
        }
        Write-Host "  Deleted $deletedCount old backup directories" -ForegroundColor Green
    } else {
        Write-Host "  No old backups to delete" -ForegroundColor Yellow
    }
}


# Export functions
# Functions available:
# - Start-DCEApplicationBackup
# - Remove-DCEOldApplicationBackups
# - Test-DCEApplicationRestore

# Execute the backup
Start-DCEApplicationBackup -BackupPath $BackupPath -IncludeLogs:$IncludeLogs -IncludeUploads:$IncludeUploads -IncludeConfig:$IncludeConfig -Compress:$Compress -Cleanup:$Cleanup
