import { Divider, Progress, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import { LazySection } from '../shared';
// Import CSS từ shared - Đảm bảo thứ tự import đúng
import '../shared/styles/SystemLayout.css';
import '../shared/styles/SystemSection.css';
import '../shared/styles/SystemTemplate.css';

const UPSContent = () => {
  const { sidebarReady, isAnimating } = useSidebar();
  const [loadedSections, setLoadedSections] = useState(0);
  const [forceLoadAll, setForceLoadAll] = useState(false);

  // Section configurations với ID tương ứng với menu - tối ưu loading cho UPS Vân Canh
  const sections = [
    {
      id: '1',
      name: 'Giới thiệu chung',
      importFunc: () => import('./sections/IntroductionSection'),
      priority: 'high',
      preload: true, // Preload section đầu tiên
      subsections: ['1.1', '1.2', '1.3', '1.4'],
    },
    {
      id: '2',
      name: 'Hệ thống UPS Galaxy VL',
      importFunc: () => import('./sections/GalaxyVLSection'),
      priority: 'high',
      preload: false,
      subsections: [
        '2.1',
        '2.1.1',
        '2.1.2',
        '2.1.3',
        '2.2',
        '2.2.1',
        '2.2.2',
        '2.2.3',
        '2.3',
        '2.3.1',
        '2.3.2',
        '2.3.3',
        '2.4',
        '2.4.1',
        '2.4.2',
        '2.4.3',
      ],
    },
    {
      id: '3',
      name: 'Hệ thống ắc quy & BMS',
      importFunc: () => import('./sections/BatteryBMSSection'),
      priority: 'high',
      preload: false,
      subsections: ['3.1', '3.1.1', '3.1.2', '3.1.3', '3.2', '3.2.1', '3.2.2', '3.2.3'],
    },
    {
      id: '4',
      name: 'Giám sát & Điều khiển',
      importFunc: () => import('./sections/MonitoringSection'),
      priority: 'medium',
      preload: false,
      subsections: ['4.1', '4.1.1', '4.1.2', '4.1.3', '4.2', '4.2.1', '4.2.2', '4.2.3'],
    },
    {
      id: '5',
      name: 'Quy trình vận hành',
      importFunc: () => import('./sections/OperationSection'),
      priority: 'medium',
      preload: false,
      subsections: [
        '5.1',
        '5.1.1',
        '5.1.2',
        '5.1.3',
        '5.1.4',
        '5.1.5',
        '5.1.6',
        '5.1.7',
        '5.1.8',
        '5.1.9',
        '5.1.10',
        '5.1.11',
        '5.1.12',
      ],
    },
    {
      id: '6',
      name: 'Xử lý sự cố & Khắc phục',
      importFunc: () => import('./sections/TroubleshootingSection'),
      priority: 'medium',
      preload: false,
      subsections: ['6.1', '6.1.1', '6.1.2', '6.1.3', '6.2', '6.2.1', '6.2.2', '6.2.3'],
    },
  ];

  // Preload section đầu tiên khi sidebar đã sẵn sàng
  useEffect(() => {
    if (sidebarReady && !isAnimating) {
      const firstSection = sections.find(s => s.preload);
      if (firstSection) {
        firstSection.importFunc().then(() => {
          setLoadedSections(1);
        });
      }
    }
  }, [sidebarReady, isAnimating]);

  // Force load tất cả sections khi sidebar đã sẵn sàng
  useEffect(() => {
    if (sidebarReady && !isAnimating) {
      // Delay nhỏ để đảm bảo preload hoàn thành
      const timer = setTimeout(() => {
        setForceLoadAll(true);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [sidebarReady, isAnimating]);

  const handleSectionLoad = () => {
    setLoadedSections(prev => {
      const newCount = prev + 1;
      return newCount;
    });
  };

  // Add error handling for section loading
  const handleSectionError = (sectionName, error) => {
    console.error(`Error loading UPS section ${sectionName}:`, error);
  };

  const progressPercent = Math.round((loadedSections / sections.length) * 100);

  // Hiển thị loading khi sidebar đang animating
  if (isAnimating || !sidebarReady) {
    return (
      <div className='system-content'>
        <div className='loading-container'>
          <div style={{ textAlign: 'center' }}>
            <Spin size='large' />
            <p className='loading-text'>Đang tải tài liệu hệ thống UPS & ắc quy BMS...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Progress Indicator - Sử dụng CSS từ shared */}
      {loadedSections < sections.length && (
        <div className='progress-indicator'>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              >
                ⚡
              </div>
              <div>
                <h4
                  style={{
                    margin: 0,
                    color: '#1890ff',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  Đang tải nội dung hệ thống UPS
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: '#666',
                    fontSize: '12px',
                  }}
                >
                  {loadedSections}/{sections.length} phần đã sẵn sàng
                </p>
              </div>
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1890ff',
              }}
            >
              {progressPercent}%
            </div>
          </div>
          <Progress
            percent={progressPercent}
            strokeColor={{
              '0%': '#1890ff',
              '100%': '#0072BC',
            }}
            trailColor='#e8e8e8'
            size={[8, 8]}
            showInfo={false}
            style={{
              margin: 0,
            }}
          />
        </div>
      )}

      {/* Sections - Sử dụng LazySection cho tất cả */}
      {sections.map((section, index) => (
        <div key={index} id={`section-${section.id}`} style={{ scrollMarginTop: '20px' }}>
          <LazySection
            importFunc={section.importFunc}
            forceLoad={forceLoadAll}
            placeholder={
              <div
                style={{
                  padding: '30px',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  border: '2px dashed #d9d9d9',
                  borderRadius: '12px',
                  margin: '20px 0',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                className='lazy-section-placeholder'
              >
                <div
                  style={{
                    fontSize: '36px',
                    color: '#1890ff',
                    marginBottom: '12px',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  ⏳
                </div>
                <h3
                  style={{
                    color: '#1890ff',
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {section.name}
                </h3>
                <p
                  style={{
                    color: '#666',
                    fontSize: '12px',
                    margin: 0,
                  }}
                >
                  Cuộn xuống để tải nội dung
                </p>
              </div>
            }
            threshold={0.1}
            rootMargin='100px'
            onLoad={handleSectionLoad}
            onError={() => handleSectionError(section.name, 'Failed to load section')}
          />
          {index < sections.length - 1 && (
            <Divider
              style={{
                margin: '32px 0',
                borderColor: '#e8e8e8',
                opacity: 0.6,
              }}
            />
          )}
        </div>
      ))}

      {/* Completion message */}
      {loadedSections === sections.length && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)',
            border: '1px solid #b7eb8f',
            borderRadius: '8px',
            margin: '20px 0',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
          <p style={{ margin: 0, color: '#52c41a', fontWeight: '600' }}>
            Tất cả nội dung hệ thống UPS & ắc quy BMS đã được tải xong!
          </p>
        </div>
      )}
    </>
  );
};

export default UPSContent;
