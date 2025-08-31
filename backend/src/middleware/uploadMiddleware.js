// middlewares/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import removeAccents from 'remove-accents';
import config from '../config/upload.js';

console.log('📁 Initializing upload middleware...');

// Ensure uploads directory exists
const UPLOAD_DIR = config.rootDir;
if (!fs.existsSync(UPLOAD_DIR)) {
  console.log('📂 Creating uploads directory:', UPLOAD_DIR);
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Create temp directory if it doesn't exist
const TEMP_DIR = path.join(UPLOAD_DIR, config.directories.temp);
if (!fs.existsSync(TEMP_DIR)) {
  console.log('📂 Creating temp directory:', TEMP_DIR);
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Hàm xử lý tên file
const formatFileName = (filename) => {
  try {
    // Lấy phần mở rộng của file
    const ext = path.extname(filename);
    // Tạo tên file không dấu
    const nameWithoutExt = path.basename(filename, ext);
    const cleanName = removeAccents(nameWithoutExt)
      .replace(/[^a-zA-Z0-9]/g, '_') // Thay thế ký tự đặc biệt bằng dấu gạch dưới
      .replace(/_+/g, '_') // Loại bỏ các dấu gạch dưới liên tiếp
      .toLowerCase(); // Chuyển thành chữ thường
    return `${cleanName}${ext}`;
  } catch (error) {
    console.error('Lỗi khi xử lý tên file:', error);
    return filename;
  }
};

// Cấu hình storage cho multer với stream processing
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR);
  },
  
  filename: function (req, file, cb) {
    const filename = config.filename.format(file.originalname);
    
    // Encode tên file gốc trước khi lưu vào request
    if (!req.originalFileNames) {
      req.originalFileNames = {};
    }
    // Encode tên file gốc để đảm bảo các ký tự đặc biệt và tiếng Việt được xử lý đúng
    req.originalFileNames[filename] = encodeURIComponent(file.originalname);
    
    cb(null, filename);
  }
});

// Kiểm tra file với validation chặt chẽ
const validateFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      // 1. Kiểm tra tên file an toàn
      if (!config.security.isSafeFilename(file.originalname)) {
        return reject(new Error(config.error.messages.UNSAFE_FILENAME));
      }

      // 2. Kiểm tra extension bị cấm
      if (config.security.isForbiddenExtension(file.originalname)) {
        return reject(new Error(config.error.messages.FORBIDDEN_EXTENSION));
      }

      // 3. Kiểm tra MIME type và extension
      if (!config.security.isAllowedMimeType(file.mimetype, file.originalname)) {
        return reject(new Error(config.error.messages.INVALID_FILE_EXTENSION));
      }

      resolve();
    } catch (error) {
      reject(new Error(config.error.messages.INVALID_FILE_TYPE));
    }
  });
};

// Cấu hình multer với xử lý stream
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.limits.fileSize,
    files: config.limits.files
  },
  fileFilter: (req, file, cb) => {
    validateFile(file)
      .then(() => cb(null, true))
      .catch(err => cb(err));
  }
});

// Middleware wrapper with optimized error handling
const uploadMiddleware = (req, res, next) => {
  const requestId = uuidv4();
  req.id = requestId;
  
  // Sử dụng Promise.race để set timeout cho upload
  const uploadPromise = new Promise((resolve, reject) => {
    upload.array('attachments', 10)(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Upload timeout'));
    }, 30000); // 30 seconds timeout
  });

  Promise.race([uploadPromise, timeoutPromise])
    .then(() => {
      // Kiểm tra magic bytes sau khi upload
      if (req.files?.length > 0) {
        const validationPromises = req.files.map(file => {
          return new Promise((resolve, reject) => {
            fs.readFile(file.path, (err, buffer) => {
              if (err) {
                reject(new Error('Không thể đọc file để kiểm tra'));
                return;
              }

              // Kiểm tra magic bytes
              if (!config.security.validateMagicBytes(buffer, file.mimetype)) {
                // Xóa file không hợp lệ
                fs.unlink(file.path, () => {});
                reject(new Error(config.error.messages.INVALID_MAGIC_BYTES));
                return;
              }

              resolve();
            });
          });
        });

        Promise.all(validationPromises)
          .then(() => {
            console.log('✅ Upload completed with magic bytes validation:', {
              fileCount: req.files.length,
              totalSize: req.files.reduce((acc, f) => acc + f.size, 0)
            });
            next();
          })
          .catch(err => {
            // Cleanup tất cả files nếu có lỗi validation
            req.files.forEach(file => {
              try {
                fs.unlinkSync(file.path);
              } catch (e) {
                console.error('Failed to cleanup file:', file.path);
              }
            });
            req.files = [];
            return res.status(400).json({
              message: err.message,
              error: {
                code: 'MAGIC_BYTES_VALIDATION_FAILED'
              }
            });
          });
      } else {
        next();
      }
    })
    .catch((err) => {
      // Cleanup any partially uploaded files
      if (req.files?.length > 0) {
        req.files.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            console.error('Failed to cleanup file:', file.path);
          }
        });
      }

      if (err.message === 'Upload timeout') {
        return res.status(408).json({
          message: 'Upload timeout - Quá thời gian xử lý file',
          error: {
            code: 'UPLOAD_TIMEOUT'
          }
        });
      }

      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: `File không được vượt quá ${(config.limits.fileSize / 1024 / 1024).toFixed(0)}MB`,
            error: {
              code: err.code,
              field: err.field
            }
          });
        }
        
        return res.status(400).json({
          message: 'Lỗi khi upload file',
          error: {
            code: err.code,
            field: err.field
          }
        });
      }

      return res.status(400).json({
        message: err.message || 'Lỗi không xác định khi upload file'
      });
    });
};

// Error handling middleware
export const handleUploadError = (err, req, res, next) => {
  // Cleanup any uploaded files on error
  if (req.files?.length > 0) {
    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        console.error('Failed to cleanup file:', file.path);
      }
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: `File không được vượt quá ${(config.limits.fileSize / 1024 / 1024).toFixed(0)}MB`
    });
  }
  
  return res.status(400).json({
    message: 'Lỗi khi xử lý file',
    error: err.message
  });
};

export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);

export default uploadMiddleware;
