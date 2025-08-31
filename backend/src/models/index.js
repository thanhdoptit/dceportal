import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import WorkShift from './WorkShift.js';
import Task from './Task.js';
import WorkSession from './WorkSession.js';
import ShiftHandover from './ShiftHandover.js';
import ShiftHandoverNote from './ShiftHandoverNote.js';
import ShiftHandoverUser from './ShiftHandoverUser.js';
import FormTemplate from './FormTemplate.js';
import TaskHistory from './TaskHistory.js';
import TaskLock from './TaskLock.js';
import ShiftCheckForm from './ShiftCheckForm.js';
import ShiftCheckItem from './ShiftCheckItem.js';
import DeviceError from './DeviceError.js';
import Device from './Device.js';
import DeviceErrorHistory from './DeviceErrorHistory.js';
import ShiftHandoverDevice from './ShiftHandoverDevice.js';
import ShiftHandoverTask from './ShiftHandoverTask.js';
import TapeData from './TapeData.js';
import Partner from './Partners.js';
import TaskUsers from './TaskUsers.js';
import Location from './Location.js';
import SystemInfo from './SystemInfo.js';
import SystemSettings from './SystemSettings.js';
import BlacklistedToken from './BlacklistedToken.js';
import RefreshToken from './RefreshToken.js';

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Initialize models
db.User = User(sequelize, Sequelize.DataTypes);
db.WorkShift = WorkShift(sequelize, Sequelize.DataTypes);
db.Task = Task(sequelize, Sequelize.DataTypes);
db.WorkSession = WorkSession(sequelize, Sequelize.DataTypes);
db.ShiftHandover = ShiftHandover(sequelize, Sequelize.DataTypes);
db.ShiftHandoverNote = ShiftHandoverNote(sequelize, Sequelize.DataTypes);
db.ShiftHandoverUser = ShiftHandoverUser(sequelize, Sequelize.DataTypes);
db.FormTemplate = FormTemplate(sequelize, Sequelize.DataTypes);
db.TaskHistory = TaskHistory(sequelize, Sequelize.DataTypes);
db.TaskLock = TaskLock(sequelize, Sequelize.DataTypes);
db.ShiftCheckForm = ShiftCheckForm(sequelize, Sequelize.DataTypes);
db.ShiftCheckItem = ShiftCheckItem(sequelize, Sequelize.DataTypes);
db.DeviceError = DeviceError(sequelize, Sequelize.DataTypes);
db.Device = Device(sequelize, Sequelize.DataTypes);
db.DeviceErrorHistory = DeviceErrorHistory(sequelize, Sequelize.DataTypes);
db.ShiftHandoverDevice = ShiftHandoverDevice(sequelize, Sequelize.DataTypes);
db.ShiftHandoverTask = ShiftHandoverTask(sequelize, Sequelize.DataTypes);
db.TapeData = TapeData(sequelize, Sequelize.DataTypes);
db.Partners = Partner(sequelize, Sequelize.DataTypes);
db.TaskUsers = TaskUsers(sequelize, Sequelize.DataTypes);
db.Location = Location(sequelize, Sequelize.DataTypes);
db.SystemInfo = SystemInfo;
db.SystemSettings = SystemSettings;
db.BlacklistedToken = BlacklistedToken;
db.RefreshToken = RefreshToken;

