import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';
import { validateTask, taskValidationRules } from '../middleware/validationMiddleware.js';
import { uploadTaskFiles, handleTaskUploadError } from '../middleware/taskUploadMiddleware.js';
import db from '../models/index.js';
import config from '../config/upload.js';
const { Task, User, WorkShift, WorkSession } = db;
import {
  createTask,
  getTaskById,
  getTasksByShift,
  getTasksByCreator,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskHistory,
  lockTask,
  unlockTask,
  uploadTaskFiles as uploadTaskFilesController,
  downloadTaskFile,
  deleteTaskFile,
  addTaskStaff,
  removeTaskStaff,
  updateTaskStaffAPI,
  getTaskStaff
} from '../controllers/taskController.js';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

/**
 * @route   POST /api/tasks
 * @desc    Tạo task mới
 * @access  Private
 */
router.post('/',
  authenticate,
  uploadMultiple('attachments', 10),
  taskValidationRules,
  validateTask,
  createTask
);

/**
 * @route   GET /api/tasks/:id
 * @desc    Lấy chi tiết một task
 * @access  Private
 */
router.get('/:id',
  authenticate,
  getTaskById
);

/**
 * @route   GET /api/tasks/shift/:shiftId
 * @desc    Lấy danh sách task theo ca làm việc
 * @access  Private
 * @query   {
 *   page: number,
 *   limit: number,
 *   status: 'new' | 'in_progress' | 'completed' | 'cancelled',
 *   priority: 'low' | 'medium' | 'high'
 * }
 */
router.get('/shift/:shiftId',
  authenticate,
  getTasksByShift
);

/**
 * @route   GET /api/tasks/creator/:userId
 * @desc    Lấy danh sách task theo người tạo
 * @access  Private
 * @query   {
 *   page: number,
 *   limit: number,
 *   status: 'new' | 'in_progress' | 'completed' | 'cancelled',
 *   priority: 'low' | 'medium' | 'high'
 * }
 */
