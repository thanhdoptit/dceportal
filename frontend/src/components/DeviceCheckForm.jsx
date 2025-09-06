import { DeleteOutlined, EyeOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEVICE_ERROR_STATUS } from '../constants/deviceErrorStatus';
import { useAuth } from '../contexts/AuthContext';
import { useDeviceNames } from '../hooks/useDeviceNames';
import '../styles/TimePicker.css';
import axios from '../utils/axios';
import { formatDateTime } from '../utils/dateUtils';
import DeviceErrorDetailModal from './DeviceErrorDetailModal';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Set default timezone to Asia/Ho_Chi_Minh
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

const { TextArea } = Input;
const { Title, Text } = Typography;
const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const CustomTimeInput = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = e => {
    let val = e.target.value;
    setInputValue(val);

    // Handle "10h" format
    if (val.endsWith('h')) {
      const hour = val.replace('h', '');
      if (!isNaN(hour)) {
        onChange(dayjs().hour(parseInt(hour)).minute(0));
        return;
      }
    }

    // Handle "10:30" or "10h30" format
    const matches = val.match(/^(\d{1,2})[h:](\d{2})$/);
    if (matches) {
      const [_, hours, minutes] = matches;
      if (
        parseInt(hours) >= 0 &&
        parseInt(hours) < 24 &&
        parseInt(minutes) >= 0 &&
        parseInt(minutes) < 60
      ) {
        onChange(dayjs().hour(parseInt(hours)).minute(parseInt(minutes)));
        return;
      }
    }
  };

  return (
    <Input
      value={value ? dayjs(value).format('HH:mm') : inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      className='w-full'
    />
  );
};

// Component con để render kết quả kiểm tra thiết bị
const DeviceResult = React.memo(
  ({ formIndex, deviceIndex, deviceId, deviceName, onResultChange }) => {
    const handleNormalChange = useCallback(
      e => {
        const value = e.target.value;
        onResultChange(deviceIndex, { isNormal: value });
      },
      [deviceIndex, onResultChange]
    );

    return (
      <>
        <Form.Item
          name={['deviceCheckForm', 'forms', formIndex, 'devices', deviceIndex, 'id']}
          hidden
          initialValue={deviceId}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['deviceCheckForm', 'forms', formIndex, 'devices', deviceIndex, 'name']}
          hidden
          initialValue={deviceName}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={[
            'deviceCheckForm',
            'forms',
            formIndex,
            'devices',
            deviceIndex,
            'result',
            'isNormal',
          ]}
          noStyle
          initialValue={true}
        >
          <Radio.Group onChange={handleNormalChange}>
            <Radio value={true}>Hoạt động bình thường</Radio>
            <Radio value={false}>Có lỗi</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => {
            const prevNormal =
              prevValues?.deviceCheckForm?.forms?.[formIndex]?.devices?.[deviceIndex]?.result
                ?.isNormal;
            const currentNormal =
              currentValues?.deviceCheckForm?.forms?.[formIndex]?.devices?.[deviceIndex]?.result
                ?.isNormal;
            return prevNormal !== currentNormal;
          }}
        >
          {({ getFieldValue }) => {
            const isNormal = getFieldValue([
              'deviceCheckForm',
              'forms',
              formIndex,
              'devices',
              deviceIndex,
              'result',
              'isNormal',
            ]);
            if (isNormal === false) {
              return (
                <div className='mt-4'>
                  <Form.Item
                    name={[
                      'deviceCheckForm',
                      'forms',
                      formIndex,
                      'devices',
                      deviceIndex,
                      'result',
                      'details',
                      'deviceName',
                    ]}
                    label='Tên thiết bị lỗi'
                    rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị lỗi' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[
                      'deviceCheckForm',
                      'forms',
                      formIndex,
                      'devices',
                      deviceIndex,
                      'result',
                      'details',
                      'serialNumber',
                    ]}
                    label='Số serial'
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[
                      'deviceCheckForm',
                      'forms',
                      formIndex,
                      'devices',
                      deviceIndex,
                      'result',
                      'details',
                      'location',
                    ]}
                    label='Vị trí'
                    rules={[{ required: true, message: 'Vui lòng nhập vị trí thiết bị' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[
                      'deviceCheckForm',
                      'forms',
                      formIndex,
                      'devices',
                      deviceIndex,
                      'result',
                      'details',
                      'error',
                    ]}
                    label='Mô tả lỗi'
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả lỗi' }]}
                  >
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.Item
                    name={[
                      'deviceCheckForm',
                      'forms',
                      formIndex,
                      'devices',
                      deviceIndex,
                      'result',
                      'details',
                      'solution',
                    ]}
                    label='Phương án xử lý'
                    rules={[{ required: true, message: 'Vui lòng nhập phương án xử lý' }]}
                  >
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.Item
                    name={[
                      'deviceCheckForm',
                      'forms',
                      formIndex,
                      'devices',
                      deviceIndex,
                      'result',
                      'details',
                      'resolved',
                    ]}
                    label='Trạng thái xử lý'
                    valuePropName='checked'
                  >
                    <Checkbox>Đã xử lý</Checkbox>
                  </Form.Item>
                </div>
              );
            }
            return null;
          }}
        </Form.Item>
      </>
    );
  }
);

