import { DeleteOutlined, FileSearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from '../utils/axios';

// Extend dayjs with isBetween plugin
dayjs.extend(isBetween);

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const API_URL = import.meta.env.VITE_API_URL;

const HandoverPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState({
    status: false,
    date: false,
  });
  const [handovers, setHandovers] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: null,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });

  const validStatuses = ['all', 'draft', 'pending', 'completed', 'rejected'];
  const statusConfig = {
    all: { color: 'default', text: 'Tất cả' },
    draft: { color: 'blue', text: 'Chưa bàn giao' },
    pending: { color: 'orange', text: 'Chờ xác nhận' },
    completed: { color: 'green', text: 'Đã bàn giao' },
    rejected: { color: 'red', text: 'Từ chối' },
  };

  // Fetch handovers with filters and pagination
  const fetchHandovers = async (status = 'all', dateRange = null, page = 1, limit = 15) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit,
        status,
        sort: 'date:desc,FromShift.code:asc',
      });

      if (dateRange && dateRange[0] && dateRange[1]) {
        const startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
        const endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
        params.append('dateRange', `${startDate},${endDate}`);
      }

      const response = await axios.get(`/api/shifts/handover/by-status/${status}?${params}`);
      const { handovers, total, totalPages } = response.data;

      const sortedHandovers = [...handovers].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }

        const getShiftOrder = shiftCode => {
          if (!shiftCode) return 999;

          const shiftType = shiftCode.charAt(0).toUpperCase();
          const shiftNumber = parseInt(shiftCode.substring(1)) || 0;

          switch (shiftType) {
            case 'T':
              return 4 - shiftNumber;
            case 'H':
              return 6 - shiftNumber;
            case 'V':
              return 9 - shiftNumber;
            default:
              return 999;
          }
        };

        const orderA = getShiftOrder(a.FromShift?.code);
        const orderB = getShiftOrder(b.FromShift?.code);
        return orderA - orderB;
      });

      setHandovers(sortedHandovers);
      setPagination(prev => ({
        ...prev,
        total,
        totalPages,
        page,
        limit,
      }));
    } catch (error) {
      console.error('Error fetching handovers:', error);
      message.error('Lỗi khi tải danh sách bàn giao');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = value => {
    if (!validStatuses.includes(value)) {
      message.error('Trạng thái không hợp lệ');
      return;
    }

    setFilterLoading(prev => ({ ...prev, status: true }));
    try {
      setFilters(prev => ({ ...prev, status: value }));
      setPagination(prev => ({
        ...prev,
        page: 1,
        limit: 15,
      }));
      fetchHandovers(value, filters.dateRange, 1, 15);
    } catch (error) {
      console.error('Error filtering by status:', error);
      message.error('Lỗi khi lọc theo trạng thái');
    } finally {
      setFilterLoading(prev => ({ ...prev, status: false }));
    }
  };

  const handleDateChange = dates => {
    if (dates && dates[0] && dates[1]) {
      const diffDays = dates[1].diff(dates[0], 'days');
      if (diffDays > 30) {
        message.warning('Chỉ được chọn tối đa 30 ngày');
        return;
      }
    }

    setFilterLoading(prev => ({ ...prev, date: true }));
    try {
      setFilters(prev => ({ ...prev, dateRange: dates }));
      setPagination(prev => ({
        ...prev,
        page: 1,
        limit: 15,
      }));
      fetchHandovers(filters.status, dates, 1, 15);
    } finally {
      setFilterLoading(prev => ({ ...prev, date: false }));
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      page,
      limit: pageSize,
    }));
    fetchHandovers(filters.status, filters.dateRange, page, pageSize);
  };

  useEffect(() => {
    fetchHandovers(filters.status, filters.dateRange, pagination.page, pagination.limit);
  }, []);

  // Cache current shift data
  const [currentShiftData, setCurrentShiftData] = useState(null);

  const handleCreateHandover = async () => {
    try {
      // Nếu đã có data của current shift, dùng lại
      let currentShift = currentShiftData;

      // Nếu chưa có, fetch mới
      if (!currentShift) {
        const response = await axios.get('/api/shifts/current');
        currentShift = response.data?.shift;
        setCurrentShiftData(currentShift); // Cache lại để dùng sau
      }

      if (currentShift) {
        // Kiểm tra biên bản hiện có
        const handoverResponse = await axios.get(
          `/api/shifts/handover/by-shift/${currentShift.id}`
        );

        if (handoverResponse.data && Array.isArray(handoverResponse.data)) {
          // Lọc chỉ lấy các handover mà ca hiện tại là bên giao
          const handoversAsFromShift = handoverResponse.data.filter(
            h => h.fromShiftId === currentShift.id
          );

          if (handoversAsFromShift.length > 0) {
            const existingHandover = handoversAsFromShift[0];
            Modal.info({
              title: 'Thông báo',
              content: `Ca ${currentShift.code} đã có biên bản bàn giao ${statusConfig[existingHandover.status]?.text || existingHandover.status}. Bạn có thể xem chi tiết hoặc chỉnh sửa biên bản hiện có.`,
              okText: 'Xem chi tiết',
              okButtonProps: {
                style: {
                  backgroundColor: '#003c71',
                  borderColor: '#003c71',
                  color: 'white',
                },
              },
              onOk: () => navigate(`/dc/handover/${existingHandover.id}`),
            });
            return;
          }
        }
      }

      // Nếu chưa có biên bản, chuyển đến trang tạo mới
      navigate('/dc/handover/create');
    } catch (error) {
      console.error('Error checking existing handover:', error);
      message.error('Có lỗi khi kiểm tra biên bản hiện có');
    }
  };

  // Add cleanup for currentShiftData when component unmounts
  useEffect(() => {
    return () => {
      setCurrentShiftData(null);
    };
  }, []);

  const getStatusTag = status => {
    const map = {
      draft: { color: 'blue', text: 'Chưa bàn giao' },
      pending: { color: 'orange', text: 'Chờ xác nhận' },
      completed: { color: 'green', text: 'Đã bàn giao' },
      rejected: { color: 'red', text: 'Từ chối' },
    };
    return <Tag color={map[status]?.color}>{map[status]?.text}</Tag>;
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      className: 'custom-header border-r border-l border-gray-200',
      render: date => format(new Date(date), 'dd/MM/yyyy', { locale: vi }),
    },
    {
      title: 'Ca ',
      key: 'shift',
      width: 50,
      className: 'custom-header border-r border-gray-200',
      render: (_, r) => <div className='text-center'>{r.FromShift?.code || 'N/A'}</div>,
    },
    {
      title: 'Bên Giao Ca',
      key: 'fromUsers',
      width: 450,
      className: 'custom-header border-r border-gray-200',
      render: (_, record) => {
        let users = record.FromUsers || [];

        return (
          <div>
            {users.map((user, index) => (
              <Tag key={index} color='blue'>
                {user.fullname || user.fullName}
                {user.ShiftHandoverUser?.role === 'leader' && ' (Trưởng ca)'}
              </Tag>
            ))}
            {users.length === 0 && <Tag color='default'>Không có thông tin</Tag>}
          </div>
        );
      },
    },
    {
      title: 'Bên Nhận Ca',
      key: 'toUsers',
      width: 450,
      className: 'custom-header border-r border-gray-200',
      render: (_, record) => {
        const users = record.ToUsers || [];
        return (
          <div>
            {users.length > 0 ? (
              users.map((user, index) => (
                <Tag key={index} color='green'>
                  {user.fullname || user.fullName}
                  {(user.ShiftHandoverUser?.role === 'leader' || user.role === 'leader') &&
                    ' (Trưởng ca)'}
                </Tag>
              ))
            ) : (
              <Tag color='default'>Chưa có người nhận</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      className: 'custom-header border-gray-200',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
        const statusOrder = {
          draft: 1,
          pending: 2,
          completed: 3,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      },
      render: getStatusTag,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      className: 'custom-header border-gray-200',
      render: (_, record) => (
        <Space>
          <Tooltip title='Chi tiết'>
            <Button
              icon={<FileSearchOutlined />}
              type='primary'
              size='small'
              className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white'
              onClick={() => {
                if (currentUser?.role === 'manager') {
                  navigate(`/manager/handovers/${record.id}`);
                } else {
                  navigate(`/dc/handover/${record.id}`);
                }
              }}
            >
              Chi tiết
            </Button>
          </Tooltip>
          {record.status === 'draft' && record.FromUsers?.some(u => u.id === currentUser?.id) && (
            <>
              <Tooltip title='Xoá'>
                <Button
                  icon={<DeleteOutlined />}
                  type='primary'
                  size='small'
                  className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white'
                  onClick={() => handleDelete(record.id)}
                >
                  Xoá
                </Button>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleDelete = async id => {
    Modal.confirm({
      title: 'Xác nhận xoá',
      content: 'Bạn chắc chắn muốn xoá biên bản này?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}/api/shifts/handover/${id}`);
          message.success('Xoá thành công');
          // Fetch lại danh sách với các filter và pagination hiện tại
          fetchHandovers(filters.status, filters.dateRange, pagination.page, pagination.limit);
        } catch (err) {
          message.error(err.response?.data?.message || 'Lỗi khi xoá');
        }
      },
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spin size='large'>
          <div className='p-8'>
            <p className='text-gray-600'>Đang tải danh sách biên bản bàn giao...</p>
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <Card style={{ borderRadius: 12 }}>
      <Row justify='space-between' align='middle' className='mb-4'>
        <Col>
          <Title level={4} style={{ color: '#003c71', margin: 0 }}>
            Danh sách biên bản bàn giao
          </Title>
        </Col>
        {/* <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateHandover}
            style={{ backgroundColor: '#003c71', borderColor: '#003c71' }}
          >
            Tạo biên bản bàn giao
          </Button>
  </Col> */}
      </Row>

      <Row gutter={[16, 16]} className='mb-4'>
        <Col flex='auto'>
          <Space wrap>
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              style={{ width: 250 }}
              loading={filterLoading.status}
            >
              {validStatuses.map(status => (
                <Option key={status} value={status}>
                  {statusConfig[status].text}
                </Option>
              ))}
            </Select>
            <RangePicker
              format='DD/MM/YYYY'
              value={filters.dateRange}
              onChange={handleDateChange}
              loading={filterLoading.date}
              disabledDate={current => current && current > dayjs().endOf('day')}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={handovers}
        rowKey='id'
        bordered
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          onChange: handlePaginationChange,
          showSizeChanger: true,
          pageSizeOptions: ['15', '20', '50', '100'],
          defaultPageSize: 15,
          showTotal: total => `Tổng số ${total}`,
        }}
      />
    </Card>
  );
};

export default HandoverPage;
