import React from 'react';
import { Typography, Card, Row, Col, Tag, Divider, Alert } from 'antd';
import { 
  PhoneOutlined, 
  SettingOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ContactSection = () => {
  return (
    <div style={{ padding: '20px 0' }}>
      <Title level={2} style={{ color: '#1890ff', marginBottom: '24px' }}>
        <PhoneOutlined style={{ marginRight: '12px' }} />
        5. LIÊN HỆ - TTDL Vân Canh
      </Title>

      <Alert
        message="Thông tin liên hệ"
        description="Thông tin liên hệ kỹ thuật và hỗ trợ cho hệ thống làm mát TTDL Vân Canh."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <div id="section-5">
        <Card title="5. LIÊN HỆ">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <PhoneOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <p>Thông tin liên hệ sẽ được cập nhật</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactSection;
