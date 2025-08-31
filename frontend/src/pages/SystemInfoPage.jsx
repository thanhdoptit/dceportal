import React, { useState, useEffect } from 'react';
import { Card, Typography, Divider, List, Tag, Space, Alert, Row, Col, Spin, Button, Image, Input, Modal, Slider, Tooltip } from 'antd';
import '../styles/ImagePreview.css';
import {
  ThunderboltOutlined,
  SafetyOutlined,
  ToolOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  FileTextOutlined,
  SearchOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { processFileName } from '../utils/VietnameseFile';
import ImagePreviewModal from '../components/common/ImagePreviewModal';

const { Title, Paragraph, Text } = Typography;

// Dữ liệu mặc định cho UPS system
const defaultUPSData = {
  title: "Hệ thống UPS (Uninterruptible Power Supply)",
  subtitle: "Hệ thống cung cấp điện liên tục cho trung tâm dữ liệu",
  content: `# Hệ thống UPS (Uninterruptible Power Supply)

## Mục đích
Hệ thống UPS đảm bảo cung cấp điện liên tục cho các thiết bị quan trọng trong trung tâm dữ liệu, bảo vệ khỏi các sự cố điện và đảm bảo hoạt động ổn định.

- Cung cấp điện dự phòng khi mất điện lưới
- Lọc và ổn định điện áp
- Bảo vệ thiết bị khỏi sự cố điện
- Đảm bảo thời gian chuyển đổi nhanh chóng

## ... (bạn có thể bổ sung thêm nội dung mẫu ở đây) ...`
};

// Component tùy chỉnh để hiển thị hình ảnh qua API
const ImagePreview = ({ image, systemInfoId, style, onClick }) => {
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
        console.log('🔍 ImagePreview - Token:', token ? 'Có token' : 'Không có token');
        console.log('🔍 ImagePreview - Loading image:', image.filename);
        console.log('🔍 ImagePreview - SystemInfoId:', systemInfoId);
        console.log('🔍 ImagePreview - Image path:', image.path);
        console.log('🔍 ImagePreview - Full URL:', `${import.meta.env.VITE_API_URL}/api/system-info/${systemInfoId}/files/${image.filename}`);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/system-info/${systemInfoId}/files/${image.filename}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('🔍 ImagePreview - Response status:', res.status);
        if (!res.ok) {
          console.error('🔍 ImagePreview - Response not ok:', res.status, res.statusText);
          throw new Error('Fetch image failed');
        }
        const blob = await res.blob();
        url = window.URL.createObjectURL(blob);
        setImageUrl(url);
        console.log('🔍 ImagePreview - Image loaded successfully');
      } catch (err) {
        console.error('Error loading image (fetch):', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (systemInfoId && image.filename) loadImage();
    return () => {
      if (url) window.URL.revokeObjectURL(url);
    };
  }, [systemInfoId, image.filename]);

  if (loading) return (
    <div style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f0f0',
      borderRadius: '4px'
    }}>
      <Spin size="large" />
    </div>
  );

  if (error) return (
    <div style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f0f0',
      borderRadius: '4px',
      color: '#999',
      fontSize: '14px'
    }}>
      <ExclamationCircleOutlined style={{ marginRight: 8 }} />
      Lỗi tải ảnh
    </div>
  );

  return (
    <img
      src={imageUrl}
      alt={image.originalName}
      style={style}
      onClick={(e) => {
        console.log('Image clicked', image, onClick);
        if (onClick) onClick(e);
      }}
    />
  );
};

