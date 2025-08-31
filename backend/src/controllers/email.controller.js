import { emailService } from '../services/email.service.js';
import { gmailService } from '../services/gmail.service.js';

// Gửi email
export const sendEmail = async (req, res) => {
  try {
    const {
      to,
      cc,
      bcc,
      subject,
      html,
      text,
      attachments,
      template,
      templateData,
      from,
      replyTo,
      priority,
      useInternalEmail = true
    } = req.body;

    // Lấy thông tin user từ request
    const username = req.user?.username;
    const fullname = req.user?.fullname;
    const userEmail = username ? `${username}@vietinbank.vn` : null;

    if (useInternalEmail) {
      // Kiểm tra thông tin đăng nhập
      if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng đăng nhập để sử dụng email nội bộ'
        });
      }

      let result;
      if (template) {
        result = await emailService.sendTemplateMail(template, {
          to,
          cc,
          bcc,
          templateData,
          priority
        }, userEmail, fullname);
      } else {
        result = await emailService.sendMail({
          to,
          cc,
          bcc,
          subject,
          html,
          text,
          attachments,
          replyTo,
          priority
        }, userEmail, fullname);
      }

      res.json(result);
    } else {
      // Sử dụng Gmail service
      let result;
      if (template) {
        result = await gmailService.sendTemplateMail(template, {
          to,
          cc,
          bcc,
          templateData,
          priority
        });
      } else {
        result = await gmailService.sendMail({
          to,
          cc,
          bcc,
          subject,
          html,
          text,
          attachments,
          from,
          replyTo,
          priority
        });
      }

      res.json(result);
    }
  } catch (error) {
    console.error('Error sending email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Có lỗi xảy ra khi gửi email'
    });
  }
};
