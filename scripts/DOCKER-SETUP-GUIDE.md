# 🐳 Hướng dẫn cài đặt SQL Server Docker cho DCE

## 📋 Yêu cầu hệ thống

- Ubuntu 24.04 LTS
- Ít nhất 4GB RAM
- 10GB disk space
- Quyền sudo

## 🚀 Bước 1: Cài đặt Docker

### 1.1 Cập nhật package list
```bash
sudo apt update
```

### 1.2 Cài đặt Docker và Docker Compose
```bash
sudo apt install docker.io docker-compose -y
```

### 1.3 Khởi động và enable Docker service
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### 1.4 Thêm user vào docker group (để chạy docker không cần sudo)
```bash
sudo usermod -aG docker $USER
```

### 1.5 Logout và Login lại để group có hiệu lực

**Cách 1: Logout hoàn toàn**
```bash
# Đăng xuất khỏi session hiện tại
logout
# Hoặc
exit
```
Sau đó đăng nhập lại vào hệ thống.

**Cách 2: Restart session (khuyến nghị)**
```bash
# Khởi động lại session mà không logout
newgrp docker
```

**Cách 3: Restart máy**
```bash
sudo reboot
```

### 1.6 Kiểm tra cài đặt
```bash
docker --version
docker-compose --version
# Test chạy docker không cần sudo
docker ps
```

## 🗄️ Bước 2: Chuẩn bị thư mục và files

### 2.1 Di chuyển vào thư mục backend
```bash
cd /home/dopt/Desktop/App/backend
```

### 2.2 Tạo thư mục cần thiết
```bash
mkdir -p sqlserver/backups
mkdir -p sqlserver/init
```

### 2.3 Copy backup files (nếu có)
```bash
cp ../BackupDB/*.bak sqlserver/backups/
```

## 🔧 Bước 3: Tạo file docker-compose.yml

### 3.1 Tạo file docker-compose.yml
```bash
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: dce_sqlserver
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=Ab123456
      - MSSQL_PID=Developer
      - TZ=Asia/Ho_Chi_Minh
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql
      - ./sqlserver/backups:/var/opt/mssql/backup
      - ./sqlserver/init:/docker-entrypoint-initdb.d
    restart: unless-stopped
    networks:
      - dce_network
    healthcheck:
      test: ["CMD-SHELL", "/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -Q 'SELECT 1' || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

volumes:
  sqlserver_data:
    driver: local

networks:
  dce_network:
    driver: bridge
EOF
```

## 📝 Bước 4: Tạo script khởi tạo database

### 4.1 Tạo script init database
```bash
cat > sqlserver/init/01-init-database.sql << 'EOF'
-- Script khởi tạo database cho DCE
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'webdce')
BEGIN
    CREATE DATABASE webdce;
END
GO

USE webdce;
GO

-- Tạo database test nếu cần
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'webdce_test')
BEGIN
    CREATE DATABASE webdce_test;
END
GO




-- Cấu hình collation cho Unicode
ALTER DATABASE webdce COLLATE SQL_Latin1_General_CP1_CI_AS;
ALTER DATABASE webdce_test COLLATE SQL_Latin1_General_CP1_CI_AS;
ALTER DATABASE webdce_production COLLATE SQL_Latin1_General_CP1_CI_AS;
GO

PRINT 'Database initialization completed successfully!';
EOF
```

## 🚀 Bước 5: Khởi động SQL Server

### 5.1 Khởi động container
```bash
sudo docker-compose up -d
```

### 5.2 Kiểm tra trạng thái
```bash
sudo docker-compose ps
```

### 5.3 Chờ SQL Server khởi động (khoảng 30-60 giây)
```bash
sleep 30
```

### 5.4 Kiểm tra logs
```bash
sudo docker-compose logs sqlserver
```

## 🔗 Bước 6: Test kết nối

### 6.1 Test kết nối cơ bản
```bash
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "SELECT @@VERSION"
```

### 6.2 Kiểm tra databases
```bash
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "SELECT name FROM sys.databases"
```

### 6.3 Chạy script init database
```bash
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -i /docker-entrypoint-initdb.d/01-init-database.sql
```

## 🖥️ Bước 6.5: Kết nối Azure Data Studio

