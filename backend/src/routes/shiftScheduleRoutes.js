import express from 'express';
import { getShiftSchedule, reloadShiftSchedule, getShiftScheduleStatus } from '../controllers/shiftScheduleController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lấy dữ liệu lịch trực
router.get('/schedule', authenticate, getShiftSchedule);

// Reload dữ liệu lịch trực từ file CSV
router.post('/reload', authenticate, reloadShiftSchedule);

// Lấy thông tin trạng thái dữ liệu lịch trực
router.get('/status', authenticate, getShiftScheduleStatus);

export default router; 