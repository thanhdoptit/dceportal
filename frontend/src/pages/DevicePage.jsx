import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Card,
  Timeline,
  message,
  Row,
  Col,
  DatePicker,
  Upload,
  Image
} from 'antd';
import { AimOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined, IeOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import DeviceErrorDetailModal from '../components/DeviceErrorDetailModal';
import LocationSelect from '../components/common/LocationSelect';
import dayjs from 'dayjs';
import {
  DEVICE_ERROR_STATUS,
  DEVICE_ERROR_STATUS_COLORS,
  DEVICE_ERROR_STATUS_FILTER_OPTIONS,
  STATUS_ORDER,
  DEVICE_ERROR_STATUS_OPTIONS,
  DEVICE_ERROR_STATUS_LABELS
} from '../constants/deviceErrorStatus';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Hàm chuyển đổi file thành base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// Component chính
const DevicePage = () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [selectedError, setSelectedError] = useState(null);
  const [errorHistory, setErrorHistory] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [resolveStatusFilter, setResolveStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('Tất cả');
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0
  });


  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImagePaths, setUploadedImagePaths] = useState([]);
  const [fileUidToFilename, setFileUidToFilename] = useState(new Map()); // Lưu file paths cho backend
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const navigate = useNavigate();

  // Lấy token xác thực
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Cấu hình axios
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Xử lý lỗi xác thực
  const handleUnauthorized = () => {
    message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Lấy danh sách thiết bị
  const fetchDevices = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await axios.get('/api/devices', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDevices(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        message.error('Không thể lấy danh sách thiết bị');
        console.error('Lỗi khi lấy danh sách thiết bị:', error);
      }
    }
  };

  // Lấy danh sách lỗi của thiết bị hoặc tất cả thiết bị
  const fetchErrors = async (deviceId, resolveStatus = 'all', location = 'all', dateRange = null, page = 1, limit = 15) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }
      let url = '/api/devices/errors';
      const params = [];
      if (deviceId && deviceId !== 'all') params.push(`deviceId=${deviceId}`);
      if (resolveStatus && resolveStatus !== 'all') params.push(`resolveStatus=${resolveStatus}`);
      if (location && location !== 'Tất cả') params.push(`location=${location}`);
      if (dateRange && dateRange[0] && dateRange[1]) {
        const startDate = dayjs(dateRange[0]).startOf('day').utc().toISOString();
        const endDate = dayjs(dateRange[1]).endOf('day').utc().toISOString();
        params.push(`startDate=${startDate}`);
        params.push(`endDate=${endDate}`);
      }
      params.push(`page=${page}`);
      params.push(`limit=${limit}`);
      if (params.length > 0) url += `?${params.join('&')}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const errorsData = response.data.errors || [];
      console.log('DeviceErrors data:', errorsData); // Debug log

      setErrors(errorsData);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
        page,
        limit
      }));
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        message.error('Không thể lấy danh sách lỗi');
        console.error('Lỗi khi lấy danh sách lỗi:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn thiết bị
  const handleDeviceChange = (deviceId) => {
    // Xử lý khi clear filter (deviceId là undefined/null)
    if (!deviceId) {
      setSelectedDevice('all');
      fetchErrors('all', resolveStatusFilter, locationFilter, dateRange, 1, pagination.limit);
      return;
    }

    setSelectedDevice(deviceId);
    fetchErrors(deviceId, resolveStatusFilter, locationFilter, dateRange, 1, pagination.limit);
  };

  // Xử lý khi chọn filter trạng thái
  const handleStatusFilterChange = (value) => {
    // Xử lý khi clear filter (value là undefined/null)
    if (!value) {
      setResolveStatusFilter('all');
      fetchErrors(selectedDevice, 'all', locationFilter, dateRange, 1, pagination.limit);
      return;
    }

    setResolveStatusFilter(value);
    fetchErrors(selectedDevice, value, locationFilter, dateRange, 1, pagination.limit);
  };

  // Xử lý khi chọn filter địa điểm
  const handleLocationFilterChange = (value) => {
    // Xử lý khi clear filter (value là undefined/null)
    if (!value) {
      setLocationFilter('Tất cả');
      fetchErrors(selectedDevice, resolveStatusFilter, 'Tất cả', dateRange, 1, pagination.limit);
      return;
    }

    // Nếu value là id, map sang name
    let locationName = value;
    if (locations.length > 0) {
      const found = locations.find(loc => loc.id === value || loc.name === value);
      if (found) locationName = found.name;
    }
    setLocationFilter(locationName);
    fetchErrors(selectedDevice, resolveStatusFilter, locationName, dateRange, 1, pagination.limit);
  };

  // Xử lý khi chọn khoảng thời gian
  const handleDateRangeChange = (dates) => {
    console.log('Date range changed:', dates);
    if (dates) {
      console.log('Selected dates:', {
        start: dates[0]?.format('YYYY-MM-DD HH:mm:ss'),
        end: dates[1]?.format('YYYY-MM-DD HH:mm:ss')
      });
    }
    setDateRange(dates);
    fetchErrors(selectedDevice, resolveStatusFilter, locationFilter, dates, 1, pagination.limit);
  };

  // Reset tất cả filter về trạng thái mặc định (đã comment vì không sử dụng)
  // const handleResetAllFilters = () => {
  //   setSelectedDevice('all');
  //   setResolveStatusFilter('all');
  //   setLocationFilter('Tất cả');
  //   setDateRange(null);
  //   setPagination(prev => ({ ...prev, page: 1 }));
  //   fetchErrors('all', 'all', 'Tất cả', null, 1, pagination.limit);
  // };

  // Lấy lịch sử lỗi
  const fetchErrorHistory = async (errorId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await axios.get(`/api/devices/errors/${errorId}/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setErrorHistory(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        message.error('Không thể lấy lịch sử lỗi');
        console.error('Lỗi khi lấy lịch sử:', error);
      }
    }
  };

  // Xử lý lỗi
  const handleResolve = async (values) => {
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }
      const payload = {
        resolveStatus: values.resolveStatus,
        resolveNote: values.resolveNote,
        solution: values.solution,
        errorCause: values.errorCause,
        subDeviceName: values.subDeviceName,
        serialNumber: values.serialNumber,
        errorCode: values.errorCode,
        position: values.position
      };
      if (values.resolveStatus === 'Đã xử lý') {
        payload.resolvedAt = new Date();
      }
      await axios.put(`/api/devices/errors/${selectedError.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      message.success('Cập nhật lỗi thành công');
      fetchErrors(selectedDevice, resolveStatusFilter, locationFilter, dateRange, 1, pagination.limit);
      await fetchErrorHistory(selectedError.id);

      // Lấy lại thông tin lỗi mới nhất và cập nhật selectedError
      const response = await axios.get(`/api/devices/errors/${selectedError.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Nếu API trả về object lỗi nằm trong response.data.error hoặc response.data
      setSelectedError(response.data.error || response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        message.error('Không thể cập nhật lỗi');
        console.error('Lỗi khi cập nhật:', error);
      }
    }
  };

  // Hiển thị chi tiết lỗi
  const showDetail = async (error) => {
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      // Lấy thông tin chi tiết mới nhất từ API
      const response = await axios.get(`/api/devices/errors/${error.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSelectedError(response.data);
      await fetchErrorHistory(error.id);
      setDetailModalVisible(true);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        message.error('Không thể lấy thông tin chi tiết lỗi');
        console.error('Lỗi khi lấy thông tin chi tiết:', error);
      }
    }
  };

  // Xử lý tạo mới lỗi thiết bị
  const handleCreate = async (values) => {
    console.log('🚀 === BẮT ĐẦU TẠO DEVICE ERROR ===');
    console.log('📋 Form values:', values);
    console.log('📁 Uploaded images count:', uploadedImages.length);
    console.log('📁 Uploaded image paths count:', uploadedImagePaths.length);
    console.log('📁 Uploaded images:', uploadedImages);
    console.log('📁 Uploaded image paths:', uploadedImagePaths);

    let locationName = values.location;
    if (locations.length > 0 && values.location !== 'Tất cả') {
      const found = locations.find(loc => loc.id === values.location || loc.name === values.location);
      if (found) locationName = found.name;
    }

    const payload = {
      ...values,
      location: locationName, // location là tên địa điểm
      position: values.position || null,
      images: uploadedImagePaths.length > 0 ? JSON.stringify(uploadedImagePaths) : null,
      dateStart: values.dateStart ? dayjs(values.dateStart).toISOString() : null,
      dateEnd: values.dateEnd ? dayjs(values.dateEnd).toISOString() : null,
      dateTerminal: values.dateTerminal ? dayjs(values.dateTerminal).toISOString() : null,
    };

    console.log('📤 Payload to send:', payload);
    console.log('📤 Images payload:', payload.images);
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      console.log('📤 Sending request to /api/devices/errors');
      const response = await axios.post('/api/devices/errors', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Response from backend:', response.data);
      message.success('Tạo lỗi thiết bị thành công');
      setCreateModalVisible(false);
      createForm.resetFields();
      setUploadedImages([]);
      setUploadedImagePaths([]);
      fetchErrors(selectedDevice, resolveStatusFilter, locationFilter, dateRange, 1, pagination.limit);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        // Log chi tiết lỗi trả về từ backend
        console.error('Lỗi khi tạo lỗi:', error, error.response?.data);
        message.error(error.response?.data?.error || 'Không thể tạo lỗi');
      }
    }
  };

  // Hàm xử lý upload hình ảnh trong modal tạo mới - VERSION MỚI
  const handleCreateImageUpload = async (file) => {
    console.log('📤 Create modal - handleCreateImageUpload called with file:', file);

    try {
      const formData = new FormData();
      formData.append('images', file.originFileObj || file);

      const token = getAuthToken();
      if (!token) {
        message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
        return false;
      }

      console.log('📤 Uploading to temp endpoint, token exists:', !!token);

      const response = await axios.post('/api/devices/errors/temp/images', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 giây timeout
      });

      console.log('📤 Upload response:', response.data);

      if (response.data.uploadedUrls && response.data.uploadedUrls.length > 0) {
        message.success(`Upload ${response.data.uploadedUrls.length} hình ảnh thành công`);

        // Thêm URL vào danh sách hình ảnh đã upload
        console.log('📤 Setting uploadedImages with URLs:', response.data.uploadedUrls);

        // Lưu file paths cho backend và tạo blob URLs cho hiển thị
        const filePaths = response.data.uploadedUrls; // Lưu paths gốc cho backend
        const fullUrls = await Promise.all(response.data.uploadedUrls.map(async (url) => {
          try {
            const filename = url.split('/').pop();
            const apiUrl = `${import.meta.env.VITE_API_URL}/api/devices/errors/temp/images/${filename}`;

            console.log(`🔗 Loading image as blob: ${apiUrl}`);

            const token = getAuthToken();
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
            // Fallback to API URL
            const filename = url.split('/').pop();
            return `${import.meta.env.VITE_API_URL}/api/devices/errors/temp/images/${filename}`;
          }
        }));

        setUploadedImages(prev => {
          const newImages = [...prev, ...fullUrls];
          console.log('📤 New uploadedImages state:', newImages);
          return newImages;
        });

        setUploadedImagePaths(prev => {
          const newPaths = [...prev, ...filePaths];
          console.log('📤 New uploadedImagePaths state:', newPaths);
          return newPaths;
        });

        // Lưu mapping giữa file uid và filename
        const newMapping = new Map(fileUidToFilename);
        filePaths.forEach((path, index) => {
          const filename = path.split('/').pop();
          const uid = file.uid || `file-${Date.now()}-${index}`;
          newMapping.set(uid, filename);
        });
        setFileUidToFilename(newMapping);
        console.log('🗑️ Updated fileUidToFilename mapping:', Object.fromEntries(newMapping));

        // Hiển thị warnings nếu có
        if (response.data.warnings && response.data.warnings.length > 0) {
          response.data.warnings.forEach(warning => {
            message.warning(warning);
          });
        }

        return true; // Upload thành công
      } else {
        message.warning('Không có hình ảnh nào được upload');
        return false;
      }
    } catch (error) {
      console.error('❌ Lỗi khi upload hình ảnh:', error);

      if (error.response?.status === 401) {
        handleUnauthorized();
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

  // Xử lý upload nhiều hình ảnh cùng lúc
  const handleCreateMultipleImageUpload = async (fileList) => {
    try {
      const token = getAuthToken();
      if (!token) {
        message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
        return false;
      }

      console.log('📤 Create modal - handleCreateMultipleImageUpload called with files:', fileList);
      console.log('📤 Uploading multiple files to temp endpoint, token exists:', !!token);

      // Tạo FormData với nhiều file
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('images', file.originFileObj || file);
      });

      // Upload files
      const response = await axios.post('/api/devices/errors/temp/images', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 giây timeout
      });

      console.log('📤 Multiple upload response:', response.data);

      if (response.data.uploadedUrls && response.data.uploadedUrls.length > 0) {
        message.success(`Upload thành công ${response.data.uploadedUrls.length} hình ảnh`);

        const filePaths = response.data.uploadedUrls; // Lưu paths gốc cho backend
        const fullUrls = await Promise.all(response.data.uploadedUrls.map(async (url) => {
          try {
            const filename = url.split('/').pop();
            const apiUrl = `${import.meta.env.VITE_API_URL}/api/devices/errors/temp/images/${filename}`;
            console.log(`🔗 Loading image as blob: ${apiUrl}`);
            const token = getAuthToken();
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
            return `${import.meta.env.VITE_API_URL}/api/devices/errors/temp/images/${filename}`;
          }
        }));

        setUploadedImages(prev => {
          const newImages = [...prev, ...fullUrls];
          console.log('📤 New uploadedImages state:', newImages);
          return newImages;
        });

        setUploadedImagePaths(prev => {
          const newPaths = [...prev, ...filePaths];
          console.log('📤 New uploadedImagePaths state:', newPaths);
          return newPaths;
        });

        // Lưu mapping giữa file uid và filename
        const newMapping = new Map(fileUidToFilename);
        fileList.forEach((file, fileIndex) => {
          if (filePaths[fileIndex]) {
            const filename = filePaths[fileIndex].split('/').pop();
            const uid = file.uid || `file-${Date.now()}-${fileIndex}`;
            newMapping.set(uid, filename);
          }
        });
        setFileUidToFilename(newMapping);
        console.log('🗑️ Updated fileUidToFilename mapping:', Object.fromEntries(newMapping));

        // Hiển thị warnings nếu có
        if (response.data.warnings && response.data.warnings.length > 0) {
          response.data.warnings.forEach(warning => {
            message.warning(warning);
          });
        }

        return true; // Upload thành công
      } else {
        message.warning('Không có hình ảnh nào được upload');
        return false;
      }
    } catch (error) {
      console.error('❌ Lỗi khi upload nhiều hình ảnh:', error);

      if (error.response?.status === 401) {
        handleUnauthorized();
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

  // Hàm xử lý preview hình ảnh
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  // Hàm xử lý xóa hình ảnh trong modal tạo mới
  const handleCreateImageRemove = async (file) => {
    try {
      const token = getAuthToken();
      if (!token) {
        message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      console.log('🗑️ === XÓA IMAGE ===');
      console.log('🗑️ File object:', file);
      console.log('🗑️ File URL:', file.url);
      console.log('🗑️ File name:', file.name);
      console.log('🗑️ File uid:', file.uid);
      console.log('🗑️ File status:', file.status);
      console.log('🗑️ File type:', file.type);
      console.log('🗑️ File response:', file.response);
      console.log('🗑️ File originFileObj:', file.originFileObj);

      // Chuyển đổi URL từ full URL về filename cho backend
      let filename = '';

      console.log('🗑️ === EXTRACTING FILENAME ===');
      console.log('🗑️ File URL type:', typeof file.url);
      console.log('🗑️ File URL includes /api/:', file.url && file.url.includes('/api/devices/errors/temp/images/'));
      console.log('🗑️ File URL starts with VITE_API_URL:', file.url && file.url.startsWith(import.meta.env.VITE_API_URL));
      console.log('🗑️ File URL starts with blob:', file.url && file.url.startsWith('blob:'));

      // Ưu tiên lấy filename từ URL thực tế
      if (file.url && file.url.includes('/api/devices/errors/temp/images/')) {
        filename = file.url.split('/').pop();
        console.log('🗑️ Extracted filename from API URL:', filename);
      } else if (file.url && file.url.startsWith(import.meta.env.VITE_API_URL)) {
        // Nếu là static URL, lấy filename từ cuối
        filename = file.url.split('/').pop();
        console.log('🗑️ Extracted filename from static URL:', filename);
      } else if (file.url && file.url.startsWith('blob:')) {
        // Nếu là blob URL, cần tìm filename từ uploadedImagePaths
        console.log('🗑️ Blob URL detected, searching for filename...');
        console.log('🗑️ Current uploadedImagePaths:', uploadedImagePaths);
        console.log('🗑️ Current fileUidToFilename mapping:', Object.fromEntries(fileUidToFilename));

        // Ưu tiên tìm từ mapping trước
        if (file.uid && fileUidToFilename.has(file.uid)) {
          filename = fileUidToFilename.get(file.uid);
          console.log('🗑️ Found filename from mapping:', filename);
        } else {
          // Fallback: tìm theo logic cũ
          console.log('🗑️ No mapping found, using fallback logic...');

          // Tìm filename từ uploadedImagePaths dựa trên file uid hoặc name
          console.log('🗑️ Searching for matching path...');
          console.log('🗑️ File uid:', file.uid);
          console.log('🗑️ File name:', file.name);

          // Thử tìm theo uid trước
          let matchingPath = null;

          // Nếu uid là số âm (như -0, -1, -2), có thể là index ngược
          if (file.uid && file.uid.startsWith('-')) {
            const index = Math.abs(parseInt(file.uid));
            console.log('🗑️ Negative uid detected, using as reverse index:', index);

            if (index < uploadedImagePaths.length) {
              const reverseIndex = uploadedImagePaths.length - 1 - index;
              matchingPath = uploadedImagePaths[reverseIndex];
              console.log('🗑️ Found path by reverse index:', reverseIndex, matchingPath);
            }
          } else {
            // Tìm theo name hoặc uid
            matchingPath = uploadedImagePaths.find(path => {
              const pathFilename = path.split('/').pop();
              return file.name === pathFilename || file.uid === pathFilename;
            });
          }

          if (matchingPath) {
            filename = matchingPath.split('/').pop();
            console.log('🗑️ Found matching path:', matchingPath);
            console.log('🗑️ Extracted filename from matching path:', filename);
          } else {
            // Fallback: lấy file cuối cùng nếu không tìm được
            if (uploadedImagePaths.length > 0) {
              filename = uploadedImagePaths[uploadedImagePaths.length - 1].split('/').pop();
              console.log('🗑️ No matching path found, using last uploaded file:', filename);
            } else {
              filename = file.name || 'unknown';
              console.log('🗑️ No matching path found, using file.name:', filename);
            }
          }
        }
      } else {
        // Fallback: lấy filename từ file.name nếu có
        filename = file.name || 'unknown';
        console.log('🗑️ Extracted filename from fallback (file.name):', filename);
      }

      // Thử lấy filename từ file.response nếu có
      if (file.response && file.response.uploadedUrls && file.response.uploadedUrls.length > 0) {
        const responseFilename = file.response.uploadedUrls[0].split('/').pop();
        console.log('🗑️ Found filename in file.response:', responseFilename);
        if (responseFilename && responseFilename !== filename) {
          console.log('🗑️ Using filename from response instead:', responseFilename);
          filename = responseFilename;
        }
      }

      console.log('🗑️ Final filename:', filename);
      console.log('🗑️ Delete URL:', `${import.meta.env.VITE_API_URL}/api/devices/errors/temp/images/${encodeURIComponent(filename)}`);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/errors/temp/images/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('🗑️ Response status:', response.status);
      console.log('🗑️ Response ok:', response.ok);

      if (response.ok) {
        message.success('Xóa hình ảnh thành công');

        // Xóa URL khỏi danh sách hình ảnh đã upload
        setUploadedImages(prev => prev.filter(url => url !== file.url));

        // Xóa file path khỏi danh sách paths
        const filename = file.url.split('/').pop();
        setUploadedImagePaths(prev => prev.filter(path => !path.includes(filename)));

        // Xóa mapping
        if (file.uid) {
          const newMapping = new Map(fileUidToFilename);
          newMapping.delete(file.uid);
          setFileUidToFilename(newMapping);
          console.log('🗑️ Removed mapping for uid:', file.uid);
        }
      } else if (response.status === 401) {
        handleUnauthorized();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Xóa hình ảnh thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi xóa hình ảnh:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        message.error('Lỗi kết nối. Vui lòng thử lại.');
      } else {
        message.error('Xóa hình ảnh thất bại');
      }
    }
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      width: '3%',
      className: 'custom-header border-gray-200',
      render: (id) => id,
      align: 'center',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      width: '6%',
      className: 'custom-header border-gray-200',
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'subDeviceName',
      key: 'subDeviceName',
      width: '8%',
      className: 'custom-header border-gray-200',
      render: (text) => (
        <div className="whitespace-pre-line break-words">
          {text}
        </div>
      )
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      width: '6%',
      className: 'custom-header border-gray-200',
      render: (text) => (
        <div className="whitespace-pre-line break-words">
          {text || 'Chưa có'}
        </div>
      )
    },
    {
      title: 'Số serial',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: '8%',
      className: 'custom-header border-gray-200',
      render: (text) => (
        <div className="whitespace-pre-line break-words">
          {text}
        </div>
      )
    },
    {
      title: 'Mã lỗi',
      dataIndex: 'errorCode',
      key: 'errorCode',
      width: '8%',
      className: 'custom-header border-gray-200',
      render: (text) => (
        <div className="whitespace-pre-line break-words">
          {text}
        </div>
      )
    },
    {
      title: 'Nguyên nhân',
      dataIndex: 'errorCause',
      key: 'errorCause',
      width: '8%',
      className: 'custom-header border-gray-200',
      ellipsis: true,
      render: (text) => (
        <div className="whitespace-pre-line break-words">
          {text}
        </div>
      )
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '5%',
      className: 'custom-header border-gray-200',
      render: (date) => dayjs(date).format(' HH:mm DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'resolveStatus',
      key: 'resolveStatus',
      width: '4%',
      align: 'center',
      className: 'custom-header border-gray-200',
      render: (status) => (
        <Tag color={DEVICE_ERROR_STATUS_COLORS[status] || 'default'} className="whitespace-pre-line break-words flex justify-center">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '3%',
      align: 'center',
      className: 'custom-header border-gray-200',
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => showDetail(record)}
            size='small'
            type='primary'
            className="flex items-center gap-2 bg-[#0F60FF] hover:bg-[#0040FF] text-white whitespace-pre-line break-words justify-center"
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      page,
      limit: pageSize
    }));
    fetchErrors(selectedDevice, resolveStatusFilter, locationFilter, dateRange, page, pageSize);
  };

  // Fetch danh sách location khi mount
  useEffect(() => {
    setLocationsLoading(true);
    axios.get('/api/locations')
      .then(res => setLocations(res.data))
      .catch(() => setLocations([]))
      .finally(() => setLocationsLoading(false));
  }, []);

  useEffect(() => {
    fetchDevices();
    fetchErrors(selectedDevice, resolveStatusFilter, locationFilter, dateRange, 1, pagination.limit);
  }, []);

  return (
    <div className="p-0">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={4} style={{ color: '#003c71', margin: 0 }}>Quản lý sự cố hạ tầng Trung Tâm Dữ Liệu</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
            style={{ backgroundColor: '#003c71', borderColor: '#003c71', color: 'white' }}
          >
            Tạo mới
          </Button>
        </div>
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={16} align="middle">
            <Col>
              <Text strong>Thiết bị:</Text>
            </Col>
            <Col>
              <Select
                style={{ width: 300 }}
                placeholder="Chọn loại thiết bị"
                onChange={handleDeviceChange}
                value={selectedDevice === 'all' ? undefined : selectedDevice}
                allowClear={true}
              >
                {devices.map(device => (
                  <Select.Option key={device.id} value={device.id}>
                    {device.deviceName}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Text strong>Trạng thái:</Text>
            </Col>
            <Col>
              <Select
                style={{ width: 180 }}
                placeholder="Chọn trạng thái"
                value={resolveStatusFilter === 'all' ? undefined : resolveStatusFilter}
                onChange={handleStatusFilterChange}
                allowClear={true}
                options={DEVICE_ERROR_STATUS_FILTER_OPTIONS}
              />
            </Col>
            <Col>
              <Text strong>Địa điểm:</Text>
            </Col>
            <Col>
              <LocationSelect
                style={{ width: 180 }}
                value={locationFilter === 'Tất cả' ? undefined : locationFilter}
                onChange={handleLocationFilterChange}
                placeholder="Chọn địa điểm"
                allowClear={true}
                locations={locations}
                locationsLoading={locationsLoading}
                optionLabelProp="children"
                getPopupContainer={trigger => trigger.parentNode}
                showAllOption={false}
              />
            </Col>
            <Col>
              <Text strong>Thời gian tạo:</Text>
            </Col>
            <Col>
              <RangePicker
                style={{ width: 300 }}
                onChange={handleDateRangeChange}
                value={dateRange}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
                allowClear={true}
                showTime={false}
                disabledDate={(current) => {
                  return current && current > dayjs();
                }}
              />
            </Col>
            {/* <Col>
              <Button
                onClick={handleResetAllFilters}
                style={{ marginLeft: '8px' }}
              >
                Reset tất cả
              </Button>
              </Col> */}
          </Row>
        </Card>
        <Table
          columns={columns}
          dataSource={errors}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            onChange: handlePaginationChange,
            showSizeChanger: true,
            pageSizeOptions: ['15', '20', '50', '100'],
            defaultPageSize: 15,
            showTotal: (total) => `Tổng số ${total}`,
            locale: { items_per_page: '/ Trang' }
          }}
          bordered
          defaultSortOrder="ascend"

        />

        {/* Modal tạo mới lỗi thiết bị */}
        <Modal
          title="Tạo mới lỗi thiết bị"
          open={createModalVisible}
          onCancel={() => {
            setCreateModalVisible(false);
            createForm.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreate}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="deviceId"
                  label="Thiết bị"
                  rules={[{ required: true, message: 'Vui lòng chọn thiết bị' }]}
                >
                  <Select placeholder="Chọn thiết bị">
                    {devices.map(device => (
                      <Select.Option key={device.id} value={device.id}>
                        {device.deviceName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Địa điểm"
                  rules={[{ required: true, message: 'Vui lòng chọn địa điểm' }]}
                >
                  <LocationSelect
                    placeholder="Chọn địa điểm"
                    activeOnly={true}
                    locations={locations}
                    locationsLoading={locationsLoading}
                    optionLabelProp="children"
                    getPopupContainer={trigger => trigger.parentNode}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="subDeviceName"
                  label="Tên thiết bị"
                  rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}
                >
                  <Input placeholder="Nhập tên thiết bị" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="serialNumber"
                  label="Số serial"
                  rules={[{ required: true, message: 'Vui lòng nhập số serial' }]}
                >
                  <Input placeholder="Nhập số serial" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="Vị trí"
                  rules={[{ required: true, message: 'Vui lòng nhập vị trí thiết bị' }]}
                >
                  <Input placeholder="Ví dụ: Rack A1, Slot 2" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="resolveStatus"
                  label="Trạng thái"
                  initialValue={DEVICE_ERROR_STATUS.PENDING}
                >
                  <Select
                    options={DEVICE_ERROR_STATUS_OPTIONS}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="errorCode"
                  label="Mã lỗi"
                  rules={[{ required: true, message: 'Vui lòng nhập mã lỗi' }]}
                >
                  <Input placeholder="Nhập mã lỗi" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="errorCause"
              label="Nguyên nhân"
              rules={[{ required: true, message: 'Vui lòng nhập nguyên nhân' }]}
            >
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                placeholder="Nhập nguyên nhân lỗi"
              />
            </Form.Item>

            <Form.Item
              name="solution"
              label="Giải pháp"
              rules={[{ required: true, message: 'Vui lòng nhập giải pháp' }]}
            >
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                placeholder="Nhập giải pháp khắc phục"
              />
            </Form.Item>

            <Form.Item label="Hình ảnh lỗi">
              <div style={{ marginBottom: 16 }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="multiple-image-upload"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    console.log('🔍 Multiple file input selected:', files);

                    if (files.length === 0) return;

                    // Kiểm tra số lượng file
                    const totalFiles = uploadedImages.length + files.length;
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
                      await handleCreateImageUpload(files[0]);
                    } else {
                      await handleCreateMultipleImageUpload(files);
                    }

                    // Reset input
                    e.target.value = '';
                  }}
                />
                <Button
                  type="dashed"
                  onClick={() => document.getElementById('multiple-image-upload').click()}
                  style={{ width: '100%', height: 100, borderStyle: 'dashed' }}
                  disabled={uploadedImages.length >= 10}
                >
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Chọn nhiều ảnh</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {uploadedImages.length}/10 ảnh
                  </div>
                </Button>
              </div>

              {/* Hiển thị danh sách ảnh đã upload */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {uploadedImages.map((url, index) => (
                  <div key={index} style={{ position: 'relative', width: 104, height: 104 }}>
                    <img
                      src={url}
                      alt={`Ảnh ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        border: '1px solid #d9d9d9',
                        borderRadius: 6
                      }}
                      onClick={() => handlePreview({ url, name: `image-${index + 1}` })}
                    />
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
                      onClick={() => handleCreateImageRemove({ url, uid: `-${index}` })}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                Hỗ trợ: JPG, PNG, GIF, WEBP. Kích thước tối đa: 5MB/ảnh. Có thể chọn nhiều file cùng lúc.
              </div>
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={async () => {
                  // Xóa tất cả ảnh temp đã upload
                  if (uploadedImages.length > 0) {
                    try {
                      const token = getAuthToken();
                      if (token) {
                        console.log('🗑️ Cleaning up temp images before closing modal...');

                        // Xóa từng ảnh temp
                        for (const imagePath of uploadedImagePaths) {
                          const filename = imagePath.split('/').pop();
                          try {
                            await axios.delete(`/api/devices/errors/temp/images/${encodeURIComponent(filename)}`, {
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            console.log(`✅ Deleted temp image: ${filename}`);
                          } catch (error) {
                            console.error(`❌ Failed to delete temp image: ${filename}`, error);
                          }
                        }

                        message.success('Đã xóa ảnh tạm thời');
                      }
                    } catch (error) {
                      console.error('❌ Error cleaning up temp images:', error);
                    }
                  }

                  // Reset form và state
                  setCreateModalVisible(false);
                  createForm.resetFields();
                  setUploadedImages([]);
                  setUploadedImagePaths([]);
                  setFileUidToFilename(new Map());
                }}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: '#003c71', borderColor: '#003c71', color: 'white' }}
                >
                  Tạo mới
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <DeviceErrorDetailModal
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          error={selectedError}
          history={errorHistory}
          onResolve={handleResolve}
          onRefresh={() => fetchErrors(selectedDevice, resolveStatusFilter, locationFilter, dateRange, 1, pagination.limit)}
          setSelectedError={setSelectedError}
        />

        {/* Modal preview hình ảnh */}
        <Modal
          open={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Card>
    </div>
  );
};

export default DevicePage;
