import React from 'react';
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
import VanCanhOverviewContent from './VanCanhOverviewContent';

const VanCanhOverviewPage = () => {

  // Cấu trúc menu cho trang Giới thiệu chung về TTDL Vân Canh
  const menuItems = [
    {
      key: '1',
      icon: <InfoCircleOutlined />,
      label: '1. TỔNG QUAN DỰ ÁN',
      children: [
        {
          key: '1.1',
          label: '1.1 Khái quát dự án',
        },
        {
          key: '1.2',
          label: '1.2 Các mốc quan trọng',
        },
        {
          key: '1.3',
          label: '1.3 So sánh với tiêu chuẩn Uptime',
        },
      ],
    },
    {
      key: '2',
      icon: <CloudOutlined />,
      label: '2. KIẾN TRÚC VÀ THIẾT KẾ',
      children: [
        {
          key: '2.1',
          label: '2.1 Kiến trúc phân vùng',
        },
        {
          key: '2.2',
          label: '2.2 Tiêu chuẩn thiết kế',
        },
      ],
    },
    {
      key: '3',
      icon: <ThunderboltOutlined />,
      label: '3. HỆ THỐNG CẤP NGUỒN',
      children: [
        {
          key: '3.1',
          label: '3.1 Nguồn điện và trạm biến áp',
        },
        {
          key: '3.2',
          label: '3.2 Hệ thống UPS',
        },
      ],
    },
    {
      key: '4',
      icon: <SettingOutlined />,
      label: '4. HỆ THỐNG LÀM MÁT',
      children: [
        {
          key: '4.1',
          label: '4.1 Hệ thống Chiller',
        },
        {
          key: '4.2',
          label: '4.2 Hệ thống điều hòa chính xác',
        },
        {
          key: '4.3',
          label: '4.3 Hệ thống trữ nhiệt TES',
        },
      ],
    },
    {
      key: '5',
      icon: <SafetyOutlined />,
      label: '5. HỆ THỐNG PCCC',
      children: [
        {
          key: '5.1',
          label: '5.1 Hệ thống khí Novec 1230',
        },
        {
          key: '5.2',
          label: '5.2 Hệ thống báo khói sớm',
        },
        {
          key: '5.3',
          label: '5.3 Hệ thống giám sát đồ họa',
        },
      ],
    },
    {
      key: '6',
      icon: <AppstoreOutlined />,
      label: '6. HỆ THỐNG AN NINH',
      children: [
        {
          key: '6.1',
          label: '6.1 Hệ thống CCTV',
        },
        {
          key: '6.2',
          label: '6.2 Hệ thống kiểm soát vào ra ACS',
        },
        {
          key: '6.3',
          label: '6.3 Hệ thống thông báo PA',
        },
      ],
    },
    {
      key: '7',
      icon: <EnvironmentOutlined />,
      label: '7. HỆ THỐNG NETWORK',
      children: [
        {
          key: '7.1',
          label: '7.1 Cáp quang và cáp đồng',
        },
        {
          key: '7.2',
          label: '7.2 Tốc độ truyền dẫn',
        },
        {
          key: '7.3',
          label: '7.3 Thiết kế Active-Active',
        },
      ],
    },
    {
      key: '8',
      icon: <BookOutlined />,
      label: '8. HỆ THỐNG RACK',
      children: [
        {
          key: '8.1',
          label: '8.1 Quy mô rack server',
        },
        {
          key: '8.2',
          label: '8.2 Công suất và mật độ',
        },
        {
          key: '8.3',
          label: '8.3 Buồng nhốt khí nóng',
        },
      ],
    },
    {
      key: '9',
      icon: <FileTextOutlined />,
      label: '9. HIỆU QUẢ VÀ RỦI RO',
      children: [
        {
          key: '9.1',
          label: '9.1 Hiệu quả dự án',
        },
        {
          key: '9.2',
          label: '9.2 Các rủi ro tiềm ẩn',
        },
        {
          key: '9.3',
          label: '9.3 Giải pháp khắc phục',
        },
      ],
    },
  ];



  return (
    <SystemLayout
      menuItems={menuItems}
      title="Giới thiệu chung về TTDL Vân Canh"
      headerBgColor="#1890ff"
      defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7', '8', '9']}
    >
      <VanCanhOverviewContent />
    </SystemLayout>
  );
};

export default VanCanhOverviewPage;
