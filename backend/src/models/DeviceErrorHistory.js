export default (sequelize, DataTypes) => {
  const DeviceErrorHistory = sequelize.define('DeviceErrorHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    errorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DeviceErrors',
        key: 'id'
      },
      comment: 'ID của lỗi thiết bị'
    },
    changedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Người thực hiện thay đổi'
    },
    changeId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      comment: 'ID của thay đổi'
    },
    changeType: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    field: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    oldValue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    newValue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    changeReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isAutomatic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'DeviceErrorHistories',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['errorId']
      },
      {
        fields: ['changedBy']
      },
      {
        fields: ['changeType']
      }
    ]
  });

  DeviceErrorHistory.associate = (models) => {
    DeviceErrorHistory.belongsTo(models.DeviceError, { 
      foreignKey: 'errorId',
      as: 'deviceError'
    });
    DeviceErrorHistory.belongsTo(models.User, {
      foreignKey: 'changedBy',
      as: 'changedByUser',
      onDelete: 'CASCADE'
    });
  };

  return DeviceErrorHistory;
}; 