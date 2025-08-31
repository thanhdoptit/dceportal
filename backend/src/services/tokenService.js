import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../models/index.js';

const ACCESS_DEFAULT_EXP = process.env.ACCESS_TOKEN_EXP || '15m';
const REFRESH_DEFAULT_EXP = process.env.REFRESH_TOKEN_EXP || '30d';
const ISSUER = 'dce-app';
const AUDIENCE = 'dce-users';

const getAccessSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'your_jwt_secret') {
    throw new Error('JWT_SECRET chưa được cấu hình đúng cách');
  }
  return secret;
};

const getRefreshSecret = () => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET chưa được cấu hình');
  }
  return secret;
};

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const signAccessToken = (userPayload, fingerprint, expiresIn = ACCESS_DEFAULT_EXP) => {
  const payload = {
    ...userPayload,
    fingerprint,
    jti: crypto.randomUUID(),
    iat: Math.floor(Date.now() / 1000)
  };
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn,
    issuer: ISSUER,
    audience: AUDIENCE
  });
};

export const signRefreshToken = async ({ userId, fingerprint, userAgent, createdByIp }, expiresIn = REFRESH_DEFAULT_EXP) => {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ sub: userId, jti, fingerprint }, getRefreshSecret(), {
    expiresIn,
    issuer: ISSUER,
    audience: AUDIENCE
  });

  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + parseExpiryToMs(expiresIn));
  await db.RefreshToken.create({
    tokenHash,
    userId,
    jti,
    fingerprint,
    userAgent,
    createdByIp,
    isRevoked: false,
    expiresAt
  });

  return token;
};

export const verifyRefreshToken = (token) => jwt.verify(token, getRefreshSecret());

export const rotateRefreshToken = async ({ oldToken, userAgent, ipAddress }) => {
  const decoded = verifyRefreshToken(oldToken);
  const oldHash = hashToken(oldToken);

  const record = await db.RefreshToken.findOne({ where: { tokenHash: oldHash } });
  if (!record) {
    throw new Error('Refresh token không tồn tại');
  }
  if (record.isRevoked) {
    // Có thể kích hoạt cơ chế revoke toàn bộ chuỗi tại đây
    throw new Error('Refresh token đã bị thu hồi');
  }
  if (record.expiresAt && record.expiresAt.getTime() <= Date.now()) {
    throw new Error('Refresh token đã hết hạn');
  }

  // Ràng buộc fingerprint/UA (nếu có)
  if (record.fingerprint && decoded.fingerprint && record.fingerprint !== decoded.fingerprint) {
    throw new Error('Fingerprint không khớp');
  }

  // Revoke token cũ
  await record.update({ isRevoked: true, revokedByIp: ipAddress });

  // Tạo refresh token mới
  const newToken = await signRefreshToken({
    userId: decoded.sub,
    fingerprint: decoded.fingerprint,
    userAgent,
    createdByIp: ipAddress
  });
  const newHash = hashToken(newToken);
  await record.update({ replacedByTokenHash: newHash });

  return { decoded, newToken };
};

export function parseExpiryToMs(exp) {
  // Hỗ trợ chuỗi dạng 15m, 30d, 10h
  if (typeof exp === 'number') return exp * 1000; // nếu là giây
  const match = String(exp).match(/^(\d+)([smhd])$/i);
  if (!match) {
    // fallback 15m
    return 15 * 60 * 1000;
  }
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const map = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return value * map[unit];
}


