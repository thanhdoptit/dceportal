import nodemailer from 'nodemailer';
import { settingsService } from './settingsService.js';
import { EmailPriority } from '../types/email.types.js';

class EmailService {
  constructor() {
    this.MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB
    this.transporter = null;
    this.config = null;
  }

  // Khởi tạo transporter với config từ database
  async initializeTransporter() {
    try {
      console.log('🔄 Bắt đầu khởi tạo email transporter...');
      
      this.config = await settingsService.getEmailConfig();
      
      console.log('📊 Cấu hình email từ database:', {
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        secure: this.config.smtp.secure,
        user: this.config.smtp.auth?.user || 'N/A',
        pass: this.config.smtp.auth?.pass ? '***MASKED***' : 'N/A',
        tls_reject_unauthorized: this.config.smtp.tls?.rejectUnauthorized,
        debug: this.config.smtp.debug,
        logger: this.config.smtp.logger
      });

      console.log('🔧 Tạo nodemailer transporter với config...');
      
      this.transporter = nodemailer.createTransport({
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        secure: this.config.smtp.secure,
        auth: this.config.smtp.auth,
        tls: this.config.smtp.tls,
        debug: this.config.smtp.debug,
        logger: this.config.smtp.logger
      });

      console.log('✅ Email transporter đã được khởi tạo thành công với config từ database');
      console.log('📋 Chi tiết transporter:', {
        host: this.transporter.options.host,
        port: this.transporter.options.port,
        secure: this.transporter.options.secure,
        auth_user: this.transporter.options.auth?.user || 'N/A',
        auth_pass: this.transporter.options.auth?.pass ? '***MASKED***' : 'N/A',
        tls_reject_unauthorized: this.transporter.options.tls?.rejectUnauthorized,
        debug: this.transporter.options.debug,
        logger: this.transporter.options.logger
      });
      
      return true;
    } catch (error) {
      console.error('❌ Lỗi khởi tạo email transporter:', {
        error: error.message,
        stack: error.stack,
        config_loaded: !!this.config,
        config_keys: this.config ? Object.keys(this.config) : 'N/A'
      });
      return false;
    }
  }

  // Test connection
  async testConnection() {
    try {
      console.log('🧪 Bắt đầu test kết nối email...');
      
      if (!this.transporter) {
        console.log('⚠️ Transporter chưa được khởi tạo, đang khởi tạo...');
        const initialized = await this.initializeTransporter();
        if (!initialized) {
          console.error('❌ Không thể khởi tạo email transporter cho test');
          return { success: false, message: 'Không thể khởi tạo email transporter' };
        }
      }
      
      console.log('🔍 Kiểm tra transporter trước khi test:', {
        host: this.transporter.options.host,
        port: this.transporter.options.port,
        secure: this.transporter.options.secure,
        auth_user: this.transporter.options.auth?.user || 'N/A',
        auth_pass: this.transporter.options.auth?.pass ? '***MASKED***' : 'N/A'
      });
      
      console.log('🔗 Gọi transporter.verify() để test kết nối...');
      const result = await this.transporter.verify();
      
      console.log('✅ Test email connection thành công:', {
        result: result,
        host: this.transporter.options.host,
        port: this.transporter.options.port,
        secure: this.transporter.options.secure,
        auth_user: this.transporter.options.auth?.user || 'N/A',
        timestamp: new Date().toISOString()
      });
      
      return { success: true, message: 'Kết nối email thành công' };
    } catch (error) {
      console.error('❌ Test email connection thất bại:', {
        error: error.message,
        stack: error.stack,
        host: this.transporter?.options?.host || 'N/A',
        port: this.transporter?.options?.port || 'N/A',
        secure: this.transporter?.options?.secure || 'N/A',
        auth_user: this.transporter?.options?.auth?.user || 'N/A',
        auth_pass: this.transporter?.options?.auth?.pass ? '***MASKED***' : 'N/A',
        timestamp: new Date().toISOString()
      });
      
      // Log chi tiết lỗi auth nếu có
      if (error.message.includes('auth') || error.message.includes('login')) {
        console.error('🔐 Lỗi xác thực SMTP:', {
          user: this.transporter?.options?.auth?.user || 'N/A',
          pass_length: this.transporter?.options?.auth?.pass?.length || 0,
          host: this.transporter?.options?.host || 'N/A',
          port: this.transporter?.options?.port || 'N/A'
        });
      }
      
      // Log chi tiết lỗi kết nối nếu có
      if (error.message.includes('connect') || error.message.includes('timeout')) {
        console.error('🌐 Lỗi kết nối SMTP:', {
          host: this.transporter?.options?.host || 'N/A',
          port: this.transporter?.options?.port || 'N/A',
          secure: this.transporter?.options?.secure || 'N/A'
        });
      }
      
      return { success: false, message: 'Kết nối email thất bại: ' + error.message };
    }
  }

  // Validate email list
  validateEmailList(emails) {
    if (!emails) return false;
    const emailList = Array.isArray(emails) ? emails : [emails];
    return emailList.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }

  // Format email list
  formatEmailList(emails) {
    if (!emails) return [];
    return Array.isArray(emails) ? emails : [emails];
  }

