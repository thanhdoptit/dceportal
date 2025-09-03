import { BookOutlined, PictureOutlined } from '@ant-design/icons';
import { Alert, Card, Space, Tag, Typography } from 'antd';
import React from 'react';
import { ImageGallery } from '../../shared';

const { Title, Text } = Typography;

const RackSystemSection = () => {
  return (
    <div id="section-8" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <BookOutlined style={{ marginRight: '8px' }} />
        8. HỆ THỐNG RACK TTDL VÂN CANH
      </Title>

      <Alert
        message="120 RACK SERVER, CÔNG SUẤT TRUNG BÌNH 5KW/RACK"
        description="Dãy mật độ cao đáp ứng 15KW/rack, 03 buồng nhốt khí nóng tối ưu hiệu quả làm mát."
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      {/* Hình ảnh hệ thống rack */}
      <Card
        title={
          <Space>
            <PictureOutlined />
            Hình ảnh hệ thống Rack Server
          </Space>
        }
        style={{ marginBottom: '20px' }}
      >
        <ImageGallery
        style={{ width: '80%', margin: '0 auto' }}
          images={[
            '/vancanh-overview/rack1.jpg',
            '/vancanh-overview/rack2.jpg'
          ]}
          columns={2}
          imageWidth= '100%'
          imageHeight= 'auto'  
          maskText="Click để xem chi tiết"
        />
      </Card>

      <div id="section-8.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <BookOutlined style={{ marginRight: '8px' }} /> 8.1 Quy mô rack server
        </Title>

        <Card title="Quy mô rack server" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Giai đoạn 1</Tag>
              <Text>120 rack server</Text>
            </div>
            <div>
              <Tag color="blue">Mở rộng tương lai</Tag>
              <Text>+30 rack (tổng 150 rack)</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-8.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <BookOutlined style={{ marginRight: '8px' }} /> 8.2 Công suất và mật độ
        </Title>

        <Card title="Công suất và mật độ" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Công suất trung bình</Tag>
              <Text>5KW/rack</Text>
            </div>
            <div>
              <Tag color="blue">Mật độ cao</Tag>
              <Text>15KW/rack</Text>
            </div>
            <div>
              <Tag color="blue">Công suất tối đa</Tag>
              <Text>2250KW (150 rack × 15KW)</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-8.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <BookOutlined style={{ marginRight: '8px' }} /> 8.3 Buồng nhốt khí nóng
        </Title>

        <Card title="Buồng nhốt khí nóng" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Số lượng buồng</Tag>
              <Text>03 buồng tối ưu hiệu quả làm mát</Text>
            </div>
            <div>
              <Tag color="blue">Chức năng</Tag>
              <Text>Nhốt khí nóng, tối ưu hiệu quả làm mát</Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default RackSystemSection;
