import db from '../models/index.js';
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import { getCurrentDateTimeUTC7, toUTC7, formatDateUTC7 } from '../utils/dateUtils.js';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import removeAccents from 'remove-accents';
import config from '../config/upload.js';
import { broadcastTaskUpdate } from '../index.js';
const { Task, WorkShift, User, WorkSession, TaskHistory, TaskLock } = db;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
];

// Add root path constant
const ROOT_UPLOAD_DIR = config.rootDir;

// Add status labels
const STATUS_LABELS = {
  waiting: 'Chờ xử lý',
  pending: 'Chờ duyệt',
  in_progress: 'Đang làm',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

// Thêm định nghĩa các trạng thái chuyển đổi hợp lệ
const STATUS_TRANSITIONS = {
  waiting: ['pending', 'in_progress', 'cancelled'],
  pending: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'pending', 'cancelled'],
  completed: ['cancelled'],
  cancelled: []
};

// Add statusTransitionLocks
const statusTransitionLocks = new Map();

// Utility function to ensure consistent path handling
const normalizeFilePath = (filePath) => {
  return filePath.split(path.sep).join('/');
};

const validateFile = (file) => {
  if (!file) return { valid: false, error: 'File không tồn tại' };

  if (file.size > config.limits.fileSize) {
    return { valid: false, error: config.error.messages.FILE_TOO_LARGE };
  }

  if (!config.security.isAllowedMimeType(file.mimetype, file.originalname)) {
    return { valid: false, error: config.error.messages.INVALID_FILE_TYPE };
  }

  return { valid: true };
};

const getUploadPath = (taskId, filename) => {
  const uploadDir = path.join(config.rootDir, config.directories.task, taskId.toString());
  return path.join(uploadDir, filename);
};

const ensureUploadDir = (taskId) => {
  // Tạo đường dẫn tuyệt đối cho thư mục upload
  const uploadDir = path.join(config.rootDir, config.directories.task, taskId.toString());

  // Đảm bảo thư mục tồn tại
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📂 Created upload directory:', uploadDir);
  }

  return uploadDir;
};

const cleanupFiles = async (files) => {
  for (const file of files) {
    try {
      if (fs.existsSync(file.path)) {
        await fs.promises.unlink(file.path);
        console.log('✅ Cleaned up file:', file.path);
      }
    } catch (err) {
      console.error('❌ Error cleaning up file:', {
        path: file.path,
        error: err.message
      });
    }
  }
};

const getAbsoluteFilePath = (relativePath) => {
  // Ensure we're working with forward slashes
  const normalizedPath = relativePath.replace(/\\/g, '/');
  // Get absolute path from uploads directory
  return path.join(config.rootDir, normalizedPath);
};

const isPathSafe = (filePath) => {
  return config.security.isPathSafe(filePath);
};

// Thêm hàm xử lý tên file
const sanitizeFileName = (filename) => {
  // Tách phần tên và phần mở rộng
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);

  // Xử lý phần tên file:
  // 1. Bỏ dấu tiếng Việt
  // 2. Thay khoảng trắng bằng dấu gạch dưới
  // 3. Chỉ giữ lại các ký tự an toàn
  const sanitizedName = removeAccents(name)
    .replace(/\s+/g, '_') // Thay khoảng trắng bằng dấu gạch dưới
    .replace(/[^a-zA-Z0-9_-]/g, '') // Chỉ giữ chữ, số và dấu gạch
    .toLowerCase(); // Chuyển về chữ thường

  return sanitizedName + ext;
};

const processFileUpload = async (file, taskId, transaction) => {
  try {
    console.log('📤 Processing file upload:', {
      originalName: file.originalname,
      tempPath: file.path
    });

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(`File ${file.originalname}: ${validation.error}`);
    }

    // Ensure upload directory exists
    const uploadDir = ensureUploadDir(taskId);
    console.log('📂 Upload directory ready:', uploadDir);

    // Tạo tên file mới với timestamp, UUID và tên file đã được xử lý
    const newFilename = config.filename.format(file.originalname);

    // Generate absolute path for file
    const absolutePath = path.join(uploadDir, newFilename);

    console.log('📋 File paths:', {
      uploadDir,
      absolutePath,
      originalName: file.originalname,
      sanitizedName: newFilename
    });

    // Copy file from temp to final location
    await fs.promises.copyFile(file.path, absolutePath);
    console.log('✅ File copied successfully');

    // Delete temp file
    await fs.promises.unlink(file.path);
    console.log('🗑️ Temp file cleaned up');

    return {
      filename: newFilename,
      originalName: file.originalname, // Lưu tên gốc có dấu
      path: path.join(config.directories.task, taskId.toString(), newFilename), // Lưu đường dẫn tương đối
      mimetype: file.mimetype,
      size: file.size
    };
  } catch (error) {
    console.error('❌ File processing error:', {
      file: file.originalname,
      error: error.message
    });
    throw error;
  }
};

// Thêm hàm mới để xử lý tên file tiếng Việt
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

