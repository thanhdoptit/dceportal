export const gmailConfig = {
  // Cấu hình SMTP cho Gmail
  smtp: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'thanhdoptit@gmail.com',
      pass: 'lnbv rdnn pvji lzhf'
    }
  },

  // Cấu hình mặc định
      defaults: {
    from: 'thanhdoptit@gmail.com',
    fullname: 'Phan Thành Đô',
    replyTo: 'thanhdoptit@gmail.com'
  },

  // Cấu hình template
  templates: {
    notification: {
      subject: 'Thông báo từ hệ thống',
      template: 'notification.html'
    },
    alert: {
      subject: 'Cảnh báo hệ thống',
      template: 'alert.html'
    }
  },

  // Cấu hình khác
  options: {
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
    timeout: 10000, // 10 seconds
  }
}; 