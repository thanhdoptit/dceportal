import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import PrimaryButton, { ActionButton } from '../../components/common/PrimaryButton';
import StandardTable from '../../components/common/StandardTable';
import axios from '../../utils/axios';

const { TextArea } = Input;
const { Title } = Typography;

const SettingsPage = () => {
  const [emailLoading, setEmailLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [emailForm] = Form.useForm();
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Locations state
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationForm] = Form.useForm();

  // Devices state
  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [deviceForm] = Form.useForm();

  useEffect(() => {
    fetchEmailSettings();
    fetchLocations();
    fetchDevices();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      setEmailLoading(true);
      const response = await axios.get('/api/settings/email');
      const settings = response.data.data;

      emailForm.setFieldsValue({
        email_smtp_host: settings.email_smtp_host,
        email_smtp_port: settings.email_smtp_port,
        email_smtp_secure: settings.email_smtp_secure,
        email_smtp_user: settings.email_smtp_user,
        email_smtp_pass: settings.email_smtp_pass,
        email_smtp_tls_reject_unauthorized: settings.email_smtp_tls_reject_unauthorized,
        email_smtp_debug: settings.email_smtp_debug,
        email_smtp_logger: settings.email_smtp_logger,
      });
    } catch (error) {
      console.error('Error fetching email settings:', error);
      message.error('Lỗi khi tải cấu hình email');
    } finally {
      setEmailLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setLocationsLoading(true);
      const response = await axios.get('/api/locations/management/all');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      message.error('Lỗi khi tải danh sách địa điểm');
    } finally {
      setLocationsLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      setDevicesLoading(true);
      const response = await axios.get('/api/devices/management/all');
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
      message.error('Lỗi khi tải danh sách thiết bị');
    } finally {
      setDevicesLoading(false);
    }
  };

  const handleEmailSubmit = async values => {
    try {
      setEmailLoading(true);

      const settings = {
        email_smtp_host: values.email_smtp_host,
        email_smtp_port: values.email_smtp_port.toString(),
        email_smtp_secure: values.email_smtp_secure.toString(),
        email_smtp_user: values.email_smtp_user,
        email_smtp_pass: values.email_smtp_pass,
        email_smtp_tls_reject_unauthorized: values.email_smtp_tls_reject_unauthorized.toString(),
        email_smtp_debug: values.email_smtp_debug.toString(),
        email_smtp_logger: values.email_smtp_logger.toString(),
      };

      await axios.put('/api/settings/email', { settings });
      message.success('Cập nhật cấu hình email thành công');
      setConnectionStatus(null); // Reset connection status
    } catch (error) {
      console.error('Error updating email settings:', error);
      message.error('Lỗi khi cập nhật cấu hình email');
    } finally {
      setEmailLoading(false);
    }
  };

  const testEmailConnection = async () => {
    try {
      setTestingConnection(true);
      const response = await axios.post('/api/settings/email/test');

      if (response.data.success) {
        setConnectionStatus({ success: true, message: response.data.message });
        message.success('Kết nối email thành công!');
      } else {
        setConnectionStatus({ success: false, message: response.data.message });
        message.error('Kết nối email thất bại!');
      }
    } catch (error) {
      console.error('Error testing email connection:', error);
      setConnectionStatus({ success: false, message: 'Lỗi khi test kết nối email' });
      message.error('Lỗi khi test kết nối email');
    } finally {
      setTestingConnection(false);
    }
  };

  const initializeEmailSettings = async () => {
    try {
      setEmailLoading(true);
      await axios.post('/api/settings/email/initialize');
      message.success('Khởi tạo cấu hình email mặc định thành công');
      await fetchEmailSettings(); // Reload settings
    } catch (error) {
      console.error('Error initializing email settings:', error);
      message.error('Lỗi khi khởi tạo cấu hình email');
    } finally {
      setEmailLoading(false);
    }
  };

  // Locations management functions
  const handleAddLocation = () => {
    setEditingLocation(null);
    locationForm.resetFields();
    // Set default values for new location
    locationForm.setFieldsValue({
      isActive: true,
      index: 0,
    });
    setLocationModalVisible(true);
  };

  const handleEditLocation = location => {
    setEditingLocation(location);
    locationForm.setFieldsValue({
      ...location,
      index: location.index || 0,
      isActive: typeof location.isActive === 'boolean' ? location.isActive : true,
    });
    setLocationModalVisible(true);
  };

  const handleDeleteLocation = async id => {
    try {
      await axios.delete(`/api/locations/${id}`);
      message.success('Xóa địa điểm thành công');
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      message.error('Lỗi khi xóa địa điểm');
    }
  };

  const handleRestoreLocation = async id => {
    try {
      await axios.put(`/api/locations/${id}/restore`);
      message.success('Khôi phục địa điểm thành công');
      fetchLocations();
    } catch (error) {
      console.error('Error restoring location:', error);
      message.error('Lỗi khi khôi phục địa điểm');
    }
  };

  const handleLocationSubmit = async values => {
    try {
      // Đảm bảo luôn có trường isActive và index
      if (typeof values.isActive !== 'boolean') {
        values.isActive = true;
      }
      if (typeof values.index !== 'number') {
        values.index = 0;
      }
      if (editingLocation) {
        await axios.put(`/api/locations/${editingLocation.id}`, values);
        message.success('Cập nhật địa điểm thành công');
      } else {
        await axios.post('/api/locations', values);
        message.success('Thêm địa điểm thành công');
      }
      setLocationModalVisible(false);
      fetchLocations();
    } catch (error) {
      console.error('Error saving location:', error);
      message.error('Lỗi khi lưu địa điểm');
    }
  };

  // Devices management functions
  const handleAddDevice = () => {
    setEditingDevice(null);
    deviceForm.resetFields();
    setDeviceModalVisible(true);
  };

  const handleEditDevice = device => {
    setEditingDevice(device);
    deviceForm.setFieldsValue({
      ...device,
      isActive: typeof device.isActive === 'boolean' ? device.isActive : true,
    });
    setDeviceModalVisible(true);
  };

  const handleDeleteDevice = async id => {
    try {
      await axios.delete(`/api/devices/${id}`);
      message.success('Xóa thiết bị thành công');
      fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
      message.error('Lỗi khi xóa thiết bị');
    }
  };

  const handleRestoreDevice = async id => {
    try {
      await axios.put(`/api/devices/${id}/restore`);
      message.success('Khôi phục thiết bị thành công');
      fetchDevices();
    } catch (error) {
      console.error('Error restoring device:', error);
      message.error('Lỗi khi khôi phục thiết bị');
    }
  };

  const handleDeviceSubmit = async values => {
    try {
      // Đảm bảo luôn có trường isActive
      if (typeof values.isActive !== 'boolean') {
        values.isActive = true;
      }
      if (editingDevice) {
        await axios.put(`/api/devices/${editingDevice.id}`, values);
        message.success('Cập nhật thiết bị thành công');
      } else {
        await axios.post('/api/devices', values);
        message.success('Thêm thiết bị thành công');
      }
      setDeviceModalVisible(false);
      fetchDevices();
    } catch (error) {
      console.error('Error saving device:', error);
      message.error('Lỗi khi lưu thiết bị');
    }
  };

  // Table columns for locations - đồng bộ logic với các page khác (bỏ width)
  const locationColumns = [
    {
      title: 'Mã địa điểm',
      dataIndex: 'code',
      key: 'code',
      className: 'custom-header border-gray-200',
      align: 'center',
      render: code => code,
    },
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
      key: 'name',
      className: 'custom-header border-gray-200',
      render: text => <div className='whitespace-pre-line break-words'>{text}</div>,
    },
    {
      title: 'Số ca trong ngày',
      dataIndex: 'index',
      key: 'index',
      className: 'custom-header border-gray-200',
      align: 'center',
      render: index => <Tag color='blue'>{index || 0} ca</Tag>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      className: 'custom-header border-gray-200',
      render: text => <div className='whitespace-pre-line break-words'>{text}</div>,
    },
    {
      title: 'Hotline',
      dataIndex: 'hotline',
      key: 'hotline',
      className: 'custom-header border-gray-200',
      render: text => <div className='whitespace-pre-line break-words'>{text}</div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      className: 'custom-header border-gray-200',
      align: 'center',
      render: isActive => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Hoạt động' : 'Không hoạt động'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      className: 'custom-header border-gray-200',
      render: (_, record) => (
        <Space>
          <ActionButton
            onClick={() => handleEditLocation(record)}
            icon={<EditOutlined />}
            className='bg-orange-600 hover:bg-orange-700'
          >
            Sửa
          </ActionButton>
          {record.isActive ? (
            <Popconfirm
              title='Bạn có chắc muốn xóa địa điểm này?'
              onConfirm={() => handleDeleteLocation(record.id)}
              okText='Có'
              cancelText='Không'
            >
              <ActionButton icon={<DeleteOutlined />} className='bg-red-600 hover:bg-red-700'>
                Xóa
              </ActionButton>
            </Popconfirm>
          ) : (
            <Popconfirm
              title='Bạn có chắc muốn khôi phục địa điểm này?'
              onConfirm={() => handleRestoreLocation(record.id)}
              okText='Có'
              cancelText='Không'
            >
              <ActionButton icon={<UndoOutlined />} className='bg-green-600 hover:bg-green-700'>
                Khôi phục
              </ActionButton>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Table columns for devices
  const deviceColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      className: 'custom-header border-gray-200',
      align: 'center',
      render: id => id,
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'deviceName',
      key: 'deviceName',
      className: 'custom-header border-gray-200',
      render: text => <div className='whitespace-pre-line break-words'>{text}</div>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      className: 'custom-header border-gray-200',
      render: text => <div className='whitespace-pre-line break-words'>{text}</div>,
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      className: 'custom-header border-gray-200',
      render: text => <div className='whitespace-pre-line break-words'>{text}</div>,
    },
    {
      title: 'Số Serial',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      className: 'custom-header border-gray-200',
      render: text => <div className='whitespace-pre-line break-words'>{text}</div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      className: 'custom-header border-gray-200',
      align: 'center',
      render: isActive => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Hoạt động' : 'Không hoạt động'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      className: 'custom-header border-gray-200',
      render: (_, record) => (
        <Space>
          <ActionButton
            onClick={() => handleEditDevice(record)}
            icon={<EditOutlined />}
            className='bg-orange-600 hover:bg-orange-700'
          >
            Sửa
          </ActionButton>
          {record.isActive ? (
            <Popconfirm
              title='Bạn có chắc muốn xóa thiết bị này?'
              onConfirm={() => handleDeleteDevice(record.id)}
              okText='Có'
              cancelText='Không'
            >
              <ActionButton icon={<DeleteOutlined />} className='bg-red-600 hover:bg-red-700'>
                Xóa
              </ActionButton>
            </Popconfirm>
          ) : (
            <Popconfirm
              title='Bạn có chắc muốn khôi phục thiết bị này?'
              onConfirm={() => handleRestoreDevice(record.id)}
              okText='Có'
              cancelText='Không'
            >
              <ActionButton icon={<UndoOutlined />} className='bg-green-600 hover:bg-green-700'>
                Khôi phục
              </ActionButton>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Chuẩn bị nội dung cho từng tab
  const emailTabContent = (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Title level={4} style={{ color: '#003c71', margin: 0 }}>
          Cấu hình SMTP Nội bộ
        </Title>
        <Space>
          <PrimaryButton
            variant='secondary'
            icon={<ReloadOutlined />}
            onClick={initializeEmailSettings}
            loading={emailLoading}
          >
            Khôi phục mặc định
          </PrimaryButton>
          <PrimaryButton
            variant='primary'
            icon={<CheckCircleOutlined />}
            onClick={testEmailConnection}
            loading={testingConnection}
          >
            Test kết nối
          </PrimaryButton>
        </Space>
      </div>

      {connectionStatus && (
        <Alert
          message={connectionStatus.success ? 'Kết nối thành công' : 'Kết nối thất bại'}
          description={connectionStatus.message}
          type={connectionStatus.success ? 'success' : 'error'}
          showIcon
          closable
        />
      )}

      <Form form={emailForm} layout='vertical' onFinish={handleEmailSubmit}>
        <div className='grid grid-cols-2 gap-8'>
          <div>
            <Form.Item
              name='email_smtp_host'
              label='SMTP Host'
              rules={[{ required: true, message: 'Vui lòng nhập SMTP Host' }]}
            >
              <Input placeholder='10.0.160.29' />
            </Form.Item>

            <Form.Item
              name='email_smtp_port'
              label='SMTP Port'
              rules={[{ required: true, message: 'Vui lòng nhập SMTP Port' }]}
            >
              <Input placeholder='25' />
            </Form.Item>

            <Form.Item name='email_smtp_secure' label='SMTP Secure' valuePropName='checked'>
              <Switch />
            </Form.Item>

            <Form.Item
              name='email_smtp_user'
              label='SMTP Username'
              rules={[{ required: true, message: 'Vui lòng nhập Username' }]}
            >
              <Input placeholder='icbv\dopt' />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name='email_smtp_pass'
              label='SMTP Password'
              rules={[{ required: true, message: 'Vui lòng nhập Password' }]}
            >
              <Input.Password placeholder='Nhập password' />
            </Form.Item>

            <Form.Item
              name='email_smtp_tls_reject_unauthorized'
              label='TLS Reject Unauthorized'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>

            <Form.Item name='email_smtp_debug' label='Debug Mode' valuePropName='checked'>
              <Switch />
            </Form.Item>

            <Form.Item name='email_smtp_logger' label='Logger' valuePropName='checked'>
              <Switch />
            </Form.Item>
          </div>
        </div>

        <Divider />

        <Form.Item className='text-right'>
          <Space>
            <Button onClick={() => emailForm.resetFields()}>Đặt lại</Button>
            <PrimaryButton
              variant='primary'
              icon={<SaveOutlined />}
              loading={emailLoading}
              htmlType='submit'
            >
              Lưu cấu hình
            </PrimaryButton>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );

  const locationsTabContent = (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Title level={4} style={{ color: '#003c71', margin: 0 }}>
          Quản lý địa điểm
        </Title>
        <PrimaryButton variant='primary' icon={<PlusOutlined />} onClick={handleAddLocation}>
          Thêm địa điểm
        </PrimaryButton>
      </div>

      <StandardTable
        columns={locationColumns}
        dataSource={locations}
        loading={locationsLoading}
        pagination={{
          page: 1,
          limit: 10,
          total: locations.length,
        }}
        onPaginationChange={(page, pageSize) => {
          console.log('Pagination changed:', { page, pageSize });
        }}
        rowKey='code'
      />
    </div>
  );

  const devicesTabContent = (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Title level={4} style={{ color: '#003c71', margin: 0 }}>
          Quản lý thiết bị
        </Title>
        <PrimaryButton variant='primary' icon={<PlusOutlined />} onClick={handleAddDevice}>
          Thêm thiết bị
        </PrimaryButton>
      </div>

      <StandardTable
        columns={deviceColumns}
        dataSource={devices}
        loading={devicesLoading}
        pagination={{
          page: 1,
          limit: 10,
          total: devices.length,
        }}
        onPaginationChange={(page, pageSize) => {
          console.log('Pagination changed:', { page, pageSize });
        }}
        rowKey='id'
      />
    </div>
  );

  const tabItems = [
    {
      key: 'email',
      label: 'Cấu hình Email',
      children: emailTabContent,
    },
    {
      key: 'locations',
      label: 'Quản lý Địa điểm',
      children: locationsTabContent,
    },
    {
      key: 'devices',
      label: 'Quản lý Thiết bị',
      children: devicesTabContent,
    },
  ];

  return (
    <div className='p-0'>
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <Title level={4} style={{ color: '#003c71', margin: 0 }}>
            Cài đặt hệ thống
          </Title>
        </div>
        <Tabs defaultActiveKey='email' items={tabItems} />
      </Card>

      {/* Location Modal */}
      <Modal
        title={editingLocation ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
        open={locationModalVisible}
        onCancel={() => setLocationModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={locationForm} layout='vertical' onFinish={handleLocationSubmit}>
          <Form.Item
            name='code'
            label='Mã địa điểm'
            rules={[
              { required: true, message: 'Vui lòng nhập mã địa điểm' },
              { max: 1, message: 'Mã địa điểm chỉ được 1 ký tự' },
            ]}
          >
            <Input placeholder='VD: T, H, V' maxLength={1} />
          </Form.Item>

          <Form.Item
            name='name'
            label='Tên địa điểm'
            rules={[{ required: true, message: 'Vui lòng nhập tên địa điểm' }]}
          >
            <Input placeholder='VD: Trần Hưng Đạo, Hòa Lạc, Vân Canh' />
          </Form.Item>

          <Form.Item
            name='index'
            label='Số ca trong ngày'
            rules={[
              { required: true, message: 'Vui lòng nhập số ca trong ngày' },
              { type: 'number', min: 0, max: 10, message: 'Số ca phải từ 0-10' },
            ]}
          >
            <InputNumber placeholder='VD: 2, 3' min={0} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name='description' label='Mô tả'>
            <TextArea rows={3} placeholder='Mô tả chi tiết về địa điểm' />
          </Form.Item>

          <Form.Item name='hotline' label='Hotline'>
            <Input placeholder='VD: 1900-xxxx' />
          </Form.Item>

          <Form.Item
            name='isActive'
            label='Trạng thái hoạt động'
            valuePropName='checked'
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item className='text-right'>
            <Space>
              <Button onClick={() => setLocationModalVisible(false)}>Hủy</Button>
              <PrimaryButton variant='primary' icon={<SaveOutlined />} htmlType='submit'>
                {editingLocation ? 'Cập nhật' : 'Thêm mới'}
              </PrimaryButton>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Device Modal */}
      <Modal
        title={editingDevice ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
        open={deviceModalVisible}
        onCancel={() => setDeviceModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={deviceForm} layout='vertical' onFinish={handleDeviceSubmit}>
          <Form.Item
            name='deviceName'
            label='Tên thiết bị'
            rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}
          >
            <Input placeholder='VD: Hệ thống phân phối điện UPS' />
          </Form.Item>

          <Form.Item
            name='category'
            label='Danh mục'
            rules={[{ required: true, message: 'Vui lòng nhập danh mục thiết bị' }]}
          >
            <Input placeholder='VD: UPS, Làm mát, PCCC' />
          </Form.Item>

          <Form.Item name='position' label='Vị trí'>
            <Input placeholder='VD: Phòng điều khiển trung tâm' />
          </Form.Item>

          <Form.Item name='serialNumber' label='Số Serial'>
            <Input placeholder='VD: SN123456789' />
          </Form.Item>

          <Form.Item
            name='isActive'
            label='Trạng thái hoạt động'
            valuePropName='checked'
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item className='text-right'>
            <Space>
              <Button onClick={() => setDeviceModalVisible(false)}>Hủy</Button>
              <PrimaryButton variant='primary' icon={<SaveOutlined />} htmlType='submit'>
                {editingDevice ? 'Cập nhật' : 'Thêm mới'}
              </PrimaryButton>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingsPage;
