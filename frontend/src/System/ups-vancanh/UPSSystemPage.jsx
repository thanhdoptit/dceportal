import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  MonitorOutlined,
  PoweroffOutlined,
  ThunderboltOutlined,
  ToolOutlined
} from '@ant-design/icons';
import React from 'react';
import { SystemLayout, createLeafMenuItem, createMenuItem, createSubMenuItem } from '../shared';
import UPSContent from './UPSContent';

const UPSSystemPage = () => {

  // Cấu trúc menu UPS dựa trên tài liệu đã xử lý - Sử dụng menu utils
  const menuItems = [
    createMenuItem(
      '1',
      <InfoCircleOutlined />,
      '1. GIỚI THIỆU CHUNG',
      [
        createLeafMenuItem('1.1', '1.1. Thông số kỹ thuật hệ thống UPS'),
        createLeafMenuItem('1.2', '1.2. Cấu trúc và nguyên lý hoạt động'),
        createLeafMenuItem('1.3', '1.3. Các chế độ vận hành chính'),
        createLeafMenuItem('1.4', '1.4. Hệ thống giám sát BMS'),
      ]
    ),
    createMenuItem(
      '2',
      <ThunderboltOutlined />,
      '2. HỆ THỐNG UPS GALAXY VL',
      [
        createSubMenuItem(
          '2.1',
          '2.1. Thông tin chung Galaxy VL',
          [
            createLeafMenuItem('2.1.1', '2.1.1. Đặc điểm kỹ thuật'),
            createLeafMenuItem('2.1.2', '2.1.2. Thông số điện'),
            createLeafMenuItem('2.1.3', '2.1.3. Cấu hình hệ thống'),
          ]
        ),
        createSubMenuItem(
          '2.2',
          '2.2. Hướng dẫn lắp đặt',
          [
            createLeafMenuItem('2.2.1', '2.2.1. Yêu cầu môi trường'),
            createLeafMenuItem('2.2.2', '2.2.2. Quy trình lắp đặt'),
            createLeafMenuItem('2.2.3', '2.2.3. Kết nối điện và mạng'),
          ]
        ),
        createSubMenuItem(
          '2.3',
          '2.3. Hướng dẫn vận hành',
          [
            createLeafMenuItem('2.3.1', '2.3.1. Khởi động hệ thống'),
            createLeafMenuItem('2.3.2', '2.3.2. Chế độ vận hành'),
            createLeafMenuItem('2.3.3', '2.3.3. Giám sát thông số'),
          ]
        ),
        createSubMenuItem(
          '2.4',
          '2.4. Bảo trì và bảo dưỡng',
          [
            createLeafMenuItem('2.4.1', '2.4.1. Bảo trì định kỳ'),
            createLeafMenuItem('2.4.2', '2.4.2. Thay thế ắc quy'),
            createLeafMenuItem('2.4.3', '2.4.3. Xử lý sự cố'),
          ]
        ),
      ]
    ),
    createMenuItem(
      '3',
      <PoweroffOutlined />,
      '3. HỆ THỐNG ẮC QUY & BMS',
      [
        createSubMenuItem(
          '3.1',
          '3.1. Hệ thống ắc quy',
          [
            createLeafMenuItem('3.1.1', '3.1.1. Loại ắc quy sử dụng'),
            createLeafMenuItem('3.1.2', '3.1.2. Tính toán dung lượng'),
            createLeafMenuItem('3.1.3', '3.1.3. Tuổi thọ và thay thế'),
          ]
        ),
        createSubMenuItem(
          '3.2',
          '3.2. Hệ thống giám sát BMS',
          [
            createLeafMenuItem('3.2.1', '3.2.1. Cấu trúc BMS'),
            createLeafMenuItem('3.2.2', '3.2.2. Các thông số giám sát'),
            createLeafMenuItem('3.2.3', '3.2.3. Cảnh báo và báo cáo'),
          ]
        ),
      ]
    ),
    createMenuItem(
      '4',
      <MonitorOutlined />,
      '4. GIÁM SÁT & ĐIỀU KHIỂN',
      [
        createSubMenuItem(
          '4.1',
          '4.1. Giao diện người dùng',
          [
            createLeafMenuItem('4.1.1', '4.1.1. Màn hình chính'),
            createLeafMenuItem('4.1.2', '4.1.2. Cài đặt thông số'),
            createLeafMenuItem('4.1.3', '4.1.3. Lịch sử sự kiện'),
          ]
        ),
        createSubMenuItem(
          '4.2',
          '4.2. Kết nối mạng và SCADA',
          [
            createLeafMenuItem('4.2.1', '4.2.1. Giao thức Modbus'),
            createLeafMenuItem('4.2.2', '4.2.2. Kết nối Ethernet'),
            createLeafMenuItem('4.2.3', '4.2.3. Tích hợp SCADA'),
          ]
        ),
      ]
    ),
    createMenuItem(
      '5',
      <ToolOutlined />,
      '5. QUY TRÌNH VẬN HÀNH',
      [
        createSubMenuItem(
          '5.1',
          '5.1. Vận hành UPS Galaxy 500KVA Vân Canh',
          [
            createLeafMenuItem('5.1.1', '5.1.1. Hướng dẫn an toàn'),
            createLeafMenuItem('5.1.2', '5.1.2. Tổng quan hệ thống'),
            createLeafMenuItem('5.1.3', '5.1.3. Quy trình vận hành'),
            createLeafMenuItem('5.1.4', '5.1.4. Xử lý sự cố'),
          ]
        ),
        createSubMenuItem(
          '5.2',
          '5.2. Vận hành hệ thống UPS song song',
          [
            createLeafMenuItem('5.2.1', '5.2.1. Quy trình khởi động hệ thống song song'),
            createLeafMenuItem('5.2.2', '5.2.2. Tắt UPS ở chế độ Maintenance Bypass'),
            createLeafMenuItem('5.2.3', '5.2.3. Bật UPS từ chế độ Maintenance Bypass'),
            createLeafMenuItem('5.2.4', '5.2.4. Cách li 01 UPS khỏi hệ thống'),
            createLeafMenuItem('5.2.5', '5.2.5. Hòa 01 UPS vào hệ thống'),
          ]
        ),
      ]
    ),
    createMenuItem(
      '6',
      <ExclamationCircleOutlined />,
      '6. XỬ LÝ SỰ CỐ & KHẮC PHỤC',
      [
        createSubMenuItem(
          '6.1',
          '6.1. Các sự cố thường gặp',
          [
            createLeafMenuItem('6.1.1', '6.1.1. Sự cố ắc quy'),
            createLeafMenuItem('6.1.2', '6.1.2. Sự cố điện'),
            createLeafMenuItem('6.1.3', '6.1.3. Sự cố mạng'),
          ]
        ),
        createSubMenuItem(
          '6.2',
          '6.2. Quy trình khắc phục',
          [
            createLeafMenuItem('6.2.1', '6.2.1. Phân tích sự cố'),
            createLeafMenuItem('6.2.2', '6.2.2. Các bước khắc phục'),
            createLeafMenuItem('6.2.3', '6.2.3. Kiểm tra sau khắc phục'),
          ]
        ),
      ]
    ),
  ];

  // Menu click được xử lý bởi SystemLayout với handleMenuClick từ menuUtils

  return (
    <SystemLayout
      title="HỆ THỐNG UPS & ẮC QUY BMS - TTDL VÂN CANH"
      menuItems={menuItems}
      headerBgColor="#0072BC"
      defaultOpenKeys={['1', '2', '3', '4', '5', '6']}
    >
      <UPSContent />
    </SystemLayout>
  );
};

export default UPSSystemPage;