const deleteFile = async (filePath) => {
  try {
    // Normalize path to use forward slashes
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Get absolute path from project root
    const fullPath = path.join(config.rootDir, normalizedPath);

    console.log('🔍 Deleting file:', {
      originalPath: filePath,
      normalizedPath,
      fullPath
    });

    // Check if path is safe (within uploads directory)
    if (!isPathSafe(fullPath)) {
      throw new Error('Invalid file path - file must be within uploads directory');
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.warn('⚠️ File not found:', fullPath);
      return false;
    }

    // Check if it's a file (not a directory)
    const stats = await fs.promises.stat(fullPath);
    if (!stats.isFile()) {
      throw new Error('Path is not a file');
    }

    // Delete the file
    await fs.promises.unlink(fullPath);
    console.log('✅ File deleted successfully:', fullPath);

    // Try to remove the parent directory if it's empty
    const parentDir = path.dirname(fullPath);
    try {
      const files = await fs.promises.readdir(parentDir);
      if (files.length === 0) {
        await fs.promises.rmdir(parentDir);
        console.log('✅ Removed empty directory:', parentDir);
      }
    } catch (err) {
      console.warn('⚠️ Could not remove directory:', err.message);
    }

    return true;

  } catch (error) {
    console.error('❌ Error deleting file:', {
      path: filePath,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

const deleteDirectory = async (dirPath) => {
  try {
    const fullPath = path.join(config.rootDir, dirPath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.rm(fullPath, { recursive: true, force: true });
      console.log('✅ Directory deleted successfully:', fullPath);
      return true;
    }
    console.log('⚠️ Directory not found:', fullPath);
    return false;
  } catch (error) {
    console.error('❌ Error deleting directory:', {
      path: dirPath,
      error: error.message
    });
    throw error;
  }
};

// Add utility function to check task status
const isTaskInProgress = (checkOutTime) => {
  if (!checkOutTime) return true;
  const now = new Date();
  const checkOut = new Date(checkOutTime);
  return checkOut > now;
};

// Add utility function to track task changes
export const trackTaskChange = async (taskId, changedBy, changeType, field, oldValue, newValue, changeReason = null, isAutomatic = false, transaction = null, changeGroupId = null) => {
  try {
    // Đảm bảo isAutomatic là boolean
    const finalIsAutomatic = Boolean(isAutomatic);

    // Luôn lưu lịch sử khi có thay đổi trạng thái hoặc nội dung
    if (changeType === 'status' || changeType === 'content' || oldValue !== newValue) {
      // Format time values for logging
      if (field === 'checkInTime' || field === 'checkOutTime') {
        oldValue = oldValue ? formatDateUTC7(oldValue) : null;
        newValue = newValue ? formatDateUTC7(newValue) : null;
      }

      // Đảm bảo changeReason là string
      let finalChangeReason = changeReason;
      if (typeof changeReason === 'object' || Array.isArray(changeReason)) {
        try {
          // Thử chuyển đổi thành plain object trước khi stringify
          if (changeReason.toJSON) {
            finalChangeReason = JSON.stringify(changeReason.toJSON());
          } else {
            // Loại bỏ các thuộc tính có thể gây ra circular references
            const safeObj = {};
            for (const key in changeReason) {
              if (key !== 'sequelize' && key !== 'dialect' && key !== '_model' && key !== '_attributes') {
                safeObj[key] = changeReason[key];
              }
            }
            finalChangeReason = JSON.stringify(safeObj);
          }
        } catch (error) {
          console.error('Error stringifying changeReason:', error);
          finalChangeReason = 'Cập nhật thông tin';
        }
      } else if (!changeReason) {
        finalChangeReason = 'Cập nhật thông tin';
      }

      // Chuyển đổi giá trị thành string để tránh circular references
      let safeOldValue = null;
      let safeNewValue = null;

      try {
        if (oldValue) {
          if (typeof oldValue === 'object' && oldValue.toJSON) {
            safeOldValue = JSON.stringify(oldValue.toJSON());
          } else {
            safeOldValue = String(oldValue);
          }
        }

        if (newValue) {
          if (typeof newValue === 'object' && newValue.toJSON) {
            safeNewValue = JSON.stringify(newValue.toJSON());
          } else {
            safeNewValue = String(newValue);
          }
        }
      } catch (error) {
        console.error('Error converting values to string:', error);
        safeOldValue = oldValue ? String(oldValue) : null;
        safeNewValue = newValue ? String(newValue) : null;
      }

      console.log('Creating TaskHistory with:', {
        taskId,
        changedBy,
        changeType,
        field,
        oldValue: safeOldValue,
        newValue: safeNewValue,
        changeReason: finalChangeReason,
        isAutomatic: finalIsAutomatic,
        changeGroupId
      });

      await TaskHistory.create({
        taskId,
        changedBy,
        changeType,
        field,
        oldValue: safeOldValue,
        newValue: safeNewValue,
        changeReason: finalChangeReason,
        isAutomatic: finalIsAutomatic,
        changeGroupId: changeGroupId || uuid()
      }, { transaction });

      console.log('✅ Task history tracked:', {
        taskId,
        changeType,
        field,
        oldValue: safeOldValue,
        newValue: safeNewValue,
        changeReason: finalChangeReason,
        isAutomatic: finalIsAutomatic,
        changeGroupId
      });
    }
  } catch (error) {
    console.error('❌ Error tracking task history:', error);
    throw error;
  }
};

// Thêm hàm để chuyển đổi Sequelize object thành plain object
const toPlainObject = (obj) => {
  if (!obj) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => toPlainObject(item));
  }
  if (obj.toJSON) {
    return obj.toJSON();
  }
  if (typeof obj === 'object') {
    const plainObj = {};
    for (const key in obj) {
      plainObj[key] = toPlainObject(obj[key]);
    }
    return plainObj;
  }
  return obj;
};

// Thêm hàm isAdmin để kiểm tra quyền admin
const isAdmin = (user) => {
  return user && user.role === 'admin';
};

// Helper function để lấy staff data cho WebSocket
const getTaskStaffData = async (taskId, taskFullName = null) => {
  try {
    // Lấy danh sách nhân sự từ TaskUsers
    const taskUsers = await db.TaskUsers.findAll({
      where: { taskId },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'fullname', 'username']
        },
        {
          model: db.Partners,
          as: 'partner',
          attributes: ['id', 'fullname', 'donVi', 'email', 'phone', 'cccd']
        }
      ]
    });

    // Format staff data
    let staff = taskUsers.map(tu => {
      if (tu.userId && tu.user) {
        return {
          type: 'user',
          id: tu.user.id,
          fullName: tu.user.fullname,
          username: tu.user.username,
          role: tu.role
        };
      } else if (tu.partnerId && tu.partner) {
        return {
          type: 'partner',
          id: tu.partner.id,
          fullName: tu.partner.fullname,
          donVi: tu.partner.donVi,
          email: tu.partner.email,
          phone: tu.partner.phone,
          cccd: tu.partner.cccd,
          role: tu.role
        };
      }
      return null;
    }).filter(Boolean);

    // Nếu không có staff từ TaskUsers, parse từ fullName của Task
    if ((!staff || staff.length === 0) && taskFullName) {
      staff = taskFullName.split(',').map(name => ({
        fullName: name.trim()
      })).filter(s => s.fullName);
    }

    return staff;
  } catch (error) {
    console.error('Error getting task staff data:', error);
    return [];
  }
};

