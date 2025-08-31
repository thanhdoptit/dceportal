import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Partner = sequelize.define('Partners', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fullname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    donVi: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cccd: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'Partners',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  // Thiết lập các mối quan hệ
  Partner.associate = (models) => {
    // Quan hệ với TaskUsers
    Partner.hasMany(models.TaskUsers, {
      foreignKey: 'partnerId',
      as: 'taskUsers',
      onDelete: 'CASCADE'
    });
  };

  return Partner;
}; 