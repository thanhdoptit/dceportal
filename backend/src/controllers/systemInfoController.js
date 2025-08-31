import SystemInfo from '../models/SystemInfo.js';
import db from '../models/index.js';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload.js';

const { User } = db;

if (!uploadConfig.rootDir) {
  throw new Error('UPLOAD_ROOT_DIR chưa được cấu hình! Vui lòng set biến môi trường UPLOAD_ROOT_DIR.');
}
console.log('SystemInfoController - uploadConfig.rootDir:', uploadConfig.rootDir);

// Thêm hàm tạo thư mục tự động
const ensureSystemInfoDirectory = (systemId) => {
  const systemDir = path.join(uploadConfig.rootDir, 'system-info', String(systemId));
  if (!fs.existsSync(systemDir)) {
    fs.mkdirSync(systemDir, { recursive: true });
    console.log('📁 Created system info directory:', systemDir);
  }
  return systemDir;
};

// Thêm hàm xử lý tên file tiếng Việt
const decodeVietnameseFilename = (filename) => {
  try {
    // Decode URI component
    let decoded = decodeURIComponent(filename);
    // Decode base64 nếu cần
    if (decoded.includes('%')) {
      decoded = Buffer.from(decoded, 'base64').toString('utf8');
    }
    return decoded;
  } catch (error) {
    console.warn('⚠️ Error decoding filename:', error);
    return filename;
  }
};

// Thêm hàm sanitize tên file
const sanitizeFileName = (filename) => {
  // Tách phần tên và phần mở rộng
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);

  // Xử lý phần tên file:
  // 1. Bỏ dấu tiếng Việt
  // 2. Thay khoảng trắng bằng dấu gạch dưới
  // 3. Chỉ giữ lại các ký tự an toàn
  const sanitizedName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/\s+/g, '_') // Thay khoảng trắng bằng dấu gạch dưới
    .replace(/[^a-zA-Z0-9_-]/g, '') // Chỉ giữ chữ, số và dấu gạch
    .toLowerCase(); // Chuyển về chữ thường

  return sanitizedName + ext;
};

