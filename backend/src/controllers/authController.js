import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import ldap from 'ldapjs';
import LdapAuth from 'ldapauth-fork';
import crypto from 'crypto';
import db from '../models/index.js';
import { signAccessToken, signRefreshToken, rotateRefreshToken, hashToken, parseExpiryToMs } from '../services/tokenService.js';
// import { generateCSRFToken } from '../middleware/csrfProtection.js'; // TẠM TẮT CSRF
const { User } = db;

dotenv.config();

// Hàm xác thực AD - chỉ cần bind thành công
const simpleADAuth = (username, password) => {
  return new Promise((resolve, reject) => {
    const bindDN = `icbv\\${username}`;
    const ldap = new LdapAuth({
      url: 'ldap://icbv.com:389',
      bindDN: bindDN,
      bindCredentials: password,
      searchBase: 'dc=icbv,dc=com',
      searchFilter: `(sAMAccountName=${username})`,
      reconnect: true,
      timeout: 5000,
    });
    ldap.authenticate(username, password, (err, user) => {
      ldap.close(); // luôn đóng sau khi xong
      if (err || !user) {
        return reject(new Error('Kiểm tra tài khoản đăng nhập'));
      }
      // Trả về object đầy đủ từ AD
      return resolve(user);
    });
  });
};
export default simpleADAuth;

export const login = async (req, res) => {
  const { username, password, loginType } = req.body;
  try {
    let user = await User.findOne({ where: { username } });
    if (loginType === 'ad') {
      try {
        const adUser = await simpleADAuth(username, password);
        if (adUser) {
          // Nếu user chưa tồn tại, tạo mới
          if (!user) {
            user = await User.create({
              username,
              fullname: adUser.displayName,
              email: adUser.mail,
              phone: adUser.mobile,
              role: 'user',
              isADUser: true
            });
          } else {
            // Cập nhật thông tin nếu đã tồn tại
            user.fullname = adUser.displayName;
            user.email = adUser.mail;
            user.phone = adUser.mobile;
            await user.save();
          }
        }
      } catch (err) {
        return res.status(401).json({ message: err.message });
      }
    } else {
      // Local login
      if (!user) {
        return res.status(401).json({ message: 'Tài khoản không tồn tại' });
      }
      if (user.isADUser) {
        return res.status(400).json({ message: 'Vui lòng sử dụng đăng nhập AD' });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Sai mật khẩu' });
      }
    }

    // Kiểm tra JWT_SECRET
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret') {
      throw new Error('JWT_SECRET chưa được cấu hình đúng cách');
    }

    // Tạo token fingerprint để chống giả lập
    const userAgent = req.headers['user-agent'] || 'unknown';
    const fingerprint = crypto.createHash('sha256')
      .update(user.id + user.username + userAgent)
      .digest('hex');

    // Tạo access token ngắn hạn và refresh token
    const accessToken = signAccessToken({
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
      isADUser: user.isADUser
    }, fingerprint);

    const refreshToken = await signRefreshToken({
      userId: user.id,
      fingerprint,
      userAgent,
      createdByIp: req.ip
    });

    // Set cookie refresh token HttpOnly
    const cookieName = process.env.REFRESH_COOKIE_NAME || 'rtk';
    const refreshMaxAgeMs = 1000 * 60 * 60 * 24 * 30; // 30d fallback; thực tế dựa REFRESH_TOKEN_EXP
    res.cookie(cookieName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: refreshMaxAgeMs
    });

    return res.json({
      token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        role: user.role,
        isADUser: user.isADUser
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'fullname', 'email', 'gender', 'dob', 'role', 'isADUser']
    });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Lấy ca hiện tại (WorkSession active)
    const currentSession = await db.WorkSession.findOne({
      where: {
        userId,
        status: 'active'
      },
      include: [{
        model: db.WorkShift,
        as: 'WorkShift',
        attributes: ['id', 'code', 'name', 'status', 'date', 'workedUsers']
      }]
    });

    let currentShift = null;
    if (currentSession && currentSession.WorkShift) {
      currentShift = {
        id: currentSession.WorkShift.id,
        code: currentSession.WorkShift.code,
        name: currentSession.WorkShift.name,
        status: currentSession.WorkShift.status,
        date: currentSession.WorkShift.date,
        workedUsers: currentSession.WorkShift.workedUsers || []
      };
    }

    res.json({ user, currentShift });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng' });
  }
};

