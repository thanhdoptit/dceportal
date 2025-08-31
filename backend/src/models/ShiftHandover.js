export default (sequelize, DataTypes) => {
  const ShiftHandover = sequelize.define('ShiftHandover', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    fromShiftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'WorkShifts', key: 'id' }
    },
    toShiftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'WorkShifts', key: 'id' }
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' }
    },
    content: { type: DataTypes.TEXT, allowNull: false },
    handoverForm: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      comment: 'JSON containing tools, environment, and ongoing tasks information'
    },
    attachments: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      defaultValue: '[]',
      comment: 'Array of attachment objects with filename, path, size, and uploadDate'
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'completed', 'rejected'),
      defaultValue: 'draft',
      allowNull: false
    },
    confirmNote: { type: DataTypes.TEXT, allowNull: true },
    rejectNote: { type: DataTypes.TEXT, allowNull: true },
    confirmedAt: { type: DataTypes.DATE, allowNull: true },
    rejectedAt: { type: DataTypes.DATE, allowNull: true },
    expectedNextShift: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'ShiftHandovers',
    timestamps: true,
    indexes: [
      { fields: ['date', 'status'], name: 'shiftHandovers_date_status_idx' },
      {
        fields: ['fromShiftId', 'date'],
        unique: true,
        name: 'shiftHandovers_fromShiftId_date_unique_idx'
      }
    ],
    getterMethods: {
      handoverForm() {
        const value = this.getDataValue('handoverForm');
        if (value) return JSON.parse(value);
        
        // Return default structure if no data
        return {
          tools: {
            status: 'complete',
            missing: {
              items: [],
              description: '',
              details: {
                computer: false,
                phone: false,
                key: false,
                other: false,
                otherDescription: ''
              }
            }
          },
          environment: {
            status: true,
            description: ''
          }
        };
      },
      attachments() {
        const value = this.getDataValue('attachments');
        return value ? JSON.parse(value) : [];
      },
      expectedNextShift() {
        const value = this.getDataValue('expectedNextShift');
        return value ? JSON.parse(value) : null;
      }
    },
    setterMethods: {
      handoverForm(value) {
        if (!value) {
          this.setDataValue('handoverForm', JSON.stringify({
            tools: {
              status: 'complete',
              missing: {
                items: [],
                description: '',
                details: {
                  computer: false,
                  phone: false,
                  key: false,
                  other: false,
                  otherDescription: ''
                }
              }
            },
            environment: {
              status: true,
              description: ''
            }
          }));
          return;
        }

        // Validate and normalize the structure
        const normalizedForm = {
          tools: {
            status: value.tools?.status || 'complete',
            missing: {
              items: Array.isArray(value.tools?.missing?.items) ? 
                value.tools.missing.items : [],
              description: value.tools?.missing?.description || '',
              details: {
                computer: value.tools?.missing?.details?.computer || false,
                phone: value.tools?.missing?.details?.phone || false,
                key: value.tools?.missing?.details?.key || false,
                other: value.tools?.missing?.details?.other || false,
                otherDescription: value.tools?.missing?.details?.otherDescription || ''
              }
            }
          },
          environment: {
            status: value.environment?.status ?? true,
            description: value.environment?.description || ''
          }
        };

        this.setDataValue('handoverForm', JSON.stringify(normalizedForm));
      },
      attachments(value) {
        this.setDataValue('attachments', value ? JSON.stringify(value) : '[]');
      },
      expectedNextShift(value) {
        this.setDataValue('expectedNextShift', value ? JSON.stringify(value) : null);
      }
    }
  });

  ShiftHandover.associate = (models) => {
    ShiftHandover.belongsTo(models.WorkShift, { 
      foreignKey: 'fromShiftId', 
      as: 'FromShift',
      onDelete: 'CASCADE'
    });
    ShiftHandover.belongsTo(models.WorkShift, { 
      foreignKey: 'toShiftId', 
      as: 'ToShift',
      onDelete: 'CASCADE'
    });
    ShiftHandover.belongsTo(models.User, { 
      foreignKey: 'fromUserId', 
      as: 'FromUser',
      onDelete: 'CASCADE'
    });
    ShiftHandover.belongsTo(models.User, { 
      foreignKey: 'toUserId', 
      as: 'ToUser',
      onDelete: 'SET NULL'
    });
    ShiftHandover.hasMany(models.ShiftHandoverNote, { 
      foreignKey: 'handoverId', 
      as: 'Notes',
      onDelete: 'CASCADE'
    });

    ShiftHandover.hasMany(models.ShiftHandoverDevice, {
      foreignKey: 'handoverId',
      as: 'devices',
      onDelete: 'CASCADE'
    });
    
    ShiftHandover.hasMany(models.ShiftHandoverTask, {
      foreignKey: 'handoverId',
      as: 'Tasks',
      onDelete: 'CASCADE'
    });

    ShiftHandover.belongsToMany(models.User, {
      through: {
        model: models.ShiftHandoverUser,
        scope: { type: 'from' }
      },
      as: 'FromUsers',
      foreignKey: 'shiftHandoverId',
      otherKey: 'userId',
      onDelete: 'CASCADE'
    });

    ShiftHandover.belongsToMany(models.User, {
      through: {
        model: models.ShiftHandoverUser,
        scope: { type: 'to' }
      },
      as: 'ToUsers',
      foreignKey: 'shiftHandoverId',
      otherKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return ShiftHandover;
};
