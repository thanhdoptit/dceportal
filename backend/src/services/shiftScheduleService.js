import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Biến toàn cục lưu dữ liệu lịch trực
let globalShiftScheduleData = [];

// Đường dẫn đến file Excel
const getExcelFilePath = () => {
  return path.join(__dirname, '../../../frontend/public/shiftlist/docs/shift_schedule_data.xlsx');
};

// Đọc dữ liệu từ file Excel
export const loadShiftScheduleFromExcel = () => {
  try {
    const filePath = getExcelFilePath();
    console.log('Đang đọc file Excel từ:', filePath);
    
    // Đọc file Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Chuyển đổi thành JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('Raw Excel data rows:', jsonData.length);
    console.log('First few rows:', jsonData.slice(0, 3));
    
    // Bỏ qua hàng header và lọc dòng trống
    const dataRows = jsonData.slice(1).filter(row => {
      // Bỏ qua dòng trống hoặc dòng chỉ có header
      return row && row.length > 0 && row[0] && row[0].toString().trim() !== '' && 
             !row[0].toString().toLowerCase().includes('stt') &&
             !row[0].toString().toLowerCase().includes('tuần');
    });
    console.log('Filtered data rows:', dataRows.length);
    
    // Chuyển đổi dữ liệu thành format mong muốn
    const processedData = dataRows.map((row, index) => {
      if (!row[0] || row[0].toString().trim() === '') return null; // Bỏ qua hàng trống
      
              return {
          id: index + 1,
          stt: row[0] || index + 1,
          hoDem: row[1] || '',
          ten: row[2] || '',
          adName: row[3] || '',
          mobile: row[4] || '',
          week1: {
            '2': row[5] || '',
            '3': row[6] || '',
            '4': row[7] || '',
            '5': row[8] || '',
            '6': row[9] || '',
            '7': row[10] || '',
            'CN': row[11] || ''
          },
          week2: {
            '2': row[12] || '',
            '3': row[13] || '',
            '4': row[14] || '',
            '5': row[15] || '',
            '6': row[16] || '',
            '7': row[17] || '',
            'CN': row[18] || ''
          },
          week3: {
            '2': row[19] || '',
            '3': row[20] || '',
            '4': row[21] || '',
            '5': row[22] || '',
            '6': row[23] || '',
            '7': row[24] || '',
            'CN': row[25] || ''
          },
          week4: {
            '2': row[26] || '',
            '3': row[27] || '',
            '4': row[28] || '',
            '5': row[29] || '',
            '6': row[30] || '',
            '7': row[31] || '',
            'CN': row[32] || ''
          }
        };
    }).filter(item => item !== null); // Lọc bỏ các item null
    
    globalShiftScheduleData = processedData;
    console.log(`Đã tải ${processedData.length} bản ghi lịch trực từ file Excel`);
    
    return {
      success: true,
      count: processedData.length,
      message: `Đã cập nhật lịch trực`
    };
    
  } catch (error) {
    console.error('Lỗi khi đọc file Excel:', error);
    return {
      success: false,
      error: error.message,
      message: 'Không thể đọc file Excel lịch trực'
    };
  }
};

// Lấy dữ liệu lịch trực từ biến toàn cục
export const getShiftScheduleData = () => {
  return globalShiftScheduleData;
};

// Reload dữ liệu từ file Excel
export const reloadShiftScheduleData = () => {
  return loadShiftScheduleFromExcel();
};

// Khởi tạo dữ liệu khi server start
export const initializeShiftSchedule = () => {
  console.log('Khởi tạo dữ liệu lịch trực từ file Excel...');
  const result = loadShiftScheduleFromExcel();
  
  if (result.success) {
    console.log('✅ Khởi tạo dữ liệu lịch trực thành công');
  } else {
    console.log('❌ Khởi tạo dữ liệu lịch trực thất bại:', result.message);
  }
  
  return result;
}; 