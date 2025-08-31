import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import removeAccents from 'remove-accents';
import config from '../config/upload.js';

// Định nghĩa các loại file được phép upload
const ALLOWED_FILE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/plain': 'txt'
};

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

// Tạo thư mục uploads nếu chưa tồn tại
const UPLOAD_DIR = config.rootDir;
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Tạo thư mục handover nếu chưa tồn tại
const HANDOVER_DIR = path.join(UPLOAD_DIR, config.directories.handover);
if (!fs.existsSync(HANDOVER_DIR)) {
  fs.mkdirSync(HANDOVER_DIR);
}

// Cấu hình storage cho multer (handover chính thức)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const handoverId = req.params.id;
    const handoverPath = path.join(HANDOVER_DIR, handoverId.toString());
    
    // Tạo thư mục cho handover nếu chưa tồn tại
    if (!fs.existsSync(handoverPath)) {
      fs.mkdirSync(handoverPath, { recursive: true });
    }
    
    cb(null, handoverPath);
  },
  filename: (req, file, cb) => {
    cb(null, config.filename.format(file.originalname));
  }
});

// Cấu hình storage cho temp files
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempPath = path.join(UPLOAD_DIR, config.directories.temp);
    
    // Tạo thư mục temp nếu chưa tồn tại
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, { recursive: true });
    }
    
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    cb(null, config.filename.format(file.originalname));
  }
});

// Kiểm tra file với validation chặt chẽ
const fileFilter = (req, file, cb) => {
  try {
  // Log thông tin file để debug
  console.log('File info:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

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
export const handleHandoverUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File quá lớn. Kích thước tối đa là 10MB' });
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
export const uploadHandoverFiles = (req, res, next) => {
  // Log request để debug
  console.log('Upload request:', {
    headers: req.headers,
    files: req.files,
    body: req.body
  });

  upload.array('files', 5)(req, res, (err) => {
    if (err) {
      console.error('Upload error in middleware:', err);
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
      req.files = req.files.map(file => {
        // Chuyển đổi đường dẫn tuyệt đối thành tương đối
        const relativePath = path.relative(config.rootDir, file.path);
        return {
          ...file,
          path: relativePath, // Lưu đường dẫn tương đối
          originalname: req.body.originalname || file.originalname
        };
      });

    // Log kết quả upload để debug
    console.log('Upload success:', {
      files: req.files
    });
    console.log('📦 Upload request');
    console.log('Headers:', req.headers['content-type']);
    console.log('Files received:', req.files);
    console.log('Body:', req.body);
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

// Middleware xử lý upload temp files
export const uploadTempHandoverFiles = (req, res, next) => {
  // Log request để debug
  console.log('📦 Upload temp request');
  console.log('Headers:', req.headers['content-type']);
  console.log('Files received:', req.files);
  console.log('Body:', req.body);

  // Sử dụng temp storage cho temp files
  const tempUpload = multer({
    storage: tempStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: config.limits.fileSize,
      files: config.limits.files
    }
  });

  tempUpload.array('files', 5)(req, res, (err) => {
    if (err) {
      console.error('Upload error in middleware:', err);
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
          req.files = req.files.map(file => {
            // Chuyển đổi đường dẫn tuyệt đối thành tương đối
            const relativePath = path.relative(config.rootDir, file.path);
            return {
              ...file,
              path: relativePath, // Lưu đường dẫn tương đối
              originalname: req.body.originalname || file.originalname
            };
          });

          // Log kết quả upload để debug
          console.log('Upload temp success:', {
            files: req.files
          });
          console.log('📦 Upload temp request');
          console.log('Headers:', req.headers['content-type']);
          console.log('Files received:', req.files);
          console.log('Body:', req.body);
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