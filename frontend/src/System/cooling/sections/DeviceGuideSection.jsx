import React, { lazy, Suspense } from 'react';
import { Typography, Divider, Spin } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Lazy load các device components
const TDAV1321A = lazy(() => import('../devices/TDAV1321A'));
const TDAV2242A = lazy(() => import('../devices/TDAV2242A'));
const TDAV2842A = lazy(() => import('../devices/TDAV2842A'));
const FM40H = lazy(() => import('../devices/FM40H'));
const ACRP102 = lazy(() => import('../devices/ACRP102'));
const AFM4500B = lazy(() => import('../devices/AFM4500B'));

// Loading component cho devices
const DeviceLoader = ({ children }) => (
  <Suspense 
    fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px',
        minHeight: '100px'
      }}>
        <Spin size="default" />
        <span style={{ marginLeft: '8px' }}>Đang tải thông tin thiết bị...</span>
      </div>
    }
  >
    {children}
  </Suspense>
);

const DeviceGuideSection = () => {
  return (
    <section id="section-2" className="content-section">
      <Title level={2} style={{ color: '#1890ff', marginBottom: '24px' }}>
        <ToolOutlined style={{ marginRight: '12px' }} />
        2. HƯỚNG DẪN CHI TIẾT TỪNG THIẾT BỊ - TTDL Hòa Lạc
      </Title>

      {/* TDAV1321A - UNIFLAIR */}
      <DeviceLoader>
        <TDAV1321A />
      </DeviceLoader>

      {/* TDAV2242A - UNIFLAIR */}
      <DeviceLoader>
        <TDAV2242A />
      </DeviceLoader>

      {/* TDAV2842A - UNIFLAIR */}
      <DeviceLoader>
        <TDAV2842A />
      </DeviceLoader>

      {/* FM40H-AGB-ESD-APC */}
      <DeviceLoader>
        <FM40H />
      </DeviceLoader>

      {/* ACRP102 - APC */}
      <DeviceLoader>
        <ACRP102 />
      </DeviceLoader>

      {/* Quạt sàn AFM4500B */}
      <DeviceLoader>
        <AFM4500B />
      </DeviceLoader>
    </section>
  );
};

export default DeviceGuideSection; 