// Lấy danh sách hệ thống
export const getSystemInfoList = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', systemType = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = { isActive: true };

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { subtitle: { [Op.like]: `%${search}%` } },
          { purpose: { [Op.like]: `%${search}%` } },        // ✅ Search trong cột riêng
          { components: { [Op.like]: `%${search}%` } },     // ✅ Search trong cột riêng
          { operation: { [Op.like]: `%${search}%` } },      // ✅ Search trong cột riêng
          { procedures: { [Op.like]: `%${search}%` } },     // ✅ Search trong cột riêng
          { troubleshooting: { [Op.like]: `%${search}%` } } // ✅ Search trong cột riêng
        ]
      };
    }

    if (systemType) {
      whereClause.systemType = systemType;
    }

    const { count, rows } = await SystemInfo.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'username', 'fullname']
        }
      ],
      order: [['updatedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách hệ thống:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy chi tiết hệ thống theo ID
export const getSystemInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const systemInfo = await SystemInfo.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'username', 'fullname']
        }
      ]
    });

    if (!systemInfo) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hệ thống' });
    }

    res.status(200).json({ success: true, data: systemInfo });
  } catch (error) {
    console.error('Lỗi lấy chi tiết hệ thống:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy chi tiết hệ thống theo loại
export const getSystemInfoByType = async (req, res) => {
  try {
    const { systemType } = req.params;

    const systemInfo = await SystemInfo.findOne({
      where: { systemType, isActive: true },
      include: [
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'username', 'fullname']
        }
      ]
    });

    if (!systemInfo) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hệ thống' });
    }

    res.status(200).json({ success: true, data: systemInfo });
  } catch (error) {
    console.error('Lỗi lấy chi tiết hệ thống:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Tạo mới hệ thống
export const createSystemInfo = async (req, res) => {
  try {
    const {
      systemType,
      title,
      subtitle,
      purpose,           // 5 cột chính
      components,
      operation,
      procedures,
      troubleshooting,
      content           // Nội dung bổ sung (JSON)
    } = req.body;
    const userId = req.user.id;

    // Kiểm tra hệ thống đã tồn tại
    const existingSystem = await SystemInfo.findOne({
      where: { systemType, isActive: true }
    });

    if (existingSystem) {
      return res.status(400).json({
        success: false,
        message: 'Hệ thống này đã tồn tại'
      });
    }

    // Parse content an toàn
    let parsedContent = {};
    if (content) {
      try {
        parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      } catch (error) {
        console.error('Lỗi parse content:', error);
        return res.status(400).json({ success: false, message: 'Dữ liệu content không hợp lệ' });
      }
    }

    const systemInfo = await SystemInfo.create({
      systemType,
      title,
      subtitle,
      purpose,
      components,
      operation,
      procedures,
      troubleshooting,
      content: parsedContent,
      updatedBy: userId
    });

    res.status(201).json({
      success: true,
      message: 'Tạo hệ thống thành công',
      data: systemInfo
    });
  } catch (error) {
    console.error('Lỗi tạo hệ thống:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Cập nhật hệ thống
export const updateSystemInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      purpose,           // 5 cột chính
      components,
      operation,
      procedures,
      troubleshooting,
      content,           // Nội dung bổ sung (JSON)
      systemType,
      isActive
    } = req.body;
    const userId = req.user.id;



    const systemInfo = await SystemInfo.findByPk(id);

    if (!systemInfo) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hệ thống' });
    }

    // Đảm bảo thư mục tồn tại
    ensureSystemInfoDirectory(id);

    // Parse content an toàn
    let parsedContent = {};
    if (content) {
      try {
        parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      } catch (error) {
        console.error('Lỗi parse content:', error);
        return res.status(400).json({ success: false, message: 'Dữ liệu content không hợp lệ' });
      }
    }

    // Cập nhật hệ thống
    await systemInfo.update({
      title,
      subtitle,
      purpose,
      components,
      operation,
      procedures,
      troubleshooting,
      content: parsedContent,
      systemType,
      isActive,
      updatedBy: userId
    });

    // Lấy dữ liệu đã cập nhật
    const updatedSystemInfo = await SystemInfo.findByPk(id, {
      include: [
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'username', 'fullname']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Cập nhật hệ thống thành công',
      data: updatedSystemInfo
    });
  } catch (error) {
    console.error('Lỗi cập nhật hệ thống:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Xóa hệ thống (soft delete)
export const deleteSystemInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const systemInfo = await SystemInfo.findByPk(id);

    if (!systemInfo) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hệ thống' });
    }

    await systemInfo.update({
      isActive: false,
      updatedBy: userId
    });

    res.status(200).json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    console.error('Lỗi xóa hệ thống:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Upload file cho hệ thống - Cập nhật logic mới
export const uploadSystemFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileType, section, itemIndex } = req.body; // section: 'purpose', 'components', 'operation', 'procedures', 'troubleshooting', 'general'
    const userId = req.user.id;

    // Kiểm tra có file được upload không
    if (!req.file && !req.files) {
      return res.status(400).json({ success: false, message: 'Không có file được upload' });
    }

    const systemInfo = await SystemInfo.findByPk(id);
    if (!systemInfo) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hệ thống' });
    }

    // Đảm bảo thư mục tồn tại
    ensureSystemInfoDirectory(id);

    // Xử lý upload nhiều file hoặc một file
    const files = req.files || [req.file];

    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        // Kiểm tra kích thước file
        if (file.size > 100 * 1024 * 1024) { // 100MB
          errors.push(`File ${file.originalname} quá lớn (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
          continue;
        }

        // Đảm bảo path là relative
        let relativePath = file.path;
        if (relativePath && path.isAbsolute(relativePath)) {
          relativePath = path.relative(uploadConfig.rootDir, relativePath);
        }

        const fileInfo = {
          filename: file.filename,
          originalName: decodeVietnameseFilename(file.originalname),
          path: relativePath,
          size: file.size,
          mimetype: file.mimetype,
          uploadedAt: new Date(),
          uploadedBy: userId
        };

        uploadedFiles.push(fileInfo);

      } catch (fileError) {
        console.error(`❌ Error uploading ${file.originalname}:`, fileError);
        errors.push(`Lỗi upload ${file.originalname}: ${fileError.message}`);
      }
    }

    // Cập nhật content JSON với file mới
    if (uploadedFiles.length > 0) {
      let content = systemInfo.content || {};

      // Tạo section nếu chưa có
      if (!content[section]) {
        content[section] = {};
      }

      // Tạo mảng files nếu chưa có
      if (!content[section].files) {
        content[section].files = [];
      }

      // Thêm file mới vào section
      content[section].files.push(...uploadedFiles);

      await systemInfo.update({
        content: content,
        updatedBy: userId
      });

    }

    // Trả về kết quả
    const response = {
      success: true,
      message: `Upload thành công ${uploadedFiles.length} file vào ${section}`,
      data: {
        uploadedFiles,
        totalSize: uploadedFiles.reduce((sum, file) => sum + file.size, 0),
        errors: errors.length > 0 ? errors : undefined
      }
    };

    if (errors.length > 0) {
      response.message += `, ${errors.length} file lỗi`;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Lỗi upload file:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi upload file' });
  }
};

// Xóa file của hệ thống - Cập nhật logic mới
export const deleteSystemFile = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const userId = req.user.id;

    const systemInfo = await SystemInfo.findByPk(id);
    if (!systemInfo) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hệ thống' });
    }

    // Tìm file trong content JSON của các section
    const content = systemInfo.content || {};
    let fileFound = false;
    let foundSection = null;
    let foundItemIndex = null;
    let foundType = null; // 'image' hoặc 'document' hoặc 'files'
    let filePath = null;

    // Duyệt qua các section để tìm file
    const sections = ['purpose', 'components', 'operation', 'procedures', 'troubleshooting', 'general'];

    for (const section of sections) {
      // 1. Xóa trong files trực tiếp (cấu trúc cũ)
      if (content[section]?.files && Array.isArray(content[section].files)) {
        const fileIndex = content[section].files.findIndex(f => f.filename === filename);
        if (fileIndex !== -1) {
          // Xóa file khỏi mảng
          content[section].files.splice(fileIndex, 1);
          fileFound = true;
          foundSection = section;
          foundType = 'files';
          // Đường dẫn vật lý cũ
          filePath = path.join(uploadConfig.rootDir, 'system-info', String(id), filename);
          break;
        }
      }
      // 2. Xóa trong items[].images/documents (cấu trúc mới)
      if (content[section]?.items && Array.isArray(content[section].items)) {
        for (let itemIndex = 0; itemIndex < content[section].items.length; itemIndex++) {
          const item = content[section].items[itemIndex];
          // Xóa trong images
          if (item.images && Array.isArray(item.images)) {
            const imgIndex = item.images.findIndex(f => f.filename === filename);
            if (imgIndex !== -1) {
              // Lấy đường dẫn vật lý
              filePath = path.join(uploadConfig.rootDir, 'system-info', String(id), section, `item_${itemIndex}`, filename);
              // Xóa metadata
              item.images.splice(imgIndex, 1);
              fileFound = true;
              foundSection = section;
              foundItemIndex = itemIndex;
              foundType = 'image';
              break;
            }
          }
          // Xóa trong documents
          if (item.documents && Array.isArray(item.documents)) {
            const docIndex = item.documents.findIndex(f => f.filename === filename);
            if (docIndex !== -1) {
              // Lấy đường dẫn vật lý
              filePath = path.join(uploadConfig.rootDir, 'system-info', String(id), section, `item_${itemIndex}`, filename);
              // Xóa metadata
              item.documents.splice(docIndex, 1);
              fileFound = true;
              foundSection = section;
              foundItemIndex = itemIndex;
              foundType = 'document';
              break;
            }
          }
        }
        if (fileFound) break;
      }
    }

    if (!fileFound) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy file' });
    }

    // Xóa file vật lý
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    } else {
      console.warn('⚠️ File not found on disk:', filePath);
    }

    // Cập nhật database
    await systemInfo.update({
      content: content,
      updatedBy: userId
    });

    res.status(200).json({
      success: true,
      message: 'Xóa file thành công',
      data: {
        deletedFile: filename,
        section: foundSection,
        itemIndex: foundItemIndex,
        type: foundType
      }
    });
  } catch (error) {
    console.error('❌ Lỗi xóa file:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa file' });
  }
};

// Lấy toàn bộ danh sách hệ thống (không phân trang, không filter)
export const getAllSystemInfo = async (req, res) => {
  try {
    const data = await SystemInfo.findAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: User,
          as: 'updater',
          attributes: ['id', 'username', 'fullname']
        }
      ]
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// API download file cho SystemInfo - Cập nhật logic mới
export const downloadSystemInfoFile = async (req, res) => {
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

    // Xử lý filename - có thể là đường dẫn tương đối đầy đủ hoặc chỉ tên file
    let searchFilename = filename;
    let filePath;
    
    // Kiểm tra xem filename có chứa đường dẫn không
    if (filename.includes('\\') || filename.includes('/')) {
      // Nếu là đường dẫn tương đối đầy đủ, tách ra tên file
      searchFilename = path.basename(filename);
      // Tạo đường dẫn tuyệt đối từ đường dẫn tương đối
      filePath = path.join(uploadConfig.rootDir, filename);
    } else {
      // Nếu chỉ là tên file, tìm trong database và tạo đường dẫn
      filePath = path.join(uploadConfig.rootDir, 'system-info', String(id), filename);
    }

    // Tìm file trong content JSON của các section
    const content = systemInfo.content || {};
    let fileInfo = null;
    let foundSection = null;
    let foundItemIndex = null;

    // Duyệt qua các section để tìm file
    const sections = ['purpose', 'components', 'operation', 'procedures', 'troubleshooting', 'general'];

    for (const section of sections) {
      // Tìm trong files trực tiếp của section (cấu trúc cũ)
      if (content[section]?.files && Array.isArray(content[section].files)) {
        let found;
        if (section === 'general') {
          // Section general có cấu trúc đặc biệt với response object
          found = content[section].files.find(f => f.response?.filename === searchFilename);
        } else {
          // Các section khác có filename trực tiếp
          found = content[section].files.find(f => f.filename === searchFilename);
        }

        if (found) {
          // Nếu là section general, lấy metadata từ response
          if (section === 'general' && found.response) {
            fileInfo = found.response;
          } else {
            fileInfo = found;
          }
          foundSection = section;
          break;
        }
      }

      // Tìm trong items của section (cấu trúc mới)
      if (content[section]?.items && Array.isArray(content[section].items)) {
        for (let itemIndex = 0; itemIndex < content[section].items.length; itemIndex++) {
          const item = content[section].items[itemIndex];

          // Tìm trong images
          if (item.images && Array.isArray(item.images)) {
            const found = item.images.find(f => f.filename === searchFilename);
            if (found) {
              fileInfo = found;
              foundSection = section;
              foundItemIndex = itemIndex;
              break;
            }
          }

          // Tìm trong documents
          if (item.documents && Array.isArray(item.documents)) {
            const found = item.documents.find(f => f.filename === searchFilename);
            if (found) {
              fileInfo = found;
              foundSection = section;
              foundItemIndex = itemIndex;
              break;
            }
          }
        }
        if (fileInfo) break;
      }
    }

    if (!fileInfo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy file trong database',
        debug: {
          id,
          filename: searchFilename,
          sections: sections,
          contentKeys: Object.keys(content)
        }
      });
    }

    // Nếu fileInfo có path tương đối, sử dụng path đó để tạo đường dẫn tuyệt đối
    if (fileInfo.path && !path.isAbsolute(fileInfo.path)) {
      filePath = path.join(uploadConfig.rootDir, fileInfo.path);
    } else if (foundItemIndex !== null) {
      // Cấu trúc mới: system-info/{id}/{section}/item_{index}/{filename}
      filePath = path.join(uploadConfig.rootDir, 'system-info', String(id), foundSection, `item_${foundItemIndex}`, searchFilename);
    } else {
      // Cấu trúc cũ: system-info/{id}/{filename}
      filePath = path.join(uploadConfig.rootDir, 'system-info', String(id), searchFilename);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File không tồn tại trên server',
        debug: {
          filePath,
          uploadRootDir: uploadConfig.rootDir,
          systemInfoDir: path.join(uploadConfig.rootDir, 'system-info'),
          targetDir: path.join(uploadConfig.rootDir, 'system-info', String(id))
        }
      });
    }

    // Xử lý tên file tiếng Việt cho download
    let originalName = fileInfo.originalName || fileInfo.originalname || fileInfo.filename;
    try {
      originalName = decodeVietnameseFilename(originalName);
    } catch (error) {
      console.warn('⚠️ Error decoding filename for download:', error);
    }

    // Set headers
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalName)}"; filename*=UTF-8''${encodeURIComponent(originalName)}`);
    res.setHeader('Content-Type', fileInfo.mimetype || 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error('❌ Error reading file:', err);
      res.status(500).json({ message: 'Lỗi khi đọc file' });
    });
  } catch (err) {
    console.error('❌ Download system info file error:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tải file', error: err.message });
  }
};

