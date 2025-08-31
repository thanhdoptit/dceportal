-- Script restore backup mới nhất cho webdce
USE master;
GO

-- Thông tin backup file
DECLARE @BackupFile NVARCHAR(500) = '/var/opt/mssql/backup/webdce_FULL_20250824_230000.bak';
DECLARE @DataPath NVARCHAR(500) = '/var/opt/mssql/data/';
DECLARE @LogPath NVARCHAR(500) = '/var/opt/mssql/data/';

-- Nếu database webdce đã tồn tại, xóa nó
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'webdce')
BEGIN
    PRINT 'Đang xóa database webdce cũ...';
    ALTER DATABASE webdce SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE webdce;
    PRINT 'Database webdce cũ đã được xóa.';
END

-- Restore database từ backup
PRINT 'Đang restore database webdce từ backup...';
RESTORE DATABASE webdce
FROM DISK = @BackupFile
WITH MOVE 'webdce' TO @DataPath + 'webdce.mdf',
     MOVE 'webdce_log' TO @LogPath + 'webdce_log.ldf',
     REPLACE;
GO

-- Chuyển database về multi-user mode
ALTER DATABASE webdce SET MULTI_USER;
GO

-- Kiểm tra kết quả
USE webdce;
GO

PRINT 'Restore database webdce hoan tat thanh cong!';
PRINT 'Database: ' + DB_NAME();
GO
