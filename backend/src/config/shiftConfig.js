// Định nghĩa cấu hình các ca trực
import db from '../models/index.js';
const { Location } = db;

// Hàm lấy cấu hình ca từ database
const getShiftConfigFromDatabase = async () => {
  try {
    const locations = await Location.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']] // Sắp xếp theo ID để đảm bảo thứ tự
    });

    const config = {};
    
    locations.forEach(location => {
      const group = location.code;
      const maxShifts = location.index || 0;
      
      // Tạo các ca cho mỗi location dựa trên index
      for (let i = 1; i <= maxShifts; i++) {
        const shiftCode = `${group}${i}`;
        
        // Định nghĩa thời gian cho từng ca
        let startTime, endTime;
        switch (i) {
          case 1:
            startTime = '06:00:00';
            endTime = '14:00:00';
            break;
          case 2:
            startTime = '14:00:00';
            endTime = '22:00:00';
            break;
          case 3:
            startTime = '22:00:00';
            endTime = '06:00:00';
            break;
          default:
            startTime = '00:00:00';
            endTime = '08:00:00';
        }
        
        config[shiftCode] = {
          name: location.name,
          startTime,
          endTime,
          group,
          index: i
        };
      }
    });
    
    return config;
  } catch (error) {
    console.error('❌ Lỗi khi lấy cấu hình ca từ database:', error);
    throw error; // Ném lỗi thay vì trả về fallback
  }
};

// Khởi tạo shiftConfig rỗng
let shiftConfig = {};

// Hàm cập nhật shiftConfig từ database
export const updateShiftConfigFromDatabase = async () => {
  try {
    const newConfig = await getShiftConfigFromDatabase();
    shiftConfig = newConfig;
    console.log('✅ Đã cập nhật shiftConfig từ database:', Object.keys(shiftConfig));
    return newConfig;
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật shiftConfig:', error);
    return shiftConfig;
  }
};

// Export shiftConfig và FIXED_SHIFTS để giữ nguyên interface
export { shiftConfig };

// Danh sách mã ca cố định - sẽ được cập nhật động
export let FIXED_SHIFTS = Object.keys(shiftConfig);

// Hàm cập nhật FIXED_SHIFTS
export const updateFixedShifts = () => {
  FIXED_SHIFTS = Object.keys(shiftConfig);
  return FIXED_SHIFTS;
};

// Khởi tạo cấu hình từ database khi module được load
updateShiftConfigFromDatabase().then(() => {
  updateFixedShifts();
  console.log('🚀 Đã khởi tạo shiftConfig từ database');
}).catch(error => {
  console.error('❌ Lỗi khởi tạo shiftConfig:', error);
  console.error('💡 Vui lòng kiểm tra database và đảm bảo có dữ liệu locations');
}); 