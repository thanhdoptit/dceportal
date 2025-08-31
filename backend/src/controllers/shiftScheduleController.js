import { getShiftScheduleData, reloadShiftScheduleData } from '../services/shiftScheduleService.js';

// Lấy dữ liệu lịch trực
export const getShiftSchedule = async (req, res) => {
  try {
    const scheduleData = getShiftScheduleData();
    
    res.status(200).json({
      success: true,
      data: scheduleData,
      count: scheduleData.length,
      message: 'Lấy dữ liệu lịch trực thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu lịch trực:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Lỗi khi lấy dữ liệu lịch trực'
    });
  }
};

// Reload dữ liệu lịch trực từ file Excel
export const reloadShiftSchedule = async (req, res) => {
  try {
    const result = reloadShiftScheduleData();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        count: result.count
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Lỗi khi reload dữ liệu lịch trực:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Lỗi khi reload dữ liệu lịch trực'
    });
  }
};

// Lấy thông tin trạng thái dữ liệu lịch trực
export const getShiftScheduleStatus = async (req, res) => {
  try {
    const scheduleData = getShiftScheduleData();
    
    res.status(200).json({
      success: true,
      data: {
        totalRecords: scheduleData.length,
        lastUpdated: new Date().toISOString(),
        hasData: scheduleData.length > 0
      },
      message: 'Lấy thông tin trạng thái lịch trực thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin trạng thái lịch trực:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Lỗi khi lấy thông tin trạng thái lịch trực'
    });
  }
}; 