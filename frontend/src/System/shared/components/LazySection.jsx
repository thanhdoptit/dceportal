import React, { lazy, Suspense, useState } from 'react';
import { Spin, Skeleton } from 'antd';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const LazySection = ({ 
  importFunc, 
  fallback = null,
  placeholder = null,
  threshold = 0.1,
  rootMargin = '100px',
  onLoad = null,
  forceLoad = false
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  // Load component when intersection is detected or forceLoad is true
  React.useEffect(() => {
    if ((isIntersecting || forceLoad) && !shouldLoad) {
      setShouldLoad(true);
      setIsLoading(true);
      
      // Giảm delay để tải nhanh hơn khi forceLoad
      setTimeout(() => {
        importFunc()
          .then((module) => {
            setComponent(() => module.default);
            setIsLoading(false);
            if (onLoad) {
              onLoad();
            }
          })
          .catch((err) => {
            console.error('Lazy loading failed:', err);
            setError(err);
            setIsLoading(false);
          });
      }, forceLoad ? 0 : 100); // Giảm delay từ 200ms xuống 100ms
    }
  }, [isIntersecting, shouldLoad, importFunc, forceLoad]);

  // Default placeholder với animation
  const defaultPlaceholder = (
    <div 
      className="lazy-section-loading"
      style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '2px dashed #d9d9d9',
        borderRadius: '12px',
        margin: '20px 0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer'
      }}
      onClick={() => {
        if (!shouldLoad) {
          setShouldLoad(true);
          setIsLoading(true);
          importFunc()
            .then((module) => {
              setComponent(() => module.default);
              setIsLoading(false);
              if (onLoad) {
                onLoad();
              }
            })
            .catch((err) => {
              console.error('Lazy loading failed:', err);
              setError(err);
              setIsLoading(false);
            });
        }
      }}
    >
      <div style={{ 
        fontSize: '48px', 
        color: '#1890ff', 
        marginBottom: '16px',
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        ⏳
      </div>
      <h3 style={{ 
        color: '#1890ff', 
        marginBottom: '12px',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Cuộn xuống để tải nội dung
      </h3>
      <p style={{ 
        color: '#666', 
        fontSize: '14px',
        margin: 0
      }}>
        Click để tải ngay
      </p>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '2px dashed #d9d9d9',
        borderRadius: '12px',
        margin: '20px 0'
      }}>
        <Spin size="large" />
        <div style={{ 
          marginTop: '16px', 
          color: '#1890ff',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Đang tải nội dung...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: '#fff2f0',
        border: '2px dashed #ff4d4f',
        borderRadius: '12px',
        margin: '20px 0'
      }}>
        <div style={{ 
          fontSize: '48px', 
          color: '#ff4d4f', 
          marginBottom: '16px'
        }}>
          ❌
        </div>
        <h3 style={{ 
          color: '#ff4d4f', 
          marginBottom: '12px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Lỗi tải nội dung
        </h3>
        <p style={{ 
          color: '#666', 
          fontSize: '14px',
          margin: 0
        }}>
          Vui lòng thử lại sau
        </p>
        <button
          onClick={() => {
            setError(null);
            setShouldLoad(false);
            setComponent(null);
          }}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Render component or placeholder
  return (
    <div ref={ref}>
      {Component ? (
        <Suspense fallback={
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            border: '2px dashed #d9d9d9',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <Spin size="large" />
            <div style={{ 
              marginTop: '16px', 
              color: '#1890ff',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Đang tải nội dung...
            </div>
          </div>
        }>
          <Component />
        </Suspense>
      ) : (
        placeholder || defaultPlaceholder
      )}
    </div>
  );
};

export default LazySection;
