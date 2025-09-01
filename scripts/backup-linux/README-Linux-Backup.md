# 🐧 DCE Linux Backup Scripts

Hướng dẫn sử dụng các scripts backup cho SQL Server Linux environment.

## 🔧 Cài đặt và Cấu hình

### 1. Cài đặt Dependencies

```bash
# Cài đặt lz4 compression (tùy chọn, cho tốc độ nhanh nhất)
sudo apt install lz4 -y

# Cài đặt các compression tools khác (nếu cần)
sudo apt install bzip2 xz-utils -y
```

### 2. Cấp quyền cho Scripts

```bash
# Cấp quyền thực thi cho tất cả scripts
chmod +x scripts/backup-linux/*.sh

# Hoặc cấp quyền từng file
chmod +x scripts/backup-linux/database-backup-linux.sh
chmod +x scripts/backup-linux/application-backup-linux.sh
chmod +x scripts/backup-linux/run-backup-linux.sh
chmod +x scripts/backup-linux/cleanup-linux.sh
```

### 3. Tạo thư mục Backup

```bash
# Tạo cấu trúc thư mục backup
mkdir -p backup/BackupDB
mkdir -p backup/BackupApp
mkdir -p backup/BackupLogs

# Cấp quyền cho thư mục backup
chmod 755 backup/
chmod 755 backup/BackupDB/
chmod 755 backup/BackupApp/
chmod 755 backup/BackupLogs/
```

### 4. Cấp quyền SQL Server Container

```bash
# Fix quyền cho thư mục backup trong SQL Server container
sudo docker exec -u root dce_sqlserver chown -R mssql:mssql /var/opt/mssql/backup/

# Kiểm tra quyền
sudo docker exec dce_sqlserver ls -la /var/opt/mssql/backup/

# Kết quả mong đợi:
# drwxrwxr-x 2 mssql mssql 4096 Aug 27 08:55 .
# -rw-r--r-- 1 mssql mssql 25258496 Aug 27 08:55 *.bak
```

### 5. Cấp quyền Docker (nếu cần)

```bash
# Thêm user vào docker group (cần logout/login lại)
sudo usermod -aG docker $USER

# Hoặc chạy scripts với sudo
sudo ./scripts/backup-linux/run-backup-linux.sh
```

## 📁 Scripts Available

### 1. `database-backup-linux.sh`
Script backup database SQL Server trong Linux container.

### 2. `application-backup-linux.sh`
Script backup application files và configuration.

### 3. `run-backup-linux.sh`
Script chính để chạy tất cả backup (database + application).

### 4. `cleanup-linux.sh`
Script cleanup các backup cũ và Linux resources.

## 🚀 Cách sử dụng

### Backup Database

```bash
# Backup full database
./scripts/backup-linux/database-backup-linux.sh --type Full

# Backup với compression và verify
./scripts/backup-linux/database-backup-linux.sh --type Full --compress --verify

# Backup differential
./scripts/backup-linux/database-backup-linux.sh --type Differential

# Backup transaction log
./scripts/backup-linux/database-backup-linux.sh --type Log

# Backup tất cả types
./scripts/backup-linux/database-backup-linux.sh --type All

# Backup với cleanup
./scripts/backup-linux/database-backup-linux.sh --type Full --cleanup
```

### Backup Application

```bash
# Backup application với compression tối ưu
./scripts/backup-linux/application-backup-linux.sh --compress

# Backup với compression nhanh nhất (lz4)
./scripts/backup-linux/application-backup-linux.sh --compress --compression-type lz4 --compression-level 1

# Backup với compression tốt nhất (xz)
./scripts/backup-linux/application-backup-linux.sh --compress --compression-type xz --compression-level 9 --parallel 8

# Backup với gzip tùy chỉnh
./scripts/backup-linux/application-backup-linux.sh --compress --compression-type gzip --compression-level 6

# Backup bao gồm uploads folder (nhiều file nhỏ)
./scripts/backup-linux/application-backup-linux.sh --include-uploads --compression-type lz4

# Backup uploads với giới hạn kích thước
./scripts/backup-linux/application-backup-linux.sh --include-uploads --uploads-max-size 2GB

# Backup không nén
./scripts/backup-linux/application-backup-linux.sh --no-compress

# Backup với cleanup
./scripts/backup-linux/application-backup-linux.sh --compress --cleanup

# Backup với retention 30 ngày
./scripts/backup-linux/application-backup-linux.sh --retention 30
```

### Backup Tất cả (Database + Application)

