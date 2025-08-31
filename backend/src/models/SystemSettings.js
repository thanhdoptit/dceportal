import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SystemSettings = sequelize.define('SystemSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Khóa cấu hình (ví dụ: email_smtp_host, email_smtp_port)'
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Giá trị cấu hình'
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Mô tả cấu hình'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'general',
    comment: 'Phân loại cấu hình (email, system, notification...)'
  },
  isEncrypted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Có mã hóa giá trị hay không (cho password)'
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID user cập nhật cuối cùng'
  }
}, {
  tableName: 'system_settings',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['key']
    },
    {
      fields: ['category']
    }
  ]
});

export default SystemSettings; 