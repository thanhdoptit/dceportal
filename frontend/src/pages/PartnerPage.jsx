import {
  BankOutlined,
  EditOutlined,
  EyeOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePartnerModal from '../components/partner/CreatePartnerModal';
import PartnerTaskModal from '../components/partner/PartnerTaskModal';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Component chính
const PartnerPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [donViFilter, setDonViFilter] = useState('Tất cả');
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });
  const [donViList, setDonViList] = useState([]);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [initialized, setInitialized] = useState(false);
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

  // Lấy danh sách đối tác
  const fetchPartners = async (
    keyword = '',
    donVi = 'Tất cả',
    dateRange = null,
    page = 1,
    limit = 15
  ) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      let url = '/api/partners';
      const params = [];

      if (keyword && keyword.trim()) {
        params.push(`keyword=${encodeURIComponent(keyword.trim())}`);
      }

      if (donVi && donVi !== 'Tất cả') {
        params.push(`donVi=${encodeURIComponent(donVi)}`);
      }

      if (dateRange && dateRange[0] && dateRange[1]) {
        const startDate = dayjs(dateRange[0]).startOf('day').utc().toISOString();
        const endDate = dayjs(dateRange[1]).endOf('day').utc().toISOString();
        params.push(`startDate=${startDate}`);
        params.push(`endDate=${endDate}`);
      }

      params.push(`page=${page}`);
      params.push(`limit=${limit}`);

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPartners(response.data.partners || response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
        page,
        limit,
      }));
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        message.error('Không thể lấy danh sách');
        console.error('Lỗi khi lấy danh sách:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách đơn vị
  const fetchDonViList = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await axios.get('/api/partners/donvi', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonViList(response.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn vị:', error);
    }
  };

  // Tìm kiếm với debounce - giảm delay xuống 300ms
  const debouncedSearch = useCallback(
    debounce(value => {
      setSearchKeyword(value);
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchPartners(value, donViFilter, dateRange, 1, pagination.limit);
    }, 300), // Giảm từ 500ms xuống 300ms
    [donViFilter, dateRange, pagination.limit]
  );

  // Xử lý tìm kiếm
  const handleSearch = value => {
    debouncedSearch(value);
  };

  // Xử lý filter đơn vị
  const handleDonViFilterChange = value => {
    setDonViFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchPartners(searchKeyword, value, dateRange, 1, pagination.limit);
  };

  // Xử lý filter thời gian
  const handleDateRangeChange = dates => {
    setDateRange(dates);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchPartners(searchKeyword, donViFilter, dates, 1, pagination.limit);
  };

  // Xử lý cập nhật đối tác
  const handleUpdate = async values => {
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      const payload = {
        ...values,
        fullname: values.fullname.trim(),
        donVi: values.donVi?.trim() || '',
        email: values.email?.trim() || '',
        phone: values.phone?.trim() || '',
        cccd: values.cccd?.trim() || '',
      };

      await axios.put(`/api/partners/${selectedPartner.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success('Cập nhật thành công');
      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedPartner(null);
      fetchPartners(searchKeyword, donViFilter, dateRange, pagination.page, pagination.limit);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Lỗi khi cập nhật:', error);

        // Xử lý lỗi validation từ backend
        if (error.response?.status === 400 && error.response?.data?.errors) {
          const errorMessages = error.response.data.errors;
          if (Array.isArray(errorMessages)) {
            message.error(errorMessages.join('\n'));
          } else {
            message.error(errorMessages);
          }
        } else if (error.response?.status === 404) {
          message.error('Không tìm thấy đối tác để cập nhật');
        } else if (error.response?.status === 500) {
          message.error('Lỗi hệ thống. Vui lòng thử lại sau.');
        } else {
          message.error(error.response?.data?.message || 'Không thể cập nhật đối tác');
        }
      }
    }
  };

  // Xử lý xóa đối tác
  const handleDelete = async partnerId => {
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      await axios.delete(`/api/partners/${partnerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success('Xóa đối tác thành công');
      fetchPartners(searchKeyword, donViFilter, dateRange, pagination.page, pagination.limit);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Lỗi khi xóa đối tác:', error);
        message.error(error.response?.data?.message || 'Không thể xóa đối tác');
      }
    }
  };

  // Hiển thị modal chỉnh sửa
  const showEditModal = partner => {
    setSelectedPartner(partner);
    editForm.setFieldsValue({
      fullname: partner.fullname,
      donVi: partner.donVi,
      email: partner.email,
      phone: partner.phone,
      cccd: partner.cccd,
    });
    setEditModalVisible(true);
  };

  // Xử lý phân trang
  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      page,
      limit: pageSize,
    }));
    fetchPartners(searchKeyword, donViFilter, dateRange, page, pageSize);
  };

  // Xử lý mở modal xem task
  const handleViewTasks = record => {
    setSelectedPartner(record);
    setTaskModalVisible(true);
  };

  const { currentUser } = useAuth();
  const isManager = currentUser?.role?.toLowerCase() === 'manager';
  const isDatacenter = currentUser?.role?.toLowerCase() === 'datacenter';

  // Cấu hình cột bảng - sử dụng useMemo để tối ưu performance
  const columns = useMemo(
    () => [
      {
        title: 'Mã',
        dataIndex: 'id',
        key: 'id',
        width: '3%',
        className: 'custom-header border-gray-200',
        render: id => `${id}`,
        align: 'center',
        defaultSortOrder: 'ascend',
      },
      {
        title: 'Họ tên',
        dataIndex: 'fullname',
        key: 'fullname',
        width: '15%',
        className: 'custom-header border-gray-200',
        render: text => (
          <div className='flex items-center'>
            <UserOutlined className='mr-2 text-blue-500' />
            <span className='font-medium'>{text}</span>
          </div>
        ),
      },
      {
        title: 'Đơn vị',
        dataIndex: 'donVi',
        key: 'donVi',
        width: '15%',
        className: 'custom-header border-gray-200',
        render: text => (
          <div className='flex items-center'>
            <BankOutlined className='mr-2 text-green-500' />
            <span>{text || 'Chưa có'}</span>
          </div>
        ),
      },
      {
        title: 'Số thẻ / CCCD',
        dataIndex: 'cccd',
        key: 'cccd',
        width: '12%',
        className: 'custom-header border-gray-200',
        render: text => (
          <div className='flex items-center'>
            <IdcardOutlined className='mr-2 text-purple-500' />
            <span>{text || 'Chưa có'}</span>
          </div>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '15%',
        className: 'custom-header border-gray-200',
        render: text => (
          <div className='flex items-center'>
            <MailOutlined className='mr-2 text-orange-500' />
            <span>{text || 'Chưa có'}</span>
          </div>
        ),
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        key: 'phone',
        width: '12%',
        className: 'custom-header border-gray-200',
        render: text => (
          <div className='flex items-center'>
            <PhoneOutlined className='mr-2 text-green-600' />
            <span>{text || 'Chưa có'}</span>
          </div>
        ),
      },

      {
        title: 'Thao tác',
        key: 'actions',
        width: '5%',
        align: 'center',
        className: 'custom-header border-gray-200',
        render: (_, record) => (
          <Space>
            {isManager && (
              <Tooltip title='Xem danh sách công việc'>
                <Button
                  type='primary'
                  size='small'
                  icon={<EyeOutlined />}
                  onClick={() => handleViewTasks(record)}
                  style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                >
                  Công việc
                </Button>
              </Tooltip>
            )}
            <Tooltip title='Chỉnh sửa'>
              <Button
                onClick={() => showEditModal(record)}
                size='small'
                type='primary'
                icon={<EditOutlined />}
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                Sửa
              </Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [handleViewTasks, showEditModal, handleDelete]
  );

  // Tối ưu pagination config
  const paginationConfig = useMemo(
    () => ({
      current: pagination.page,
      pageSize: pagination.limit,
      total: pagination.total,
      onChange: handlePaginationChange,
      showSizeChanger: true,
      pageSizeOptions: ['15', '20', '50', '100'],
      defaultPageSize: 15,
      showTotal: total => `Tổng số ${total} đối tác`,
      locale: { items_per_page: '/ Trang' },
    }),
    [pagination.page, pagination.limit, pagination.total, handlePaginationChange]
  );

  // Tối ưu Select options
  const donViOptions = useMemo(
    () => [
      { value: 'Tất cả', label: 'Tất cả đơn vị' },
      ...donViList.map(donVi => ({ value: donVi, label: donVi })),
    ],
    [donViList]
  );

  // Fetch dữ liệu khi mount - gọi API song song để tối ưu performance
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      // Gọi API song song thay vì tuần tự
      Promise.all([fetchDonViList(), fetchPartners()]).catch(error => {
        console.error('Error initializing data:', error);
      });
    }
  }, [initialized]);

  // Xử lý khi tạo đối tác thành công
  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    // Refresh danh sách đối tác
    fetchPartners(searchKeyword, donViFilter, dateRange, pagination.page, pagination.limit);
    // Không cần refresh danh sách đơn vị vì ít thay đổi
  };

  return (
    <div className='p-0'>
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <Title level={4} style={{ color: '#003c71', margin: 0 }}>
            Quản lý nhân sự ra vào Trung Tâm Dữ Liệu
          </Title>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
            style={{ backgroundColor: '#003c71', borderColor: '#003c71', color: 'white' }}
          >
            Tạo mới
          </Button>
        </div>

        {/* Bộ lọc */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={16} align='middle'>
            <Col>
              <Text strong>Tìm kiếm:</Text>
            </Col>
            <Col>
              <Input
                placeholder='Nhập tên, email, số điện thoại...'
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
                onChange={e => handleSearch(e.target.value)}
                allowClear
                onClear={() => {
                  setSearchKeyword('');
                  fetchPartners('', donViFilter, dateRange, 1, pagination.limit);
                }}
              />
            </Col>
            <Col>
              <Text strong>Đơn vị:</Text>
            </Col>
            <Col>
              <Select
                style={{ width: 200 }}
                value={donViFilter}
                onChange={handleDonViFilterChange}
                placeholder='Chọn đơn vị'
                allowClear
              >
                {donViOptions.map(option => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            {/*} <Col>
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
              </Col> */}
          </Row>
        </Card>

        {/* Bảng dữ liệu */}
        <Table
          columns={columns}
          dataSource={partners}
          loading={loading}
          rowKey='id'
          pagination={paginationConfig}
          bordered
          defaultSortOrder='ascend'
        />

        {/* Modal tạo mới đối tác */}
        <CreatePartnerModal
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onSuccess={handleCreateSuccess}
          title='Tạo nhân sự mới'
        />

        {/* Modal chỉnh sửa đối tác */}
        <Modal
          title='Chỉnh sửa đối tác'
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            editForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={editForm} layout='vertical' onFinish={handleUpdate}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='fullname'
                  label='Họ tên'
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                  <Input placeholder='Nhập họ tên đối tác' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='donVi' label='Đơn vị'>
                  <Input placeholder='Nhập đơn vị' />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='email'
                  label='Email'
                  rules={[{ type: 'email', message: 'Email không đúng định dạng' }]}
                >
                  <Input placeholder='Nhập email' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='phone'
                  label='Số điện thoại'
                  rules={[
                    {
                      pattern: /^[0-9+\-\s()]{10,15}$/,
                      message: 'Số điện thoại không đúng định dạng',
                    },
                  ]}
                >
                  <Input placeholder='Nhập số điện thoại' />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name='cccd'
              label='Số thẻ / CCCD'
              rules={[{ pattern: /^\d{1,12}$/, message: 'Số thẻ / CCCD phải có 1 đến 12 chữ số' }]}
            >
              <Input placeholder='Nhập số thẻ / CCCD (1 đến 12 số)' />
            </Form.Item>

            <Form.Item className='mb-0 text-right'>
              <Space>
                <Button
                  onClick={() => {
                    setEditModalVisible(false);
                    editForm.resetFields();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{ backgroundColor: '#003c71', borderColor: '#003c71', color: 'white' }}
                >
                  Cập nhật
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal xem danh sách task */}
        <PartnerTaskModal
          visible={taskModalVisible}
          onCancel={() => setTaskModalVisible(false)}
          partner={selectedPartner}
        />
      </Card>
    </div>
  );
};

export default PartnerPage;
