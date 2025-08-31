import express from 'express';
import {
  importBackupData,
  getBackupJobs,
  getBackupJobDetail,
  updateBackupJobStatus,
  getBackupStats,
  createBackupJob,
  deleteBackupJob
} from '../controllers/backupController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Tất cả routes đều yêu cầu xác thực
router.use(authenticate);

// Import dữ liệu backup từ Excel
router.post('/import', authorizeRoles(['admin', 'datacenter']), importBackupData);

// Lấy danh sách backup jobs
router.get('/', getBackupJobs);

// Lấy chi tiết backup job
router.get('/:id', getBackupJobDetail);

// Cập nhật trạng thái backup job
router.patch('/:id/status', authorizeRoles(['admin', 'datacenter']), updateBackupJobStatus);

// Lấy thống kê backup jobs
router.get('/stats/overview', getBackupStats);

// Tạo backup job mới
router.post('/', authorizeRoles(['admin', 'datacenter']), createBackupJob);

// Xóa backup job
router.delete('/:id', authorizeRoles(['admin']), deleteBackupJob);

export default router; 