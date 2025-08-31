import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { uploadHandoverFiles, uploadTempHandoverFiles, handleHandoverUploadError } from '../middleware/handoverUploadMiddleware.js';
import { 
  uploadHandoverFiles as uploadController, 
  deleteHandoverFile,
  uploadTempHandoverFiles as uploadTempController,
  commitTempFilesToHandover,
  cleanupTempFiles
} from '../controllers/shiftController.js';
import config from '../config/upload.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Thêm middleware xử lý lỗi upload
router.use(handleHandoverUploadError);

// Thêm route upload file
router.post('/:id/attachments',
  authenticate,
  uploadHandoverFiles,
  uploadController
);

// Thêm route xóa file
router.delete('/:id/attachments/:filename',
  authenticate,
  async (req, res) => {
    try {
      const { id, filename } = req.params;
      
      // Đường dẫn file
      const filePath = path.join(config.rootDir, config.directories.handover, id.toString(), filename);
      
      // Xóa file
      await deleteHandoverFile(id, filename);
      
      res.json({ message: 'Xóa file thành công' });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi xóa file' });
    }
  }
);

// Thêm route upload temp files
router.post('/temp/upload',
  authenticate,
  uploadTempHandoverFiles,
  uploadTempController
);

// Thêm route commit temp files
router.post('/temp/commit',
  authenticate,
  commitTempFilesToHandover
);

// Thêm route cleanup temp files
router.delete('/temp/cleanup/:sessionId',
  authenticate,
  cleanupTempFiles
);

export default router; 