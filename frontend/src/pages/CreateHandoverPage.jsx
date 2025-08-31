import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Tag,
  List,
  Avatar,
  Radio,
  Select,
  Checkbox,
  Switch,
  Spin,
  Alert,
  Upload,
  Table,
  Descriptions,
  Modal,
  DatePicker
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  LoadingOutlined,
  ReloadOutlined,
  UploadOutlined,
  DeleteOutlined,
  FileOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from '../utils/axios';
import { uploadTempHandoverFiles, commitTempFilesToHandover, cleanupTempFiles, deleteTempFile } from '../services/shiftService.js';
import { useDeviceNames } from '../hooks/useDeviceNames';
import removeAccents from 'remove-accents';
import { DEVICE_ERROR_STATUS } from '../constants/deviceErrorStatus';

const { TextArea } = Input;
const { Title } = Typography;

const CreateHandoverPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(true);
  const [templateError, setTemplateError] = useState(null);
  const [currentShift, setCurrentShift] = useState(null);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deviceItems, setDeviceItems] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [ongoingTasks, setOngoingTasks] = useState([]);
  const { getDeviceList, loading: devicesLoading } = useDeviceNames();
  const [devices, setDevices] = useState([]);

  // Load devices từ API
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const deviceList = await getDeviceList();
        setDevices(deviceList);
      } catch (error) {
        console.error('Lỗi khi load devices:', error);
        // Fallback to empty array if API fails
        setDevices([]);
      }
    };
    loadDevices();
  }, [getDeviceList]);



  const getStatusColor = (status) => {
    const colorMap = {
      waiting: 'default',
      doing: 'green',
      handover: 'orange',
      done: 'red'
    };
    return colorMap[status] || 'default';
  };
  const getStatusText = (status) => {
    switch (status) {
      case 'draft':
        return 'Bản nháp';
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'doing':
        return 'Đang làm việc';
      case 'handover':
        return 'Đang bàn giao';
      default:
        return status;
    }
  };



  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateStr);
        return format(new Date(), 'dd/MM/yyyy', { locale: vi });
      }
      return format(date, 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error);
      return format(new Date(), 'dd/MM/yyyy', { locale: vi });
    }
  };

  const fetchFormTemplate = async () => {
    try {
      setTemplateLoading(true);
      setTemplateError(null);
      console.log('📝 Đang tải template form...');

      const response = await axios.get('/api/form-templates/handover');
      if (response.data?.success && response.data?.data) {
        console.log('✅ Tải template thành công');
      } else {
        throw new Error('Dữ liệu template không hợp lệ');
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải template:', error);
      setTemplateError('Không thể tải mẫu form bàn giao. Vui lòng thử lại.');
      throw error;
    } finally {
      setTemplateLoading(false);
    }
  };

  const fetchHandoverData = async () => {
    try {
      setLoading(true);
      console.log('📝 [EDIT] Bắt đầu tải dữ liệu biên bản bàn giao:', id);

      // 1. Lấy thông tin từ ShiftHandover
      const response = await axios.get(`/api/shifts/handover/${id}`);
      const handoverData = response.data;
      console.log('📝 [EDIT] Dữ liệu handover từ server:', handoverData);

      // Kiểm tra quyền và trạng thái
      const isUserInShift = handoverData.FromUsers?.some(user => user.id === currentUser?.id);
      if (!isUserInShift) {
        message.error('Bạn không thuộc ca này');
        navigate('/dc/handover');
        return;
      }

      if (handoverData.status !== 'draft') {
        message.error('Chỉ có thể sửa form bàn giao ở trạng thái bản nháp');
        navigate('/dc/handover');
        return;
      }

      // 2. Đảm bảo devices đã được load
      if (devices.length === 0) {
        console.log('📝 [EDIT] Devices chưa được load, đợi...');
        // Đợi devices được load
        await new Promise(resolve => {
          const checkDevices = () => {
            if (devices.length > 0) {
              resolve();
            } else {
              setTimeout(checkDevices, 100);
            }
          };
          checkDevices();
        });
      }

      // 3. Load tất cả lỗi mới nhất từ DeviceError cho tất cả devices
      console.log('📝 [EDIT] Bắt đầu load lỗi mới nhất từ DeviceError');
      console.log('📝 [EDIT] Số devices cần kiểm tra:', devices.length);
      const deviceItems = [];

      for (const device of devices) {
        try {
          const errorResponse = await axios.get(`/api/devices/errors`, {
            params: {
              deviceId: device.id,
              location: handoverData.FromShift?.name,
              'resolveStatus[]': [DEVICE_ERROR_STATUS.PENDING, DEVICE_ERROR_STATUS.IN_PROGRESS]
            }
          });
          console.log(`📝 [EDIT] Lỗi của thiết bị ${device.id}:`, errorResponse.data);
          console.log(`📝 [EDIT] errors length:`, errorResponse.data?.errors?.length);

          if (errorResponse.data?.errors && errorResponse.data.errors.length > 0) {
            console.log(`📝 [EDIT] Thiết bị ${device.id} có ${errorResponse.data.errors.length} lỗi`);
            // Có lỗi - thêm tất cả lỗi vào danh sách
            errorResponse.data.errors.forEach(error => {
              deviceItems.push({
                deviceErrorId: error.id,
                deviceId: device.id,
                status: 'Có lỗi',
                resultStatus: 'Có lỗi',
                subDeviceName: error.subDeviceName || '',
                serialNumber: error.serialNumber || '',
                errorCode: error.errorCode || '',
                errorCause: error.errorCause || '',
                solution: error.solution || '',
                resolveStatus: error.resolveStatus || DEVICE_ERROR_STATUS.PENDING,
                resolvedAt: null,
                resolveNote: null,
                resolvedBy: null,
                uniqueId: `error-${device.id}-${error.id}-${Date.now()}`,
                isNew: false,
                createdAt: error.createdAt
              });
            });
          } else {
            console.log(`📝 [EDIT] Thiết bị ${device.id} không có lỗi - thêm thiết bị bình thường`);
            // Không có lỗi - thêm thiết bị bình thường
            deviceItems.push({
              deviceId: device.id,
              status: 'Bình thường',
              resultStatus: 'Bình thường',
              subDeviceName: '',
              serialNumber: '',
              errorCode: '',
              errorCause: '',
              solution: '',
              resolveStatus: DEVICE_ERROR_STATUS.PENDING,
              resolvedAt: null,
              resolveNote: null,
              resolvedBy: null,
              uniqueId: `normal-${device.id}-${Date.now()}`,
              isNew: false
            });
          }
        } catch (error) {
          console.error(`❌ [EDIT] Lỗi khi lấy danh sách lỗi cho thiết bị ${device.id}:`, error);
          // Nếu lỗi API, thêm thiết bị bình thường
          deviceItems.push({
            deviceId: device.id,
            status: 'Bình thường',
            resultStatus: 'Bình thường',
            subDeviceName: '',
            serialNumber: '',
            errorCode: '',
            errorCause: '',
            solution: '',
            resolveStatus: DEVICE_ERROR_STATUS.PENDING,
            resolvedAt: null,
            resolveNote: null,
            resolvedBy: null,
            uniqueId: `normal-${device.id}-${Date.now()}`,
            isNew: false
          });
        }
      }

      console.log('📝 [EDIT] Danh sách deviceItems sau khi load từ API:', deviceItems);

      // 3. Cập nhật lại form và state
      form.resetFields();
      form.setFieldsValue({
        content: handoverData.content || '',
        handoverForm: {
          tools: {
            status: handoverData.handoverForm?.tools?.status || 'complete',
            missing: {
              items: handoverData.handoverForm?.tools?.missing?.items || [],
              description: handoverData.handoverForm?.tools?.missing?.description || '',
              details: {
                computer: handoverData.handoverForm?.tools?.missing?.details?.computer || false,
                phone: handoverData.handoverForm?.tools?.missing?.details?.phone || false,
                key: handoverData.handoverForm?.tools?.missing?.details?.key || false,
                other: handoverData.handoverForm?.tools?.missing?.details?.other || false,
                otherDescription: handoverData.handoverForm?.tools?.missing?.details?.otherDescription || ''
              }
            }
          },
          environment: {
            status: handoverData.handoverForm?.environment?.status ?? true,
            description: handoverData.handoverForm?.environment?.description || '',
          },
          tasks: handoverData.handoverForm?.tasks || [] // Đảm bảo tasks được cập nhật
        },
        deviceItems: deviceItems
      });
      setDeviceItems(deviceItems);
      setIsEdit(true);

      // Cập nhật state ongoingTasks
      if (handoverData.handoverForm?.tasks) {
        console.log('[DEBUG] Cập nhật ongoingTasks từ handoverData:', handoverData.handoverForm.tasks);
        setOngoingTasks(handoverData.handoverForm.tasks);
      }

      // 6. Xử lý file đính kèm
      if (handoverData.attachments && handoverData.attachments.length > 0) {
        setAttachments(handoverData.attachments);
        console.log('📝 [EDIT] File đính kèm:', handoverData.attachments);
      }

      console.log('✅ [EDIT] Hoàn thành tải và cập nhật dữ liệu');

    } catch (error) {
      console.error('❌ [EDIT] Lỗi khi tải dữ liệu:', error);
      message.error('Không thể tải thông tin form bàn giao');
      navigate('/dc/handover');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentShift = async () => {
    try {
      setLoading(true);
      console.log('👥 Đang tải thông tin ca làm việc...');

      const response = await axios.get('/api/shifts/current');
      if (response.data?.shift) {
        const shiftData = {
          ...response.data.shift,
          date: response.data.shift.date || new Date().toISOString().split('T')[0]
        };
        setCurrentShift(shiftData);

        // Lấy danh sách người dùng trong ca
        const usersResponse = await axios.get(`/api/shifts/${response.data.shift.id}/users`);
        const allUsers = [
          ...(usersResponse.data.data || []),
          ...(response.data.shift.workedUsers || [])
        ].filter((user, index, self) =>
          index === self.findIndex(u => u.id === user.id)
        );

        setCurrentUsers(allUsers);
        console.log('✅ Tải thông tin ca làm việc thành công');
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải thông tin ca:', error);
      message.error('Không thể tải thông tin ca làm việc');
      throw error;
    } finally {
      setLoading(false);
    }
  };



  const initializeFormData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      console.log('🔄 Bắt đầu khởi tạo dữ liệu...');

      // 1. Lấy template form trước
      await fetchFormTemplate();

      // 2. Lấy thông tin ca hiện tại và người dùng
      await fetchCurrentShift();

      // 3. Nếu đang edit, lấy dữ liệu handover
      if (id) {
        await fetchHandoverData();
      } else {
        // Không fetch lỗi thiết bị ở đây nữa, sẽ fetch ở useEffect bên dưới
        // Set giá trị mặc định cho form - sử dụng setTimeout để tránh warning
        setTimeout(() => {
          form.setFieldsValue(getInitialValues());
        }, 0);
      }

      console.log('✅ Khởi tạo dữ liệu hoàn tất');
    } catch (error) {
      console.error('❌ Lỗi khi khởi tạo dữ liệu:', error);
      message.error('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại');
    } finally {
      setIsLoadingData(false);
    }
  }, [id, devices]);

  useEffect(() => {
    initializeFormData();
  }, [initializeFormData]);

  // Fetch tất cả devices (có lỗi và bình thường) khi currentShift?.name đã sẵn sàng và đang tạo mới
  const fetchAllDeviceErrors = useCallback(async () => {
    if (!id && currentShift?.name && devices.length > 0) {
      console.log('📝 [CREATE] Bắt đầu fetch tất cả devices cho tạo mới');

      for (const device of devices) {
        try {
          const errorResponse = await axios.get(`/api/devices/errors`, {
            params: {
              deviceId: device.id,
              location: currentShift.name,
              'resolveStatus[]': [DEVICE_ERROR_STATUS.PENDING, DEVICE_ERROR_STATUS.IN_PROGRESS]
            }
          });

          if (errorResponse.data?.errors && errorResponse.data.errors.length > 0) {
            console.log(`📝 [CREATE] Device ${device.id} có ${errorResponse.data.errors.length} lỗi`);
            // Có lỗi - thêm tất cả lỗi vào danh sách
            errorResponse.data.errors.forEach(error => {
              setDeviceItems(prevItems => [...prevItems, {
                deviceErrorId: error.id,
                deviceId: device.id,
                status: 'Có lỗi',
                resultStatus: 'Có lỗi',
                subDeviceName: error.subDeviceName || '',
                serialNumber: error.serialNumber || '',
                errorCode: error.errorCode || '',
                errorCause: error.errorCause || '',
                solution: error.solution || '',
                resolveStatus: error.resolveStatus || DEVICE_ERROR_STATUS.PENDING,
                resolvedAt: null,
                resolveNote: null,
                resolvedBy: null,
                uniqueId: `error-${device.id}-${error.id}-${Date.now()}`,
                isNew: false,
                createdAt: error.createdAt
              }]);
            });
          } else {
            console.log(`📝 [CREATE] Device ${device.id} không có lỗi - thêm thiết bị bình thường`);
            // Không có lỗi - thêm thiết bị bình thường
            setDeviceItems(prevItems => [...prevItems, {
              deviceId: device.id,
              status: 'Bình thường',
              resultStatus: 'Bình thường',
              subDeviceName: '',
              serialNumber: '',
              errorCode: '',
              errorCause: '',
              solution: '',
              resolveStatus: DEVICE_ERROR_STATUS.PENDING,
              resolvedAt: null,
              resolveNote: null,
              resolvedBy: null,
              uniqueId: `normal-${device.id}-${Date.now()}`,
              isNew: false
            }]);
          }
        } catch (error) {
          console.error(`❌ [CREATE] Lỗi khi lấy danh sách lỗi cho thiết bị ${device.id}:`, error);
          // Nếu lỗi API, thêm thiết bị bình thường
          setDeviceItems(prevItems => [...prevItems, {
            deviceId: device.id,
            status: 'Bình thường',
            resultStatus: 'Bình thường',
            subDeviceName: '',
            serialNumber: '',
            errorCode: '',
            errorCause: '',
            solution: '',
            resolveStatus: DEVICE_ERROR_STATUS.PENDING,
            resolvedAt: null,
            resolveNote: null,
            resolvedBy: null,
            uniqueId: `normal-${device.id}-${Date.now()}`,
            isNew: false
          }]);
        }
      }
    }
  }, [currentShift?.name, id, devices]);

  useEffect(() => {
    fetchAllDeviceErrors();
  }, [fetchAllDeviceErrors]);

  const getInitialValues = () => ({
    handoverForm: {
      tools: {
        status: 'complete',
        missing: {
          items: [],
          description: '',
          details: {
            computer: false,
            phone: false,
            key: false,
            other: false,
            otherDescription: ''
          }
        }
      },
      environment: {
        status: true,
        description: '',
        hasOngoingTasks: false,
        ongoingTasks: '',
        progress: '',
        estimatedCompletion: ''
      },
      infrastructure: {
        powerDistribution: { status: 'normal' },
        ups: { status: 'normal' },
        cooling: { status: 'normal' },
        cctv: { status: 'normal' },
        accessControl: { status: 'normal' },
        fireSystem: { status: 'normal' },
        dcimSystem: { status: 'normal' }
      },
      ongoingTasks: {
        hasOngoingTasks: false,
        taskInfo: '',
        relatedTasks: ''
      },
      tasks: []
    }
  });

  const fetchOngoingTasks = useCallback(async () => {
    try {
      if (!currentShift?.name) return;

      const response = await axios.get(`/api/tasks`, {
        params: {
          'status[]': ['in_progress', 'waiting', 'pending'],
          location: currentShift.name
        }
      });

      if (response.data?.tasks) {
        console.log(`[DEBUG] Fetched ${response.data.tasks.length} ongoing tasks for shift: ${currentShift.name}`);
        setOngoingTasks(response.data.tasks);

        // Cập nhật form values với thông tin task
        const taskValues = response.data.tasks.map(task => {
          // Tạo fullName từ staff array (có cả đơn vị nếu có)
          let fullName = '';
          if (task.staff && Array.isArray(task.staff) && task.staff.length > 0) {
            const staffNames = task.staff.map(staff => {
              let name = staff.fullName || staff.name || 'Không xác định';
              if (staff.donVi) name += ` (${staff.donVi})`;
              return name;
            });
            fullName = staffNames.join(', ');
          } else {
            // Fallback: sử dụng task.fullName hoặc tạo giá trị mặc định
            fullName = task.fullName || `Công việc ${task.id}`;
          }

          // Đảm bảo staff có đủ trường donVi, fullName, id, email, phone, role
          const staff = Array.isArray(task.staff)
            ? task.staff.map(user => ({
              id: user.id,
              fullName: user.fullName || user.name || '',
              donVi: user.donVi || '',
              email: user.email || '',
              phone: user.phone || '',
              role: user.role || null
            }))
            : [];

          return {
            id: task.id,
            location: task.location,
            fullName: fullName, // Sử dụng fullName được tạo từ staff (có cả đơn vị)
            taskTitle: task.taskTitle,
            taskDescription: task.taskDescription,
            status: task.status,
            checkInTime: task.checkInTime,
            checkOutTime: task.checkOutTime,
            userId: task.userId,
            createdBy: task.createdBy,
            completedBy: task.completedBy,
            workSessionId: task.workSessionId,
            workShiftId: task.workShiftId,
            staff // staff đã chuẩn hóa
          };
        });

        // Sử dụng setTimeout để tránh warning về state update trong render
        setTimeout(() => {
          // Lấy giá trị hiện tại của form
          const currentFormValues = form.getFieldsValue();

          // Cập nhật form với task values mới
          form.setFieldsValue({
            handoverForm: {
              ...currentFormValues.handoverForm,
              tasks: taskValues
            },
            ongoingTasks: taskValues
          });
        }, 0);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách task đang làm:', error);
      message.error('Không thể lấy danh sách công việc đang làm');
    }
  }, [currentShift, form]);

  // Thêm useEffect để fetch ongoing tasks khi có currentShift
  useEffect(() => {
    if (currentShift?.id) {
      fetchOngoingTasks();
    }
  }, [currentShift, fetchOngoingTasks]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log('🔍 Form values trước khi xử lý:', values);

      // Lấy deviceItems từ state thay vì từ form
      const formDeviceItems = deviceItems.filter(Boolean);
      console.log('🔍 DeviceItems từ state:', formDeviceItems);

      // Chuẩn bị dữ liệu thiết bị và lỗi
      const devicesToSend = [];
      const allDeviceErrors = [];

      // Xử lý tất cả devices (có lỗi và bình thường) cho cả tạo mới và edit
      formDeviceItems.forEach(item => {
        console.log(`[DEBUG] Xử lý item:`, item);

        if (item.status === 'Bình thường') {
          // Thiết bị bình thường
          devicesToSend.push({
            deviceId: item.deviceId,
            status: 'Bình thường',
            resultStatus: 'Bình thường',
            subDeviceName: null,
            serialNumber: null,
            errorCode: null,
            errorCause: null,
            solution: null,
            resolveStatus: '',
            resolvedAt: null,
            resolveNote: null,
            resolvedBy: null
          });
        } else if (item.status === 'Có lỗi') {
          // Thiết bị có lỗi
          const deviceError = {
            deviceId: item.deviceId,
            deviceName: devices.find(d => d.id === item.deviceId)?.name || `Thiết bị ${item.deviceId}`,
            status: 'Có lỗi',
            resultStatus: 'Có lỗi',
            subDeviceName: item.subDeviceName || '',
            serialNumber: item.serialNumber || '',
            errorCode: item.errorCode || '',
            errorCause: item.errorCause || '',
            solution: item.solution || '',
            resolveStatus: item.resolveStatus || DEVICE_ERROR_STATUS.PENDING,
            resolvedAt: item.resolvedAt || null,
            resolveNote: item.resolveNote || null,
            resolvedBy: item.resolvedBy || null
          };

          // Nếu là lỗi đã tồn tại trong ShiftHandoverDevice (chỉ khi edit)
          if (item.shiftHandoverDeviceId) {
            deviceError.id = item.shiftHandoverDeviceId;
          }

          // Thêm deviceErrorId nếu có
          if (item.deviceErrorId) {
            deviceError.deviceErrorId = item.deviceErrorId;
          }

          devicesToSend.push(deviceError);

          // Thêm vào allDeviceErrors nếu có deviceErrorId
          if (item.deviceErrorId) {
            allDeviceErrors.push({
              id: item.deviceErrorId,
              deviceId: item.deviceId,
              deviceName: deviceError.deviceName,
              status: 'Có lỗi',
              resultStatus: 'Có lỗi',
              subDeviceName: item.subDeviceName || '',
              serialNumber: item.serialNumber || '',
              errorCode: item.errorCode || '',
              errorCause: item.errorCause || '',
              solution: item.solution || '',
              resolveStatus: item.resolveStatus || DEVICE_ERROR_STATUS.PENDING,
              resolvedAt: item.resolvedAt || null,
              resolveNote: item.resolveNote || null,
              resolvedBy: item.resolvedBy || null
            });
          }
        }
      });

      console.log('🔍 DevicesToSend sau khi xử lý:', devicesToSend);
      console.log('🔍 AllDeviceErrors sau khi xử lý:', allDeviceErrors);

      // Cập nhật items dựa trên details của công cụ thiếu
      const details = values.handoverForm?.tools?.missing?.details;
      const missingItems = [];
      if (details) {
        if (details.computer) missingItems.push('Máy tính');
        if (details.phone) missingItems.push('Điện thoại');
        if (details.key) missingItems.push('Chìa khóa');
        if (details.other) missingItems.push('Khác');
      }

      // Chuẩn bị dữ liệu tasks
      const tasks = ongoingTasks.map(task => {
        // Tạo fullName từ staff array (có cả đơn vị nếu có)
        let fullName = '';
        if (task.staff && Array.isArray(task.staff) && task.staff.length > 0) {
          const staffNames = task.staff.map(staff => {
            let name = staff.fullName || staff.name || 'Không xác định';
            if (staff.donVi) name += ` (${staff.donVi})`;
            return name;
          });
          fullName = staffNames.join(', ');
        } else {
          // Fallback: sử dụng task.fullName hoặc tạo giá trị mặc định
          fullName = task.fullName || `Công việc ${task.id}`;
        }

        // Đảm bảo staff có đủ trường donVi, fullName, id, email, phone, role
        const staff = Array.isArray(task.staff)
          ? task.staff.map(user => ({
            id: user.id,
            fullName: user.fullName || user.name || '',
            donVi: user.donVi || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || null
          }))
          : [];

        return {
          id: task.id,
          location: task.location,
          fullName: fullName, // Sử dụng fullName được tạo từ staff (có cả đơn vị)
          taskTitle: task.taskTitle,
          taskDescription: task.taskDescription,
          status: task.status,
          checkInTime: task.checkInTime,
          checkOutTime: task.checkOutTime,
          userId: task.userId,
          createdBy: task.createdBy,
          completedBy: task.completedBy,
          workSessionId: task.workSessionId,
          workShiftId: task.workShiftId,
          staff // staff đã chuẩn hóa
        };
      });

      console.log('[DEBUG] Tasks data to be sent:', tasks);

      // Chuẩn bị dữ liệu gửi đi
      const formData = {
        shiftId: currentShift?.id,
        content: values.content?.trim() || '',
        handoverForm: {
          tools: {
            status: values.handoverForm?.tools?.status || 'complete',
            missing: {
              items: missingItems,
              description: values.handoverForm?.tools?.missing?.description?.trim() || '',
              details: {
                computer: details?.computer || false,
                phone: details?.phone || false,
                key: details?.key || false,
                other: details?.other || false,
                otherDescription: details?.otherDescription?.trim() || ''
              }
            }
          },
          environment: {
            status: values.handoverForm?.environment?.status ?? true,
            description: values.handoverForm?.environment?.description?.trim() || ''
          },
          tasks: tasks // Sử dụng tasks đã được chuẩn bị
        },
        devices: devicesToSend,
        deviceErrors: allDeviceErrors
      };

      // Thêm log để debug
      console.log('[DEBUG] Final form data to be sent:', formData);

      let response;
      if (isEdit) {
        console.log('✏️ Đang cập nhật bản nháp:', id);
        response = await axios.patch(`/api/shifts/handover/${id}`, formData);
        console.log('✅ Kết quả cập nhật:', response.data);
      } else {
        console.log('➕ Đang tạo bản nháp mới');
        response = await axios.post('/api/shifts/handover/draft', formData);
        console.log('✅ Kết quả tạo mới:', response.data);
      }

              const handoverId = response.data?.id || response.data?.handover?.id;
        if (handoverId) {
          // Commit temp files nếu có
          if (tempSessionId && attachments.some(f => f.isTemp)) {
            try {
              await commitTempFilesToHandover(handoverId, tempSessionId);
              message.success('Đã commit tất cả file tạm');
            } catch (error) {
              console.error('Lỗi khi commit temp files:', error);
              message.warning('Không thể commit một số file tạm');
            }
          }

        message.success(isEdit ? 'Cập nhật bản nháp thành công' : 'Tạo bản nháp thành công');
        navigate(`/dc/handover/${handoverId}`);
      } else {
        console.error('❌ Không thể lấy ID của biên bản:', response.data);
        message.error('Không thể lấy ID của biên bản sau khi lưu');
        navigate('/dc/handover');
      }
    } catch (error) {
      console.error('❌ Lỗi khi xử lý form:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý tên file tiếng Việt
  const formatFileName = (filename) => {
    try {
      // Lấy phần mở rộng của file
      const ext = filename.split('.').pop();
      // Tạo tên file không dấu
      const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
      const cleanName = removeAccents(nameWithoutExt)
        .replace(/[^a-zA-Z0-9]/g, '_') // Thay thế ký tự đặc biệt bằng dấu gạch dưới
        .replace(/_+/g, '_') // Loại bỏ các dấu gạch dưới liên tiếp
        .toLowerCase(); // Chuyển thành chữ thường
      return `${cleanName}.${ext}`;
    } catch (error) {
      console.error('Lỗi khi xử lý tên file:', error);
      return filename;
    }
  };

  // State cho temp files
  const [tempSessionId, setTempSessionId] = useState(null);

  // Hàm xử lý tải file lên
  const handleUpload = async (file) => {
    try {
      setUploading(true);

      // Kiểm tra kích thước file
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File không được vượt quá 10MB!');
        return false;
      }

      // Kiểm tra định dạng file
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        
        // Microsoft Word
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-word.document.12',
        
        // Microsoft Excel
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.12',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        
        // Microsoft PowerPoint
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint.presentation.12',
        'application/vnd.ms-powerpoint.slideshow.12',
        
        // Microsoft Access
        'application/vnd.ms-access',
        'application/x-msaccess',
        
        // Microsoft Publisher
        'application/x-mspublisher',
        
        // Microsoft Visio
        'application/vnd.visio',
        'application/vnd.visio2013',
        
        // Microsoft Project
        'application/vnd.ms-project',
        
        // Microsoft OneNote
        'application/onenote',
        'application/msonenote',
        
        // OpenDocument formats
        'application/vnd.oasis.opendocument.text',
        'application/vnd.oasis.opendocument.spreadsheet',
        'application/vnd.oasis.opendocument.presentation',
        'application/vnd.oasis.opendocument.graphics',
        'application/vnd.oasis.opendocument.chart',
        'application/vnd.oasis.opendocument.formula',
        'application/vnd.oasis.opendocument.database',
        'application/vnd.oasis.opendocument.image',
        
        'text/plain'
      ];
      if (!allowedTypes.includes(file.type)) {
        message.error(`Định dạng file ${file.type} không được hỗ trợ!`);
        return false;
      }

      // Tạo file mới với tên đã được xử lý
      const newFileName = formatFileName(file.name);
      const newFile = new File([file], newFileName, { type: file.type });

      // Kiểm tra nếu đang tạo mới (không có id)
      if (!id) {
        // Upload file tạm lên server
        const formData = new FormData();
        formData.append('files', newFile);
        formData.append('originalname', file.name);
        
        // Tạo session ID nếu chưa có
        if (!tempSessionId) {
          setTempSessionId(`temp_${currentUser?.id}_${Date.now()}`);
        }
        formData.append('sessionId', tempSessionId || `temp_${currentUser?.id}_${Date.now()}`);

        const response = await uploadTempHandoverFiles(formData);

        if (response && response.files) {
          const tempFile = {
            filename: response.files[0].filename,
            originalname: file.name,
            size: file.size,
            type: file.type,
            sessionId: response.sessionId,
            isTemp: true
          };

          // Cập nhật state
          setAttachments(prev => [...prev, tempFile]);
          setTempSessionId(response.sessionId);
          message.success('File đã được tải lên tạm thời');
        } else {
          message.error('Không nhận được thông tin file từ server');
        }
        return false;
      }

      // Nếu đã có id, upload file lên server
      const formData = new FormData();
      formData.append('files', newFile);
      formData.append('originalname', file.name);

      const response = await axios.post(`/api/shifts/handover/${id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data && response.data.files) {
        const processedFiles = response.data.files.map(file => ({
          ...file,
          filename: file.filename,
          originalname: file.originalname || file.name
        }));
        setAttachments(prev => [...prev, ...processedFiles]);
        message.success('Tải file lên thành công');
      } else {
        message.error('Không nhận được thông tin file từ server');
      }

      return false;
    } catch (error) {
      console.error('Lỗi khi tải file lên:', error);
      message.error(error.response?.data?.message || 'Không thể tải file lên');
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Thêm hàm để chuyển base64 thành File object
  const base64ToFile = (base64, filename, type) => {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], filename, { type });
  };

  const handleDeleteFile = async (id, filename) => {
    try {
      // Kiểm tra nếu là file tạm
      const tempFile = attachments.find(f => f.filename === filename && f.isTemp);
      if (tempFile) {
        // Xóa file tạm khỏi server
        try {
          await deleteTempFile(tempFile.sessionId, filename);
          console.log('✅ Deleted temp file from server:', filename);
        } catch (error) {
          console.error('❌ Error deleting temp file from server:', error);
          // Vẫn xóa khỏi state ngay cả khi server lỗi
        }
        
        // Xóa file tạm khỏi state
        setAttachments(prev => prev.filter(file => file.filename !== filename));
        message.success('Đã xóa file khỏi danh sách');
        return;
      }

      if (!id) {
        console.error('Không có ID handover để xóa file');
        return;
      }

      const response = await axios.delete(`/api/shifts/handover/${id}/attachments/${filename}`);

      if (response.data.handover) {
        setAttachments(response.data.handover.attachments || []);
        message.success('Xóa file thành công');
      } else {
        console.error('Định dạng response không hợp lệ:', response.data);
        message.error('Lỗi khi xóa file');
      }
    } catch (error) {
      console.error('Lỗi khi xóa file:', error);
      if (error.response?.status === 404) {
        // Cập nhật lại danh sách file nếu file không tồn tại
        const updatedHandover = await axios.get(`/api/shifts/handover/${id}`);
        if (updatedHandover) {
          setAttachments(updatedHandover.data.attachments || []);
        }
      } else {
        message.error(error.response?.data?.message || 'Lỗi khi xóa file');
      }
    }
  };

  // Cleanup temp files khi component unmount hoặc cancel
  const cleanupTempFilesOnCancel = async () => {
    if (tempSessionId && attachments.some(f => f.isTemp)) {
      try {
        await cleanupTempFiles(tempSessionId);
        console.log('✅ Cleaned up temp files');
      } catch (error) {
        console.error('❌ Error cleaning up temp files:', error);
      }
    }
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      cleanupTempFilesOnCancel();
    };
  }, [tempSessionId]);

  // Cleanup khi user cancel
  const handleCancel = () => {
    cleanupTempFilesOnCancel();
    navigate('/dc/handover');
  };

  // Hàm lấy danh sách file đính kèm
  const fetchAttachments = async () => {
    if (!id) return;

    try {
      // Lấy thông tin handover để lấy danh sách file đính kèm
      const response = await axios.get(`/api/shifts/handover/${id}`);
      if (response.data && response.data.attachments) {
        console.log('Đang cập nhật danh sách file từ dữ liệu handover:', response.data.attachments);
        setAttachments(response.data.attachments);
      } else {
        console.log('Không tìm thấy file đính kèm trong dữ liệu handover');
        setAttachments([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu handover:', error);
      message.error('Không thể tải thông tin form bàn giao');
    }
  };

  // Thêm useEffect để fetch attachments khi vào trang edit
  useEffect(() => {
    if (id) {
      fetchAttachments();
    }
  }, [id]);

  // Cập nhật phần render danh sách file
  const renderAttachments = () => (
    <Card type="inner" title="File đính kèm" className="mt-4">
      <Upload
        name="files"
        multiple={true}
        beforeUpload={handleUpload}
        showUploadList={false}
        disabled={uploading}
        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.xlsm,.ppt,.pptx,.ppsx,.mdb,.pub,.vsd,.vsdx,.mpp,.one,.odt,.ods,.odp,.odg,.odc,.odf,.odb,.odi,.txt"
      >
        <Button icon={<UploadOutlined />} loading={uploading}>
          Tải file lên
        </Button>
      </Upload>

      {attachments.length > 0 && (
        <List
          className="mt-4"
          size="small"
          dataSource={attachments}
          renderItem={file => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteFile(id, file.filename)}
                >
                  Xóa
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<FileOutlined />}
                title={file.originalname}
                description={`${(file.size / 1024).toFixed(2)} KB`}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );

  // Render loading state
  if (isLoadingData || templateLoading || devicesLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <div className="mt-4">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (templateError) {
    return (
      <div className="p-6">
        <Alert
          message="Lỗi"
          description={templateError}
          type="error"
          showIcon
          action={
            <Button
              icon={<ReloadOutlined />}
              onClick={initializeFormData}
              type="primary"
            >
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <div className="mb-4 flex items-center">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dc/my-shifts')}
            className="mr-4"
          >
            Quay lại
          </Button>
          <Title level={4} className="mb-0">
            {isEdit ? 'Sửa bản nháp bàn giao' : 'Tạo bản nháp bàn giao'}
          </Title>
        </div>
        <Card title="Thông tin ca" className="mb-4">
          <Row gutter={24}>
            <Col span={8}>
              <div className="mb-4">
                <div className="font-medium mb-1">Ca làm việc:</div>
                <Tag color="blue">{currentShift?.code || 'N/A'}</Tag>
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <div className="font-medium mb-1">Ngày làm việc:</div>
                <div>{currentShift?.date ? formatDate(currentShift.date) : 'N/A'}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="mb-4">
                <div className="font-medium mb-1">Trạng thái:</div>
                <Tag color={getStatusColor(currentShift?.status)}>
                  {getStatusText(currentShift?.status)}
                </Tag>
              </div>
            </Col>
            <Col span={24}>
              <div className="mb-4">
                <div className="font-medium mb-1">Người trong ca:</div>
                {currentUsers && currentUsers.length > 0 ? (
                  <List
                    size="small"
                    dataSource={currentUsers}
                    renderItem={user => (
                      <List.Item>
                        <Space>
                          <Avatar icon={<UserOutlined />} />
                          <span>{user.fullname}</span>
                          {user.id === currentUser?.id && (
                            <Tag color="blue">Bạn</Tag>
                          )}
                        </Space>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div>Chưa có người trong ca</div>
                )}
              </div>
            </Col>
          </Row>
        </Card>

        <Card title="Biên Bản Bàn Giao" className="mb-4">
          <Form form={form} layout="vertical">


            {/* Environment and Tools Status */}
            <Row gutter={16} className="mb-4">
              <Col span={12}>
                <Form.Item
                  name={['handoverForm', 'tools', 'status']}
                  label="Trạng thái công cụ làm việc"
                  required
                >
                  <Select>
                    <Select.Option value="complete">Đầy đủ</Select.Option>
                    <Select.Option value="incomplete">Thiếu</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues?.handoverForm?.tools?.status !== currentValues?.handoverForm?.tools?.status
                  }
                >
                  {({ getFieldValue }) => {
                    const toolsStatus = getFieldValue(['handoverForm', 'tools', 'status']);
                    return toolsStatus === 'incomplete' && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-medium mb-4">Chọn thiết bị thiếu:</div>
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <Form.Item
                              name={['handoverForm', 'tools', 'missing', 'details', 'computer']}
                              valuePropName="checked"
                            >
                              <Checkbox>Máy tính</Checkbox>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['handoverForm', 'tools', 'missing', 'details', 'phone']}
                              valuePropName="checked"
                            >
                              <Checkbox>Điện thoại</Checkbox>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['handoverForm', 'tools', 'missing', 'details', 'key']}
                              valuePropName="checked"
                            >
                              <Checkbox>Chìa khóa</Checkbox>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={['handoverForm', 'tools', 'missing', 'details', 'other']}
                              valuePropName="checked"
                            >
                              <Checkbox>Khác</Checkbox>
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item noStyle shouldUpdate={(prevValues, currentValues) =>
                          prevValues?.handoverForm?.tools?.missing?.details?.other !==
                          currentValues?.handoverForm?.tools?.missing?.details?.other
                        }>
                          {({ getFieldValue }) => {
                            const isOtherChecked = getFieldValue(['handoverForm', 'tools', 'missing', 'details', 'other']);
                            return isOtherChecked && (
                              <Form.Item
                                name={['handoverForm', 'tools', 'missing', 'details', 'otherDescription']}
                                label="Mô tả thiết bị khác"
                                rules={[{ required: true, message: 'Vui lòng mô tả thiết bị khác' }]}
                              >
                                <Input.TextArea rows={2} placeholder="Nhập mô tả thiết bị khác" />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>

                        <Form.Item
                          name={['handoverForm', 'tools', 'missing', 'description']}
                          label="Mô tả chi tiết tình trạng thiếu thiết bị"
                          required
                          rules={[
                            { required: true, message: 'Vui lòng mô tả chi tiết về tình trạng thiếu thiết bị' },
                          ]}
                          extra="Vui lòng mô tả chi tiết nguyên nhân, thời điểm và tình trạng thiếu thiết bị"
                        >
                          <TextArea
                            rows={3}
                            placeholder=""
                          />
                        </Form.Item>
                      </div>
                    );
                  }}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['handoverForm', 'environment', 'status']}
                  label="Trạng thái môi trường"
                  required
                >
                  <Select>
                    <Select.Option value={true}>Tốt</Select.Option>
                    <Select.Option value={false}>Chưa tốt</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues?.handoverForm?.environment?.status !== currentValues?.handoverForm?.environment?.status
                  }
                >
                  {({ getFieldValue }) => {
                    const environmentStatus = getFieldValue(['handoverForm', 'environment', 'status']);
                    return environmentStatus === false && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <Form.Item
                          name={['handoverForm', 'environment', 'description']}
                          label="Mô tả chi tiết tình trạng môi trường"
                          required
                          rules={[
                            { required: true, message: 'Vui lòng mô tả chi tiết về tình trạng môi trường' },
                          ]}
                          extra="Vui lòng mô tả chi tiết về các vấn đề môi trường cần khắc phục"
                        >
                          <TextArea
                            rows={4}
                            placeholder=""
                          />
                        </Form.Item>
                      </div>
                    );
                  }}
                </Form.Item>
              </Col>
            </Row>
            <Divider>Danh sách thiết bị kiểm tra</Divider>

            {/* Device Section */}
            <Table
              dataSource={devices}
              rowKey="id"
              pagination={false}
              bordered
              columns={[
                {
                  title: 'STT',
                  dataIndex: 'id',
                  key: 'id',
                  width: 60,
                  className: 'custom-header border-gray-200',
                  render: (_, record, index) => (
                    <div className="text-center">
                      {index + 1}
                    </div>
                  )
                },
                {
                  title: 'Thiết bị',
                  dataIndex: 'name',
                  key: 'name',
                  width: '30%',
                  className: 'custom-header border-gray-200'
                },
                {
                  title: 'Trạng thái',
                  key: 'status',
                  className: 'custom-header border-gray-200',
                  render: (_, device) => {
                    const deviceErrors = deviceItems.filter(item =>
                      item.deviceId === device.id && item.status === 'Có lỗi'
                    );
                    const hasNewError = deviceItems.some(item =>
                      item.deviceId === device.id && item.isNew
                    );
                    const errors = deviceItems.filter(
                      i => i.deviceId === device.id && i.status === 'Có lỗi' && (i.resolveStatus === undefined || i.resolveStatus === DEVICE_ERROR_STATUS.PENDING || i.resolveStatus === DEVICE_ERROR_STATUS.IN_PROGRESS)
                    );
                    const resolvedErrors = deviceItems.filter(
                      i => i.deviceId === device.id && i.status === 'Có lỗi' && i.resolveStatus === DEVICE_ERROR_STATUS.RESOLVED
                    );
                    const isNormal = errors.length === 0 && resolvedErrors.length === 0;

                    return (
                      <div >
                        {deviceErrors.length === 0 && !hasNewError ? (
                          <Tag color="success">✓ Bình thường</Tag>
                        ) : (
                          <div >
                            <div className="ant-space ant-space-horizontal ant-space-align-center ant-space-justify-between mb-2" >
                              <div>
                                {isNormal ? <Tag color="green">Bình thường</Tag> : <Tag color="red">Có lỗi</Tag>}
                              </div>
                            </div>

                            {(!isNormal) && (
                              <div className="ant-space ant-space-vertical ant-space-gap-4">
                                {[...errors, ...resolvedErrors].map((item) => (
                                  <Card
                                    key={item.uniqueId}
                                    size="small"
                                    className="ant-card-bordered mb-4"
                                    style={{ background: '#fff1f0', borderColor: '#ff4d4f' }}
                                    title={<span style={{ color: '#ff4d4f' }}>Tên thiết bị: {item.subDeviceName || 'Không rõ'}</span>}
                                  >
                                    <div className="ant-descriptions-item"><b>Serial:</b> {item.serialNumber}</div>
                                    <div className="ant-descriptions-item"><b>Tình trạng lỗi:</b> {item.errorCode}</div>
                                    <div className="ant-descriptions-item"><b>Nguyên nhân:</b> {item.errorCause}</div>
                                    <div className="ant-descriptions-item"><b>Giải pháp:</b> {item.solution}</div>
                                    <div className="ant-descriptions-item"><b>Trạng thái:</b> {item.resolveStatus}</div>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                }
              ]}
            />
          </Form>
        </Card>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="mt-4"
          initialValues={getInitialValues()}
        >
          <Card>
            <Form.Item
              name="ongoingTasks"
              label="Công việc đang làm"
            >
              <Table
                dataSource={ongoingTasks}
                rowKey="id"
                pagination={false}
                bordered
                columns={[
                  {
                    title: 'Mã',
                    dataIndex: 'id',
                    key: 'id',
                    width: '4%',
                    className: 'custom-header border-gray-200',
                    render: (text) => (
                      <div className="text-center">
                        CV {text}
                      </div>
                    )
                  },
                  {
                    title: 'Địa điểm',
                    dataIndex: 'location',
                    key: 'location',
                    width: 200,
                    className: 'custom-header border-gray-200',
                  },

                  {
                    title: 'Tên công việc',
                    dataIndex: 'taskTitle',
                    key: 'taskTitle',
                    width: 200,
                    className: 'custom-header border-gray-200',
                  },
                  {
                    title: 'Mô tả',
                    dataIndex: 'taskDescription',
                    key: 'taskDescription',
                    width: '30%',
                    className: 'custom-header border-gray-200',
                  },
                  {
                    title: 'Nhân sự',
                    key: 'staff',
                    width: '15%',
                    className: 'custom-header border-gray-200',
                    render: (_, record) => {
                      if (Array.isArray(record.staff) && record.staff.length > 0) {
                        return record.staff.map((user, idx) => (
                          <span key={user.id || idx}>
                            {user.fullName || user.name}
                            {user.donVi ? ` (${user.donVi})` : ''}
                            {idx < record.staff.length - 1 ? ', ' : ''}
                          </span>
                        ));
                      }
                      return record.fullName || 'Không xác định';
                    }
                  },

                  {
                    title: 'Thời gian vào',
                    dataIndex: 'checkInTime',
                    key: 'checkInTime',
                    width: '10%',
                    className: 'custom-header border-gray-200',
                    render: (time) => (
                      <div className="whitespace-pre-line break-words">
                        {new Date(time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </div>
                    )
                  },
                  {
                    title: 'Thời gian ra',
                    dataIndex: 'checkOutTime',
                    key: 'checkOutTime',
                    width: '10%',
                    className: 'custom-header border-gray-200',
                    render: (time) => (
                      <div className="whitespace-pre-line break-words">
                        {new Date(time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </div>
                    )
                  },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    key: 'status',
                    width: 100,
                    className: 'custom-header border-gray-200',
                    render: (status) => {
                      const statusMap = {
                        in_progress: { color: 'processing', text: 'Đang thực hiện' },
                        waiting: { color: 'default', text: 'Chờ xử lý' },
                        pending: { color: 'warning', text: 'Tạm dừng' }
                      };
                      const statusInfo = statusMap[status] || { color: 'default', text: status };
                      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
                    }
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung bàn giao"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung bàn giao' }]}
            >
              <TextArea rows={3} placeholder="Nhập nội dung bàn giao..." />
            </Form.Item>

            {renderAttachments()}

          </Card>

          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => navigate(-1)}>Quay Lại</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                Lưu
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateHandoverPage;
