import React from 'react';
import { Typography, Card, Row, Col, Image, Tag, Alert, Divider } from 'antd';
import { 
  EyeOutlined, 
  InfoCircleOutlined, 
  ToolOutlined, 
  ExperimentOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const PumpingSystemDevices = () => {
  // Danh sách thiết bị hệ thống bơm nước TTDL Vân Canh
  const pumpingDevices = [
    {
      id: 'P-1',
      name: 'Bơm tuần hoàn 3D 40-200',
      image: '/cooling/van-canh/Bơm 3D 40-200.png',
      type: 'Bơm tuần hoàn',
      function: 'Bơm tuần hoàn nước lạnh chính cho hệ thống CRAC',
      specs: 'Lưu lượng: 600L/min, Cột áp: 45m, Công suất: 7.5kW, Điện áp: 380V/3P/50Hz',
      location: 'Phòng máy trung tâm - Pump Room'
    },
    {
      id: 'P-2',
      name: 'Tank duy trì áp suất SHC',
      image: '/cooling/van-canh/Tank SHC.png',
      type: 'Bình chứa áp suất',
      function: 'Duy trì áp suất hệ thống nước lạnh, giảm số lần khởi động bơm',
      specs: 'Dung tích: 300-1000L, Áp suất làm việc: 6-10 bar, Chất liệu: Thép carbon',
      location: 'Phòng máy bên cạnh bơm chính'
    },
    {
      id: 'EX-1',
      name: 'Bình giãn nở màng ExpanSion',
      image: '/cooling/van-canh/Bình giãn nở Ex.png',
      type: 'Thiết bị bù trừ nhiệt',
      function: 'Bù trừ sự giãn nở nhiệt của nước, bảo vệ hệ thống khỏi áp suất cao',
      specs: 'Dung tích: 80-500L, Áp suất max: 10 bar, Màng EPDM, Nhiệt độ: -10°C đến +110°C',
      location: 'Kết nối với đường hồi nước lạnh - Return header'
    },
    {
      id: 'AS-1',
      name: 'Bộ tách khí tự động KVS-870',
      image: '/cooling/van-canh/Bộ tách khí.png',
      type: 'Thiết bị tách khí',
      function: 'Tách khí tự động khỏi hệ thống, ngăn ngừa cavitation và ăn mòn',
      specs: 'DN50-150, Tách khí micro và macro bubbles, Áp suất: PN16, Chất liệu: Gang xám',
      location: 'Điểm cao nhất của đường ống hồi - Return line high point'
    },
    {
      id: 'DP-1',
      name: 'Cụm nạp hóa chất DPD-30',
      image: '/cooling/van-canh/DPD-30.png',
      type: 'Hệ thống hóa chất',
      function: 'Nạp hóa chất chống ăn mòn và cặn bẩn vào hệ thống nước lạnh',
      specs: 'Dung tích: 30L, Áp suất: max 6 bar, Inox 316L, Bơm màng điện từ',
      location: 'Gần bơm tuần hoàn chính - Near main circulation pump'
    },
    {
      id: 'DP-2',
      name: 'Dosing Pot 22L',
      image: '/cooling/van-canh/Dosing Pot 22L.png',
      type: 'Bồn hóa chất',
      function: 'Bồn chứa hóa chất dự phòng và pha trộn',
      specs: 'Dung tích: 22L, Chất liệu: Inox 316L, Van xả tự động, Nắp an toàn',
      location: 'Khu vực hóa chất phòng máy - Chemical storage area'
    },
    {
      id: 'BTU-1',
      name: 'BTU Meter F-1000',
      image: '/cooling/van-canh/BTU Meter F-1000.png',
      type: 'Đồng hồ năng lượng',
      function: 'Đo năng lượng tiêu thụ hệ thống làm lạnh, tính toán hiệu suất',
      specs: 'DN15-200, Độ chính xác: ±2%, Modbus RTU, Pulse output, Nhiệt độ: -40°C đến +180°C',
      location: 'Header chính cấp và hồi - Main supply and return headers'
    },
    {
      id: 'BTU-2',
      name: 'BTU System-10 Dry-Tap',
      image: '/cooling/van-canh/BTU System-10.png',
      type: 'Đồng hồ năng lượng',
      function: 'BTU meter lắp đặt không cần cắt ống, đo năng lượng từ xa',
      specs: 'DN50-300, Ultrasonic sensor, Battery powered, Wireless communication, ±3% accuracy',
      location: 'Các nhánh phụ không thể cắt ống - Branch lines without pipe cutting'
    },
    {
      id: 'FM-1',
      name: 'Đồng hồ lưu lượng LXLC',
      image: '/cooling/van-canh/LXLC Flow Meter.png',
      type: 'Đồng hồ lưu lượng',
      function: 'Đo lưu lượng nước với xung pulse, giám sát hiệu suất hệ thống',
      specs: 'DN50-300, Pulse output, Magnetic drive, ±2% accuracy, Nhiệt độ: -20°C đến +80°C',
      location: 'Các điểm đo lưu lượng quan trọng - Critical flow measurement points'
    },
    {
      id: 'TES-1',
      name: 'TES Tank BTD-360',
      image: '/cooling/van-canh/TES Tank BTD-360.png',
      type: 'Bồn tích trữ năng lượng',
      function: 'Tích trữ nước lạnh giờ thấp điểm, dự phòng khi mất điện',
      specs: 'Dung tích: 360 tấn, Cách nhiệt 10cm, Inox 316L, Thời gian dự phòng: 10 phút',
      location: 'Khu vực tích trữ năng lượng - Energy storage area'
    },
    {
      id: 'V-1',
      name: 'Van cân bằng Herz 4006',
      image: '/cooling/van-canh/Van cân bằng 4006.png',
      type: 'Van cân bằng thủ công',
      function: 'Cân bằng áp suất thủ công giữa các nhánh cấp nước lạnh',
      specs: 'DN50-200, PN16, Có đồng hồ đo tích hợp, Pre-setting: 0.1-3.0 m³/h',
      location: 'Header chính và các nhánh lớn - Main headers and large branches'
    },
    {
      id: 'V-2',
      name: 'Van PICV Herz 4206',
      image: '/cooling/van-canh/PICV 4206.png',
      type: 'Van cân bằng thông minh',
      function: 'Cân bằng áp suất độc lập tự động, điều chỉnh lưu lượng theo tải',
      specs: 'DN15-50, Pre-setting 0.1-3.0 m³/h, Δp max 100kPa, Actuator 24V',
      location: 'Cuối các nhánh cấp CRAC - End of CRAC supply branches'
    }
  ];

  return (
    <div style={{ padding: '20px 0' }}>
      <div id="2.6" style={{ scrollMarginTop: '20px' }}>
        <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} />
          2.6 - Hệ thống bơm nước và thiết bị phụ trợ TTDL Vân Canh
        </Title>
      </div>

      <Alert
        message="Hệ thống bơm nước và thiết bị phụ trợ"
        description="Dưới đây là các thiết bị trong hệ thống bơm nước TTDL Vân Canh, bao gồm bơm tuần hoàn, bình tích áp, bộ tách khí, hệ thống hóa chất, BTU meter và các thiết bị đo lường năng lượng."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[16, 16]}>
        {pumpingDevices.map((device, index) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={device.id}>
            <div id={`2.6.${index + 1}`} style={{ scrollMarginTop: '20px' }}>
              <Card
              style={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
              cover={
                <div style={{ 
                  height: '200px', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5'
                }}>
                  <Image
                    src={device.image}
                    alt={device.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      cursor: 'pointer'
                    }}
                    preview={{
                      mask: (
                        <div style={{ color: 'white' }}>
                          <EyeOutlined style={{ fontSize: '20px' }} />
                          <div>Xem chi tiết</div>
                        </div>
                      )
                    }}
                  />
                </div>
              }
              actions={[
                <div key="info" style={{ padding: '0 16px', textAlign: 'left' }}>
                  <Tag color="blue" style={{ marginBottom: '4px' }}>
                    <InfoCircleOutlined style={{ marginRight: '4px' }} />
                    {device.id}
                  </Tag>
                </div>
              ]}
            >
              <Card.Meta
                title={
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      {device.name}
                    </div>
                    <Tag color="green" size="small">{device.type}</Tag>
                  </div>
                }
                description={
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text strong>Chức năng: </Text>
                      <Text>{device.function}</Text>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text strong>Thông số: </Text>
                      <Text>{device.specs}</Text>
                    </div>
                    <div>
                      <Text strong>Vị trí: </Text>
                      <Text>{device.location}</Text>
                    </div>
                  </div>
                }
              />
            </Card>
            </div>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* Lưu ý vận hành hệ thống bơm */}
      <div id="2.6.13" style={{ scrollMarginTop: '20px' }}>
        <Alert
          message="Lưu ý vận hành hệ thống bơm TTDL Vân Canh"
        description={
          <div>
            <p><strong>Kiểm tra trước vận hành:</strong> Đảm bảo đầy nước trong bơm, kiểm tra áp suất hệ thống, xả khí trong đường ống.</p>
            <p><strong>Vận hành an toàn:</strong> Luôn mở van từ từ, tránh shock áp suất đột ngột, kiểm tra rung động bơm.</p>
            <p><strong>Bảo trì định kỳ:</strong> Kiểm tra bearing, mechanical seal, rung động bơm hàng tháng, thay dầu bôi trơn.</p>
            <p><strong>Giám sát năng lượng:</strong> Theo dõi BTU meter để tối ưu hóa hiệu suất làm lạnh, phân tích chi phí vận hành.</p>
            <p><strong>Hóa chất:</strong> Kiểm tra pH (7.5-8.5), độ dẫn điện và mức hóa chất trong hệ thống, bổ sung định kỳ.</p>
            <p><strong>TES Tank:</strong> Giám sát nhiệt độ và mức nước trong TES tank, đảm bảo khả năng dự phòng 10 phút.</p>
            <p><strong>Van cân bằng:</strong> Kiểm tra và điều chỉnh van cân bằng theo tải thực tế, đảm bảo phân phối nước đều.</p>
          </div>
        }
        type="warning"
        showIcon
        style={{ marginTop: '20px' }}
        />
      </div>

    </div>
  );
};

export default PumpingSystemDevices;