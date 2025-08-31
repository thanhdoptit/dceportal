// shiftRoutes.js
import express from 'express';
import {
  selectShift,
  closeShift,
  getCurrentShift,
  getAllShifts,
  getTodayAvailableShifts,
  exitShift,
  getNextShiftUsers,
  getNextShift,
  handoverShift,
  receiveShift,
  updateShiftStatus,
  changeShift,  
  getHandoverStats,
  getHandoversByShift,
  getHandoversByDate,
  getHandoverDetails,
  confirmHandover,
  rejectHandover,
  getHandoversByStatus,
  getHandoverHistory,
  getWorkSessions,
  createDraftHandover,
  updateDraftHandover,
  deleteDraftHandover,
  getDraftHandover,
  getDraftHandovers,
  submitDraftHandover,
  getShiftUsers,
  getMyShifts,
  uploadHandoverFiles,
  deleteHandoverFile,
  uploadTempHandoverFiles,
  commitTempFilesToHandover,
  cleanupTempFiles,
  deleteTempFile,
  getManagerShifts,
  createManagerShift,
  updateManagerShift,
  getShiftLayout
} from '../controllers/shiftController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateHandoverForm } from '../middleware/handoverValidation.js';
import { uploadHandoverFiles as uploadMiddleware, uploadTempHandoverFiles as uploadTempMiddleware, handleHandoverUploadError } from '../middleware/handoverUploadMiddleware.js';
import { isManager } from '../middleware/roleMiddleware.js';
import db from '../models/index.js';
import config from '../config/upload.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Basic shift operations
router.get('/layout', authenticate, getShiftLayout);
router.get('/my-shifts', authenticate, getMyShifts);
router.put('/select', authenticate, selectShift);
router.put('/:id/close', authenticate, closeShift);
router.get('/current', authenticate, getCurrentShift);
router.get('/all', authenticate, getAllShifts);
router.get('/today-available', authenticate, getTodayAvailableShifts);
router.put('/:id/exit', authenticate, exitShift);
router.get('/:id/next-users', authenticate, getNextShiftUsers);
router.get('/:id/next', authenticate, getNextShift);
router.get('/:id/users', authenticate, getShiftUsers);
router.put('/:shiftId/status', authenticate, updateShiftStatus);

// Manager shift operations
router.get('/manager/shifts', authenticate, isManager, getManagerShifts);
router.post('/manager/shifts', authenticate, isManager, createManagerShift);
router.put('/manager/shifts/:id', authenticate, isManager, updateManagerShift);

// Handover operations
router.put('/:id/handover', authenticate, handoverShift);
router.put('/:id/receive', authenticate, receiveShift);
router.put('/:id/status', authenticate, updateShiftStatus);
router.put('/:id/change', authenticate, changeShift);

// Handover routes
router.post('/handover/draft', authenticate, validateHandoverForm, createDraftHandover);
router.post('/handover/submit/:handoverId', authenticate, validateHandoverForm, submitDraftHandover);
router.get('/handover/:handoverId', authenticate, getHandoverDetails);
router.patch('/handover/:handoverId', authenticate, validateHandoverForm, updateDraftHandover);
router.delete('/handover/:handoverId', authenticate, deleteDraftHandover);
router.post('/handover/confirm/:handoverId', authenticate, confirmHandover);
router.post('/handover/reject/:handoverId', authenticate, rejectHandover);

// Handover queries
router.get('/handover/stats', authenticate, getHandoverStats);
router.get('/handover/history', authenticate, getHandoverHistory);
router.get('/handover/by-shift/:shiftId', authenticate, getHandoversByShift);
router.get('/handover/by-date/:date', authenticate, getHandoversByDate);
router.get('/handover/by-status/:status', authenticate, getHandoversByStatus);

// Work session queries
router.get('/:id/sessions', authenticate, getWorkSessions);

// Draft handover management
router.get('/handover/drafts', authenticate, getDraftHandovers);
router.get('/handover/draft/:handoverId', authenticate, getDraftHandover);
router.put('/handover/draft/:handoverId', authenticate, validateHandoverForm, updateDraftHandover);
router.post('/handover/draft/:handoverId/submit', authenticate, validateHandoverForm, submitDraftHandover);

// Handover file routes
router.post('/handover/:id/attachments', 
  authenticate,
  uploadMiddleware,
  uploadHandoverFiles
);

router.delete('/handover/:id/attachments/:filename',
  authenticate,
  deleteHandoverFile
);

// Temp file routes
router.post('/handover/temp/upload',
  authenticate,
  uploadTempMiddleware,
  uploadTempHandoverFiles
);

router.post('/handover/temp/commit',
  authenticate,
  commitTempFilesToHandover
);

router.delete('/handover/temp/cleanup/:sessionId',
  authenticate,
  cleanupTempFiles
);

router.delete('/handover/temp/delete/:sessionId/:filename',
  authenticate,
  deleteTempFile
);

// Thêm route download file đính kèm
router.get('/handover/:id/attachments/:filename',
  authenticate,
  async (req, res) => {
    try {
      const { id, filename } = req.params;
      
      // Tìm handover
      const handover = await db.ShiftHandover.findOne({
        where: { id }
      });
      
      if (!handover) {
        return res.status(404).json({ message: 'Không tìm thấy bàn giao' });
      }
      
      // Tìm file trong attachments
      const attachments = handover.attachments || [];
      const fileInfo = attachments.find(file => file.filename === filename);
      
      if (!fileInfo) {
        return res.status(404).json({ message: 'Không tìm thấy file' });
      }
      
      // Đường dẫn file
      const filePath = path.join(config.rootDir, config.directories.handover, id.toString(), filename);
      
      // Kiểm tra file có tồn tại không
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File không tồn tại trên server' });
      }
      
      // Sử dụng res.download với tên file gốc
      res.download(filePath, fileInfo.originalname);
    } catch (error) {
      console.error('Download file error:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi tải file' });
    }
  }
);

// Middleware xử lý lỗi upload
router.use(handleHandoverUploadError);

export default router;