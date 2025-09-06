import { ExperimentOutlined, EyeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider, Image, Row, Tag, Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

const WaterSystemDevices = () => {
  // Danh sách thiết bị hệ thống nước làm mát TTDL Vân Canh
  const waterDevices = [
    {
      id: 'TT-1',
      name: 'Đồng hồ nhiệt độ FT11-FT12',
      image: '/cooling/van-canh/FT11-FT12.png',
      type: 'Thiết bị đo lường',
      function: 'Đo nhiệt độ nước lạnh cấp/hồi',
      specs: 'Thang đo: -10°C đến +110°C, Độ chính xác: ±0.5°C',
      location: 'Header chính và các nhánh phụ',
    },
    {
      id: 'PT-1',
      name: 'Đồng hồ áp suất FP31',
      image: '/cooling/van-canh/Đồng hồ áp suất FP31.png',
      type: 'Thiết bị đo lường',
      function: 'Đo áp suất hệ thống nước lạnh',
      specs: 'Thang đo: 0-16 bar, Chất liệu: Inox 316L, Kết nối: NPT 1/4"',
      location: 'Các điểm quan trọng trên đường ống',
    },
    {
      id: 'V-1',
      name: 'Van cổng F2B16',
      image: '/cooling/van-canh/Van cổng F2B16.png',
      type: 'Van cơ khí',
      function: 'Van đóng/mở đường ống',
      specs: 'Kích thước: DN15-DN50, Áp suất: PN16, Chất liệu: Đồng thau',
      location: 'Các nhánh chính và phụ',
    },
    {
      id: 'V-2',
      name: 'Van xả F4B25',
      image: '/cooling/van-canh/Van xả F4B25.png',
      type: 'Van cơ khí',
      function: 'Van bi xả nước/khí',
      specs: 'Kích thước: DN15-DN25, Áp suất: PN16, Van bi đầy đủ',
      location: 'Điểm thấp nhất của hệ thống',
    },
    {
      id: 'V-3',
      name: 'Lọc Y F7B16',
      image: '/cooling/van-canh/Lọc Y F7B16.png',
      type: 'Bộ lọc',
      function: 'Lọc tạp chất trong nước',
      specs: 'Kích thước: DN15-DN50, Lưới lọc: 40-200 mesh, PN16',
      location: 'Trước các thiết bị chính',
    },
    {
      id: 'V-4',
      name: 'Van cân bằng 4006',
      image: '/cooling/van-canh/Van cân bằng 4006.png',
      type: 'Van cân bằng',
      function: 'Cân bằng áp suất thủ công',
      specs: 'DN50-200, PN16, Có đồng hồ đo tích hợp',
      location: 'Header chính và các nhánh lớn',
    },
    {
      id: 'V-5',
      name: 'Van PICV 4206',
      image: '/cooling/van-canh/PICV 4206.png',
      type: 'Van cân bằng thông minh',
      function: 'Cân bằng áp suất độc lập tự động',
      specs: 'DN15-50, Pre-setting 0.1-3.0 m³/h, Δp max 100kPa',
      location: 'Cuối các nhánh cấp CRAC',
    },
    {
      id: 'V-6',
      name: 'Van bướm D6...W',
      image: '/cooling/van-canh/Van bướm D6...W.png',
      type: 'Van bướm',
      function: 'Điều khiển lưu lượng lớn',
      specs: 'DN50-300, PN16, Đĩa gang xám, Thân đúc',
      location: 'Đường ống chính cỡ lớn',
    },
    {
      id: 'V-7',
      name: 'Van bướm Belimo',
      image: '/cooling/van-canh/Van bướm Belimo.png',
      type: 'Van điện tử',
      function: 'Van bướm điều khiển tự động',
      specs: 'Actuator 24V, Modbus RTU, Feedback position',
      location: 'Các điểm điều khiển tự động',
    },
    {
      id: 'V-8',
      name: 'Van điện Belimo PRCA',
      image: '/cooling/van-canh/Van điện Belimo PRCA.png',
      type: 'Van tỷ lệ',
      function: 'Điều khiển tỷ lệ chính xác',
      specs: '24V AC/DC, Modbus RTU, 0-10V/4-20mA signal',
      location: 'Điều khiển TES Tank và bypass',
    },
    {
      id: 'V-9',
      name: 'Actuator điện F7712',
      image: '/cooling/van-canh/Van điện F7712.png',
      type: 'Thiết bị điều khiển',
      function: 'Actuator cho van PICV',
      specs: '24V, Modbus RTU, Thermal and electric actuator',
      location: 'Van PICV tại các CRAC',
    },
    {
      id: 'V-10',
      name: 'Van tách khí KVS-870',
      image: '/cooling/van-canh/Van tách khí KVS-870.png',
      type: 'Van tự động',
      function: 'Tự động tách khí ra khỏi hệ thống',
      specs: 'Auto air vent, PN16, Phao nổi tự động',
      location: 'Điểm cao nhất của hệ thống',
    },
    {
      id: 'C-1',
      name: 'Khớp nối mềm F83SJ16',
      image: '/cooling/van-canh/Khớp nối mềm F83SJ16.png',
      type: 'Khớp nối',
      function: 'Khớp nối đơn chống rung',
      specs: 'DN15-300, PN16, Cao su EPDM, Single sphere',
      location: 'Kết nối bơm và thiết bị rung',
    },
    {
      id: 'C-2',
      name: 'Khớp nối mềm F85DJ16',
      image: '/cooling/van-canh/Khớp nối mềm F85DJ16.png',
      type: 'Khớp nối',
      function: 'Khớp nối đôi chống rung cao cấp',
      specs: 'DN15-300, PN16, Cao su EPDM, Double sphere',
      location: 'Các điểm quan trọng cần chống rung tốt',
    },
  ];

  return (
    <div style={{ padding: '20px 0' }}>
      <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
        <ExperimentOutlined style={{ marginRight: '8px' }} />
        Thiết bị hệ thống nước làm mát TTDL Vân Canh
      </Title>

      <Alert
        message='Hệ thống nước làm mát'
        description='Dưới đây là các thiết bị chính trong hệ thống nước làm mát của TTDL Vân Canh, bao gồm van, đồng hồ đo, khớp nối và các thiết bị điều khiển tự động.'
        type='info'
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[16, 16]}>
        {waterDevices.map(device => (
          <Col xs={24} sm={12} lg={8} xl={6} key={device.id}>
            <Card
              style={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
              cover={
                <div
                  style={{
                    height: '200px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <Image
                    src={device.image}
                    alt={device.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      cursor: 'pointer',
                    }}
                    preview={{
                      mask: (
                        <div style={{ color: 'white' }}>
                          <EyeOutlined style={{ fontSize: '20px' }} />
                          <div>Xem chi tiết</div>
                        </div>
                      ),
                    }}
                  />
                </div>
              }
              actions={[
                <div key='info' style={{ padding: '0 16px', textAlign: 'left' }}>
                  <Tag color='blue' style={{ marginBottom: '4px' }}>
                    <InfoCircleOutlined style={{ marginRight: '4px' }} />
                    {device.id}
                  </Tag>
                </div>,
              ]}
            >
              <Card.Meta
                title={
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      {device.name}
                    </div>
                    <Tag color='green' size='small'>
                      {device.type}
                    </Tag>
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
          </Col>
        ))}
      </Row>

      <Divider />

      {/* Lưu ý kỹ thuật */}
      <Alert
        message='Lưu ý kỹ thuật quan trọng'
        description={
          <div>
            <p>
              <strong>Bảo trì định kỳ:</strong> Kiểm tra và bảo trì các thiết bị theo lịch trình để
              đảm bảo hoạt động ổn định.
            </p>
            <p>
              <strong>An toàn vận hành:</strong> Luôn tuân thủ quy trình an toàn khi thao tác với hệ
              thống nước có áp suất.
            </p>
            <p>
              <strong>Giám sát thông số:</strong> Theo dõi liên tục nhiệt độ, áp suất và lưu lượng
              qua hệ thống BMS.
            </p>
            <p>
              <strong>Xử lý sự cố:</strong> Liên hệ ngay với bộ phận kỹ thuật khi phát hiện bất
              thường.
            </p>
          </div>
        }
        type='warning'
        showIcon
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default WaterSystemDevices;
