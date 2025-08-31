import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ShiftCheckItem = sequelize.define('ShiftCheckItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    formId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID của form kiểm tra'
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID của thiết bị'
    },
    // Thêm các trường snapshot để lưu thông tin device tại thời điểm tạo
    deviceNameSnapshot: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Tên thiết bị tại thời điểm tạo bản ghi (snapshot)'
    },
    deviceCategorySnapshot: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Danh mục thiết bị tại thời điểm tạo bản ghi (snapshot)'
    },
    devicePositionSnapshot: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Vị trí thiết bị tại thời điểm tạo bản ghi (snapshot)'
    },
    deviceSerialNumberSnapshot: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Số serial thiết bị tại thời điểm tạo bản ghi (snapshot)'
    },
    subDeviceName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Tên thiết bị cụ thể bị lỗi'      
    },
    serialNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Số serial của thiết bị'
    },
    errorCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Mã lỗi'
    },
    errorCause: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Nguyên nhân lỗi'
    },
    solution: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Giải pháp khắc phục'
    },
    resolveStatus: {
      type: DataTypes.ENUM('Chưa xử lý', 'Đang xử lý', 'Đã xử lý'),
      allowNull: false,
      defaultValue: 'Chưa xử lý',
      comment: 'Trạng thái xử lý lỗi: Chưa xử lý -> Đang xử lý -> Đã xử lý'
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Thứ tự hiển thị'
    },
    status: {
      type: DataTypes.ENUM('Bình thường', 'Có lỗi'),
      allowNull: false,
      defaultValue: 'Bình thường',
      comment: 'Trạng thái thiết bị: Bình thường, Có lỗi'
    },       
     }, {
    tableName: 'ShiftCheckItems',
    timestamps: true,
    indexes: [
      {
        fields: ['formId']
      },
      {
        fields: ['deviceId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['deviceNameSnapshot']
      }
    ]
  });

  // Thiết lập các mối quan hệ cho model ShiftCheckItem
  ShiftCheckItem.associate = (models) => {
    // Quan hệ với form kiểm tra (1 item thuộc về 1 form)
    ShiftCheckItem.belongsTo(models.ShiftCheckForm, {
      foreignKey: 'formId',
      as: 'form'
    });

    // Quan hệ với thiết bị (1 item thuộc về 1 thiết bị)
    ShiftCheckItem.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      as: 'device'
    });
  };

  // Hook để tự động lưu snapshot khi tạo mới
  ShiftCheckItem.beforeCreate(async (shiftCheckItem, options) => {
    if (shiftCheckItem.deviceId) {
      try {
        const device = await sequelize.models.Device.findByPk(shiftCheckItem.deviceId);
        if (device) {
          shiftCheckItem.deviceNameSnapshot = device.deviceName;
          shiftCheckItem.deviceCategorySnapshot = device.category;
          shiftCheckItem.devicePositionSnapshot = device.position;
          shiftCheckItem.deviceSerialNumberSnapshot = device.serialNumber;
        }
      } catch (error) {
        console.error('Lỗi khi lưu snapshot device:', error);
      }
    }
  });

  return ShiftCheckItem;
}; 