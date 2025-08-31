import SystemSettings from '../models/SystemSettings.js';
import crypto from 'crypto';

class SettingsService {
  constructor() {
    this.encryptionKey = process.env.SETTINGS_ENCRYPTION_KEY || 'default-key-32-chars-long!!';
  }

  // Mã hóa giá trị
  encryptValue(value) {
    if (!value) return value;
    try {
      // Tạo IV (Initialization Vector) ngẫu nhiên
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey.padEnd(32, '0').slice(0, 32)), iv);
      
      let encrypted = cipher.update(value, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Trả về IV + encrypted data
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('❌ Lỗi mã hóa:', error);
      return value; // Fallback về giá trị gốc
    }
  }

  // Giải mã giá trị
  decryptValue(encryptedValue) {
    if (!encryptedValue) return encryptedValue;
    try {
      // Kiểm tra xem có phải là format mới không (iv:encrypted)
      if (!encryptedValue.includes(':')) {
        // Format cũ hoặc không phải encrypted, trả về nguyên giá trị
        return encryptedValue;
      }

      const parts = encryptedValue.split(':');
      if (parts.length !== 2) {
        return encryptedValue; // Format không đúng, trả về nguyên giá trị
      }

      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encryptionKey.padEnd(32, '0').slice(0, 32)), iv);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('❌ Lỗi giải mã setting:', error);
      return encryptedValue; // Fallback về giá trị gốc
    }
  }

  // Lấy setting theo key
  async getSetting(key, defaultValue = null) {
    try {
      const setting = await SystemSettings.findOne({ where: { key } });
      if (!setting) return defaultValue;

      let value = setting.value;
      if (setting.isEncrypted) {
        value = this.decryptValue(value);
      }

      return value;
    } catch (error) {
      console.error('❌ Lỗi lấy setting:', error);
      return defaultValue;
    }
  }

  // Lấy nhiều settings theo category
  async getSettingsByCategory(category) {
    try {
      console.log(`🔍 Query settings từ database với category: ${category}`);

      const settings = await SystemSettings.findAll({
        where: { category },
        order: [['key', 'ASC']]
      });

      console.log(`📊 Tìm thấy ${settings.length} settings cho category "${category}":`,
        settings.map(s => ({
          key: s.key,
          value: s.isEncrypted ? '***ENCRYPTED***' : s.value,
          isEncrypted: s.isEncrypted,
          description: s.description
        }))
      );

      const result = {};
      settings.forEach(setting => {
        let value = setting.value;
        if (setting.isEncrypted) {
          console.log(`🔐 Giải mã setting: ${setting.key}`);
          value = this.decryptValue(value);
        }
        result[setting.key] = value;
      });

      console.log(`✅ Đã xử lý ${Object.keys(result).length} settings cho category "${category}"`);
      return result;
    } catch (error) {
      console.error('❌ Lỗi lấy settings theo category:', {
        category: category,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      return {};
    }
  }

  // Cập nhật setting
  async updateSetting(key, value, description = null, isEncrypted = false, updatedBy = null) {
    try {
      let finalValue = value;
      if (isEncrypted && value) {
        finalValue = this.encryptValue(value);
      }

      const [setting, created] = await SystemSettings.findOrCreate({
        where: { key },
        defaults: {
          value: finalValue,
          description,
          category: 'email',
          isEncrypted,
          updatedBy
        }
      });

      if (!created) {
        await setting.update({
          value: finalValue,
          description,
          isEncrypted,
          updatedBy
        });
      }

      console.log(`✅ Cập nhật setting: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ Lỗi cập nhật setting:', error);
      return false;
    }
  }



  // Lấy cấu hình email hoàn chỉnh
  async getEmailConfig() {
    try {
      console.log('🔍 Bắt đầu lấy cấu hình email từ database...');

      const emailSettings = await this.getSettingsByCategory('email');

      console.log('📊 Settings raw từ database:', {
        email_smtp_host: emailSettings.email_smtp_host || 'N/A',
        email_smtp_port: emailSettings.email_smtp_port || 'N/A',
        email_smtp_secure: emailSettings.email_smtp_secure || 'N/A',
        email_smtp_user: emailSettings.email_smtp_user || 'N/A',
        email_smtp_pass: emailSettings.email_smtp_pass ? '***MASKED***' : 'N/A',
        email_smtp_tls_reject_unauthorized: emailSettings.email_smtp_tls_reject_unauthorized || 'N/A',
        email_smtp_debug: emailSettings.email_smtp_debug || 'N/A',
        email_smtp_logger: emailSettings.email_smtp_logger || 'N/A',
        total_settings: Object.keys(emailSettings).length
      });

      const config = {
        smtp: {
          host: emailSettings.email_smtp_host || '10.0.160.29',
          port: parseInt(emailSettings.email_smtp_port) || 25,
          secure: emailSettings.email_smtp_secure === 'true',
          auth: {
            user: emailSettings.email_smtp_user || 'icbv\\dopt',
            pass: emailSettings.email_smtp_pass || 'Azuka@112'
          },
          tls: {
            rejectUnauthorized: emailSettings.email_smtp_tls_reject_unauthorized === 'true'
          },
          debug: emailSettings.email_smtp_debug === 'true',
          logger: emailSettings.email_smtp_logger === 'true'
        },
        options: {
          maxRetries: 3,
          retryDelay: 5000,
          timeout: 10000
        }
      };

      console.log('✅ Cấu hình email đã được xử lý:', {
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth_user: config.smtp.auth.user,
        auth_pass: config.smtp.auth.pass ? '***MASKED***' : 'N/A',
        tls_reject_unauthorized: config.smtp.tls.rejectUnauthorized,
        debug: config.smtp.debug,
        logger: config.smtp.logger,
        maxRetries: config.options.maxRetries,
        retryDelay: config.options.retryDelay,
        timeout: config.options.timeout
      });

      return config;
    } catch (error) {
      console.error('❌ Lỗi lấy cấu hình email:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      // Fallback config
      const fallbackConfig = {
        smtp: {
          host: '10.0.160.29',
          port: 25,
          secure: false,
          auth: {
            user: 'icbv\\dopt',
            pass: 'Azuka@112'
          },
          tls: {
            rejectUnauthorized: false
          },
          debug: true,
          logger: true
        },
        options: {
          maxRetries: 3,
          retryDelay: 5000,
          timeout: 10000
        }
      };

      console.log('⚠️ Sử dụng fallback config do lỗi:', {
        host: fallbackConfig.smtp.host,
        port: fallbackConfig.smtp.port,
        secure: fallbackConfig.smtp.secure,
        auth_user: fallbackConfig.smtp.auth.user,
        auth_pass: '***MASKED***'
      });

      return fallbackConfig;
    }
  }
}

export const settingsService = new SettingsService();
