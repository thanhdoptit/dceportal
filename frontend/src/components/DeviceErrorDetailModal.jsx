import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Card,
  Timeline,
  Button,
  Row,
  Col,
  Tag,
  message,
  DatePicker,
  Upload,
  Image,
  Tooltip,
  Spin
} from 'antd';
import {
  FileSearchOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  MailOutlined,
  UserOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import dayjs from 'dayjs';
import { sendEmail } from '../services/emailService';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { format } from 'date-fns';
import axios from 'axios';
import {
  DEVICE_ERROR_STATUS,
  DEVICE_ERROR_STATUS_COLORS,
  DEVICE_ERROR_STATUS_OPTIONS,
  DEVICE_ERROR_STATUS_LABELS,
  canTransitionTo,
  getNextAvailableStatuses
} from '../constants/deviceErrorStatus';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Component tùy chỉnh để hiển thị hình ảnh qua API
const ImagePreview = ({ image, deviceErrorId, style, onClick }) => {
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
        console.log('🔍 DeviceError ImagePreview - Token:', token ? 'Có token' : 'Không có token');
        console.log('🔍 DeviceError ImagePreview - Loading image:', image);
        console.log('🔍 DeviceError ImagePreview - DeviceErrorId:', deviceErrorId);

        // Kiểm tra xem ảnh có phải là temp không
        let imageUrl;
        if (image.includes('temp')) {
          // Ảnh temp - sử dụng static file URL
          imageUrl = `${import.meta.env.VITE_API_URL}/uploads/device-errors/temp/${deviceErrorId}/${image}`;
        } else {
          // Ảnh chính thức - sử dụng API route
          imageUrl = `${import.meta.env.VITE_API_URL}/api/devices/errors/${deviceErrorId}/images/${image}`;
        }

        const res = await fetch(imageUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('🔍 DeviceError ImagePreview - Response status:', res.status);
        if (!res.ok) {
          console.error('🔍 DeviceError ImagePreview - Response not ok:', res.status, res.statusText);
          throw new Error('Fetch image failed');
        }
        const blob = await res.blob();
        url = window.URL.createObjectURL(blob);
        setImageUrl(url);
        console.log('🔍 DeviceError ImagePreview - Image loaded successfully');
      } catch (err) {
        console.error('Error loading device error image (fetch):', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (deviceErrorId && image) loadImage();
    return () => {
      if (url) window.URL.revokeObjectURL(url);
    };
  }, [deviceErrorId, image]);

  if (loading) return (
    <div style={{
      ...style,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f0f0',
      borderRadius: '4px'
    }}>
      <Spin size="small" />
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
      fontSize: '12px'
    }}>
      <ExclamationCircleOutlined style={{ marginRight: 4 }} />
      Lỗi tải ảnh
    </div>
  );

  return (
    <img
      src={imageUrl}
      alt={`Hình ảnh lỗi thiết bị`}
      style={style}
      onClick={(e) => {
        console.log('Device error image clicked', image, onClick);
        if (onClick) onClick(e);
      }}
    />
  );
};

// Custom Upload component với authentication
const AuthenticatedUpload = ({ fileList, onChange, onRemove, onPreview, children, ...props }) => {
  const [authenticatedFileList, setAuthenticatedFileList] = useState([]);

  useEffect(() => {
    const loadAuthenticatedFiles = async () => {
      const token = localStorage.getItem('token');
      const newFileList = await Promise.all(
        fileList.map(async (file) => {
          if (file.url && (file.url.includes('/api/devices/errors/') || file.url.includes('/uploads/device-errors/temp/'))) {
            try {
              const res = await fetch(file.url, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                return {
                  ...file,
                  url: url,
                  thumbUrl: url
                };
              }
            } catch (error) {
              console.error('Error loading authenticated file:', error);
            }
          }
          return file;
        })
      );
      setAuthenticatedFileList(newFileList);
    };

    loadAuthenticatedFiles();
  }, [fileList]);

  return (
    <Upload
      {...props}
      fileList={authenticatedFileList}
      onChange={onChange}
      onRemove={onRemove}
      onPreview={onPreview}
    >
      {children}
    </Upload>
  );
};

