import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/upload.js';

// Tạo thư mục uploads nếu chưa tồn tại
const UPLOAD_DIR = config.rootDir;
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Tạo thư mục task nếu chưa tồn tại
const TASK_DIR = path.join(UPLOAD_DIR, config.directories.task);
if (!fs.existsSync(TASK_DIR)) {
  fs.mkdirSync(TASK_DIR);
}

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const taskId = req.params.id;
    const taskPath = path.join(TASK_DIR, taskId.toString());

    // Tạo thư mục cho task nếu chưa tồn tại
    if (!fs.existsSync(taskPath)) {
      fs.mkdirSync(taskPath, { recursive: true });
    }

    cb(null, taskPath);
  },
  filename: (req, file, cb) => {
    cb(null, config.filename.format(file.originalname));
  }
});

// Kiểm tra file với validation chặt chẽ
const fileFilter = (req, file, cb) => {
  try {
    // 1. Kiểm tra tên file an toàn
    if (!config.security.isSafeFilename(file.originalname)) {
      return cb(new Error(config.error.messages.UNSAFE_FILENAME), false);
    }

    // 2. Kiểm tra extension bị cấm
    if (config.security.isForbiddenExtension(file.originalname)) {
      return cb(new Error(config.error.messages.FORBIDDEN_EXTENSION), false);
    }

    // 3. Kiểm tra MIME type và extension
    if (!config.security.isAllowedMimeType(file.mimetype, file.originalname)) {
      return cb(new Error(config.error.messages.INVALID_FILE_EXTENSION), false);
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
    fileSize: config.limits.fileSize,
    files: config.limits.files
  }
});

// Middleware xử lý lỗi upload
export const handleTaskUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: `File quá lớn. Kích thước tối đa là ${(config.limits.fileSize / 1024 / 1024).toFixed(0)}MB` 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Số lượng file vượt quá giới hạn. Tối đa 5 file' });
    }
    return res.status(400).json({ message: 'Lỗi upload file: ' + err.message });
  }

  if (err) {
    return res.status(400).json({ message: err.message });
  }

  next();
};

// Middleware xử lý upload file với magic bytes validation
export const uploadTaskFiles = (req, res, next) => {
  upload.array('files', 5)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          message: 'Lỗi upload file',
          errors: [err.message]
        });
      }
      return res.status(400).json({
        message: 'Lỗi upload file',
        errors: [err.message]
      });
    }

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
          // Xử lý thông tin file sau khi upload
          req.files = req.files.map(file => ({
            ...file,
            originalname: req.body.originalname || file.originalname
          }));
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
  });
};
