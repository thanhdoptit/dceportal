export default (sequelize, DataTypes) => {
  const TapeData = sequelize.define('TapeData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    barcode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    dbname: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['Trần Hưng Đạo', 'Hòa Lạc', 'Vân Canh', 'Unknown']],
          msg: 'Địa điểm chỉ được chọn: Trần Hưng Đạo, Hòa Lạc, Vân Canh, Unknown'
        }
      }
    },
    dateStart: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateEnd: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateTerminal: {
      type: DataTypes.DATE,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    stt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    serverId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lay: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    dateError: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'TapeData',
    timestamps: false
  });

  TapeData.associate = (models) => {
    TapeData.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
      onDelete: 'SET NULL'
    });
  };

  return TapeData;
}; 