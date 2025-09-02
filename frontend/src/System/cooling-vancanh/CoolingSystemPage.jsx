import React, { useState } from 'react';
import { 
  BookOutlined, 
  SettingOutlined, 
  InfoCircleOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  PhoneOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  CloudOutlined
} from '@ant-design/icons';
import { SystemLayout } from '../shared';
import CoolingContent from './CoolingContent';

const CoolingSystemPage = () => {
  const [selectedKey, setSelectedKey] = useState('1');

  // Cấu trúc menu cập nhật dựa trên tài liệu thực tế TTDL Vân Canh
  const menuItems = [
    {
      key: '1',
      icon: <InfoCircleOutlined />,
      label: '1. GIỚI THIỆU CHUNG',
      children: [
        {
          key: '1.1',
          label: '1.1. Thông số kỹ thuật hệ thống',
        },
        {
          key: '1.2',
          label: '1.2. Cấu trúc và nguyên lý hoạt động',
        },
        {
          key: '1.3',
          label: '1.3. Các chế độ vận hành chính',
        },
        {
          key: '1.4',
          label: '1.4. Hệ thống điều khiển BMS',
        },
        {
          key: '1.5',
          label: '1.5. Thông tin bổ sung',
        },
      ],
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: '2. HỆ THỐNG CHILLER & PAC',
      children: [
        {
          key: '2.1',
          label: '2.1. Chiller SMARDT AE Series',
          children: [
            { key: '2.1.1', label: '2.1.1. Thông tin chung' },
            { key: '2.1.2', label: '2.1.2. Chế độ Commissioning (Khởi tạo)' },
            { key: '2.1.3', label: '2.1.3. Chế độ Bình thường (Normal Mode)' },
            { key: '2.1.4', label: '2.1.4. Chế độ Xả (Discharge Mode)' },
            { key: '2.1.5', label: '2.1.5. Quy trình và chu kỳ bảo trì' },
          ],
        },
        {
          key: '2.2',
          label: '2.2. PAC UNIFLAIR SDCV Series',
          children: [
            { key: '2.2.1', label: '2.2.1. Thông tin chung' },
            { key: '2.2.2', label: '2.2.2. Hướng dẫn lắp đặt' },
            { key: '2.2.3', label: '2.2.3. Hướng dẫn vận hành và kiểm tra hàng ngày' },
            { key: '2.2.4', label: '2.2.4. Thông số cần kiểm tra' },
            { key: '2.2.5', label: '2.2.5. Bảo trì định kỳ' },
          ],
        },
        {
          key: '2.3',
          label: '2.3. PAC UNIFLAIR LDCV Series',
          children: [
            { key: '2.3.1', label: '2.3.1. Thông tin chung' },
            { key: '2.3.2', label: '2.3.2. Hướng dẫn lắp đặt' },
            { key: '2.3.3', label: '2.3.3. Hướng dẫn vận hành và kiểm tra hàng ngày' },
            { key: '2.3.4', label: '2.3.4. Thông số cần kiểm tra' },
            { key: '2.3.5', label: '2.3.5. Bảo trì định kỳ' },
          ],
        },
        {
          key: '2.4',
          label: '2.4. Easy InRow CW Series',
          children: [
            { key: '2.4.1', label: '2.4.1. Thông tin chung' },
            { key: '2.4.2', label: '2.4.2. Hướng dẫn lắp đặt' },
            { key: '2.4.3', label: '2.4.3. Hướng dẫn vận hành và kiểm tra hàng ngày' },
            { key: '2.4.4', label: '2.4.4. Thông số cần kiểm tra' },
            { key: '2.4.5', label: '2.4.5. Bảo trì định kỳ' },
            { key: '2.4.6', label: '2.4.6. Xử lý sự cố' },
          ],
        },
        {
          key: '2.5',
          label: '2.5. Hệ thống BMS Chiller',
          children: [
            { key: '2.5.1', label: '2.5.1. Thông tin chung' },
            { key: '2.5.2', label: '2.5.2. Các chế độ vận hành' },
            { key: '2.5.3', label: '2.5.3. Cấu trúc hệ thống' },
            { key: '2.5.4', label: '2.5.4. Hướng dẫn vận hành và kiểm tra hàng ngày' },
            { key: '2.5.5', label: '2.5.5. Thông số cần kiểm tra' },
            { key: '2.5.6', label: '2.5.6. Bảo trì định kỳ' },
          ],
        },
        {
          key: '2.6',
          label: '2.6. Hệ thống bơm nước & thiết bị phụ trợ',
        },
      ],
    },
    {
      key: '3',
      icon: <ThunderboltOutlined />,
      label: '3. HỆ THỐNG BƠM & THIẾT BỊ PHỤ TRỢ',
      children: [
        {
          key: '3.1',
          label: '3.1. Hệ thống bơm nước lạnh',
          children: [
            { key: '3.1.1', label: '3.1.1. Bơm PCH-01, PCH-02, PCH-03' },
            { key: '3.1.2', label: '3.1.2. Điều khiển VFD và chênh áp' },
            { key: '3.1.3', label: '3.1.3. Quy trình Testing & Commissioning' },
            { key: '3.1.4', label: '3.1.4. Bảng dữ liệu vận hành' },
          ],
        },
        {
          key: '3.2',
          label: '3.2. Thiết bị phụ trợ hệ nước',
          children: [
            { key: '3.2.1', label: '3.2.1. Van cổng, van xả, van PICV' },
            { key: '3.2.2', label: '3.2.2. Lọc Y, khớp nối mềm' },
            { key: '3.2.3', label: '3.2.3. Đồng hồ áp suất, nhiệt độ' },
            { key: '3.2.4', label: '3.2.4. Van tách khí, van cân bằng' },
          ],
        },
        {
          key: '3.3',
          label: '3.3. Hệ thống TES (Thermal Energy Storage)',
          children: [
            { key: '3.3.1', label: '3.3.1. Bình dự trữ nước lạnh' },
            { key: '3.3.2', label: '3.3.2. Chế độ Charging & Discharge' },
            { key: '3.3.3', label: '3.3.3. Điều khiển van V1A, V1B, V2A, V2B, V3A, V3B' },
            { key: '3.3.4', label: '3.3.4. Thời gian dự phòng khẩn cấp' },
          ],
        },
      ],
    },
    {
      key: '4',
      icon: <EnvironmentOutlined />,
      label: '4. VỊ TRÍ & BỐ TRÍ HỆ THỐNG',
      children: [
        { key: '4.1', label: '4.1. Sơ đồ tổng thể hệ thống' },
        { key: '4.2', label: '4.2. Bố trí thiết bị theo tầng' },
        { key: '4.3', label: '4.3. Hệ thống đường ống và phân phối' },
        { key: '4.4', label: '4.4. Hệ thống thông gió và hút khói' },
      ],
    },
    {
      key: '5',
      icon: <AppstoreOutlined />,
      label: '5. QUY TRÌNH VẬN HÀNH',
      style: {
        fontWeight: 'bold',
      },
      children: [
        { key: '5.1', label: '5.1. Quy trình khởi động hệ thống' },
        { key: '5.2', label: '5.2. Vận hành chế độ Normal' },
        { key: '5.3', label: '5.3. Quy trình gọi thêm, cắt bớt cụm Chiller' },
        { key: '5.4', label: '5.4. Quy trình vận hành luân phiên hệ thống' },
        { key: '5.5', label: '5.5. Xử lý sự cố và chế độ khẩn cấp' },
        { key: '5.6', label: '5.6. Các chế độ vận hành' },
        { key: '5.7', label: '5.7. Thông tin bổ sung' },
      ],
    },
    {
      key: '6',
      icon: <SafetyOutlined />,
      label: '6. AN TOÀN & BẢO TRÌ',
      children: [
        { key: '6.1', label: '6.1. Biện pháp an toàn vận hành' },
        { key: '6.2', label: '6.2. Quy trình bảo trì thiết bị' },
        { key: '6.3', label: '6.3. Xử lý mã lỗi và sự cố' },
        { key: '6.4', label: '6.4. Kiểm tra và kiểm định' },
        { key: '6.5', label: '6.5. Thông tin bổ sung' },
      ],
    },
    {
      key: '7',
      icon: <FileTextOutlined />,
      label: '7. TÀI LIỆU & THAM KHẢO',
    },
    {
      key: '8',
      icon: <PhoneOutlined />,
      label: '8. LIÊN HỆ & HỖ TRỢ',
      style: {
        fontWeight: 'bold',
      },
      children: [
        { key: '8.1', label: '8.1. Thông tin liên hệ' },
        { key: '8.2', label: '8.2. Hỗ trợ kỹ thuật' },
        { key: '8.3', label: '8.3. Báo cáo sự cố' },
      ],
    },
  ];

  return (
    <SystemLayout
      menuItems={menuItems}
      title="Hệ thống làm mát TTDL Vân Canh"
      headerBgColor="#1890ff"
      selectedKey={selectedKey}
    >
      <CoolingContent />
    </SystemLayout>
  );
};

export default CoolingSystemPage;