```bash
# Backup tất cả
./scripts/backup-linux/run-backup-linux.sh

# Backup chỉ database
./scripts/backup-linux/run-backup-linux.sh --type Database

# Backup chỉ application
./scripts/backup-linux/run-backup-linux.sh --type Application

# Backup với verify và cleanup
./scripts/backup-linux/run-backup-linux.sh --verify --cleanup

# Backup database differential
./scripts/backup-linux/run-backup-linux.sh --db-type Differential

# Backup với compression tối ưu
./scripts/backup-linux/run-backup-linux.sh --compression-type lz4 --compression-level 1 --parallel 8

# Backup bao gồm uploads
./scripts/backup-linux/run-backup-linux.sh --include-uploads --uploads-max-size 2GB

# Backup hoàn chỉnh với tất cả tùy chọn
./scripts/backup-linux/run-backup-linux.sh --verify --cleanup --compression-type xz --compression-level 9 --parallel 8 --include-uploads --uploads-max-size 1GB
```

### Cleanup

```bash
# Cleanup tất cả (dry run)
./scripts/backup-linux/cleanup-linux.sh --dry-run

# Cleanup thực sự
./scripts/backup-linux/cleanup-linux.sh

# Cleanup chỉ database backups
./scripts/backup-linux/cleanup-linux.sh --type Database

# Cleanup chỉ application backups
./scripts/backup-linux/cleanup-linux.sh --type Application

# Cleanup chỉ Linux resources
./scripts/backup-linux/cleanup-linux.sh --type Linux

# Cleanup với retention 30 ngày
./scripts/backup-linux/cleanup-linux.sh --retention 30
```

## 📊 Backup Locations

### Database Backups
- **Path**: `/home/dopt/Desktop/App/backup/BackupDB/`
- **Format**: `webdce_FULL_YYYYMMDD_HHMMSS.bak`
- **Container Path**: `/var/opt/mssql/backup/`

### Application Backups
- **Path**: `/home/dopt/Desktop/App/backup/BackupApp/`
- **Format**: `dce_app_YYYYMMDD_HHMMSS.tar.gz`
- **Contents**: backend, frontend, scripts, config files, uploads (optional)

## 📁 Backup Structure

### Files được backup:
```
/home/dopt/Desktop/App/
├── backend/           ✅ (exclude node_modules, logs)
├── frontend/          ✅ (exclude node_modules, dist)
├── scripts/           ✅
├── uploads/           ✅ (optional, optimized for many small files)
├── .env               ✅
└── docker-compose.yml ✅
```

### Uploads folder (khi include):
```
uploads/
├── device-errors/     ✅
├── handover/          ✅
├── system-info/       ✅
├── task/              ✅
├── temp/              ✅
└── *.tmp              ❌ (excluded)
```

### Configuration Backups
- **Path**: `/home/dopt/Desktop/App/backup/BackupApp/`
- **Format**: `dce_config_YYYYMMDD_HHMMSS.tar.gz`
- **Contents**: .env, docker-compose.yml, sqlserver/init/

### Backup Summaries
- **Path**: `/home/dopt/Desktop/App/backup/BackupLogs/`
- **Format**: `backup_summary_YYYYMMDD_HHMMSS.txt`

## 🔧 Options

### Database Backup Options
- `--type`: Full, Differential, Log, All
- `--database`: Database name (default: webdce)
- `--container`: Container name (default: dce_sqlserver)
- `--compress`: Enable compression
- `--verify`: Verify backup after creation
- `--cleanup`: Clean up old backups

### Application Backup Options
- `--path`: Backup path
- `--source`: Source path
- `--compress`: Enable compression (default)
- `--no-compress`: Disable compression
- `--cleanup`: Clean up old backups
- `--retention`: Retention days (default: 7)
- `--compression-level`: Compression level 1-9 (default: 6)
- `--compression-type`: gzip, bzip2, xz, lz4 (default: gzip)
- `--parallel`: Number of parallel jobs (default: 4)
- `--include-uploads`: Include uploads folder in backup
- `--uploads-max-size`: Max uploads size (default: 1GB)

### Main Backup Options
- `--type`: Database, Application, All
- `--db-type`: Database backup type
- `--verify`: Verify database backup
- `--compress`: Enable compression
- `--cleanup`: Clean up old backups
- `--compression-level`: Compression level 1-9 (default: 6)
- `--compression-type`: gzip, bzip2, xz, lz4 (default: gzip)
- `--parallel`: Number of parallel jobs (default: 4)
- `--include-uploads`: Include uploads folder in backup
- `--uploads-max-size`: Max uploads size (default: 1GB)

### Cleanup Options
- `--type`: Database, Application, Linux, All
- `--retention`: Retention days (default: 7)
- `--dry-run`: Show what would be deleted

## 📋 Examples