// Add broadcast function
const sendTaskUpdate = (task, changeType, oldValue, newValue) => {
  broadcastTaskUpdate({
    type: 'task_update',
    task,
    changeType,
    oldValue,
    newValue
  });
};

/**
 * Tạo task mới
 */
export const createTask = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  const uploadedFiles = [];
  const changeGroupId = uuid();

  try {
    const { workShiftId, ...taskData } = req.body;
    console.log('🚀 Starting create task:', { workShiftId, taskData });

    // Validate required fields
    if (!taskData.taskDescription) {
      console.log('❌ Missing task description');
      throw new Error('Vui lòng nhập mô tả công việc');
    }

    // Validate required fields
    if (!taskData.taskTitle) {
      console.log('❌ Missing task title');
      throw new Error('Vui lòng nhập tiêu đề');
    }

    if (!taskData.location) {
      console.log('❌ Missing location');
      throw new Error('Vui lòng nhập vị trí công việc');
    }

    // Get workShift name if workShiftId is provided
    let workShiftName = taskData.location; // Use name from form data as default
    if (workShiftId) {
      const workShift = await WorkShift.findByPk(workShiftId);
      if (workShift) {
        workShiftName = workShift.location;
      }
    }

    // Validate files first
    if (req.files && req.files.length > 0) {
      console.log('📁 Validating files:', req.files.length);

      for (const file of req.files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          throw new Error(`File ${file.originalname}: ${validation.error}`);
        }
      }
    }

    // Prepare task data
    const newTaskData = {
      ...taskData,
      location: workShiftName,
      fullName: taskData.worker,
      createdBy: req.user.id,
      workShiftId: workShiftId || null,
      status: 'waiting', // Default status
      attachments: [],
      checkInTime: toUTC7(taskData.checkInTime),
      checkOutTime: taskData.checkOutTime ? toUTC7(taskData.checkOutTime) : null,
      createdAt: getCurrentDateTimeUTC7()
    };

    // If task is completed (has checkOutTime and it's in the past), set status to completed
    if (taskData.checkOutTime && !isTaskInProgress(taskData.checkOutTime)) {
      newTaskData.status = 'completed';
      newTaskData.completedBy = req.user.id;
      newTaskData.completedAt = taskData.checkOutTime;
    }

    // Create task first
    console.log('📝 Creating task...');
    const task = await Task.create(newTaskData, { transaction });
    console.log('✅ Task created:', { taskId: task.id });

    // Process attachments if any
    if (req.files && req.files.length > 0) {
      console.log('📁 Processing attachments:', req.files.length);

      const attachments = [];
      for (const file of req.files) {
        try {
          const fileData = await processFileUpload(file, task.id, transaction);
          attachments.push(fileData);
        } catch (error) {
          throw new Error(`Lỗi xử lý file ${file.originalname}: ${error.message}`);
        }
      }

      // Update task with new attachments
      await task.update({ attachments }, { transaction });
      console.log('✅ Task updated with attachments:', {
        taskId: task.id,
        attachmentCount: attachments.length
      });
    }

    // Store change reason at the beginning to ensure we have it for all changes
    const changeReason = req.body.changeReason || 'Tạo mới công việc';
    console.log('📝 Change reason:', changeReason);

    // Track task creation history
    await trackTaskChange(
      task.id,
      req.user.id,
      'create',
      null,
      null,
      JSON.stringify({
        taskTitle: task.taskTitle,
        taskDescription: task.taskDescription,
        worker: task.fullName,
        location: task.location,
        checkInTime: task.checkInTime,
        checkOutTime: task.checkOutTime,
        status: task.status
      }),
      changeReason,
      false,
      transaction,
      changeGroupId
    );

    // Lưu nhân sự vào TaskUsers nếu có
    let staffList = [];
    if (taskData.partners) {
      try {
        staffList = JSON.parse(taskData.partners);
      } catch (e) {
        staffList = [];
      }
    } else if (taskData.worker) {
      try {
        staffList = JSON.parse(taskData.worker);
      } catch (e) {
        staffList = [];
      }
    }

    // Lấy danh sách nhân sự hiện tại
    const currentStaff = await db.TaskUsers.findAll({
      where: { taskId: task.id },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'fullname', 'username']
        },
        {
          model: db.Partners,
          as: 'partner',
          attributes: ['id', 'fullname', 'donVi', 'email', 'phone', 'cccd']
        }
      ]
    });

    // Tạo map để dễ dàng so sánh
    const currentStaffMap = new Map(
      currentStaff.map(staff => [
        staff.userId ? `user_${staff.userId}` : `partner_${staff.partnerId}`,
        staff
      ])
    );

    const newStaffMap = new Map(
      staffList.map(staff => [
        staff.type === 'user' ? `user_${staff.id}` : `partner_${staff.id}`,
        staff
      ])
    );

    // Tìm nhân sự bị xóa
    const removedStaff = [];
    for (const [key, staff] of currentStaffMap) {
      if (!newStaffMap.has(key)) {
        removedStaff.push(staff);
      }
    }

    // Tìm nhân sự mới thêm
    const addedStaff = [];
    for (const [key, staff] of newStaffMap) {
      if (!currentStaffMap.has(key)) {
        addedStaff.push(staff);
      }
    }

    // Xóa nhân sự cũ
    if (removedStaff.length > 0) {
      await db.TaskUsers.destroy({
        where: {
          taskId: task.id,
          [Op.or]: removedStaff.map(staff => ({
            [staff.userId ? 'userId' : 'partnerId']: staff.userId || staff.partnerId
          }))
        },
        transaction
      });
    }

    // Thêm nhân sự mới
    if (addedStaff.length > 0) {
      const newStaffRecords = addedStaff.map(staff => ({
        taskId: task.id,
        userId: staff.type === 'user' ? staff.id : null,
        partnerId: staff.type === 'partner' ? staff.id : null,
        role: staff.role || null
      }));

      await db.TaskUsers.bulkCreate(newStaffRecords, { transaction });
    }

    console.log('✅ Committing transaction...');
    await transaction.commit();
    console.log('✅ Transaction committed');

    // Return created task with details
    const createdTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullname', 'username']
        }
      ]
    });

    // Lấy staff data sử dụng helper function
    const staff = await getTaskStaffData(task.id, createdTask.fullName);

    // Tạo object hoàn chỉnh với staff
    const completeTask = {
      ...createdTask.toJSON(),
      staff
    };

    // Log để debug
    console.log('✅ WebSocket data being sent:', {
      taskId: completeTask.id,
      hasStaff: !!completeTask.staff,
      staffCount: completeTask.staff?.length || 0,
      staffTypes: completeTask.staff?.map(s => s.type) || []
    });

    // Broadcast new task với đầy đủ thông tin
    sendTaskUpdate(completeTask, 'create', null, null);

    return res.json({
      message: 'Tạo công việc thành công',
      task: createdTask
    });

  } catch (error) {
    console.error('❌ Create task error:', error);
    await transaction.rollback();
    await cleanupFiles(uploadedFiles);
    return res.status(400).json({
      message: error.message || 'Có lỗi xảy ra khi tạo công việc'
    });
  }
};

