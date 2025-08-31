/**
 * 🔒 Security Utilities cho Frontend
 * Các hàm bảo mật và validation
 */

import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';

/**
 * Sanitize HTML content để tránh XSS
 * @param {string} content - Nội dung HTML cần sanitize
 * @returns {string} - Nội dung đã được sanitize
 */
export const sanitizeHTML = (content) => {
  if (!content || typeof content !== 'string') return '';
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['class', 'style']
  });
};

/**
 * Encrypt sensitive data
 * @param {string} data - Dữ liệu cần encrypt
 * @returns {string} - Dữ liệu đã encrypt
 */
export const encryptData = (data) => {
  if (!data) return '';
  const key = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key';
  return CryptoJS.AES.encrypt(data, key).toString();
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedData - Dữ liệu đã encrypt
 * @returns {string} - Dữ liệu gốc
 */
export const decryptData = (encryptedData) => {
  if (!encryptedData) return '';
  try {
    const key = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key';
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decrypt error:', error);
    return '';
  }
};

/**
 * Secure token storage
 * @param {string} token - JWT token
 */
export const secureStoreToken = (token) => {
  if (!token) return;
  const encryptedToken = encryptData(token);
  localStorage.setItem('encrypted_token', encryptedToken);
};

/**
 * Secure token retrieval
 * @returns {string} - JWT token
 */
export const secureGetToken = () => {
  const encryptedToken = localStorage.getItem('encrypted_token');
  if (!encryptedToken) return null;
  return decryptData(encryptedToken);
};

/**
 * Secure token removal
 */
export const secureRemoveToken = () => {
  localStorage.removeItem('encrypted_token');
};

/**
 * Validate input data
 * @param {Object} data - Dữ liệu cần validate
 * @param {Object} schema - Schema validation
 * @returns {Object} - Kết quả validation
 */
export const validateInput = (data, schema) => {
  try {
    const validated = schema.validateSync(data, { abortEarly: false });
    return { isValid: true, data: validated, errors: [] };
  } catch (error) {
    return { isValid: false, data: null, errors: error.errors };
  }
};

/**
 * Sanitize object để log an toàn
 * @param {Object} obj - Object cần sanitize
 * @param {Array} sensitiveKeys - Keys nhạy cảm
 */
export const sanitizeForLogging = (obj, sensitiveKeys = ['password', 'token', 'secret']) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = { ...obj };
  sensitiveKeys.forEach(key => {
    if (sanitized[key]) {
      sanitized[key] = '[REDACTED]';
    }
  });
  return sanitized;
};

/**
 * Secure console logging
 * @param {string} message - Message
 * @param {any} data - Data cần log
 * @param {Array} sensitiveKeys - Keys nhạy cảm
 */
export const secureLog = (message, data, sensitiveKeys = ['password', 'token', 'secret']) => {
  if (import.meta.env.PROD) {
    console.log(message, sanitizeForLogging(data, sensitiveKeys));
  } else {
    console.log(message, data);
  }
};

/**
 * Generate CSRF token
 * @returns {string} - CSRF token
 */
export const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Validate file upload
 * @param {File} file - File cần validate
 * @param {Array} allowedTypes - Loại file được phép
 * @param {number} maxSize - Kích thước tối đa (MB)
 * @returns {Object} - Kết quả validation
 */
export const validateFileUpload = (file, allowedTypes = [], maxSize = 10) => {
  const errors = [];
  
  // Kiểm tra kích thước
  if (file.size > maxSize * 1024 * 1024) {
    errors.push(`File không được vượt quá ${maxSize}MB`);
  }
  
  // Kiểm tra loại file
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push('Loại file không được hỗ trợ');
  }
  
  // Kiểm tra tên file
  const fileName = file.name.toLowerCase();
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    errors.push('File không được phép upload');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Clear sensitive data khi logout
 */
export const clearAllSensitiveData = async () => {
  // Clear localStorage (giữ lại một số config)
  const keysToKeep = ['theme', 'language'];
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  // Clear browser cache
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    } catch (error) {
      console.warn('Failed to clear browser cache:', error);
    }
  }
  
  // Clear service workers
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
    } catch (error) {
      console.warn('Failed to clear service workers:', error);
    }
  }
  
  console.log('✅ All sensitive data cleared successfully');
};
