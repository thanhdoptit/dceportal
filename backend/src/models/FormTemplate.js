export default (sequelize, DataTypes) => {
const FormTemplate = sequelize.define('FormTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'handover'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('content');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('content', JSON.stringify(value));
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'FormTemplates',
  timestamps: true
});

  FormTemplate.associate = (models) => {
    FormTemplate.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'Creator',
      onDelete: 'NO ACTION'
    });
    FormTemplate.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'Updater',
      onDelete: 'NO ACTION'
    });
  };

  return FormTemplate;
}; 