import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Space, Input, Modal, Form, 
  Select, Tag, message, Popconfirm, DatePicker, Switch
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, UserOutlined 
} from '@ant-design/icons';
import axios from '../../utils/axios';
import dayjs from 'dayjs';

const { Option } = Select;

const UserManagementPage = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/manager/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      dob: record.dob ? dayjs(record.dob) : null
    });
    setEditingId(record.id);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/manager/users/${id}`);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Lỗi khi xóa người dùng');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
      };

      if (editingId) {
        await axios.put(`/api/users/manager/users/${editingId}`, submitData);
        message.success('Cập nhật người dùng thành công');
      } else {
        await axios.post('/api/users/manager/users', submitData);
        message.success('Thêm người dùng thành công');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Error submitting user:', error);
      message.error('Lỗi khi lưu thông tin người dùng');
    }
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: (a, b) => a.fullname.localeCompare(b.fullname)
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      render: (dob) => dob ? dayjs(dob).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        const genderMap = {
          'male': 'Nam',
          'female': 'Nữ',
          'other': 'Khác'
        };
        return genderMap[gender] || '-';
      }
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          'manager': { color: 'blue', text: 'Quản lý' },
          'datacenter': { color: 'green', text: 'DataCenter' },
          'be': { color: 'orange', text: 'Batch Engineer' },
          'admin': { color: 'red', text: 'Admin' },
          'user': { color: 'default', text: 'Người dùng' }
        };
        return <Tag color={roleMap[role]?.color}>{roleMap[role]?.text}</Tag>;
      }
    },
    {
      title: 'AD User',
      dataIndex: 'isADUser',
      key: 'isADUser',
      render: (isADUser) => (
        <Tag color={isADUser ? 'green' : 'default'}>
          {isADUser ? 'Có' : 'Không'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Card
        title="Danh sách người dùng"
        extra={
          <Space>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              onChange={(e) => {
                // Handle search
              }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Thêm người dùng
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingId ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="fullname"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          {!editingId && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item
            name="dob"
            label="Ngày sinh"
          >
            <DatePicker 
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
          >
            <Select placeholder="Chọn giới tính">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="manager">Quản lý</Option>
              <Option value="datacenter">DataCenter</Option>
              <Option value="be">Batch Engineer</Option>
              <Option value="admin">Admin</Option>
              <Option value="user">Người dùng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isADUser"
            label="AD User"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage; 