### Backup hàng ngày
```bash
# Backup full database và application (tối ưu tốc độ)
./scripts/backup-linux/run-backup-linux.sh --verify --cleanup

# Backup với compression nhanh nhất
./scripts/backup-linux/run-backup-linux.sh --compression-type lz4 --compression-level 1 --parallel 8

# Backup bao gồm uploads với compression nhanh
./scripts/backup-linux/run-backup-linux.sh --include-uploads --compression-type lz4 --compression-level 1
```

### Backup differential hàng giờ
```bash
# Backup differential database
./scripts/backup-linux/database-backup-linux.sh --type Differential
```

### Backup trước khi update
```bash
# Backup tất cả với verify (compression tốt nhất)
./scripts/backup-linux/run-backup-linux.sh --type All --verify --compress

# Backup với compression tối ưu cho lưu trữ dài hạn
./scripts/backup-linux/run-backup-linux.sh --compression-type xz --compression-level 9 --parallel 8

# Backup hoàn chỉnh bao gồm uploads cho lưu trữ dài hạn
./scripts/backup-linux/run-backup-linux.sh --include-uploads --uploads-max-size 2GB --compression-type xz --compression-level 9 --parallel 8
```

### Cleanup hàng tuần
```bash
# Cleanup với dry run trước
./scripts/backup-linux/cleanup-linux.sh --dry-run

# Cleanup thực sự
./scripts/backup-linux/cleanup-linux.sh --retention 7
```

## 🔍 Monitoring

### Kiểm tra backup files
```bash
# Database backups
ls -la /home/dopt/Desktop/App/backup/BackupDB/

# Application backups
ls -la /home/dopt/Desktop/App/backup/BackupApp/

# Backup summaries
ls -la /home/dopt/Desktop/App/backup/BackupLogs/backup_summary_*.txt
```

### Kiểm tra disk usage
```bash
# Database backup size
du -sh /home/dopt/Desktop/App/backup/BackupDB/

# Application backup size
du -sh /home/dopt/Desktop/App/backup/BackupApp/

# Total backup size
du -sh /home/dopt/Desktop/App/backup/
```

### Kiểm tra Docker resources
```bash
# Running containers
docker ps

# Docker images
docker images

# Docker volumes
docker volume ls
```

## 🚨 Troubleshooting

### Lỗi container không chạy
```bash
# Kiểm tra container status
docker ps -a | grep dce_sqlserver

# Khởi động container
cd backend && docker-compose up -d
```

### Lỗi permission
```bash
# Cấp quyền cho scripts
chmod +x scripts/backup-linux/*.sh

# Chạy với sudo nếu cần
sudo ./scripts/backup-linux/database-backup-linux.sh
```

### Lỗi SQL Server backup permission
```bash
# Fix quyền cho thư mục backup trong container
sudo docker exec -u root dce_sqlserver chown -R mssql:mssql /var/opt/mssql/backup/

# Kiểm tra quyền
sudo docker exec dce_sqlserver ls -la /var/opt/mssql/backup/

# Test backup thủ công
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P Ab123456 -C \
  -Q "BACKUP DATABASE [webdce] TO DISK = '/var/opt/mssql/backup/test.bak' WITH CHECKSUM"
```

### Lỗi Docker permission
```bash
# Thêm user vào docker group
sudo usermod -aG docker $USER

# Logout và login lại để áp dụng
# Hoặc chạy với sudo
sudo ./scripts/backup-linux/run-backup-linux.sh
```

### Lỗi compression tools
```bash
# Cài đặt lz4 nếu chưa có
sudo apt install lz4 -y

# Cài đặt các compression tools khác
sudo apt install bzip2 xz-utils -y

# Kiểm tra lz4
lz4 --version
```

### Lỗi disk space
```bash
# Kiểm tra disk space
df -h /home/dopt/Desktop/App

# Cleanup old backups
./scripts/backup/cleanup-docker.sh --dry-run
./scripts/backup/cleanup-docker.sh
```

### Lỗi backup verification
```bash
# Kiểm tra backup file trong container
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P Ab123456 -C \
  -Q "RESTORE VERIFYONLY FROM DISK = '/var/opt/mssql/backup/webdce_FULL_20250827_120000.bak'"

# Kiểm tra backup file trên host
ls -la backup/BackupDB/
ls -la backup/BackupApp/

# Verify application backup
tar -tzf backup/BackupApp/dce_app_20250827_095524.tar.gz | head -20

# Verify config backup
tar -tzf backup/BackupApp/dce_config_20250827_095112.tar.gz
```

