export default (sequelize, DataTypes) => {
  const BackupDetail = sequelize.define('BackupDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  backup_job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'backup_jobs',
      key: 'id'
    },
    comment: 'ID của backup job'
  },
  
  file_path: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Đường dẫn file'
  },
  
  file_name: {
    type: DataTypes.STRING(255),
    comment: 'Tên file'
  },
  
  file_size: {
    type: DataTypes.BIGINT,
    comment: 'Kích thước file (bytes)'
  },
  
  file_type: {
    type: DataTypes.STRING(50),
    comment: 'Loại file'
  },
  
  backup_time: {
    type: DataTypes.DATE,
    comment: 'Thời gian backup'
  },
  
  retention_days: {
    type: DataTypes.INTEGER,
    comment: 'Số ngày lưu trữ'
  },
  
  checksum: {
    type: DataTypes.STRING(255),
    comment: 'Checksum của file'
  },
  
  status: {
    type: DataTypes.ENUM('BACKED_UP', 'VERIFIED', 'CORRUPTED', 'MISSING'),
    defaultValue: 'BACKED_UP',
    comment: 'Trạng thái file'
  },
  
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'backup_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

  BackupDetail.associate = (models) => {
    BackupDetail.belongsTo(models.BackupJob, {
      foreignKey: 'backup_job_id',
      as: 'backupJob',
      onDelete: 'CASCADE'
    });
  };

  return BackupDetail;
}; 