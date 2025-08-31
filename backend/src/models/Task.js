export default (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      fullName: {
      type: DataTypes.STRING(255),
        allowNull: true
      },
      checkInTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      checkOutTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      taskTitle: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      taskDescription: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      signature: {
      type: DataTypes.STRING(255),
        allowNull: true
      },
      status: {
      type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'waiting',
      validate: {
        isIn: [['waiting', 'pending', 'in_progress', 'completed', 'cancelled']]
      }
      },
      attachments: {
      type: DataTypes.TEXT,
      allowNull: true
      },
      completedAt: {
        type: DataTypes.DATE,
      allowNull: true
      },
      cancelReason: {
        type: DataTypes.TEXT,
      allowNull: true
      }
    }, {
      tableName: 'Tasks',
    timestamps: true,
    getterMethods: {
      attachments() {
        const value = this.getDataValue('attachments');
        return value ? JSON.parse(value) : [];
      }
    },
    setterMethods: {
      attachments(value) {
        this.setDataValue('attachments', value ? JSON.stringify(value) : '[]');
      }
    }
    });

    Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'NO ACTION'
    });
      Task.belongsTo(models.User, {
        foreignKey: 'createdBy',
      as: 'creator',
      onDelete: 'NO ACTION'
      });
      Task.belongsTo(models.User, {
        foreignKey: 'completedBy',
      as: 'completer',
      onDelete: 'NO ACTION'
      });
      Task.belongsTo(models.WorkSession, {
        foreignKey: 'workSessionId',
      as: 'WorkSession',
      onDelete: 'SET NULL'
      });
      Task.belongsTo(models.WorkShift, {
        foreignKey: 'workShiftId',
      as: 'WorkShift',
        onDelete: 'SET NULL'
      });
      Task.hasMany(models.TaskHistory, {
        foreignKey: 'taskId',
      as: 'history',
      onDelete: 'CASCADE'
      });
      Task.hasMany(models.ShiftHandoverTask, {
        foreignKey: 'taskId',
        as: 'shiftHandoverTasks',
        onDelete: 'CASCADE'
      });
      Task.hasMany(models.TaskUsers, {
        foreignKey: 'taskId',
        as: 'taskUsers',
        onDelete: 'CASCADE'
      });
    };

    return Task;
  };