### 6.5.1 Thông tin kết nối Azure Data Studio
```
Server: localhost,1433
Authentication Type: SQL Login
User name: sa
Password: Ab123456
Database: webdce (hoặc master)
```

### 6.5.2 Các query hữu ích trong Azure Data Studio

**Kiểm tra version SQL Server:**
```sql
SELECT @@VERSION as SQLServerVersion;
```

**Xem danh sách databases:**
```sql
SELECT name, database_id, create_date 
FROM sys.databases 
ORDER BY name;
```

**Xem danh sách tables trong database webdce:**
```sql
USE webdce;
SELECT TABLE_NAME, TABLE_SCHEMA 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
```

**Xem thông tin users:**
```sql
USE webdce;
SELECT COUNT(*) as TotalUsers FROM Users;
SELECT TOP 10 username, email, role, created_at FROM Users;
```

**Xem thông tin tables và số lượng records:**
```sql
USE webdce;
SELECT 
    t.TABLE_NAME,
    p.rows as RowCounts
FROM INFORMATION_SCHEMA.TABLES t
INNER JOIN sys.tables st ON t.TABLE_NAME = st.name
INNER JOIN sys.partitions p ON st.object_id = p.object_id
WHERE t.TABLE_TYPE = 'BASE TABLE' 
    AND p.index_id = 1
ORDER BY p.rows DESC;
```

**Kiểm tra kết nối và permissions:**
```sql
SELECT 
    SYSTEM_USER as CurrentUser,
    DB_NAME() as CurrentDatabase,
    @@VERSION as SQLVersion;
```

**Xem thông tin về database size:**
```sql
SELECT 
    DB_NAME() as DatabaseName,
    SUM(size * 8 / 1024) as SizeMB
FROM sys.database_files
GROUP BY DB_NAME();
```

## 📦 Bước 7: Quản lý Database (Create, Backup, Restore)

### 7.1 Tạo Database mới

**Tạo database bằng command line:**
```bash
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "CREATE DATABASE webdce_new;"
```

**Tạo database bằng Azure Data Studio:**
```sql
-- Tạo database mới
CREATE DATABASE webdce_new;

-- Tạo database với options
CREATE DATABASE webdce_new
ON PRIMARY (
    NAME = webdce_new,
    FILENAME = '/var/opt/mssql/data/webdce_new.mdf',
    SIZE = 10MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 5MB
)
LOG ON (
    NAME = webdce_new_log,
    FILENAME = '/var/opt/mssql/data/webdce_new_log.ldf',
    SIZE = 5MB,
    MAXSIZE = UNLIMITED,
    FILEGROWTH = 5MB
);
```

### 7.2 Backup Database

**Backup bằng command line:**
```bash
# Backup database webdce
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "BACKUP DATABASE webdce TO DISK = '/var/opt/mssql/backup/webdce_$(date +%Y%m%d_%H%M%S).bak'"

# Backup với compression
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "BACKUP DATABASE webdce TO DISK = '/var/opt/mssql/backup/webdce_$(date +%Y%m%d_%H%M%S).bak' WITH COMPRESSION"

# Backup với checksum
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "BACKUP DATABASE webdce TO DISK = '/var/opt/mssql/backup/webdce_$(date +%Y%m%d_%H%M%S).bak' WITH CHECKSUM"
```

**Backup bằng Azure Data Studio:**
```sql
-- Backup cơ bản
BACKUP DATABASE webdce 
TO DISK = '/var/opt/mssql/backup/webdce_backup.bak';

-- Backup với options
BACKUP DATABASE webdce 
TO DISK = '/var/opt/mssql/backup/webdce_full_backup.bak'
WITH 
    COMPRESSION,
    CHECKSUM,
    STATS = 10,
    DESCRIPTION = 'Full backup of webdce database';

-- Backup differential (nếu có full backup trước đó)
BACKUP DATABASE webdce 
TO DISK = '/var/opt/mssql/backup/webdce_diff_backup.bak'
WITH DIFFERENTIAL;
```

**Kiểm tra backup files:**
```bash
# Xem danh sách backup files
sudo docker exec dce_sqlserver ls -la /var/opt/mssql/backup/

# Copy backup từ container ra host
sudo docker cp dce_sqlserver:/var/opt/mssql/backup/ ./backup_from_container/
```

