import { ToolOutlined } from '@ant-design/icons';
import { Spin, Typography } from 'antd';
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import '../../shared/styles/SystemSection.css';

// Lazy load các device components để cải thiện performance
const TDAV1321A = lazy(() => import('../devices/TDAV1321A'));
const TDAV2242A = lazy(() => import('../devices/TDAV2242A'));
const TDAV2842A = lazy(() => import('../devices/TDAV2842A'));
const FM40H = lazy(() => import('../devices/FM40H'));
const ACRP102 = lazy(() => import('../devices/ACRP102'));
const AFM4500B = lazy(() => import('../devices/AFM4500B'));

const { Title } = Typography;

// Component để lazy load device với intersection observer - optimized
const LazyDevice = ({ Component: DeviceComponent, fallback }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Disconnect ngay lập tức để tránh multiple calls
          observer.disconnect();
          // Sử dụng requestAnimationFrame để tránh blocking
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '100px' // Tăng rootMargin để load sớm hơn và giảm re-observe
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          <DeviceComponent />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

// Loading component
const DeviceLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px',
    background: '#f5f5f5',
    borderRadius: '8px',
    margin: '16px 0'
  }}>
    <Spin size="large" />
  </div>
);

const DeviceGuideSection = () => {
  return (
    <section id="section-2" className="content-section">
      <Title level={2} style={{ color: '#1890ff', marginBottom: '24px' }}>
        <ToolOutlined style={{ marginRight: '12px' }} />
        2. HƯỚNG DẪN CHI TIẾT TỪNG THIẾT BỊ - TTDL Hòa Lạc
      </Title>

      {/* TDAV1321A - UNIFLAIR */}
      <div id="section-2-1" className="subsection">
        <LazyDevice Component={TDAV1321A} fallback={<DeviceLoader />} />
      </div>

      {/* TDAV2242A - UNIFLAIR */}
      <div id="section-2-2" className="subsection">
        <LazyDevice Component={TDAV2242A} fallback={<DeviceLoader />} />
      </div>

      {/* TDAV2842A - UNIFLAIR */}
      <div id="section-2-3" className="subsection">
        <LazyDevice Component={TDAV2842A} fallback={<DeviceLoader />} />
      </div>

      {/* FM40H-AGB-ESD-APC */}
      <div id="section-2-4" className="subsection">
        <LazyDevice Component={FM40H} fallback={<DeviceLoader />} />
      </div>

      {/* ACRP102 - APC */}
      <div id="section-2-5" className="subsection">
        <LazyDevice Component={ACRP102} fallback={<DeviceLoader />} />
      </div>

      {/* Quạt sàn AFM4500B */}
      <div id="section-2-6" className="subsection">
        <LazyDevice Component={AFM4500B} fallback={<DeviceLoader />} />
      </div>
    </section>
  );
};

export default DeviceGuideSection; 