// Set associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const syncDatabase = async () => {
  try {
    console.log('🧹 Synchronizing tables...');

    // Drop all foreign key constraints first
    console.log('🧹 Dropping all foreign key constraints...');
    await sequelize.query(`
      DECLARE @sql NVARCHAR(MAX) = N'';
      SELECT @sql += N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id))
        + '.' + QUOTENAME(OBJECT_NAME(parent_object_id))
        + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
      FROM sys.foreign_keys;
      EXEC sp_executesql @sql;
    `);
    console.log('✅ All foreign key constraints dropped successfully');

    // Get all tables in the database
    console.log('🧹 Getting list of all tables...');
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      AND TABLE_SCHEMA = 'dbo'
      ORDER BY TABLE_NAME;
    `);
    console.log(`✅ Found ${tables.length} tables`);

    // Drop all tables
    console.log('🧹 Dropping all tables...');
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`  Dropping table: ${tableName}`);
      await sequelize.query(`DROP TABLE IF EXISTS [${tableName}]`);
    }
    console.log('✅ All tables dropped successfully');

    console.log('🧹 Creating tables...');

    // Create Users table first since it's referenced by many other tables
    await sequelize.query(`
      CREATE TABLE [Users] (
        [id] INTEGER IDENTITY(1,1),
        [username] NVARCHAR(255) NOT NULL,
        [password] NVARCHAR(255) NULL,
        [fullname] NVARCHAR(255) NOT NULL,
        [dob] DATE NULL,
        [gender] NVARCHAR(10) NULL,
        [role] NVARCHAR(20) NOT NULL DEFAULT N'user',
        [isADUser] BIT NOT NULL DEFAULT 0,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        CONSTRAINT [Users_username_unique] UNIQUE ([username])
      );
    `);

    // Create WorkShifts table
    await sequelize.query(`
      CREATE TABLE [WorkShifts] (
        [id] INTEGER IDENTITY(1,1),
        [code] NVARCHAR(50) NOT NULL,
        [name] NVARCHAR(255) NOT NULL,
        [group] NVARCHAR(100) NOT NULL,
        [index] INTEGER NOT NULL,
        [startTime] TIME NOT NULL,
        [endTime] TIME NOT NULL,
        [date] DATE NOT NULL,
        [status] NVARCHAR(20) NOT NULL DEFAULT N'waiting',
        [createdBy] INTEGER NULL,
        [confirmedAt] DATETIMEOFFSET NULL,
        [workedUsers] NVARCHAR(MAX) NULL DEFAULT N'[]',
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        CONSTRAINT [WorkShifts_code_date_unique] UNIQUE ([code], [date]),
        FOREIGN KEY ([createdBy]) REFERENCES [Users] ([id]) ON DELETE SET NULL
      );
    `);

    // Create ShiftHandovers table
    await sequelize.query(`
      CREATE TABLE [ShiftHandovers] (
        [id] INTEGER IDENTITY(1,1),
        [date] DATE NOT NULL,
        [fromShiftId] INTEGER NOT NULL,
        [toShiftId] INTEGER NOT NULL,
        [fromUserId] INTEGER NOT NULL,
        [toUserId] INTEGER NULL,
        [content] NVARCHAR(MAX) NOT NULL,
        [handoverForm] NVARCHAR(MAX) NULL,
        [attachments] NVARCHAR(MAX) NULL DEFAULT N'[]',
        [status] NVARCHAR(20) NOT NULL DEFAULT N'draft',
        [confirmNote] NVARCHAR(MAX) NULL,
        [rejectNote] NVARCHAR(MAX) NULL,
        [confirmedAt] DATETIMEOFFSET NULL,
        [rejectedAt] DATETIMEOFFSET NULL,
        [expectedNextShift] NVARCHAR(MAX) NULL,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        CONSTRAINT [shiftHandovers_fromShiftId_date_unique] UNIQUE ([fromShiftId], [date]),
        FOREIGN KEY ([fromShiftId]) REFERENCES [WorkShifts] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([toShiftId]) REFERENCES [WorkShifts] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([fromUserId]) REFERENCES [Users] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([toUserId]) REFERENCES [Users] ([id]) ON DELETE NO ACTION
      );
    `);

    // Create ShiftHandoverUsers table
    await sequelize.query(`
      CREATE TABLE [ShiftHandoverUsers] (
        [id] INTEGER IDENTITY(1,1),
        [shiftHandoverId] INTEGER NOT NULL,
        [userId] INTEGER NOT NULL,
        [type] NVARCHAR(50) NOT NULL,
        [role] NVARCHAR(50) NOT NULL DEFAULT N'handover',
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        CONSTRAINT [ShiftHandoverUsers_shiftHandoverId_userId_unique] UNIQUE ([shiftHandoverId], [userId]),
        FOREIGN KEY ([shiftHandoverId]) REFERENCES [ShiftHandovers] ([id]) ON DELETE CASCADE,
        FOREIGN KEY ([userId]) REFERENCES [Users] ([id]) ON DELETE CASCADE
      );
    `);

    // Create Devices table
    await sequelize.query(`
      CREATE TABLE [Devices] (
        [id] INTEGER IDENTITY(1,1),
        [category] NVARCHAR(255) NOT NULL,
        [deviceName] NVARCHAR(255) NOT NULL,
        [serialNumber] NVARCHAR(255) NULL,
        [location] NVARCHAR(255) NOT NULL,
        [isActive] BIT NOT NULL DEFAULT 1,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id])
      );
      CREATE INDEX [IX_Devices_category] ON [Devices] ([category]);
      CREATE INDEX [IX_Devices_deviceName] ON [Devices] ([deviceName]);
      CREATE INDEX [IX_Devices_serialNumber] ON [Devices] ([serialNumber]);
      CREATE INDEX [IX_Devices_isActive] ON [Devices] ([isActive]);
    `);

    // Create WorkSessions table
    await sequelize.query(`
      CREATE TABLE [WorkSessions] (
        [id] INTEGER IDENTITY(1,1),
        [userId] INTEGER NOT NULL,
        [workShiftId] INTEGER NOT NULL,
        [date] DATE NOT NULL,
        [status] NVARCHAR(50) NOT NULL DEFAULT N'active',
        [startedAt] DATETIMEOFFSET NULL,
        [endedAt] DATETIMEOFFSET NULL,
        [notes] NVARCHAR(MAX) NULL,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        CONSTRAINT [workSessions_user_date_unique] UNIQUE ([userId], [date]),
        FOREIGN KEY ([userId]) REFERENCES [Users] ([id]) ON DELETE CASCADE,
        FOREIGN KEY ([workShiftId]) REFERENCES [WorkShifts] ([id]) ON DELETE CASCADE
      );
    `);

    // Create Tasks table
    await sequelize.query(`
      CREATE TABLE [Tasks] (
        [id] INTEGER IDENTITY(1,1),
        [location] NVARCHAR(255) NOT NULL,
        [fullName] NVARCHAR(255) NOT NULL,
        [checkInTime] DATETIMEOFFSET NOT NULL,
        [checkOutTime] DATETIMEOFFSET NULL,
        [taskDescription] NVARCHAR(MAX) NULL,
        [taskTitle] NVARCHAR(MAX) NULL,
        [signature] NVARCHAR(255) NULL,
        [status] NVARCHAR(50) NOT NULL DEFAULT N'waiting',
        [attachments] NVARCHAR(MAX) NULL,
        [completedAt] DATETIMEOFFSET NULL,
        [cancelReason] NVARCHAR(MAX) NULL,
        [userId] INTEGER NULL,
        [createdBy] INTEGER NULL,
        [completedBy] INTEGER NULL,
        [workSessionId] INTEGER NULL,
        [workShiftId] INTEGER NULL,
        [location] NVARCHAR(255) NOT NULL,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([userId]) REFERENCES [Users] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([createdBy]) REFERENCES [Users] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([completedBy]) REFERENCES [Users] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([workSessionId]) REFERENCES [WorkSessions] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([workShiftId]) REFERENCES [WorkShifts] ([id]) ON DELETE NO ACTION
      );
    `);

    // Create ShiftHandoverTasks table
    await sequelize.query(`
      CREATE TABLE [ShiftHandoverTasks] (
        [id] INTEGER IDENTITY(1,1),
        [handoverId] INTEGER NOT NULL,
        [taskId] INTEGER NOT NULL,
        [location] NVARCHAR(255) NOT NULL,
        [fullName] NVARCHAR(255) NOT NULL,
        [taskTitle] NVARCHAR(MAX) NULL,
        [taskDescription] NVARCHAR(MAX) NULL,
        [status] NVARCHAR(50) NOT NULL,
        [attachments] NVARCHAR(MAX) NULL,
        [checkInTime] DATETIMEOFFSET NULL,
        [checkOutTime] DATETIMEOFFSET NULL,
        [signature] NVARCHAR(255) NULL,
        [completedAt] DATETIMEOFFSET NULL,
        [cancelReason] NVARCHAR(MAX) NULL,
        [userId] INTEGER NULL,
        [createdBy] INTEGER NULL,
        [completedBy] INTEGER NULL,
        [workSessionId] INTEGER NULL,
        [workShiftId] INTEGER NULL,
        [index] INTEGER NOT NULL DEFAULT 0,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([handoverId]) REFERENCES [ShiftHandovers] ([id]) ON DELETE CASCADE,
        FOREIGN KEY ([taskId]) REFERENCES [Tasks] ([id]) ON DELETE CASCADE,
        FOREIGN KEY ([userId]) REFERENCES [Users] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([createdBy]) REFERENCES [Users] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([completedBy]) REFERENCES [Users] ([id]) ON DELETE NO ACTION
      );
      CREATE INDEX [IX_ShiftHandoverTasks_handoverId] ON [ShiftHandoverTasks] ([handoverId]);
      CREATE INDEX [IX_ShiftHandoverTasks_taskId] ON [ShiftHandoverTasks] ([taskId]);
    `);

    // Create ShiftCheckForms table
    await sequelize.query(`
      CREATE TABLE [ShiftCheckForms] (
        [id] INTEGER IDENTITY(1,1),
        [workShiftId] INTEGER NOT NULL,
        [checkerId] INTEGER NOT NULL,
        [location] NVARCHAR(255) NOT NULL,
        [checkedAt] DATETIMEOFFSET NOT NULL,
        [date] DATE NOT NULL,
        [shift] NVARCHAR(50) NOT NULL,
        [notes] NVARCHAR(MAX) NULL,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([workShiftId]) REFERENCES [WorkShifts] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([checkerId]) REFERENCES [Users] ([id]) ON DELETE NO ACTION
      );
      CREATE INDEX [IX_ShiftCheckForms_workShiftId] ON [ShiftCheckForms] ([workShiftId]);
      CREATE INDEX [IX_ShiftCheckForms_checkerId] ON [ShiftCheckForms] ([checkerId]);
      CREATE INDEX [IX_ShiftCheckForms_date] ON [ShiftCheckForms] ([date]);
      CREATE INDEX [IX_ShiftCheckForms_shift] ON [ShiftCheckForms] ([shift]);
    `);

    // Create ShiftCheckItems table
    await sequelize.query(`
      CREATE TABLE [ShiftCheckItems] (
        [id] INTEGER IDENTITY(1,1),
        [formId] INTEGER NULL,
        [deviceId] INTEGER NOT NULL,
        [subDeviceName] NVARCHAR(255) NULL,
        [serialNumber] NVARCHAR(255) NULL,
        [errorCode] NVARCHAR(50) NULL,
        [errorCause] NVARCHAR(MAX) NULL,
        [solution] NVARCHAR(MAX) NULL,
        [index] INTEGER NOT NULL,
        [status] NVARCHAR(50) NOT NULL DEFAULT N'Bình thường',
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([formId]) REFERENCES [ShiftCheckForms] ([id]) ON DELETE CASCADE,
        FOREIGN KEY ([deviceId]) REFERENCES [Devices] ([id]) ON DELETE NO ACTION
      );
      CREATE INDEX [IX_ShiftCheckItems_formId] ON [ShiftCheckItems] ([formId]);
      CREATE INDEX [IX_ShiftCheckItems_deviceId] ON [ShiftCheckItems] ([deviceId]);
      CREATE INDEX [IX_ShiftCheckItems_status] ON [ShiftCheckItems] ([status]);
    `);

    // Create DeviceErrors table
    await sequelize.query(`
      CREATE TABLE [DeviceErrors] (
        [id] INTEGER IDENTITY(1,1),
        [deviceId] INTEGER NOT NULL,
        [location] NVARCHAR(255) NULL,
        [subDeviceName] NVARCHAR(255) NOT NULL,
        [serialNumber] NVARCHAR(255) NULL,
        [errorCode] NVARCHAR(50) NOT NULL,
        [errorCause] NVARCHAR(MAX) NOT NULL,
        [solution] NVARCHAR(MAX) NULL,
        [resolveStatus] NVARCHAR(50) NOT NULL DEFAULT N'Chưa xử lý',
        [resolvedAt] DATETIMEOFFSET NULL,
        [resolvedBy] NVARCHAR(50) NULL,
        [resolveNote] NVARCHAR(MAX) NULL,
        [createdBy] NVARCHAR(50) NULL,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([deviceId]) REFERENCES [Devices] ([id]) ON DELETE NO ACTION
      );
      CREATE INDEX [IX_DeviceErrors_deviceId] ON [DeviceErrors] ([deviceId]);
      CREATE INDEX [IX_DeviceErrors_subDeviceName] ON [DeviceErrors] ([subDeviceName]);
      CREATE INDEX [IX_DeviceErrors_serialNumber] ON [DeviceErrors] ([serialNumber]);
      CREATE INDEX [IX_DeviceErrors_resolveStatus] ON [DeviceErrors] ([resolveStatus]);
      CREATE INDEX [IX_DeviceErrors_resolvedBy] ON [DeviceErrors] ([resolvedBy]);
      CREATE INDEX [IX_DeviceErrors_createdBy] ON [DeviceErrors] ([createdBy]);
    `);

    // Create DeviceErrorHistories table
    await sequelize.query(`
      CREATE TABLE [DeviceErrorHistories] (
        [id] INTEGER IDENTITY(1,1),
        [errorId] INTEGER NOT NULL,
        [changedBy] INTEGER NULL,
        [changeId] NVARCHAR(36) NULL,
        [changeType] NVARCHAR(20) NOT NULL,
        [field] NVARCHAR(255) NULL,
        [oldValue] NVARCHAR(MAX) NULL,
        [newValue] NVARCHAR(MAX) NULL,
        [changeReason] NVARCHAR(MAX) NULL,
        [isAutomatic] BIT NOT NULL DEFAULT 0,
        [createdAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([errorId]) REFERENCES [DeviceErrors] ([id]) ON DELETE CASCADE,
        FOREIGN KEY ([changedBy]) REFERENCES [Users] ([id]) ON DELETE CASCADE
      );
      CREATE INDEX [IX_DeviceErrorHistories_errorId] ON [DeviceErrorHistories] ([errorId]);
      CREATE INDEX [IX_DeviceErrorHistories_changedBy] ON [DeviceErrorHistories] ([changedBy]);
      CREATE INDEX [IX_DeviceErrorHistories_changeType] ON [DeviceErrorHistories] ([changeType]);
    `);

    // Create ShiftHandoverNotes table
    await sequelize.query(`
      CREATE TABLE [ShiftHandoverNotes] (
        [id] INTEGER IDENTITY(1,1),
        [handoverId] INTEGER NOT NULL,
        [userId] INTEGER NOT NULL,
        [content] NVARCHAR(MAX) NOT NULL,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([handoverId]) REFERENCES [ShiftHandovers] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([userId]) REFERENCES [Users] ([id]) ON DELETE NO ACTION
      );
    `);

    // Create ShiftHandoverDevices table
    await sequelize.query(`
      CREATE TABLE [ShiftHandoverDevices] (
        [id] INTEGER IDENTITY(1,1),
        [handoverId] INTEGER NULL,
        [deviceId] INTEGER NOT NULL,
        [subDeviceName] NVARCHAR(255) NULL,
        [serialNumber] NVARCHAR(255) NULL,
        [errorCode] NVARCHAR(50) NULL,
        [errorCause] NVARCHAR(MAX) NULL,
        [solution] NVARCHAR(MAX) NULL,
        [index] INTEGER NOT NULL,
        [status] NVARCHAR(50) NOT NULL DEFAULT N'Bình thường',
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([handoverId]) REFERENCES [ShiftHandovers] ([id]) ON DELETE CASCADE,
        FOREIGN KEY ([deviceId]) REFERENCES [Devices] ([id]) ON DELETE NO ACTION
      );
      CREATE INDEX [IX_ShiftHandoverDevices_handoverId] ON [ShiftHandoverDevices] ([handoverId]);
      CREATE INDEX [IX_ShiftHandoverDevices_deviceId] ON [ShiftHandoverDevices] ([deviceId]);
      CREATE INDEX [IX_ShiftHandoverDevices_status] ON [ShiftHandoverDevices] ([status]);
    `);

    // Create FormTemplates table
    await sequelize.query(`
      CREATE TABLE [FormTemplates] (
        [id] INTEGER IDENTITY(1,1),
        [type] NVARCHAR(20) NOT NULL DEFAULT N'handover',
        [content] NVARCHAR(MAX) NOT NULL,
        [isActive] BIT NOT NULL DEFAULT 1,
        [createdBy] INTEGER NOT NULL,
        [updatedBy] INTEGER NULL,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([createdBy]) REFERENCES [Users] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([updatedBy]) REFERENCES [Users] ([id]) ON DELETE NO ACTION
      );
    `);

    // Create TaskHistories table
    await sequelize.query(`
      CREATE TABLE [TaskHistories] (
        [id] INTEGER IDENTITY(1,1),
        [taskId] INTEGER NOT NULL,
        [changedBy] INTEGER NULL,
        [changeType] NVARCHAR(20) NOT NULL,
        [changeGroupId] NVARCHAR(36) NOT NULL,
        [field] NVARCHAR(255) NULL,
        [oldValue] NVARCHAR(MAX) NULL,
        [newValue] NVARCHAR(MAX) NULL,
        [changeReason] NVARCHAR(MAX) NULL,
        [isAutomatic] BIT NOT NULL DEFAULT 0,
        [createdAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([taskId]) REFERENCES [Tasks] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([changedBy]) REFERENCES [Users] ([id]) ON DELETE NO ACTION
      );
    `);

    // Create TaskLocks table
    await sequelize.query(`
      CREATE TABLE [TaskLocks] (
        [id] INTEGER IDENTITY(1,1),
        [taskId] INTEGER NOT NULL,
        [lockedBy] INTEGER NOT NULL,
        [lockedAt] DATETIMEOFFSET NOT NULL DEFAULT GETDATE(),
        [expiresAt] DATETIMEOFFSET NOT NULL,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        FOREIGN KEY ([taskId]) REFERENCES [Tasks] ([id]) ON DELETE NO ACTION,
        FOREIGN KEY ([lockedBy]) REFERENCES [Users] ([id]) ON DELETE NO ACTION
      );
    `);

    // Create Locations table
    await sequelize.query(`
      CREATE TABLE [Locations] (
        [id] INTEGER IDENTITY(1,1),
        [name] NVARCHAR(255) NOT NULL,
        [code] NVARCHAR(50) NOT NULL,
        [description] NVARCHAR(MAX) NULL,
        [hotline] NVARCHAR(50) NULL,
        [isActive] BIT NOT NULL DEFAULT 1,
        [createdBy] INTEGER NULL,
        [updatedBy] INTEGER NULL,
        [createdAt] DATETIMEOFFSET NOT NULL,
        [updatedAt] DATETIMEOFFSET NOT NULL,
        PRIMARY KEY ([id]),
        CONSTRAINT [Locations_code_unique] UNIQUE ([code]),
        FOREIGN KEY ([createdBy]) REFERENCES [Users] ([id]) ON DELETE SET NULL,
        FOREIGN KEY ([updatedBy]) REFERENCES [Users] ([id]) ON DELETE SET NULL
      );
      CREATE INDEX [IX_Locations_name] ON [Locations] ([name]);
      CREATE INDEX [IX_Locations_code] ON [Locations] ([code]);
      CREATE INDEX [IX_Locations_isActive] ON [Locations] ([isActive]);
    `);

    console.log('🎉 Database setup completed successfully');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
};

// Export both named and default exports
export { syncDatabase };
export default db;
