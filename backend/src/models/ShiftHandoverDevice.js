import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ShiftHandoverDevice = sequelize.define('ShiftHandoverDevice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    handoverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID của biên bản bàn giao'
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID của thiết bị'
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
    // Snapshot fields để lưu thông tin device tại thời điểm tạo bản ghi
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
    }
  }, {
    tableName: 'ShiftHandoverDevices',
    timestamps: true,
    indexes: [
      {
        fields: ['handoverId']
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

  // Thiết lập các mối quan hệ cho model ShiftHandoverDevice
  ShiftHandoverDevice.associate = (models) => {
    // Quan hệ với biên bản bàn giao (1 item thuộc về 1 biên bản)
    ShiftHandoverDevice.belongsTo(models.ShiftHandover, {
      foreignKey: 'handoverId',
      as: 'devices'
    });

    // Quan hệ với thiết bị (1 item thuộc về 1 thiết bị)
    ShiftHandoverDevice.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      as: 'device'
    });
  };

  // Hook để tự động lưu snapshot device trước khi tạo bản ghi
  ShiftHandoverDevice.beforeCreate(async (shiftHandoverDevice, options) => {
    if (shiftHandoverDevice.deviceId) {
      try {
        // Sử dụng options.transaction nếu có
        const device = await sequelize.models.Device.findByPk(shiftHandoverDevice.deviceId, {
          transaction: options.transaction
        });
        if (device) {
          shiftHandoverDevice.deviceNameSnapshot = device.deviceName;
          shiftHandoverDevice.deviceCategorySnapshot = device.category;
          shiftHandoverDevice.devicePositionSnapshot = device.position;
          shiftHandoverDevice.deviceSerialNumberSnapshot = device.serialNumber;
          console.log('✅ Đã lưu snapshot cho device:', device.deviceName);
        } else {
          console.log('⚠️ Không tìm thấy device ID:', shiftHandoverDevice.deviceId);
        }
      } catch (error) {
        console.error('❌ Lỗi khi lưu snapshot device trong ShiftHandoverDevice:', error);
        console.error('Device ID:', shiftHandoverDevice.deviceId);
        console.error('Error details:', error.stack);
      }
    }
  });

  return ShiftHandoverDevice;
}; 