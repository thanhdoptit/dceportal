-- Tạo index cho date và status
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_WorkShifts_date_status' AND object_id = OBJECT_ID('WorkShifts'))
BEGIN
    DROP INDEX IX_WorkShifts_date_status ON WorkShifts;
END
CREATE NONCLUSTERED INDEX IX_WorkShifts_date_status 
ON WorkShifts (date, status)
INCLUDE (code, name, [group], [index]);

-- Tạo index cho group và index
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_WorkShifts_group_index' AND object_id = OBJECT_ID('WorkShifts'))
BEGIN
    DROP INDEX IX_WorkShifts_group_index ON WorkShifts;
END
CREATE NONCLUSTERED INDEX IX_WorkShifts_group_index 
ON WorkShifts ([group], [index])
INCLUDE (code, name, date, status);

-- Tạo index cho status
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_WorkShifts_status' AND object_id = OBJECT_ID('WorkShifts'))
BEGIN
    DROP INDEX IX_WorkShifts_status ON WorkShifts;
END
CREATE NONCLUSTERED INDEX IX_WorkShifts_status 
ON WorkShifts (status)
INCLUDE (code, name, date, [group], [index]);

-- Tạo index cho workShiftId và status
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_WorkSessions_workShiftId_status' AND object_id = OBJECT_ID('WorkSessions'))
BEGIN
    DROP INDEX IX_WorkSessions_workShiftId_status ON WorkSessions;
END
CREATE NONCLUSTERED INDEX IX_WorkSessions_workShiftId_status 
ON WorkSessions (workShiftId, status)
INCLUDE (userId, date, startedAt, endedAt);

-- Tạo index cho userId và status
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_WorkSessions_userId_status' AND object_id = OBJECT_ID('WorkSessions'))
BEGIN
    DROP INDEX IX_WorkSessions_userId_status ON WorkSessions;
END
CREATE NONCLUSTERED INDEX IX_WorkSessions_userId_status 
ON WorkSessions (userId, status)
INCLUDE (workShiftId, date, startedAt, endedAt);

-- Tạo index cho date và status
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_WorkSessions_date_status' AND object_id = OBJECT_ID('WorkSessions'))
BEGIN
    DROP INDEX IX_WorkSessions_date_status ON WorkSessions;
END
CREATE NONCLUSTERED INDEX IX_WorkSessions_date_status 
ON WorkSessions (date, status)
INCLUDE (userId, workShiftId, startedAt, endedAt);

-- Tạo index cho status và date
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ShiftHandovers_status_date' AND object_id = OBJECT_ID('ShiftHandovers'))
BEGIN
    DROP INDEX IX_ShiftHandovers_status_date ON ShiftHandovers;
END
CREATE NONCLUSTERED INDEX IX_ShiftHandovers_status_date 
ON ShiftHandovers (status, date)
INCLUDE (fromShiftId, toShiftId, fromUserId, toUserId);

-- Tạo index cho fromShiftId và status
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ShiftHandovers_fromShiftId_status' AND object_id = OBJECT_ID('ShiftHandovers'))
BEGIN
    DROP INDEX IX_ShiftHandovers_fromShiftId_status ON ShiftHandovers;
END
CREATE NONCLUSTERED INDEX IX_ShiftHandovers_fromShiftId_status 
ON ShiftHandovers (fromShiftId, status)
INCLUDE (date, toShiftId, fromUserId, toUserId);

-- Tạo index cho toShiftId và status
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ShiftHandovers_toShiftId_status' AND object_id = OBJECT_ID('ShiftHandovers'))
BEGIN
    DROP INDEX IX_ShiftHandovers_toShiftId_status ON ShiftHandovers;
END
CREATE NONCLUSTERED INDEX IX_ShiftHandovers_toShiftId_status 
ON ShiftHandovers (toShiftId, status)
INCLUDE (date, fromShiftId, fromUserId, toUserId);

-- Tạo index cho workShiftId và status
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_workShiftId_status' AND object_id = OBJECT_ID('Tasks'))
BEGIN
    DROP INDEX IX_Tasks_workShiftId_status ON Tasks;
END
CREATE NONCLUSTERED INDEX IX_Tasks_workShiftId_status 
ON Tasks (workShiftId, status)
INCLUDE (name, fullName, checkInTime, checkOutTime, userId);

-- Tạo index cho userId và status
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_userId_status' AND object_id = OBJECT_ID('Tasks'))
BEGIN
    DROP INDEX IX_Tasks_userId_status ON Tasks;
END
CREATE NONCLUSTERED INDEX IX_Tasks_userId_status 
ON Tasks (userId, status)
INCLUDE (name, fullName, checkInTime, checkOutTime, workShiftId);

-- Tạo index cho status và checkOutTime
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_status_checkOutTime' AND object_id = OBJECT_ID('Tasks'))
BEGIN
    DROP INDEX IX_Tasks_status_checkOutTime ON Tasks;