// Sẽ được thay thế bằng API call

const DeviceCheckForm = ({
  currentShift,
  currentUser,
  hideCreateButton = false,
  hideDeleteButton = false,
}) => {
  const [deviceItems, setDeviceItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditingShiftCheck, setIsEditingShiftCheck] = useState(false);
  const [selectedShiftCheckForm, setSelectedShiftCheckForm] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, formId: null });
  const [errorDetailModal, setErrorDetailModal] = useState({
    visible: false,
    error: null,
    history: [],
  });
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [devices, setDevices] = useState([]); // State để lưu danh sách devices từ API
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [form] = Form.useForm();

  // Sử dụng hook để lấy device names
  const { getDeviceList, loading: devicesLoading } = useDeviceNames();

  // Load danh sách devices từ API
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const deviceList = await getDeviceList();
        setDevices(deviceList);
      } catch (error) {
        console.error('Lỗi khi load devices:', error);
        // Fallback về danh sách mặc định nếu API lỗi
        setDevices([
          { id: 1, name: 'Hệ thống phân phối điện UPS' },
          { id: 2, name: 'Hệ thống UPS' },
          { id: 3, name: 'Hệ thống làm mát' },
          { id: 4, name: 'Hệ thống giám sát hình ảnh' },
          { id: 5, name: 'Hệ thống kiểm soát truy cập' },
          { id: 6, name: 'PCCC' },
          { id: 7, name: 'Hệ thống giám sát hạ tầng TTDL' },
          { id: 8, name: 'Hệ thống khác' },
        ]);
      }
    };
    loadDevices();
  }, [getDeviceList]);

  // Hàm lấy lỗi hiện tại cho từng thiết bị và khởi tạo deviceItems
  const fetchDeviceErrorsForDevices = useCallback(
    async location => {
      try {
        setIsLoadingDevices(true);
        console.log('BẮT ĐẦU fetchDeviceErrorsForDevices');
        console.log('Devices hiện tại:', devices);

        // Kiểm tra xem devices đã load chưa
        if (!devices || devices.length === 0) {
          console.log('Devices chưa load, đợi...');
          setIsLoadingDevices(false);
          return;
        }

        const token = localStorage.getItem('token');
        let items = [];

        // Tạo mảng promises để gọi API song song
        const promises = devices.map(async device => {
          try {
            console.log(`Gọi API lấy lỗi cho deviceId: ${device.id}`);
            const res = await axios.get(`${API_URL}/api/devices/errors`, {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                deviceId: device.id,
                location,
                'resolveStatus[]': [DEVICE_ERROR_STATUS.PENDING, DEVICE_ERROR_STATUS.IN_PROGRESS],
              },
            });
            const errors = res.data?.errors || [];
            if (errors.length > 0) {
              return errors.map(error => ({
                ...error,
                deviceId: device.id,
                status: 'Có lỗi',
                resultStatus: 'Có lỗi',
                subDeviceName: typeof error.subDeviceName === 'string' ? error.subDeviceName : '',
                serialNumber: typeof error.serialNumber === 'string' ? error.serialNumber : '',
                errorCode: typeof error.errorCode === 'string' ? error.errorCode : '',
                errorCause: typeof error.errorCause === 'string' ? error.errorCause : '',
                solution: typeof error.solution === 'string' ? error.solution : '',
                notes: typeof error.notes === 'string' ? error.notes : '',
                uniqueId: error.uniqueId || `${device.id}-${Date.now()}-${Math.random()}`,
              }));
            } else {
              return [
                {
                  deviceId: device.id,
                  status: 'Bình thường',
                  resultStatus: 'Bình thường',
                  subDeviceName: '',
                  serialNumber: '',
                  errorCode: '',
                  errorCause: '',
                  solution: '',
                  notes: '',
                  uniqueId: `${device.id}-${Date.now()}-${Math.random()}`,
                },
              ];
            }
          } catch (err) {
            console.log(`Lỗi khi gọi API deviceId ${device.id}:`, err);
            return [
              {
                deviceId: device.id,
                status: 'Bình thường',
                resultStatus: 'Bình thường',
                subDeviceName: '',
                serialNumber: '',
                errorCode: '',
                errorCause: '',
                solution: '',
                notes: '',
                uniqueId: `${device.id}-${Date.now()}-${Math.random()}`,
              },
            ];
          }
        });

        // Đợi tất cả API hoàn thành
        const results = await Promise.all(promises);

        // Gộp tất cả kết quả vào mảng items
        items = results.flat();

        console.log('KẾT QUẢ deviceItems:', items);
        setDeviceItems(
          items.map(item => ({
            ...item,
            resolveStatus: item.resolveStatus || DEVICE_ERROR_STATUS.PENDING,
          }))
        );

        // Cập nhật form sau khi có dữ liệu
        form.setFieldsValue({ deviceItems: items });
      } catch (error) {
        console.error('Lỗi khi fetch device errors:', error);
        message.error('Không thể tải dữ liệu thiết bị');
      } finally {
        setIsLoadingDevices(false);
      }
    },
    [form, devices]
  );

  // Tự động fetch device errors khi devices được load và đang ở chế độ editing
  useEffect(() => {
    if (devices.length > 0 && isEditingShiftCheck) {
      const location = currentShift?.WorkShift?.name || '';
      fetchDeviceErrorsForDevices(location);
    }
  }, [devices, isEditingShiftCheck, currentShift?.WorkShift?.name, fetchDeviceErrorsForDevices]);

  // Bỏ phần thêm lỗi/subDevice - chỉ hiển thị lỗi từ API

  // Bỏ phần update error - chỉ hiển thị lỗi từ API

  // Hàm fetch lịch sử lỗi
  const fetchErrorHistory = useCallback(async errorId => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/devices/errors/${errorId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch {
      message.error('Không thể lấy thông tin chi tiết lỗi');
      return [];
    }
  }, []);

  // Hàm xử lý khi click vào nút xem chi tiết
  const handleViewErrorDetail = useCallback(
    async error => {
      try {
        const history = await fetchErrorHistory(error.id);
        setErrorDetailModal({
          visible: true,
          error,
          history,
        });
      } catch {
        message.error('Không thể lấy thông tin chi tiết lỗi');
      }
    },
    [fetchErrorHistory]
  );

  // Bỏ phần xóa lỗi - chỉ hiển thị lỗi từ API

  // Hàm xử lý khi cập nhật lỗi
  const handleResolveError = useCallback(
    async values => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          `${API_URL}/api/devices/errors/${errorDetailModal.error.id}`,
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          message.success('Cập nhật lỗi thành công');
          // Refresh danh sách lỗi trong modal
          const history = await fetchErrorHistory(errorDetailModal.error.id);
          setErrorDetailModal(prev => ({
            ...prev,
            error: response.data,
            history,
          }));

          // --- Cập nhật lại danh sách lỗi trên form ---
          const location = currentShift?.WorkShift?.name || '';
          await fetchDeviceErrorsForDevices(location);
        }
      } catch (err) {
        message.error('Không thể cập nhật lỗi');
        console.error('Lỗi khi cập nhật:', err);
      }
    },
    [errorDetailModal.error, fetchErrorHistory, currentShift, fetchDeviceErrorsForDevices]
  );

  // Render error card chỉ hiển thị thông tin (không có form edit)
  const renderErrorCard = useCallback(
    (err, idx) => {
      // Helper function để lấy màu Tag cho resolveStatus
      const getResolveStatusTagColor = status => {
        if (!status || !status.trim()) return 'default';

        switch (status) {
          case DEVICE_ERROR_STATUS.RESOLVED:
            return 'success';
          case DEVICE_ERROR_STATUS.IN_PROGRESS:
            return 'warning';
          case DEVICE_ERROR_STATUS.PENDING:
            return 'error';
          default:
            return 'default';
        }
      };

      return (
        <Card
          key={err.uniqueId || `${err.deviceId}-${err.id || idx}`}
          size='small'
          style={{
            padding: '4px',
            background: err.resolveStatus === DEVICE_ERROR_STATUS.RESOLVED ? '#f6ffed' : '#fff1f0',
            borderColor: err.resolveStatus === DEVICE_ERROR_STATUS.RESOLVED ? '#52c41a' : '#ff4d4f',
          }}
          title={
            <div>
              <span style={{ color: '#ff4d4f' }}>
                Tên thiết bị: {err.subDeviceName || 'Không rõ'}
              </span>
            </div>
          }
        >
          <div>
            <div
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              <b>Serial:</b> {err.serialNumber || '-'}
            </div>
            <div
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              <b>Tình trạng lỗi:</b> {err.errorCode || '-'}
            </div>
            <div
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              <b>Nguyên nhân:</b> {err.errorCause || '-'}
            </div>
            <div
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              <b>Giải pháp:</b> {err.solution || '-'}
            </div>
            <div
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                marginTop: '8px',
              }}
            >
              <b>Trạng thái :</b>
              {err.resolveStatus && err.resolveStatus.trim() ? (
                <Tag color={getResolveStatusTagColor(err.resolveStatus)} style={{ marginLeft: 8 }}>
                  {err.resolveStatus}
                </Tag>
              ) : (
                <span style={{ marginLeft: 8, color: '#8c8c8c' }}>Chưa xử lý</span>
              )}
            </div>
            <div className='flex gap-2 mt-2'>
              <Button
                type='primary'
                size='small'
                icon={<EyeOutlined />}
                onClick={() => handleViewErrorDetail(err)}
                className='bg-blue-600'
              >
                Chi tiết
              </Button>
            </div>
          </div>
        </Card>
      );
    },
    [handleViewErrorDetail]
  );

  // Cập nhật phần render trong Table columns - chỉ hiển thị, không có nút thêm
  const columns = useMemo(
    () => [
      {
        title: 'STT',
        dataIndex: 'id',
        key: 'id',
        width: 60,
        className: 'custom-header border-gray-200',
        render: (_, record, index) => <div className='text-center'>{index + 1}</div>,
      },
      {
        title: 'Thiết bị',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        className: 'custom-header border-gray-200',
      },
      {
        title: 'Trạng thái',
        key: 'status',
        className: 'custom-header border-gray-200',
        render: (_, device) => {
          const errors = deviceItems.filter(
            i =>
              i.deviceId === device.id &&
              i.status === 'Có lỗi' &&
              (i.resolveStatus === DEVICE_ERROR_STATUS.PENDING ||
                i.resolveStatus === DEVICE_ERROR_STATUS.IN_PROGRESS)
          );
          const isNormal = errors.length === 0;

          return (
            <div>
              <div className='flex items-center justify-between mb-2'>
                <div>
                  {isNormal ? <Tag color='green'>Bình thường</Tag> : <Tag color='red'>Có lỗi</Tag>}
                </div>
              </div>

              {!isNormal && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {errors.map((err, idx) => renderErrorCard(err, idx))}
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [deviceItems, renderErrorCard]
  );

  // Fetch shift check forms
  const fetchShiftCheckForm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Phiên đăng nhập đã hết hạn');
        return;
      }

      const response = await axios.get(`${API_URL}/api/shift-check/forms`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          workShiftId: currentShift?.WorkShift?.id,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setSelectedShiftCheckForm(response.data);
        // Luôn chuyển về tab cuối cùng nếu còn biên bản
        if (response.data.length > 0) {
          setActiveTabKey((response.data.length - 1).toString());
        } else {
          setActiveTabKey(null);
        }
      } else {
        setSelectedShiftCheckForm([]);
        setActiveTabKey(null);
      }
    } catch (error) {
      console.error('Error fetching shift check form:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn');
      } else {
        message.error('Không thể tải biên bản kiểm tra');
      }
    } finally {
      setLoading(false);
    }
  };

  // Thêm nút tạo biên bản mới cho mỗi ca
  const handleAddNewShiftCheckForm = async () => {
    console.log('Bấm nút Tạo biên bản mới');
    setIsEditingShiftCheck(true);
    // fetchDeviceErrorsForDevices sẽ được gọi tự động bởi useEffect khi devices load
  };

  // Hàm xử lý tạo biên bản kiểm tra thiết bị mới
  const handleCreateShiftCheckForm = async values => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Phiên đăng nhập đã hết hạn');
        return;
      }

      // Validate dữ liệu
      if (!values.location || !values.checkedAt) {
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Lấy deviceItems từ form, lọc bỏ phần tử undefined
      const formDeviceItems = (form.getFieldValue('deviceItems') || deviceItems).filter(Boolean);

      // Kiểm tra có ít nhất một thiết bị
      if (!formDeviceItems || formDeviceItems.length === 0) {
        message.error('Vui lòng thêm ít nhất một thiết bị');
        return;
      }

      // Lấy items cho ShiftCheckItem (thiết bị bình thường và lỗi Pending/In Progress)
      const itemsToSubmit = formDeviceItems.filter(
        item =>
          item.status === 'Bình thường' ||
          (item.status === 'Có lỗi' &&
            (item.resolveStatus === DEVICE_ERROR_STATUS.PENDING ||
              item.resolveStatus === DEVICE_ERROR_STATUS.IN_PROGRESS))
      );

      // Bỏ validation cho lỗi mới - chỉ lưu lỗi từ API

      // Lấy lỗi Pending và In Progress để cập nhật DeviceError
      const allDeviceErrors = formDeviceItems
        .filter(
          item =>
            item.status === 'Có lỗi' &&
            (item.resolveStatus === DEVICE_ERROR_STATUS.PENDING ||
              item.resolveStatus === DEVICE_ERROR_STATUS.IN_PROGRESS)
        )
        .map(item => ({
          id: item.id,
          deviceId: item.deviceId,
          status: item.status,
          resultStatus: item.resultStatus,
          subDeviceName: item.subDeviceName || '',
          serialNumber: item.serialNumber || '',
          errorCode: item.errorCode || '',
          errorCause: item.errorCause || '',
          solution: item.solution || '',
          resolveStatus: item.resolveStatus,
          resolvedAt: item.resolvedAt,
          resolveNote: item.resolveNote,
          resolvedBy: item.resolvedBy,
          createdBy: currentUser.id,
        }));

      const formData = {
        workShiftId: currentShift.WorkShift.id,
        checkerId: currentUser.id,
        location: values.location,
        checkedAt: values.checkedAt.format('YYYY-MM-DD HH:mm:ss'),
        notes: values.notes || '',
        date: currentShift.WorkShift.date,
        shift: currentShift.WorkShift.code,
        items: itemsToSubmit.map(item => ({
          id: item.id,
          deviceId: item.deviceId,
          status: item.status,
          resultStatus: item.resultStatus,
          subDeviceName: item.subDeviceName || '',
          serialNumber: item.serialNumber || '',
          errorCode: item.errorCode || '',
          errorCause: item.errorCause || '',
          solution: item.solution || '',
          resolveStatus:
            item.status === 'Có lỗi' ? item.resolveStatus || DEVICE_ERROR_STATUS.PENDING : '',
          resolvedAt: item.resolvedAt,
          resolveNote: item.resolveNote,
          resolvedBy: item.resolvedBy,
          createdBy: currentUser.id,
        })),
        deviceErrors: allDeviceErrors,
      };

      const response = await axios.post(`${API_URL}/api/shift-check/forms`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        message.success('Tạo biên bản kiểm tra thành công');
        setIsEditingShiftCheck(false);
        form.resetFields();
        fetchShiftCheckForm();
        setActiveTabKey(selectedShiftCheckForm.length.toString());
      }
    } catch (error) {
      console.error('Error creating shift check form:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn');
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể tạo biên bản kiểm tra');
      }
    } finally {
      setLoading(false);
    }
  };

  // Đồng bộ deviceItems vào form mỗi khi deviceItems thay đổi
  useEffect(() => {
    form.setFieldsValue({ deviceItems });
  }, [deviceItems, form]);

  // Khởi tạo danh sách thiết bị kiểm tra khi component mount hoặc currentShift thay đổi
  useEffect(() => {
    if (currentShift?.WorkShift?.id && devices.length > 0) {
      const initialItems = devices.map(device => ({
        deviceId: device.id,
        status: 'Bình thường',
        resultStatus: 'Bình thường',
        subDeviceName: '',
        serialNumber: '',
        errorCode: '',
        errorCause: '',
        solution: '',
        notes: '',
        resolveStatus: '',
        uniqueId: Date.now() + Math.random(), // key duy nhất cho mỗi lỗi
      }));
      setDeviceItems(initialItems);
    }
  }, [currentShift?.WorkShift?.id, devices]);

  // Fetch shift check form khi current shift thay đổi
  useEffect(() => {
    if (currentShift?.WorkShift?.id) {
      fetchShiftCheckForm();
    }
  }, [currentShift?.WorkShift?.id]);

  // Hàm xử lý xóa biên bản
  const handleDeleteForm = async formId => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Phiên đăng nhập đã hết hạn');
        logout();
        navigate('/login');
        return;
      }

      const response = await axios.delete(`${API_URL}/api/shift-check/forms/${formId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        message.success('Xóa biên bản thành công');
        setDeleteModal({ visible: false, formId: null });
        // Refresh danh sách biên bản
        fetchShiftCheckForm();
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn');
        logout();
        navigate('/login');
      } else {
        message.error(error.response?.data?.message || 'Không thể xóa biên bản');
      }
    }
  };

  return (
    <div className='mt-6'>
      <div className='flex justify-between items-center mb-4'>
        <Title level={4} style={{ color: '#003c71', margin: 0 }}>
          Biên bản kiểm tra thiết bị
        </Title>
        {!hideCreateButton && (
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleAddNewShiftCheckForm}
            disabled={currentShift?.WorkShift?.status === 'handover'}
            className='bg-blue-600'
          >
            Tạo biên bản mới
          </Button>
        )}
      </div>

      {/* Hiển thị form nhập mới nếu đang ở chế độ tạo/sửa */}
      {isEditingShiftCheck ? (
        <Spin spinning={isLoadingDevices || devicesLoading}>
          <Form
            form={form}
            layout='vertical'
            onFinish={handleCreateShiftCheckForm}
            initialValues={{
              location: currentShift?.WorkShift?.name,
              checkedAt: dayjs(),
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='location'
                  label='Địa điểm kiểm tra'
                  rules={[{ required: true, message: 'Vui lòng nhập địa điểm kiểm tra' }]}
                >
                  <Input placeholder='Nhập địa điểm' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='checkedAt'
                  label='Thời gian kiểm tra'
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian kiểm tra' }]}
                >
                  <DatePicker showTime format='HH:mm DD/MM/YYYY' style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider>Danh sách thiết bị kiểm tra</Divider>

            <Table dataSource={devices} rowKey='id' bordered pagination={false} columns={columns} />

            <div className='text-center mt-6'>
              <Space>
                <Button
                  htmlType='submit'
                  type='primary'
                  className='bg-blue-600'
                  loading={loading}
                  icon={<PlusOutlined />}
                >
                  Lưu biên bản
                </Button>
                <Button
                  type='primary'
                  icon={<MinusOutlined />}
                  className='bg-red-600'
                  onClick={() => {
                    setIsEditingShiftCheck(false);
                    form.resetFields();
                  }}
                >
                  Hủy
                </Button>
              </Space>
            </div>
          </Form>
        </Spin>
      ) : Array.isArray(selectedShiftCheckForm) && selectedShiftCheckForm.length > 0 ? (
        <Tabs
          type='card'
          activeKey={activeTabKey || (selectedShiftCheckForm.length - 1).toString()}
          onChange={key => setActiveTabKey(key)}
          items={[...(selectedShiftCheckForm || [])].reverse().map((form, idx) => ({
            key: idx.toString(),
            label: (
              <div className='flex items-center gap-2'>
                <span>Biên bản {idx + 1}</span>
                {currentUser.role === 'datacenter' && !hideDeleteButton && (
                  <Button
                    type='text'
                    danger
                    size='small'
                    disabled={currentShift?.WorkShift?.status === 'handover'}
                    icon={<DeleteOutlined />}
                    onClick={e => {
                      e.stopPropagation();
                      setDeleteModal({ visible: true, formId: form.id });
                    }}
                  />
                )}
              </div>
            ),
            children: (
              <>
                <Descriptions bordered column={1} className='mb-6'>
                  <Descriptions.Item label='Địa điểm kiểm tra'>{form.location}</Descriptions.Item>
                  <Descriptions.Item label='Thời điểm kiểm tra'>
                    {formatDateTime(form.checkedAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label='Người kiểm tra'>
                    {form.checker?.fullname || '-'}
                  </Descriptions.Item>
                </Descriptions>
                {form.items && form.items.length > 0 && (
                  <Table
                    dataSource={(() => {
                      // Tạo danh sách unique deviceIds từ form.items
                      const uniqueDeviceIds = [...new Set(form.items.map(item => item.deviceId))];

                      // Tạo device list chỉ từ những device có trong ShiftCheckItem
                      return uniqueDeviceIds.map((deviceId, idx) => {
                        // Tìm tất cả items của device này
                        const deviceItems = form.items.filter(i => i.deviceId === deviceId);
                        const errorItems = deviceItems.filter(i => i.status === 'Có lỗi');
                        const normal = deviceItems.find(i => i.status === 'Bình thường');

                        // Lấy snapshot data từ item đầu tiên của device này
                        const firstItem = deviceItems[0];
                        const deviceName = firstItem.deviceNameSnapshot || `Thiết bị ${deviceId}`;
                        const deviceCategory = firstItem.deviceCategorySnapshot || '';
                        const devicePosition = firstItem.devicePositionSnapshot || '';

                        return {
                          id: deviceId,
                          deviceId: deviceId,
                          name: deviceName,
                          category: deviceCategory,
                          position: devicePosition,
                          key: deviceId,
                          index: idx + 1,
                          errorItems,
                          status:
                            errorItems.length > 0
                              ? 'Có lỗi'
                              : normal
                                ? 'Bình thường'
                                : 'Bình thường',
                        };
                      });
                    })()}
                    rowKey='key'
                    pagination={false}
                    bordered
                    columns={[
                      {
                        title: 'STT',
                        dataIndex: 'index',
                        key: 'index',
                        width: 60,
                        className: 'custom-header border-gray-200',
                        render: (_, record, index) => (
                          <div className='text-center'>{index + 1}</div>
                        ),
                      },
                      {
                        title: 'Thiết bị',
                        dataIndex: 'name',
                        key: 'name',
                        width: '30%',
                        className: 'custom-header border-gray-200',
                      },
                      {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        key: 'status',
                        className: 'custom-header border-gray-200',
                        render: (status, record) => {
                          const getResolveStatusTagColor = status => {
                            if (!status || !status.trim()) return 'default';

                            switch (status) {
                              case DEVICE_ERROR_STATUS.RESOLVED:
                                return 'success';
                              case DEVICE_ERROR_STATUS.IN_PROGRESS:
                                return 'warning';
                              case DEVICE_ERROR_STATUS.PENDING:
                                return 'error';
                              default:
                                return 'default';
                            }
                          };
                          if (record.errorItems && record.errorItems.length > 0) {
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {record.errorItems
                                  .slice()
                                  .sort((a, b) =>
                                    (a.subDeviceName || '').localeCompare(b.subDeviceName || '')
                                  )
                                  .map((err, idx) => (
                                    <Card
                                      key={err.uniqueId || `${err.deviceId}-${err.id || idx}`}
                                      size='small'
                                      style={{ background: '#fff1f0', borderColor: '#ff4d4f' }}
                                      title={
                                        <span style={{ color: '#ff4d4f' }}>
                                          Tên thiết bị: {err.subDeviceName || 'Không rõ'}
                                        </span>
                                      }
                                    >
                                      <div
                                        style={{
                                          whiteSpace: 'pre-wrap',
                                          wordBreak: 'break-word',
                                        }}
                                      >
                                        <b>Serial:</b> {err.serialNumber || '-'}
                                      </div>
                                      <div
                                        style={{
                                          whiteSpace: 'pre-wrap',
                                          wordBreak: 'break-word',
                                        }}
                                      >
                                        <b>Tình trạng lỗi:</b> {err.errorCode || '-'}
                                      </div>
                                      <div
                                        style={{
                                          whiteSpace: 'pre-wrap',
                                          wordBreak: 'break-word',
                                        }}
                                      >
                                        <b>Nguyên nhân:</b> {err.errorCause || '-'}
                                      </div>
                                      <div
                                        style={{
                                          whiteSpace: 'pre-wrap',
                                          wordBreak: 'break-word',
                                        }}
                                      >
                                        <b>Giải pháp:</b> {err.solution || '-'}
                                      </div>
                                      <div
                                        style={{
                                          whiteSpace: 'pre-wrap',
                                          wordBreak: 'break-word',
                                          marginTop: '8px',
                                        }}
                                      >
                                        <b>Trạng thái :</b>
                                        {err.resolveStatus && err.resolveStatus.trim() ? (
                                          <Tag
                                            color={getResolveStatusTagColor(err.resolveStatus)}
                                            style={{ marginLeft: 8 }}
                                          >
                                            {err.resolveStatus}
                                          </Tag>
                                        ) : (
                                          <span style={{ marginLeft: 8, color: 'red' }}>
                                            Chưa xử lý
                                          </span>
                                        )}
                                      </div>
                                    </Card>
                                  ))}
                              </div>
                            );
                          }
                          return <Tag color='green'>Bình thường</Tag>;
                        },
                      },
                    ]}
                  />
                )}
              </>
            ),
          }))}
        />
      ) : (
        <div className='text-center py-8'>
          <Text type='secondary'>Chưa có biên bản kiểm tra thiết bị</Text>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <Modal
        title='Xác nhận xóa biên bản'
        open={deleteModal.visible}
        onOk={() => handleDeleteForm(deleteModal.formId)}
        onCancel={() => setDeleteModal({ visible: false, formId: null })}
        okText='Xóa'
        cancelText='Hủy'
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa biên bản này không?</p>
        <p className='text-red-500'>Lưu ý: Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Thêm DeviceErrorDetailModal */}
      <DeviceErrorDetailModal
        visible={errorDetailModal.visible}
        onClose={() => setErrorDetailModal({ visible: false, error: null, history: [] })}
        error={errorDetailModal.error}
        history={errorDetailModal.history}
        onResolve={handleResolveError}
      />
    </div>
  );
};

export default DeviceCheckForm;
