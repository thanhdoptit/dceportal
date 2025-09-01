#!/bin/bash

# Script backup config Cursor
# Backup tất cả cài đặt và config của Cursor

# Lấy ngày hiện tại
today=$(date +%Y%m%d)

# Thư mục backup
backup_dir="/home/dopt/Desktop/App/backup/BackupCursor"
logfile="/home/dopt/Desktop/App/backup/BackupLogs/cursor_backup_$today.log"

# Tạo thư mục backup
mkdir -p "$backup_dir"
mkdir -p "$(dirname "$logfile")"

echo "=== Cursor Config Backup started at $(date) ===" | tee -a "$logfile"

# Backup config chính
if [ -d ~/.config/Cursor ]; then
    echo "Backing up ~/.config/Cursor..." | tee -a "$logfile"
    rsync -avz --delete \
        --exclude='Cache' \
        --exclude='CachedData' \
        --exclude='CachedExtensionVSIXs' \
        --exclude='logs' \
        --exclude='Crashpad' \
        --exclude='blob_storage' \
        --exclude='Code Cache' \
        --exclude='GPUCache' \
        --exclude='DawnGraphiteCache' \
        --exclude='DawnWebGPUCache' \
        --exclude='WebStorage' \
        --exclude='Session Storage' \
        --exclude='Local Storage' \
        --exclude='Shared Dictionary' \
        ~/.config/Cursor/ "$backup_dir/config/"
fi

# Backup authentication data (quan trọng cho login)
echo "Backing up authentication data..." | tee -a "$logfile"
if [ -d ~/.config/Cursor/User/globalStorage ]; then
    cp -r ~/.config/Cursor/User/globalStorage "$backup_dir/auth/"
fi

if [ -d ~/.config/Cursor/User/workspaceStorage ]; then
    cp -r ~/.config/Cursor/User/workspaceStorage "$backup_dir/workspace-auth/"
fi

# Backup server data
if [ -d ~/.cursor-server ]; then
    echo "Backing up ~/.cursor-server..." | tee -a "$logfile"
    rsync -avz --delete \
        --exclude='data/logs' \
        --exclude='data/Cache' \
        --exclude='data/CachedData' \
        ~/.cursor-server/ "$backup_dir/server/"
fi

# Tạo file summary
echo "=== Backup Summary ===" > "$backup_dir/backup_summary_$today.txt"
echo "Date: $(date)" >> "$backup_dir/backup_summary_$today.txt"
echo "Config size: $(du -sh "$backup_dir/config/" 2>/dev/null | cut -f1)" >> "$backup_dir/backup_summary_$today.txt"
echo "Server size: $(du -sh "$backup_dir/server/" 2>/dev/null | cut -f1)" >> "$backup_dir/backup_summary_$today.txt"

echo "=== Cursor Config Backup completed at $(date) ===" | tee -a "$logfile"
echo "Backup location: $backup_dir" | tee -a "$logfile"
echo "Log file: $logfile" | tee -a "$logfile"
