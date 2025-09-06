import {
  CloseOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Button, Modal, Slider, Space, Spin, Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { processFileName } from '../../utils/VietnameseFile';

// Component tùy chỉnh để hiển thị hình ảnh qua API
const ImagePreview = ({ image, systemInfoId, style, onLoad, onError }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let url;
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        const token = localStorage.getItem('token');

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/system-info/${systemInfoId}/files/${encodeURIComponent(image.path || image.filename)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Fetch image failed');
        }

        const blob = await res.blob();
        url = window.URL.createObjectURL(blob);
        setImageUrl(url);
        if (onLoad) onLoad();
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
        if (onError) onError();
      } finally {
        setLoading(false);
      }
    };

    if (systemInfoId && image.filename) {
      loadImage();
    }

    return () => {
      if (url) window.URL.revokeObjectURL(url);
    };
  }, [systemInfoId, image.filename, onLoad, onError]);

  if (loading) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
          borderRadius: '4px',
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
          borderRadius: '4px',
          color: '#999',
          fontSize: '14px',
        }}
      >
        <ExclamationCircleOutlined style={{ marginRight: 8 }} />
        Lỗi tải ảnh
      </div>
    );
  }

  return <img src={imageUrl} alt={image.originalName} style={style} />;
};

// CSS styles cho modal preview ảnh
const modalStyles = {
  headerControls: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '8px 16px',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '12px 16px',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  },
  navigationButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0, 0, 0, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      transform: 'translateY(-50%) scale(1.1)',
    },
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'cursor 0.2s ease',
  },
  imageWrapper: {
    transition: 'transform 0.2s ease-out',
    transformOrigin: 'center center',
    willChange: 'transform',
  },
  helpPanel: {
    position: 'absolute',
    top: '50%',
    right: 16,
    transform: 'translateY(-50%)',
    background: 'rgba(0, 0, 0, 0.9)',
    padding: '12px',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '12px',
    lineHeight: '1.4',
    maxWidth: '200px',
    zIndex: 1000,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    opacity: 0.8,
    transition: 'opacity 0.3s ease',
    '&:hover': {
      opacity: 1,
    },
  },
};

