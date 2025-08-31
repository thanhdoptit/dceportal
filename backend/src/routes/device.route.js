import express from 'express';
import * as deviceController from '../controllers/device.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { uploadDeviceErrorImages, handleDeviceErrorUploadError } from '../middleware/deviceErrorUploadMiddleware.js';

const router = express.Router();

// Middleware xác thực cho tất cả routes còn lại
router.use(authenticate);
router.use(authorizeRoles(['manager', 'datacenter']));

// Routes cho thiết bị
router.route('/')
  .get(deviceController.getDevices)
  .post(authorizeRoles(['manager']), deviceController.createDevice);

// Route lấy danh sách tất cả thiết bị cho quản lý (bao gồm cả inactive)
router.get('/management/all', authorizeRoles(['manager']), deviceController.getAllDevicesForManagement);

// Route lấy danh sách tên device (public - không cần role cụ thể)
router.get('/names', deviceController.getDeviceNames);

router.route('/:id')
  .put(authorizeRoles(['manager']), deviceController.updateDevice)
  .delete(authorizeRoles(['manager']), deviceController.deleteDevice);

// Route khôi phục thiết bị đã xóa
router.put('/:id/restore', authorizeRoles(['manager']), deviceController.restoreDevice);

// Route cho thống kê
router.get('/statistics', deviceController.getDeviceStatistics);

// Route khởi tạo thiết bị mặc định
router.post('/initialize', authorizeRoles(['manager']), deviceController.initializeDevices);

// Route cho API lấy danh sách lỗi thiết bị
router.get('/errors', deviceController.getDeviceErrors);

// Route lấy lịch sử thay đổi của một lỗi thiết bị
router.get('/errors/:errorId/history', deviceController.getDeviceErrorHistory);

router.get('/errors/:id', deviceController.getDeviceErrorById);

router.put('/errors/:id', deviceController.updateDeviceError);

// Route cho API tạo sự cố thiết bị mới
router.post('/errors', 
  uploadDeviceErrorImages, 
  handleDeviceErrorUploadError, 
  deviceController.createDeviceError
);

// Route cho API upload hình ảnh tạm thời (cho modal tạo mới) - PHẢI ĐẶT TRƯỚC route có :errorId
router.post('/errors/temp/images', 
  uploadDeviceErrorImages, 
  handleDeviceErrorUploadError, 
  deviceController.uploadTempDeviceErrorImages
);

// Route cho API xóa hình ảnh tạm thời
router.delete('/errors/temp/images/:filename', deviceController.deleteTempDeviceErrorImage);

// Route để serve temp device error images (có authentication)
router.get('/errors/temp/images/:filename', deviceController.serveTempDeviceErrorImage);

// Route cho API cleanup temp images (chỉ manager)
router.post('/errors/temp/cleanup', authorizeRoles(['manager']), deviceController.cleanupTempImages);

// Route cho API upload hình ảnh tạm thời cho edit mode
router.post('/errors/:errorId/temp/images', 
  uploadDeviceErrorImages, 
  handleDeviceErrorUploadError, 
  deviceController.uploadTempDeviceErrorImagesForEdit
);

// Route để serve temp device error images cho edit mode (có authentication)
router.get('/errors/:errorId/temp/images/:filename', deviceController.serveTempDeviceErrorImageForEdit);

// Route cho API xóa hình ảnh tạm thời cho edit mode
router.delete('/errors/:errorId/temp/images/:filename', deviceController.deleteTempDeviceErrorImageForEdit);

// Route cho API di chuyển ảnh từ temp sang thư mục chính khi save edit
router.post('/errors/:errorId/move-temp-images', deviceController.moveTempImagesToFinal);

// Route cho API upload hình ảnh lỗi thiết bị
router.post('/errors/:errorId/images', 
  uploadDeviceErrorImages, 
  handleDeviceErrorUploadError, 
  deviceController.uploadDeviceErrorImages
);

// Route để serve device error images (có authentication)
router.get('/errors/:errorId/images/:filename', deviceController.serveDeviceErrorImage);

// Route cho API xóa hình ảnh lỗi thiết bị
router.delete('/errors/:errorId/images/:filename', deviceController.deleteDeviceErrorImage);

export default router; 