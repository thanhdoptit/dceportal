@echo off
setlocal

:: Thông tin cau hinh
set SERVERNAME=localhost\MSSQLSERVER1
set DBNAME=webdce
set BACKUPPATH=C:\DceWeb\app\uploads\backupDB\webdce_%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%.bak
set USERNAME=sa
set PASSWORD=Ab123456

:: Proccessing
sqlcmd -S %SERVERNAME% -U %USERNAME% -P %PASSWORD% -Q "BACKUP DATABASE [%DBNAME%] TO DISK = N'%BACKUPPATH%' WITH INIT, FORMAT, STATS = 10"

echo Backup completed: %BACKUPPATH%
