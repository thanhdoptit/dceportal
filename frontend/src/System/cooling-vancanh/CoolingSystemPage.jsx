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

  // Cấu trúc menu với các đầu mục lớn và sub menu cho TTDL Vân Canh
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
          label: '1.2 Cấu trúc đặt tên của các model thuộc TTDL Vân Canh',
        },
        {
          key: '1c',
          label: '1.3 Nguyên lý hoạt động của hệ thống làm mát Trung tâm dữ liệu Vân Canh',
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
          label: '2.1. Chiller SMARDT AE Series',
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
          label: '2.2. PAC UNIFLAIR SDCV Series',
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
          label: '2.3. PAC UNIFLAIR LDCV Series',
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
          label: '2.4. Easy InRow CW Series',
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
          label: '2.5. Hệ thống BMS Chiller',
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
          label: '2.6. Hệ thống bơm nước và thiết bị phụ trợ',
          children: [
            { key: '2.6.1', label: '2.6.1. Bơm tuần hoàn 3D 40-200' },
            { key: '2.6.2', label: '2.6.2. Tank duy trì áp suất SHC' },
            { key: '2.6.3', label: '2.6.3. Bình giãn nở màng ExpanSion' },
            { key: '2.6.4', label: '2.6.4. Bộ tách khí tự động KVS-870' },
            { key: '2.6.5', label: '2.6.5. Cụm nạp hóa chất DPD-30' },
            { key: '2.6.6', label: '2.6.6. Dosing Pot 22L' },
            { key: '2.6.7', label: '2.6.7. BTU Meter F-1000' },
            { key: '2.6.8', label: '2.6.8. BTU System-10 Dry-Tap' },
            { key: '2.6.9', label: '2.6.9. Đồng hồ lưu lượng LXLC' },
            { key: '2.6.10', label: '2.6.10. TES Tank BTD-360' },
            { key: '2.6.11', label: '2.6.11. Van cân bằng Herz 4006' },
            { key: '2.6.12', label: '2.6.12. Van PICV Herz 4206' },
            { key: '2.6.13', label: '2.6.13. Lưu ý vận hành hệ thống bơm' },
          ],
        },
      ],
    },
    {
      key: '3',
      icon: <EnvironmentOutlined />,
      label: '3. VỊ TRÍ HỆ THỐNG',
      children: [
        { key: '3.1', label: '3.1 Sơ đồ bố trí tổng thể' },
        { key: '3.2', label: '3.2 Vị trí các thiết bị chính' },
        { key: '3.3', label: '3.3 Đường ống và hệ thống phân phối' },
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
        { key: '4.5', label: '4.5. Biểu đồ hiệu suất và phân tích kỹ thuật' },
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
      title="Hệ thống làm mát TTDL Vân Canh"
      headerBgColor="#1890ff"
      selectedKey={selectedKey}
    >
      <CoolingContent />
    </SystemLayout>
  );
};

export default CoolingSystemPage;
