import nodemailer from 'nodemailer';
import { gmailConfig } from '../config/email.gmail.config.js';
import { EmailPriority } from '../types/email.types.js';

class GmailService {
  constructor() {
    this.MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB
    this.transporter = nodemailer.createTransport({
      service: gmailConfig.smtp.service,
      host: gmailConfig.smtp.host,
      port: gmailConfig.smtp.port,
      secure: gmailConfig.smtp.secure,
      auth: gmailConfig.smtp.auth,
      timeout: gmailConfig.options.timeout
    });
  }

  // Format người gửi
  formatSender(email, fullname) {
    if (!email) return null;
    const formattedSender = fullname ? `"${fullname}" <${email}>` : email;
    console.log('📧 Format người gửi Gmail:', {
      email,
      fullname,
      formatted: formattedSender
    });
    return formattedSender;
  }

  // Validate email
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Validate danh sách email
  validateEmailList(emails) {
    if (!emails) return true;
    const emailList = Array.isArray(emails) ? emails : [emails];
    return emailList.every(email => this.validateEmail(email));
  }

  // Format danh sách email
  formatEmailList(emails) {
    if (!emails) return [];
    return Array.isArray(emails) ? emails : [emails];
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

  // Gửi email với retry mechanism
  async sendMailWithRetry(options, retryCount = 0) {
    try {
      return await this.sendMail(options);
    } catch (error) {
      if (retryCount < gmailConfig.options.maxRetries) {
        await new Promise(resolve => 
          setTimeout(resolve, gmailConfig.options.retryDelay)
        );
        return this.sendMailWithRetry(options, retryCount + 1);
      }
      throw error;
    }
  }

  // Gửi email
  async sendMail(options) {
    try {
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
      const from = this.formatSender(
        options.from || gmailConfig.defaults.from,
        options.fullname || gmailConfig.defaults.fullname
      );

      const mailOptions = {
        from,
        replyTo: options.replyTo || gmailConfig.defaults.replyTo,
        to,
        cc,
        bcc,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
        priority: options.priority || EmailPriority.NORMAL
      };

      // Log trước khi gửi
      console.log('📨 Chuẩn bị gửi email Gmail:', {
        from: mailOptions.from,
        replyTo: mailOptions.replyTo,
        to: mailOptions.to,
        cc: mailOptions.cc,
        bcc: mailOptions.bcc,
        subject: mailOptions.subject,
        hasAttachments: !!mailOptions.attachments?.length,
        priority: mailOptions.priority,
        timestamp: new Date().toISOString()
      });

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log khi gửi thành công
      console.log('✅ Gửi email Gmail thành công:', {
        messageId: info.messageId,
        from: mailOptions.from,
        replyTo: mailOptions.replyTo,
        to,
        cc,
        bcc,
        subject: options.subject,
        hasAttachments: !!mailOptions.attachments?.length,
        priority: mailOptions.priority,
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
      // Log khi có lỗi
      console.error('❌ Lỗi gửi email Gmail:', {
        error: error.message,
        from: options.from || gmailConfig.defaults.from,
        fullname: options.fullname || gmailConfig.defaults.fullname,
        to: options.to,
        subject: options.subject,
        timestamp: new Date().toISOString()
      });
      throw new Error('Không thể gửi email qua Gmail: ' + error.message);
    }
  }

  // Gửi email theo template
  async sendTemplateMail(templateName, data) {
    const template = gmailConfig.templates[templateName];
    if (!template) {
      throw new Error('Template không tồn tại');
    }

    return this.sendMailWithRetry({
      to: data.to,
      cc: data.cc,
      bcc: data.bcc,
      subject: template.subject,
      html: this.renderTemplate(template.template, data.templateData),
      priority: data.priority
    });
  }

  // Render template
  renderTemplate(templateName, data) {
    // TODO: Implement template rendering
    return `<p>Template: ${templateName}</p><p>Data: ${JSON.stringify(data)}</p>`;
  }
}

export const gmailService = new GmailService(); 