router.get('/creator/:userId',
  authenticate,
  getTasksByCreator
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Cập nhật task
 * @access  Private (Chỉ creator hoặc admin)
 */
router.put('/:id',
  authenticate,
  uploadMultiple('attachments', 10),
  taskValidationRules,
  validateTask,
  updateTask
);

/**
 * @route   PUT /api/tasks/:id/status
 * @desc    Cập nhật trạng thái task
 * @access  Private (Chỉ creator hoặc admin)
 */
router.put('/:id/status',
  authenticate,
  updateTaskStatus
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Xóa task
 * @access  Private (Chỉ creator hoặc admin)
 */
router.delete('/:id',
  authenticate,
  deleteTask
);

/**
 * @route   GET /api/tasks
 * @desc    Lấy danh sách tất cả task (có phân trang và filter)
 * @access  Private
 * @query   {
 *   page: number,
 *   pageSize: number,
 *   limit: number,
 *   status: 'new' | 'in_progress' | 'completed' | 'cancelled',
 *   priority: 'low' | 'medium' | 'high',
 *   fromDate: string,
 *   toDate: string,
 *   name: string
 * }
 */
router.get('/',
  authenticate,
  async (req, res) => {
    const {
      page = 1,
      pageSize,
      limit = pageSize || 10,
      status,
      priority,
      fromDate,
      toDate,
      name,
      location,
      dateField = 'checkInTime',
      search
    } = req.query;
    const offset = (page - 1) * limit;



    try {
      // Xây dựng điều kiện tìm kiếm cơ bản
      const where = {};
      if (priority) where.priority = priority;
      if (name) where.location = name;
      if (location) where.location = location;

      // Xử lý search theo TaskTitle - tối ưu hóa cho MSSQL
      if (search && search.trim()) {
        const searchTerm = search.trim();
        where[Op.or] = [
          { taskTitle: { [Op.like]: `%${searchTerm}%` } },
          { taskDescription: { [Op.like]: `%${searchTerm}%` } },
          { location: { [Op.like]: `%${searchTerm}%` } }
        ];
      }

      // Xử lý điều kiện status và thời gian
      const statusList = Array.isArray(status) ? status : [status];
      const orConditions = [];

      // Xử lý filter theo thời gian
      let timeFilter = {};
      if (fromDate || toDate) {
        const dateFieldToUse = dateField || 'checkInTime';
        timeFilter[dateFieldToUse] = {};
        if (fromDate) timeFilter[dateFieldToUse][Op.gte] = new Date(fromDate);
        if (toDate) timeFilter[dateFieldToUse][Op.lte] = new Date(toDate);
      }

      if (statusList.includes('completed')) {
        // Filter completed với điều kiện thời gian
        const completedCondition = {
          status: 'completed'
        };
        if (Object.keys(timeFilter).length > 0) {
          Object.assign(completedCondition, timeFilter);
        }
        orConditions.push(completedCondition);
      }

      const otherStatuses = statusList.filter(s => s !== 'completed');
      if (otherStatuses.length > 0) {
        // Filter các status khác (pending, in_progress, waiting) KHÔNG áp dụng điều kiện thời gian
        // Chỉ completed tasks mới áp dụng time filter để lấy tasks hoàn thành trong khoảng thời gian
        const otherCondition = {
          status: { [Op.in]: otherStatuses }
        };
        orConditions.push(otherCondition);
      }

      if (status && orConditions.length > 0) {
        where[Op.or] = orConditions;
      } else if (!status && Object.keys(timeFilter).length > 0) {
        // Nếu không có status filter nhưng có time filter
        Object.assign(where, timeFilter);
      }

      console.log('Where conditions:', JSON.stringify(where, null, 2));

      // Đếm tổng số records với điều kiện filter - tối ưu cho MSSQL
      const total = await Task.count({
        where,
        // Thêm hint để tối ưu performance
        logging: false
      });

      // Luôn sắp xếp theo trạng thái với thứ tự ưu tiên cố định
      const caseStatement = `CASE [Task].[status]
        WHEN 'in_progress' THEN 2
        WHEN 'pending' THEN 2
        WHEN 'waiting' THEN 1
        WHEN 'completed' THEN 4
        WHEN 'cancelled' THEN 5
        ELSE 6 END`;

      // Sắp xếp theo trạng thái trước, sau đó theo thời gian tạo giảm dần (mới nhất lên đầu)
      const orderClause = [
        [db.sequelize.literal(caseStatement), 'ASC'],
        ['createdAt', 'DESC']
      ];

      // Lấy danh sách task với phân trang - tối ưu cho MSSQL
      const rows = await Task.findAll({
        where,
        attributes: { exclude: ['attachments'] },
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
            model: WorkShift,
            as: 'WorkShift',
            attributes: ['id', 'startTime', 'endTime']
          }
        ],
        order: orderClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        // Tối ưu performance
        logging: false
      });

      // Lấy staff cho từng task
      const tasksWithStaff = await Promise.all(rows.map(async (task) => {
        // Lấy staff từ TaskUsers
        const taskUsers = await db.TaskUsers.findAll({
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
        let staff = taskUsers.map(tu => {
          if (tu.userId && tu.user) {
            return {
              type: 'user',
              id: tu.user.id,
              fullName: tu.user.fullname,
              username: tu.user.username,
              email: tu.user.email,
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
        // Nếu không có staff thì fallback về fullName
        if (!staff.length && task.fullName) {
          try {
            const arr = JSON.parse(task.fullName);
            staff = Array.isArray(arr) ? arr : [];
          } catch {
            staff = [];
          }
        }
        return { ...task.toJSON(), staff };
      }));

      res.json({
        tasks: tasksWithStaff,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit)
      });
    } catch (err) {
      console.error('Get all tasks error:', err);
      res.status(500).json({
        message: 'Có lỗi xảy ra khi lấy danh sách công việc',
        error: err.message
      });
    }
  }
);

/**
 * @route   POST /api/tasks/:id/lock
 * @desc    Lock task for editing
 * @access  Private
 */
router.post('/:id/lock', authenticate, lockTask);

/**
 * @route   DELETE /api/tasks/:id/lock
 * @desc    Unlock task
 * @access  Private
 */
router.delete('/:id/lock', authenticate, unlockTask);

/**
 * @route   GET /api/tasks/:id/history
 * @desc    Lấy lịch sử thay đổi của task
 * @access  Private
 */
router.get('/:id/history',
  authenticate,
  getTaskHistory
);

/**
 * @route   GET /api/tasks/:taskId/attachments/:filename
 * @desc    Tải file đính kèm
 * @access  Private
 */
router.get('/:taskId/attachments/:filename',
  authenticate,
  downloadTaskFile
);

/**
 * @route   DELETE /api/tasks/:taskId/attachments/:filename
 * @desc    Xóa file đính kèm
 * @access  Private (Chỉ creator hoặc admin)
 */
router.delete('/:taskId/attachments/:filename',
  authenticate,
  deleteTaskFile
);

/**
 * @route   POST /api/tasks/:taskId/attachments
 * @desc    Thêm file đính kèm mới
 * @access  Private (Chỉ creator hoặc admin)
 */
router.post('/:taskId/attachments',
  authenticate,
  uploadMultiple('attachments', 10),
  async (req, res) => {
    try {
      const { taskId } = req.params;

      // Kiểm tra task có tồn tại không
      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Không tìm thấy công việc' });
      }

      // Kiểm tra quyền thêm file
      if (task.creatorId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền thêm file vào task này' });
      }

      // Lấy danh sách file mới upload
      const newFiles = req.files?.map(f => f.filename) || [];
      if (!newFiles.length) {
        return res.status(400).json({ message: 'Không có file nào được gửi lên' });
      }

      // Cập nhật danh sách attachments trong DB
      const currentAttachments = task.attachments || [];
      const updatedAttachments = [...currentAttachments, ...newFiles];
      await task.update({ attachments: updatedAttachments });

      res.json({
        message: 'Thêm file thành công',
        attachments: updatedAttachments
      });
    } catch (err) {
      console.error('Add attachments error:', err);
      res.status(500).json({
        message: 'Có lỗi xảy ra khi thêm file đính kèm',
        error: err.message
      });
    }
  }
);

// File attachment routes
router.post('/:id/attachments',
  authenticate,
  uploadTaskFiles,
  handleTaskUploadError,
  uploadTaskFilesController
);

/**
 * @route   GET /api/tasks/:id/debug
 * @desc    Xem thông tin chi tiết của task (chỉ dùng cho debug)
 * @access  Private
 */
router.get('/:id/debug',
  authenticate,
  async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Không tìm thấy task' });
      }

      // Lấy thông tin chi tiết của task
      const taskInfo = {
        id: task.id,
        location: task.location,
        fullName: task.fullName,
        status: task.status,
        attachments: task.attachments,
        rawAttachments: task.getDataValue('attachments'),
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      };

      res.json(taskInfo);
    } catch (err) {
      console.error('Debug task error:', err);
      res.status(500).json({
        message: 'Có lỗi xảy ra khi lấy thông tin task',
        error: err.message
      });
    }
  }
);

// Staff routes
router.post('/:taskId/staff', authenticate, addTaskStaff);
router.delete('/:taskId/staff', authenticate, removeTaskStaff);
router.put('/:taskId/staff', authenticate, updateTaskStaffAPI);
router.get('/:taskId/staff', authenticate, getTaskStaff);

export default router;
