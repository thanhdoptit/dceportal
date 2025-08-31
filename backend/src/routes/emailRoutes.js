import express from 'express';
import { emailService } from '../services/email.service.js';

const router = express.Router();

// Test gửi email cơ bản
router.post('/test', async (req, res) => {
  try {
    const { to, subject, content, userEmail, userFullname } = req.body;
    
    const result = await emailService.sendMail({
      to,
      subject,
      html: content
    }, userEmail, userFullname);

    if (result.success) {
      res.json({ success: true, message: 'Email sent successfully', messageId: result.messageId });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test gửi email biên bản bàn giao
router.post('/test-handover', async (req, res) => {
  try {
    const { to, subject, content, devices, userEmail, userFullname } = req.body;
    
    // Format email body cho biên bản bàn giao
    const html = `
      <h2>Biên bản bàn giao</h2>
      <p>${content}</p>
      
      <h3>Thông tin thiết bị:</h3>
      <ul>
        ${devices?.map(device => `
          <li>
            <strong>${device.deviceName}:</strong> ${device.status}
            ${device.status === 'Có lỗi' ? `
              <br>Mã lỗi: ${device.errorCode}
              <br>Nguyên nhân: ${device.errorCause}
              <br>Giải pháp: ${device.solution}
            ` : ''}
          </li>
        `).join('') || ''}
      </ul>
    `;

    const result = await emailService.sendMail({
      to,
      subject,
      html
    }, userEmail, userFullname);
    
    if (result.success) {
      res.json({ success: true, message: 'Handover email sent successfully', messageId: result.messageId });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 