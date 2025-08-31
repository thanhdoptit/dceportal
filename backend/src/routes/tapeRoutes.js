import express from 'express';
import { getTapes, getTapeById, deleteTape, updateTape, createTape, checkBarcode } from '../controllers/tapeController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Lấy danh sách tape
router.get('/', authenticate, getTapes);

// Kiểm tra barcode đã tồn tại chưa
router.get('/check-barcode', authenticate, checkBarcode);

// Lấy chi tiết tape theo id
router.get('/:id', authenticate, getTapeById);

// Xóa tape theo id
router.delete('/:id', authenticate, authorizeRoles(['admin', 'datacenter', 'manager']), deleteTape);

// Sửa tape theo id
router.put('/:id', authenticate, authorizeRoles(['admin', 'datacenter', 'manager']), updateTape);

// Tạo mới tape
router.post('/', authenticate, authorizeRoles(['admin', 'datacenter', 'manager']), createTape);

export default router; 