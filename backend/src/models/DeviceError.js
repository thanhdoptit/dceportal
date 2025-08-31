export default (sequelize, DataTypes) => {
  const DeviceError = sequelize.define('DeviceError', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Devices',
        key: 'id'
      },
      comment: 'ID của thiết bị (FK)',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Địa điểm kiểm tra thiết bị'
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Vị trí thiết bị trong rack (ví dụ: Rack A1, Slot 2)'
    },
    subDeviceName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Tên thiết bị cụ thể bị lỗi'
    },
    serialNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Số serial của thiết bị'
    },
    errorCode: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Mã lỗi'
    },
    errorCause: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Thời điểm xử lý xong'
    },
    resolvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID người xử lý'
    },
    resolveNote: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ghi chú khi xử lý lỗi'
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Danh sách đường dẫn hình ảnh lỗi (JSON array)'
    },
    createdBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Username người tạo lỗi'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'DeviceErrors',
    timestamps: true,
    defaultScope: {
      // Không exclude itemId vì không còn cột này
    },
    indexes: [
      {
        fields: ['deviceId']
      },
      {
        fields: ['subDeviceName']
      },
      {
        fields: ['serialNumber']
      },
      {
        fields: ['resolveStatus']
      },
      {
        fields: ['resolvedBy']
      },
      {
        fields: ['position']
      }
    ]
  });

  DeviceError.associate = (models) => {
    DeviceError.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      as: 'device'
    });
    DeviceError.belongsTo(models.User, {
      foreignKey: 'resolvedBy',
      as: 'resolver'
    });
    DeviceError.belongsTo(models.User, {
      foreignKey: 'createdBy',
      targetKey: 'username',
      as: 'creator'
    });
    DeviceError.hasMany(models.DeviceErrorHistory, {
      foreignKey: 'errorId',
      as: 'history'
    });
  };

  return DeviceError;
};
