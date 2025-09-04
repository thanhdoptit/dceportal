import {
  BulbOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  SafetyOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  ToolOutlined
} from '@ant-design/icons';
import React from 'react';
import { SystemLayout, createLeafMenuItem, createMenuItem, createSubMenuItem } from '../shared';
import ElectricContent from './ElectricContent';
// Import CSS từ shared
import '../shared/styles/SystemLayout.css';
import '../shared/styles/SystemSection.css';
import '../shared/styles/SystemTemplate.css';

const ElectricSystemPage = () => {

  // Cấu trúc menu hệ thống điện dựa trên tài liệu đã xử lý
  const menuItems = [
    createMenuItem(
      '1',
      <InfoCircleOutlined />,
      '1. GIỚI THIỆU CHUNG',
      [
        createLeafMenuItem('1.1', '1.1. Sơ đồ đơn tuyến hệ thống điện'),
        createLeafMenuItem('1.2', '1.2. Cấu trúc tổng quan hệ thống'),
        createLeafMenuItem('1.3', '1.3. Thông số kỹ thuật chung'),
        createLeafMenuItem('1.4', '1.4. Tiêu chuẩn và quy định'),
      ]
    ),
    createMenuItem(
      '2',
      <ThunderboltOutlined />,
      '2. TỦ ĐIỆN HẠ THẾ',
      [
        createSubMenuItem(
          '2.1',
          '2.1. Tủ điện ACIT',
          [
            createLeafMenuItem('2.1.1', '2.1.1. Đặc điểm kỹ thuật'),
            createLeafMenuItem('2.1.2', '2.1.2. Cấu trúc và bố trí'),
            createLeafMenuItem('2.1.3', '2.1.3. Thiết bị bảo vệ'),
          ]
        ),
        createSubMenuItem(
          '2.2',
          '2.2. Tủ Blokset',
          [
            createLeafMenuItem('2.2.1', '2.2.1. Thông số kỹ thuật'),
            createLeafMenuItem('2.2.2', '2.2.2. Cấu hình và lắp đặt'),
            createLeafMenuItem('2.2.3', '2.2.3. Vận hành và bảo trì'),
          ]
        ),
        createSubMenuItem(
          '2.3',
          '2.3. Máy cắt ACB MTZ2 Schneider',
          [
            createLeafMenuItem('2.3.1', '2.3.1. Đặc điểm kỹ thuật'),
            createLeafMenuItem('2.3.2', '2.3.2. Cài đặt bảo vệ'),
            createLeafMenuItem('2.3.3', '2.3.3. Vận hành và kiểm tra'),
          ]
        ),
        createSubMenuItem(
          '2.4',
          '2.4. MCCB Schneider',
          [
            createLeafMenuItem('2.4.1', '2.4.1. Thông số kỹ thuật'),
            createLeafMenuItem('2.4.2', '2.4.2. Cài đặt và bảo vệ'),
            createLeafMenuItem('2.4.3', '2.4.3. Kiểm tra định kỳ'),
          ]
        ),
        createSubMenuItem(
          '2.5',
          '2.5. MCB Schneider',
          [
            createLeafMenuItem('2.5.1', '2.5.1. Đặc điểm kỹ thuật'),
            createLeafMenuItem('2.5.2', '2.5.2. Lắp đặt và kết nối'),
            createLeafMenuItem('2.5.3', '2.5.3. Bảo trì và thay thế'),
          ]
        ),
        createSubMenuItem(
          '2.6',
          '2.6. RCBO & RCCB ABB',
          [
            createLeafMenuItem('2.6.1', '2.6.1. Thông số kỹ thuật'),
            createLeafMenuItem('2.6.2', '2.6.2. Cài đặt bảo vệ'),
            createLeafMenuItem('2.6.3', '2.6.3. Kiểm tra và thử nghiệm'),
          ]
        ),
      ]
    ),
    createMenuItem(
      '3',
      <SafetyOutlined />,
      '3. HỆ THỐNG BẢO VỆ',
      [
        createSubMenuItem(
          '3.1',
          '3.1. Bảo vệ quá dòng',
          [
            createLeafMenuItem('3.1.1', '3.1.1. Cài đặt bảo vệ'),
            createLeafMenuItem('3.1.2', '3.1.2. Kiểm tra và thử nghiệm'),
            createLeafMenuItem('3.1.3', '3.1.3. Xử lý sự cố'),
          ]
        ),
        createSubMenuItem(
          '3.2',
          '3.2. Bảo vệ chạm đất',
          [
            createLeafMenuItem('3.2.1', '3.2.1. Cài đặt RCD'),
            createLeafMenuItem('3.2.2', '3.2.2. Kiểm tra độ nhạy'),
            createLeafMenuItem('3.2.3', '3.2.3. Bảo trì định kỳ'),
          ]
        ),
        createSubMenuItem(
          '3.3',
          '3.3. Bảo vệ ngắn mạch',
          [
            createLeafMenuItem('3.3.1', '3.3.1. Tính toán dòng ngắn mạch'),
            createLeafMenuItem('3.3.2', '3.3.2. Cài đặt bảo vệ'),
            createLeafMenuItem('3.3.3', '3.3.3. Kiểm tra và thử nghiệm'),
          ]
        ),
      ]
    ),
    createMenuItem(
      '4',
      <SettingOutlined />,
      '4. HỆ THỐNG ĐIỀU KHIỂN',
      [
        createSubMenuItem(
          '4.1',
          '4.1. PLC điều khiển',
          [
            createLeafMenuItem('4.1.1', '4.1.1. Cấu hình PLC'),
            createLeafMenuItem('4.1.2', '4.1.2. Lập trình logic'),
            createLeafMenuItem('4.1.3', '4.1.3. Giám sát và điều khiển'),
          ]
        ),
        createSubMenuItem(
          '4.2',
          '4.2. Hệ thống ATS',
          [
            createLeafMenuItem('4.2.1', '4.2.1. Cấu hình ATS'),
            createLeafMenuItem('4.2.2', '4.2.2. Vận hành tự động'),
            createLeafMenuItem('4.2.3', '4.2.3. Bảo trì và kiểm tra'),
          ]
        ),
        createSubMenuItem(
          '4.3',
          '4.3. Điều khiển máy phát',
          [
            createLeafMenuItem('4.3.1', '4.3.1. Cài đặt điều khiển'),
            createLeafMenuItem('4.3.2', '4.3.2. Khởi động tự động'),
            createLeafMenuItem('4.3.3', '4.3.3. Giám sát trạng thái'),
          ]
        ),
      ]
    ),
    createMenuItem(
      '5',
      <BulbOutlined />,
      '5. HỆ THỐNG CHIẾU SÁNG',
      [
        createSubMenuItem(
          '5.1',
          '5.1. Chiếu sáng chung',
          [
            createLeafMenuItem('5.1.1', '5.1.1. Bố trí đèn chiếu sáng'),
            createLeafMenuItem('5.1.2', '5.1.2. Điều khiển và điều chỉnh'),
            createLeafMenuItem('5.1.3', '5.1.3. Bảo trì và thay thế'),
          ]
        ),
        createSubMenuItem(
          '5.2',
          '5.2. Chiếu sáng khẩn cấp',
          [
            createLeafMenuItem('5.2.1', '5.2.1. Đèn Exit và Emergency'),
            createLeafMenuItem('5.2.2', '5.2.2. Nguồn dự phòng'),
            createLeafMenuItem('5.2.3', '5.2.3. Kiểm tra định kỳ'),
          ]
        ),
        createSubMenuItem(
          '5.3',
          '5.3. Hệ thống ổ cắm',
          [
            createLeafMenuItem('5.3.1', '5.3.1. Bố trí ổ cắm'),
            createLeafMenuItem('5.3.2', '5.3.2. Bảo vệ và an toàn'),
            createLeafMenuItem('5.3.3', '5.3.3. Kiểm tra và bảo trì'),
          ]
        ),
      ]
    ),
    createMenuItem(
      '6',
      <ToolOutlined />,
      '6. HỆ THỐNG CÁP VÀ MÁNG',
      [
        createSubMenuItem(
          '6.1',
          '6.1. Thang máng cáp',
          [
            createLeafMenuItem('6.1.1', '6.1.1. Bố trí thang máng'),
            createLeafMenuItem('6.1.2', '6.1.2. Kích thước và tải trọng'),
            createLeafMenuItem('6.1.3', '6.1.3. Lắp đặt và kết nối'),
          ]
        ),
        createSubMenuItem(
          '6.2',
          '6.2. Cáp điện lực',
          [
            createLeafMenuItem('6.2.1', '6.2.1. Chọn cáp theo tải'),
            createLeafMenuItem('6.2.2', '6.2.2. Lắp đặt và bảo vệ'),
            createLeafMenuItem('6.2.3', '6.2.3. Kiểm tra và bảo trì'),
          ]
        ),
        createSubMenuItem(
          '6.3',
          '6.3. Cáp điều khiển',
          [
            createLeafMenuItem('6.3.1', '6.3.1. Chọn cáp điều khiển'),
            createLeafMenuItem('6.3.2', '6.3.2. Lắp đặt và bảo vệ'),
            createLeafMenuItem('6.3.3', '6.3.3. Kiểm tra và thử nghiệm'),
          ]
        ),
      ]
    ),
    createMenuItem(
      '7',
      <FileTextOutlined />,
      '7. VẬN HÀNH VÀ BẢO TRÌ',
      [
        createSubMenuItem(
          '7.1',
          '7.1. Quy trình vận hành',
          [
            createLeafMenuItem('7.1.1', '7.1.1. Khởi động hệ thống'),
            createLeafMenuItem('7.1.2', '7.1.2. Vận hành bình thường'),
            createLeafMenuItem('7.1.3', '7.1.3. Xử lý sự cố'),
          ]
        ),
        createSubMenuItem(
          '7.2',
          '7.2. Kiểm tra hệ thống dự phòng',
          [
            createLeafMenuItem('7.2.1', '7.2.1. Quy trình kiểm tra'),
            createLeafMenuItem('7.2.2', '7.2.2. Test máy phát'),
            createLeafMenuItem('7.2.3', '7.2.3. Ghi nhận kết quả'),
          ]
        ),
        createSubMenuItem(
          '7.3',
          '7.3. Bảo trì định kỳ',
          [
            createLeafMenuItem('7.3.1', '7.3.1. Lịch bảo trì'),
            createLeafMenuItem('7.3.2', '7.3.2. Nội dung bảo trì'),
            createLeafMenuItem('7.3.3', '7.3.3. Báo cáo và ghi nhận'),
          ]
        ),
      ]
    ),
    createMenuItem(
      '8',
      <InfoCircleOutlined />,
      '8. TÀI LIỆU VÀ TIÊU CHUẨN',
      [
        createSubMenuItem(
          '8.1',
          '8.1. Tiêu chuẩn Việt Nam',
          [
            createLeafMenuItem('8.1.1', '8.1.1. TCVN 5935-1:2013'),
            createLeafMenuItem('8.1.2', '8.1.2. TCVN 6483:1999'),
            createLeafMenuItem('8.1.3', '8.1.3. QCVN 4:2009'),
          ]
        ),
        createSubMenuItem(
          '8.2',
          '8.2. Tiêu chuẩn quốc tế',
          [
            createLeafMenuItem('8.2.1', '8.2.1. IEC 60502-1'),
            createLeafMenuItem('8.2.2', '8.2.2. BS 6387'),
            createLeafMenuItem('8.2.3', '8.2.3. AS/NZS 5000.1'),
          ]
        ),
        createSubMenuItem(
          '8.3',
          '8.3. Chứng nhận sản phẩm',
          [
            createLeafMenuItem('8.3.1', '8.3.1. ISO 9001'),
            createLeafMenuItem('8.3.2', '8.3.2. Chứng nhận ACIT'),
            createLeafMenuItem('8.3.3', '8.3.3. Test certificate'),
          ]
        ),
      ]
    ),
  ];

  return (
    <SystemLayout
      title="HỆ THỐNG PHÂN PHỐI ĐIỆN VÂN CANH"
      menuItems={menuItems}
      headerBgColor="#1890ff"
      defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7', '8']}
      selectedKey="1"
    >
      <ElectricContent />
    </SystemLayout>
  );
};

export default ElectricSystemPage;
