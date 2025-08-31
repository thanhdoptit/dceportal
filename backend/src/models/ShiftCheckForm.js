import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ShiftCheckForm = sequelize.define('ShiftCheckForm', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    workShiftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID ca làm việc',
    },
    checkerId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      comment: 'ID người kiểm tra',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Vị trí kiểm tra',
    },
    checkedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Thời gian kiểm tra',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Ngày kiểm tra',
    },
    shift: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Ca làm việc',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Ghi chú',
    },    
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'ShiftCheckForms',
    timestamps: true,
    indexes: [
      {
        fields: ['workShiftId']
      },
      {
        fields: ['checkerId']
      },
      {
        fields: ['date']
      },
      {
        fields: ['shift']
      }
    ]
  });

  ShiftCheckForm.associate = (models) => {
    ShiftCheckForm.belongsTo(models.WorkShift, {
      foreignKey: 'workShiftId',
      as: 'workShift'
    });

    ShiftCheckForm.belongsTo(models.User, {
      foreignKey: 'checkerId',
      as: 'checker'
    });

    ShiftCheckForm.hasMany(models.ShiftCheckItem, {
      foreignKey: 'formId',
      as: 'items'
    });
  };

  return ShiftCheckForm;
}; 