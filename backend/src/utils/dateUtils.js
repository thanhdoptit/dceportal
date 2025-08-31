import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to UTC+7
dayjs.tz.setDefault('Asia/Bangkok');

/**
 * Convert a date to UTC+7 timezone
 * @param {Date|string} date - The date to convert
 * @returns {string} - Date string in UTC+7
 */
export const toUTC7 = (date) => {
  if (!date) return null;
  return dayjs(date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
};

/**
 * Get current date in UTC+7
 * @returns {string} - Current date string in UTC+7
 */
export const getCurrentDateUTC7 = () => {
  return dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD');
};

/**
 * Get current datetime in UTC+7
 * @returns {string} - Current datetime string in UTC+7
 */
export const getCurrentDateTimeUTC7 = () => {
  return dayjs().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
};

/**
 * Format a date to UTC+7 with custom format
 * @param {Date|string} date - The date to format
 * @param {string} format - The format string
 * @returns {string} - Formatted date string in UTC+7
 */
export const formatDateUTC7 = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return null;
  return dayjs(date).tz('Asia/Bangkok').format(format);
};

/**
 * Parse a date string to UTC+7
 * @param {string} dateStr - The date string to parse
 * @param {string} format - The format of the input date string
 * @returns {Date} - Date object in UTC+7
 */
export const parseDateUTC7 = (dateStr, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!dateStr) return null;
  return dayjs.tz(dateStr, format).toDate();
};

/**
 * Check if a date is within a range in UTC+7
 * @param {Date|string} date - The date to check
 * @param {Date|string} startDate - The start date
 * @param {Date|string} endDate - The end date
 * @returns {boolean} - True if date is within range
 */
export const isDateInRangeUTC7 = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return false;
  const checkDate = dayjs(date).tz('Asia/Bangkok');
  const start = dayjs(startDate).tz('Asia/Bangkok');
  const end = dayjs(endDate).tz('Asia/Bangkok');
  return checkDate.isAfter(start) && checkDate.isBefore(end);
}; 