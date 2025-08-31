import express from 'express';
import * as locationController from '../controllers/locationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);

// Protected routes (admin and manager)
router.use(authenticate);
router.use(authorizeRoles(['admin', 'manager']));

// Route riêng cho trang quản lý - lấy tất cả địa điểm
router.get('/management/all', locationController.getAllLocationsForManagement);

router.route('/')
  .post(locationController.createLocation);

router.route('/:id')
  .put(locationController.updateLocation)
  .delete(locationController.deleteLocation);

// Route khôi phục địa điểm
router.put('/:id/restore', locationController.restoreLocation);

export default router; 