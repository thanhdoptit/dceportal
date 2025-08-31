import express from 'express';
import formTemplateController from '../controllers/formTemplateController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validateHandoverForm } from '../middleware/handoverValidation.js';

const router = express.Router();

// Get current active template
router.get('/current', authenticate, formTemplateController.getCurrentTemplate);

// Get handover form template - cho phép tất cả role xem template
router.get('/handover', authenticate, authorizeRoles(['admin', 'user', 'datacenter', 'manager']), formTemplateController.getHandoverTemplate);

// Update template (admin và manager mới được phép cập nhật)
router.post('/update', authenticate, authorizeRoles(['admin', 'manager']), formTemplateController.updateTemplate);

// Cập nhật template form bàn giao (admin và manager mới được phép cập nhật)
router.put('/handover', authenticate, authorizeRoles(['admin', 'manager']), validateHandoverForm, formTemplateController.updateHandoverTemplate);

export default router; 