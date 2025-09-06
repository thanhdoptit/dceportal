import { Button, Card, Space, Table, Tag } from 'antd';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const DeviceCheckPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deviceChecks, setDeviceChecks] = useState([]);

  useEffect(() => {
    fetchDeviceChecks();
  }, []);

  const fetchDeviceChecks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/shifts/device-checks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setDeviceChecks(response.data);
      }
    } catch (error) {
      console.error('Error fetching device checks:', error);
      toast.error('Không thể tải danh sách kiểm tra thiết bị');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Ca làm việc',
      dataIndex: ['workShift', 'code'],
      key: 'shiftCode',
    },
    {
      title: 'Ngày',
      dataIndex: ['workShift', 'date'],
      key: 'date',
      render: date => format(new Date(date), 'dd/MM/yyyy', { locale: vi }),
    },
    {
      title: 'Người kiểm tra',
      dataIndex: ['workShift', 'Users'],
      key: 'users',
      render: users => users?.map(user => user.fullname).join(', '),
    },
    {
      title: 'Trạng thái',
      dataIndex: ['workShift', 'status'],
      key: 'status',
      render: status => {
        let color = 'default';
        let text = 'N/A';

        switch (status) {
          case 'waiting':
            color = 'default';
            text = 'Chờ thực hiện';
            break;
          case 'doing':
            color = 'processing';
            text = 'Đang thực hiện';
            break;
          case 'done':
            color = 'success';
            text = 'Hoàn thành';
            break;
          default:
            break;
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type='primary'
            onClick={() => navigate(`/dc/device-check/${record.workShift.id}`)}
          >
            Xem chi tiết
          </Button>
          {record.workShift.status === 'doing' && (
            <Button onClick={() => navigate(`/dc/device-check/edit/${record.workShift.id}`)}>
              Cập nhật
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className='p-6'>
      <Card
        title='Danh sách kiểm tra thiết bị'
        extra={
          <Button type='primary' onClick={() => navigate('/dc/device-check/create')}>
            Tạo mới
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={deviceChecks}
          rowKey={record => record.workShift.id}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default DeviceCheckPage;
