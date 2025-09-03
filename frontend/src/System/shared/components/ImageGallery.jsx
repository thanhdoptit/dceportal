import React from 'react';
import { Image, Row, Col } from 'antd';

const { PreviewGroup } = Image;

/**
 * Component ImageGallery - Hiển thị gallery ảnh dạng grid với preview
 * 
 * @param {Object} props - Props của component
 * @param {Array} props.images - Mảng các ảnh
 * @param {number} props.columns - Số cột hiển thị (mặc định: 3)
 * @param {number} props.imageWidth - Chiều rộng mỗi ảnh (mặc định: 200)
 * @param {number} props.imageHeight - Chiều cao mỗi ảnh (mặc định: 150)
 * @param {string} props.maskText - Text hiển thị trên mask (mặc định: "Xem ảnh")
 * @param {string} props.maskClassName - Class name cho mask
 * @param {Object} props.style - Style tùy chỉnh cho container
 * @param {string} props.fallbackText - Text hiển thị khi không có ảnh
 */
const ImageGallery = ({
  images = [],
  columns = 3,
  imageWidth = 200,
  imageHeight = 150,
  maskText = 'Xem ảnh',
  maskClassName = 'custom-mask',
  style = {},
  fallbackText = 'Không có ảnh nào'
}) => {
  // Nếu không có ảnh, hiển thị fallback
  if (!images || images.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        color: '#999',
        ...style 
      }}>
        {fallbackText}
      </div>
    );
  }

  // Tính toán span cho mỗi cột
  const span = 24 / columns;

  return (
    <div style={style}>
      <PreviewGroup
        preview={{
          mask: maskText,
          maskClassName: maskClassName,
        }}
      >
        <Row gutter={[16, 16]}>
          {images.map((image, index) => (
            <Col key={index} span={span}>
              <Image
                src={image.src || image}
                alt={image.alt || `Ảnh ${index + 1}`}
                width={imageWidth}
                height={imageHeight}
                style={{
                  objectFit: 'cover',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
                preview={{
                  mask: maskText,
                  maskClassName: maskClassName
                }}
              />
              {image.caption && (
                <div style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {image.caption}
                </div>
              )}
            </Col>
          ))}
        </Row>
      </PreviewGroup>
    </div>
  );
};

export default ImageGallery;
