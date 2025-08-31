import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: process.env.SMTP_PORT || 25,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false // Chấp nhận chứng chỉ tự ký
      }
    });
  }

  async sendEmail({ to, subject, html, attachments = [] }) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@example.com',
        to,
        subject,
        html,
        attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);

      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendHandoverEmail(handoverData) {
    const { to, subject, content, devices = [] } = handoverData;

    // Format email body
    const html = `
      <h2>Biên bản bàn giao</h2>
      <p>${content}</p>

      <h3>Thông tin thiết bị:</h3>
      <ul>
        ${devices.map(device => `
          <li>
            <strong>${device.deviceName}:</strong> ${device.status}
            ${device.status === 'Có lỗi' ? `
              <br>Mã lỗi: ${device.errorCode}
              <br>Nguyên nhân: ${device.errorCause}
              <br>Giải pháp: ${device.solution}
            ` : ''}
          </li>
        `).join('')}
      </ul>
    `;

    return this.sendEmail({
      to,
      subject,
      html
    });
  }

  async sendTaskNotification(taskData) {
    const { to, subject, task } = taskData;

    const html = `
      <h2>Thông báo công việc</h2>
      <p><strong>Vị trí công việc:</strong> ${task.location}</p>
      <p><strong>Trạng thái:</strong> ${task.status}</p>
      <p><strong>Người thực hiện:</strong> ${task.user?.fullName || 'Chưa phân công'}</p>
      <p><strong>Thời gian bắt đầu:</strong> ${task.startTime || 'Chưa có'}</p>
      <p><strong>Thời gian kết thúc:</strong> ${task.endTime || 'Chưa có'}</p>
      <p><strong>Mô tả:</strong> ${task.description || 'Không có'}</p>
    `;

    return this.sendEmail({
      to,
      subject,
      html
    });
  }
}

export default new EmailService();
