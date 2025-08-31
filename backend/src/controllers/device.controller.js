import db from '../models/index.js';
import { DEFAULT_DEVICES } from '../constants/devices.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import config from '../config/upload.js';

const { Device, ShiftCheckItem, DeviceError, User, DeviceErrorHistory } = db;

// Khởi tạo danh sách thiết bị mặc định
export const initializeDevices = async (req, res) => {
  try {
    const devices = await Promise.all(DEFAULT_DEVICES.map(device =>
      Device.create({
        category: device.category,
        deviceName: device.deviceName,
        serialNumber: device.serialNumber,
        position: device.position || 'Chưa xác định',
        isActive: true
      })
    ));

    res.status(201).json(devices);
  } catch (error) {
    console.error('Lỗi khi khởi tạo thiết bị:', error);
    res.status(500).json({ message: error.message || 'Lỗi server' });
  }
};

// Lấy danh sách thiết bị
export const getDevices = async (req, res) => {
  try {
    const where = { isActive: true };

    const devices = await Device.findAll({
      where,
      attributes: ['id', 'category', 'deviceName', 'serialNumber', 'position', 'isActive', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json(devices);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thiết bị:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách tất cả thiết bị cho quản lý (bao gồm cả inactive)
export const getAllDevicesForManagement = async (req, res) => {
  try {
    const devices = await Device.findAll({
      attributes: ['id', 'category', 'deviceName', 'serialNumber', 'position', 'isActive', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json(devices);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thiết bị cho quản lý:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách tên device từ database
export const getDeviceNames = async (req, res) => {
  try {
    const devices = await Device.findAll({
      attributes: ['id', 'deviceName', 'category', 'position'],
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    // Format dữ liệu trả về
    const deviceNames = devices.reduce((acc, device) => {
      acc[device.id] = {
        id: device.id,
        name: device.deviceName,
        category: device.category,
        position: device.position
      };
      return acc;
    }, {});

    res.json({
      success: true,
      data: deviceNames,
      count: devices.length
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tên device:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách tên device',
      error: error.message
    });
  }
};

// Thêm thiết bị mới
export const createDevice = async (req, res) => {
  try {
    const { category, deviceName, serialNumber, position, isActive } = req.body;

    if (!category || !deviceName || !position) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const device = await Device.create({
      category,
      deviceName,
      serialNumber,
      position,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(device);
  } catch (error) {
    console.error('Lỗi khi tạo thiết bị:', error);
    res.status(500).json({ message: error.message || 'Lỗi server' });
  }
};

// Cập nhật thông tin thiết bị
export const updateDevice = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const { category, deviceName, serialNumber, position, isActive } = req.body;

    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }

    // Lưu giá trị cũ để theo dõi thay đổi
    const oldValues = {
      category: device.category,
      deviceName: device.deviceName,
      serialNumber: device.serialNumber,
      position: device.position,
      isActive: device.isActive
    };

    await device.update({
      category,
      deviceName,
      serialNumber,
      position,
      isActive
    }, { transaction });

    // Bỏ phần theo dõi thay đổi vì DeviceErrorHistory chỉ dành cho lỗi thiết bị
    // Có thể tạo model riêng cho DeviceHistory nếu cần

    await transaction.commit();
    res.json(device);
  } catch (error) {
    await transaction.rollback();
    console.error('Lỗi khi cập nhật thiết bị:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa thiết bị (soft delete)
export const deleteDevice = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;

    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }

    // Bỏ phần lưu lịch sử vì DeviceErrorHistory chỉ dành cho lỗi thiết bị

    await device.update({ isActive: false }, { transaction });
    await transaction.commit();
    res.json({ message: 'Xóa thiết bị thành công' });
  } catch (error) {
    await transaction.rollback();
    console.error('Lỗi khi xóa thiết bị:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Khôi phục thiết bị đã xóa
export const restoreDevice = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;

    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }

    if (device.isActive) {
      return res.status(400).json({ message: 'Thiết bị đã hoạt động' });
    }

    // Bỏ phần lưu lịch sử vì DeviceErrorHistory chỉ dành cho lỗi thiết bị

    await device.update({ isActive: true }, { transaction });
    await transaction.commit();
    res.json({ message: 'Khôi phục thiết bị thành công' });
  } catch (error) {
    await transaction.rollback();
    console.error('Lỗi khi khôi phục thiết bị:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy thống kê thiết bị
export const getDeviceStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const statistics = await Device.findAll({
      attributes: [
        'category',
        [db.sequelize.fn('COUNT', db.sequelize.col('Device.id')), 'totalDevices'],
        [db.sequelize.fn('SUM',
          db.sequelize.literal("CASE WHEN status = 'Có lỗi' THEN 1 ELSE 0 END")
        ), 'errorDevices']
      ],
      include: [{
        model: ShiftCheckItem,
        as: 'checkItems',
        attributes: [],
        required: false,
        where: startDate && endDate ? {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        } : undefined
      }],
      group: ['Device.category'],
      raw: true
    });

    res.json(statistics);
  } catch (error) {
    console.error('Lỗi khi lấy thống kê thiết bị:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách lỗi có thể xảy ra cho thiết bị
export const getDeviceErrors = async (req, res) => {
  try {
    const {
      deviceId,
      location,
      resolveStatus,
      startDate,
      endDate,
      page = 1,
      limit = 15
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Cho phép lấy tất cả lỗi nếu không truyền deviceId, và lọc theo resolveStatus nếu có
    const where = {};
    if (deviceId) where.deviceId = deviceId;
    if (location) where.location = location;

    // Hỗ trợ cả single value và array cho resolveStatus
    if (resolveStatus) {
      if (Array.isArray(resolveStatus)) {
        where.resolveStatus = { [Op.in]: resolveStatus };
      } else {
        where.resolveStatus = resolveStatus;
      }
    }

    // Thêm filter thời gian
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // Đếm tổng số records
    const total = await DeviceError.count({ where });

    // Lấy tất cả records để sắp xếp đúng thứ tự trước khi pagination
    const allErrors = await DeviceError.findAll({
      where,
      include: [{
        model: DeviceErrorHistory,
        as: 'history',
        order: [['createdAt', 'DESC']]
      }],
      order: [
        [db.sequelize.literal(`CASE [DeviceError].[resolveStatus]
          WHEN 'Chưa xử lý' THEN 1
          WHEN 'Đang xử lý' THEN 2
          WHEN 'Đã xử lý' THEN 3
          ELSE 4 END`), 'ASC']
      ]
    });

    // Sắp xếp thủ công theo trạng thái và createdAt
    const sortedErrors = allErrors.sort((a, b) => {
      // Định nghĩa thứ tự ưu tiên trạng thái
      const statusOrder = {
        'Chưa xử lý': 1,
        'Đang xử lý': 2,
        'Đã xử lý': 3
      };

      const statusA = statusOrder[a.resolveStatus] || 4;
      const statusB = statusOrder[b.resolveStatus] || 4;

      // So sánh trạng thái trước
      if (statusA !== statusB) {
        return statusA - statusB;
      }

      // Nếu cùng trạng thái, sắp xếp theo createdAt DESC (mới nhất lên đầu)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Áp dụng pagination sau khi đã sắp xếp
    const errorHistory = sortedErrors.slice(offset, offset + parseInt(limit));



    // Trả về danh sách lỗi kèm lịch sử
    return res.status(200).json({
      errors: errorHistory.map(error => ({
        id: error.id,
        deviceId: error.deviceId,
        location: error.location,
        position: error.position,
        subDeviceName: error.subDeviceName,
        serialNumber: error.serialNumber,
        errorCode: error.errorCode,
        errorCause: error.errorCause,
        solution: error.solution,
        images: error.images,
        resolveStatus: error.resolveStatus,
        resolvedAt: error.resolvedAt,
        resolvedBy: error.resolvedBy,
        resolveNote: error.resolveNote,
        createdBy: error.createdBy,
        createdAt: error.createdAt,
        updatedAt: error.updatedAt
      })),
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lỗi thiết bị:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

// Thêm API endpoint để lấy lịch sử thay đổi của một lỗi
export const getDeviceErrorHistory = async (req, res) => {
  try {
    const { errorId } = req.params;

    const history = await DeviceErrorHistory.findAll({
      where: { errorId },
      include: [{
        model: User,
        as: 'changedByUser',
        attributes: ['id', 'username', 'fullname']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(history.map(record => ({
      ...record.toJSON(),
      changedBy: record.changedByUser
    })));
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử DeviceError:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Hàm lưu lịch sử thay đổi lỗi thiết bị
export const trackDeviceErrorChange = async (
  errorId,
  changedBy,
  changeType,
  field,
  oldValue,
  newValue,
  changeReason = null,
  isAutomatic = false,
  transaction = null,
  changeId = null
) => {
  try {
    // Chỉ lưu khi có thay đổi thực sự hoặc là tạo mới
    let safeOldValue =
      oldValue !== undefined && oldValue !== null && oldValue !== ''
        ? String(oldValue).trim()
        : null;
    let safeNewValue =
      newValue !== undefined && newValue !== null && newValue !== ''
        ? String(newValue).trim()
        : null;
    if (safeNewValue === null) return;
    if (changeType !== 'create' && safeOldValue !== null && safeNewValue === null) return;
    if (changeType !== 'create' && safeOldValue === safeNewValue) return;

    let finalChangeReason = changeReason || 'Cập nhật thông tin';

    await DeviceErrorHistory.create({
      errorId,
      changedBy,
      changeType,
      field,
      oldValue: safeOldValue,
      newValue: safeNewValue,
      changeReason: finalChangeReason,
      isAutomatic: !!isAutomatic,
      changeId,
    }, { transaction });

  } catch (error) {
    console.error('Lỗi khi lưu lịch sử DeviceError:', error);
    throw error;
  }
};

// Cập nhật trạng thái lỗi thiết bị
export const updateDeviceError = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const { resolveStatus, resolvedAt, resolveNote, solution, errorCause, subDeviceName, serialNumber, errorCode, position, images } = req.body;

    const error = await DeviceError.findByPk(id);
    if (!error) {
      return res.status(404).json({ message: 'Không tìm thấy lỗi thiết bị' });
    }

    // Lưu giá trị cũ để theo dõi thay đổi
    const oldValues = {
      resolveStatus: error.resolveStatus,
      resolvedAt: error.resolvedAt,
      resolveNote: error.resolveNote,
      solution: error.solution,
      errorCause: error.errorCause,
      deviceErrorId: error.deviceErrorId,
      subDeviceName: error.subDeviceName,
      serialNumber: error.serialNumber,
      errorCode: error.errorCode,
      position: error.position,
      images: error.images
    };

    // Chỉ cập nhật resolvedAt khi đã xử lý
    const updateData = {
      resolveStatus,
      resolveNote,
      solution,
      errorCause,
      resolvedBy: req.user.id,
      subDeviceName,
      serialNumber,
      errorCode,
      position,
      images,
      resolvedAt
    };

    if (resolveStatus === 'Đã xử lý') {
      updateData.resolvedAt = resolvedAt || new Date();
    }

    await error.update(updateData, { transaction });

    // Sinh changeId duy nhất cho 1 lần cập nhật
    const changeId = uuidv4();

    // Theo dõi thay đổi cho từng trường
    for (const [field, oldValue] of Object.entries(oldValues)) {
      const newValue = error[field];
      if (oldValue !== newValue) {
        let changeType = 'update';
        if (field === 'resolveStatus' && oldValue === 'Chưa xử lý' && newValue === 'Đã xử lý') {
          changeType = 'resolve';
        } else if (field === 'resolveStatus' && oldValue === 'Chưa xử lý' && newValue === 'Đang xử lý') {
          changeType = 'start_progress';
        } else if (field === 'resolveStatus' && oldValue === 'Đang xử lý' && newValue === 'Đã xử lý') {
          changeType = 'resolve';
        }
        await trackDeviceErrorChange(
          error.id,
          req.user.id,
          changeType,
          field,
          oldValue,
          newValue,
          'Cập nhật trạng thái lỗi',
          false,
          transaction,
          changeId
        );
      }
    }

    await transaction.commit();
    res.json(error);
  } catch (error) {
    await transaction.rollback();
    console.error('Lỗi khi cập nhật trạng thái lỗi:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy chi tiết 1 lỗi thiết bị
export const getDeviceErrorById = async (req, res) => {
  try {
    const { id } = req.params;
    const error = await DeviceError.findByPk(id);
    if (!error) {
      return res.status(404).json({ message: 'Không tìm thấy lỗi thiết bị' });
    }
    res.json(error);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết lỗi thiết bị:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cleanup temp images cũ (tự động xóa sau 24h)
export const cleanupTempImages = async () => {
  try {
    const tempDir = path.join(config.rootDir, config.directories.deviceErrors, config.deviceErrors.paths.temp);
    if (!fs.existsSync(tempDir)) {
      return;
    }

    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 giờ

    let deletedCount = 0;
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);

      if (now - stats.mtime.getTime() > maxAge) {
        try {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(`🧹 Cleanup: Đã xóa temp file cũ: ${file}`);
        } catch (error) {
          console.error(`❌ Không thể xóa temp file: ${file}`, error);
        }
      }
    }

    if (deletedCount > 0) {
      console.log(`🧹 Cleanup: Đã xóa ${deletedCount} temp files cũ`);
    }
  } catch (error) {
    console.error('❌ Lỗi khi cleanup temp images:', error);
  }
};

// Tạo sự cố thiết bị mới
export const createDeviceError = async (req, res) => {
  console.log('🚀 === BACKEND: BẮT ĐẦU TẠO DEVICE ERROR ===');
  console.log('📋 Request body:', req.body);
  console.log('📋 Request files:', req.files);
  console.log('👤 User:', req.user);

  const transaction = await db.sequelize.transaction();
  try {
    const {
      deviceId,
      location,
      subDeviceName,
      serialNumber,
      errorCode,
      errorCause,
      solution,
      position,
      images,
      resolveStatus = 'Chưa xử lý'
    } = req.body;

    console.log('📋 Parsed request data:', {
      deviceId,
      location,
      subDeviceName,
      serialNumber,
      errorCode,
      errorCause,
      solution,
      position,
      images,
      resolveStatus
    });

    // Validate required fields
    if (!deviceId || !location || !errorCause) {
      return res.status(400).json({
        message: 'Thiếu thông tin bắt buộc: deviceId, location, errorCause'
      });
    }

    // Validate resolveStatus
    if (resolveStatus && !['Chưa xử lý', 'Đang xử lý', 'Đã xử lý'].includes(resolveStatus)) {
      return res.status(400).json({
        message: 'Trạng thái xử lý không hợp lệ. Chỉ chấp nhận: Chưa xử lý, Đang xử lý hoặc Đã xử lý'
      });
    }

    // Check if device exists
    const device = await Device.findByPk(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }

    // Xử lý images từ temp sang permanent
    let processedImages = null;
    let tempDeviceErrorId = null;

    // Kiểm tra cả images từ body và files từ multer
    const imageUrls = images ? (typeof images === 'string' ? JSON.parse(images) : images) : [];
    const uploadedFiles = req.files || [];

    console.log('🔍 === XỬ LÝ IMAGES ===');
    console.log('🔍 Raw images from body:', images);
    console.log('🔍 Parsed imageUrls:', imageUrls);
    console.log('🔍 Uploaded files count:', uploadedFiles.length);
    console.log('🔍 Uploaded files:', uploadedFiles.map(f => ({ originalname: f.originalname, size: f.size })));

    if ((Array.isArray(imageUrls) && imageUrls.length > 0) || uploadedFiles.length > 0) {
      try {
        // Đảm bảo thư mục uploads root tồn tại
        const uploadsRoot = config.rootDir;
        console.log('🔍 Config rootDir:', config.rootDir);
        console.log('🔍 Uploads root path:', uploadsRoot);

        if (!fs.existsSync(uploadsRoot)) {
          fs.mkdirSync(uploadsRoot, { recursive: true });
          console.log('📂 Created uploads root directory:', uploadsRoot);
        } else {
          console.log('📂 Uploads root directory already exists:', uploadsRoot);
        }

        // Đảm bảo thư mục device-errors tồn tại (ngang hàng với task, handover)
        const deviceErrorsDir = path.join(config.rootDir, config.directories.deviceErrors);
        if (!fs.existsSync(deviceErrorsDir)) {
          fs.mkdirSync(deviceErrorsDir, { recursive: true });
          console.log('📂 Created device-errors directory:', deviceErrorsDir);
        }

        // Tạo thư mục tạm thời cho device error
        tempDeviceErrorId = Date.now(); // Tạm thời, sẽ được cập nhật sau
        const tempDir = path.join(uploadsRoot, config.directories.deviceErrors, tempDeviceErrorId.toString());
        console.log('📂 Creating directory:', tempDir);

        try {
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
            console.log('✅ Directory created successfully');
          } else {
            console.log('📂 Directory already exists');
          }
        } catch (dirError) {
          console.error('❌ Error creating directory:', dirError);
          throw new Error('Không thể tạo thư mục lưu trữ hình ảnh');
        }

        const movedImages = [];

        // Xử lý files từ multer trước (nếu có)
        for (const file of uploadedFiles) {
          try {
            const fileName = config.filename.format(file.originalname);
            const permanentPath = path.join(tempDir, fileName);
            const permanentUrl = `/uploads/${config.directories.deviceErrors}/${tempDeviceErrorId}/${fileName}`;

            // Copy file từ buffer sang permanent location
            fs.writeFileSync(permanentPath, file.buffer);
            movedImages.push(permanentUrl);
            console.log(`✅ Processed uploaded file: ${file.originalname} -> ${permanentUrl}`);
          } catch (fileError) {
            console.error(`❌ Error processing uploaded file ${file.originalname}:`, fileError);
          }
        }

        console.log('🔍 === XỬ LÝ TEMP URLS ===');
        // Xử lý temp URLs từ frontend
        for (const tempUrl of imageUrls) {
          console.log('🔍 Processing image URL:', tempUrl);

          if (tempUrl.startsWith(`/uploads/${config.directories.deviceErrors}/temp/`)) {
            // Xử lý temp file URLs
            const relativePath = tempUrl.replace('/uploads/', '');
            const tempPath = path.join(config.rootDir, relativePath);
            const fileName = path.basename(tempUrl);
            const permanentPath = path.join(tempDir, fileName);
            const permanentUrl = `/uploads/${config.directories.deviceErrors}/${tempDeviceErrorId}/${fileName}`;

            console.log('🔍 Processing temp URL:', {
              originalUrl: tempUrl,
              relativePath,
              tempPath,
              permanentPath,
              permanentUrl
            });

            if (fs.existsSync(tempPath)) {
              // Di chuyển file từ temp sang permanent
              fs.copyFileSync(tempPath, permanentPath);
              fs.unlinkSync(tempPath); // Xóa file temp
              movedImages.push(permanentUrl);
              console.log(`✅ Moved temp image: ${tempUrl} -> ${permanentUrl}`);
            } else {
              console.log(`⚠️ Temp file not found: ${tempPath}`);
            }
          } else if (tempUrl.startsWith('blob:')) {
            // Xử lý blob URLs - bỏ qua vì đã được xử lý ở frontend
            console.log('⚠️ Skipping blob URL:', tempUrl);
          } else if (tempUrl.includes('/api/devices/errors/temp/images/')) {
            // Xử lý API URLs - lấy filename từ URL
            const filename = tempUrl.split('/').pop();
            const tempPath = path.join(config.rootDir, config.directories.deviceErrors, config.deviceErrors.paths.temp, filename);
            const permanentPath = path.join(tempDir, filename);
            const permanentUrl = `/uploads/${config.directories.deviceErrors}/${tempDeviceErrorId}/${filename}`;

            console.log('🔍 Processing API URL:', {
              originalUrl: tempUrl,
              filename,
              tempPath,
              permanentPath,
              permanentUrl
            });

            if (fs.existsSync(tempPath)) {
              // Di chuyển file từ temp sang permanent
              fs.copyFileSync(tempPath, permanentPath);
              fs.unlinkSync(tempPath); // Xóa file temp
              movedImages.push(permanentUrl);
              console.log(`✅ Moved temp image: ${tempUrl} -> ${permanentUrl}`);
            } else {
              console.log(`⚠️ Temp file not found: ${tempPath}`);
            }
          } else {
            console.log('⚠️ Unknown URL format:', tempUrl);
          }
        }

        console.log('🔍 === KẾT QUẢ XỬ LÝ IMAGES ===');
        console.log('🔍 Moved images:', movedImages);
        processedImages = JSON.stringify(movedImages);
        console.log('🔍 Final processedImages (JSON):', processedImages);
      } catch (imageError) {
        console.error('❌ Lỗi khi xử lý images:', imageError);
        // Không fail toàn bộ request nếu chỉ lỗi images
      }
    } else {
      console.log('⚠️ No images provided');
    }

    console.log('🔍 === TẠO DEVICE ERROR ===');
    console.log('🔍 Device error data to create:', {
      deviceId,
      location,
      subDeviceName,
      serialNumber,
      errorCode,
      errorCause,
      solution,
      position,
      images: processedImages,
      resolveStatus,
      createdBy: req.user.id,
      resolvedAt: resolveStatus === 'Đã xử lý' ? new Date() : null,
      resolvedBy: resolveStatus === 'Đã xử lý' ? req.user.id : null
    });

    // Create new device error
    const deviceError = await DeviceError.create({
      deviceId,
      location,
      subDeviceName,
      serialNumber,
      errorCode,
      errorCause,
      solution,
      position,
      images: processedImages,
      resolveStatus,
      createdBy: req.user.id,
      resolvedAt: resolveStatus === 'Đã xử lý' ? new Date() : null,
      resolvedBy: resolveStatus === 'Đã xử lý' ? req.user.id : null
    }, { transaction });

    console.log('✅ Device error created successfully:', {
      id: deviceError.id,
      tempDeviceErrorId,
      images: deviceError.images
    });

    console.log('🔍 === CẬP NHẬT ĐƯỜNG DẪN IMAGES ===');
    // Nếu có images, cập nhật lại đường dẫn với ID thực
    if (processedImages && deviceError.id !== tempDeviceErrorId) {
      console.log('🔍 Updating image paths from temp ID to real ID');
      console.log('🔍 Device error ID:', deviceError.id);
      console.log('🔍 Temp device error ID:', tempDeviceErrorId);

      try {
        const imageUrls = JSON.parse(processedImages);
        console.log('🔍 Original image URLs:', imageUrls);

        const updatedImageUrls = imageUrls.map(url =>
          url.replace(`/uploads/${config.directories.deviceErrors}/${tempDeviceErrorId}/`, `/uploads/${config.directories.deviceErrors}/${deviceError.id}/`)
        );

        console.log('🔍 Updated image URLs:', updatedImageUrls);

        console.log('🔍 === DI CHUYỂN FILES ===');
        // Di chuyển files sang thư mục đúng
        const oldDir = path.join(config.rootDir, config.directories.deviceErrors, tempDeviceErrorId.toString());
        const newDir = path.join(config.rootDir, config.directories.deviceErrors, deviceError.id.toString());

        console.log('🔍 Old directory:', oldDir);
        console.log('🔍 New directory:', newDir);
        console.log('🔍 Old directory exists:', fs.existsSync(oldDir));
        console.log('🔍 New directory exists:', fs.existsSync(newDir));

        if (fs.existsSync(oldDir)) {
          if (!fs.existsSync(newDir)) {
            fs.mkdirSync(newDir, { recursive: true });
            console.log('✅ Created new directory');
          }

          const files = fs.readdirSync(oldDir);
          console.log('🔍 Files to move:', files);

          for (const file of files) {
            const oldPath = path.join(oldDir, file);
            const newPath = path.join(newDir, file);
            console.log(`🔍 Moving file: ${oldPath} -> ${newPath}`);
            fs.renameSync(oldPath, newPath);
            console.log(`✅ Moved file: ${file}`);
          }

          // Xóa thư mục cũ
          fs.rmdirSync(oldDir);
          console.log('✅ Removed old directory');
        } else {
          console.log('⚠️ Old directory does not exist, skipping file move');
        }

        console.log('🔍 === CẬP NHẬT DATABASE ===');
        await deviceError.update({ images: JSON.stringify(updatedImageUrls) }, { transaction });
        console.log('✅ Updated device error with new image paths');
      } catch (updateError) {
        console.error('❌ Lỗi khi cập nhật đường dẫn images:', updateError);
      }
    } else {
      console.log('🔍 No image path update needed (same ID or no images)');
    }

    console.log('🔍 === HOÀN THÀNH TẠO DEVICE ERROR ===');
    console.log('✅ Final device error:', {
      id: deviceError.id,
      images: deviceError.images
    });

    // Track the creation in history
    await trackDeviceErrorChange(
      deviceError.id,
      req.user.id,
      'create',
      'all',
      null,
      JSON.stringify({
        deviceId,
        location,
        subDeviceName,
        serialNumber,
        errorCode,
        errorCause,
        solution,
        position,
        images: processedImages,
        resolveStatus
      }),
      'Tạo sự cố thiết bị mới',
      false,
      transaction
    );

    await transaction.commit();
    console.log('✅ Transaction committed successfully');
    console.log('📤 Sending response to frontend:', deviceError);
    res.status(201).json(deviceError);
  } catch (error) {
    console.error('❌ === LỖI KHI TẠO DEVICE ERROR ===');
    console.error('❌ Error details:', error);
    await transaction.rollback();
    console.log('🔄 Transaction rolled back');
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Upload hình ảnh cho lỗi thiết bị
export const uploadDeviceErrorImages = async (req, res) => {
  try {
    const { errorId } = req.params;
    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }

    // Kiểm tra lỗi thiết bị có tồn tại không
    const deviceError = await DeviceError.findByPk(errorId);
    if (!deviceError) {
      return res.status(404).json({ message: 'Không tìm thấy lỗi thiết bị' });
    }

    // Tạo thư mục lưu trữ nếu chưa có
    const uploadsRoot = config.rootDir;
    if (!fs.existsSync(uploadsRoot)) {
      fs.mkdirSync(uploadsRoot, { recursive: true });
    }

    const uploadDir = path.join(uploadsRoot, config.directories.deviceErrors, errorId.toString());
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls = [];
    const allowedTypes = config.deviceErrors.allowedTypes.images;
    const maxSize = config.deviceErrors.limits.fileSize;

    for (const file of uploadedFiles) {
      // Kiểm tra loại file
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          message: `File ${file.originalname} không được hỗ trợ. Chỉ chấp nhận: JPG, PNG, GIF, WEBP`
        });
      }

      // Kiểm tra kích thước file
      if (file.size > maxSize) {
        return res.status(400).json({
          message: `File ${file.originalname} quá lớn. Kích thước tối đa: ${(maxSize / 1024 / 1024).toFixed(0)}MB`
        });
      }

      // Sử dụng config để tạo tên file
      const fileName = config.filename.format(file.originalname);
      const filePath = path.join(uploadDir, fileName);

      // Lưu file
      fs.writeFileSync(filePath, file.buffer);

      // Tạo URL để truy cập
      const fileUrl = `/uploads/${config.directories.deviceErrors}/${errorId}/${fileName}`;
      uploadedUrls.push(fileUrl);
    }

    // Cập nhật danh sách hình ảnh trong database
    let currentImages = [];
    if (deviceError.images) {
      try {
        currentImages = JSON.parse(deviceError.images);
      } catch (e) {
        currentImages = [];
      }
    }

    const updatedImages = [...currentImages, ...uploadedUrls];
    await deviceError.update({ images: JSON.stringify(updatedImages) });

    // Track thay đổi trong history
    await trackDeviceErrorChange(
      errorId,
      req.user.id,
      'update',
      'images',
      deviceError.images,
      JSON.stringify(updatedImages),
      'Thêm hình ảnh lỗi',
      false
    );

    res.json({
      message: 'Upload hình ảnh thành công',
      uploadedUrls,
      totalImages: updatedImages.length
    });

  } catch (error) {
    console.error('Lỗi khi upload hình ảnh:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa hình ảnh lỗi thiết bị
export const deleteDeviceErrorImage = async (req, res) => {
  try {
    const { errorId, filename } = req.params;

    console.log('🗑️ === XÓA DEVICE ERROR IMAGE ===');
    console.log('🗑️ ErrorId:', errorId);
    console.log('🗑️ Filename:', filename);

    // Kiểm tra lỗi thiết bị có tồn tại không
    const deviceError = await DeviceError.findByPk(errorId);
    if (!deviceError) {
      console.log('❌ Device error not found:', errorId);
      return res.status(404).json({ message: 'Không tìm thấy lỗi thiết bị' });
    }

    // Lấy danh sách hình ảnh hiện tại
    let currentImages = [];
    if (deviceError.images) {
      try {
        currentImages = JSON.parse(deviceError.images);
        console.log('🗑️ Current images from DB:', currentImages);
      } catch (e) {
        console.log('❌ Error parsing images:', e);
        currentImages = [];
      }
    }

    // Tìm hình ảnh có chứa filename
    const imageToDelete = currentImages.find(img => img.includes(filename));
    if (!imageToDelete) {
      console.log('❌ Image not found in DB with filename:', filename);
      return res.status(404).json({ message: 'Không tìm thấy hình ảnh' });
    }

    console.log('🗑️ Found image to delete:', imageToDelete);

    // Xóa file từ server
    const relativePath = imageToDelete.replace('/uploads/', '');
    const filePath = path.join(config.rootDir, relativePath);
    console.log('🗑️ File path:', filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ File deleted from server');
    } else {
      console.log('⚠️ File not found on server, but continuing with DB update');
    }

    // Cập nhật danh sách hình ảnh
    const imageIndex = currentImages.indexOf(imageToDelete);
    currentImages.splice(imageIndex, 1);
    await deviceError.update({ images: JSON.stringify(currentImages) });
    console.log('✅ Database updated');

    // Track thay đổi trong history
    await trackDeviceErrorChange(
      errorId,
      req.user.id,
      'update',
      'images',
      deviceError.images,
      JSON.stringify(currentImages),
      'Xóa hình ảnh lỗi',
      false
    );

    res.json({
      message: 'Xóa hình ảnh thành công',
      remainingImages: currentImages.length
    });

  } catch (error) {
    console.error('❌ Lỗi khi xóa hình ảnh:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Upload hình ảnh tạm thời cho modal tạo mới
export const uploadTempDeviceErrorImages = async (req, res) => {
  try {
    console.log('📤 uploadTempDeviceErrorImages called');
    console.log('📋 Request files:', req.files);
    console.log('📋 Request body:', req.body);

    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      console.log('❌ No files uploaded');
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }

    console.log(`📁 Processing ${uploadedFiles.length} files`);

    // Sử dụng config để tạo thư mục lưu trữ tạm thời
    const uploadsRoot = config.rootDir;
    console.log('🔍 Uploads root:', uploadsRoot);

    if (!fs.existsSync(uploadsRoot)) {
      fs.mkdirSync(uploadsRoot, { recursive: true });
      console.log('✅ Created uploads root directory');
    } else {
      console.log('✅ Uploads root directory already exists');
    }

    const uploadDir = path.join(uploadsRoot, config.directories.deviceErrors, config.deviceErrors.paths.temp);
    console.log('🔍 Upload directory:', uploadDir);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('✅ Created upload directory');
    } else {
      console.log('✅ Upload directory already exists');
    }

    const uploadedUrls = [];
    const allowedTypes = config.deviceErrors.allowedTypes.images;
    const maxSize = config.deviceErrors.limits.fileSize;
    const errors = [];

    for (const file of uploadedFiles) {
      try {
        console.log(`\n📄 Processing file: ${file.originalname}`);
        console.log(`📋 File details:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          buffer: file.buffer ? `Buffer(${file.buffer.length} bytes)` : 'No buffer'
        });

        // Kiểm tra loại file
        if (!allowedTypes.includes(file.mimetype)) {
          console.log(`❌ File type not allowed: ${file.mimetype}`);
          errors.push(`File ${file.originalname} không được hỗ trợ. Chỉ chấp nhận: JPG, PNG, GIF, WEBP`);
          continue;
        }
        console.log(`✅ File type allowed: ${file.mimetype}`);

        // Kiểm tra kích thước file
        if (file.size > maxSize) {
          console.log(`❌ File too large: ${file.size} > ${maxSize}`);
          errors.push(`File ${file.originalname} quá lớn. Kích thước tối đa: ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
          continue;
        }
        console.log(`✅ File size OK: ${file.size} bytes`);

        // Sử dụng config để tạo tên file
        const fileName = config.filename.format(file.originalname);
        const filePath = path.join(uploadDir, fileName);

        console.log(`🔍 File path: ${filePath}`);

        // Kiểm tra buffer
        if (!file.buffer) {
          console.log(`❌ No buffer for file: ${file.originalname}`);
          errors.push(`File ${file.originalname} không có dữ liệu`);
          continue;
        }

        // Lưu file
        console.log(`💾 Writing file to disk...`);
        fs.writeFileSync(filePath, file.buffer);

        // Kiểm tra file đã được tạo
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          console.log(`✅ File saved successfully: ${filePath} (${stats.size} bytes)`);
        } else {
          console.log(`❌ File not found after saving: ${filePath}`);
          errors.push(`Không thể lưu file ${file.originalname}`);
          continue;
        }

        // Tạo URL để truy cập
        const fileUrl = `/uploads/${config.directories.deviceErrors}/${config.deviceErrors.paths.temp}/${fileName}`;
        uploadedUrls.push(fileUrl);
        console.log(`🔗 File URL: ${fileUrl}`);

      } catch (fileError) {
        console.error(`❌ Error processing file ${file.originalname}:`, fileError);
        errors.push(`Không thể xử lý file ${file.originalname}`);
      }
    }

    // Nếu có lỗi với một số file, trả về thông báo cảnh báo
    if (errors.length > 0 && uploadedUrls.length === 0) {
      return res.status(400).json({
        message: 'Không thể upload bất kỳ file nào',
        errors: errors
      });
    }

    console.log(`\n📊 Upload summary:`);
    console.log(`✅ Successfully uploaded: ${uploadedUrls.length} files`);
    console.log(`❌ Errors: ${errors.length} files`);
    console.log(`📁 Uploaded URLs:`, uploadedUrls);

    const response = {
      message: uploadedUrls.length > 0 ? 'Upload hình ảnh thành công' : 'Không có file nào được upload',
      uploadedUrls: uploadedUrls
    };

    if (errors.length > 0) {
      response.warnings = errors;
      console.log(`⚠️ Warnings:`, errors);
    }

    console.log(`📤 Sending response:`, response);
    res.json(response);

  } catch (error) {
    console.error('Lỗi khi upload hình ảnh tạm thời:', error);
    res.status(500).json({ message: 'Lỗi server khi upload hình ảnh' });
  }
};

// Xóa hình ảnh tạm thời
export const deleteTempDeviceErrorImage = async (req, res) => {
  try {
    console.log('🗑️ === BACKEND: XÓA TEMP IMAGE ===');
    console.log('🗑️ Request params:', req.params);
    console.log('🗑️ Request headers:', req.headers);

    const { filename } = req.params;

    if (!filename) {
      console.log('❌ No filename provided');
      return res.status(400).json({ message: 'Tên file không hợp lệ' });
    }

    console.log('🗑️ Filename to delete:', filename);

    // Xóa file từ server - Sử dụng config
    const filePath = path.join(config.rootDir, config.directories.deviceErrors, config.deviceErrors.paths.temp, filename);
    console.log('🗑️ File path to delete:', filePath);
    console.log('🗑️ File exists:', fs.existsSync(filePath));

    // Kiểm tra thư mục temp có gì
    const tempDir = path.join(config.rootDir, config.directories.deviceErrors, config.deviceErrors.paths.temp);
    console.log('🗑️ Temp directory:', tempDir);
    console.log('🗑️ Temp directory exists:', fs.existsSync(tempDir));

    if (fs.existsSync(tempDir)) {
      try {
        const files = fs.readdirSync(tempDir);
        console.log('🗑️ Files in temp directory:', files);
      } catch (readError) {
        console.log('🗑️ Error reading temp directory:', readError);
      }
    }

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Đã xóa file tạm thời: ${filePath}`);
      } catch (unlinkError) {
        console.error('❌ Lỗi khi xóa file:', unlinkError);
        return res.status(500).json({ message: 'Không thể xóa file từ server' });
      }
    } else {
      console.log(`⚠️ File không tồn tại: ${filePath}`);
      // Vẫn trả về success vì mục đích là xóa file
    }

    console.log('✅ Sending success response');
    res.json({
      message: 'Xóa hình ảnh thành công'
    });

  } catch (error) {
    console.error('❌ Lỗi khi xóa hình ảnh tạm thời:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa hình ảnh' });
  }
};

// Convert ảnh thành base64
export const getDeviceErrorImageAsBase64 = async (req, res) => {
  try {
    const { errorId, filename } = req.params;

    // Kiểm tra device error có tồn tại không
    const deviceError = await DeviceError.findByPk(errorId);
    if (!deviceError) {
      return res.status(404).json({ message: 'Không tìm thấy lỗi thiết bị' });
    }

    // Kiểm tra file có tồn tại không
    const filePath = path.join(config.rootDir, config.directories.deviceErrors, errorId, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Không tìm thấy file' });
    }

    // Đọc file và convert thành base64
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');

    // Xác định MIME type
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    // Trả về base64 data URL
    const dataUrl = `data:${mimeType};base64,${base64}`;

    res.json({
      success: true,
      dataUrl: dataUrl,
      filename: filename
    });

  } catch (error) {
    console.error('Lỗi khi convert ảnh thành base64:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Serve device error image qua API (có authentication)
export const serveDeviceErrorImage = async (req, res) => {
  try {
    const { errorId, filename } = req.params;

    // Kiểm tra device error có tồn tại không
    const deviceError = await DeviceError.findByPk(errorId);
    if (!deviceError) {
      return res.status(404).json({ message: 'Không tìm thấy lỗi thiết bị' });
    }

    // Kiểm tra file có tồn tại không
    const filePath = path.join(config.rootDir, config.directories.deviceErrors, errorId, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Không tìm thấy file' });
    }

    // Set content-type đúng cho ảnh
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // Serve file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Lỗi khi serve device error image:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Serve temp device error image qua API (có authentication)
export const serveTempDeviceErrorImage = async (req, res) => {
  try {
    const { filename } = req.params;

    console.log('📁 Serving temp device error image:', filename);

    // Kiểm tra file có tồn tại không
    const filePath = path.join(config.rootDir, config.directories.deviceErrors, config.deviceErrors.paths.temp, filename);
    console.log('📁 File path:', filePath);

    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found:', filePath);
      return res.status(404).json({ message: 'Không tìm thấy file' });
    }

    console.log('✅ File found, serving...');

    // Set content-type đúng cho ảnh
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // Serve file
    res.sendFile(filePath);

  } catch (error) {
    console.error('Lỗi khi serve temp device error image:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Serve temp device error images cho edit mode (có errorId)
export const serveTempDeviceErrorImageForEdit = async (req, res) => {
  try {
    const { errorId, filename } = req.params;

    console.log('📁 Serving temp device error image for edit:', { errorId, filename });

    // Kiểm tra file có tồn tại không
    const filePath = path.join(config.rootDir, config.directories.deviceErrors, config.deviceErrors.paths.temp, errorId.toString(), filename);
    console.log('📁 File path:', filePath);

    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found:', filePath);
      return res.status(404).json({ message: 'Không tìm thấy file' });
    }

    console.log('✅ File found, serving...');

    // Set content-type đúng cho ảnh
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // Serve file
    res.sendFile(filePath);

  } catch (error) {
    console.error('Lỗi khi serve temp device error image for edit:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa hình ảnh tạm thời cho edit mode
export const deleteTempDeviceErrorImageForEdit = async (req, res) => {
  try {
    const { errorId, filename } = req.params;

    console.log('🗑️ === XÓA TEMP IMAGE EDIT MODAL ===');
    console.log('🗑️ ErrorId:', errorId);
    console.log('🗑️ Filename:', filename);

    // Kiểm tra lỗi thiết bị có tồn tại không
    const deviceError = await DeviceError.findByPk(errorId);
    if (!deviceError) {
      console.log('❌ Device error not found:', errorId);
      return res.status(404).json({ message: 'Không tìm thấy lỗi thiết bị' });
    }

    // Tạo đường dẫn file
    const filePath = path.join(config.rootDir, config.directories.deviceErrors, config.deviceErrors.paths.temp, errorId.toString(), filename);
    console.log('🗑️ File path:', filePath);

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found:', filePath);
      return res.status(404).json({ message: 'Không tìm thấy file' });
    }

    console.log('✅ File exists, deleting...');

    // Xóa file
    fs.unlinkSync(filePath);
    console.log('✅ File deleted successfully');

    res.json({ message: 'Xóa hình ảnh thành công' });

  } catch (error) {
    console.error('❌ Lỗi khi xóa temp device error image for edit:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa file' });
  }
};

// Upload hình ảnh tạm thời cho edit mode
export const uploadTempDeviceErrorImagesForEdit = async (req, res) => {
  try {
    const { errorId } = req.params;
    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }

    // Kiểm tra lỗi thiết bị có tồn tại không
    const deviceError = await DeviceError.findByPk(errorId);
    if (!deviceError) {
      return res.status(404).json({ message: 'Không tìm thấy lỗi thiết bị' });
    }

    // Tạo thư mục lưu trữ tạm thời cho edit
    const uploadsRoot = config.rootDir;
    if (!fs.existsSync(uploadsRoot)) {
      fs.mkdirSync(uploadsRoot, { recursive: true });
    }

    const uploadDir = path.join(uploadsRoot, config.directories.deviceErrors, config.deviceErrors.paths.temp, errorId.toString());
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedFileList = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const errors = [];

    for (const file of uploadedFiles) {
      try {
        // Kiểm tra loại file
        if (!allowedTypes.includes(file.mimetype)) {
          errors.push(`File ${file.originalname} không được hỗ trợ. Chỉ chấp nhận: JPG, PNG, GIF, WEBP`);
          continue;
        }

        // Kiểm tra kích thước file
        if (file.size > maxSize) {
          errors.push(`File ${file.originalname} quá lớn. Kích thước tối đa: 5MB`);
          continue;
        }

        // Tạo tên file unique
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = path.extname(file.originalname);
        const fileName = `${timestamp}_${randomString}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Lưu file
        fs.writeFileSync(filePath, file.buffer);

        // Tạo thông tin file đã upload
        uploadedFileList.push({
          filename: fileName,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        });
      } catch (fileError) {
        console.error(`Lỗi khi xử lý file ${file.originalname}:`, fileError);
        errors.push(`Không thể xử lý file ${file.originalname}`);
      }
    }

    // Nếu có lỗi với một số file, trả về thông báo cảnh báo
    if (errors.length > 0 && uploadedFileList.length === 0) {
      return res.status(400).json({
        message: 'Không thể upload bất kỳ file nào',
        errors: errors
      });
    }

    const response = {
      message: uploadedFileList.length > 0 ? 'Upload hình ảnh thành công' : 'Không có file nào được upload',
      uploadedFiles: uploadedFileList
    };

    if (errors.length > 0) {
      response.warnings = errors;
    }

    res.json(response);

  } catch (error) {
    console.error('Lỗi khi upload hình ảnh tạm thời cho edit:', error);
    res.status(500).json({ message: 'Lỗi server khi upload hình ảnh' });
  }
};

// Di chuyển ảnh từ temp sang thư mục chính khi save edit
export const moveTempImagesToFinal = async (req, res) => {
  try {
    const { errorId } = req.params;
    const { tempImageNames } = req.body; // Danh sách tên file trong temp

    if (!tempImageNames || !Array.isArray(tempImageNames) || tempImageNames.length === 0) {
      return res.status(400).json({ message: 'Không có file nào cần di chuyển' });
    }

    // Kiểm tra lỗi thiết bị có tồn tại không
    const deviceError = await DeviceError.findByPk(errorId);
    if (!deviceError) {
      return res.status(404).json({ message: 'Không tìm thấy lỗi thiết bị' });
    }

    const uploadsRoot = config.rootDir;
    const tempDir = path.join(uploadsRoot, config.directories.deviceErrors, config.deviceErrors.paths.temp, errorId.toString());
    const finalDir = path.join(uploadsRoot, config.directories.deviceErrors, errorId.toString());

    // Tạo thư mục đích nếu chưa có
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    const movedFiles = [];
    const errors = [];

    for (const fileName of tempImageNames) {
      try {
        const tempFilePath = path.join(tempDir, fileName);
        const finalFilePath = path.join(finalDir, fileName);

        // Kiểm tra file temp có tồn tại không
        if (!fs.existsSync(tempFilePath)) {
          errors.push(`File ${fileName} không tồn tại trong temp`);
          continue;
        }

        // Di chuyển file
        fs.copyFileSync(tempFilePath, finalFilePath);
        fs.unlinkSync(tempFilePath); // Xóa file temp

        // Tạo URL để truy cập
        const fileUrl = `/uploads/${config.directories.deviceErrors}/${errorId}/${fileName}`;
        movedFiles.push(fileUrl);

        console.log(`✅ Moved ${fileName} from temp to final`);
      } catch (fileError) {
        console.error(`❌ Error moving file ${fileName}:`, fileError);
        errors.push(`Không thể di chuyển file ${fileName}`);
      }
    }

    // Cập nhật danh sách hình ảnh trong database
    let currentImages = [];
    if (deviceError.images) {
      try {
        currentImages = JSON.parse(deviceError.images);
      } catch (e) {
        currentImages = [];
      }
    }

    const updatedImages = [...currentImages, ...movedFiles];
    await deviceError.update({ images: JSON.stringify(updatedImages) });

    // Track thay đổi trong history
    await trackDeviceErrorChange(
      errorId,
      req.user.id,
      'update',
      'images',
      deviceError.images,
      JSON.stringify(updatedImages),
      'Thêm hình ảnh lỗi từ edit',
      false
    );

    // Xóa thư mục temp nếu rỗng
    try {
      const tempFiles = fs.readdirSync(tempDir);
      if (tempFiles.length === 0) {
        fs.rmdirSync(tempDir);
        console.log(`✅ Removed empty temp directory for error ${errorId}`);
      }
    } catch (dirError) {
      console.log('Temp directory not empty or already removed');
    }

    const response = {
      message: movedFiles.length > 0 ? 'Di chuyển hình ảnh thành công' : 'Không có file nào được di chuyển',
      movedFiles: movedFiles,
      totalImages: updatedImages.length
    };

    if (errors.length > 0) {
      response.warnings = errors;
    }

    res.json(response);

  } catch (error) {
    console.error('Lỗi khi di chuyển hình ảnh từ temp:', error);
    res.status(500).json({ message: 'Lỗi server khi di chuyển hình ảnh' });
  }
};
