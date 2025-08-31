export default (sequelize, DataTypes) => {
  const ShiftHandoverUser = sequelize.define('ShiftHandoverUser', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shiftHandoverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ShiftHandovers',
        key: 'id',
        onDelete: 'CASCADE'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
        onDelete: 'NO ACTION'
      }
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['from', 'to']]
      }
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'handover',
      validate: {
        isIn: [['handover', 'receiver', 'confirmer']]
      }
    }
  }, {
    tableName: 'ShiftHandoverUsers',
    timestamps: true,
    indexes: [
      {
        fields: ['shiftHandoverId', 'userId'],
        unique: true,
        name: 'ShiftHandoverUsers_shiftHandoverId_userId_unique'
      }
    ]
  });

  ShiftHandoverUser.associate = (models) => {
    ShiftHandoverUser.belongsTo(models.ShiftHandover, {
      foreignKey: 'shiftHandoverId',
      as: 'ShiftHandover',
      onDelete: 'CASCADE'
    });
    ShiftHandoverUser.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
      onDelete: 'CASCADE'
    });
  };

  return ShiftHandoverUser;
};
