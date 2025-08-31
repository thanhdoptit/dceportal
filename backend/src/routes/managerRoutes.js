import express from 'express';
import { 
  getStats, 
  getRecentHandovers, 
  getDailyStats,
  getRecentTasks,
  getEmployeeStats
} from '../controllers/managerController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * Áp dụng middleware xác thực cho tất cả các route
 * Kiểm tra JWT token trong header Authorization
 */
router.use(authenticate);

/**
 * Áp dụng middleware kiểm tra quyền truy cập
 * Chỉ cho phép người dùng có role 'manager'
 */
router.use(authorizeRoles('manager'));

/**
 * API lấy thống kê tổng quan cho dashboard
 * GET /api/manager/stats
 * Query params: startDate, endDate
 */
router.get('/stats', getStats);

/**
 * API lấy danh sách bàn giao gần đây
 * GET /api/manager/recent-handovers
 * Query params: startDate, endDate
 */
router.get('/recent-handovers', getRecentHandovers);

/**
 * API lấy thống kê chi tiết theo ngày
 * GET /api/manager/daily-stats
 * Query params: startDate, endDate
 */
router.get('/daily-stats', getDailyStats);

/**
 * API lấy danh sách công việc gần đây
 * GET /api/manager/recent-tasks
 * Query params: startDate, endDate
 */
router.get('/recent-tasks', getRecentTasks);

/**
 * API lấy thống kê nhân viên
 * GET /api/manager/employee-stats
 * Query params: startDate, endDate
 */
router.get('/employee-stats', getEmployeeStats);

export default router; 