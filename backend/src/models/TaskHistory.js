export default (sequelize, DataTypes) => {
  const TaskHistory = sequelize.define('TaskHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    changeGroupId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      comment: 'ID nhóm thay đổi liên quan'
    },
    changedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    tableName: 'TaskHistories',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['changeGroupId']
      }
    ]
  });

  TaskHistory.associate = (models) => {
    TaskHistory.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'Task',
      onDelete: 'CASCADE'
    });
    TaskHistory.belongsTo(models.User, {
      foreignKey: 'changedBy',
      as: 'ChangedByUser',
      onDelete: 'CASCADE'
    });
  };

  return TaskHistory;
}; 