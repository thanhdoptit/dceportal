import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import {
  partnerValidationRules,
  validatePartner,
  checkDuplicatePartner,
  checkDuplicatePartnerUpdate
} from '../middleware/partnerValidation.js';
import {
  createPartner,
  getPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
  getPartnersByUnit,
  searchPartners,
  getDonViList,
  getPartnerTasks,
  checkDuplicatePartnerAPI
} from '../controllers/partnerController.js';

const router = express.Router();

// Tất cả routes đều yêu cầu xác thực
router.use(authenticate);

// Routes cho quản lý đối tác
router.post('/',
  authorizeRoles('admin', 'datacenter', 'manager', 'be'),
  partnerValidationRules,
  validatePartner,
  checkDuplicatePartner,
  createPartner
);
router.get('/', authorizeRoles('admin', 'datacenter', 'manager', 'be'), getPartners);
router.get('/donvi', authorizeRoles('admin', 'datacenter', 'manager', 'be'), getDonViList);

// Routes cho tìm kiếm và lọc
router.get('/unit/:unitId', authorizeRoles('admin', 'datacenter', 'manager', 'be'), getPartnersByUnit);
router.get('/search', authorizeRoles('admin', 'datacenter', 'manager', 'be'), searchPartners);
router.get('/check-duplicate', authorizeRoles('admin', 'datacenter', 'manager', 'be'), checkDuplicatePartnerAPI);

// Route để lấy danh sách task của một đối tác (phải đặt trước route :id)
router.get('/:partnerId/tasks', authorizeRoles('admin', 'datacenter', 'manager', 'be'), getPartnerTasks);

// Routes cho CRUD đối tác
router.get('/:id', authorizeRoles('admin', 'datacenter', 'manager', 'be'), getPartnerById);
router.put('/:id',
  authorizeRoles('admin', 'datacenter', 'manager', 'be'),
  partnerValidationRules,
  validatePartner,
  checkDuplicatePartnerUpdate,
  updatePartner
);
router.delete('/:id', authorizeRoles('admin', 'datacenter', 'manager', 'be'), deletePartner);

export default router;
