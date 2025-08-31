import { settingsService } from '../services/settingsService.js';
import { emailService } from '../services/email.service.js';

// Lấy tất cả email settings
export const getEmailSettings = async (req, res) => {
  try {
    const emailSettings = await settingsService.getSettingsByCategory('email');
    
    res.json({
      success: true,
      data: emailSettings
    });
  } catch (error) {
    console.error('❌ Lỗi lấy email settings:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cấu hình email'
    });
  }
};

// Cập nhật email settings
export const updateEmailSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const userId = req.user?.id;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu cấu hình không hợp lệ'
      });
    }

    const updatePromises = Object.entries(settings).map(([key, value]) => {
      const isEncrypted = key.includes('pass');
      return settingsService.updateSetting(
        key,
        value,
        null,
        isEncrypted,
        userId
      );
    });

    await Promise.all(updatePromises);

    // Reset email transporter để load config mới
    emailService.transporter = null;

    res.json({
      success: true,
      message: 'Cập nhật cấu hình email thành công'
    });
  } catch (error) {
    console.error('❌ Lỗi cập nhật email settings:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật cấu hình email'
    });
  }
};

// Test email connection
export const testEmailConnection = async (req, res) => {
  try {
    const result = await emailService.testConnection();
    
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('❌ Lỗi test email connection:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi test kết nối email'
    });
  }
};

// Khởi tạo email settings mặc định
export const initializeEmailSettings = async (req, res) => {
  try {
    await settingsService.initializeEmailSettings();
    
    res.json({
      success: true,
      message: 'Khởi tạo cấu hình email mặc định thành công'
    });
  } catch (error) {
    console.error('❌ Lỗi khởi tạo email settings:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi khởi tạo cấu hình email'
    });
  }
}; 