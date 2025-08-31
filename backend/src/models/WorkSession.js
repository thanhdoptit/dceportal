export default (sequelize, DataTypes) => {
  const WorkSession = sequelize.define('WorkSession', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    workShiftId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: { 
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: { 
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'completed', 'cancelled']]
      }
    },
    startedAt: { 
      type: DataTypes.DATE,
      allowNull: true
    },
    endedAt: { 
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'WorkSessions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'date']
      }
    ]
  });

  WorkSession.associate = (models) => {
    WorkSession.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
      onDelete: 'CASCADE'
    });
    WorkSession.belongsTo(models.WorkShift, {
      foreignKey: 'workShiftId',
      as: 'WorkShift',
      onDelete: 'CASCADE'
    });
    WorkSession.hasMany(models.Task, {
      foreignKey: 'workSessionId',
      as: 'Tasks',
      onDelete: 'CASCADE'
    });
  };

  return WorkSession;
}; 