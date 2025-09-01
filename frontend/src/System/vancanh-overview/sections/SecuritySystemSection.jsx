import React from 'react';
import { Typography, Card, Tag, Alert, Space } from 'antd';
import { SafetyOutlined, PictureOutlined, AppstoreOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SecuritySystemSection = () => {
  return (
    <div id="section-6" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <SafetyOutlined style={{ marginRight: '8px' }} />
        6. HỆ THỐNG AN NINH TTDL VÂN CANH
      </Title>

      <Alert
        message="HỆ THỐNG CAM VÀ HỆ ACS GIÁM SÁT TOÀN BỘ TRONG, NGOÀI DC VÂN CANH"
        description="Đáp ứng tiêu chuẩn Thông tư 09 của NHNN về an ninh ngân hàng."
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      {/* Hình ảnh hệ thống an ninh */}
      <Card 
        title={
          <Space>
            <PictureOutlined />
            Hệ thống CCTV, ACS, PA
          </Space>
        }
        style={{ marginBottom: '20px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/vancanh-overview/security_cctv_acs_pa.jpg"
            alt="Hệ thống CCTV, ACS, PA giám sát toàn bộ DC Vân Canh"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <p style={{ 
            color: '#666', 
            margin: '8px 0 0 0', 
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            Hệ thống CCTV, ACS, PA giám sát toàn bộ DC Vân Canh (từ slide PPTX)
          </p>
        </div>
      </Card>

      <div id="section-6.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <AppstoreOutlined style={{ marginRight: '8px' }} /> 6.1 Hệ thống CCTV
        </Title>

        <Card title="Hệ thống CCTV" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Số lượng camera</Tag>
              <Text>110 Camera từ vòng ngoài, hành lang, các phòng chức năng</Text>
            </div>
            <div>
              <Tag color="blue">Phân vùng</Tag>
              <Text>Chia làm 2 vùng: vùng trong và vùng ngoài</Text>
            </div>
            <div>
              <Tag color="blue">Server recording</Tag>
              <Text>2 server: 10.0.208.5 (tầng 1), 10.0.208.6 (tầng 2,3,4)</Text>
            </div>
            <div>
              <Tag color="blue">Lưu trữ</Tag>
              <Text>Thời gian lưu trữ 100 ngày</Text>
            </div>
            <div>
              <Tag color="blue">Phần mềm</Tag>
              <Text>Xprotect Managerment Client để view camera</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-6.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <AppstoreOutlined style={{ marginRight: '8px' }} /> 6.2 Hệ thống kiểm soát vào ra ACS
        </Title>

        <Card title="Hệ thống kiểm soát vào ra (ACS)" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">Phần cứng</Tag>
              <Text>Khóa từ, đầu đọc vân tay, nút exit, nút mở cửa khẩn cấp</Text>
            </div>
            <div>
              <Tag color="green">Controller</Tag>
              <Text>Đặt ở phòng Hub1 và Hub2, kết nối với nhau bởi các switch</Text>
            </div>
            <div>
              <Tag color="green">Server</Tag>
              <Text>Đặt ở phòng security monitor, IP: 10.0.208.200</Text>
            </div>
            <div>
              <Tag color="green">Phần mềm</Tag>
              <Text>AS Manager giám sát ra, điều khiển vào ra, xác thực bằng vân tay và hình ảnh</Text>
            </div>
            <div>
              <Tag color="green">Bảo mật cao</Tag>
              <Text>Phòng máy chủ tầng 2 có cửa xác thực bằng hình ảnh chỉ cho 1 người vào</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-6.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <AppstoreOutlined style={{ marginRight: '8px' }} /> 6.3 Hệ thống thông báo PA
        </Title>

        <Card title="Hệ thống thông báo PA" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="orange">Thiết bị</Tag>
              <Text>Đặt ở phòng security monitor tầng 1</Text>
            </div>
            <div>
              <Tag color="orange">Phòng NOC</Tag>
              <Text>Có Mic nói bằng cách chọn 1,2,3 ấn giữ nói, chỉ nói và phát nhạc</Text>
            </div>
            <div>
              <Tag color="orange">Phát nhạc</Tag>
              <Text>Phát 1 bản nhạc xuống tầng 1, cắm USB phát nhạc vào thiết bị</Text>
            </div>
            <div>
              <Tag color="orange">Bộ phát nhạc nền</Tag>
              <Text>Model: PLE-SDT</Text>
            </div>
          </Space>
        </Card>
      </div>

      <Card title="Hệ thống Network" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Tag color="purple">Cáp quang</Tag>
            <Text>2 tuyến cáp quang trái và phải từ 2 nhà cung cấp (FPT và VNPT)</Text>
          </div>
          <div>
            <Tag color="purple">Phòng IPS</Tag>
            <Text>IPS A có 6 tủ rack, IPS B có 7 tủ rack</Text>
          </div>
          <div>
            <Tag color="purple">Cáp quang tầng 2</Tag>
            <Text>Single mode OM5 cho SAN, OM4 cho LAN</Text>
          </div>
          <div>
            <Tag color="purple">Tủ rack</Tag>
            <Text>24 port quang và 24 port đồng</Text>
          </div>
          <div>
            <Tag color="purple">Core switch</Tag>
            <Text>2 core switch đặt gần nhau</Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default SecuritySystemSection;
