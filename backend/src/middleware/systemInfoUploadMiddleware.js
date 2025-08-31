import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config/upload.js';

// Tạo thư mục uploads nếu chưa tồn tại
const UPLOAD_DIR = config.rootDir;
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('📁 Created upload directory:', UPLOAD_DIR);
}

// Tạo thư mục system-info nếu chưa tồn tại
const SYSTEM_INFO_DIR = path.join(UPLOAD_DIR, config.directories.systemInfo);
if (!fs.existsSync(SYSTEM_INFO_DIR)) {
  fs.mkdirSync(SYSTEM_INFO_DIR, { recursive: true });
  console.log('📁 Created system-info directory:', SYSTEM_INFO_DIR);
}

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const systemId = req.params.id;
    if (!systemId) {
      console.error('❌ No system ID in params');
      return cb(new Error('System ID is required'), null);
    }

    // Lấy thông tin từ body hoặc query
    const fieldName = req.body.fieldName || req.query.fieldName;
    const itemIndex = req.body.itemIndex || req.query.itemIndex;

    console.log('🔍 Storage destination check:', {
      fieldName,
      itemIndex,
      bodyKeys: Object.keys(req.body),
      queryKeys: Object.keys(req.query)
    });

    let targetPath;
    if (fieldName && itemIndex !== undefined) {
      // Tạo cấu trúc thư mục phân loại: system-info/{id}/{fieldName}/item_{index}
      const basePath = path.join(SYSTEM_INFO_DIR, systemId.toString());
      const sectionPath = path.join(basePath, fieldName);
      targetPath = path.join(sectionPath, `item_${itemIndex}`);

    } else {
      // Fallback: lưu vào thư mục gốc của system
      targetPath = path.join(SYSTEM_INFO_DIR, systemId.toString());
    }

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    cb(null, targetPath);
  },
  filename: (req, file, cb) => {
    const filename = config.filename.format(file.originalname);
    cb(null, filename);
  }
});

// Kiểm tra file với validation chặt chẽ
const fileFilter = (req, file, cb) => {
  try {
   ;

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

// Cấu hình multer cho system-info
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.systemInfo.limits.fileSize, // 100MB
    files: 1 // Chỉ upload 1 file mỗi lần
  }
});

// Middleware xử lý lỗi upload
export const handleSystemInfoUploadError = (err, req, res, next) => {
  console.error('❌ Upload error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File quá lớn. Kích thước tối đa là ${(config.systemInfo.limits.fileSize / 1024 / 1024).toFixed(0)}MB`
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Số lượng file vượt quá giới hạn. Chỉ được upload 1 file mỗi lần'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Lỗi upload file: ' + err.message
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};



// Middleware xử lý upload file cho system-info với magic bytes validation
export const uploadSystemInfoFile = (req, res, next) => {
   upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('❌ Upload error in middleware:', err);
      return handleSystemInfoUploadError(err, req, res, next);
    }

    // Kiểm tra magic bytes sau khi upload
    if (req.file) {
      fs.readFile(req.file.path, (err, buffer) => {
        if (err) {
          console.error('❌ Cannot read file for magic bytes validation:', err);
          // Xóa file không thể đọc
          try {
            fs.unlinkSync(req.file.path);
          } catch (e) {
            console.error('Failed to cleanup file:', req.file.path);
          }
          return res.status(400).json({
            success: false,
            message: 'Không thể đọc file để kiểm tra'
          });
        }

        // Kiểm tra magic bytes
        if (!config.security.validateMagicBytes(buffer, req.file.mimetype)) {
          console.error('❌ Invalid magic bytes for file:', req.file.originalname);
          // Xóa file không hợp lệ
          try {
            fs.unlinkSync(req.file.path);
          } catch (e) {
            console.error('Failed to cleanup file:', req.file.path);
          }
          return res.status(400).json({
            success: false,
            message: config.error.messages.INVALID_MAGIC_BYTES
          });
        }

       

        // Chuyển đổi đường dẫn tuyệt đối thành tương đối
        const relativePath = path.relative(config.rootDir, req.file.path);
        req.file.path = relativePath; // Lưu đường dẫn tương đối

       

        // Đảm bảo req.file.path tồn tại
        if (!req.file.path) {
          console.error('❌ req.file.path is undefined after upload!');
          return res.status(500).json({
            success: false,
            message: 'Lỗi: đường dẫn file không hợp lệ sau khi upload'
          });
        }

        next();
      });
    } else {
     
      next();
    }
  });
};

export default uploadSystemInfoFile;
