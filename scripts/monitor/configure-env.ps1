# DCE System - Environment Variables Configuration
# Cau hinh Environment Variables cho database connection

Write-Host "=== DCE System - Environment Variables Configuration ===" -ForegroundColor Green

# Kiem tra file .env trong backend
$envFile = "C:\DceWeb\app\backend\.env"
if (Test-Path $envFile) {
    Write-Host "Tim thay file .env tai: $envFile" -ForegroundColor Green

    # Doc va hien thi cac bien quan trong
    $envContent = Get-Content $envFile
    $importantVars = @("DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD")

    foreach ($var in $importantVars) {
        $line = $envContent | Where-Object { $_ -match "^$var\s*=" }
        if ($line) {
            $value = $line -replace "^$var\s*=\s*", ""
            if ($var -eq "DB_PASSWORD") {
                Write-Host "${var}: $(if($value.Length -gt 0) { '***' } else { 'Empty' })" -ForegroundColor $(if($value.Length -gt 0) { 'Green' } else { 'Red' })
            } else {
                Write-Host "${var}: $value" -ForegroundColor Green
            }
        } else {
            Write-Host "${var}: Not found" -ForegroundColor Red
        }
    }

    # Thiet lap Environment Variables cho session hien tai
    foreach ($line in $envContent) {
        if ($line -match "^([^#][^=]+)=(.*)$") {
            $varName = $matches[1].Trim()
            $varValue = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($varName, $varValue, "Process")
            Write-Host "Set $varName for current session" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Khong tim thay file .env tai: $envFile" -ForegroundColor Red
    Write-Host "Tao file .env mau..." -ForegroundColor Yellow

    $sampleEnv = @"
# DCE System Environment Variables
DB_HOST=localhost
DB_PORT=1433
DB_NAME=dce_db
DB_USER=sa
DB_PASSWORD=your_password_here
DB_DIALECT=mssql

# Application Settings
NODE_ENV=production
PORT=5000
FRONTEND_PORT=3000

# JWT Settings
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# Email Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
"@

    $sampleEnv | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "Da tao file .env mau tai: $envFile" -ForegroundColor Green
    Write-Host "Vui long cap nhat DB_PASSWORD va cac thong tin khac!" -ForegroundColor Yellow
}

Write-Host "`n=== Environment Configuration Completed ===" -ForegroundColor Green