const ImagePreviewModal = ({
  visible,
  images,
  title,
  index,
  onClose,
  onPrev,
  onNext,
  onDownload,
  onSetIndex,
  systemInfoId,
}) => {
  console.log('ImagePreviewModal render', { visible, images, index });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showHelp, setShowHelp] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Reset view khi mở modal hoặc chuyển ảnh
  useEffect(() => {
    if (visible) {
      setZoomLevel(1);
      setRotation(0);
      setImagePosition({ x: 0, y: 0 });
      setIsFullscreen(false);
      setShowHelp(false);
      setImageLoading(true);
    }
  }, [visible, index]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    e => {
      if (!visible) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          setIsFullscreen(!isFullscreen);
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoomLevel(prev => Math.min(prev + 0.25, 5));
          break;
        case '-':
          e.preventDefault();
          setZoomLevel(prev => Math.max(prev - 0.25, 0.25));
          break;
        case '0':
          e.preventDefault();
          setZoomLevel(1);
          setImagePosition({ x: 0, y: 0 });
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setRotation(prev => (prev + 90) % 360);
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          setShowHelp(!showHelp);
          break;
      }
    },
    [visible, isFullscreen, showHelp, onPrev, onNext, onClose]
  );

  // Mouse wheel zoom
  const handleWheel = useCallback(
    e => {
      if (!visible) return;
      e.preventDefault();

      const delta = e.deltaY > 0 ? -0.25 : 0.25;
      setZoomLevel(prev => Math.max(0.25, Math.min(5, prev + delta)));
    },
    [visible]
  );

  // Mouse drag handlers
  const handleMouseDown = useCallback(
    e => {
      if (zoomLevel > 1) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
      }
    },
    [zoomLevel, imagePosition]
  );

  const handleMouseMove = useCallback(
    e => {
      if (isDragging && zoomLevel > 1) {
        setImagePosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart, zoomLevel]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset zoom and position
  const resetView = () => {
    setZoomLevel(1);
    setRotation(0);
    setImagePosition({ x: 0, y: 0 });
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Add event listeners
  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('wheel', handleWheel);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [visible, handleKeyDown, handleWheel, handleMouseMove, handleMouseUp]);

  if (!visible || !images || images.length === 0) {
    console.log('ImagePreviewModal return null', { visible, images, imagesLength: images?.length });
    return null;
  }

  const currentImage = images[index];

  return (
    <Modal
      open={visible}
      footer={null}
      onCancel={onClose}
      width={isFullscreen ? '100vw' : 1000}
      styles={{
        body: {
          padding: isFullscreen ? 0 : 24,
          background: '#000',
          height: isFullscreen ? '100vh' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
        mask: {
          background: 'rgba(0, 0, 0, 0.95)',
        },
        wrapper: {
          zIndex: 9999,
        },
      }}
      style={{
        top: isFullscreen ? 0 : undefined,
        padding: isFullscreen ? 0 : undefined,
        maxWidth: isFullscreen ? '100vw' : '90vw',
      }}
    >
      {/* Header controls */}
      <div style={modalStyles.headerControls}>
        <div style={{ color: '#fff', fontSize: '14px' }}>
          {processFileName(currentImage) || title}
        </div>

        <Space>
          <Tooltip title='Phím tắt: R'>
            <Button
              type='text'
              icon={<RotateLeftOutlined />}
              onClick={() => setRotation(prev => (prev - 90) % 360)}
              style={{ color: '#fff' }}
            />
          </Tooltip>
          <Tooltip title='Phím tắt: H'>
            <Button
              type='text'
              icon={<FileTextOutlined />}
              onClick={() => setShowHelp(!showHelp)}
              style={{ color: '#fff' }}
            />
          </Tooltip>
          <Tooltip title='Phím tắt: F'>
            <Button
              type='text'
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={toggleFullscreen}
              style={{ color: '#fff' }}
            />
          </Tooltip>
          <Tooltip title='Phím tắt: ESC'>
            <Button
              type='text'
              icon={<CloseOutlined />}
              onClick={onClose}
              style={{ color: '#fff' }}
            />
          </Tooltip>
        </Space>
      </div>

      {/* Main image container */}
      <div
        style={{
          ...modalStyles.imageContainer,
          cursor: zoomLevel > 1 ? 'grab' : 'default',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <Tooltip title='Phím tắt: ←'>
              <Button
                type='text'
                icon={<LeftOutlined />}
                onClick={onPrev}
                style={{
                  ...modalStyles.navigationButton,
                  left: 16,
                }}
              />
            </Tooltip>
            <Tooltip title='Phím tắt: →'>
              <Button
                type='text'
                icon={<RightOutlined />}
                onClick={onNext}
                style={{
                  ...modalStyles.navigationButton,
                  right: 16,
                }}
              />
            </Tooltip>
          </>
        )}

        {/* Image with zoom and rotation */}
        <div
          style={{
            ...modalStyles.imageWrapper,
            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          <ImagePreview
            image={currentImage}
            systemInfoId={systemInfoId}
            style={{
              maxWidth: isFullscreen ? '90vw' : '80vw',
              maxHeight: isFullscreen ? '90vh' : '70vh',
              objectFit: 'contain',
              background: '#000',
              borderRadius: '4px',
            }}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </div>
      </div>

      {/* Bottom controls */}
      <div style={modalStyles.bottomControls}>
        {/* Zoom controls */}
        <Space>
          <Tooltip title='Phím tắt: -'>
            <Button
              type='text'
              icon={<ZoomOutOutlined />}
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.25))}
              disabled={zoomLevel <= 0.25}
              style={{ color: '#fff' }}
            />
          </Tooltip>

          <div style={{ color: '#fff', minWidth: '60px', textAlign: 'center' }}>
            {Math.round(zoomLevel * 100)}%
          </div>

          <Tooltip title='Phím tắt: +'>
            <Button
              type='text'
              icon={<ZoomInOutlined />}
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 5))}
              disabled={zoomLevel >= 5}
              style={{ color: '#fff' }}
            />
          </Tooltip>
        </Space>

        {/* Zoom slider */}
        <Slider
          min={0.25}
          max={5}
          step={0.25}
          value={zoomLevel}
          onChange={setZoomLevel}
          style={{ width: 120, margin: '0 16px' }}
          tooltip={{ formatter: value => `${Math.round(value * 100)}%` }}
        />

        {/* Action buttons */}
        <Space>
          <Tooltip title='Reset view (Phím tắt: 0)'>
            <Button type='text' onClick={resetView} style={{ color: '#fff' }}>
              Reset
            </Button>
          </Tooltip>

          <Tooltip title='Tải xuống'>
            <Button
              type='primary'
              icon={<DownloadOutlined />}
              onClick={() => onDownload(currentImage)}
            >
              Tải xuống
            </Button>
          </Tooltip>
        </Space>

        {/* Image counter */}
        {images.length > 1 && (
          <div
            style={{
              color: '#fff',
              fontSize: '14px',
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {index + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Keyboard shortcuts help */}
      {showHelp && (
        <div style={modalStyles.helpPanel}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Phím tắt:</div>
          <div>← → : Chuyển ảnh</div>
          <div>+ - : Zoom in/out</div>
          <div>0 : Reset view</div>
          <div>R : Xoay ảnh</div>
          <div>F : Fullscreen</div>
          <div>H : Ẩn/hiện help</div>
          <div>ESC : Đóng</div>
          <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.7 }}>
            Mouse wheel: Zoom
            <br />
            Drag: Di chuyển ảnh
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ImagePreviewModal;
