import express from 'express';
import {
  getActiveShiftMembers,
  getShiftDetails,
  getAllShifts,
  validateAPIKey
} from '../controllers/publicAPIController.js';

const router = express.Router();

// Áp dụng middleware validateAPIKey cho tất cả routes
router.use(validateAPIKey);

// Public API routes
router.get('/shifts/active', getActiveShiftMembers);
router.get('/shifts/:shiftId', getShiftDetails);
router.get('/shifts', getAllShifts);

export default router; 