# DCE System - Improved Monitoring Script
# Script monitoring cai tien voi WMI va kiem tra service chinh xac

Write-Host "=== DCE System - Improved Monitoring ===" -ForegroundColor Green
Write-Host "Thoi gian: $(Get-Date)" -ForegroundColor Yellow

# System Resources (su dung WMI)
Write-Host "`n1. System Resources:" -ForegroundColor Cyan
try {
    $cpu = Get-WmiObject -Class Win32_Processor | Measure-Object -Property LoadPercentage -Average
    $memory = Get-WmiObject -Class Win32_OperatingSystem
    $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"

    $totalMemory = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 2)
    $freeMemory = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)
    $usedMemory = $totalMemory - $freeMemory
    $memoryPercent = [math]::Round(($usedMemory / $totalMemory) * 100, 2)

    Write-Host "CPU Usage: $($cpu.Average)%" -ForegroundColor Green
    Write-Host "Memory Usage: $memoryPercent% ($usedMemory GB / $totalMemory GB)" -ForegroundColor Green
    Write-Host "Disk Space: $([math]::Round($disk.FreeSpace / 1GB, 2)) GB free of $([math]::Round($disk.Size / 1GB, 2)) GB total" -ForegroundColor Green
} catch {
    Write-Host "Loi khi lay thong tin system: $($_.Exception.Message)" -ForegroundColor Red
}

# Service Status (kiem tra nhieu ten service)
Write-Host "`n2. Service Status:" -ForegroundColor Cyan
$serviceChecks = @(
    @{Name="SQL Server"; Patterns=@("MSSQLSERVER", "MSSQL`$SQLEXPRESS", "SQLServerReportingServices")},
    @{Name="Web Server"; Patterns=@("nginx", "IIS", "Apache")},
    @{Name="Cache Server"; Patterns=@("redis", "Redis", "Memcached")},
    @{Name="DCE Backend"; Patterns=@("DCE-Backend", "node", "pm2")},
    @{Name="DCE Frontend"; Patterns=@("DCE-Frontend", "node", "pm2")}
)

foreach ($check in $serviceChecks) {
    $found = $false
    foreach ($pattern in $check.Patterns) {
        try {
            $svc = Get-Service -Name $pattern -ErrorAction SilentlyContinue
            if ($svc) {
                Write-Host "$($check.Name): $($svc.Status) (Service: $pattern)" -ForegroundColor Green
                $found = $true
                break
            }
        } catch {
            # Service khong ton tai
        }
    }
    if (-not $found) {
        Write-Host "$($check.Name): Not Found" -ForegroundColor Red
    }
}

# Port Availability (kiem tra nhieu port)
Write-Host "`n3. Port Availability:" -ForegroundColor Cyan
$portChecks = @(
    @{Port=80; Service="HTTP"},
    @{Port=443; Service="HTTPS"},
    @{Port=1433; Service="SQL Server"},
    @{Port=5000; Service="DCE Backend"},
    @{Port=3000; Service="DCE Frontend"},
    @{Port=6379; Service="Redis"},
    @{Port=8080; Service="Alternative HTTP"},
    @{Port=3001; Service="Alternative Frontend"},
    @{Port=5001; Service="Alternative Backend"}
)

foreach ($check in $portChecks) {
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $check.Port -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($connection) {
            Write-Host "Port $($check.Port) ($($check.Service)): Open" -ForegroundColor Green
        } else {
            Write-Host "Port $($check.Port) ($($check.Service)): Closed" -ForegroundColor Red
        }
    } catch {
        Write-Host "Port $($check.Port) ($($check.Service)): Error" -ForegroundColor Yellow
    }
}

# Database Connection (cai tien)
Write-Host "`n4. Database Connection:" -ForegroundColor Cyan

# Kiem tra nhieu cach lay password
$dbPassword = $null

# Thu tu Process Environment (DB_PASS)
$dbPassword = [Environment]::GetEnvironmentVariable("DB_PASS", "Process")

# Thu tu User Environment (DB_PASS)
if (-not $dbPassword) {
    $dbPassword = [Environment]::GetEnvironmentVariable("DB_PASS", "User")
}

# Thu tu System Environment (DB_PASS)
if (-not $dbPassword) {
    $dbPassword = [Environment]::GetEnvironmentVariable("DB_PASS", "Machine")
}

# Thu tu Process Environment (DB_PASSWORD - fallback)
if (-not $dbPassword) {
    $dbPassword = [Environment]::GetEnvironmentVariable("DB_PASSWORD", "Process")
}

# Thu doc tu file .env
if (-not $dbPassword) {
    $envFile = "C:\DceWeb\app\backend\.env"
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile
        # Thu DB_PASS truoc
        $dbPasswordLine = $envContent | Where-Object { $_ -match "DB_PASS\s*=" }
        if ($dbPasswordLine) {
            $dbPassword = $dbPasswordLine -replace "DB_PASS\s*=\s*", ""
        } else {
            # Fallback to DB_PASSWORD
            $dbPasswordLine = $envContent | Where-Object { $_ -match "DB_PASSWORD\s*=" }
            if ($dbPasswordLine) {
                $dbPassword = $dbPasswordLine -replace "DB_PASSWORD\s*=\s*", ""
            }
        }
    }
}

if ($dbPassword) {
    try {
        # Thu ket noi voi sqlcmd
        $result = & sqlcmd -S localhost -U sa -P $dbPassword -Q "SELECT @@VERSION" -h -1 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Database Connection: Success" -ForegroundColor Green
        } else {
            Write-Host "Database Connection: Failed - $result" -ForegroundColor Red
        }
    } catch {
        Write-Host "Database Connection: Error - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Database Connection: Failed - No password found" -ForegroundColor Red
}

# Application Health
Write-Host "`n5. Application Health:" -ForegroundColor Cyan
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($backendResponse.StatusCode -eq 200) {
        Write-Host "Backend Health: 200" -ForegroundColor Green
    } else {
        Write-Host "Backend Health: $($backendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Backend Health: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "Frontend Health: 200" -ForegroundColor Green
    } else {
        Write-Host "Frontend Health: $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Frontend Health: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Monitoring Completed ===" -ForegroundColor Green