const SystemInfoPage = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [systemList, setSystemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const { systemType } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [currentPreviewImages, setCurrentPreviewImages] = useState([]);
  const [currentPreviewTitle, setCurrentPreviewTitle] = useState('');


  // Hàm helper để lấy prefix route theo role
  const getRoutePrefix = () => {
    if (!currentUser) return '/dc';
    const role = currentUser.role?.toLowerCase();
    switch (role) {
      case 'manager':
        return '/manager';
      case 'be':
        return '/be';
      case 'datacenter':
      default:
        return '/dc';
    }
  };

  // Hàm navigate đến chi tiết hệ thống
  const navigateToSystemDetail = (systemType) => {
    const prefix = getRoutePrefix();
    const targetPath = `${prefix}/system-info/${systemType}`;
    console.log('SystemInfoPage - Navigating to:', targetPath);
    console.log('SystemInfoPage - Current user:', currentUser);
    console.log('SystemInfoPage - System type:', systemType);
    navigate(targetPath);
  };

  // Load danh sách hệ thống nếu không có systemType
  const loadSystemList = async () => {
    setLoading(true);
    setError(null);
    setDataReady(false);
    try {
      const response = await api.get('/api/system-info');
      if (response.data.success && Array.isArray(response.data.data)) {
        setSystemList(response.data.data);
        setDataReady(true);
      } else {
        setError('Không lấy được danh sách hệ thống.');
      }
    } catch {
      setError('Lỗi kết nối server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Load thông tin hệ thống chi tiết
  const loadSystemInfo = async () => {
    setLoading(true);
    setError(null);
    setDataReady(false);
    try {
      console.log('🔍 SystemInfoPage - Loading system info for type:', systemType);

      // Thử load từ API theo systemType
      const response = await api.get(`/api/system-info/type/${systemType || 'ups'}`);
      console.log('🔍 SystemInfoPage - API response:', response.data);

      if (response.data.success && response.data.data) {
        const apiData = response.data.data;
        console.log('🔍 SystemInfoPage - API data:', apiData);

        let parsedContent = apiData.content;
        if (typeof parsedContent === 'string') {
          try {
            parsedContent = JSON.parse(parsedContent);
          } catch {
            parsedContent = {};
          }
        }

        console.log('🔍 SystemInfoPage - Parsed content:', parsedContent);

        // Fallback: nếu content không có dữ liệu, tạo từ các trường riêng lẻ
        if (!parsedContent || Object.keys(parsedContent).length === 0) {
          parsedContent = {
            purpose: { description: apiData.purpose || '', items: [], files: [] },
            components: { items: [], files: [] },
            operation: { normal: { steps: [], files: [] }, backup: { steps: [], files: [] } },
            procedures: { items: [], files: [] },
            troubleshooting: { description: apiData.troubleshooting || '', items: [], files: [] }
          };
        }

        setSystemInfo({
          ...apiData,
          content: parsedContent
        });
        setDataReady(true);
        console.log('🔍 SystemInfoPage - System info set successfully');
        return;
      }

      // Nếu không có dữ liệu từ API, thử load tất cả và tìm theo systemType
      console.log('🔍 SystemInfoPage - No data found by type, trying to load all...');
      const allResponse = await api.get('/api/system-info');
      if (allResponse.data.success && Array.isArray(allResponse.data.data)) {
        const allSystems = allResponse.data.data;
        console.log('🔍 SystemInfoPage - All systems:', allSystems);

        // Tìm system theo systemType
        const foundSystem = allSystems.find(system =>
          system.systemType?.toLowerCase() === systemType?.toLowerCase()
        );

        if (foundSystem) {
          console.log('🔍 SystemInfoPage - Found system by type:', foundSystem);
          let parsedContent = foundSystem.content;
          if (typeof parsedContent === 'string') {
            try {
              parsedContent = JSON.parse(parsedContent);
            } catch {
              parsedContent = {};
            }
          }

          setSystemInfo({
            ...foundSystem,
            content: parsedContent
          });
          setDataReady(true);
          return;
        }
      }

      // Nếu không tìm thấy, sử dụng dữ liệu mặc định
      console.log('🔍 SystemInfoPage - Using default data');
      setSystemInfo(defaultUPSData);
      setDataReady(true);
    } catch (error) {
      console.error('🔍 SystemInfoPage - Error loading system info:', error);
      if (error.response?.status === 404) {
        setSystemInfo(defaultUPSData);
        setDataReady(true);
      } else {
        setError('Lỗi kết nối server. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset dataReady khi component mount hoặc systemType thay đổi
    setDataReady(false);

    if (!systemType) {
      loadSystemList();
    } else {
      loadSystemInfo();
    }
    // eslint-disable-next-line
  }, [systemType]);

  // Đảm bảo luôn có dữ liệu để hiển thị
  const displayData = systemInfo || defaultUPSData;

  // Lấy documents và images từ content JSON - hỗ trợ cả cấu trúc cũ và mới
  const getFilesFromContent = (section) => {
    if (!displayData.content || typeof displayData.content !== 'object') return [];

    // Cấu trúc mới: files trong từng item của section
    if (section === 'components' && displayData.content.components?.items) {
      const allFiles = [];
      displayData.content.components.items.forEach(item => {
        if (item.images) allFiles.push(...item.images);
        if (item.documents) allFiles.push(...item.documents);
      });
      return allFiles;
    }

    if (section === 'procedures' && displayData.content.procedures?.items) {
      const allFiles = [];
      displayData.content.procedures.items.forEach(item => {
        if (item.images) allFiles.push(...item.images);
        if (item.documents) allFiles.push(...item.documents);
      });
      return allFiles;
    }

    if (section === 'troubleshooting' && displayData.content.troubleshooting?.items) {
      const allFiles = [];
      displayData.content.troubleshooting.items.forEach(item => {
        if (item.images) allFiles.push(...item.images);
        if (item.documents) allFiles.push(...item.documents);
      });
      return allFiles;
    }

    if (section === 'operation' && displayData.content.operation?.items) {
      const allFiles = [];
      displayData.content.operation.items.forEach(item => {
        if (item.images) allFiles.push(...item.images);
        if (item.documents) allFiles.push(...item.documents);
      });
      return allFiles;
    }

    // Section general: files trực tiếp trong section (cấu trúc đặc biệt)
    if (section === 'general' && displayData.content.general?.files) {
      return displayData.content.general.files;
    }

    // Cấu trúc cũ: files trực tiếp trong section
    return displayData.content[section]?.files || [];
  };

  const generalFiles = getFilesFromContent('general');

  // Tách images và documents từ files
  const separateFiles = (files) => {
    const images = [];
    const documents = [];
    files.forEach(file => {
      // Xử lý file từ section general (có response object)
      let fileData = file;
      if (file.response) {
        fileData = file.response;
      }

      if (fileData.mimetype && fileData.mimetype.startsWith('image/')) {
        images.push(fileData);
      } else {
        documents.push(fileData);
      }
    });
    return { images, documents };
  };

  const generalImages = separateFiles(generalFiles).images;
  const generalDocuments = separateFiles(generalFiles).documents;

  // Debug tài liệu chung (có thể xóa sau khi test xong)
  // console.log('🔍 General files:', generalFiles);
  // console.log('🔍 General images:', generalImages);
  // console.log('🔍 General documents:', generalDocuments);

  // Đảm bảo content là object để render JSON
  let contentObj = null;

  // Kiểm tra an toàn trước khi truy cập content
  if (displayData && displayData.content) {
    if (typeof displayData.content === 'object') {
      contentObj = displayData.content;
    }
  }

  function cleanArray(arr) {
    return Array.isArray(arr) ? arr.filter(item => item !== null && item !== undefined) : [];
  }

  // Kiểm tra an toàn trước khi truy cập properties
  if (contentObj) {
    if (contentObj.purpose && Array.isArray(contentObj.purpose.items)) {
      contentObj.purpose.items = cleanArray(contentObj.purpose.items);
    }
    if (contentObj.components && Array.isArray(contentObj.components.items)) {
      contentObj.components.items = cleanArray(contentObj.components.items);
    }
    if (contentObj.operation) {
      if (contentObj.operation.normal && Array.isArray(contentObj.operation.normal.steps)) {
        contentObj.operation.normal.steps = cleanArray(contentObj.operation.normal.steps);
      }
      if (contentObj.operation.backup && Array.isArray(contentObj.operation.backup.steps)) {
        contentObj.operation.backup.steps = cleanArray(contentObj.operation.backup.steps);
      }
    }
    if (contentObj.procedures && Array.isArray(contentObj.procedures.items)) {
      contentObj.procedures.items = cleanArray(contentObj.procedures.items);
    }
    if (contentObj.troubleshooting && Array.isArray(contentObj.troubleshooting.items)) {
      contentObj.troubleshooting.items = cleanArray(contentObj.troubleshooting.items);
    }
  }

  // Hàm download file qua API (bảo mật, có token)
  const handleDownloadImage = async (image) => {
    try {
      console.log('🔍 Download image:', image);
      console.log('🔍 Image path:', image.path);
      console.log('🔍 SystemInfo ID:', systemInfo?.id);

      if (!image.path) {
        console.error('❌ Image path is undefined:', image);
        return;
      }

      const response = await api.get(`/api/system-info/${systemInfo.id}/files/${encodeURIComponent(image.path)}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: image.mimetype || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = processFileName(image);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download image error:', error);
    }
  };

  // Hàm xác định username được phép chỉnh sửa nội dung hệ thống
  const canEditSystemInfo = (username) => {
    // Danh sách username được phép chỉnh sửa
    const allowedUsernames = [
      'dce1',
      'dopt'
    ];

    // Kiểm tra username có trong danh sách không
    return allowedUsernames.includes(username?.toLowerCase());
  };

  // Hàm download file qua API (bảo mật, có token) - cho documents
  const handleDownloadDocument = async (doc) => {
    try {
      console.log('🔍 Download document:', doc);
      console.log('🔍 Document path:', doc.path);
      console.log('🔍 SystemInfo ID:', systemInfo?.id);

      if (!doc.path) {
        console.error('❌ Document path is undefined:', doc);
        return;
      }

      const response = await api.get(`/api/system-info/${systemInfo.id}/files/${encodeURIComponent(doc.path)}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: doc.mimetype || 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = processFileName(doc);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download document error:', error);
    }
  };

  // Hàm mở preview với ảnh từ mục cụ thể
  const openPreview = (images, title, index = 0) => {
    console.log('openPreview called', { images, title, index });
    setCurrentPreviewImages(images);
    setCurrentPreviewTitle(title);
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  // Hàm chuyển ảnh
  const nextImage = () => {
    setPreviewIndex((previewIndex + 1) % currentPreviewImages.length);
  };

  const prevImage = () => {
    setPreviewIndex((previewIndex - 1 + currentPreviewImages.length) % currentPreviewImages.length);
  };





  // Nếu không có systemType: Hiển thị danh sách hệ thống
  if (!systemType) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ color: '#1890ff', marginBottom: 24 }}>
          <ThunderboltOutlined style={{ marginRight: 12 }} />
          Danh sách hệ thống kỹ thuật trung tâm dữ liệu
        </Title>
        <Input
          placeholder="Tìm kiếm theo tên hệ thống..."
          prefix={<SearchOutlined />}
          style={{ marginBottom: 24, maxWidth: 400 }}
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {loading || !dataReady ? (
          <Spin size="large" />
        ) : error ? (
          <Alert message="Lỗi" description={error} type="error" showIcon />
        ) : (
          <Row gutter={[24, 24]}>
            {/* Cột 1: Hệ thống có ID từ 1-8 */}
            <Col xs={24} md={12}>
              <Card title="Hệ thống chính (ID: 1-8)" style={{ marginBottom: '16px' }}>
                {systemList
                  .filter(sys => sys.id >= 1 && sys.id <= 8)
                  .filter(sys =>
                    !search ||
                    sys.title?.toLowerCase().includes(search.toLowerCase()) ||
                    sys.subtitle?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((sys, idx) => (
                    <Card
                      key={sys.id || idx}
                      size="small"
                      title={`${sys.title}`}
                      extra={
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => navigateToSystemDetail(sys.systemType)}
                        >
                          Xem
                        </Button>
                      }
                      style={{ marginBottom: '12px' }}
                      hoverable
                    >
                      <Paragraph type="secondary" style={{ marginBottom: '8px' }}>
                        {sys.subtitle}
                      </Paragraph>

                    </Card>
                  ))}
              </Card>
            </Col>

            {/* Cột 2: Hệ thống có ID từ 9-16 */}
            <Col xs={24} md={12}>
              <Card title="Hệ thống phụ trợ (ID: 9-15)" style={{ marginBottom: '16px' }}>
                {systemList
                  .filter(sys => sys.id >= 9 && sys.id <= 15)
                  .filter(sys =>
                    !search ||
                    sys.title?.toLowerCase().includes(search.toLowerCase()) ||
                    sys.subtitle?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((sys, idx) => (
                    <Card
                      key={sys.id || idx}
                      size="small"
                      title={`${sys.id}. ${sys.title}`}
                      extra={
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          onClick={() => navigateToSystemDetail(sys.systemType)}
                        >
                          Xem
                        </Button>
                      }
                      style={{ marginBottom: '12px' }}
                      hoverable
                    >
                      <Paragraph type="secondary" style={{ marginBottom: '8px' }}>
                        {sys.subtitle}
                      </Paragraph>

                    </Card>
                  ))}
              </Card>
            </Col>
          </Row>
        )}
      </div>
    );
  }

  // Nếu có systemType: Hiển thị chi tiết như cũ
  if (loading || !dataReady) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải thông tin hệ thống...</div>
      </div>
    );
  }

  if (error && !systemInfo) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
        />
        <Button
          type="primary"
          style={{ marginTop: '16px' }}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {console.log('🔍 Main return statement rendered, previewVisible:', previewVisible)}
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1} style={{ color: '#1890ff', marginBottom: '8px' }}>
          <ThunderboltOutlined style={{ marginRight: '12px' }} />
          {displayData.title}
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          {displayData.subtitle}
        </Text>
        {/* Nút chỉnh sửa cho admin/manager - chỉ hiển thị khi có dữ liệu thực từ API */}
        {canEditSystemInfo(currentUser?.username) && systemInfo && systemInfo.id && (
          <div style={{ marginTop: '16px' }}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ backgroundColor: '#003c71', borderColor: '#003c71' }}
              onClick={() => {
                let rolePrefix = '/dc';
                if (currentUser?.role?.toLowerCase() === 'manager') rolePrefix = '/manager';
                if (currentUser?.role?.toLowerCase() === 'be') rolePrefix = '/be';

                console.log('Edit button clicked - systemInfo:', systemInfo);
                console.log('systemInfo.id:', systemInfo.id);

                // Điều hướng đến trang edit với ID
                console.log('Navigating to edit page with ID:', systemInfo.id);
                navigate(`${rolePrefix}/system-info/edit/${systemInfo.id}`);
              }}
            >
              Chỉnh sửa nội dung
            </Button>
          </div>
        )}


      </div>

      {/* Nội dung chi tiết động hoặc markdown */}
      {contentObj ? (
        <>
          {/* Mục đích */}
          {contentObj.purpose && (
            <Card title={`🎯 ${contentObj.purpose.title || 'Mục đích'}`} style={{ marginBottom: '24px' }}>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                {contentObj.purpose.description}
              </Paragraph>
              {contentObj.purpose.items && (
                <List
                  dataSource={contentObj.purpose.items}
                  renderItem={(item) => (
                    <List.Item style={{ border: 'none', padding: '4px 0' }}>
                      <Text>• {item}</Text>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          )}

          {/* Thành phần chính */}
          {contentObj.components && (
            <Card title={`🔧 ${contentObj.components.title || 'Thành phần chính'}`} style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                {contentObj.components.items?.map((component, index) => (
                  <Col xs={24} md={12} key={index}>
                    <Card size="small" title={component.name} style={{ height: '100%' }}>
                      <Paragraph>
                        <Text strong>Chức năng:</Text> {component.description}
                      </Paragraph>
                      {component.tag && <Tag color="blue">{component.tag}</Tag>}

                      {/* Hiển thị ảnh của thành phần */}
                      {component.images && component.images.filter(img => img.filename).length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <Text strong>Hình ảnh:</Text>
                          <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
                            {component.images.filter(img => img.filename).map((image, imgIndex) => (
                              <Col span={8} key={imgIndex}>
                                <ImagePreview
                                  image={image}
                                  systemInfoId={systemInfo?.id}
                                  style={{
                                    width: '100%',
                                    height: '80px',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                    borderRadius: '4px'
                                  }}
                                  onClick={() => {
                                    openPreview(component.images.filter(img => img.filename), component.name, imgIndex);
                                  }}
                                />
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}

                      {/* Hiển thị tài liệu của thành phần */}
                      {component.documents && component.documents.filter(doc => doc.filename).length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <Text strong>Tài liệu:</Text>
                          <List
                            size="small"
                            dataSource={component.documents.filter(doc => doc.filename)}
                            renderItem={(doc) => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Space>
                                  <FileTextOutlined />
                                  <Text>{processFileName(doc)}</Text>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownloadDocument(doc)}
                                  >
                                    Tải
                                  </Button>
                                </Space>
                              </List.Item>
                            )}
                          />
                        </div>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}

          {/* Quy trình vận hành */}
          {contentObj.procedures && (
            <Card title={`📋 ${contentObj.procedures.title || 'Quy trình vận hành'}`} style={{ marginBottom: '24px' }}>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
                {contentObj.procedures.description}
              </Paragraph>
              <List
                dataSource={contentObj.procedures.items}
                renderItem={(section) => (
                  <List.Item>
                    <Card size="small" title={section.title} style={{ width: '100%' }}>
                      <List
                        size="small"
                        dataSource={section.steps}
                        renderItem={(step, stepIndex) => (
                          <List.Item style={{ border: 'none', padding: '4px 0' }}>
                            <Text>{stepIndex + 1}. {step}</Text>
                          </List.Item>
                        )}
                      />

                      {/* Hiển thị ảnh của quy trình */}
                      {section.images && section.images.filter(img => img.filename).length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <Text strong>Hình ảnh:</Text>
                          <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
                            {section.images.filter(img => img.filename).map((image, imgIndex) => (
                              <Col span={8} key={imgIndex}>
                                <ImagePreview
                                  image={image}
                                  systemInfoId={systemInfo?.id}
                                  style={{
                                    width: '100%',
                                    height: '80px',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                    borderRadius: '4px'
                                  }}
                                  onClick={() => {
                                    openPreview(section.images.filter(img => img.filename), section.title, imgIndex);
                                  }}
                                />
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}

                      {/* Hiển thị tài liệu của quy trình */}
                      {section.documents && section.documents.filter(doc => doc.filename).length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <Text strong>Tài liệu:</Text>
                          <List
                            size="small"
                            dataSource={section.documents.filter(doc => doc.filename)}
                            renderItem={(doc) => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Space>
                                  <FileTextOutlined />
                                  <Text>{processFileName(doc)}</Text>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownloadDocument(doc)}
                                  >
                                    Tải
                                  </Button>
                                </Space>
                              </List.Item>
                            )}
                          />
                        </div>
                      )}
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Nguyên lý hoạt động */}
          {contentObj.operation && (
            <Card title={`⚡ ${contentObj.operation.title || 'Nguyên lý hoạt động'}`} style={{ marginBottom: '24px' }}>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
                {contentObj.operation.description}
              </Paragraph>
              <Row gutter={[24, 16]}>
                {contentObj.operation.items && contentObj.operation.items.map((operation, index) => (
                  <Col xs={24} md={12} key={index}>
                    <Card size="small" title={operation.title} style={{ height: '100%' }}>
                      <Paragraph style={{ marginBottom: '16px' }}>
                        {operation.description}
                      </Paragraph>
                      <List
                        size="small"
                        dataSource={operation.steps}
                        renderItem={(item, stepIndex) => (
                          <List.Item style={{ border: 'none', padding: '4px 0' }}>
                            <Text>{stepIndex + 1}. {item}</Text>
                          </List.Item>
                        )}
                      />

                      {/* Hiển thị ảnh của operation */}
                      {operation.images && operation.images.filter(img => img.filename).length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <Text strong>Hình ảnh:</Text>
                          <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
                            {operation.images.filter(img => img.filename).map((image, imgIndex) => (
                              <Col span={8} key={imgIndex}>
                                <ImagePreview
                                  image={image}
                                  systemInfoId={systemInfo?.id}
                                  style={{
                                    width: '100%',
                                    height: '80px',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                    borderRadius: '4px'
                                  }}
                                  onClick={() => {
                                    openPreview(operation.images.filter(img => img.filename), operation.title, imgIndex);
                                  }}
                                />
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}

                      {/* Hiển thị tài liệu của operation */}
                      {operation.documents && operation.documents.filter(doc => doc.filename).length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                          <Text strong>Tài liệu:</Text>
                          <List
                            size="small"
                            dataSource={operation.documents.filter(doc => doc.filename)}
                            renderItem={(doc) => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Space>
                                  <FileTextOutlined />
                                  <Text>{processFileName(doc)}</Text>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownloadDocument(doc)}
                                  >
                                    Tải
                                  </Button>
                                </Space>
                              </List.Item>
                            )}
                          />
                        </div>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </>
      ) : (
        <Card title="📄 Nội dung chi tiết" style={{ marginBottom: '24px' }}>
          {/* Test button để kiểm tra Modal */}
          <Button
            type="primary"
            onClick={() => {
              console.log('🔍 Test button clicked');
              openPreview([
                { filename: 'test.jpg', originalName: 'Test Image' }
              ], 'Test Image', 0);
            }}
            style={{ marginBottom: 16 }}
          >
            Test Modal Preview
          </Button>
        </Card>
      )}

      {/* Sự cố thường gặp */}
      {contentObj && contentObj.troubleshooting && (
        <Card title={`⚠️ ${contentObj.troubleshooting.title || 'Sự cố thường gặp'}`} style={{ marginBottom: '24px' }}>
          <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
            {contentObj.troubleshooting.description}
          </Paragraph>
          <Alert
            message="Lưu ý: Luôn tuân thủ quy trình an toàn khi xử lý sự cố"
            type="warning"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Row gutter={[16, 16]}>
            {contentObj.troubleshooting?.items?.map((issue, index) => (
              <Col xs={24} md={12} key={index}>
                <Card size="small" title={issue.problem} style={{ height: '100%' }}>
                  <Paragraph>
                    <Text strong>Nguyên nhân:</Text> {issue.cause}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Cách xử lý:</Text> {issue.solution}
                  </Paragraph>

                  {/* Hiển thị ảnh của sự cố */}
                  {console.log('🔍 Issue images:', issue.images)}
                  {issue.images && issue.images.filter(img => img.filename).length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <Text strong>Hình ảnh liên quan:</Text>
                      <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
                        {issue.images.filter(img => img.filename).map((image, imgIndex) => (
                          <Col span={8} key={imgIndex}>
                            <ImagePreview
                              image={image}
                              systemInfoId={systemInfo?.id}
                              style={{
                                width: '100%',
                                height: '80px',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                borderRadius: '4px'
                              }}
                              onClick={() => {
                                // Mở modal preview với ảnh của sự cố này
                                openPreview(issue.images.filter(img => img.filename), issue.problem, imgIndex);
                              }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}

                  {/* Hiển thị tài liệu của sự cố */}
                  {issue.documents && issue.documents.filter(doc => doc.filename).length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <Text strong>Tài liệu liên quan:</Text>
                      <List
                        size="small"
                        dataSource={issue.documents.filter(doc => doc.filename)}
                        renderItem={(doc) => (
                          <List.Item style={{ padding: '4px 0' }}>
                            <Space>
                              <FileTextOutlined />
                              <Text>{processFileName(doc)}</Text>
                              <Button
                                type="link"
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() => handleDownloadDocument(doc)}
                              >
                                Tải
                              </Button>
                            </Space>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Tài liệu đính kèm tổng hợp */}
      {generalDocuments.length > 0 && (
        <Card title="📄 Tài liệu đính kèm" style={{ marginBottom: '24px' }}>
          <List
            dataSource={generalDocuments}
            renderItem={(doc) => (
              <List.Item
                style={{
                  padding: '4px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Space>
                  <FileTextOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                  <Text strong style={{ fontSize: '14px' }}>
                    {processFileName(doc)}
                  </Text>
                </Space>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="small"
                  onClick={() => handleDownloadDocument(doc)}
                  style={{
                    backgroundColor: '#52c41a',
                    borderColor: '#52c41a',
                    borderRadius: '6px'
                  }}
                >
                  Tải xuống
                </Button>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Hình ảnh */}
      {(generalImages.length > 0) && (
        <Card title="🖼️ Hình ảnh" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            {generalImages.map((image, index) => (
              <Col xs={24} md={8} key={`general-${index}`}>
                <Card size="small" hoverable>
                  <ImagePreview
                    image={image}
                    systemInfoId={systemInfo?.id}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => openPreview(generalImages, 'Tài liệu chung', index)}
                  />
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text type="secondary">{processFileName(image)}</Text>
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownloadImage(image)}
                      style={{ marginLeft: 8 }}
                    >
                      Download
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Modal preview ảnh nâng cao - luôn render */}
      {console.log('🔍 About to render Modal, previewVisible:', previewVisible)}
      {console.log('🔍 currentPreviewImages:', currentPreviewImages)}
      {console.log('🔍 currentPreviewTitle:', currentPreviewTitle)}
      {console.log('🔍 Modal will be rendered:', previewVisible)}
      {console.log('🔍 About to render ImagePreviewModal with props:', {
        visible: previewVisible,
        images: currentPreviewImages,
        title: currentPreviewTitle,
        index: previewIndex,
        systemInfoId: systemInfo?.id
      })}
      <ImagePreviewModal
        visible={previewVisible}
        images={currentPreviewImages}
        title={currentPreviewTitle}
        index={previewIndex}
        onClose={() => setPreviewVisible(false)}
        onPrev={prevImage}
        onNext={nextImage}
        onDownload={handleDownloadImage}
        onSetIndex={setPreviewIndex}
        systemInfoId={systemInfo?.id}
      />

      {/* Ghi chú cuối trang */}
      <Card style={{ background: '#fafafa' }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <Space>
              <CalendarOutlined />
              <Text type="secondary">
                Cập nhật lần cuối: {displayData.updatedAt ? new Date(displayData.updatedAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
              </Text>
            </Space>
            <Space>
              <UserOutlined />
              <Text type="secondary">
                Người cập nhật: {displayData.updater?.fullname || 'Không xác định'}
              </Text>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default SystemInfoPage;
