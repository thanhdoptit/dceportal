import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BlacklistedToken = sequelize.define('BlacklistedToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tokenHash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    comment: 'SHA256 hash của token'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID của user (optional)'
  },
  reason: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Lý do blacklist (logout, security, etc.)'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Thời gian token hết hạn (để cleanup)'
  }
}, {
  tableName: 'BlacklistedTokens',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['tokenHash']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

// Define associations
BlacklistedToken.associate = (models) => {
  BlacklistedToken.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'SET NULL'
  });
};

export default BlacklistedToken; 