const DeviceErrorDetailModal = ({ visible, onClose, error, history, onResolve, onRefresh, setSelectedError }) => {
  console.log('🚀 DeviceErrorDetailModal component rendered'); // Debug log
  console.log('🚀 Props:', { visible, error: !!error, history: history?.length }); // Debug log
  const [form] = Form.useForm();
  const [resolveForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resolveModalVisible, setResolveModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]); // Track files marked for deletion
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const { currentUser } = useContext(AuthContext);

  // Reset form khi mở modal mới
  useEffect(() => {
    if (visible && error) {
      console.log('📋 Error data:', error); // Debug log
      console.log('📋 Modal visible:', visible); // Debug log
      console.log('📋 Is editing:', isEditing); // Debug log

      form.setFieldsValue({
        resolveStatus: error.resolveStatus,
        resolveNote: error.resolveNote,
        // solution: error.solution, // Xóa dòng này để không set giá trị cũ
        errorCause: error.errorCause,
        serialNumber: error.serialNumber,
        errorCode: error.errorCode,
        position: error.position || '',
        solution: isEditing ? '' : error.solution // Nếu đang edit thì để trống
      });

      // Cập nhật fileList cho Upload component
      try {
        const imageUrls = error.images ? JSON.parse(error.images) : [];
        console.log('📋 Parsed image URLs:', imageUrls);

        const fileList = Array.isArray(imageUrls) ? imageUrls.map((url, index) => {
          // Trích xuất tên file từ URL
          const filename = url.split('/').pop();

          return {
            uid: `-${index}`,
            name: filename,
            status: 'done',
            // Không set url/thumbUrl để ImagePreview component xử lý authentication
            isExisting: true // Đánh dấu là ảnh hiện có
          };
        }) : [];

        console.log('📋 Setting fileList:', fileList);
        console.log('📋 File URLs:', fileList.map(f => f.url));
        setUploadFileList(fileList);
      } catch (e) {
        console.error('❌ Error parsing images for upload:', e);
        setUploadFileList([]);
      }
    }
    if (!visible) {
      if (form) form.resetFields();
      if (resolveForm) resolveForm.resetFields();
      if (emailForm) emailForm.resetFields();
      setIsEditing(false);
      setResolveModalVisible(false);
      setEmailModalVisible(false);
    }
  }, [visible, error, form, resolveForm, emailForm, isEditing]);

  // Set giá trị mặc định cho form email khi mở modal
  useEffect(() => {
    if (emailModalVisible && emailForm) {
      emailForm.setFieldsValue({
        to: ['CNTT@vietinbank.vn'],
        cc: ['datacenter@vietinbank.vn']
      });
    }
  }, [emailModalVisible, emailForm]);

  if (!error) return null;

  // Hàm lấy màu theo loại thay đổi
  const getColor = (type) => {
    if (type === 'create') return '#003c71';
    if (type === 'resolve') return '#003c71';
    if (type === 'update') return '#003c71';
    return '#8c8c8c';
  };

  // Hàm ánh xạ tên trường sang tiếng Việt
  const getFieldLabel = (field) => {
    switch (field) {
      case 'errorCause':
        return 'Nguyên nhân';
      case 'solution':
        return 'Quá trình xử lý';
      case 'serialNumber':
        return 'Số serial';
      case 'errorCode':
        return 'Mã lỗi';
      case 'position':
        return 'Vị trí';
      case 'location':
        return 'Địa điểm';
      case 'resolveStatus':
        return 'Trạng thái xử lý';
      case 'resolveNote':
        return 'Nội dung';
      case 'resolvedAt':
        return 'Thời điểm xử lý';
      default:
        return field;
    }
  };

  // Gom các bản ghi cùng changeId
  const grouped = _.groupBy(history, item => item.changeId || item.id);
  // Sắp xếp các nhóm theo thời gian mới nhất
  const sortedGroups = Object.values(grouped).sort((a, b) => new Date(b[0].createdAt) - new Date(a[0].createdAt));

  // Hàm render chi tiết các trường thay đổi (update)
  const renderUpdateDetail = (group, first, getFieldLabel) => (
    <>
      {group.map(item => (
        item.field && item.field !== 'all' && item.field !== 'solution' && item.field !== 'resolveStatus' && (
          <div key={item.field} style={{ marginBottom: 4 }}>
            {(item.field === 'resolvedAt' || item.field === 'resolveNote') ? (
              <>
                <b>{getFieldLabel(item.field)}</b> : "<span style={{ color: '#389e0d' }}>{
                  item.field === 'resolvedAt'
                    ? (item.newValue ? new Date(item.newValue).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '')
                    : item.newValue
                }</span>"
              </>
            ) : (
              item.oldValue !== undefined && item.oldValue !== null && item.oldValue !== '' && item.oldValue !== item.newValue ? (
                <>
                  Đã thay đổi <b>{getFieldLabel(item.field)}</b> từ "<span style={{ color: '#d46b08' }}>{
                    item.field === 'resolvedAt'
                      ? (item.oldValue ? new Date(item.oldValue).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '')
                      : item.oldValue
                  }</span>" thành "<span style={{ color: '#389e0d' }}>{
                    item.field === 'resolvedAt'
                      ? (item.newValue ? new Date(item.newValue).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '')
                      : item.newValue
                  }</span>"
                </>
              ) : (
                <>
                  Đã cập nhật <b>{getFieldLabel(item.field)}</b> thành "<span style={{ color: '#389e0d' }}>{
                    item.field === 'resolvedAt'
                      ? (item.newValue ? new Date(item.newValue).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '')
                      : item.newValue
                  }</span>"
                </>
              )
            )}
          </div>
        )
      ))}

    </>
  );

  const timelineItems = sortedGroups.map((group) => {
    const first = group[0];
    // Kiểm tra nếu trong group có cập nhật resolveStatus thành Đã xử lý
    const isResolved = group.some(item => item.field === 'resolveStatus' && item.newValue === 'Đã xử lý');
    let label = '';
    if (first.changeType === 'create') label = 'Tạo mới';
    else if (isResolved) label = 'Đã xử lý';
    else if (first.changeType === 'update') label = 'Cập nhật';
    else if (first.changeType === 'resolve') label = 'Đã xử lý';
    else label = 'Khác';
    // Chọn màu tag
    const tagColor = label === 'Đã xử lý' ? '#003c71' : getColor(first.changeType);
    return {
      color: getColor(first.changeType),
      children: (
        <div className="p-2 border border-gray-200 rounded-md">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <UserOutlined className="text-blue-500" />
              <span className="font-medium text-sm">{first.changedByUser?.username}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400 text-sm">
                {new Date(first.createdAt).toLocaleString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: false
                })}
              </span>
            </div>
            <Tag color={tagColor} style={{ fontWeight: 400, textTransform: 'capitalize' }}>
              {label}
            </Tag>
          </div>

          <div className="rounded-lg p-1">
            {renderUpdateDetail(group, first, getFieldLabel)}
          </div>
        </div>
      )
    };
  });

  const handleResolve = async (values) => {
    try {
      setLoading(true);

      console.log('📝 === CẬP NHẬT LỖI THIẾT BỊ ===');
      console.log('📝 Values:', values);
      console.log('📝 Current uploadFileList:', uploadFileList);
      console.log('📝 Files to delete:', filesToDelete);

      // Xóa các file đã đánh dấu xóa
      if (filesToDelete.length > 0) {
        try {
          const token = localStorage.getItem('token');
          console.log('🗑️ Deleting marked files:', filesToDelete);

          for (const filename of filesToDelete) {
            try {
              await axios.delete(`${import.meta.env.VITE_API_URL}/api/devices/errors/${error.id}/images/${encodeURIComponent(filename)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              console.log(`✅ Deleted file: ${filename}`);
            } catch (deleteError) {
              console.error(`❌ Failed to delete file: ${filename}`, deleteError);
            }
          }
        } catch (error) {
          console.error('❌ Error deleting marked files:', error);
          message.warning('Có lỗi khi xóa ảnh, nhưng thông tin đã được cập nhật');
        }
      }

      // Lấy danh sách ảnh temp đã upload
      const tempImageNames = uploadFileList
        .filter(file => file.filename && file.status === 'done')
        .map(file => file.filename);

      console.log('📝 Temp image names to move:', tempImageNames);

      // Di chuyển ảnh từ temp sang thư mục chính nếu có
      if (tempImageNames.length > 0) {
        try {
          const token = localStorage.getItem('token');
          const moveResponse = await axios.post(`/api/devices/errors/${error.id}/move-temp-images`, {
            tempImageNames: tempImageNames
          }, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          console.log('✅ Moved temp images response:', moveResponse.data);
        } catch (moveError) {
          console.error('❌ Error moving temp images:', moveError);
          message.warning('Có lỗi khi lưu ảnh, nhưng thông tin đã được cập nhật');
        }
      }

      // Nếu solution để trống thì giữ lại giá trị cũ
      const data = {
        ...values,
        solution: values.solution && values.solution.trim() !== '' ? values.solution : error.solution,
        position: values.position || error.position
      };

      console.log('📝 Final data to send:', data);

      await onResolve(data);
      message.success('Đã cập nhật');
      setIsEditing(false);
      setResolveModalVisible(false);

      // Reset states
      setUploadFileList([]);
      setFilesToDelete([]);

      if (onRefresh) {
        await onRefresh();
      }

      // Gọi lại API lấy chi tiết lỗi mới nhất và cập nhật lại selectedError nếu có
      if (setSelectedError && error?.id) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/devices/errors/${error.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setSelectedError(data);
          }
        } catch (detailError) {
          console.error('Error fetching updated error details:', detailError);
        }
      }
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật:', error);
      message.error('Không thể cập nhật lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickResolve = async (values) => {
    try {
      setLoading(true);
      const resolveData = {
        ...error,
        resolveStatus: values.resolveStatus,
        resolvedAt: values.resolvedAt.toISOString(),
        resolveNote: values.resolveNote,
        solution: values.solution || error.solution,
        errorCause: values.errorCause || error.errorCause,
        position: values.position || error.position
      };
      await onResolve(resolveData);

      const statusLabel = DEVICE_ERROR_STATUS_LABELS[values.resolveStatus];
      message.success(`Đã cập nhật trạng thái thành: ${statusLabel}`);
      setResolveModalVisible(false);
      setIsEditing(false);
      if (onRefresh) {
        await onRefresh();
      }
      // Gọi lại API lấy chi tiết lỗi mới nhất và cập nhật lại selectedError nếu có
      if (setSelectedError && error?.id) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/devices/errors/${error.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setSelectedError(data);
          }
        } catch { /* ignore */ }
      }
    } catch (error) {
      message.error('Không thể xử lý lỗi');
      console.error('Lỗi khi xử lý:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý chuyển trạng thái sang "Đang xử lý"
  const handleStartProgress = async () => {
    try {
      setLoading(true);
      const progressData = {
        ...error,
        resolveStatus: DEVICE_ERROR_STATUS.IN_PROGRESS,
        resolveNote: 'Bắt đầu xử lý lỗi',
        solution: error.solution,
        errorCause: error.errorCause,
        position: error.position
      };
      await onResolve(progressData);
      message.success('Đã chuyển sang trạng thái đang xử lý');
      if (onRefresh) {
        await onRefresh();
      }
      // Gọi lại API lấy chi tiết lỗi mới nhất và cập nhật lại selectedError nếu có
      if (setSelectedError && error?.id) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/devices/errors/${error.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setSelectedError(data);
          }
        } catch { /* ignore */ }
      }
    } catch (error) {
      message.error('Không thể chuyển trạng thái');
      console.error('Lỗi khi chuyển trạng thái:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý upload hình ảnh đơn lẻ
  const handleImageUpload = async (file) => {
    console.log('📤 Edit modal - handleImageUpload called with file:', file);

    try {
      const formData = new FormData();
      formData.append('images', file.originFileObj || file);

      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
        return false;
      }

      console.log('📤 Uploading to temp endpoint, token exists:', !!token);

      const response = await axios.post(`/api/devices/errors/${error.id}/temp/images`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 giây timeout
      });

      console.log('📤 Upload response:', response.data);

      if (response.data.uploadedFiles && response.data.uploadedFiles.length > 0) {
        message.success(`Upload ${response.data.uploadedFiles.length} hình ảnh thành công`);

        // Tạo file paths từ uploadedFiles
        const filePaths = response.data.uploadedFiles.map(file =>
          `/uploads/device-errors/temp/${error.id}/${file.filename}`
        );

        const fullUrls = await Promise.all(filePaths.map(async (url) => {
          try {
            const filename = url.split('/').pop();
            const apiUrl = `${import.meta.env.VITE_API_URL}/api/devices/errors/${error.id}/temp/images/${filename}`;

            console.log(`🔗 Loading image as blob: ${apiUrl}`);

            const token = localStorage.getItem('token');
            if (!token) {
              console.error('❌ No auth token for image load');
              return apiUrl; // Fallback to API URL
            }

            const response = await axios.get(apiUrl, {
              headers: {
                'Authorization': `Bearer ${token}`
              },
              responseType: 'blob'
            });

            const blobUrl = window.URL.createObjectURL(response.data);
            console.log(`✅ Created blob URL: ${blobUrl}`);
            return blobUrl;
          } catch (error) {
            console.error('❌ Error creating blob URL:', error);
            const filename = url.split('/').pop();
            return `${import.meta.env.VITE_API_URL}/api/devices/errors/${error.id}/temp/images/${filename}`;
          }
        }));

        // Cập nhật fileList với ảnh mới
        const newFiles = filePaths.map((path, index) => ({
          uid: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${index}`,
          name: path.split('/').pop(),
          status: 'done',
          url: fullUrls[index],
          thumbUrl: fullUrls[index],
          filename: path.split('/').pop() // Đánh dấu là file temp
        }));

        setUploadFileList(prev => {
          const updatedList = [...prev, ...newFiles];
          console.log('📤 New uploadFileList:', updatedList);
          return updatedList;
        });

        return true; // Upload thành công
      } else {
        message.warning('Không có hình ảnh nào được upload');
        return false;
      }
    } catch (error) {
      console.error('❌ Lỗi khi upload hình ảnh:', error);

      if (error.response?.status === 401) {
        message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.code === 'ECONNABORTED') {
        message.error('Upload hình ảnh bị timeout. Vui lòng thử lại.');
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Upload hình ảnh thất bại. Vui lòng thử lại.');
      }

      return false; // Upload thất bại
    }
  };

  // Hàm xử lý upload nhiều hình ảnh cùng lúc
  const handleMultipleImageUpload = async (fileList) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
        return false;
      }

      console.log('📤 Edit modal - handleMultipleImageUpload called with files:', fileList);
      console.log('📤 Uploading multiple files to temp endpoint, token exists:', !!token);

      // Tạo FormData với nhiều file
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('images', file.originFileObj || file);
      });

      // Upload files
      const response = await axios.post(`/api/devices/errors/${error.id}/temp/images`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 giây timeout
      });

      console.log('📤 Multiple upload response:', response.data);

      if (response.data.uploadedFiles && response.data.uploadedFiles.length > 0) {
        message.success(`Upload thành công ${response.data.uploadedFiles.length} hình ảnh`);

        // Tạo file paths từ uploadedFiles
        const filePaths = response.data.uploadedFiles.map(file =>
          `/uploads/device-errors/temp/${error.id}/${file.filename}`
        );

        const fullUrls = await Promise.all(filePaths.map(async (url) => {
          try {
            const filename = url.split('/').pop();
            const apiUrl = `${import.meta.env.VITE_API_URL}/api/devices/errors/${error.id}/temp/images/${filename}`;
            console.log(`🔗 Loading image as blob: ${apiUrl}`);
            const token = localStorage.getItem('token');
            if (!token) {
              console.error('❌ No auth token for image load');
              return apiUrl; // Fallback to API URL
            }
            const response = await axios.get(apiUrl, {
              headers: { 'Authorization': `Bearer ${token}` },
              responseType: 'blob'
            });
            const blobUrl = window.URL.createObjectURL(response.data);
            console.log(`✅ Created blob URL: ${blobUrl}`);
            return blobUrl;
          } catch (error) {
            console.error('❌ Error creating blob URL:', error);
            const filename = url.split('/').pop();
            return `${import.meta.env.VITE_API_URL}/api/devices/errors/${error.id}/temp/images/${filename}`;
          }
        }));

        // Cập nhật fileList với ảnh mới
        const newFiles = filePaths.map((path, index) => ({
          uid: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${index}`,
          name: path.split('/').pop(),
          status: 'done',
          url: fullUrls[index],
          thumbUrl: fullUrls[index],
          filename: path.split('/').pop() // Đánh dấu là file temp
        }));

        setUploadFileList(prev => {
          const updatedList = [...prev, ...newFiles];
          console.log('📤 New uploadFileList:', updatedList);
          return updatedList;
        });

        return true; // Upload thành công
      } else {
        message.warning('Không có hình ảnh nào được upload');
        return false;
      }
    } catch (error) {
      console.error('❌ Lỗi khi upload nhiều hình ảnh:', error);

      if (error.response?.status === 401) {
        message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.code === 'ECONNABORTED') {
        message.error('Upload hình ảnh bị timeout. Vui lòng thử lại.');
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Upload hình ảnh thất bại. Vui lòng thử lại.');
      }

      return false; // Upload thất bại
    }
  };

  // Hàm xử lý xóa hình ảnh
  const handleImageRemove = async (file) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      console.log('🗑️ === XÓA IMAGE EDIT MODAL ===');
      console.log('🗑️ File object:', file);
      console.log('🗑️ File URL:', file.url);
      console.log('🗑️ File name:', file.name);
      console.log('🗑️ File uid:', file.uid);
      console.log('🗑️ File status:', file.status);
      console.log('🗑️ File filename:', file.filename);

      // Chuyển đổi URL từ full URL về filename cho backend
      let filename = '';

      console.log('🗑️ === EXTRACTING FILENAME ===');
      console.log('🗑️ File URL type:', typeof file.url);
      console.log('🗑️ File URL includes /api/:', file.url && file.url.includes('/api/devices/errors/'));
      console.log('🗑️ File URL starts with blob:', file.url && file.url.startsWith('blob:'));

      // Ưu tiên lấy filename từ file.filename (đã được đánh dấu)
      if (file.filename) {
        filename = file.filename;
        console.log('🗑️ Extracted filename from file.filename:', filename);
      } else if (file.url && file.url.includes('/api/devices/errors/')) {
        filename = file.url.split('/').pop();
        console.log('🗑️ Extracted filename from API URL:', filename);
      } else if (file.url && file.url.startsWith('blob:')) {
        // Nếu là blob URL, lấy filename từ file.name
        filename = file.name;
        console.log('🗑️ Extracted filename from blob URL:', filename);
      } else {
        // Fallback: lấy filename từ file.name nếu có
        filename = file.name || 'unknown';
        console.log('🗑️ Extracted filename from fallback (file.name):', filename);
      }

      console.log('🗑️ Final filename:', filename);

      // Xác định loại file và hành động xóa
      let isTempFile = file.filename || (file.url && file.url.includes('temp')) || (file.url && file.url.startsWith('blob:'));
      let deleteEndpoint;

      if (isTempFile) {
        // File temp - xóa ngay lập tức
        deleteEndpoint = `/api/devices/errors/${error.id}/temp/images/${encodeURIComponent(filename)}`;
      } else {
        // File hiện có - chỉ đánh dấu để xóa khi save
        console.log('🗑️ Marking existing file for deletion:', filename);
        setFilesToDelete(prev => [...prev, filename]);
        setUploadFileList(prev => prev.filter(f => f.uid !== file.uid));
        message.success('Đã đánh dấu xóa hình ảnh');
        return; // Không gọi API xóa ngay
      }

      console.log('🗑️ Delete endpoint:', deleteEndpoint);

      const response = await axios.delete(`${import.meta.env.VITE_API_URL}${deleteEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('🗑️ Response status:', response.status);
      console.log('🗑️ Response ok:', response.ok);

      if (response.status === 200) {
        message.success('Xóa hình ảnh thành công');

        // Xóa file khỏi fileList
        setUploadFileList(prev => {
          const filteredList = prev.filter(f => f.uid !== file.uid);
          console.log('🗑️ After filtering - Removed file with uid:', file.uid);
          console.log('🗑️ Remaining files:', filteredList.map(f => ({ uid: f.uid, name: f.name, filename: f.filename })));
          return filteredList;
        });
      } else {
        message.error('Xóa hình ảnh thất bại');
      }
    } catch (error) {
      console.error('❌ Lỗi khi xóa hình ảnh:', error);
      console.error('❌ Error response:', error.response?.data);

      if (error.response?.status === 401) {
        message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Xóa hình ảnh thất bại');
      }
    }
  };

  // Hàm xử lý preview ảnh
  const handlePreview = async (file) => {
    try {
      if (!file.url && !file.preview) {
        // Nếu là file mới upload, tạo preview từ originFileObj
        if (file.originFileObj) {
          file.preview = await getBase64(file.originFileObj);
        }
      }

      setPreviewTitle(file.name || file.url?.substring(file.url.lastIndexOf('/') + 1) || 'Hình ảnh');
      setPreviewVisible(true);
    } catch (error) {
      console.error('Error creating preview:', error);
      message.error('Không thể xem trước hình ảnh');
    }
  };

  // Hàm chuyển ảnh trong preview
  const handlePreviewNext = () => {
    setPreviewIndex((previewIndex + 1) % previewImages.length);
  };

  const handlePreviewPrev = () => {
    setPreviewIndex((previewIndex - 1 + previewImages.length) % previewImages.length);
  };

  // Hàm tạo base64 từ file
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSendEmail = async (values) => {
    try {
      setLoading(true);

      // Chuẩn bị danh sách ảnh để đính kèm
      let attachments = [];
      if (error.images) {
        try {
          const imageUrls = JSON.parse(error.images);
          if (Array.isArray(imageUrls) && imageUrls.length > 0) {
            console.log('📎 Preparing attachments for email:', imageUrls);

            // Tải và chuẩn bị từng ảnh
            const token = localStorage.getItem('token');
            if (token) {
              for (let i = 0; i < imageUrls.length; i++) {
                try {
                  const url = imageUrls[i];
                  const filename = url.split('/').pop();

                  // Tạo URL API để tải ảnh với authentication
                  const apiUrl = `${import.meta.env.VITE_API_URL}/api/devices/errors/${error.id}/images/${filename}`;

                  console.log(`📎 Loading attachment ${i + 1}/${imageUrls.length}: ${filename}`);

                  const response = await axios.get(apiUrl, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    responseType: 'blob'
                  });

                  console.log('📎 Attachment response type:', typeof response.data);
                  console.log('📎 Attachment response constructor:', response.data.constructor.name);
                  console.log('📎 Attachment response size:', response.data.size);

                  // Convert Blob to base64 string
                  const arrayBuffer = await response.data.arrayBuffer();
                  const base64String = btoa(
                    new Uint8Array(arrayBuffer)
                      .reduce((data, byte) => data + String.fromCharCode(byte), '')
                  );

                  console.log('📎 Base64 string length:', base64String.length);
                  const base = filename.split('_')[0];
                  const ext = filename.substring(filename.lastIndexOf('.'));

                  attachments.push({
                    filename: `${error.subDeviceName}_${base}${ext}`,
                    content: base64String,
                    contentType: response.headers['content-type'] || 'image/jpeg'
                  });

                  console.log(`✅ Attachment ${i + 1} prepared: ${filename}`);
                } catch (attachmentError) {
                  console.error(`❌ Failed to prepare attachment ${i + 1}:`, attachmentError);
                }
              }
            }
          }
        } catch (parseError) {
          console.error('❌ Error parsing images for attachments:', parseError);
        }
      }

      console.log(`📎 Total attachments prepared: ${attachments.length}`);

      const emailData = {
        to: values.to,
        cc: values.cc,
        subject: `Thông báo lỗi thiết bị : ${error.subDeviceName}`,
        attachments: attachments,
        html: `
          <div style="font-family: Arial, sans-serif; width: 100%;">
            ${values.customContent ? `
            <div >
              ${values.customContent.replace(/\n/g, '<br>')}
            </div>
            ` : ''}
            <h2 style="color: #003c71; margin-bottom: 20px;">Thông tin lỗi thiết bị</h2>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
              <tbody>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; width: 30%; border: 1px solid #e5e7eb;">Tên thiết bị</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${error.subDeviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Vị trí</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${error.position || 'Chưa có'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Số serial</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${error.serialNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Mã lỗi</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${error.errorCode}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Thời điểm ghi nhận</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${new Date(error.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
                ${error.resolvedAt ? `
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Thời điểm xử lý</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${new Date(error.resolvedAt).toLocaleString('vi-VN')}</td>
                </tr>
                ` : ''}
                ${error.resolveNote ? `
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Ghi chú xử lý</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb; white-space: pre-line;">${error.resolveNote}</td>
                </tr>
                ` : ''}
                <tr>
                <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Trạng thái</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">
                  <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; background-color: ${error.resolveStatus === 'Đã xử lý' ? '#52c41a' : '#ff4d4f'}; color: white;">
                    ${error.resolveStatus}
                  </span>
                </td>
              </tr>
                              <tr >
              <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Liên hệ</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb; white-space: pre-line;">${currentUser?.username}@vietinbank.vn</td>
                    </tr>
              </tbody>
            </table>
            ${attachments.length > 0 ? `
            <div style="margin-top: 20px;">
              <h3 style="color: #003c71; margin-bottom: 10px;">Hình ảnh lỗi (${attachments.length} ảnh):</h3>
              <p style="color: #666; font-size: 14px;">Các hình ảnh đã được đính kèm trong email.</p>
            </div>
            ` : ''}
          </div>
        `,
        text: values.customContent ? `
${values.customContent}

----------------------------------------

Thông tin lỗi thiết bị
=====================
Thiết bị: ${error.subDeviceName}
Vị trí: ${error.position || 'Chưa có'}
Số serial: ${error.serialNumber}
Mã lỗi: ${error.errorCode}
Trạng thái: ${error.resolveStatus}
Quá trình xử lý: ${error.solution || 'Chưa có'}
Thời điểm ghi nhận: ${new Date(error.createdAt).toLocaleString('vi-VN')}
${error.resolvedAt ? `Thời điểm xử lý: ${new Date(error.resolvedAt).toLocaleString('vi-VN')}` : ''}
${error.resolveNote ? `Ghi chú xử lý: ${error.resolveNote}` : ''}
${attachments.length > 0 ? `\nHình ảnh: ${attachments.length} ảnh đính kèm` : ''}
        ` : ''
      };

      await sendEmail(emailData);
      message.success(`Gửi email thành công${attachments.length > 0 ? ` với ${attachments.length} ảnh đính kèm` : ''}`);
      setEmailModalVisible(false);
      emailForm.resetFields();
    } catch (error) {
      console.error('❌ Error sending email:', error);
      message.error('Không thể gửi email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDetailContent = () => (
    <div>
      <div style={{
        maxHeight: 'calc(600px - 60px)', //
        overflowY: 'auto',
        padding: '10px'
      }}
        className='border border-gray-200 z-10 p-2 rounded-lg shadow-sm ma'>
        <Row gutter={16}>
          <Col span={6}>
            <div className="mb-4">
              <div className="text-gray-500 mb-1">Thiết bị</div>
              <div className="whitespace-pre-line break-words">
                {error.subDeviceName}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="mb-4">
              <div className="text-gray-500 mb-1">Vị trí</div>
              <div className="whitespace-pre-line break-words">
                {error.position || 'Chưa có'}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="mb-4">
              <div className="text-gray-500 mb-1">Số serial</div>
              <div className="whitespace-pre-line break-words">
                {error.serialNumber}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="mb-4">
              <div className="text-gray-500 mb-1">Mã lỗi</div>
              <div className="whitespace-pre-line break-words">
                {error.errorCode}
              </div>
            </div>
          </Col>

        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <div className="mb-4">
              <div className="text-gray-500 mb-1">Địa điểm</div>
              <Tag className="whitespace-pre-line break-words" color="blue">
                {error.location || 'Chưa có'}
              </Tag>
            </div>
          </Col>
          <Col span={6}>
            <div className="mb-4">
              <div className="text-gray-500 mb-1">Trạng thái</div>
              <Tag color={DEVICE_ERROR_STATUS_COLORS[error.resolveStatus] || 'default'}>
                {error.resolveStatus}
              </Tag>
            </div>
          </Col>
        </Row>
        <div className="mb-4">
          <div className="text-gray-500 mb-1">Nguyên nhân</div>
          <div className="bg-gray-50 p-2 rounded whitespace-pre-line break-words">
            {error.errorCause}
          </div>
        </div>

        {/* Hiển thị hình ảnh lỗi */}
        {error.images && (
          <div className="mb-4">
            <div className="text-gray-500 mb-2">Hình ảnh lỗi</div>
            <div className="flex flex-wrap gap-2">
              {(() => {
                try {
                  const imageUrls = JSON.parse(error.images);
                  return Array.isArray(imageUrls) ? imageUrls.map((url, index) => {
                    // Trích xuất tên file từ URL
                    const filename = url.split('/').pop();
                    console.log('🖼️ Processing image:', { url, filename, deviceErrorId: error.id });

                    return (
                      <div key={index} className="relative">
                        <ImagePreview
                          image={filename}
                          deviceErrorId={error.id}
                          style={{
                            width: 120,
                            height: 90,
                            objectFit: 'cover',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            console.log('🖼️ Image clicked:', filename);
                            // Mở preview modal với ảnh hiện tại
                            setPreviewImages(imageUrls);
                            setPreviewIndex(index);
                            setPreviewTitle(filename);
                            setPreviewVisible(true);
                          }}
                        />
                      </div>
                    );
                  }) : null;
                } catch (e) {
                  console.error('Error parsing images:', e);
                  return null;
                }
              })()}
            </div>
          </div>
        )}
        {(error.resolveStatus === DEVICE_ERROR_STATUS.IN_PROGRESS, error.resolveStatus === DEVICE_ERROR_STATUS.RESOLVED) && (
          <div className="mb-1">
            <div className="text-gray-500 mb-1">Nội dung</div>
            <div className="bg-gray-50 p-2 rounded whitespace-pre-line break-words">
              {error.resolveNote}
            </div>
          </div>
        )}
        <div className="mb-1">
          <div className="text-gray-500 mb-1">Quá trình xử lý</div>
          <div className="bg-gray-50 p-2 rounded border border-gray-200" style={{ maxHeight: 200, overflowY: 'auto' }}>
            {(() => {
              // Lấy các bản ghi cập nhật solution
              const solutionHistory = history
                .filter(item => item.field === 'solution')
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

              // Lấy giá trị khởi tạo solution
              let initialSolution = '';
              let initialCreatedAt = error.createdAt;
              // Ưu tiên lấy người tạo từ bản ghi create trong history
              let initialCreator = '';
              const createItem = history.find(item => item.changeType === 'create');
              if (createItem && (createItem.changedByUser?.fullname || createItem.changedByUser?.username)) {
                initialCreator = createItem.changedByUser.fullname || createItem.changedByUser.username;
              } else if (error.creator?.fullname) {
                initialCreator = error.creator.fullname;
              } else if (error.createdByUser?.fullname) {
                initialCreator = error.createdByUser.fullname;
              } else if (error.createdByUser?.username) {
                initialCreator = error.createdByUser.username;
              } else if (error.createdBy) {
                initialCreator = `ID: ${error.createdBy}`;
              }

              const createSolutionItem = history.find(item => item.changeType === 'create' && item.field === 'solution');
              if (createSolutionItem) {
                initialSolution = createSolutionItem.newValue || '';
                initialCreatedAt = createSolutionItem.createdAt;
              } else if (solutionHistory.length > 0 && solutionHistory[0].oldValue) {
                initialSolution = solutionHistory[0].oldValue;
                initialCreatedAt = solutionHistory[0].createdAt;
              } else if (error.solution) {
                initialSolution = error.solution;
              }

              return (
                <>
                  {initialSolution ? (
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                        <UserOutlined style={{ color: '#1677ff' }} />
                        <span style={{ fontWeight: 500 }}>
                          {initialCreator && <> {initialCreator}</>}</span>
                        <span style={{ color: '#888', fontSize: 12 }}>
                          {initialCreatedAt && (<> {format(new Date(initialCreatedAt), 'HH:mm dd/MM/yyyy',)}</>)}
                        </span>
                        <span style={{ color: '#888', fontSize: 12 }}> đã tạo:</span>
                      </div>
                      <div style={{ borderRadius: 2, padding: 2 }}>
                        {initialSolution}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: '#888' }}>Chưa có quá trình xử lý</div>
                  )}
                  {solutionHistory.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                        <UserOutlined style={{ color: '#1677ff' }} />
                        <span style={{ fontWeight: 500 }}>
                          {item.changedByUser?.fullname || item.changedByUser?.username} -
                        </span>
                        <span style={{ color: '#888', fontSize: 12 }}>
                          {format(new Date(initialCreatedAt), 'HH:mm dd/MM/yyyy')}
                        </span>
                        <span style={{ color: '#888', fontSize: 12 }}> :</span>
                      </div>
                      <div style={{ borderRadius: 2, padding: 2 }}>
                        {item.newValue}
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      </div>
      <br />
      <div className="flex justify-between items-center mt-4 border border-gray-200 z-10 p-2 rounded-lg shadow-sm">
        <div className="flex gap-2">
          {error.resolveStatus === DEVICE_ERROR_STATUS.PENDING && (
            <>
              <Button
                type="primary"
                icon={<ClockCircleOutlined />}
                onClick={handleStartProgress}
                style={{
                  backgroundColor: '#fa8c16',
                  borderColor: '#fa8c16'
                }}
              >
                Bắt đầu xử lý
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => setResolveModalVisible(true)}
                style={{
                  backgroundColor: '#003c71',
                  borderColor: '#003c71'
                }}
              >
                Xử lý xong
              </Button>
            </>
          )}
          {error.resolveStatus === DEVICE_ERROR_STATUS.IN_PROGRESS && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => setResolveModalVisible(true)}
                style={{
                  backgroundColor: '#003c71',
                  borderColor: '#003c71'
                }}
              >
                Xử lý xong
              </Button>
            </>
          )}
          <Button
            type="primary"
            icon={<MailOutlined />}
            onClick={() => setEmailModalVisible(true)}
            style={{
              backgroundColor: '#1890ff',
              borderColor: '#1890ff'
            }}
          >
            Gửi Email
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
            style={{
              backgroundColor: '#003c71',
              borderColor: '#003c71'
            }}
          >
            Cập nhật
          </Button>
          <Button onClick={onClose}>
            Đóng
          </Button>

        </div>
      </div>
    </div>
  );

  const renderEditContent = () => {
    try {
      console.log('🎨 Rendering edit content'); // Debug log
      console.log('🎨 Current uploadFileList:', uploadFileList); // Debug log

      return (
        <Form form={form} onFinish={handleResolve} layout="vertical">
          <div style={{
            maxHeight: 'calc(600px - 60px)',
            overflowY: 'auto',
            padding: '10px'
          }}
            className='border border-gray-200 z-10 p-1 rounded-lg shadow-sm ma'>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name="subDeviceName"
                  label="Tên thiết bị"
                  initialValue={error.subDeviceName}
                >
                  <Input readOnly />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="position" label="Vị trí" initialValue={error.position}>
                  <Input placeholder="Ví dụ: Rack A1, Slot 2" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="serialNumber"
                  label="Serial"
                  initialValue={error.serialNumber}
                  rules={[{ required: true, message: 'Nhập serial' }]}
                >
                  <TextArea
                    autoSize={{ minRows: 1, maxRows: 5 }}
                    style={{ resize: 'none' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="errorCode"
                  label="Mã lỗi"
                  initialValue={error.errorCode}
                  rules={[{ required: true, message: 'Nhập mã lỗi' }]}
                >
                  <TextArea
                    autoSize={{ minRows: 1, maxRows: 5 }}
                    style={{ resize: 'none' }} />
                </Form.Item>
              </Col>

            </Row>
            <Form.Item
              name="errorCause"
              label="Nguyên nhân"
              initialValue={error.errorCause}>
              <TextArea
                autoSize={{ minRows: 1, maxRows: 5 }}
                style={{ resize: 'none' }}
              />
            </Form.Item>
            <Form.Item label="Quá trình xử lý">
              <div className="bg-gray-50 p-1 rounded border border-gray-200" style={{ maxHeight: 200, overflowY: 'auto' }}>
                {(() => {
                  // Lấy các bản ghi cập nhật solution
                  const solutionHistory = history
                    .filter(item => item.field === 'solution')
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                  // Lấy giá trị khởi tạo solution
                  let initialSolution = '';
                  let initialCreatedAt = error.createdAt;
                  // Ưu tiên lấy người tạo từ bản ghi create trong history
                  let initialCreator = '';
                  const createItem = history.find(item => item.changeType === 'create');
                  if (createItem && (createItem.changedByUser?.fullname || createItem.changedByUser?.username)) {
                    initialCreator = createItem.changedByUser.fullname || createItem.changedByUser.username;
                  } else if (error.creator?.fullname) {
                    initialCreator = error.creator.fullname;
                  } else if (error.createdByUser?.fullname) {
                    initialCreator = error.createdByUser.fullname;
                  } else if (error.createdByUser?.username) {
                    initialCreator = error.createdByUser.username;
                  } else if (error.createdBy) {
                    initialCreator = `ID: ${error.createdBy}`;
                  }

                  const createSolutionItem = history.find(item => item.changeType === 'create' && item.field === 'solution');
                  if (createSolutionItem) {
                    initialSolution = createSolutionItem.newValue || '';
                    initialCreatedAt = createSolutionItem.createdAt;
                  } else if (solutionHistory.length > 0 && solutionHistory[0].oldValue) {
                    initialSolution = solutionHistory[0].oldValue;
                    initialCreatedAt = solutionHistory[0].createdAt;
                  } else if (error.solution) {
                    initialSolution = error.solution;
                  }

                  return (
                    <>
                      {initialSolution && (
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                            <UserOutlined style={{ color: '#1677ff' }} />
                            <span style={{ fontWeight: 500 }}>
                              {initialCreator && <> {initialCreator}</>}</span>
                            <span style={{ color: '#888', fontSize: 12 }}>
                              {initialCreatedAt && (<> {format(new Date(initialCreatedAt), 'HH:mm dd/MM/yyyy')}</>)}
                            </span>
                            <span style={{ color: '#888', fontSize: 12 }}> đã tạo:</span>
                          </div>
                          <div style={{ borderRadius: 2, padding: 2 }}>
                            {initialSolution}
                          </div>
                        </div>
                      )}
                      {solutionHistory.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                            <UserOutlined style={{ color: '#1677ff' }} />
                            <span style={{ fontWeight: 500 }}>
                              {item.changedByUser?.fullname || item.changedByUser?.username} -
                            </span>
                            <span style={{ color: '#888', fontSize: 12 }}>
                              {format(new Date(initialCreatedAt), 'HH:mm dd/MM/yyyy')}
                            </span>
                            <span style={{ color: '#888', fontSize: 12 }}> :</span>
                          </div>
                          <div style={{ borderRadius: 2, padding: 2 }}>
                            {item.newValue}
                          </div>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            </Form.Item>
            <Form.Item name="solution" label="Quá trình xử lý">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 5 }}
                style={{ resize: 'none' }}
              />
            </Form.Item>
            <Form.Item label="Hình ảnh lỗi">
              <div className="flex items-center gap-1">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="multiple-image-upload-edit"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    console.log('🔍 Multiple file input selected in edit mode:', files);

                    if (files.length === 0) return;

                    // Kiểm tra số lượng file
                    const totalFiles = uploadFileList.length + files.length;
                    if (totalFiles > 10) {
                      message.error('Tối đa 10 ảnh!');
                      return;
                    }

                    // Kiểm tra từng file
                    for (const file of files) {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error(`File ${file.name} không phải hình ảnh!`);
                        return;
                      }

                      const isLt5M = file.size / 1024 / 1024 < 5;
                      if (!isLt5M) {
                        message.error(`File ${file.name} quá lớn (tối đa 5MB)!`);
                        return;
                      }
                    }

                    // Upload files
                    if (files.length === 1) {
                      await handleImageUpload(files[0]);
                    } else {
                      await handleMultipleImageUpload(files);
                    }

                    // Reset input
                    e.target.value = '';
                  }}
                />
                <Button
                  type="primary"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                  onClick={() => document.getElementById('multiple-image-upload-edit').click()}
                  disabled={uploadFileList.length >= 10}
                >
                  <PlusOutlined />
                  <div className="ml-1">Upload ảnh</div>
                  <div className="text-white">
                    ({uploadFileList.length}/10 ảnh)
                  </div>
                </Button>
                <Tooltip
                  title={
                    <>
                      Upload tối đa 10 ảnh. Dung lượng tối đa mỗi ảnh 5MB.
                      <br /><br />
                      Hỗ trợ các định dạng: .doc, .docx, .pdf, .xls, .xlsx, .jpg, .jpeg, .png, .msg.
                    </>
                  }
                  placement="right"
                >
                  <InfoCircleOutlined style={{ color: '#1677ff', cursor: 'pointer' }} />
                </Tooltip>
              </div>

              {/* Hiển thị danh sách ảnh đã upload */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {uploadFileList.map((file, index) => (
                  <div key={file.uid || index} style={{ position: 'relative', width: 104, height: 104 }}>
                    {file.url && file.url.startsWith('blob:') ? (
                      // Ảnh mới upload (blob URL) - hiển thị trực tiếp
                      <img
                        src={file.url}
                        alt={file.name || `Ảnh ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          border: '1px solid #d9d9d9',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                        onClick={() => handlePreview(file)}
                      />
                    ) : file.isExisting ? (
                      // Ảnh hiện có (cần authentication) - sử dụng ImagePreview
                      <ImagePreview
                        image={file.name}
                        deviceErrorId={error.id}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          border: '1px solid #d9d9d9',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                        onClick={() => handlePreview(file)}
                      />
                    ) : (
                      // Fallback cho các trường hợp khác
                      <img
                        src={file.url || file.thumbUrl}
                        alt={file.name || `Ảnh ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          border: '1px solid #d9d9d9',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                        onClick={() => handlePreview(file)}
                      />
                    )}
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => handleImageRemove(file)}
                    />
                  </div>
                ))}
              </div>

            </Form.Item>
          </div >
          <br />
          <div className="flex justify-end items-center mb-3 border border-gray-200 z-10 p-2 rounded-lg shadow-sm ma">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  backgroundColor: '#003c71',
                  borderColor: '#003c71',
                  color: 'white',
                  minWidth: '100px'
                }}
              >
                Cập nhật
              </Button>
              <Button
                onClick={async () => {
                  // Xóa tất cả ảnh temp đã upload khi hủy
                  const tempFiles = uploadFileList.filter(file => file.filename);
                  if (tempFiles.length > 0) {
                    try {
                      const token = localStorage.getItem('token');
                      if (token) {
                        console.log('🗑️ Cleaning up temp images before canceling edit...');

                        // Xóa từng ảnh temp
                        for (const file of tempFiles) {
                          try {
                            await axios.delete(`/api/devices/errors/${error.id}/temp/images/${encodeURIComponent(file.filename)}`, {
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            console.log(`✅ Deleted temp image: ${file.filename}`);
                          } catch (error) {
                            console.error(`❌ Failed to delete temp image: ${file.filename}`, error);
                          }
                        }

                        message.success('Đã xóa ảnh tạm thời');
                      }
                    } catch (error) {
                      console.error('❌ Error cleaning up temp images:', error);
                    }
                  }

                  // Reset state và thoát edit mode
                  setIsEditing(false);
                  setUploadFileList([]);
                  setFilesToDelete([]);
                }}
                style={{
                  minWidth: '100px'
                }}
              >
                Hủy
              </Button>
            </Space>
          </div>
        </Form >
      );
    } catch (error) {
      console.error('❌ Error rendering edit content:', error);
      return <div>Error rendering form</div>;
    }
  };

  return (
    <Form.Provider>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileSearchOutlined />
            <span>Chi tiết lỗi thiết bị</span>
          </div>
        }
        open={visible}
        onCancel={onClose}
        width={1400}
        centered
        footer={null}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
          }
        }}
      >
        <div className="flex gap-4">
          <div className='w-2/3 rounded-lg'>
            {isEditing ? renderEditContent() : renderDetailContent()}</div>
          <div className='w-1/3 rounded-lg'>
            <Card
              style={{
                minHeight: 400,
                maxHeight: 600,
                height: '100%',
              }}
            >
              <Title level={4} style={{ color: '#003c71', margin: "0px" }}>
                <HistoryOutlined /> Lịch sử thay đổi
              </Title>

              <Timeline
                items={timelineItems.length > 0 ? timelineItems : [{ color: 'gray', children: <div>Không có lịch sử thay đổi</div> }]}
                style={{
                  maxHeight: 'calc(600px - 60px)', // 600px là maxHeight của Card, trừ đi khoảng 60px cho title và padding
                  overflowY: 'auto',
                  marginTop: '10px',
                  padding: '10px'
                }}
              />
            </Card>
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <CheckOutlined />
            <span>Xử lý lỗi</span>
          </div>
        }
        open={resolveModalVisible}
        onCancel={() => setResolveModalVisible(false)}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={resolveForm}
          onFinish={handleQuickResolve}
          layout="vertical"
          initialValues={{
            resolvedAt: dayjs()
          }}
        >
          <Form.Item
            name="resolvedAt"
            label="Thời điểm xử lý"
            rules={[{ required: true, message: 'Vui lòng chọn thời điểm xử lý' }]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="resolveStatus"
            label="Trạng thái xử lý"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái xử lý' }]}
            initialValue={DEVICE_ERROR_STATUS.RESOLVED}
          >
            <Select
              placeholder="trạng thái xử lý"
              options={[
                {
                  value: DEVICE_ERROR_STATUS.RESOLVED,
                  label: DEVICE_ERROR_STATUS_LABELS[DEVICE_ERROR_STATUS.RESOLVED]
                }
              ]}
            />
          </Form.Item>
          <Form.Item
            name="resolveNote"
            label="Ghi chú xử lý"
            rules={[{ required: true, message: 'Vui lòng nhập ghi chú xử lý' }]}
          >
            <TextArea rows={1}
              autoSize={{ minRows: 1, maxRows: 5 }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  backgroundColor: '#003c71',
                  borderColor: '#003c71',
                  color: 'white',
                  minWidth: '100px'
                }}
              >
                Xác nhận
              </Button>
              <Button
                onClick={() => setResolveModalVisible(false)}
                style={{
                  minWidth: '100px'
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <MailOutlined />
            <span>Gửi email thông báo</span>
          </div>
        }
        open={emailModalVisible}
        onCancel={() => setEmailModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        <Form
          form={emailForm}
          onFinish={handleSendEmail}
          layout="vertical"
          initialValues={{
            to: ['CNTT@vietinbank.vn'],
            cc: ['datacenter@vietinbank.vn']
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="to"
                label="Người nhận"
                rules={[{ required: true, message: 'Vui lòng nhập email người nhận' }]}
              >
                <Select
                  mode="tags"
                  placeholder="Nhập email người nhận"
                  style={{ width: '100%' }}
                  tokenSeparators={[',', ';']}
                  onInputKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.stopPropagation();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="cc"
                label="CC"
              >
                <Select
                  mode="tags"
                  placeholder="Nhập email CC"
                  style={{ width: '100%' }}
                  tokenSeparators={[',', ';', '']}
                  onInputKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.stopPropagation();
                    }
                  }}
                  initialValues={{
                    to: ['datacenter@vietinbank.vn']
                  }}
                />
              </Form.Item>

              <Form.Item
                name="customContent"
                label="Nội dung "
                tooltip="Nội dung này sẽ được hiển thị ở đầu email"
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập nội dung  (tùy chọn)"
                  style={{ resize: 'none' }}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      backgroundColor: '#003c71',
                      borderColor: '#003c71',
                      color: 'white',
                      minWidth: '100px'
                    }}
                  >
                    Gửi
                  </Button>
                  <Button
                    onClick={() => setEmailModalVisible(false)}
                    style={{
                      minWidth: '100px'
                    }}
                  >
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
            </Col>
            <Col span={12}>
              <div className="bg-gray-50 p-4 rounded border border-gray-200" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <h3 className="text-lg font-semibold mb-4">Nội dung email: </h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100 w-1/3">Tiêu đề:</td>
                      <td className="py-2 px-3">{`Thông báo lỗi thiết bị: ${error.subDeviceName}`}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100">Thiết bị:</td>
                      <td className="py-2 px-3">{error.subDeviceName}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100">Vị trí:</td>
                      <td className="py-2 px-3">{error.position || 'Chưa có'}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100">Số serial:</td>
                      <td className="py-2 px-3">{error.serialNumber}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100">Mã lỗi:</td>
                      <td className="py-2 px-3">{error.errorCode}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100">Thời điểm ghi nhận:</td>
                      <td className="py-2 px-3">{new Date(error.createdAt).toLocaleString('vi-VN')}</td>
                    </tr>
                    {error.resolvedAt && (
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 font-medium bg-gray-100">Thời điểm xử lý:</td>
                        <td className="py-2 px-3">{new Date(error.resolvedAt).toLocaleString('vi-VN')}</td>
                      </tr>
                    )}
                    {error.resolveNote && (
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 font-medium bg-gray-100">Ghi chú xử lý:</td>
                        <td className="py-2 px-3 whitespace-pre-line">{error.resolveNote}</td>
                      </tr>
                    )}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100">Trạng thái:</td>
                      <td className="py-2 px-3">
                        <Tag color={DEVICE_ERROR_STATUS_COLORS[error.resolveStatus] || 'default'}>
                          {error.resolveStatus}
                        </Tag>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100">Liên hệ:</td>
                      <td className="py-2 px-3">{currentUser?.username}@vietinbank.vn</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal preview ảnh */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        centered
        styles={{
          body: { textAlign: 'center', padding: 0 }
        }}
      >
        <div style={{ position: 'relative' }}>
          {previewImages.length > 0 && (
            <ImagePreview
              image={previewImages[previewIndex]?.split('/').pop()}
              deviceErrorId={error?.id}
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
            />
          )}
          {previewImages.length > 1 && (
            <>
              <Button
                type="primary"
                icon={<LeftOutlined />}
                onClick={handlePreviewPrev}
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1000
                }}
              />
              <Button
                type="primary"
                icon={<RightOutlined />}
                onClick={handlePreviewNext}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1000
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px'
              }}>
                {previewIndex + 1} / {previewImages.length}
              </div>
            </>
          )}
        </div>
      </Modal>
    </Form.Provider>
  );
};

export default DeviceErrorDetailModal;
