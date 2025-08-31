// Cấu hình cho Public API
export const publicAPIConfig = {
  // API Key cho public API - có thể thay đổi theo môi trường
  apiKey: process.env.PUBLIC_API_KEY || 'dce_public_api_key_2024',
  
  // Rate limiting cho public API
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // 100 requests per window
    message: {
      success: false,
      message: 'Quá nhiều request, thử lại sau 15 phút'
    }
  },
  
  // Các endpoint được phép truy cập
  allowedEndpoints: [
    '/api/public/shifts/active',
    '/api/public/shifts',
    '/api/public/shifts/:shiftId'
  ],
  
  // Thông tin API
  apiInfo: {
    name: 'DCE Public API',
    version: '1.0.0',
    description: 'Public API để lấy thông tin ca làm việc và thành viên',
    contact: 'dce-support@vietinbank.vn'
  }
}; 