// Đăng xuất: Đưa token vào blacklist
export const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(400).json({ message: 'Không có token' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token không hợp lệ' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    // Đồng bộ expiresAt theo exp trong token (nếu có), fallback ACCESS_TOKEN_EXP
    let expiresAt;
    try {
      const decoded = jwt.decode(token);
      if (decoded?.exp) {
        expiresAt = new Date(decoded.exp * 1000);
      }
    } catch (_) { /* ignore decode error */ }
    if (!expiresAt) {
      const accessExp = process.env.ACCESS_TOKEN_EXP || '15m';
      expiresAt = new Date(Date.now() + parseExpiryToMs(accessExp));
    }
    try {
      await db.BlacklistedToken.create({
        tokenHash,
        userId: req.user?.id,
        reason: 'logout',
        expiresAt,
      });
    } catch (err) {
      // Chỉ log lỗi nghiêm trọng
      console.error('❌ Lỗi khi ghi vào bảng blacklist:', err);
      return res.status(500).json({ message: 'Lỗi khi ghi vào bảng blacklist', error: err.message });
    }

    // Revoke refresh token trong cookie nếu có
    const cookieName = process.env.REFRESH_COOKIE_NAME || 'rtk';
    const rt = req.cookies?.[cookieName];
    if (rt) {
      const rtHash = hashToken(rt);
      await db.RefreshToken.update({ isRevoked: true, revokedByIp: req.ip }, { where: { tokenHash: rtHash } });
      res.clearCookie(cookieName, { path: '/api/auth/refresh' });
    }
    return res.json({ message: 'Đã logout và vô hiệu hóa token' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Lỗi server khi logout' });
  }
};

// Thêm function quản lý blacklisted tokens (Admin only)
export const getBlacklistedTokens = async (req, res) => {
  try {
    // Chỉ admin mới được xem
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const { page = 1, limit = 20, userId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (userId) {
      whereClause.userId = userId;
    }

    const tokens = await db.BlacklistedToken.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username', 'fullname']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: tokens.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: tokens.count,
        pages: Math.ceil(tokens.count / limit)
      }
    });
  } catch (error) {
    console.error('Get blacklisted tokens error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Force logout user (Admin only)
export const forceLogoutUser = async (req, res) => {
  try {
    // Chỉ admin mới được thực hiện
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const { userId } = req.params;

    // Tìm user
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    // Blacklist tất cả token của user này (nếu có)
    const result = await db.BlacklistedToken.update(
      { reason: 'force_logout_by_admin' },
      {
        where: {
          userId: userId,
          reason: 'logout' // Chỉ update những token logout thường
        }
      }
    );

    res.json({
      success: true,
      message: `Đã force logout user ${user.username}`,
      updatedTokens: result[0]
    });
  } catch (error) {
    console.error('Force logout error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cleanup expired blacklisted tokens (Admin only)
export const cleanupExpiredTokens = async (req, res) => {
  try {
    // Chỉ admin mới được thực hiện
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const result = await db.BlacklistedToken.destroy({
      where: {
        expiresAt: {
          [db.Sequelize.Op.lt]: new Date()
        }
      }
    });

    res.json({
      success: true,
      message: `Đã xóa ${result} blacklisted tokens đã hết hạn`,
      deletedCount: result
    });
  } catch (error) {
    console.error('Cleanup expired tokens error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Refresh access token bằng refresh token từ cookie (rotation)
export const refresh = async (req, res) => {
  try {
    const cookieName = process.env.REFRESH_COOKIE_NAME || 'rtk';
    const rt = req.cookies?.[cookieName];
    if (!rt) return res.status(401).json({ message: 'Không có refresh token' });

    const { decoded, newToken } = await rotateRefreshToken({
      oldToken: rt,
      userAgent: req.headers['user-agent'] || 'unknown',
      ipAddress: req.ip
    });

    // Lấy user hiện tại để tạo access token mới
    const user = await db.User.findByPk(decoded.sub);
    if (!user) return res.status(401).json({ message: 'Tài khoản không tồn tại' });

    // Tạo fingerprint mới theo UA hiện tại
    const fingerprint = crypto.createHash('sha256')
      .update(user.id + user.username + (req.headers['user-agent'] || 'unknown'))
      .digest('hex');

    const accessToken = signAccessToken({
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
      isADUser: user.isADUser
    }, fingerprint);

    // Set refresh cookie mới
    const refreshMaxAgeMs = 1000 * 60 * 60 * 24 * 30;
    res.cookie(cookieName, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: refreshMaxAgeMs
    });

    return res.json({ token: accessToken });
  } catch (error) {
    console.error('Refresh error:', error.message);
    return res.status(401).json({ message: 'Không thể refresh token' });
  }
};

// Logout all devices: revoke tất cả refresh tokens của user hiện tại
export const logoutAll = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Không xác định được người dùng' });
    await db.RefreshToken.update({ isRevoked: true, revokedByIp: req.ip }, { where: { userId, isRevoked: false } });
    const cookieName = process.env.REFRESH_COOKIE_NAME || 'rtk';
    res.clearCookie(cookieName, { path: '/api/auth/refresh' });
    return res.json({ message: 'Đã đăng xuất khỏi tất cả thiết bị' });
  } catch (error) {
    console.error('Logout all error:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};