/**
 * Lấy chi tiết task
 */
export const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullname']
        },
        {
          model: User,
          as: 'completer',
          attributes: ['id', 'fullname']
        },
        {
          model: WorkShift,
          as: 'WorkShift',
          attributes: ['id', 'name', 'code']
        },
        {
          model: WorkSession,
          as: 'WorkSession',
          attributes: ['id', 'date', 'status']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        message: 'Không tìm thấy công việc'
      });
    }

    // Lấy danh sách nhân sự từ TaskUsers
    const taskUsers = await db.TaskUsers.findAll({
      where: { taskId: id },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'fullname', 'username',]
        },
        {
          model: db.Partners,
          as: 'partner',
          attributes: ['id', 'fullname', 'donVi', 'email', 'phone', 'cccd']
        }
      ]
    });
    // Format kết quả
    let staff = taskUsers.map(tu => {
      if (tu.userId && tu.user) {
        return {
          type: 'user',
          id: tu.user.id,
          fullName: tu.user.fullname,
          username: tu.user.username,
          role: tu.role
        };
      } else if (tu.partnerId && tu.partner) {
        return {
          type: 'partner',
          id: tu.partner.id,
          fullName: tu.partner.fullname,
          donVi: tu.partner.donVi,
          email: tu.partner.email,
          phone: tu.partner.phone,
          cccd: tu.partner.cccd,
          role: tu.role
        };
      } else {
        return null;
      }
    }).filter(Boolean);

    // Nếu không có staff từ TaskUsers, parse từ fullName của Task
    if ((!staff || staff.length === 0) && task.fullName) {
      staff = task.fullName.split(',').map(name => ({
        fullName: name.trim()
      })).filter(s => s.fullName);
    }

    // Trả về task kèm staff
    const result = toPlainObject(task);
    result.staff = staff;
    res.json(result);
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({
      message: 'Có lỗi xảy ra khi lấy thông tin công việc',
      error: err.message
    });
  }
};

/**
 * Lấy danh sách task theo ca làm việc
 */
export const getTasksByShift = async (req, res) => {
  const { shiftId } = req.params;
  const {
    page = 1,
    limit = 10,
    status,
    search,
    fromDate,
    toDate,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Kiểm tra ca làm việc tồn tại
    const workShift = await WorkShift.findByPk(shiftId);
    if (!workShift) {
      return res.status(404).json({
        message: 'Không tìm thấy ca làm việc'
      });
    }

    // Xây dựng điều kiện tìm kiếm
    const where = { workShiftId: shiftId };

    // Filter theo trạng thái
    if (status) where.status = status;

    // Filter theo khoảng thời gian
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
      if (toDate) where.createdAt[Op.lte] = new Date(toDate);
    }

    // Tìm kiếm theo từ khóa
    if (search) {
      where[Op.or] = [
        { taskDescription: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { fullName: { [Op.like]: `%${search}%` } }
      ];
    }

    // Validate sortBy field
    const validSortFields = ['createdAt', 'status'];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        message: 'Trường sắp xếp không hợp lệ'
      });
    }

    // Validate sortOrder
    const validSortOrders = ['ASC', 'DESC'];
    if (!validSortOrders.includes(sortOrder.toUpperCase())) {
      return res.status(400).json({
        message: 'Thứ tự sắp xếp không hợp lệ'
      });
    }

    // Lấy danh sách task
    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullname', 'username']
        },
        {
          model: User,
          as: 'completer',
          attributes: ['id', 'fullname', 'username']
        },
        {
          model: WorkSession,
          as: 'WorkSession',
          attributes: ['id', 'date', 'status']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Check each task if it should be pending
    await Promise.all(rows.map(async (task) => {
      if (shouldTaskBePending(task)) {
        await task.update({
          status: 'pending',
          updatedAt: getCurrentDateTimeUTC7()
        });
      }
    }));

    res.json({
      tasks: rows,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      filters: {
        status,
        search,
        fromDate,
        toDate
      },
      sort: {
        by: sortBy,
        order: sortOrder
      }
    });
  } catch (err) {
    console.error('Get tasks by shift error:', err);
    res.status(500).json({
      message: 'Có lỗi xảy ra khi lấy danh sách công việc',
      error: err.message
    });
  }
};

/**
 * Lấy danh sách task theo người tạo
 */
export const getTasksByCreator = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, status } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Xây dựng điều kiện tìm kiếm
    const where = { createdBy: userId };
    if (status) where.status = status;

    // Lấy danh sách task
    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullname']
        },
        {
          model: User,
          as: 'completer',
          attributes: ['id', 'fullname']
        },
        {
          model: WorkShift,
          attributes: ['id', 'location', 'code']
        },
        {
          model: WorkSession,
          as: 'WorkSession',
          attributes: ['id', 'date', 'status']
        }
      ],
      order: [['checkInTime', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      tasks: rows,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    console.error('Get tasks by creator error:', err);
    res.status(500).json({
      message: 'Có lỗi xảy ra khi lấy danh sách công việc',
      error: err.message
    });
  }
};

/**
 * Cập nhật trạng thái task
 */