  // Format người gửi
  formatSender(email, fullname) {
    if (!email) return null;
    const formattedSender = fullname ? `"${fullname}" <${email}>` : email;
    console.log('📧 Format người gửi email nội bộ:', {
      email,
      fullname,
      formatted: formattedSender
    });
    return formattedSender;
  }

  // Validate attachment
  validateAttachment(attachment) {
    if (!attachment.filename) {
      throw new Error('Tên file đính kèm không được để trống');
    }

    if (!attachment.content && !attachment.path) {
      throw new Error('File đính kèm phải có nội dung hoặc đường dẫn');
    }

    if (attachment.content && typeof attachment.content === 'string') {
      try {
        Buffer.from(attachment.content, 'base64');
      } catch (error) {
        throw new Error('Nội dung file không đúng định dạng base64');
      }
    }
  }

  // Check attachment size
  checkAttachmentSize(attachment) {
    if (attachment.content) {
      const size = Buffer.from(attachment.content, 'base64').length;
      if (size > this.MAX_ATTACHMENT_SIZE) {
        throw new Error(`File ${attachment.filename} vượt quá kích thước cho phép (25MB)`);
      }
    }
  }

  // Process attachments
  processAttachments(attachments) {
    if (!attachments || !Array.isArray(attachments)) return [];

    return attachments.map(attachment => {
      this.validateAttachment(attachment);
      this.checkAttachmentSize(attachment);

      // Nếu là base64 string
      if (attachment.content && typeof attachment.content === 'string') {
        return {
          filename: attachment.filename,
          content: Buffer.from(attachment.content, 'base64'),
          contentType: attachment.contentType
        };
      }
      // Nếu là Buffer hoặc Stream
      if (attachment.content instanceof Buffer || attachment.content?.pipe) {
        return attachment;
      }
      // Nếu là file path
      if (typeof attachment.path === 'string') {
        return attachment;
      }
      return attachment;
    });
  }

  // Log attachment info
  logAttachmentInfo(attachments) {
    console.log('📎 Thông tin file đính kèm:', {
      count: attachments.length,
      files: attachments.map(att => ({
        filename: att.filename,
        size: att.content ? Buffer.from(att.content, 'base64').length : 'unknown',
        type: att.contentType
      }))
    });
  }

  // Gửi email
  async sendMail(options, userEmail, userFullname) {
    try {
      // Khởi tạo transporter nếu chưa có
      if (!this.transporter) {
        const initialized = await this.initializeTransporter();
        if (!initialized) {
          throw new Error('Không thể khởi tạo email transporter');
        }
      }

      // Validate email addresses
      if (!this.validateEmailList(options.to)) {
        throw new Error('Địa chỉ email người nhận không hợp lệ');
      }
      if (options.cc && !this.validateEmailList(options.cc)) {
        throw new Error('Địa chỉ email CC không hợp lệ');
      }
      if (options.bcc && !this.validateEmailList(options.bcc)) {
        throw new Error('Địa chỉ email BCC không hợp lệ');
      }

      // Format email lists
      const to = this.formatEmailList(options.to);
      const cc = options.cc ? this.formatEmailList(options.cc) : undefined;
      const bcc = options.bcc ? this.formatEmailList(options.bcc) : undefined;

      // Process attachments if any
      if (options.attachments) {
        options.attachments = this.processAttachments(options.attachments);
        this.logAttachmentInfo(options.attachments);
      }

      // Format người gửi
      const from = this.formatSender(userEmail, userFullname);

      const mailOptions = {
        from,
        replyTo: options.replyTo || userEmail,
        to,
        cc,
        bcc,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
        priority: options.priority || EmailPriority.NORMAL
      };

      console.log('📨 Chuẩn bị gửi email nội bộ:', {
        from: mailOptions.from,
        replyTo: mailOptions.replyTo,
        to: mailOptions.to,
        cc: mailOptions.cc,
        bcc: mailOptions.bcc,
        subject: mailOptions.subject,
        hasAttachments: !!mailOptions.attachments?.length,
        priority: mailOptions.priority
      });

      const info = await this.transporter.sendMail(mailOptions);

      console.log('✅ Gửi email nội bộ thành công:', {
        messageId: info.messageId,
        from: mailOptions.from,
        to,
        cc,
        bcc,
        subject: options.subject,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        messageId: info.messageId,
        to,
        cc,
        bcc
      };
    } catch (error) {
      console.error('❌ Lỗi gửi email nội bộ:', {
        error: error.message,
        from: userEmail,
        fullname: userFullname,
        to: options.to,
        subject: options.subject,
        timestamp: new Date().toISOString()
      });
      throw new Error('Không thể gửi email: ' + error.message);
    }
  }

  // Gửi email theo template
  async sendTemplateMail(templateName, data, userEmail, userFullname) {
    try {
      const template = this.renderTemplate(templateName, data);
      return await this.sendMail(template, userEmail, userFullname);
    } catch (error) {
      console.error('❌ Lỗi gửi template email:', error);
      throw error;
    }
  }

  // Render template
  renderTemplate(template, data) {
    // Logic render template (giữ nguyên)
    return template;
  }
}

export const emailService = new EmailService();