// API upload file cho mục con (components, issues, procedures, operation)
export const uploadSubItemFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fieldName, itemIndex, fileType } = req.body; // fieldName: 'components', 'issues', 'procedures', itemIndex: số thứ tự item, fileType: 'image' hoặc 'document'
    const userId = req.user.id;

    // Kiểm tra các tham số bắt buộc
    if (!fieldName || itemIndex === undefined || !fileType) {
      console.error('❌ Missing required parameters:', { fieldName, itemIndex, fileType });
      return res.status(400).json({
        success: false,
        message: 'Thiếu tham số bắt buộc: fieldName, itemIndex, fileType'
      });
    }

    // Kiểm tra có file được upload không
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file được upload' });
    }

    const systemInfo = await SystemInfo.findByPk(id);
    if (!systemInfo) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hệ thống' });
    }

    // Đảm bảo thư mục tồn tại
    ensureSystemInfoDirectory(id);

    // Kiểm tra kích thước file
    if (req.file.size > 100 * 1024 * 1024) { // 100MB
      return res.status(400).json({
        success: false,
        message: `File ${req.file.originalname} quá lớn (${(req.file.size / 1024 / 1024).toFixed(2)}MB)`
      });
    }

    // Tạo metadata file với đường dẫn tương đối

    // Kiểm tra req.file.path có tồn tại không
    if (!req.file.path) {
      console.error('❌ req.file.path is undefined!');
      return res.status(500).json({ success: false, message: 'Lỗi: đường dẫn file không hợp lệ' });
    }

    // Tạo đường dẫn tương đối an toàn
    let relativePath;
    try {
      // Kiểm tra xem req.file.path đã là relative hay absolute
      if (path.isAbsolute(req.file.path)) {
        relativePath = path.relative(uploadConfig.rootDir, req.file.path);
      } else {
        // Nếu đã là relative, sử dụng trực tiếp
        relativePath = req.file.path;
      }
    } catch (error) {
      console.error('❌ Error calculating relative path:', error);
      relativePath = req.file.filename; // Fallback to filename
    }

    // Di chuyển file từ vị trí tạm sang vị trí đúng cấu trúc
    
    // Đảm bảo sử dụng đường dẫn tuyệt đối cho file gốc
    let oldPath = req.file.path;
    if (!path.isAbsolute(oldPath)) {
      oldPath = path.join(uploadConfig.rootDir, oldPath);
    }
    
    const newDir = path.join(uploadConfig.rootDir, 'system-info', String(id), fieldName, `item_${itemIndex}`);
    const newPath = path.join(newDir, req.file.filename);

    // Tạo thư mục đích nếu chưa có
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    // Kiểm tra file gốc có tồn tại không
    if (!fs.existsSync(oldPath)) {
      console.error('❌ Source file not found:', oldPath);
      return res.status(500).json({ 
        success: false, 
        message: 'File nguồn không tồn tại',
        debug: { oldPath, newPath }
      });
    }

    // Di chuyển file
    fs.copyFileSync(oldPath, newPath);
    fs.unlinkSync(oldPath);

    // Cập nhật đường dẫn tương đối
    const newRelativePath = path.relative(uploadConfig.rootDir, newPath);

    // Tạo metadata file với thông tin đầy đủ
    const fileInfo = {
      filename: req.file.filename,
      originalName: decodeVietnameseFilename(req.file.originalname),
      path: newRelativePath, // Lưu đường dẫn tương đối mới
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
      uploadedBy: userId,
      // Thêm thông tin để debug
      fieldName: fieldName,
      itemIndex: itemIndex,
      fileType: fileType
    };

    // Cập nhật content JSON với file mới
    let content = systemInfo.content || {};

    // Tạo field nếu chưa có
    if (!content[fieldName]) {
      content[fieldName] = { items: [] };
    }

    // Tạo item nếu chưa có
    if (!content[fieldName].items[itemIndex]) {
      content[fieldName].items[itemIndex] = {};
    }

    // Tạo mảng files nếu chưa có
    const fileArrayName = fileType === 'image' ? 'images' : 'documents';
    if (!content[fieldName].items[itemIndex][fileArrayName]) {
      content[fieldName].items[itemIndex][fileArrayName] = [];
    }

    // Thêm file mới vào item
    content[fieldName].items[itemIndex][fileArrayName].push(fileInfo);

    // Cập nhật database
    await systemInfo.update({
      content: content,
      updatedBy: userId
    });

    // Trả về metadata file để frontend cập nhật vào form
    res.status(200).json({
      success: true,
      message: 'Upload file thành công',
      data: fileInfo
    });
  } catch (error) {
    console.error('❌ Lỗi upload sub-item file:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Lỗi server khi upload file' });
  }
};

