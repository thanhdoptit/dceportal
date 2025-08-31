import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Space, Progress, Typography, Spin } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import axios from '../../utils/axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ManagerOverview = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeShifts: 0,
    completedHandovers: 0,
    pendingHandovers: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    totalShifts: 0,
    completedShifts: 0,
    ongoingShifts: 0
  });
  const [recentHandovers, setRecentHandovers] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);

  useEffect(() => {
    if (dateRange?.[0] && dateRange?.[1]) {
      fetchOverviewData();
    }
  }, [dateRange]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const [statsRes, handoversRes] = await Promise.all([
        axios.get('/api/manager/stats', {
          params: {
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD')
          }
        }),
        axios.get('/api/manager/recent-handovers', {
          params: {
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD')
          }
        })
      ]);
      
      setStats(statsRes.data);
      setRecentHandovers(handoversRes.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tổng quan:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => format(new Date(date), 'dd/MM/yyyy', { locale: vi })
    },
    {
      title: 'Ca làm việc',
      dataIndex: ['FromShift', 'code'],
      key: 'shift',
      render: (code) => `Ca ${code}`
    },
    {
      title: 'Người bàn giao',
      dataIndex: ['FromUser', 'fullname'],
      key: 'fromUser'
    },
    {
      title: 'Người nhận',
      dataIndex: ['ToUser', 'fullname'],
      key: 'toUser'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { color: 'orange', text: 'Chờ xác nhận' },
          completed: { color: 'green', text: 'Đã hoàn thành' },
          rejected: { color: 'red', text: 'Đã từ chối' }
        };
        return (
          <span style={{ color: statusMap[status]?.color }}>
            {statusMap[status]?.text || status}
          </span>
        );
      }
    }
  ];

  const StatisticCard = ({ title, value, icon, color, suffix, loading }) => (
    <Card variant="outlined" className="hover:shadow-lg transition-all duration-300">
      <Statistic
        title={<Text type="secondary">{title}</Text>}
        value={value}
        prefix={icon}
        suffix={suffix}
        valueStyle={{ color }}
        loading={loading}
      />
    </Card>
  );

  const ProgressCard = ({ title, percent, color, loading }) => (
    <Card variant="outlined" className="hover:shadow-lg transition-all duration-300">
      <Title level={5} type="secondary">{title}</Title>
      <Progress 
        percent={percent} 
        strokeColor={color}
        showInfo={false}
        className="mt-4"
      />
      <Text strong style={{ color }} className="text-lg mt-2 block">
        {percent}%
      </Text>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={4} style={{ margin: 0 }}>Tổng quan hệ thống</Title>
        <RangePicker 
          value={dateRange}
          onChange={setDateRange}
          className="w-80"
        />
      </div>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Tổng số nhân viên"
              value={stats.totalUsers}
              icon={<UserOutlined />}
              color="#1890ff"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Ca làm việc hiện tại"
              value={stats.activeShifts}
              icon={<ClockCircleOutlined />}
              color="#52c41a"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Biên bản đã hoàn thành"
              value={stats.completedHandovers}
              icon={<CheckCircleOutlined />}
              color="#13c2c2"
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Biên bản chờ xác nhận"
              value={stats.pendingHandovers}
              icon={<FileTextOutlined />}
              color="#faad14"
              loading={loading}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-6">
          <Col xs={24} md={8}>
            <ProgressCard
              title="Tiến độ công việc"
              percent={Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}
              color="#1890ff"
              loading={loading}
            />
          </Col>
          <Col xs={24} md={8}>
            <ProgressCard
              title="Tiến độ ca làm việc"
              percent={Math.round((stats.completedShifts / stats.totalShifts) * 100) || 0}
              color="#52c41a"
              loading={loading}
            />
          </Col>
          <Col xs={24} md={8}>
            <ProgressCard
              title="Tiến độ bàn giao"
              percent={Math.round((stats.completedHandovers / (stats.completedHandovers + stats.pendingHandovers)) * 100) || 0}
              color="#13c2c2"
              loading={loading}
            />
          </Col>
        </Row>

        <Card 
          title={
            <Space>
              <CalendarOutlined />
              <span>Biên bản bàn giao gần đây</span>
            </Space>
          }
          variant="outlined"
          className="mt-6 hover:shadow-lg transition-all duration-300"
        >
          <Table
            dataSource={recentHandovers}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </Spin>
    </div>
  );
};

export default ManagerOverview; 