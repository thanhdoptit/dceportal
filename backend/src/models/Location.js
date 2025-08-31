import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tên địa điểm'
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Mã địa điểm'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Mô tả địa điểm'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Trạng thái hoạt động'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Người tạo'
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Người cập nhật'
    },
    hotline: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Số hotline liên hệ địa điểm'
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Số ca trong ngày của địa điểm'
    }
  }, {
    tableName: 'Locations',
    timestamps: true
  });

  Location.associate = (models) => {
    // Có thể thêm associations nếu cần
  };

  return Location;
}; 