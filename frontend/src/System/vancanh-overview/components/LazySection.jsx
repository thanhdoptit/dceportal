import { memo, useCallback, useEffect, useRef, useState } from 'react';
import SectionLoadingPlaceholder from '../../../components/common/SectionLoadingPlaceholder';
import { useVanCanhData } from '../context';

/**
 * Component LazySection - Tối ưu rendering cho các section
 * Chỉ render section khi nó sắp hiển thị trên màn hình VÀ data đã sẵn sàng
 */
const LazySection = memo(
  ({
    sectionId,
    threshold = 0.1,
    rootMargin = '200px 0px', // Tăng rootMargin để load sớm hơn
  }) => {
    const { isFullyLoaded } = useVanCanhData();
    const [hasBeenVisible, setHasBeenVisible] = useState(false);
    const sectionRef = useRef(null);
    const observerRef = useRef(null);

    // Memoize callback để tránh re-create
    const handleIntersection = useCallback(
      ([entry]) => {
        // Chỉ render khi data đã sẵn sàng VÀ section sắp visible
        if (entry.isIntersecting && !hasBeenVisible && isFullyLoaded) {
          setHasBeenVisible(true);
          // Disconnect observer sau khi đã visible để tối ưu performance
          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }
        }
      },
      [hasBeenVisible, isFullyLoaded]
    );

    useEffect(() => {
      // Chỉ tạo observer nếu chưa visible VÀ data đã sẵn sàng
      if (!hasBeenVisible && sectionRef.current && isFullyLoaded) {
        observerRef.current = new IntersectionObserver(handleIntersection, {
          threshold,
          rootMargin,
        });

        observerRef.current.observe(sectionRef.current);
      }

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      };
    }, [threshold, rootMargin, handleIntersection, hasBeenVisible, isFullyLoaded]);

    return (
      <div
        ref={sectionRef}
        id={sectionId}
        className='section-wrapper'
        style={{ minHeight: '200px' }}
      >
        {hasBeenVisible && (
          <div className='section-content'>
            <Component />
          </div>
        )}
        {!hasBeenVisible && (
          <SectionLoadingPlaceholder
            title={isFullyLoaded ? 'Đang tải nội dung...' : 'Chờ dữ liệu...'}
            icon='🏢'
            color='#722ed1'
          />
        )}
      </div>
    );
  }
);

LazySection.displayName = 'LazySection';

export default LazySection;
