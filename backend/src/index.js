import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { securityHeaders, customSecurityMiddleware, corsSecurity } from './middleware/securityHeaders.js';
import { csrfProtection, addCSRFToken } from './middleware/csrfProtection.js';
import authRoutes from './routes/authRoutes.js';
import db from './models/index.js';
import userRoutes from './routes/userRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import formTemplateRoutes from './routes/formTemplateRoutes.js';
import shiftCheckRoutes from './routes/shiftCheck.route.js';
import deviceRoutes from './routes/device.route.js';
import managerRoutes from './routes/managerRoutes.js';
import emailRoutes from './routes/email.route.js';
import gmailRoutes from './routes/gmail.route.js';
import tapeRoutes from './routes/tapeRoutes.js';
import http from 'http';
import { WebSocketServer } from 'ws';
import './cron/index.js'; // Import để khởi động cron jobs
import { cleanupOnShutdown } from './cron/cleanupTempFiles.js';
import { initializeShiftSchedule } from './services/shiftScheduleService.js';
import url from 'url';
import partnerRoutes from './routes/partnerRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import handoverRoutes from './routes/handoverRoutes.js';
import systemInfoRoutes from './routes/systemInfoRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import shiftConfigRoutes from './routes/shiftConfigRoutes.js';
import shiftScheduleRoutes from './routes/shiftScheduleRoutes.js';
import publicAPIRoutes from './routes/publicAPIRoutes.js';
import uploadConfig from './config/upload.js';

// Cấu hình TLS toàn cục
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
console.warn('⚠️ Đã tắt kiểm tra chứng chỉ SSL/TLS');

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('trust proxy', 'loopback')

// Rate limiting cho login
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 phút
  max: 5, // 5 lần thất bại
  message: {
    success: false,
    message: 'Quá nhiều lần đăng nhập thất bại, thử lại sau 15 phút'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Rate limiting cho API chung - Tăng giới hạn cho ứng dụng web
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 1000, // Tăng lên 1000 requests
  message: {
    success: false,
    message: 'Quá nhiều request, thử lại sau 15 phút'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Đếm cả successful requests
  keyGenerator: (req) => {
    // Sử dụng IP + user ID nếu có để phân biệt user
    return req.user ? `${req.ip}-${req.user.id}` : req.ip;
  }
});

// Tạo thư mục uploads nếu chưa tồn tại - Sử dụng config
const uploadsRoot = uploadConfig.rootDir;
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
  console.log('📂 Created uploads root directory:', uploadsRoot);
}

// Tạo thư mục device-errors nếu chưa tồn tại
const deviceErrorsDir = path.join(uploadsRoot, uploadConfig.directories.deviceErrors);
if (!fs.existsSync(deviceErrorsDir)) {
  fs.mkdirSync(deviceErrorsDir, { recursive: true });
  console.log('📂 Created device-errors directory:', deviceErrorsDir);
}

// Tạo thư mục temp cho device-errors nếu chưa tồn tại
const deviceErrorsTempDir = path.join(deviceErrorsDir, uploadConfig.deviceErrors.paths.temp);
if (!fs.existsSync(deviceErrorsTempDir)) {
  fs.mkdirSync(deviceErrorsTempDir, { recursive: true });
  console.log('📂 Created device-errors temp directory:', deviceErrorsTempDir);
}

// Middleware log request
app.use((req, res, next) => {
  // Log cho request email
  if (req.path.startsWith('/api/email') || req.path.startsWith('/api/gmail')) {
    console.log('📨 Email Request:', {
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString(),
      user: req.user ? {
        username: req.user.username,
        fullname: req.user.fullname,
        role: req.user.role
      } : 'Unauthenticated',
      body: {
        to: req.body?.to,
        subject: req.body?.subject,
        useInternalEmail: req.body?.useInternalEmail,
        hasAttachments: !!req.body?.attachments?.length
      }
    });

    // Log response
    const originalJson = res.json;
    res.json = function (data) {
      console.log('📨 Email Response:', {
        path: req.path,
        timestamp: new Date().toISOString(),
        status: res.statusCode,
        success: data.success,
        messageId: data.messageId,
        error: data.message
      });
      return originalJson.call(this, data);
    };
  }
  next();
});

