import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getSystemInfoList,
  getSystemInfoById,
  getSystemInfoByType,
  createSystemInfo,
  updateSystemInfo,
  deleteSystemInfo,
  uploadSystemFile,
  deleteSystemFile,
  getAllSystemInfo,
  downloadSystemInfoFile,
  uploadSubItemFile,
  uploadOperationFile
} from '../controllers/systemInfoController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { uploadSystemInfoFile, handleSystemInfoUploadError } from '../middleware/systemInfoUploadMiddleware.js';
import uploadConfig from '../config/upload.js';
import SystemInfo from '../models/SystemInfo.js';

const router = express.Router();

if (!uploadConfig.rootDir) {
  throw new Error('UPLOAD_ROOT_DIR chưa được cấu hình! Vui lòng set biến môi trường UPLOAD_ROOT_DIR.');
}
console.log('SystemInfoRoutes - uploadConfig.rootDir:', uploadConfig.rootDir);
console.log('SystemInfoRoutes - process.cwd():', process.cwd());
const systemInfoDir = path.join(uploadConfig.rootDir, 'system-info');
console.log('SystemInfoRoutes - systemInfoDir:', systemInfoDir);

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(systemInfoDir)) {
  fs.mkdirSync(systemInfoDir, { recursive: true });
}

// Cấu hình multer cho upload file - mỗi systemInfo 1 thư mục riêng
const systemUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const id = req.params.id;
      const destDir = path.join(systemInfoDir, String(id));
      console.log('SystemInfoRoutes - upload file to:', destDir);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      const filename = uploadConfig.filename.format(file.originalname);
      cb(null, filename);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (uploadConfig.security.isAllowedMimeType(file.mimetype, file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error(`Loại file ${file.mimetype} không được hỗ trợ`), false);
    }
  },
  limits: {
    fileSize: uploadConfig.limits.fileSize,
    files: uploadConfig.limits.files,
    fieldSize: 1024 * 1024
  }
});

// Cấu hình multer cho upload sub-item - phân loại theo mục
const subItemUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const id = req.params.id;
      const { fieldName, itemIndex } = req.body;

      // Tạo cấu trúc thư mục phân loại
      const baseDir = path.join(systemInfoDir, String(id));
      const sectionDir = path.join(baseDir, fieldName);
      const itemDir = path.join(sectionDir, `item_${itemIndex}`);

      console.log('SystemInfoRoutes - sub-item upload structure:');
      console.log('  Base dir:', baseDir);
      console.log('  Section dir:', sectionDir);
      console.log('  Item dir:', itemDir);

      // Tạo thư mục nếu chưa có
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
      }
      if (!fs.existsSync(sectionDir)) {
        fs.mkdirSync(sectionDir, { recursive: true });
      }
      if (!fs.existsSync(itemDir)) {
        fs.mkdirSync(itemDir, { recursive: true });
      }

      cb(null, itemDir);
    },
    filename: (req, file, cb) => {
      const filename = uploadConfig.filename.format(file.originalname);
      cb(null, filename);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (uploadConfig.security.isAllowedMimeType(file.mimetype, file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error(`Loại file ${file.mimetype} không được hỗ trợ`), false);
    }
  },
  limits: {
    fileSize: uploadConfig.limits.fileSize,
    files: uploadConfig.limits.files,
    fieldSize: 1024 * 1024
  }
});

