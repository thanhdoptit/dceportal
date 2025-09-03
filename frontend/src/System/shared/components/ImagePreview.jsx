import React from 'react';
import { Image } from 'antd';

const { PreviewGroup } = Image;

/**
 * Component ImagePreview - Hiển thị ảnh với tính năng preview
 * Hỗ trợ cả ảnh đơn và nhiều ảnh
 * 
 * @param {Object} props - Props của component
 * @param {string|Array} props.src - Đường dẫn ảnh (string) hoặc mảng ảnh (Array)
 * @param {string} props.alt - Alt text cho ảnh
 * @param {number} props.width - Chiều rộng ảnh
 * @param {number} props.height - Chiều cao ảnh
 * @param {Object} props.style - Style tùy chỉnh
 * @param {string} props.maskText - Text hiển thị trên mask (mặc định: "Xem ảnh")
 * @param {string} props.maskClassName - Class name cho mask
 * @param {boolean} props.showImageCount - Có hiển thị số lượng ảnh không (mặc định: true)
 * @param {string} props.fallbackText - Text hiển thị khi không có ảnh
 */
const ImagePreview = ({
  src,
  alt = 'Hình ảnh',
  width = 100,
  height = 100,
  style = {},
  maskText = 'Xem ảnh',
  maskClassName = 'custom-mask',
  showImageCount = true,
  fallbackText = 'Không có ảnh',
  ...restProps
}) => {
  // Nếu không có src, hiển thị fallback
  if (!src) {
    return <span style={{ color: '#999' }}>{fallbackText}</span>;
  }

  // Nếu src là mảng (nhiều ảnh)
  if (Array.isArray(src) && src.length > 0) {
    return (
      <div style={{ 
        width, 
        height, 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <PreviewGroup
          preview={{
            mask: maskText,
            maskClassName: maskClassName,
          }}
        >
          {src.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`${alt} ${index + 1}`}
              width={width}
              height={height}
              style={{
                objectFit: 'cover',
                borderRadius: '4px',
                display: index === 0 ? 'block' : 'none', // Chỉ hiển thị ảnh đầu tiên
                ...style
              }}
              preview={{
                mask: maskText,
                maskClassName: maskClassName
              }}
              {...restProps}
            />
          ))}
        </PreviewGroup>
        
        {/* Hiển thị số lượng ảnh nếu có nhiều hơn 1 ảnh */}
        {showImageCount && src.length > 1 && (
          <div style={{
            position: 'absolute',
            top: 2,
            right: 2,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            {src.length} ảnh
          </div>
        )}
      </div>
    );
  }

  // Nếu src là string (một ảnh)
  if (typeof src === 'string') {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          objectFit: 'cover',
          borderRadius: '4px',
          ...style
        }}
        preview={{
          mask: maskText,
          maskClassName: maskClassName
        }}
        {...restProps}
      />
    );
  }

  // Fallback
  return <span style={{ color: '#999' }}>{fallbackText}</span>;
};

export default ImagePreview;
