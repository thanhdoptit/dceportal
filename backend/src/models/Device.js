import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Device = sequelize.define('Device', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Danh mục thiết bị'
    },
    deviceName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tên thiết bị'
    },
    serialNumber: {
      type: DataTypes.STRING,
      comment: 'Số serial của thiết bị'
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Vị trí lắp đặt'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Trạng thái hoạt động'
    }
  }, {
    tableName: 'Devices',
    timestamps: true
  });

  Device.associate = (models) => {
    Device.hasMany(models.ShiftCheckItem, {
      foreignKey: 'deviceId',
      as: 'checkItems'
    });
  };

  return Device;
}; 