### 7.3 Restore Database

**Tạo script restore:**
```bash
cat > sqlserver/init/02-restore-backup.sql << 'EOF'
-- Script restore backup
USE master;
GO

-- Xóa database cũ nếu tồn tại
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'webdce')
BEGIN
    ALTER DATABASE webdce SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE webdce;
END
GO

-- Restore database từ backup
RESTORE DATABASE webdce 
FROM DISK = '/var/opt/mssql/backup/webdce_FULL_20250824_230000.bak'
WITH MOVE 'webdce' TO '/var/opt/mssql/data/webdce.mdf',
     MOVE 'webdce_log' TO '/var/opt/mssql/data/webdce_log.ldf',
     REPLACE;
GO

-- Chuyển về multi-user mode
ALTER DATABASE webdce SET MULTI_USER;
GO

PRINT 'Restore completed successfully!';
EOF
```

**Restore bằng command line:**
```bash
# Restore từ script
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -i /docker-entrypoint-initdb.d/02-restore-backup.sql

# Restore trực tiếp
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "RESTORE DATABASE webdce FROM DISK = '/var/opt/mssql/backup/webdce_FULL_20250824_230000.bak' WITH REPLACE"
```

**Restore bằng Azure Data Studio:**
```sql
-- Restore cơ bản
RESTORE DATABASE webdce 
FROM DISK = '/var/opt/mssql/backup/webdce_FULL_20250824_230000.bak'
WITH REPLACE;

-- Restore với MOVE (khi cần thay đổi đường dẫn)
RESTORE DATABASE webdce 
FROM DISK = '/var/opt/mssql/backup/webdce_FULL_20250824_230000.bak'
WITH 
    MOVE 'webdce' TO '/var/opt/mssql/data/webdce.mdf',
    MOVE 'webdce_log' TO '/var/opt/mssql/data/webdce_log.ldf',
    REPLACE;

-- Restore với options
RESTORE DATABASE webdce 
FROM DISK = '/var/opt/mssql/backup/webdce_FULL_20250824_230000.bak'
WITH 
    MOVE 'webdce' TO '/var/opt/mssql/data/webdce.mdf',
    MOVE 'webdce_log' TO '/var/opt/mssql/data/webdce_log.ldf',
    REPLACE,
    STATS = 10;
```

### 7.4 Kiểm tra kết quả

**Kiểm tra bằng command line:**
```bash
# Kiểm tra databases
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "SELECT name FROM sys.databases"

# Kiểm tra tables trong webdce
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "USE webdce; SELECT COUNT(*) as TotalTables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
```

**Kiểm tra bằng Azure Data Studio:**
```sql
-- Xem danh sách databases
SELECT name, database_id, create_date, state_desc
FROM sys.databases 
ORDER BY name;

-- Xem thông tin database webdce
USE webdce;
SELECT 
    DB_NAME() as DatabaseName,
    COUNT(*) as TotalTables,
    SUM(size * 8 / 1024) as SizeMB
FROM INFORMATION_SCHEMA.TABLES t
CROSS JOIN sys.database_files df
WHERE t.TABLE_TYPE = 'BASE TABLE';

-- Xem danh sách tables và số records
SELECT 
    t.TABLE_NAME,
    p.rows as RowCounts
FROM INFORMATION_SCHEMA.TABLES t
INNER JOIN sys.tables st ON t.TABLE_NAME = st.name
INNER JOIN sys.partitions p ON st.object_id = p.object_id
WHERE t.TABLE_TYPE = 'BASE TABLE' 
    AND p.index_id = 1
ORDER BY p.rows DESC;
```

### 7.5 Quản lý Database Files

**Xem thông tin database files:**
```sql
-- Xem database files
SELECT 
    name,
    physical_name,
    size * 8 / 1024 as SizeMB,
    max_size * 8 / 1024 as MaxSizeMB,
    growth * 8 / 1024 as GrowthMB
FROM sys.database_files;

-- Xem database size
SELECT 
    DB_NAME() as DatabaseName,
    SUM(size * 8 / 1024) as TotalSizeMB,
    SUM(CASE WHEN type = 0 THEN size * 8 / 1024 ELSE 0 END) as DataSizeMB,
    SUM(CASE WHEN type = 1 THEN size * 8 / 1024 ELSE 0 END) as LogSizeMB
FROM sys.database_files;
```

