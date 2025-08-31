import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../models/index.js';
const { User } = db;

// Hàm lấy JWT secret với fallback
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'your_jwt_secret') {
    throw new Error('JWT_SECRET chưa được cấu hình đúng cách');
  }
  return secret;
};

// Hàm kiểm tra token blacklist (có thể dùng Redis hoặc database)
const checkTokenBlacklist = async (token) => {
  try {
    // Tạo hash của token để lưu trong blacklist
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Kiểm tra trong database (có thể chuyển sang Redis sau)
    const blacklistedToken = await db.BlacklistedToken.findOne({
      where: { tokenHash }
    });
    
    if (blacklistedToken) {
      throw new Error('Token đã bị vô hiệu hóa');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Token blacklist check error:', error);
    throw error;
  }
};

// Hàm verify token với nhiều secret (cho rotation)
const verifyTokenWithRotation = async (token) => {
  // Kiểm tra blacklist trước
  await checkTokenBlacklist(token);
  
  const secrets = [
    process.env.JWT_SECRET,
    process.env.JWT_SECRET_OLD, // Cho rotation
  ].filter(Boolean);

  for (const secret of secrets) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw err; // Token hết hạn thì throw luôn
      }
      // TokenExpiredError thì tiếp tục thử secret khác
      continue;
    }
  }
  throw new Error('Token không hợp lệ');
};

export const authenticate = async (req, res, next) => {
  try {
    // Kiểm tra header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('❌ No Bearer token found in header');
      return res.status(401).json({ message: 'Vui lòng đăng nhập' });
    }

    // Lấy token
    const token = authHeader.split(' ')[1];

    // Xác thực token với rotation và blacklist check
    const decoded = await verifyTokenWithRotation(token);

    // Kiểm tra token đã hết hạn chưa
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      console.log('❌ Token has expired');
      return res.status(401).json({ message: 'Phiên đăng nhập hết hạn' });
    }

    // Kiểm tra token fingerprint (nếu có)
    if (decoded.fingerprint) {
      const expectedFingerprint = crypto.createHash('sha256')
        .update(decoded.id + decoded.username + req.headers['user-agent'])
        .digest('hex');
      
      if (decoded.fingerprint !== expectedFingerprint) {
        console.log('❌ Token fingerprint mismatch');
        return res.status(401).json({ message: 'Token không hợp lệ' });
      }
    }

    // Lấy thông tin user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log('❌ User not found for id:', decoded.id);
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }

    // Gán thông tin user vào request
    req.user = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      role: user.role
    };

    next();
  } catch (err) {
    console.error('❌ Auth error:', err.message);
    
    // Phân loại lỗi để trả về message phù hợp
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Phiên đăng nhập hết hạn' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
    if (err.message.includes('JWT_SECRET')) {
      return res.status(500).json({ message: 'Lỗi cấu hình server' });
    }
    if (err.message.includes('vô hiệu hóa')) {
      return res.status(401).json({ message: 'Phiên đăng nhập đã bị vô hiệu hóa' });
    }
    
    return res.status(401).json({ message: 'Phiên đăng nhập hết hạn' });
  }
};
