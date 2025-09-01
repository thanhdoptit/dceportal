

:: file log theo yyyyMMdd
for /f %%i in ('wmic os get LocalDateTime ^| find "."') do set dt=%%i
set today=%dt:~0,4%%dt:~4,2%%dt:~6,2%

:: CreateFolder
set src=C:\DceWeb\app\backup
set dest=Z:\BackupDcePortal
if not exist "%dest%" mkdir "%dest%"


:: LogsFolder
set logdir=Z:\BackupLogs
if not exist "%logdir%" mkdir "%logdir%"


set logfile=%logdir%\backup_%today%.log

:: Log
robocopy "%src%" "%dest%" /MIR /Z /MT:32 /R:2 /W:5 /TEE /LOG:"%logfile%"

echo.
echo Backup completed on %today%
endlocal
exit
