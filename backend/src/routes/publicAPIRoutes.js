import express from 'express';
import {
  getActiveShiftMembers,
  getShiftDetails,
  getAllShifts,
  getShiftsByPattern,
  getActiveShiftPhones
} from '../controllers/publicAPIController.js';

const router = express.Router();

// Public API routes - không cần authentication

// Public API routes
router.get('/shifts/active', getActiveShiftMembers);
router.get('/shifts/phones', getActiveShiftPhones); // Lấy số điện thoại ca đang active
router.get('/shifts/pattern', getShiftsByPattern); // Tìm ca theo pattern (H, V, T)
router.get('/shifts/:shiftId', getShiftDetails);
router.get('/shifts', getAllShifts);

export default router; 