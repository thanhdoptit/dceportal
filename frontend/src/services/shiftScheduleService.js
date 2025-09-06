import api from './api.js';

// Lấy dữ liệu lịch trực từ server
export const getShiftSchedule = async () => {
  try {
    const response = await api.get('/api/shift-schedule/schedule');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu lịch trực:', error);
    throw error;
  }
};

// Reload dữ liệu lịch trực từ file Excel
export const reloadShiftSchedule = async () => {
  try {
    const response = await api.post('/api/shift-schedule/reload');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi reload dữ liệu lịch trực:', error);
    throw error;
  }
};

// Lấy thông tin trạng thái dữ liệu lịch trực
export const getShiftScheduleStatus = async () => {
  try {
    const response = await api.get('/api/shift-schedule/status');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin trạng thái lịch trực:', error);
    throw error;
  }
};
