import express from 'express';
import { sendGmail } from '../controllers/gmail.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Middleware xác thực
router.use(authenticate);

// Gửi email qua Gmail
router.post('/send', authorizeRoles(['admin', 'datacenter', 'manager']), sendGmail);

export default router; 