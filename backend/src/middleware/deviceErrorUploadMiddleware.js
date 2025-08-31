import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config/upload.js';

// Cấu hình storage cho device error images
const storage = multer.memoryStorage();

// Kiểm tra file filter
const fileFilter = (req, file, cb) => {
  try {
    // 1. Kiểm tra extension bị cấm
    if (config.security.isForbiddenExtension(file.originalname)) {
      return cb(new Error(config.error.messages.FORBIDDEN_EXTENSION), false);
    }

    // 2. Kiểm tra MIME type và extension
    if (!config.security.isAllowedMimeType(file.mimetype, file.originalname)) {
      return cb(new Error(config.error.messages.INVALID_FILE_EXTENSION), false);
    }

    // 3. Kiểm tra tên file an toàn
    if (!config.security.isSafeFilename(file.originalname)) {
      return cb(new Error(config.error.messages.UNSAFE_FILENAME), false);
    }

    cb(null, true);
  } catch (error) {
    cb(new Error(config.error.messages.INVALID_FILE_TYPE), false);
  }
};

// Cấu hình multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB cho device error images
    files: 10 // Tối đa 10 file
  }
});

// Middleware xử lý lỗi upload
export const handleDeviceErrorUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: config.error.messages.FILE_TOO_LARGE
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: config.error.messages.TOO_MANY_FILES
      });
    }
    return res.status(400).json({ 
      message: config.error.messages.UPLOAD_ERROR + ': ' + err.message 
    });
  }
  
  if (err) {
    return res.status(400).json({ 
      message: err.message 
    });
  }
  
  next();
};

// Middleware xử lý upload file cho device error images
export const uploadDeviceErrorImages = (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('Upload error in middleware:', err);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          message: 'Lỗi upload file',
          error: err.message
        });
      }
      return res.status(400).json({
        message: 'Lỗi upload file',
        error: err.message
      });
    }

    // Kiểm tra có file nào được upload không (chỉ cho upload endpoints)
    if (req.path.includes('/temp/images') || req.path.includes('/images')) {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: 'Không có file nào được upload'
        });
      }
    }

    next();
  });
}; 