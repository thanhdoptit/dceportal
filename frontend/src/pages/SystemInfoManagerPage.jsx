import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Tag,
  Popconfirm,
  Image,
  Divider,
  Row,
  Col,
  Typography,
  Alert
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  FileTextOutlined,
  PictureOutlined
} from '@ant-design/icons';
import api from '../services/api';
// import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SystemInfoManagerPage = () => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSystem, setEditingSystem] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Các loại hệ thống
  const systemTypes = [
    { value: 'UPS_DISTRIBUTION', label: 'Hệ thống phân phối điện UPS' },
    { value: 'UPS', label: 'Hệ thống UPS' },
    { value: 'COOLING', label: 'Hệ thống làm mát' },
    { value: 'VIDEO_SURVEILLANCE', label: 'Hệ thống giám sát hình ảnh' },
    { value: 'ACCESS_CONTROL', label: 'Hệ thống kiểm soát truy cập' },
    { value: 'FIRE_PROTECTION', label: 'PCCC' },
    { value: 'INFRASTRUCTURE_MONITORING', label: 'Hệ thống giám sát hạ tầng TTDL' }
  ];

  // Thêm các state cho file upload
  const [contentData, setContentData] = useState({
    purpose: { description: '', items: [], files: [] },
    components: { items: [], files: [] },
    operation: { normal: { steps: [], files: [] }, backup: { steps: [], files: [] } },
    procedures: { items: [], files: [] },
    troubleshooting: { items: [], files: [] }
  });

  // Load danh sách hệ thống
  const loadSystems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/system-info/list');
      if (response.data.success) {
        setSystems(response.data.data);
      }
    } catch {
      message.error('Lỗi tải danh sách hệ thống');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystems();
  }, []);

  // Xử lý tạo/cập nhật hệ thống
  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        purpose: contentData.purpose.description,
        components: contentData.components.description,
        operation: contentData.operation.description,
        procedures: contentData.procedures.description,
        troubleshooting: contentData.troubleshooting.description,
        content: JSON.stringify(contentData)
      };
      if (editingSystem) {
        await api.put(`/api/system-info/${editingSystem.id}`, submitData);
        message.success('Cập nhật thành công');
      } else {
        await api.post('/api/system-info', submitData);
        message.success('Tạo hệ thống thành công');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingSystem(null);
      setContentData({
        purpose: { description: '', items: [], files: [] },
        components: { items: [], files: [] },
        operation: { normal: { steps: [], files: [] }, backup: { steps: [], files: [] } },
        procedures: { items: [], files: [] },
        troubleshooting: { items: [], files: [] }
      });
      loadSystems();
    } catch {
      message.error('Lỗi lưu hệ thống');
    }
  };

  // Xử lý xóa hệ thống
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/system-info/${id}`);
      message.success('Xóa thành công');
      loadSystems();
    } catch {
      message.error('Lỗi xóa hệ thống');
    }
  };

  // Mở modal chỉnh sửa
  const handleEdit = (system) => {
    // Xác định role prefix
    let rolePrefix = '/dc';
    if (currentUser?.role?.toLowerCase() === 'manager') rolePrefix = '/manager';
    if (currentUser?.role?.toLowerCase() === 'be') rolePrefix = '/be';

    // Chuyển đến trang chỉnh sửa mới
    navigate(`${rolePrefix}/system-info/edit/${system.id}`);
  };

  // Mở modal tạo mới
  const handleCreate = () => {
    setEditingSystem(null);
    form.resetFields();
    setContentData({
      purpose: { description: '', items: [], files: [] },
      components: { items: [], files: [] },
      operation: { normal: { steps: [], files: [] }, backup: { steps: [], files: [] } },
      procedures: { items: [], files: [] },
      troubleshooting: { items: [], files: [] }
    });
    setModalVisible(true);
  };

  // Xử lý upload file ảnh
  const handleImageUpload = async ({ file }) => {
    if (!editingSystem) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post(`/api/system-info/${editingSystem.id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setContentData(prev => ({
        ...prev,
        purpose: {
          ...prev.purpose,
          files: res.data.images || []
        }
      }));
      message.success('Upload ảnh thành công');
    } catch {
      message.error('Upload ảnh thất bại');
    }
  };

  // Xử lý upload file tài liệu
  const handleDocUpload = async ({ file }) => {
    if (!editingSystem) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post(`/api/system-info/${editingSystem.id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setContentData(prev => ({
        ...prev,
        components: {
          ...prev.components,
          files: res.data.documents || []
        }
      }));
      message.success('Upload tài liệu thành công');
    } catch {
      message.error('Upload tài liệu thất bại');
    }
  };

  // Xử lý xóa file ảnh/tài liệu
  const handleDeleteFile = async (fileType, filename) => {
    if (!editingSystem) return;
    try {
      await api.delete(`/api/system-info/${editingSystem.id}/files/${fileType}/${filename}`);
      if (fileType === 'images') setContentData(prev => ({
        ...prev,
        purpose: {
          ...prev.purpose,
          files: prev.purpose.files.filter(f => f.filename !== filename)
        }
      }));
      if (fileType === 'documents') setContentData(prev => ({
        ...prev,
        components: {
          ...prev.components,
          files: prev.components.files.filter(f => f.filename !== filename)
        }
      }));
      message.success('Xóa file thành công');
    } catch {
      message.error('Xóa file thất bại');
    }
  };

  // Cột bảng
  const columns = [
    {
      title: 'Loại hệ thống',
      dataIndex: 'systemType',
      key: 'systemType',
      render: (type) => {
        const systemType = systemTypes.find(t => t.value === type);
        return <Tag color="blue">{systemType?.label || type}</Tag>;
      }
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <Text strong>{title}</Text>
    },
    {
      title: 'Mô tả',
      dataIndex: 'subtitle',
      key: 'subtitle',
      ellipsis: true
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'content',
      key: 'images',
      render: (content) => {
        let totalImages = 0;
        if (content) {
          try {
            const contentObj = typeof content === 'string' ? JSON.parse(content) : content;
            // Đếm tổng số ảnh từ tất cả các section
            Object.values(contentObj).forEach(section => {
              if (section.files) {
                section.files.forEach(file => {
                  if (file.mimetype && file.mimetype.startsWith('image/')) {
                    totalImages++;
                  }
                });
              }
            });
          } catch {
            totalImages = 0;
          }
        }

        if (totalImages === 0) {
          return <Text type="secondary">Không có</Text>;
        }
        return (
          <Space>
            <PictureOutlined />
            <Text>{totalImages} hình</Text>
          </Space>
        );
      }
    },
    {
      title: 'Tài liệu',
      dataIndex: 'content',
      key: 'documents',
      render: (content) => {
        let totalDocs = 0;
        if (content) {
          try {
            const contentObj = typeof content === 'string' ? JSON.parse(content) : content;
            // Đếm tổng số tài liệu từ tất cả các section
            Object.values(contentObj).forEach(section => {
              if (section.files) {
                section.files.forEach(file => {
                  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
                    totalDocs++;
                  }
                });
              }
            });
          } catch {
            totalDocs = 0;
          }
        }

        if (totalDocs === 0) {
          return <Text type="secondary">Không có</Text>;
        }
        return (
          <Space>
            <FileTextOutlined />
            <Text>{totalDocs} tài liệu</Text>
          </Space>
        );
      }
    },
    {
      title: 'Cập nhật bởi',
      dataIndex: ['updater', 'fullname'],
      key: 'updater'
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa hệ thống này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3}>Quản lý thông tin hệ thống kỹ thuật</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo hệ thống mới
          </Button>
        </div>

        <Alert
          message="Hướng dẫn sử dụng"
          description="Tạo và quản lý thông tin chi tiết về các hệ thống kỹ thuật trong Trung tâm dữ liệu. Bạn có thể upload hình ảnh và tài liệu đính kèm."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />

        <Table
          columns={columns}
          dataSource={systems}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hệ thống`
          }}
        />
      </Card>

      {/* Modal tạo/sửa hệ thống */}
      <Modal
        title={editingSystem ? 'Chỉnh sửa hệ thống' : 'Tạo hệ thống mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingSystem(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            content: ''
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="systemType"
                label="Loại hệ thống"
                rules={[{ required: true, message: 'Vui lòng chọn loại hệ thống' }]}
              >
                <Select placeholder="Chọn loại hệ thống">
                  {systemTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Trạng thái"
                initialValue={true}
              >
                <Select>
                  <Option value={true}>Hoạt động</Option>
                  <Option value={false}>Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Tiêu đề hệ thống"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="VD: Hệ thống UPS (Uninterruptible Power Supply)" />
          </Form.Item>

          <Form.Item
            name="subtitle"
            label="Mô tả ngắn"
          >
            <Input placeholder="VD: Hệ thống cung cấp điện liên tục cho Trung tâm Dữ liệu" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung chi tiết (Markdown)"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung chi tiết' }]}
          >
            <>
              <TextArea
                rows={12}
                placeholder="Nhập nội dung markdown..."
                value={contentData.purpose.description}
                onChange={e => setContentData(prev => ({
                  ...prev,
                  purpose: {
                    ...prev.purpose,
                    description: e.target.value
                  }
                }))}
              />
              <Divider orientation="left">Xem trước</Divider>

            </>
          </Form.Item>

          {/* Upload hình ảnh */}
          <Form.Item label="Hình ảnh hệ thống">
            <Upload
              customRequest={handleImageUpload}
              showUploadList={false}
              multiple={false}
              accept="image/*"
              disabled={!editingSystem}
            >
              <Button icon={<UploadOutlined />} disabled={!editingSystem}>Upload ảnh</Button>
            </Upload>
            <div style={{ marginTop: 8 }}>
              {contentData.purpose.files && contentData.purpose.files.length > 0 ? contentData.purpose.files.map(img => (
                <Space key={img.filename} style={{ marginRight: 8 }}>
                  <Image src={`/uploads/system-info/${img.filename}`} width={60} />
                  <Button size="small" danger onClick={() => handleDeleteFile('images', img.filename)}>Xóa</Button>
                </Space>
              )) : <Text type="secondary">Chưa có ảnh</Text>}
            </div>
          </Form.Item>

          {/* Upload tài liệu */}
          <Form.Item label="Tài liệu đính kèm">
            <Upload
              customRequest={handleDocUpload}
              showUploadList={false}
              multiple={false}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              disabled={!editingSystem}
            >
              <Button icon={<UploadOutlined />} disabled={!editingSystem}>Upload tài liệu</Button>
            </Upload>
            <div style={{ marginTop: 8 }}>
              {contentData.components.files && contentData.components.files.length > 0 ? contentData.components.files.map(doc => (
                <Space key={doc.path || doc.filename} style={{ marginRight: 8 }}>
                  <FileTextOutlined />
                  <a href={`/uploads/${doc.path || ('system-info/' + doc.filename)}`} target="_blank" rel="noopener noreferrer">{doc.originalName}</a>
                  <Button size="small" danger onClick={() => handleDeleteFile('documents', doc.path || doc.filename)}>Xóa</Button>
                </Space>
              )) : <Text type="secondary">Chưa có tài liệu</Text>}
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSystem ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingSystem(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemInfoManagerPage;
