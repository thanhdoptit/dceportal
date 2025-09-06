import React, { useState, useEffect } from 'react';
import { Modal, Table, Tag, Space, Spin, Empty, Typography, Card, Row, Col, Statistic } from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { fetchPartnerTasks } from '../../services/partnerService.js';
import { formatDateTime, formatDate } from '../../utils/dateUtils.js';

const { Title, Text } = Typography;

const PartnerTaskModal = ({ visible, onCancel, partner }) => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    cancelled: 0,
  });

  // Lấy danh sách task của đối tác
  const fetchTasks = async (page = 1, pageSize = 10) => {
    if (!partner?.id) return;

    setLoading(true);
    try {
      const response = await fetchPartnerTasks(partner.id, {
        page,
        limit: pageSize,
      });

      setTasks(response.tasks || []);
      setPagination({
        current: response.currentPage || 1,
        pageSize: pageSize,
        total: response.total || 0,
      });

      // Tính toán thống kê
      const taskStats = {
        total: response.total || 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        cancelled: 0,
      };

      (response.tasks || []).forEach(task => {
        switch (task.status) {
          case 'completed':
            taskStats.completed++;
            break;
          case 'in_progress':
            taskStats.inProgress++;
            break;
          case 'pending':
          case 'waiting':
            taskStats.pending++;
            break;
          case 'cancelled':
            taskStats.cancelled++;
            break;
        }
      });

      setStats(taskStats);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách task:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && partner?.id) {
      fetchTasks();
    }
  }, [visible, partner?.id]);

  // Xử lý thay đổi trang
  const handleTableChange = pagination => {
    fetchTasks(pagination.current, pagination.pageSize);
  };

  // Render trạng thái task
  const renderStatus = status => {
    const statusConfig = {
      completed: {
        color: 'success',
        icon: <CheckCircleOutlined />,
        text: 'Hoàn thành',
      },
      in_progress: {
        color: 'processing',
        icon: <ClockCircleOutlined />,
        text: 'Đang thực hiện',
      },
      pending: {
        color: 'warning',
        icon: <ExclamationCircleOutlined />,
        text: 'Chờ xử lý',
      },
      waiting: {
        color: 'warning',
        icon: <ExclamationCircleOutlined />,
        text: 'Chờ xử lý',
      },
      cancelled: {
        color: 'error',
        icon: <CloseCircleOutlined />,
        text: 'Đã hủy',
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  // Cột của bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      className: 'custom-header border-gray-200',
      render: id => <Text code>#{id}</Text>,
    },
    {
      title: 'Nội dung công việc',
      dataIndex: 'taskTitle',
      key: 'taskTitle',
      className: 'custom-header border-gray-200',
      render: (title, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{title || 'Không có tiêu đề'}</div>
          {record.taskDescription && (
            <Text type='secondary' style={{ fontSize: '12px' }}>
              {record.taskDescription.length > 50
                ? `${record.taskDescription.substring(0, 50)}...`
                : record.taskDescription}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      className: 'custom-header border-gray-200',
      render: location => (
        <Space>
          <EnvironmentOutlined />
          <Text>{location || 'Không xác định'}</Text>
        </Space>
      ),
    },
    /* {
       title: 'Vai trò',
       dataIndex: 'role',
       key: 'role',
       render: (role) => role ? <Tag color="blue">{role}</Tag> : <Text type="secondary">-</Text>
     },*/
    {
      title: 'Người tạo',
      dataIndex: 'creator',
      key: 'creator',
      className: 'custom-header border-gray-200',
      render: creator => (
        <Space>
          <UserOutlined />
          <Text>{creator?.fullname || 'Không xác định'}</Text>
        </Space>
      ),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      className: 'custom-header border-gray-200',
      render: time => (
        <Space>
          <CalendarOutlined />
          <Text>{time ? formatDateTime(time) : '-'}</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      className: 'custom-header border-gray-200',
      render: renderStatus,
    },
  ];

  return (
    <Modal
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Danh sách công việc của đối tác
          </Title>
          {partner && (
            <Text type='secondary'>
              {partner.fullname} - {partner.donVi}
            </Text>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1200}
      destroyOnHidden
    >
      {/* Thống kê */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={4}>
            <Statistic
              title='Tổng số công việc'
              value={stats.total}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title='Đã hoàn thành'
              value={stats.completed}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title='Đang thực hiện'
              value={stats.inProgress}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title='Chờ xử lý'
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title='Đã hủy'
              value={stats.cancelled}
              valueStyle={{ color: '#cf1322' }}
              prefix={<CloseCircleOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* Bảng danh sách task */}
      <Table
        columns={columns}
        bordered
        dataSource={tasks}
        rowKey='id'
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} công việc`,
        }}
        onChange={handleTableChange}
        loading={loading}
        locale={{
          emptyText: (
            <Empty description='Không có công việc nào' image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ),
        }}
        scroll={{ x: 1000 }}
      />
    </Modal>
  );
};

export default PartnerTaskModal;
