import express from 'express';
import * as shiftConfigController from '../controllers/shiftConfigController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes - có thể lấy cấu hình ca mà không cần auth
router.get('/', shiftConfigController.getShiftConfig);

// Protected routes - chỉ admin/manager mới có thể refresh
router.use(authenticate);
router.use(authorizeRoles(['admin', 'manager']));

router.post('/refresh', shiftConfigController.refreshShiftConfig);

export default router; 