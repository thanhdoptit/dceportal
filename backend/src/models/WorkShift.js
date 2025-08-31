// src/models/WorkShift.js
export default (sequelize, DataTypes) => {
  const WorkShift = sequelize.define('WorkShift', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    group: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    workedUsers: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue('workedUsers');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('workedUsers', value ? JSON.stringify(value) : '[]');
      }
    }
  }, {
    tableName: 'WorkShifts',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['code', 'date']
      }
    ],
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  WorkShift.associate = (models) => {
    WorkShift.belongsToMany(models.User, {
      through: models.WorkSession,
      foreignKey: 'workShiftId',
      otherKey: 'userId',
      as: 'Users',
      onDelete: 'CASCADE'
    });
    WorkShift.hasMany(models.WorkSession, {
      foreignKey: 'workShiftId',
      as: 'WorkSessions',
      onDelete: 'CASCADE'
    });
    WorkShift.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'Creator',
      onDelete: 'SET NULL'
    });
    WorkShift.hasMany(models.ShiftHandover, {
      foreignKey: 'fromShiftId',
      as: 'FromHandovers',
      onDelete: 'CASCADE'
    });
    WorkShift.hasMany(models.ShiftHandover, {
      foreignKey: 'toShiftId',
      as: 'ToHandovers',
      onDelete: 'CASCADE'
    });
  };

  return WorkShift;
};
