-- Script khởi tạo database cho DCE
-- Tạo database webdce
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'webdce')
BEGIN
    CREATE DATABASE webdce;
END
GO

-- Sử dụng database webdce
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
GO

PRINT 'Database initialization completed successfully!';
