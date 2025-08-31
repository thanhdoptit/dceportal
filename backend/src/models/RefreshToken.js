import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Bảng lưu refresh token (hash) để quản lý phiên và revoke
const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tokenHash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    comment: 'SHA256 hex của refresh token'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID của user'
  },
  jti: {
    type: DataTypes.STRING(36),
    allowNull: false,
    comment: 'UUID của refresh token'
  },
  fingerprint: {
    type: DataTypes.STRING(64),
    allowNull: true,
    comment: 'Fingerprint ràng buộc thiết bị'
  },
  userAgent: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  createdByIp: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  revokedByIp: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  isRevoked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  replacedByTokenHash: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
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
  tableName: 'RefreshTokens',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    { unique: true, fields: ['tokenHash'] },
    { fields: ['userId'] },
    { fields: ['expiresAt'] },
    { fields: ['isRevoked'] },
    { fields: ['jti'] }
  ]
});

// Define associations
RefreshToken.associate = (models) => {
  RefreshToken.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
  });
};

export default RefreshToken;


