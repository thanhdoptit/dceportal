import express from 'express';
import { sendEmail } from '../controllers/email.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Middleware xác thực
router.use(authenticate);

// Gửi email
// POST /api/email/send
// Body: {
//   to: string[],
//   cc?: string[],
//   bcc?: string[],
//   subject: string,
//   html: string,
//   text?: string,
//   attachments?: Array<{filename: string, content: string, contentType: string}>,
//   template?: string,
//   templateData?: object,
//   from?: string,
//   replyTo?: string,
//   priority?: string,
//   useInternalEmail?: boolean,
//   password?: string // Chỉ cần khi useInternalEmail = true
// }
router.post('/send', authorizeRoles(['admin', 'datacenter', 'manager']), sendEmail);

export default router; 