import {
    CheckCircleOutlined,
    CloudOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { Alert, Card, Col, Collapse, Divider, Row, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

// Import các thiết bị
import BMSChiller from '../devices/BMSChiller';
import EasyInRowCW from '../devices/EasyInRowCW';
import LDCVSeries from '../devices/LDCVSeries';
import PumpingSystemDevices from '../devices/PumpingSystemDevices';
import SDCVSeries from '../devices/SDCVSeries';
import SMARDTChiller from '../devices/SMARDTChiller';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const DeviceGuideSection = () => {
  console.log('🚀 DeviceGuideSection component rendered');
  
  // Danh sách thiết bị chính
  const devices = [
    {
      id: '2.1',
      name: 'Chiller SMARDT AE Series',
      model: 'AE054.2B.F2HAJA.A010DX.E10',
      type: 'Air-cooled Chiller',
      capacity: '632kW (180RT)',
      features: [
        'Công nghệ Oil-free compressor',
        'Hiệu suất cao COP 3.5',
        'Điều khiển thông minh với PLC',
        '2 máy nén song song'
      ]
    },
    {
      id: '2.2',
      name: 'PAC UNIFLAIR SDCV Series',
      model: 'SDCV0300A, SDCV0400A, SDCV0600A',
      type: 'Precision Air Conditioning',
      capacity: '3-15.6kW',
      features: [
        'Độ chính xác nhiệt độ ±0.5°C',
        'Điều khiển độ ẩm 45-55%',
        'Làm mát phòng server nhỏ',
        'Tích hợp BMS Modbus'
      ]
    },
    {
      id: '2.3',
      name: 'PAC UNIFLAIR LDCV Series',
      model: 'LDCV0600A, LDCV1800A, LDCV3400A, LDCV4300A',
      type: 'Large Room Cooling',
      capacity: '16.8-110kW',
      features: [
        'Công suất lớn cho phòng server',
        'Độ chính xác nhiệt độ ±0.5°C',
        'Điều khiển độ ẩm 45-55%',
        'Tích hợp BMS Modbus'
      ]
    },
    {
      id: '2.4',
      name: 'Easy InRow CW Series',
      model: 'ERC311AD0HPE',
      type: 'Chilled Water InRow Cooling',
      capacity: '21.6kW',
      features: [
        'Làm mát trực tiếp tại nguồn nhiệt',
        'Thiết kế compact tiết kiệm không gian',
        'Tối ưu hiệu quả làm mát cho từng rack',
        'Dễ dàng mở rộng khi cần'
      ]
    },
    {
      id: '2.5',
      name: 'Hệ thống BMS Chiller',
      model: 'BMS Integration',
      type: 'Building Management System',
      capacity: 'N/A',
      features: [
        'Giám sát nhiệt độ, độ ẩm, áp suất, lưu lượng',
        'Điều khiển tự động khởi động/dừng thiết bị',
        'Giao tiếp Modbus RTU/TCP với tất cả thiết bị',
        'Báo cáo và cảnh báo thông minh'
      ]
    },
    {
      id: '2.6',
      name: 'Hệ thống bơm nước và thiết bị phụ trợ',
      model: 'Multiple Models',
      type: 'Water Pumping & Support Equipment',
      capacity: 'Variable',
      features: [
        'Bơm tuần hoàn 3D 40-200 (600L/min, 45m)',
        'Tank duy trì áp suất SHC (300-1000L)',
        'Bình giãn nở màng ExpanSion (80-500L)',
        'Bộ tách khí tự động KVS-870',
        'Cụm nạp hóa chất DPD-30',
        'BTU Meter F-1000 và System-10 Dry-Tap',
        'TES Tank BTD-360 (360 tấn, 10 phút dự phòng)',
        'Van cân bằng Herz 4006 và PICV 4206'
      ]
    }
  ];

  // Hàm render thiết bị dựa trên ID
  const renderDevice = (deviceId) => {
    console.log('🔧 Rendering device:', deviceId);
    switch (deviceId) {
      case '2.1':
        return <SMARDTChiller />;
      case '2.2':
        return <SDCVSeries />;
      case '2.3':
        return <LDCVSeries />;
      case '2.4':
        return <EasyInRowCW />;
      case '2.5':
        return <BMSChiller />;
      case '2.6':
        return <PumpingSystemDevices />;
      default:
        console.log('❌ Unknown device ID:', deviceId);
        return null;
    }
  };

  return (
    <div id="section-2" className="content-section">
      <Title level={2}>
        <SettingOutlined style={{ marginRight: '12px' }} />
        2. Hướng dẫn chi tiết từng thiết bị - TTDL Vân Canh
      </Title>
      <Alert
        message="Hướng dẫn thiết bị"
        description="Dưới đây là hướng dẫn chi tiết cho từng thiết bị trong hệ thống làm mát TTDL Vân Canh. Mỗi thiết bị có các section riêng biệt để dễ dàng tra cứu và thực hiện."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />
      {/* Danh sách thiết bị */}
      <Row gutter={[16, 16]}>
        {devices.map((device, index) => (
          <Col xs={24} lg={12} key={index}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CloudOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                  {device.name}
                </div>
              }
              style={{ height: '100%' }}
              extra={
                <Tag color="green">{device.id}</Tag>
              }
            >
              <div style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>Model:</Text> {device.model}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>Loại:</Text> {device.type}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>Công suất:</Text> {device.capacity}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>Tính năng chính:</Text>
                <div style={{ marginTop: '8px' }}>
                  {device.features.map((feature, idx) => (
                    <Tag key={idx} color="blue" style={{ marginBottom: '4px' }}>
                      <CheckCircleOutlined style={{ marginRight: '4px' }} />
                      {feature}
                    </Tag>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* Nội dung chi tiết từng thiết bị */}
      {devices.map((device, deviceIndex) => (
        <div key={deviceIndex} style={{ marginBottom: '40px' }}>
          {renderDevice(device.id)}
        </div>
      ))}

      {/* Lưu ý quan trọng */}
      <Alert
        message="Lưu ý quan trọng"
        description="Mỗi thiết bị có các yêu cầu vận hành và bảo trì riêng biệt. Vui lòng tuân thủ nghiêm ngặt các hướng dẫn của nhà sản xuất và quy trình nội bộ để đảm bảo an toàn và hiệu quả."
        type="warning"
        showIcon
        style={{ marginTop: '24px' }}
      />
    </div>
  );
};

export default DeviceGuideSection;
