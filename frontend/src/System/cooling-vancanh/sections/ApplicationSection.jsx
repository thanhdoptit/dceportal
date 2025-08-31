import React from 'react';
import { Typography, Card, Row, Col, Tag, Divider, Alert } from 'antd';
import { 
  AppstoreOutlined, 
  SettingOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import ErrorCodesGuide from '../components/ErrorCodesGuide';
import PerformanceCharts from '../components/PerformanceCharts';

const { Title, Paragraph, Text } = Typography;

const ApplicationSection = () => {
  return (
    <div style={{ padding: '20px 0' }}>
      <Title level={2} style={{ color: '#1890ff', marginBottom: '24px' }}>
        <AppstoreOutlined style={{ marginRight: '12px' }} />
        4. ỨNG DỤNG - TTDL Vân Canh
      </Title>

      <Alert
        message="Ứng dụng thực tế"
        description="Các ứng dụng thực tế và kinh nghiệm vận hành hệ thống làm mát TTDL Vân Canh."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <div id="section-4.1" style={{ marginBottom: '24px' }}>
        <Card title="4.1. Quy trình vận hành hàng ngày chung của hệ thống làm mát">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <AppstoreOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <p>Quy trình vận hành hàng ngày chung của hệ thống làm mát sẽ được cập nhật</p>
          </div>
        </Card>
      </div>

      <Divider />

      <div id="section-4.2" style={{ marginBottom: '24px' }}>
        <ErrorCodesGuide />
      </div>

      <Divider />

      <div id="section-4.3" style={{ marginBottom: '24px' }}>
        <Card title="4.3. Vị trí, Seri, IP, hợp đồng bảo trì liên quan cụ thể">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <InfoCircleOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <p>Vị trí, Seri, IP, hợp đồng bảo trì liên quan cụ thể sẽ được cập nhật</p>
          </div>
        </Card>
      </div>

      <Divider />

      <div id="section-4.4" style={{ marginBottom: '24px' }}>
        <Card title="4.4. Xem và thiết lập thông số của các điều hòa qua Website">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <InfoCircleOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <p>Xem và thiết lập thông số của các điều hòa qua Website sẽ được cập nhật</p>
          </div>
        </Card>
      </div>

      <Divider />

      <div id="section-4.5" style={{ marginBottom: '24px' }}>
        <PerformanceCharts />
      </div>
    </div>
  );
};

export default ApplicationSection;
