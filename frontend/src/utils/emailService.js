import { ExchangeService, WebCredentials, MessageBody, EmailMessage } from 'ews-javascript-api';

class EmailService {
  constructor(config) {
    this.service = new ExchangeService();
    this.service.Credentials = new WebCredentials(config.username, config.password);
    this.service.Url = new URL(config.ewsUrl);
  }

  async sendEmail({ to, subject, body, attachments = [] }) {
    try {
      const message = new EmailMessage(this.service);

      // Set recipients
      message.ToRecipients.Add(to);

      // Set subject and body
      message.Subject = subject;
      message.Body = new MessageBody(body);

      // Add attachments if any
      if (attachments.length > 0) {
        for (const attachment of attachments) {
          await message.Attachments.AddFileAttachment(attachment.name, attachment.content);
        }
      }

      // Send the email
      await message.SendAndSaveCopy();

      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendHandoverEmail(handoverData) {
    const { to, subject, content, attachments } = handoverData;

    // Format email body
    const body = `
      <h2>Biên bản bàn giao</h2>
      <p>${content}</p>
      
      <h3>Thông tin thiết bị:</h3>
      <ul>
        ${handoverData.devices
          .map(
            device => `
          <li>
            <strong>${device.deviceName}:</strong> ${device.status}
            ${
              device.status === 'Có lỗi'
                ? `
              <br>Mã lỗi: ${device.errorCode}
              <br>Nguyên nhân: ${device.errorCause}
              <br>Giải pháp: ${device.solution}
            `
                : ''
            }
          </li>
        `
          )
          .join('')}
      </ul>
    `;

    return this.sendEmail({
      to,
      subject,
      body,
      attachments,
    });
  }
}

export default EmailService;
