export default (sequelize, DataTypes) => {
  const BackupJob = sequelize.define('BackupJob', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Thông tin cơ bản
  job_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Tên job backup'
  },
  
  job_type: {
    type: DataTypes.ENUM('EXPORT', 'BACKUP_DISK', 'BACKUP_TAPE', 'SYNC'),
    allowNull: false,
    comment: 'Loại job'
  },
  
  status: {
    type: DataTypes.ENUM('RUNNING', 'COMPLETED', 'FAILED', 'PENDING', 'COMPLETED_WITH_WARNINGS'),
    defaultValue: 'PENDING',
    comment: 'Trạng thái job'
  },
  
  // Thông tin client
  client_ip: {
    type: DataTypes.STRING(50),
    comment: 'IP của client'
  },
  
  client_name: {
    type: DataTypes.STRING(255),
    comment: 'Tên client'
  },
  
  // Đường dẫn
  export_path: {
    type: DataTypes.TEXT,
    comment: 'Đường dẫn export từ DBA'
  },
  
  local_check_path: {
    type: DataTypes.TEXT,
    comment: 'Đường dẫn kiểm tra local'
  },
  
  // Thông tin dữ liệu
  export_files: {
    type: DataTypes.STRING(255),
    comment: 'Số lượng file export'
  },
  
  data_size: {
    type: DataTypes.BIGINT,
    comment: 'Dung lượng dữ liệu (bytes)'
  },
  
  // Thời gian
  scheduled_time: {
    type: DataTypes.TIME,
    comment: 'Thời gian lên lịch chạy'
  },
  
  start_time: {
    type: DataTypes.DATE,
    comment: 'Thời gian bắt đầu'
  },
  
  end_time: {
    type: DataTypes.DATE,
    comment: 'Thời gian kết thúc'
  },
  
  // Backup to DISK/TAPE
  backup_disk_path: {
    type: DataTypes.TEXT,
    comment: 'Đường dẫn backup DISK'
  },
  
  backup_tape_path: {
    type: DataTypes.TEXT,
    comment: 'Đường dẫn backup TAPE'
  },
  
  backup_end_time: {
    type: DataTypes.DATE,
    comment: 'Thời gian kết thúc backup'
  },
  
  backup_result: {
    type: DataTypes.STRING(100),
    comment: 'Kết quả backup'
  },
  
  // Người kiểm tra
  checked_by: {
    type: DataTypes.STRING(100),
    comment: 'Người kiểm tra'
  },
  
  checked_at: {
    type: DataTypes.DATE,
    comment: 'Thời gian kiểm tra'
  },
  
  // Mô tả và lỗi
  description: {
    type: DataTypes.TEXT,
    comment: 'Mô tả job'
  },
  
  error_description: {
    type: DataTypes.TEXT,
    comment: 'Mô tả lỗi và khắc phục'
  },
  
  // Lịch chạy
  schedule_info: {
    type: DataTypes.TEXT,
    comment: 'Thông tin lịch chạy'
  },
  
  // CommVault specific
  commvault_job_id: {
    type: DataTypes.STRING(50),
    comment: 'ID job trong CommVault'
  },
  
  tape_label: {
    type: DataTypes.STRING(50),
    comment: 'Nhãn tape'
  },
  
  // Metadata
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'backup_jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

  BackupJob.associate = (models) => {
    BackupJob.hasMany(models.BackupDetail, {
      foreignKey: 'backup_job_id',
      as: 'details',
      onDelete: 'CASCADE'
    });
  };

  return BackupJob;
}; 