### Kiểm tra backup integrity
```bash
# Kiểm tra kích thước backup
du -sh backup/BackupDB/
du -sh backup/BackupApp/

# Kiểm tra backup summary
cat backup/BackupLogs/backup_summary_*.txt

# Kiểm tra nội dung file .env trong backup
tar -xzf backup/BackupApp/dce_config_20250827_095112.tar.gz -O dce_config_20250827_095112/.env | head -10
```

## 📝 Logs

### Backup logs
- Database backup logs được hiển thị trực tiếp
- Application backup logs được hiển thị trực tiếp
- Backup summaries được lưu trong `/home/dopt/Desktop/App/backup/`

### Docker logs
```bash
# SQL Server container logs
docker logs dce_sqlserver

# Docker compose logs
cd backend && docker-compose logs sqlserver
```

## 🔄 Automation

### Cron job cho backup hàng ngày
```bash
# Thêm vào crontab
0 2 * * * /home/dopt/Desktop/App/scripts/backup-linux/run-backup-linux.sh --verify --cleanup
```

### Cron job cho cleanup hàng tuần
```bash
# Thêm vào crontab
0 3 * * 0 /home/dopt/Desktop/App/scripts/backup-linux/cleanup-linux.sh --retention 7
```

## 🔄 Restore từ Backup

### Restore Database
```bash
# Copy backup file vào container
sudo docker cp backup/BackupDB/webdce_FULL_20250827_095524.bak dce_sqlserver:/var/opt/mssql/backup/

# Restore database
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P Ab123456 -C \
  -Q "RESTORE DATABASE [webdce] FROM DISK = '/var/opt/mssql/backup/webdce_FULL_20250827_095524.bak' WITH REPLACE"
```

### Restore Application
```bash
# Restore từ application backup
cd /home/dopt/Desktop/App
tar -xzf backup/BackupApp/dce_app_20250827_095524.tar.gz

# Restore từ config backup
tar -xzf backup/BackupApp/dce_config_20250827_095112.tar.gz
cp dce_config_20250827_095112/.env backend/.env
cp dce_config_20250827_095112/docker-compose.yml backend/docker-compose.yml

# Restart services
cd backend && docker-compose restart
```

### Restore File .env
```bash
# Restore .env từ config backup
tar -xzf backup/BackupApp/dce_config_20250827_095112.tar.gz
cp dce_config_20250827_095112/.env backend/.env

# Hoặc restore .env từ app backup
tar -xzf backup/BackupApp/dce_app_20250827_095524.tar.gz
cp dce_app_20250827_095524/backend/.env backend/.env
```

## ⚡ Performance Optimization

### Compression Types Comparison:
- **gzip**: Cân bằng tốt giữa tốc độ và kích thước
- **bzip2**: Nén tốt hơn gzip nhưng chậm hơn
- **xz**: Nén tốt nhất nhưng chậm nhất
- **lz4**: Nhanh nhất nhưng nén ít hơn
- **7z**: Nén tốt nhất (LZMA2), cân bằng tốc độ/kích thước

### Recommended Settings:
```bash
# Backup hàng ngày (tốc độ cao)
--compression-type lz4 --compression-level 4 --parallel 8

# Backup hàng tuần (cân bằng)
--compression-type 7z --compression-level 5 --parallel 8

# Backup dài hạn (nén tốt nhất)
--compression-type 7z --compression-level 9 --parallel 8
```

### Parallel Processing:
- **Backend + Frontend**: Copy song song
- **Compression**: Sử dụng multiple threads (xz, lz4)
- **I/O**: rsync với progress và stats
- **Uploads**: Optimized rsync settings cho nhiều file nhỏ

### Uploads Optimization:
- **Size limit**: Kiểm tra kích thước trước khi backup
- **Auto compression**: Tự động chuyển sang lz4 cho uploads lớn
- **Rsync optimization**: `--inplace`, `--no-whole-file`, `--block-size=8192`
- **Tar optimization**: `--use-compress-program` cho nhiều file nhỏ

## ✅ Best Practices

1. **Luôn verify backup** sau khi tạo
2. **Test restore** định kỳ để đảm bảo backup hoạt động
3. **Monitor disk space** thường xuyên
4. **Cleanup old backups** để tiết kiệm dung lượng
5. **Backup trước khi update** hệ thống
6. **Lưu backup ở nhiều nơi** (local + remote)
7. **Document backup procedures** cho team
8. **Sử dụng compression phù hợp** với mục đích backup

## 🔗 Related Files

- `backend/DOCKER-SETUP-GUIDE.md`: Hướng dẫn setup Docker
- `backend/docker-compose.yml`: Docker configuration
- `backend/.env`: Environment variables
- `backend/sqlserver/init/`: Database initialization scripts
