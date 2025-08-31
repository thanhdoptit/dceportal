import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Space, message } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axios from '../../utils/axios';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';

const OverviewPage = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    subDays(new Date(), 7), // 7 ngày trước
    new Date() // Hôm nay
  ]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeShifts: 0,
    completedHandovers: 0,
    pendingHandovers: 0
  });
  const [recentHandovers, setRecentHandovers] = useState([]);

  useEffect(() => {
    fetchOverviewData();
  }, [dateRange]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const params = {
        startDate: format(dateRange[0], 'yyyy-MM-dd'),
        endDate: format(dateRange[1], 'yyyy-MM-dd')
      };
      
      const [statsRes, handoversRes] = await Promise.all([
        axios.get('/api/manager/stats', { params }),
        axios.get('/api/manager/recent-handovers', { params })
      ]);
      
      setStats(statsRes.data);
      setRecentHandovers(handoversRes.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tổng quan:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
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

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng số nhân viên"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="hover:shadow-md transition-shadow">
            <Statistic
              title="Ca làm việc hiện tại"
              value={stats.activeShifts}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="hover:shadow-md transition-shadow">
            <Statistic
              title="Biên bản đã hoàn thành"
              value={stats.completedHandovers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="hover:shadow-md transition-shadow">
            <Statistic
              title="Biên bản chờ xác nhận"
              value={stats.pendingHandovers}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="Biên bản bàn giao gần đây" 
        variant="outlined"
        className="hover:shadow-md transition-shadow"
        extra={
          <Space>
            <DatePicker.RangePicker 
              value={dateRange}
              onChange={setDateRange}
              placeholder={['Từ ngày', 'Đến ngày']}
              locale={vi}
            />
          </Space>
        }
      >
        <Table
          dataSource={recentHandovers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default OverviewPage; 