END
CREATE NONCLUSTERED INDEX IX_Tasks_status_checkOutTime 
ON Tasks (status, checkOutTime)
INCLUDE (name, fullName, workShiftId, userId);

-- Tạo index cho handoverId
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ShiftHandoverTasks_handoverId' AND object_id = OBJECT_ID('ShiftHandoverTasks'))
BEGIN
    DROP INDEX IX_ShiftHandoverTasks_handoverId ON ShiftHandoverTasks;
END
CREATE NONCLUSTERED INDEX IX_ShiftHandoverTasks_handoverId 
ON ShiftHandoverTasks (handoverId)
INCLUDE (taskId, name, status, [index]);

-- Tạo index cho taskId
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ShiftHandoverTasks_taskId' AND object_id = OBJECT_ID('ShiftHandoverTasks'))
BEGIN
    DROP INDEX IX_ShiftHandoverTasks_taskId ON ShiftHandoverTasks;
END
CREATE NONCLUSTERED INDEX IX_ShiftHandoverTasks_taskId 
ON ShiftHandoverTasks (taskId)
INCLUDE (handoverId, name, status, [index]);

-- Tạo index cho shiftHandoverId và type
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ShiftHandoverUsers_shiftHandoverId_type' AND object_id = OBJECT_ID('ShiftHandoverUsers'))
BEGIN
    DROP INDEX IX_ShiftHandoverUsers_shiftHandoverId_type ON ShiftHandoverUsers;
END
CREATE NONCLUSTERED INDEX IX_ShiftHandoverUsers_shiftHandoverId_type 
ON ShiftHandoverUsers (shiftHandoverId, type)
INCLUDE (userId, role);

-- Tạo index cho userId và type
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ShiftHandoverUsers_userId_type' AND object_id = OBJECT_ID('ShiftHandoverUsers'))
BEGIN
    DROP INDEX IX_ShiftHandoverUsers_userId_type ON ShiftHandoverUsers;
END
CREATE NONCLUSTERED INDEX IX_ShiftHandoverUsers_userId_type 
ON ShiftHandoverUsers (userId, type)
INCLUDE (shiftHandoverId, role);

-- Tạo index cho TaskHistories
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TaskHistories_taskId_createdAt' AND object_id = OBJECT_ID('TaskHistories'))
BEGIN
    DROP INDEX IX_TaskHistories_taskId_createdAt ON TaskHistories;
END
CREATE NONCLUSTERED INDEX IX_TaskHistories_taskId_createdAt 
ON TaskHistories (taskId, createdAt)
INCLUDE (changedBy, changeReason, isAutomatic);

-- Tạo index cho createdBy và createdAt
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_createdBy_createdAt' AND object_id = OBJECT_ID('Tasks'))
BEGIN
    DROP INDEX IX_Tasks_createdBy_createdAt ON Tasks;
END
CREATE NONCLUSTERED INDEX IX_Tasks_createdBy_createdAt 
ON Tasks (createdBy, createdAt)
INCLUDE (name, fullName, status, checkInTime, checkOutTime);

-- Tạo index cho completedBy và completedAt
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_completedBy_completedAt' AND object_id = OBJECT_ID('Tasks'))
BEGIN
    DROP INDEX IX_Tasks_completedBy_completedAt ON Tasks;
END
CREATE NONCLUSTERED INDEX IX_Tasks_completedBy_completedAt 
ON Tasks (completedBy, completedAt)
INCLUDE (name, fullName, status, checkInTime, checkOutTime);

-- Tạo index cho checkInTime và checkOutTime
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tasks_checkInTime_checkOutTime' AND object_id = OBJECT_ID('Tasks'))
BEGIN
    DROP INDEX IX_Tasks_checkInTime_checkOutTime ON Tasks;
END
CREATE NONCLUSTERED INDEX IX_Tasks_checkInTime_checkOutTime 
ON Tasks (checkInTime, checkOutTime)
INCLUDE (name, fullName, status, userId, workShiftId);

-- Tạo index cho WorkShifts để tối ưu việc lấy ca hiện tại và ca có sẵn
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_WorkShifts_date_code_status' AND object_id = OBJECT_ID('WorkShifts'))
BEGIN
    DROP INDEX IX_WorkShifts_date_code_status ON WorkShifts;
END
CREATE NONCLUSTERED INDEX IX_WorkShifts_date_code_status 
ON WorkShifts (date, code, status)
INCLUDE (name, [group], [index]);

-- Tạo index cho WorkSessions để tối ưu việc lấy thông tin người dùng trong ca
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_WorkSessions_workShiftId_date' AND object_id = OBJECT_ID('WorkSessions'))
BEGIN
    DROP INDEX IX_WorkSessions_workShiftId_date ON WorkSessions;
END
CREATE NONCLUSTERED INDEX IX_WorkSessions_workShiftId_date 
ON WorkSessions (workShiftId, date)
INCLUDE (userId, status, startedAt, endedAt);

