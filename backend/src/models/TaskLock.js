export default (sequelize, DataTypes) => {
  const TaskLock = sequelize.define('TaskLock', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lockedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lockedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'TaskLocks',
    timestamps: true
  });

  TaskLock.associate = (models) => {
    TaskLock.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'Task'
    });
    TaskLock.belongsTo(models.User, {
      foreignKey: 'lockedBy',
      as: 'User'
    });
  };

  return TaskLock;
}; 