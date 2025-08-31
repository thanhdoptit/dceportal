import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Đường dẫn gốc cho upload - Bắt buộc phải set UPLOAD_ROOT_DIR
  rootDir: process.env.UPLOAD_ROOT_DIR,

  // Cấu trúc thư mục con
  directories: {
    task: 'task',
    handover: 'handover',
    temp: 'temp',
    systemInfo: 'system-info',
    deviceErrors: 'device-errors'
  },

  // Giới hạn file - Tăng lên cho system-info
  limits: {
    fileSize: 100 * 1024 * 1024, // Tăng lên 100MB cho file nặng
    files: 20
  },

  // Định dạng file cho phép - CẢI THIỆN BẢO MẬT
  allowedMimeTypes: {
    // Images - Chỉ cho phép các format an toàn
    'image/jpeg': { ext: ['jpg', 'jpeg'], magicBytes: ['FFD8FF'] },
    'image/png': { ext: 'png', magicBytes: ['89504E47'] },
    'image/gif': { ext: 'gif', magicBytes: ['47494638'] },
    'image/webp': { ext: 'webp', magicBytes: ['52494646'] },
    'image/bmp': { ext: 'bmp', magicBytes: ['424D'] },
    'image/tiff': { ext: 'tiff', magicBytes: ['49492A00', '4D4D002A'] },
    
    // Documents - Chỉ cho phép Office và PDF
    'application/pdf': { ext: 'pdf', magicBytes: ['25504446'] },
    
    // Microsoft Word
    'application/msword': { ext: 'doc', magicBytes: ['D0CF11E0'] },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'docx', magicBytes: ['504B0304'] },
    'application/vnd.ms-word.document.12': { ext: 'docx', magicBytes: ['504B0304'] },
    
    // Microsoft Excel
    'application/vnd.ms-excel': { ext: 'xls', magicBytes: ['D0CF11E0'] },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: 'xlsx', magicBytes: ['504B0304'] },
    'application/vnd.ms-excel.sheet.12': { ext: 'xlsx', magicBytes: ['504B0304'] },
    'application/vnd.ms-excel.sheet.macroEnabled.12': { ext: 'xlsm', magicBytes: ['504B0304'] },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: 'xlsx', magicBytes: ['504B0304'] },
    
    // Microsoft PowerPoint
    'application/vnd.ms-powerpoint': { ext: 'ppt', magicBytes: ['D0CF11E0'] },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { ext: 'pptx', magicBytes: ['504B0304'] },
    'application/vnd.ms-powerpoint.presentation.12': { ext: 'pptx', magicBytes: ['504B0304'] },
    'application/vnd.ms-powerpoint.slideshow.12': { ext: 'ppsx', magicBytes: ['504B0304'] },
    
    // Microsoft Access
    'application/vnd.ms-access': { ext: 'mdb', magicBytes: ['D0CF11E0'] },
    'application/x-msaccess': { ext: 'mdb', magicBytes: ['D0CF11E0'] },
    
    // Microsoft Publisher
    'application/x-mspublisher': { ext: 'pub', magicBytes: ['D0CF11E0'] },
    
    // Microsoft Visio
    'application/vnd.visio': { ext: 'vsd', magicBytes: ['D0CF11E0'] },
    'application/vnd.visio2013': { ext: 'vsdx', magicBytes: ['504B0304'] },
    
    // Microsoft Project
    'application/vnd.ms-project': { ext: 'mpp', magicBytes: ['D0CF11E0'] },
    
    // Microsoft OneNote
    'application/onenote': { ext: 'one', magicBytes: ['D0CF11E0'] },
    'application/msonenote': { ext: 'one', magicBytes: ['D0CF11E0'] },
    
    // OpenDocument formats (LibreOffice, OpenOffice)
    'application/vnd.oasis.opendocument.text': { ext: 'odt', magicBytes: ['504B0304'] },
    'application/vnd.oasis.opendocument.spreadsheet': { ext: 'ods', magicBytes: ['504B0304'] },
    'application/vnd.oasis.opendocument.presentation': { ext: 'odp', magicBytes: ['504B0304'] },
    'application/vnd.oasis.opendocument.graphics': { ext: 'odg', magicBytes: ['504B0304'] },
    'application/vnd.oasis.opendocument.chart': { ext: 'odc', magicBytes: ['504B0304'] },
    'application/vnd.oasis.opendocument.formula': { ext: 'odf', magicBytes: ['504B0304'] },
    'application/vnd.oasis.opendocument.database': { ext: 'odb', magicBytes: ['504B0304'] },
    'application/vnd.oasis.opendocument.image': { ext: 'odi', magicBytes: ['504B0304'] },
    
    // Text files - Chỉ cho phép plain text
    'text/plain': { ext: 'txt', magicBytes: [] }, // Không có magic bytes cụ thể
    'text/csv': { ext: 'csv', magicBytes: [] },
    
    // Archives - Chỉ cho phép ZIP (an toàn nhất)
    'application/zip': { ext: 'zip', magicBytes: ['504B0304', '504B0506', '504B0708'] },
    'application/x-zip-compressed': { ext: 'zip', magicBytes: ['504B0304', '504B0506', '504B0708'] },
    'application/octet-stream': { ext: 'zip', magicBytes: ['504B0304', '504B0506', '504B0708'] }, // chỉ cho zip
    
    // Email - Chỉ cho phép MSG
    'application/vnd.ms-outlook': { ext: 'msg', magicBytes: ['D0CF11E0'] },
    'application/octet-stream': { ext: 'msg', magicBytes: [] } // Fallback cho MSG - không check magic bytes
  },

  // Danh sách file extensions bị cấm
  forbiddenExtensions: [
    '.exe', '.bat', '.cmd', '.com', '.scr', '.pif', '.vbs', '.js', '.jar',
    '.msi', '.dmg', '.app', '.sh', '.py', '.php', '.asp', '.aspx', '.jsp',
    '.pl', '.rb', '.cgi', '.htaccess', '.htpasswd', '.ini', '.conf',
    '.dll', '.so', '.dylib', '.sys', '.drv', '.ocx', '.cpl', '.reg'
  ],

  // Cấu hình tên file
  filename: {
    // Format: YYYYMMDD_HHMMSS_shortUuid.extension
    format: (originalname) => {
      const date = new Date();
      const timestamp = date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) + '_' +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      const shortUuid = Math.random().toString(36).substring(2, 8);
      const ext = path.extname(originalname).toLowerCase();
      return `${timestamp}_${shortUuid}${ext}`;
    }
  },

  // Cấu hình bảo mật - CẢI THIỆN
  security: {
    // Kiểm tra đường dẫn an toàn
    isPathSafe: (filePath) => {
      const absolutePath = path.resolve(filePath);
      const rootDir = path.resolve(config.rootDir);
      return absolutePath.startsWith(rootDir);
    },

    // Kiểm tra MIME type và extension
    isAllowedMimeType: (mimetype, originalname) => {
      try {
        if (!originalname || typeof originalname !== 'string') return false;
        if (!mimetype || typeof mimetype !== 'string') return false;
        
        const fileConfig = config.allowedMimeTypes[mimetype];
        if (!fileConfig) return false;
        
        // Kiểm tra extension (không phân biệt hoa/thường)
        const ext = path.extname(originalname).toLowerCase();
        
        // Nếu là application/octet-stream, chỉ cho phép .zip hoặc .msg
        if (mimetype === 'application/octet-stream') {
          return ext === '.zip' || ext === '.msg';
        }
        
        // Xử lý trường hợp extension là array hoặc string
        if (Array.isArray(fileConfig.ext)) {
          // Nếu ext là array, kiểm tra xem extension có trong array không
          return fileConfig.ext.some(expectedExt => {
            if (!expectedExt || typeof expectedExt !== 'string') return false;
            return ext === '.' + expectedExt.toLowerCase();
          });
        } else {
          // Nếu ext là string, kiểm tra như cũ
          if (!fileConfig.ext || typeof fileConfig.ext !== 'string') return false;
          const expectedExt = '.' + fileConfig.ext.toLowerCase();
          return ext === expectedExt;
        }
      } catch (error) {
        console.error('❌ Error in isAllowedMimeType:', error);
        return false; // Trả về false thay vì crash
      }
    },

    // Kiểm tra magic bytes
    validateMagicBytes: (buffer, mimetype) => {
      try {
        if (!buffer || !Buffer.isBuffer(buffer)) return false;
        if (!mimetype || typeof mimetype !== 'string') return false;
        
        const fileConfig = config.allowedMimeTypes[mimetype];
        if (!fileConfig || !fileConfig.magicBytes || !fileConfig.magicBytes.length) {
          return true; // Cho phép nếu không có magic bytes
        }

        const hex = buffer.toString('hex').toUpperCase();
        return fileConfig.magicBytes.some(magic => {
          if (!magic || typeof magic !== 'string') return false;
          return hex.startsWith(magic);
        });
      } catch (error) {
        console.error('❌ Error in validateMagicBytes:', error);
        return false; // Trả về false thay vì crash
      }
    },

    // Kiểm tra extension bị cấm
    isForbiddenExtension: (filename) => {
      try {
        if (!filename || typeof filename !== 'string') return false;
        const ext = path.extname(filename).toLowerCase();
        return config.forbiddenExtensions.includes(ext);
      } catch (error) {
        console.error('❌ Error in isForbiddenExtension:', error);
        return true; // Trả về true (bị cấm) thay vì crash
      }
    },

    // Kiểm tra file size
    isFileSizeAllowed: (size) => {
      return size <= config.limits.fileSize;
    },

    // Kiểm tra tên file an toàn
    isSafeFilename: (filename) => {
      try {
        if (!filename || typeof filename !== 'string') return false;
        // Không cho phép ký tự đặc biệt nguy hiểm
        const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
        return !dangerousChars.test(filename);
      } catch (error) {
        console.error('❌ Error in isSafeFilename:', error);
        return false; // Trả về false (không an toàn) thay vì crash
      }
    }
  },

  // Cấu hình xử lý lỗi
  error: {
    messages: {}
  },

  // Cấu hình riêng cho system-info
  systemInfo: {
    // Giới hạn riêng cho system-info (có thể khác với config chung)
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB
      files: 10 // Tối đa 10 file mỗi lần upload
    },
    
    // Loại file được phép cho system-info - GIỚI HẠN HƠN
    allowedTypes: {
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      documents: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv'
      ]
    }
  },

  // Cấu hình riêng cho device-errors
  deviceErrors: {
    // Giới hạn riêng cho device-errors
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB cho device error images
      files: 10 // Tối đa 10 file mỗi lần upload
    },
    
    // Loại file được phép cho device-errors - CHỈ HÌNH ẢNH
    allowedTypes: {
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },

    // Cấu hình đường dẫn
    paths: {
      temp: 'temp',
      final: (errorId) => errorId.toString()
    }
  }
};

// Gán messages động sau khi config đã khởi tạo
config.error.messages = {
  FILE_TOO_LARGE: `File size exceeds limit (${(config.limits.fileSize / 1024 / 1024).toFixed(0)}MB)`,
  TOO_MANY_FILES: `Too many files (max ${config.limits.files})`,
  INVALID_FILE_TYPE: 'Loại file không được hỗ trợ',
  INVALID_FILE_EXTENSION: 'Phần mở rộng file không khớp với loại file',
  FORBIDDEN_EXTENSION: 'Loại file này bị cấm upload',
  INVALID_MAGIC_BYTES: 'File không đúng định dạng (có thể bị giả mạo)',
  UNSAFE_FILENAME: 'Tên file chứa ký tự không hợp lệ',
  INVALID_PATH: 'Invalid file path',
  FILE_NOT_FOUND: 'File not found',
  UPLOAD_ERROR: 'Error uploading file',
  DOWNLOAD_ERROR: 'Error downloading file'
};

// Validation: Kiểm tra UPLOAD_ROOT_DIR đã được set
if (!config.rootDir) {
  throw new Error('UPLOAD_ROOT_DIR chưa được cấu hình! Vui lòng set biến môi trường UPLOAD_ROOT_DIR.');
}

export default config;
