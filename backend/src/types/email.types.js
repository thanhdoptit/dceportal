export const EmailPriority = {
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low'
};

export const EmailAttachment = {
  filename: String,
  content: Buffer | String,
  path: String,
  contentType: String
};

export const EmailOptions = {
  to: [String],           // Người nhận chính
  cc: [String],           // CC
  bcc: [String],          // BCC
  subject: String,        // Tiêu đề
  html: String,           // Nội dung HTML
  text: String,           // Nội dung text
  attachments: [EmailAttachment], // File đính kèm
  template: String,       // Template sử dụng
  templateData: Object,   // Data cho template
  from: String,          // Người gửi
  replyTo: String,       // Reply to
  priority: EmailPriority // Độ ưu tiên
}; 