**Shrink database (nếu cần):**
```sql
-- Shrink database
DBCC SHRINKDATABASE (webdce, 10);

-- Shrink log file
DBCC SHRINKFILE (webdce_log, 5);
```

## 🔧 Bước 8: Cấu hình backend

### 8.1 Kiểm tra file .env
```bash
cat .env
```

### 8.2 Đảm bảo cấu hình database đúng
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASS=Ab123456
DB_NAME=webdce
```

## 📊 Bước 9: Quản lý container

### 9.1 Xem trạng thái
```bash
sudo docker-compose ps
```

### 9.2 Xem logs
```bash
sudo docker-compose logs sqlserver
```

### 9.3 Dừng container
```bash
sudo docker-compose stop
```

### 9.4 Khởi động lại
```bash
sudo docker-compose restart
```

### 9.5 Xóa hoàn toàn
```bash
sudo docker-compose down -v
```

## 🗑️ Bước 10: Xóa SQL Server cũ (nếu cần)

### 10.1 Dừng service cũ
```bash
sudo systemctl stop mssql-server
sudo systemctl disable mssql-server
```

### 10.2 Gỡ cài đặt
```bash
sudo apt remove --purge mssql-server mssql-tools -y
sudo apt autoremove -y
```

### 10.3 Xóa thư mục dữ liệu
```bash
sudo rm -rf /var/opt/mssql/
sudo rm -rf /opt/mssql/
sudo rm -rf /opt/mssql-tools18/
```

## 🔍 Troubleshooting

### Lỗi permission denied
```bash
# Thêm user vào docker group
sudo usermod -aG docker $USER
# Logout và login lại
```

### Container không khởi động
```bash
# Kiểm tra logs
sudo docker-compose logs sqlserver

# Kiểm tra port đã được sử dụng
netstat -tulpn | grep 1433
```

### Không kết nối được database
```bash
# Test kết nối từ container
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "SELECT 1"

# Kiểm tra firewall
sudo ufw status
```

### Lỗi restore backup
```bash
# Kiểm tra file backup có tồn tại không
sudo docker exec dce_sqlserver ls -la /var/opt/mssql/backup/

# Kiểm tra quyền file
sudo docker exec dce_sqlserver chmod 644 /var/opt/mssql/backup/*.bak
```

### Lỗi kết nối Azure Data Studio
```bash
# Kiểm tra SQL Server đang chạy
sudo docker-compose ps

# Kiểm tra port 1433
netstat -tulpn | grep 1433

# Test kết nối từ command line
sudo docker exec dce_sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Ab123456 -C -Q "SELECT 1"
```

**Các lỗi thường gặp trong Azure Data Studio:**
- **Connection timeout**: Kiểm tra SQL Server đã khởi động hoàn toàn chưa
- **Login failed**: Kiểm tra username/password
- **Server not found**: Kiểm tra host và port
- **SSL/TLS error**: Thêm `TrustServerCertificate=true` trong connection string

## 📝 Thông tin kết nối

### Command Line
- **Host**: localhost
- **Port**: 1433
- **User**: sa
- **Password**: Ab123456
- **Database**: webdce
- **SQL Tools**: `/opt/mssql-tools18/bin/sqlcmd`

### Azure Data Studio
- **Server**: localhost,1433
- **Authentication Type**: SQL Login
- **User name**: sa
- **Password**: Ab123456
- **Database**: webdce (hoặc master)
- **Connection String**: `Server=localhost,1433;Database=webdce;User Id=sa;Password=Ab123456;TrustServerCertificate=true;`

## 🎯 Kết quả mong đợi

✅ SQL Server 2022 Developer Edition chạy trong Docker  
✅ Database webdce được tạo/restore thành công  
✅ Backend có thể kết nối với cấu hình .env  
✅ Dữ liệu được lưu persistent trong Docker volume  
✅ Backup files được mount từ host vào container  

## 🔗 Liên kết hữu ích

- [SQL Server Docker Documentation](https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [SQL Server Backup/Restore](https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/)
