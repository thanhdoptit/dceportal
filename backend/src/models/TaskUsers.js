import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TaskUsers = sequelize.define('TaskUsers', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    partnerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'TaskUsers',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  // Thiết lập các mối quan hệ
  TaskUsers.associate = (models) => {
    // Quan hệ với Task
    TaskUsers.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task',
      onDelete: 'CASCADE'
    });

    // Quan hệ với User
    TaskUsers.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });

    // Quan hệ với Partners
    TaskUsers.belongsTo(models.Partners, {
      foreignKey: 'partnerId',
      as: 'partner',
      onDelete: 'CASCADE'
    });
  };

  return TaskUsers;
}; 