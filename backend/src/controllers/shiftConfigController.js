import { shiftConfig, FIXED_SHIFTS, updateShiftConfigFromDatabase, updateFixedShifts } from '../config/shiftConfig.js';

// Lấy cấu hình ca hiện tại
export const getShiftConfig = async (req, res) => {
  try {
    // Kiểm tra xem có dữ liệu không
    if (Object.keys(shiftConfig).length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chưa có cấu hình ca. Vui lòng thêm địa điểm và cấu hình số ca trong Settings.',
        data: {
          shiftConfig: {},
          fixedShifts: [],
          totalShifts: 0
        }
      });
    }

    res.json({
      success: true,
      data: {
        shiftConfig,
        fixedShifts: FIXED_SHIFTS,
        totalShifts: Object.keys(shiftConfig).length
      }
    });
  } catch (error) {
    console.error('❌ Error in getShiftConfig:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cấu hình ca',
      error: error.message
    });
  }
};

// Cập nhật cấu hình ca từ database
export const refreshShiftConfig = async (req, res) => {
  try {
    const newConfig = await updateShiftConfigFromDatabase();
    updateFixedShifts();
    
    res.json({
      success: true,
      data: {
        shiftConfig: newConfig,
        fixedShifts: FIXED_SHIFTS,
        totalShifts: Object.keys(newConfig).length,
        message: 'Đã cập nhật cấu hình ca từ database'
      }
    });
  } catch (error) {
    console.error('❌ Error in refreshShiftConfig:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật cấu hình ca',
      error: error.message
    });
  }
}; 