// Security middleware (thứ tự quan trọng)
app.use(securityHeaders); // Helmet security headers
app.use(customSecurityMiddleware); // Custom security headers
app.use(cors(corsSecurity)); // CORS với security
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting cho các endpoint cụ thể
app.use('/api/auth/login', loginLimiter);

// Rate limiting cho API chung - chỉ áp dụng cho một số endpoint nhạy cảm
const sensitiveApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 500, // 500 requests cho endpoint nhạy cảm
  message: {
    success: false,
    message: 'Quá nhiều request, thử lại sau 15 phút'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Áp dụng rate limiting cho endpoint nhạy cảm
app.use('/api/auth', sensitiveApiLimiter);
app.use('/api/users', sensitiveApiLimiter);
app.use('/api/settings', sensitiveApiLimiter);

// Routes không cần CSRF protection
app.use('/api/auth', authRoutes);

// CSRF protection (chỉ cho authenticated requests) - TẠM TẮT
// app.use('/api', addCSRFToken); // Thêm CSRF token cho authenticated requests
// app.use('/api', csrfProtection); // Validate CSRF token

// Routes cần CSRF protection
app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/form-templates', formTemplateRoutes);
app.use('/api/shift-check', shiftCheckRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/gmail', gmailRoutes);
app.use('/api/tapes', tapeRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/handover', handoverRoutes);
app.use('/api/system-info', systemInfoRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/shift-config', shiftConfigRoutes);
app.use('/api/shift-schedule', shiftScheduleRoutes);

// Public API routes (không cần authentication, chỉ cần API key)
app.use('/api/public', publicAPIRoutes);

// Serve static files
app.use('/uploads', express.static(uploadsRoot, {
  setHeaders: (res, filePath) => {
    console.log('📁 Static file request:', filePath);
    
    // Set content-type đúng cho ảnh
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    const contentType = mimeTypes[ext];
    if (contentType) {
      res.set('Content-Type', contentType);
      console.log('📄 Set content-type:', contentType);
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test static file serving
app.get('/test-upload/:path(*)', (req, res) => {
  const filePath = path.join(uploadsRoot, req.params.path);
  console.log('🔍 Testing file path:', filePath);
  console.log('🔍 Uploads root:', uploadsRoot);
  console.log('🔍 Requested path:', req.params.path);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log('✅ File exists, size:', stats.size, 'bytes');
    res.sendFile(filePath);
  } else {
    console.log('❌ File not found');
    console.log('🔍 Checking directory contents:');
    const dir = path.dirname(filePath);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      console.log('📁 Directory contents:', files);
    } else {
      console.log('❌ Directory does not exist:', dir);
    }
    res.status(404).json({ error: 'File not found', path: filePath });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Lỗi server nội bộ',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại'
  });
});

const PORT = process.env.PORT || 5000;

// Tạo HTTP server để dùng chung cho Express và WebSocket
const server = http.createServer(app);

// Tách riêng WS theo path /ws
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  const pathname = url.parse(req.url).pathname;

  if (pathname === '/ws') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

global.wss = wss; // Lưu vào global để các module khác có thể sử dụng

wss.on('connection', (ws) => {
  // Set up ping interval for this connection
  const pingInterval = setInterval(() => {
    if (ws.readyState === 1) { // OPEN
      ws.ping();
    }
  }, 30000); // Send ping every 30 seconds

  ws.on('pong', () => {
    // Client is still alive
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'heartbeat') {
        // Send heartbeat response
        ws.send(JSON.stringify({ type: 'heartbeat' }));
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    clearInterval(pingInterval);
  });
});

// Hàm broadcast cho controller sử dụng
export const broadcastTaskUpdate = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

// Hàm broadcast cho shift updates
export const broadcastShiftUpdate = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({
        type: 'shift_update',
        ...data
      }));
    }
  });
};

  // Khởi động server chung
  server.listen(PORT, async () => {
    console.log(`🚀 Server + WebSocket running on port ${PORT}`);
    
    // Khởi tạo dữ liệu lịch trực từ file Excel
    initializeShiftSchedule();
  });

// Cleanup khi server shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Server shutting down...');
  await cleanupOnShutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Server shutting down...');
  await cleanupOnShutdown();
  process.exit(0);
});
