import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SystemInfo = sequelize.define('SystemInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  systemType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Loại hệ thống: UPS, COOLING, FIRE, SECURITY, etc.'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Tiêu đề hệ thống'
  },
  subtitle: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Mô tả ngắn'
  },
  
  // 5 cột chính được tách riêng
  purpose: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Mục đích của hệ thống'
  },
  components: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Thành phần chính của hệ thống'
  },
  operation: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Nguyên lý vận hành hệ thống'
  },
  procedures: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Quy trình quy định vận hành'
  },
  troubleshooting: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Sự cố thường gặp và cách xử lý'
  },
  
  // Các field bổ sung (giữ trong JSON)
  content: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Nội dung bổ sung: diagram, notes, metadata, files',
    get() {
      const value = this.getDataValue('content');
      if (!value) return {};
      
      // Nếu là string, parse JSON
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (error) {
          console.error('Lỗi parse content:', error);
          return {};
        }
      }
      
      return value || {};
    },
    set(value) {
      // Đảm bảo luôn lưu object hợp lệ
      const cleanValue = typeof value === 'object' ? value : {};
      this.setDataValue('content', cleanValue);
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Trạng thái hoạt động'
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID người cập nhật cuối'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Thời gian tạo'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Thời gian cập nhật cuối'
  }
}, {
  tableName: 'system_info',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Định nghĩa association sau khi model được tạo
SystemInfo.associate = (models) => {
  SystemInfo.belongsTo(models.User, {
    foreignKey: 'updatedBy',
    as: 'updater'
  });
};

export default SystemInfo; 