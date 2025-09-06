import { Divider, Progress, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import { LazySection } from '../shared';
// Import CSS từ shared - Đảm bảo thứ tự import đúng
import '../shared/styles/SystemLayout.css';
import '../shared/styles/SystemSection.css';
import '../shared/styles/SystemTemplate.css';

const { Title } = Typography;

const ElectricContent = () => {
  const { sidebarReady, isAnimating } = useSidebar();
  const [loadedSections, setLoadedSections] = useState(0);
  const [forceLoadAll, setForceLoadAll] = useState(false);

  // Định nghĩa các sections dựa trên menu mới
  const sections = [
    {
      id: 'introduction',
      name: 'Giới thiệu chung',
      importFunc: () => import('./sections/IntroductionSection'),
      description: 'Tổng quan hệ thống điện, sơ đồ đơn tuyến, cấu trúc và tiêu chuẩn',
    },
    {
      id: 'low-voltage',
      name: 'Tủ điện hạ thế',
      importFunc: () => import('./sections/LowVoltageSection'),
      description: 'Các loại tủ điện ACIT, Blokset, máy cắt ACB, MCCB, MCB, RCBO & RCCB',
    },
    {
      id: 'protection',
      name: 'Hệ thống bảo vệ',
      importFunc: () => import('./sections/ProtectionSection'),
      description: 'Bảo vệ quá dòng, chạm đất, ngắn mạch và các thiết bị bảo vệ',
    },
    {
      id: 'control',
      name: 'Hệ thống điều khiển',
      importFunc: () => import('./sections/ControlSection'),
      description: 'PLC điều khiển, hệ thống ATS, điều khiển máy phát',
    },
    {
      id: 'lighting',
      name: 'Hệ thống chiếu sáng',
      importFunc: () => import('./sections/LightingSection'),
      description: 'Chiếu sáng chung, khẩn cấp, hệ thống ổ cắm và công tắc',
    },
    {
      id: 'cable',
      name: 'Hệ thống cáp và máng',
      importFunc: () => import('./sections/CableSection'),
      description: 'Thang máng cáp, cáp điện lực, cáp điều khiển và kéo cáp',
    },
    {
      id: 'operation',
      name: 'Vận hành và bảo trì',
      importFunc: () => import('./sections/OperationSection'),
      description: 'Quy trình vận hành, kiểm tra hệ thống dự phòng, bảo trì định kỳ',
    },
    {
      id: 'documentation',
      name: 'Tài liệu và tiêu chuẩn',
      importFunc: () => import('./sections/DocumentationSection'),
      description: 'Tiêu chuẩn Việt Nam, quốc tế và chứng nhận sản phẩm',
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
      console.log(`Electric Section loaded. Total: ${newCount}/${sections.length}`);
      return newCount;
    });
  };

  // Add error handling for section loading
  const handleSectionError = (sectionName, error) => {
    console.error(`Error loading section ${sectionName}:`, error);
  };

  // Hiển thị loading khi sidebar đang animating
  if (isAnimating || !sidebarReady) {
    return (
      <div className='loading-container'>
        <div style={{ textAlign: 'center' }}>
          <Spin size='large' />
          <p className='loading-text'>Đang tải tài liệu hệ thống điện...</p>
        </div>
      </div>
    );
  }

  // Tính toán progress
  const progressPercent = Math.round((loadedSections / sections.length) * 100);

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
                  Đang tải nội dung
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
            Tất cả nội dung đã được tải xong!
          </p>
        </div>
      )}
    </>
  );
};

export default ElectricContent;
