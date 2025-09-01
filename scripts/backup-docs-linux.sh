#!/bin/bash

# Script backup tài liệu cho Linux
# Tương đương với BackupDocs.bat trên Windows

# Lấy ngày hiện tại theo format yyyyMMdd
today=$(date +%Y%m%d)

# Đường dẫn nguồn và đích
src="/home/dopt/Desktop/App/backup"
dest="/mnt/backup/BackupDcePortal"

# Thư mục logs
logdir="/mnt/backup/BackupLogs"
logfile="$logdir/backup_$today.log"

# Tạo thư mục đích nếu chưa có
mkdir -p "$dest"
mkdir -p "$logdir"

# Log bắt đầu
echo "=== Backup started at $(date) ===" | tee -a "$logfile"

# Thực hiện backup với rsync (tương đương robocopy /MIR)
# /MIR = Mirror mode (đồng bộ hoàn toàn)
# /Z = Restart mode (có thể resume nếu bị gián đoạn)
# /MT:32 = Multi-threaded (32 threads)
# /R:2 = Retry 2 lần
# /W:5 = Wait 5 giây giữa các retry
rsync -avz --delete \
    --progress \
    --stats \
    --log-file="$logfile" \
    --append-verify \
    --partial \
    --timeout=300 \
    --contimeout=60 \
    --retry-connrefused \
    --retry-delay=5 \
    --max-retries=2 \
    "$src/" "$dest/"

# Kiểm tra kết quả
if [ $? -eq 0 ]; then
    echo "=== Backup completed successfully at $(date) ===" | tee -a "$logfile"
    echo "Source: $src" | tee -a "$logfile"
    echo "Destination: $dest" | tee -a "$logfile"
    echo "Log file: $logfile" | tee -a "$logfile"
else
    echo "=== Backup failed at $(date) ===" | tee -a "$logfile"
    exit 1
fi
