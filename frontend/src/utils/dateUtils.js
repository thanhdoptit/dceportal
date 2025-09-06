import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

// Định nghĩa các format chuẩn
export const DATE_FORMATS = {
  // Format chuẩn cho ngày tháng
  DATE: 'dd/MM/yyyy',
  // Format chuẩn cho thời gian
  TIME: 'HH:mm',
  // Format chuẩn cho ngày giờ đầy đủ
  DATE_TIME: 'HH:mm dd/MM/yyyy',
  // Format cho ngày giờ chi tiết (có giây)
  DATE_TIME_SECONDS: 'HH:mm:ss dd/MM/yyyy',
  // Format cho hiển thị relative time (vd: 2 giờ trước)
  RELATIVE: 'PPP',
  // Format cho input type="datetime-local"
  INPUT_DATE_TIME: "yyyy-MM-dd'T'HH:mm",
};

/**
 * Format date string to display format
 * @param {string|Date} date - Date object hoặc ISO string
 * @param {string} formatStr - Format string từ DATE_FORMATS
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DATE) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: vi });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format time string (HH:mm)
 * @param {string} timeStr - Time string in HH:mm format
 * @returns {string} Formatted time string
 */
export const formatTime = timeStr => {
  if (!timeStr) return '';
  try {
    if (timeStr.includes(':')) {
      return timeStr;
    }
    return format(parseISO(timeStr), DATE_FORMATS.TIME);
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeStr;
  }
};

/**
 * Format date time string
 * @param {string|Date} datetime - Date object hoặc ISO string
 * @returns {string} Formatted date time string
 */
export const formatDateTime = datetime => {
  return formatDate(datetime, DATE_FORMATS.DATE_TIME);
};

/**
 * Format date for input type="datetime-local"
 * @param {string|Date} date - Date object hoặc ISO string
 * @returns {string} Formatted date string for input
 */
export const formatDateForInput = date => {
  return formatDate(date, DATE_FORMATS.INPUT_DATE_TIME);
};

/**
 * Kiểm tra xem một string có phải là date hợp lệ không
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if valid date
 */
export const isValidDate = dateStr => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
};

/**
 * So sánh 2 ngày
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export const compareDates = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1 < d2 ? -1 : d1 > d2 ? 1 : 0;
};
