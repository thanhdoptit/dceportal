# DCE System - Hướng Dẫn Sử Dụng Chi Tiết

## 📋 **Mục Lục**
1. [Cấu hình Environment](#cấu-hình-environment)
2. [Monitoring System](#monitoring-system)
3. [Database Backup](#database-backup)
4. [Application Backup](#application-backup)
5. [Smart Backup](#smart-backup)
6. [Maintenance](#maintenance)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 **1. Cấu hình Environment**

### **Bước 1: Kiểm tra file .env**
```powershell
# Kiểm tra file .env có tồn tại không
Get-Content "D:\Project\app\backend\.env"
```

### **Bước 2: Load Environment Variables**
```powershell
# Chạy script cấu hình environment
.\scripts\configure-env.ps1
```

### **Bước 3: Kiểm tra Environment Variables**
```powershell
# Kiểm tra các biến môi trường đã load
echo $env:DB_HOST
echo $env:DB_NAME
echo $env:DB_USER
# DB_PASS sẽ hiển thị *** để bảo mật
```

---

## 🔍 **2. Monitoring System**

### **2.1. Monitoring Cơ Bản**
```powershell
# Chạy monitoring system
.\scripts\improved-monitoring.ps1
```

**Kết quả mong đợi:**
```
=== DCE System - Improved Monitoring ===
Thoi gian: 08/24/2025 17:15:02

1. System Resources:
CPU Usage: 17%
Memory Usage: 57.5% (9.12 GB / 15.86 GB)
Disk Space: 16.16 GB free of 222.78 GB total

2. Service Status:
SQL Server: Running (Service: MSSQL$SQLEXPRESS)
Web Server: Not Found
Cache Server: Not Found
DCE Backend: Not Found
DCE Frontend: Not Found

3. Port Availability:
Port 80 (HTTP): Open
Port 443 (HTTPS): Closed
Port 1433 (SQL Server): Open
Port 5000 (DCE Backend): Open
Port 3000 (DCE Frontend): Open
Port 6379 (Redis): Closed

4. Database Connection:
Database Connection: Success

5. Application Health:
Backend Health: 200
Frontend Health: 200
```

### **2.2. Giải thích các Metrics**

#### **System Resources:**
- **CPU Usage**: Sử dụng CPU hiện tại (dưới 80% là tốt)
- **Memory Usage**: Sử dụng RAM (dưới 90% là tốt)
- **Disk Space**: Dung lượng ổ đĩa còn trống

#### **Service Status:**
- **SQL Server**: Phải là "Running"
- **DCE Backend/Frontend**: Có thể "Not Found" nếu chưa cài service

#### **Port Availability:**
- **Port 1433**: SQL Server (phải Open)
- **Port 5000**: Backend API (phải Open)
- **Port 3000**: Frontend (phải Open)

#### **Application Health:**
- **Backend Health**: Phải là 200 (OK)
- **Frontend Health**: Phải là 200 (OK)

---

## 💾 **3. Database Backup**

### **3.1. Full Backup (Khuyến nghị hàng ngày)**
```powershell
# Full backup với verification
.\scripts\backup\database-backup.ps1 -BackupType Full -Verify
```

**Kết quả mong đợi:**
```
Starting database backup...
  Creating full backup...
10 percent processed.
20 percent processed.
...
100 percent processed.
BACKUP DATABASE successfully processed 2777 pages in 0.097 seconds (223.642 MB/sec).
  Full backup completed: D:\backup\database\webdce_FULL_20250824_171430.bak
  Verifying backup...
The backup set on file 1 is valid.
  Backup verification passed: D:\backup\database\webdce_FULL_20250824_171430.bak
```

### **3.2. Differential Backup (Hàng giờ)**
```powershell
# Differential backup
.\scripts\backup\database-backup.ps1 -BackupType Differential
```

### **3.3. Transaction Log Backup (Mỗi 15 phút)**
```powershell
# Transaction log backup
.\scripts\backup\database-backup.ps1 -BackupType Log
```

### **3.4. Backup Tất Cả + Cleanup**
```powershell
# Backup tất cả loại + xóa backup cũ
.\scripts\backup\database-backup.ps1 -BackupType All -Cleanup
```

### **3.5. Kiểm tra Backup Files**
```powershell
# Xem danh sách backup files
Get-ChildItem "D:\backup\database\" | Sort-Object CreationTime -Descending

# Xem kích thước backup
Get-ChildItem "D:\backup\database\" | Select-Object Name, Length, CreationTime
```

---

## 📁 **4. Application Backup**

### **4.1. Smart Backup Cơ Bản**
```powershell
# Backup essential files
.\scripts\backup\application-backup.ps1
```

**Kết quả mong đợi:**
```
Starting smart application backup...
  Backing up essential application files...
    Backed up: backend\src
    Backed up: backend\package.json
    Backed up: backend\package-lock.json
    Backed up: frontend\src
    Backed up: frontend\package.json
    Backed up: frontend\package-lock.json
    Backed up: frontend\vite.config.js
    Backed up: frontend\index.html
    Backed up: nginx\conf
    Backed up: scripts
    Backed up: uploads
  Smart application backup completed: D:\backup\application\app-backup-20250824_171456
  Backup size: 5.22 MB
  Items backed up: 11
```

### **4.2. Backup với Configuration**
```powershell
# Backup + configuration files (.env, nginx config)
.\scripts\backup\application-backup.ps1 -IncludeConfig
```

### **4.3. Backup với Uploads và Logs**
```powershell
# Backup + uploads và logs
.\scripts\backup\application-backup.ps1 -IncludeUploads -IncludeLogs
```

### **4.4. Backup với Compression**
```powershell
# Backup + nén file
.\scripts\backup\application-backup.ps1 -Compress
```

### **4.5. Backup Đầy Đủ + Cleanup**
```powershell
# Backup tất cả + nén + xóa backup cũ
.\scripts\backup\application-backup.ps1 -IncludeConfig -IncludeUploads -IncludeLogs -Compress -Cleanup
```

### **4.6. Kiểm tra Application Backup**
```powershell
# Xem danh sách application backup
Get-ChildItem "D:\backup\application\" | Sort-Object CreationTime -Descending

# Xem kích thước backup
Get-ChildItem "D:\backup\application\" | Select-Object Name, Length, CreationTime
```

---

## 🚀 **5. Smart Backup (Tổng Hợp)**

### **5.1. Backup Toàn Bộ Hệ Thống**
```powershell
# Backup database + application + configuration
.\scripts\smart-backup.ps1
```

**Kết quả mong đợi:**
```
Smart DCE Backup System
Test 1: Creating backup directories...
Created: D:\backup\database
Created: D:\backup\application
Created: D:\Project\app\logs\backup

Test 2: Smart application backup...
Backed up: backend\src
Backed up: backend\package.json
...
Smart application backup completed: D:\backup\application\app-backup-20250824_171540
Backup size: 5.22 MB
Items backed up: 11

Test 3: Configuration backup...
Backed up: .env
Backed up: nginx\conf\nginx.conf
...

Test 4: Backup compression...
Backup compressed: D:\backup\application\app-backup-20250824_171540.zip
Original size: 5.22 MB
Compressed size: 2.85 MB
Compression ratio: 45.44%

Test 5: Creating backup report...
Backup report created: D:\Project\app\logs\backup\smart-backup-report-20250824_171540.json
```

### **5.2. Kiểm tra Backup Reports**
```powershell
# Xem backup reports
Get-ChildItem "D:\Project\app\logs\backup\" | Where-Object {$_.Name -like "*report*"} | Sort-Object CreationTime -Descending

# Xem nội dung report mới nhất
Get-Content "D:\Project\app\logs\backup\smart-backup-report-20250824_171540.json" | ConvertFrom-Json | Format-List
```

---

## 🔧 **6. Maintenance**

### **6.1. Chạy Maintenance Hàng Ngày**
```powershell
# Chạy maintenance tự động
.\scripts\maintenance.ps1
```

**Kết quả mong đợi:**
```
DCE System Maintenance - 08/24/2025 16:25:47
Running health check...
Testing DCE Monitoring System...
...
Monitoring Test Completed!
Running backup check...
Smart DCE Backup System
...
Smart Backup Test Completed!
Cleaning up old logs...
Maintenance completed
```

### **6.2. Cleanup Backup Cũ**
```powershell
# Chạy cleanup backup cũ hơn 7 ngày
.\scripts\backup-cleanup.ps1
```

### **6.3. Thiết Lập Scheduled Task (Tự động)**
```powershell
# Tạo scheduled task chạy hàng ngày lúc 2:00 AM
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"D:\Project\app\scripts\maintenance.ps1`""
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName "DCE-System-Maintenance" -Action $action -Trigger $trigger -Principal $principal -Description "DCE System Daily Maintenance"

# Tạo scheduled task cleanup backup cũ hơn 7 ngày (chạy hàng tuần)
$cleanupAction = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"D:\Project\app\scripts\backup-cleanup.ps1`""
$cleanupTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 3am
Register-ScheduledTask -TaskName "DCE-Backup-Cleanup" -Action $cleanupAction -Trigger $cleanupTrigger -Principal $principal -Description "DCE System Weekly Backup Cleanup"
```

---

## 🔍 **7. Troubleshooting**

### **7.1. Lỗi Database Connection**
```powershell
# Kiểm tra SQL Server service
Get-Service -Name "*SQL*"

# Kiểm tra port 1433
Test-NetConnection -ComputerName localhost -Port 1433

# Kiểm tra file .env
Get-Content "D:\Project\app\backend\.env" | Select-String "DB_"
```

### **7.2. Lỗi Backup**
```powershell
# Kiểm tra quyền thư mục backup
Get-Acl "D:\backup\database"
Get-Acl "D:\backup\application"

# Kiểm tra dung lượng ổ đĩa
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, Size, FreeSpace
```

### **7.3. Lỗi Monitoring**
```powershell
# Kiểm tra WMI service
Get-Service -Name "Winmgmt"

# Kiểm tra PowerShell execution policy
Get-ExecutionPolicy

# Kiểm tra logs
Get-ChildItem "D:\Project\app\logs\" -Recurse | Sort-Object CreationTime -Descending | Select-Object -First 10
```

### **7.4. Lỗi Environment Variables**
```powershell
# Kiểm tra environment variables
[Environment]::GetEnvironmentVariable("DB_PASS", "Process")
[Environment]::GetEnvironmentVariable("DB_NAME", "Process")

# Reload environment
.\scripts\configure-env.ps1
```

---

## 📊 **8. Monitoring Dashboard**

### **8.1. Tạo Script Monitoring Dashboard**
```powershell
# Tạo file monitoring-dashboard.ps1
@"
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

# Backup Status
$latestDbBackup = Get-ChildItem "D:\backup\database\" -ErrorAction SilentlyContinue | Sort-Object CreationTime -Descending | Select-Object -First 1
$latestAppBackup = Get-ChildItem "D:\backup\application\" -ErrorAction SilentlyContinue | Sort-Object CreationTime -Descending | Select-Object -First 1

Write-Host "`nBackup Status:" -ForegroundColor Cyan
if ($latestDbBackup) {
    $dbBackupAge = (Get-Date) - $latestDbBackup.CreationTime
    Write-Host "Latest DB Backup: $($latestDbBackup.Name) ($([math]::Round($dbBackupAge.TotalHours, 1)) hours ago)" -ForegroundColor $(if($dbBackupAge.TotalHours -lt 24) { 'Green' } else { 'Yellow' })
} else {
    Write-Host "No database backup found" -ForegroundColor Red
}

if ($latestAppBackup) {
    $appBackupAge = (Get-Date) - $latestAppBackup.CreationTime
    Write-Host "Latest App Backup: $($latestAppBackup.Name) ($([math]::Round($appBackupAge.TotalHours, 1)) hours ago)" -ForegroundColor $(if($appBackupAge.TotalHours -lt 24) { 'Green' } else { 'Yellow' })
} else {
    Write-Host "No application backup found" -ForegroundColor Red
}
"@ | Out-File "D:\Project\app\scripts\monitoring-dashboard.ps1" -Encoding UTF8
```

### **8.2. Chạy Dashboard**
```powershell
# Chạy monitoring dashboard
.\scripts\monitoring-dashboard.ps1
```

---

## 🎯 **9. Best Practices**

### **9.1. Lịch Trình Backup**
- **Database Full Backup**: Hàng ngày lúc 2:00 AM
- **Database Differential**: Mỗi 4 giờ
- **Transaction Log**: Mỗi 15 phút
- **Application Backup**: Hàng ngày lúc 3:00 AM
- **Maintenance**: Hàng ngày lúc 4:00 AM

### **9.2. Monitoring Thresholds**
- **CPU Usage**: Cảnh báo khi > 80%
- **Memory Usage**: Cảnh báo khi > 90%
- **Disk Space**: Cảnh báo khi < 10GB
- **Backup Age**: Cảnh báo khi > 24 giờ

### **9.3. Backup Retention**
- **Database Backups**: Giữ 7 ngày (tự động xóa)
- **Application Backups**: Giữ 7 ngày (tự động xóa)
- **Logs**: Giữ 7 ngày

### **9.4. Security**
- **File .env**: Chỉ admin có quyền đọc
- **Backup Files**: Chỉ admin có quyền truy cập
- **Logs**: Không chứa thông tin nhạy cảm

---

## 📞 **10. Support**

### **10.1. Logs Location**
- **Backup Logs**: `D:\Project\app\logs\backup\`
- **Monitoring Logs**: `D:\Project\app\logs\monitoring\`
- **System Logs**: `D:\Project\app\logs\`

### **10.2. Emergency Contacts**
- **System Admin**: [Your Contact]
- **Database Admin**: [Your Contact]
- **Backup Location**: `D:\backup\`

### **10.3. Recovery Procedures**
1. **Database Recovery**: Sử dụng backup file từ `D:\backup\database\`
2. **Application Recovery**: Restore từ `D:\backup\application\`
3. **Configuration Recovery**: Restore từ backup configuration

---

**🎉 Hệ thống DCE Monitoring & Backup đã sẵn sàng cho production!**
