import React from 'react';
import { Typography, Card, Tag, Alert, Space } from 'antd';
import { BookOutlined, PictureOutlined } from '@ant-design/icons';

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
            Hệ thống Rack Server
          </Space>
        }
        style={{ marginBottom: '20px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/vancanh-overview/rack_system_120_racks.jpg"
            alt="120 Rack Server, công suất trung bình 5KW/rack"
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
            120 Rack Server, công suất trung bình 5KW/rack (từ slide PPTX)
          </p>
        </div>
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
