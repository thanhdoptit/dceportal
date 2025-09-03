import { EnvironmentOutlined, PictureOutlined } from '@ant-design/icons';
import { Alert, Card, Space, Tag, Typography } from 'antd';
import React from 'react';
import { ImageGallery } from '../../shared';

const { Title, Text } = Typography;

const NetworkSystemSection = () => {
  return (
    <div id="section-7" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <EnvironmentOutlined style={{ marginRight: '8px' }} />
        7. HỆ THỐNG NETWORK TTDL VÂN CANH
      </Title>

      <Alert
        message="HỆ THỐNG CÁP QUANG, CÁP ĐỒNG TỐC ĐỘ CAO 1G/10G/40G"
        description="Thiết kế 2 đường hoạt động Active-Active, cáp quang OM4, OM5 tốc độ lên tới 100G."
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      {/* Hình ảnh hệ thống network */}
      <Card
        title={
          <Space>
            <PictureOutlined />
            Hình ảnh hệ thống Network
          </Space>
        }
        style={{ marginBottom: '20px' }}
      >
        <ImageGallery
          images={[
            '/vancanh-overview/net1.jpg',
            '/vancanh-overview/net3.jpg',
            '/vancanh-overview/net2.jpg'
          ]}
          columns={3}
          imageWidth= '100%'
          imageHeight= 'auto'  
          maskText="Click để xem chi tiết"
        />
      </Card>


      <div id="section-7.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <EnvironmentOutlined style={{ marginRight: '8px' }} /> 7.1 Cáp quang và cáp đồng
        </Title>

        <Card title="Cáp quang và cáp đồng" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Nhà cung cấp</Tag>
              <Text>2 tuyến cáp quang từ FPT và VNPT</Text>
            </div>
            <div>
              <Tag color="blue">Cáp quang</Tag>
              <Text>OM4, OM5 tốc độ 100G</Text>
            </div>
            <div>
              <Tag color="blue">Cáp đồng</Tag>
              <Text>1G/10G/40G</Text>
            </div>
            <div>
              <Tag color="blue">Phòng IPS</Tag>
              <Text>IPS A có 6 tủ rack, IPS B có 7 tủ rack</Text>
            </div>
            <div>
              <Tag color="blue">Cáp quang tầng 2</Tag>
              <Text>Single mode OM5 cho SAN, OM4 cho LAN</Text>
            </div>
            <div>
              <Tag color="blue">Tủ rack</Tag>
              <Text>24 port quang và 24 port đồng</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-7.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <EnvironmentOutlined style={{ marginRight: '8px' }} /> 7.2 Tốc độ truyền dẫn
        </Title>

        <Card title="Tốc độ truyền dẫn" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">Cáp quang OM4</Tag>
              <Text>Tốc độ lên tới 100G</Text>
            </div>
            <div>
              <Tag color="green">Cáp quang OM5</Tag>
              <Text>Tốc độ lên tới 100G</Text>
            </div>
            <div>
              <Tag color="green">Cáp đồng</Tag>
              <Text>1G/10G/40G</Text>
            </div>
            <div>
              <Tag color="green">Single mode</Tag>
              <Text>OM5 cho SAN, OM4 cho LAN</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-7.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <EnvironmentOutlined style={{ marginRight: '8px' }} /> 7.3 Thiết kế Active-Active
        </Title>

        <Card title="Thiết kế Active-Active" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="purple">Cấu hình</Tag>
              <Text>2 đường Active-Active</Text>
            </div>
            <div>
              <Tag color="purple">Core switch</Tag>
              <Text>2 core switch đặt gần nhau</Text>
            </div>
            <div>
              <Tag color="purple">Dự phòng</Tag>
              <Text>Hai tuyến cáp quang trái và phải từ 2 nhà cung cấp</Text>
            </div>
            <div>
              <Tag color="purple">Kết nối</Tag>
              <Text>Switch quang và server đặt ở phòng security monitor</Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default NetworkSystemSection;
