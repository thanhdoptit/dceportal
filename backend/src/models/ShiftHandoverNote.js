const ShiftHandoverNote = (sequelize, DataTypes) => {
  const ShiftHandoverNote = sequelize.define('ShiftHandoverNote', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    handoverId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'ShiftHandoverNotes',
    timestamps: true
  });

  ShiftHandoverNote.associate = (models) => {
    ShiftHandoverNote.belongsTo(models.ShiftHandover, {
      foreignKey: 'handoverId',
      as: 'Handover',
      onDelete: 'CASCADE'
    });
    ShiftHandoverNote.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
      onDelete: 'NO ACTION'
    });
  };

  return ShiftHandoverNote;
};

export default ShiftHandoverNote; 