// API upload file cho operation
export const uploadOperationFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { operationType, fileType } = req.body; // operationType: 'normal' hoặc 'backup', fileType: 'image' hoặc 'document'
    const userId = req.user.id;

    // Kiểm tra có file được upload không
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file được upload' });
    }

    const systemInfo = await SystemInfo.findByPk(id);
    if (!systemInfo) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hệ thống' });
    }

    // Kiểm tra kích thước file
    if (req.file.size > 100 * 1024 * 1024) { // 100MB
      return res.status(400).json({
        success: false,
        message: `File ${req.file.originalname} quá lớn (${(req.file.size / 1024 / 1024).toFixed(2)}MB)`
      });
    }

    // Tạo metadata file
    let relativePath = req.file.path;
    if (relativePath && path.isAbsolute(relativePath)) {
      relativePath = path.relative(uploadConfig.rootDir, relativePath);
    }
    const fileInfo = {
      filename: req.file.filename,
      originalName: decodeVietnameseFilename(req.file.originalname),
      path: relativePath,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
      uploadedBy: userId
    };

    // Trả về metadata file để frontend cập nhật vào form
    res.status(200).json({
      success: true,
      message: 'Upload file thành công',
      data: fileInfo
    });
  } catch (error) {
    console.error('❌ Lỗi upload operation file:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi upload file' });
  }
};