export const updateTaskStatus = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const { status, isSystemChange = false, changeReason = null } = req.body;

    // Validate status
    if (!['waiting', 'pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    // Get task with lock
    const task = await Task.findByPk(id, {
      lock: true,
      transaction
    });

    if (!task) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }

    // Check if task is locked by another user
    if (task.lockedBy && task.lockedBy !== req.user.id) {
      await transaction.rollback();
      return res.status(423).json({
        message: `Công việc đang được chỉnh sửa bởi ${task.lockedByUser?.fullname || 'người khác'}`
      });
    }

    // Validate status transition
    const validTransitions = {
      waiting: ['in_progress', 'pending', 'cancelled'],
      pending: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'pending', 'cancelled'],
      completed: ['in_progress'], // For reopening
      cancelled: []
    };

    if (!validTransitions[task.status].includes(status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Không thể chuyển từ trạng thái "${task.status}" sang "${status}"`
      });
    }

    // Special handling for status changes
    const oldStatus = task.status;
    const oldCheckOutTime = task.checkOutTime;

    // Update task status
    task.status = status;

    // Handle specific status changes
    if (status === 'in_progress') {
      // When starting work, set checkInTime if not set
      if (!task.checkInTime) {
        task.checkInTime = new Date();
      }
    } else if (status === 'completed') {
      // When completing, set checkOutTime
      task.checkOutTime = new Date();
      task.completedBy = req.user.id;
    } else if (status === 'cancelled') {
      // When cancelling, require reason
      if (!changeReason) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Vui lòng nhập lý do hủy' });
      }
      task.cancelReason = changeReason;
    }

    // Save task changes
    await task.save({ transaction });

    // Track status change in history
    await trackTaskChange(
      task.id,
      req.user.id,
      'status',
      'status',
      oldStatus,
      status,
      changeReason || (status === 'in_progress' ? 'Bắt đầu thực hiện công việc' : null),
      isSystemChange,
      transaction
    );

    // If checkOutTime changed, track that too
    if (oldCheckOutTime !== task.checkOutTime) {
      await trackTaskChange(
        task.id,
        req.user.id,
        'time',
        'checkOutTime',
        oldCheckOutTime,
        task.checkOutTime,
        changeReason,
        isSystemChange,
        transaction
      );
    }

    await transaction.commit();

    // Get updated task with relations
    const updatedTask = await Task.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'fullname'] },
        { model: User, as: 'completer', attributes: ['id', 'fullname'] }
      ]
    });

    // Lấy staff data sử dụng helper function
    const staff = await getTaskStaffData(id, updatedTask.fullName);

    // Tạo object hoàn chỉnh với staff
    const completeTask = {
      ...updatedTask.toJSON(),
      staff
    };

    // Broadcast update với đầy đủ thông tin
    sendTaskUpdate(completeTask, 'status', oldStatus, status);

    res.json({
      message: 'Cập nhật trạng thái thành công',
      task: updatedTask
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái công việc' });
  }
};

/**
 * Cập nhật task
 */
export const updateTask = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  const uploadedFiles = [];
  const changeGroupId = uuid();

  try {
    const taskId = req.params.id;
    console.log('🚀 Starting update task:', {
      taskId,
      body: req.body,
      changeReason: req.body.changeReason,
      changeGroupId
    });

    const task = await Task.findByPk(taskId, { transaction });

    if (!task) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }

    // 1. Chuẩn bị dữ liệu cập nhật
    const updateData = { ...req.body };
    delete updateData.changeReason;
    delete updateData.trackChanges;
    delete updateData.worker;
    delete updateData.fullName;

    // Lưu giá trị cũ trước khi cập nhật
    const oldTaskDescription = task.taskDescription;

    console.log('📝 Update data:', {
      taskDescription: {
        old: oldTaskDescription,
        new: updateData.taskDescription
      }
    });

    // 2. Xử lý thời gian
    if (updateData.checkInTime) {
      updateData.checkInTime = toUTC7(updateData.checkInTime);
    }
    if (updateData.checkOutTime) {
      updateData.checkOutTime = toUTC7(updateData.checkOutTime);
    }

    // 3. Cập nhật task
    await task.update(updateData, { transaction });
    console.log('✅ Task updated:', {
      taskId: task.id,
      taskDescription: task.taskDescription
    });

    // 5. Xử lý nhân sự
    if (req.body.staffList) {
      try {
        await updateTaskStaff(task, req.body.staffList, transaction);
      } catch (e) {
        console.warn('⚠️ Error processing staff update:', e);
      }
    }

    // 6. Xử lý file đính kèm
    if (req.files && req.files.length > 0) {
      try {
        const attachments = [...(task.attachments || [])];
        for (const file of req.files) {
          const fileData = await processFileUpload(file, task.id, transaction);
          attachments.push(fileData);
          uploadedFiles.push(file);
        }
        await task.update({ attachments }, { transaction });
      } catch (e) {
        console.warn('⚠️ Error processing attachments:', e);
      }
    }

    // 7. Lưu lịch sử thay đổi
    const changeReason = req.body.changeReason || 'Cập nhật thông tin';

    // Track taskDescription changes separately
    if (updateData.taskDescription !== undefined && updateData.taskDescription !== oldTaskDescription) {
      console.log('📝 Tracking taskDescription change:', {
        taskId: task.id,
        oldValue: oldTaskDescription,
        newValue: updateData.taskDescription,
        changeReason
      });

      try {
        await trackTaskChange(
          task.id,
          req.user.id,
          'content',
          'taskDescription',
          oldTaskDescription,
          updateData.taskDescription,
          changeReason,
          false,
          transaction,
          changeGroupId
        );
        console.log('✅ TaskDescription change tracked successfully');
      } catch (error) {
        console.error('❌ Error tracking taskDescription change:', error);
        throw error;
      }
    } else {
      console.log('ℹ️ No taskDescription change detected:', {
        taskId: task.id,
        oldValue: oldTaskDescription,
        newValue: updateData.taskDescription
      });
    }

    // Track other changes from frontend
    if (req.body.trackChanges) {
      try {
        const trackChanges = JSON.parse(req.body.trackChanges);
        for (const [field, change] of Object.entries(trackChanges)) {
          // Skip taskDescription as it's already handled above
          if (field === 'taskDescription') continue;
          
          await trackTaskChange(
            task.id,
            req.user.id,
            field === 'status' ? 'status' : 'time',
            field,
            change.oldValue,
            change.newValue,
            changeReason,
            false,
            transaction,
            changeGroupId
          );
        }
      } catch (e) {
        console.warn('⚠️ Error tracking changes:', e);
      }
    }

    await transaction.commit();
    console.log('✅ Transaction committed successfully');

    // 8. Lấy task đã cập nhật
    const updatedTask = await Task.findByPk(taskId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullname', 'username']
        },
        {
          model: TaskHistory,
          as: 'history',
          include: [{
            model: User,
            as: 'ChangedByUser',
            attributes: ['id', 'fullname', 'username']
          }],
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    console.log('✅ Task history after update:', {
      taskId: task.id,
      historyCount: updatedTask.history?.length || 0
    });

    return res.json({
      message: 'Cập nhật công việc thành công',
      task: updatedTask
    });

  } catch (error) {
    console.error('❌ Update task error:', error);
    await transaction.rollback();
    await cleanupFiles(uploadedFiles);
    return res.status(400).json({
      message: 'Lỗi cập nhật công việc',
      error: error.message
    });
  }
};

// Thêm hàm helper để xử lý cập nhật nhân sự
async function updateTaskStaff(task, newStaffList, transaction) {
  const currentStaff = await db.TaskUsers.findAll({
    where: { taskId: task.id },
    include: [
      { model: db.User, as: 'user', attributes: ['id', 'fullname', 'username'] },
      { model: db.Partners, as: 'partner', attributes: ['id', 'fullname', 'donVi'] }
    ],
    transaction
  });

  // Tạo maps để so sánh
  const currentStaffMap = new Map(
    currentStaff.map(staff => [
      staff.userId ? `user_${staff.userId}` : `partner_${staff.partnerId}`,
      staff
    ])
  );

  const newStaffMap = new Map(
    newStaffList.map(staff => [
      staff.type === 'user' ? `user_${staff.id}` : `partner_${staff.id}`,
      staff
    ])
  );

  // Xử lý xóa nhân sự
  for (const [key, staff] of currentStaffMap) {
    if (!newStaffMap.has(key)) {
      await staff.destroy({ transaction });
    }
  }

  // Xử lý thêm nhân sự mới
  for (const [key, staff] of newStaffMap) {
    if (!currentStaffMap.has(key)) {
      await db.TaskUsers.create({
        taskId: task.id,
        userId: staff.type === 'user' ? staff.id : null,
        partnerId: staff.type === 'partner' ? staff.id : null,
        role: staff.role
      }, { transaction });
    }
  }
}

// Thêm lại hàm updateTaskStaff với tên mới
export const updateTaskStaffAPI = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { taskId } = req.params;
    const { staffId, staffType, data } = req.body;

    // Kiểm tra task tồn tại
    const task = await Task.findByPk(taskId);
    if (!task) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Cập nhật bản ghi TaskUsers
    const where = {
      taskId,
      [staffType === 'user' ? 'userId' : 'partnerId']: staffId
    };

    const taskUser = await db.TaskUsers.findOne({ where });
    if (!taskUser) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy nhân sự trong task' });
    }

    const oldData = {
      id: staffId,
      type: staffType,
      role: taskUser.role
    };

    await taskUser.update({ role: data.role }, { transaction });

    // Track history
    await trackTaskChange(
      taskId,
      req.user.id,
      'staff',
      'staff',
      JSON.stringify(oldData),
      JSON.stringify({ ...oldData, ...data }),
      'Cập nhật nhân sự',
      false,
      transaction
    );

    await transaction.commit();
    res.json(taskUser);
  } catch (error) {
    await transaction.rollback();
    console.error('Update task staff error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Xóa task
 */
export const deleteTask = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const taskId = req.params.id;
    console.log('🗑️ Bắt đầu quá trình xóa task:', { taskId, userId: req.user.id });

    // 1. Kiểm tra task tồn tại
    const task = await Task.findByPk(taskId, { transaction });
    if (!task) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }

    // 2. Kiểm tra quyền xóa
    if (req.user.role !== 'manager' && task.createdBy !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({ message: 'Bạn không có quyền xóa công việc này' });
    }

    // 3. Kiểm tra trạng thái task
    if (task.status === 'completed') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Không thể xóa công việc đã hoàn thành' });
    }

    console.log('📝 Đã tìm thấy task:', { id: task.id, createdBy: task.createdBy });

    // 4. Xóa các bản ghi liên quan
    console.log('🗑️ Đang xóa các bản ghi liên quan...');

    // 4.1 Xóa TaskLocks
    console.log('🗑️ Đang xóa TaskLocks...');
    await db.TaskLock.destroy({
      where: { taskId },
      transaction
    });

    // 4.2 Xóa TaskUsers
    console.log('🗑️ Đang xóa TaskUsers...');
    await db.TaskUsers.destroy({
      where: { taskId },
      transaction
    });

    // 4.3 Xóa TaskHistory
    console.log('🗑️ Đang xóa lịch sử task...');
    await TaskHistory.destroy({
      where: { taskId },
      transaction
    });

    // 4.4 Xóa file đính kèm nếu có
    if (task.attachments && task.attachments.length > 0) {
      console.log('🗑️ Đang xóa file đính kèm...');
      for (const file of task.attachments) {
        try {
          if (file && file.path) {
            const filePath = path.join(config.rootDir, config.directories.task, taskId.toString(), path.basename(file.path));
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log('✅ Đã xóa file:', filePath);
            }
          }
        } catch (error) {
          console.warn('⚠️ Lỗi khi xóa file:', error);
        }
      }
    }

    // 5. Xóa task
    console.log('🗑️ Đang xóa task...');
    await task.destroy({ transaction });

    // 6. Commit transaction
    await transaction.commit();
    console.log('✅ Xóa task thành công:', { taskId });

    return res.json({ message: 'Xóa công việc thành công' });

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Lỗi trong quá trình xóa task:', {
      taskId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json({
      message: 'Lỗi khi xóa công việc',
      error: error.message
    });
  }
};

/**
 * Lấy lịch sử thay đổi của task
 */
export const getTaskHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await TaskHistory.findAll({
      where: { taskId: id },
      include: [{
        model: User,
        as: 'ChangedByUser',
        attributes: ['id', 'fullname', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Group changes by changeGroupId
    const groupedHistory = history.reduce((acc, change) => {
      if (!acc[change.changeGroupId]) {
        acc[change.changeGroupId] = {
          id: change.changeGroupId,
          changes: [],
          changedBy: change.ChangedByUser,
          createdAt: change.createdAt,
          changeReason: change.changeReason,
          isAutomatic: change.isAutomatic
        };
      }
      acc[change.changeGroupId].changes.push({
        type: change.changeType,
        field: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue
      });
      return acc;
    }, {});

    // Convert to array and sort by createdAt
    const sortedHistory = Object.values(groupedHistory).sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json({
      history: sortedHistory
    });
  } catch (error) {
    console.error('Error getting task history:', error);
    return res.status(500).json({
      message: 'Có lỗi xảy ra khi lấy lịch sử thay đổi'
    });
  }
};

/**
 * Lock task for editing
 */
export const lockTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const transaction = await db.sequelize.transaction();

  try {
    console.log('🔒 Attempting to lock task:', { taskId: id, userId });

    // Check if task exists
    const task = await Task.findByPk(id, { transaction });
    if (!task) {
      throw new Error('Không tìm thấy task');
    }

    // Check if task is already locked
    const existingLock = await db.TaskLock.findOne({
      where: {
        taskId: id,
        expiresAt: {
          [Op.gt]: new Date()
        }
      },
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'fullname']
      }],
      transaction
    });

    if (existingLock) {
      // If locked by the same user, extend the lock
      if (existingLock.lockedBy === userId) {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        await existingLock.update({
          expiresAt
        }, { transaction });

        await transaction.commit();
        return res.json({
          message: 'Gia hạn khóa thành công',
          lock: existingLock
        });
      }

      // If locked by another user
      throw new Error(`Task đang được khóa bởi ${existingLock.User.fullname}`);
    }

    // Create new lock
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const lock = await db.TaskLock.create({
      taskId: id,
      lockedBy: userId,
      expiresAt
    }, { transaction });

    // Add version to task if not exists
    if (!task.version) {
      await task.update({
        version: 1
      }, { transaction });
    }

    await transaction.commit();
    console.log('✅ Task locked successfully');

    return res.json({
      message: 'Khóa task thành công',
      lock
    });

  } catch (error) {
    console.error('❌ Lock task error:', error);
    await transaction.rollback();

    if (error.message.includes('đang được khóa')) {
      return res.status(423).json({ message: error.message });
    }

    return res.status(500).json({
      message: error.message || 'Có lỗi xảy ra khi khóa task'
    });
  }
};

/**
 * Unlock task
 */
export const unlockTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const transaction = await db.sequelize.transaction();

  try {
    console.log('🔓 Attempting to unlock task:', { taskId: id, userId });

    // Find existing lock
    const lock = await db.TaskLock.findOne({
      where: {
        taskId: id,
        lockedBy: userId,
        expiresAt: {
          [Op.gt]: new Date()
        }
      },
      transaction
    });

    if (!lock) {
      console.log('❌ No active lock found');
      await transaction.rollback();
      return res.status(404).json({
        message: 'Không tìm thấy khóa hoặc khóa đã hết hạn'
      });
    }

    // Delete the lock
    await lock.destroy({ transaction });

    await transaction.commit();
    console.log('✅ Task unlocked successfully');

    return res.json({
      message: 'Mở khóa task thành công'
    });

  } catch (error) {
    console.error('❌ Unlock task error:', error);
    await transaction.rollback();
    return res.status(500).json({
      message: 'Có lỗi xảy ra khi mở khóa task'
    });
  }
};

// Thêm route download file với tên gốc
export const downloadTaskFile = async (req, res) => {
  try {
    const { taskId, filename } = req.params;
    console.log('📥 Download request:', { taskId, filename });

    // Kiểm tra task có tồn tại không
    const task = await Task.findByPk(taskId);
    if (!task) {
      console.log('❌ Task not found:', taskId);
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }

    console.log('📎 Task attachments:', task.attachments);

    // Tìm file trong danh sách attachments
    const fileInfo = task.attachments?.find(file => file.filename === filename);
    if (!fileInfo) {
      console.log('❌ File not found in attachments:', { filename, attachments: task.attachments });
      return res.status(404).json({ message: 'File không tồn tại trong task này' });
    }

    // Tạo đường dẫn đầy đủ đến file
    const filePath = path.join(config.rootDir, config.directories.task, taskId, filename);
    console.log('📂 File path:', filePath);

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found on server:', filePath);
      return res.status(404).json({ message: 'File không tồn tại trên server' });
    }

    // Lấy tên file gốc từ fileInfo
    const originalName = fileInfo.originalName || fileInfo.originalname;
    if (!originalName) {
      console.log('❌ Original name not found:', fileInfo);
      return res.status(400).json({ message: 'Không tìm thấy tên file gốc' });
    }

    // Chuẩn hóa tên file
    const normalizedName = originalName
      .normalize('NFC') // Chuẩn hóa Unicode
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Thay thế ký tự đặc biệt bằng dấu gạch dưới
      .replace(/_+/g, '_') // Loại bỏ dấu gạch dưới liên tiếp
      .toLowerCase();

    console.log('📄 File info:', {
      originalName,
      normalizedName,
      mimetype: fileInfo.mimetype
    });

    // Thiết lập header cho response
    res.setHeader('Content-Disposition', `attachment; filename="${normalizedName}"; filename*=UTF-8''${encodeURIComponent(originalName)}`);
    res.setHeader('Content-Type', fileInfo.mimetype || 'application/octet-stream');

    // Gửi file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Xử lý lỗi khi đọc file
    fileStream.on('error', (err) => {
      console.error('❌ Error reading file:', err);
      res.status(500).json({ message: 'Lỗi khi đọc file' });
    });

  } catch (err) {
    console.error('❌ Download file error:', err);
    res.status(500).json({
      message: 'Có lỗi xảy ra khi tải file',
      error: err.message
    });
  }
};

// Upload files
export const uploadTaskFiles = async (req, res) => {
  try {
    const taskId = req.params.id;
    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      type: file.mimetype
    }));

    // Cập nhật thông tin file trong database
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    const currentAttachments = task.attachments || [];
    const updatedAttachments = [...currentAttachments, ...files];

    await task.update({ attachments: updatedAttachments });

    res.json({
      message: 'Upload file thành công',
      files: files
    });
  } catch (error) {
    console.error('Lỗi khi upload file:', error);
    res.status(500).json({ message: 'Lỗi khi upload file' });
  }
};

// Delete file
export const deleteTaskFile = async (req, res) => {
  try {
    const { taskId, filename } = req.params;
    const filePath = path.join(config.rootDir, config.directories.task, taskId, filename);

    // Xóa file vật lý
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Cập nhật database
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    const updatedAttachments = (task.attachments || [])
      .filter(file => file.filename !== filename);

    await task.update({ attachments: updatedAttachments });

    res.json({
      message: 'Xóa file thành công',
      attachments: updatedAttachments
    });
  } catch (error) {
    console.error('Lỗi khi xóa file:', error);
    res.status(500).json({ message: 'Lỗi khi xóa file' });
  }
};

/**
 * Lấy danh sách task đang làm việc theo ca
 */
export const getOngoingTasks = async (req, res) => {
  const { shiftId } = req.query;

  try {
    // Kiểm tra ca làm việc tồn tại
    const workShift = await WorkShift.findByPk(shiftId);
    if (!workShift) {
      return res.status(404).json({
        message: 'Không tìm thấy ca làm việc'
      });
    }

    // Lấy danh sách task đang làm việc
    const tasks = await Task.findAll({
      where: {
        status: 'in_progress',
        name: workShift.name
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullname', 'username']
        },
        {
          model: User,
          as: 'completer',
          attributes: ['id', 'fullname', 'username']
        },
        {
          model: WorkSession,
          as: 'WorkSession',
          attributes: ['id', 'date', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      tasks: tasks
    });
  } catch (err) {
    console.error('Get ongoing tasks error:', err);
    res.status(500).json({
      message: 'Có lỗi xảy ra khi lấy danh sách công việc đang làm',
      error: err.message
    });
  }
};

// Thêm các hàm xử lý nhân sự task
export const addTaskStaff = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { taskId } = req.params;
    const { staffData } = req.body;

    // Kiểm tra task tồn tại
    const task = await Task.findByPk(taskId);
    if (!task) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Kiểm tra staffData hợp lệ
    if (!staffData || !staffData.type) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Thiếu hoặc sai trường type trong staffData', staffData });
    }

    // Tạo bản ghi TaskUsers
    const taskUser = await db.TaskUsers.create({
      taskId,
      userId: staffData.type === 'user' ? staffData.id : null,
      partnerId: staffData.type === 'partner' ? staffData.id : null,
      role: staffData.role
    }, { transaction });

    // Lấy label của nhân sự vừa thêm
    let label = '';
    if (staffData.label) {
      label = staffData.label;
    } else if (staffData.fullName) {
      label = staffData.fullName + (staffData.donVi ? ` (${staffData.donVi})` : '');
    } else {
      label = `Nhân sự ${staffData.id}`;
    }

    // Track history
    await trackTaskChange(
      taskId,
      req.user.id,
      'staff',
      'staff',
      null,
      JSON.stringify([label]), // Lưu mảng label
      'Thêm nhân sự',
      false,
      transaction
    );

    await transaction.commit();
    res.json(taskUser);
  } catch (error) {
    await transaction.rollback();
    console.error('Add task staff error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const removeTaskStaff = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { taskId } = req.params;
    const { staffId, staffType } = req.query;

    // Kiểm tra task tồn tại
    const task = await Task.findByPk(taskId);
    if (!task) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Xóa bản ghi TaskUsers
    const where = {
      taskId,
      [staffType === 'user' ? 'userId' : 'partnerId']: staffId
    };

    const taskUser = await db.TaskUsers.findOne({ where, include: [
      { model: db.Partners, as: 'partner', attributes: ['fullname', 'donVi'] }
    ] });
    if (!taskUser) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Không tìm thấy nhân sự trong task' });
    }

    // Lấy label của nhân sự bị xóa
    let label = '';
    if (taskUser.partner) label = taskUser.partner.fullname + (taskUser.partner.donVi ? ` (${taskUser.partner.donVi})` : '');
    else label = `Nhân sự ${staffId}`;

    await taskUser.destroy({ transaction });

    // Track history
    await trackTaskChange(
      taskId,
      req.user.id,
      'staff',
      'staff',
      JSON.stringify([label]),
      null,
      'Xóa nhân sự',
      false,
      transaction
    );

    await transaction.commit();
    res.json({ message: 'Đã xóa nhân sự khỏi task' });
  } catch (error) {
    await transaction.rollback();
    console.error('Remove task staff error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getTaskStaff = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Kiểm tra task tồn tại
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Lấy danh sách nhân sự
    const taskUsers = await db.TaskUsers.findAll({
      where: { taskId },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'fullname', 'username']
        },
        {
          model: db.Partners,
          as: 'partner',
          attributes: ['id', 'fullName', 'donVi', 'email', 'phone', 'cccd']
        }
      ]
    });

    // Format kết quả - kiểm tra null trước khi truy cập thuộc tính
    const staff = taskUsers.map(tu => {
      if (tu.userId && tu.user) {
        return {
          type: 'user',
          id: tu.user.id,
          fullName: tu.user.fullname,
          username: tu.user.username,
          role: tu.role
        };
      } else if (tu.partnerId && tu.partner) {
        return {
          type: 'partner',
          id: tu.partner.id,
          fullName: tu.partner.fullName,
          donVi: tu.partner.donVi,
          email: tu.partner.email,
          phone: tu.partner.phone,
          role: tu.role
        };
      } else {
        // Trường hợp dữ liệu TaskUser bị thiếu liên kết
        console.warn(`TaskUser ${tu.id} thiếu thông tin user/partner cho task ${taskId}`);
        return {
          type: 'unknown',
          id: tu.id,
          role: tu.role,
          message: 'Thiếu thông tin user/partner'
        };
      }
    });

    res.json(staff);
  } catch (error) {
    console.error('Get task staff error:', error);
    res.status(500).json({ message: error.message });
  }
};
