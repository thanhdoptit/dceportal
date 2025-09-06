import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  TimePicker,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const { Option } = Select;

const ShiftListPage = () => {
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/shifts/manager/shifts');
      setShifts(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách ca:', error);
      message.error('Không thể tải danh sách ca làm việc');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEdit = record => {
    form.setFieldsValue({
      ...record,
      startTime: dayjs(record.startTime, 'HH:mm'),
      endTime: dayjs(record.endTime, 'HH:mm'),
    });
    setEditingId(record.id);
    setModalVisible(true);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`/api/shifts/manager/shifts/${id}`);
      message.success('Đã xóa ca làm việc thành công');
      fetchShifts();
    } catch (error) {
      console.error('Lỗi khi xóa ca:', error);
      message.error('Không thể xóa ca làm việc');
    }
  };

  const handleSubmit = async values => {
    try {
      const data = {
        ...values,
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime.format('HH:mm'),
      };

      if (editingId) {
        await axios.put(`/api/shifts/manager/shifts/${editingId}`, data);
        message.success('Đã cập nhật ca làm việc thành công');
      } else {
        await axios.post('/api/shifts/manager/shifts', data);
        message.success('Đã thêm ca làm việc mới thành công');
      }
      setModalVisible(false);
      fetchShifts();
    } catch (error) {
      console.error('Lỗi khi lưu ca:', error);
      message.error('Không thể lưu thông tin ca làm việc');
    }
  };

  const columns = [
    {
      title: 'Mã ca',
      dataIndex: 'code',
      key: 'code',
      render: code => <Tag color='blue'>Ca {code}</Tag>,
    },
    {
      title: 'Tên ca',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giờ bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'Giờ kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const statusMap = {
          not_started: { color: 'default', text: 'Chưa bắt đầu' },
          doing: { color: 'processing', text: 'Đang làm việc' },
          completed: { color: 'success', text: 'Đã hoàn thành' },
        };
        return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
      },
    },
    {
      title: 'Số nhân viên',
      dataIndex: 'Users',
      key: 'userCount',
      render: users => users?.length || 0,
    },
    {
      title: 'Người tạo',
      dataIndex: ['Creator', 'fullName'],
      key: 'creator',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type='primary'
            size='small'
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type='primary'
            danger
            size='small'
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <Card
        title='Quản lý ca làm việc'
        extra={
          <Space>
            <Input
              placeholder='Tìm kiếm ca...'
              prefix={<SearchOutlined />}
              onChange={e => {
                // Xử lý tìm kiếm
              }}
            />
            <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm ca mới
            </Button>
          </Space>
        }
      >
        <Table columns={columns} dataSource={shifts} rowKey='id' loading={loading} />
      </Card>

      <Modal
        title={editingId ? 'Chỉnh sửa ca làm việc' : 'Thêm ca làm việc mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            name='code'
            label='Mã ca'
            rules={[{ required: true, message: 'Vui lòng nhập mã ca' }]}
          >
            <Input placeholder='Nhập mã ca (ví dụ: T1, T2, H1, H2)' />
          </Form.Item>

          <Form.Item
            name='name'
            label='Tên ca'
            rules={[{ required: true, message: 'Vui lòng nhập tên ca' }]}
          >
            <Input placeholder='Nhập tên ca' />
          </Form.Item>

          <Form.Item
            name='startTime'
            label='Giờ bắt đầu'
            rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
          >
            <TimePicker format='HH:mm' className='w-full' />
          </Form.Item>

          <Form.Item
            name='endTime'
            label='Giờ kết thúc'
            rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
          >
            <TimePicker format='HH:mm' className='w-full' />
          </Form.Item>

          <Form.Item
            name='status'
            label='Trạng thái'
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder='Chọn trạng thái'>
              <Option value='not_started'>Chưa bắt đầu</Option>
              <Option value='doing'>Đang làm việc</Option>
              <Option value='completed'>Đã hoàn thành</Option>
            </Select>
          </Form.Item>

          <Form.Item className='text-right mb-0'>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
              <Button type='primary' htmlType='submit'>
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShiftListPage;
