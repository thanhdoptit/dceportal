import React, { useState } from 'react';
import { 
  BookOutlined, 
  SettingOutlined, 
  InfoCircleOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  PhoneOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { SystemLayout } from '../shared';
import CoolingContent from './CoolingContent';

const CoolingSystemPage = () => {
  const [selectedKey, setSelectedKey] = useState('1');

  // Cấu trúc menu với các đầu mục lớn và sub menu
  const menuItems = [
    {
      key: '1',
      icon: <InfoCircleOutlined />,
      label: '1. GIỚI THIỆU CHUNG',
      children: [
        {
          key: '1a',
          label: '1.1 Thông số kỹ thuật',
        },
        {
          key: '1b',
          label: '1.2 Cấu trúc đặt tên của các model thuộc TTDL Hòa Lạc',
        },
        {
          key: '1c',
          label: '1.3 Nguyên lý hoạt động của hệ thống làm mát Trung tâm dữ liệu Hòa Lạc',
        },
      ],
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: '2. HƯỚNG DẪN CHI TIẾT TỪNG THIẾT BỊ',
      children: [
        {
          key: '2.1',
          label: '2.1. TDAV1321A - UNIFLAIR',
          children: [
            { key: '2.1.1', label: '2.1.1. Thông tin chung' },
            { key: '2.1.2', label: '2.1.2. Hướng dẫn lắp đặt' },
            { key: '2.1.3', label: '2.1.3. Hướng dẫn vận hành và kiểm tra hàng ngày' },
            { key: '2.1.4', label: '2.1.4. Hướng dẫn xác định nguyên nhân lỗi' },
            { key: '2.1.5', label: '2.1.5. Quy trình và chu kỳ bảo trì' },
          ],
        },
        {
          key: '2.2',
          label: '2.2. TDAV2242A - UNIFLAIR',
          children: [
            { key: '2.2.1', label: '2.2.1. Thông tin chung' },
            { key: '2.2.2', label: '2.2.2. Hướng dẫn lắp đặt' },
            { key: '2.2.3', label: '2.2.3. Hướng dẫn vận hành và kiểm tra hàng ngày' },
            { key: '2.2.4', label: '2.2.4. Hướng dẫn xác định nguyên nhân lỗi' },
            { key: '2.2.5', label: '2.2.5. Quy trình và chu kỳ bảo trì' },
          ],
        },
        {
          key: '2.3',
          label: '2.3. TDAV2842A - UNIFLAIR',
          children: [
            { key: '2.3.1', label: '2.3.1. Thông tin chung' },
            { key: '2.3.2', label: '2.3.2. Hướng dẫn lắp đặt' },
            { key: '2.3.3', label: '2.3.3. Hướng dẫn vận hành và kiểm tra hàng ngày' },
            { key: '2.3.4', label: '2.3.4. Hướng dẫn xác định nguyên nhân lỗi' },
            { key: '2.3.5', label: '2.3.5. Quy trình và chu kỳ bảo trì' },
          ],
        },
        {
          key: '2.4',
          label: '2.4. FM40H-AGB-ESD-APC',
          children: [
            { key: '2.4.1', label: '2.4.1. Thông tin chung' },
            { key: '2.4.2', label: '2.4.2. Hướng dẫn cài đặt và cấu hình ban đầu' },
            { key: '2.4.3', label: '2.4.3. Hướng dẫn vận hành và kiểm tra hàng ngày' },
            { key: '2.4.4', label: '2.4.4. Hướng dẫn xác định nguyên nhân lỗi' },
            { key: '2.4.5', label: '2.4.5. Quy định và chu kỳ bảo trì' },
            { key: '2.4.6', label: '2.4.6. Hướng dẫn bảo trì từng thành phần' },
          ],
        },
        {
          key: '2.5',
          label: '2.5. ACRP102 - APC',
          children: [
            { key: '2.5.1', label: '2.5.1. Thông tin chung' },
            { key: '2.5.2', label: '2.5.2. Hướng dẫn cài đặt và cấu hình ban đầu' },
            { key: '2.5.3', label: '2.5.3. Hướng dẫn vận hành và kiểm tra hàng ngày' },
            { key: '2.5.4', label: '2.5.4. Hướng dẫn xác định nguyên nhân lỗi' },
            { key: '2.5.5', label: '2.5.5. Quy định và chu kỳ bảo trì' },
            { key: '2.5.6', label: '2.5.6. Hướng dẫn bảo trì từng thành phần' },
          ],
        },
        {
          key: '2.6',
          label: '2.6. Quạt sàn AFM4500B',
          children: [
            { key: '2.6.1', label: '2.6.1. Thông tin chung' },
            { key: '2.6.2', label: '2.6.2. Hướng dẫn lắp đặt' },
            { key: '2.6.3', label: '2.6.3. Hướng dẫn vận hành' },
            { key: '2.6.4', label: '2.6.4. Cách xác nhận lỗi' },
          ],
        },
      ],
    },
    {
      key: '3',
      icon: <EnvironmentOutlined />,
      label: '3. DÀN NÓNG VÀ ÁT ĐIỆN ĐIỀU HÒA',
      children: [
        { key: '3.1', label: '3.1 Vị trí dàn nóng' },
        { key: '3.2', label: '3.2 Vị trí át điện điều hòa' },
      ],
    },
    {
      key: '4',
      icon: <AppstoreOutlined />,
      label: '4. ỨNG DỤNG',
      style: {
        fontWeight: 'bold',
      },
      children: [
        { key: '4.1', label: '4.1. Quy trình vận hành hàng ngày chung của hệ thống làm mát' },
        { key: '4.2', label: '4.2. Tổng hợp mã lỗi, nguyên nhân và cách giải quyết' },
        { key: '4.3', label: '4.3. Vị trí, Seri, IP, hợp đồng bảo trì liên quan cụ thể' },
        { key: '4.4', label: '4.4. Xem và thiết lập thông số của các điều hòa qua Website' },
      ],
    },
    {
      key: '5',
      icon: <PhoneOutlined />,
      label: '5. LIÊN HỆ',
      style: {
        fontWeight: 'bold',
      }
    },
    {
      key: '6',
      icon: <FileTextOutlined />,
      label: '6. TÀI LIỆU',
      style: {
        fontWeight: 'bold',
      }
    },
  ];

  return (
    <SystemLayout
      menuItems={menuItems}
      title="Hệ thống làm mát TTDL Hòa Lạc"
      headerBgColor="#0072BC"
      selectedKey={selectedKey}
    >
      <CoolingContent />
    </SystemLayout>
  );
};

export default CoolingSystemPage; 