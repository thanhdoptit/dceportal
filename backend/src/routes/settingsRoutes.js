import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import {
  getEmailSettings,
  updateEmailSettings,
  testEmailConnection,
  initializeEmailSettings
} from '../controllers/settingsController.js';

const router = express.Router();

// Tất cả routes yêu cầu authentication và role admin/manager
router.use(authenticate);
router.use(authorizeRoles(['admin', 'manager']));

// Lấy cấu hình email
router.get('/email', getEmailSettings);

// Cập nhật cấu hình email
router.put('/email', updateEmailSettings);

// Test kết nối email
router.post('/email/test', testEmailConnection);

// Khởi tạo cấu hình email mặc định
router.post('/email/initialize', initializeEmailSettings);

export default router; 