// Middleware xử lý lỗi upload
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File quá lớn. Kích thước tối đa là ${(uploadConfig.limits.fileSize / 1024 / 1024).toFixed(0)}MB`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: `Quá nhiều file. Tối đa ${uploadConfig.limits.files} file mỗi lần upload`
      });
    }
    if (error.code === 'LIMIT_FIELD_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu field quá lớn'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Lỗi upload: ${error.message}`
    });
  }

  if (error.message.includes('Loại file')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

// Routes công khai (chỉ đọc)
router.get('/list', getSystemInfoList);
router.get('/type/:systemType', getSystemInfoByType);
router.get('/:id', getSystemInfoById);

// Routes bảo vệ (cần đăng nhập và quyền)
router.post('/',
  authenticate,
  authorizeRoles(['admin', 'manager', 'datacenter']),
  createSystemInfo
);

router.put('/:id',
  authenticate,
  authorizeRoles(['admin', 'manager', 'datacenter']),
  systemUpload.any(), // Nhận nhiều fieldname động thay vì chỉ 'files'
  handleUploadError,
  updateSystemInfo
);

router.delete('/:id',
  authenticate,
  authorizeRoles(['admin', 'manager']),
  deleteSystemInfo
);

// Upload file - Sử dụng cấu hình có sẵn
router.post('/:id/upload',
  authenticate,
  authorizeRoles(['admin', 'manager', 'datacenter']),
  systemUpload.single('file'),
  handleUploadError,
  uploadSystemFile
);

// Upload nhiều file cùng lúc
router.post('/:id/upload-multiple',
  authenticate,
  authorizeRoles(['admin', 'manager', 'datacenter']),
  systemUpload.array('files', uploadConfig.limits.files), // Sử dụng limit từ config
  handleUploadError,
  uploadSystemFile
);

// Xóa file - Cập nhật route mới
router.delete('/:id/files/:filename',
  authenticate,
  authorizeRoles(['admin', 'manager', 'datacenter']),
  deleteSystemFile
);

// Route kiểm tra dung lượng upload và thống kê
router.get('/:id/upload-stats',
  authenticate,
  authorizeRoles(['admin', 'manager', 'datacenter']),
  async (req, res) => {
    try {
      const { id } = req.params;

      const systemInfo = await SystemInfo.findByPk(id);
      if (!systemInfo) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy hệ thống' });
      }

      // Tính toán thống kê từ content JSON
      const content = systemInfo.content || {};
      const sections = ['purpose', 'components', 'operation', 'procedures', 'troubleshooting', 'general'];

      const stats = {
        totalFiles: 0,
        totalSize: 0,
        sections: {}
      };

      // Thống kê từng section
      sections.forEach(section => {
        const files = content[section]?.files || [];
        const sectionStats = {
          count: files.length,
          size: 0,
          types: {}
        };

        files.forEach(file => {
          stats.totalFiles++;
          stats.totalSize += file.size || 0;
          sectionStats.size += file.size || 0;

          const ext = path.extname(file.originalName || '').toLowerCase();
          sectionStats.types[ext] = (sectionStats.types[ext] || 0) + 1;
        });

        stats.sections[section] = sectionStats;
      });

      // Format size
      const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      res.status(200).json({
        success: true,
        data: {
          ...stats,
          totalSizeFormatted: formatSize(stats.totalSize),
          sectionsFormatted: Object.keys(stats.sections).reduce((acc, section) => {
            acc[section] = {
              ...stats.sections[section],
              sizeFormatted: formatSize(stats.sections[section].size)
            };
            return acc;
          }, {}),
          limits: {
            maxFileSize: `${(uploadConfig.limits.fileSize / 1024 / 1024).toFixed(0)}MB`,
            maxFilesPerUpload: uploadConfig.limits.files,
            allowedTypes: Object.keys(uploadConfig.allowedMimeTypes)
          }
        }
      });
    } catch (error) {
      console.error('❌ Lỗi lấy thống kê upload:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
);

// Route public lấy toàn bộ danh sách hệ thống (cho FE)
router.get('/', getAllSystemInfo);

// Route download file (bảo mật, giống Task)
router.get('/:id/files/:filename', authenticate, downloadSystemInfoFile);

// Route kiểm tra file có tồn tại không (public, chỉ để debug)
router.get('/:id/check-file/:filename', async (req, res) => {
  try {
    const { id, filename } = req.params;

    // Tìm systemInfo
    const systemInfo = await SystemInfo.findByPk(id);
    if (!systemInfo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hệ thống',
        debug: { id, filename }
      });
    }

    // Tìm file trong content JSON của các section
    const content = systemInfo.content || {};
    let fileInfo = null;
    let foundSection = null;

    // Duyệt qua các section để tìm file
    const sections = ['purpose', 'components', 'operation', 'procedures', 'troubleshooting', 'general'];

    for (const section of sections) {
      if (content[section]?.files && Array.isArray(content[section].files)) {
        const found = content[section].files.find(f => f.filename === filename);
        if (found) {
          fileInfo = found;
          foundSection = section;
          break;
        }
      }
    }

    if (!fileInfo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy file trong database',
        debug: {
          id,
          filename,
          sections: sections,
          contentKeys: Object.keys(content)
        }
      });
    }

    // Kiểm tra file có tồn tại trên disk không
    const filePath = path.join(uploadConfig.rootDir, 'system-info', String(id), filename);
    const fileExists = fs.existsSync(filePath);

    res.status(200).json({
      success: true,
      data: {
        fileInfo,
        filePath,
        fileExists,
        section: foundSection,
        uploadConfigRootDir: uploadConfig.rootDir,
        systemInfoDir: path.join(uploadConfig.rootDir, 'system-info'),
        targetDir: path.join(uploadConfig.rootDir, 'system-info', String(id))
      }
    });
  } catch (error) {
    console.error('❌ Check file error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
});

// Upload file cho mục con (components, issues, procedures)
router.post('/:id/upload-sub-item',
  authenticate,
  authorizeRoles(['admin', 'manager', 'datacenter']),
  uploadSystemInfoFile,
  handleSystemInfoUploadError,
  uploadSubItemFile
);

// Upload file cho operation
router.post('/:id/upload-operation',
  authenticate,
  authorizeRoles(['admin', 'manager', 'datacenter']),
  systemUpload.single('file'),
  handleUploadError,
  uploadOperationFile
);

export default router;
