export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fullname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9+().\-\s]*$/i,
      },
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        isIn: [['male', 'female', 'other']]
      }
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['datacenter', 'be', 'admin', 'manager', 'user']]
      }
    },
    isADUser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'Users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['username']
      }
    ]
  });

  User.associate = (models) => {
    User.belongsToMany(models.WorkShift, {
      through: models.WorkSession,
      foreignKey: 'userId',
      otherKey: 'workShiftId',
      as: 'WorkShifts',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.WorkSession, {
      foreignKey: 'userId',
      as: 'WorkSessions',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.ShiftHandover, {
      foreignKey: 'fromUserId',
      as: 'FromHandovers',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.ShiftHandover, {
      foreignKey: 'toUserId',
      as: 'ToHandovers',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.ShiftHandoverNote, {
      foreignKey: 'userId',
      as: 'HandoverNotes',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Task, {
      foreignKey: 'userId',
      as: 'Tasks',
      onDelete: 'CASCADE'
    });
    User.belongsToMany(models.ShiftHandover, {
      through: models.ShiftHandoverUser,
      foreignKey: 'userId',
      otherKey: 'shiftHandoverId',
      as: 'HandoverUsers',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
