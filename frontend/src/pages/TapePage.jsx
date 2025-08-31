import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Card,
  message,
  Row,
  Col,
  DatePicker
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { fetchAllTapes, createTape, checkBarcodeExists } from '../services/tapeService';
import axios from 'axios';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Danh sách server cho select
const SERVER_OPTIONS = [
  /* { id: 1, name: 'BKSVR1' },
   { id: 2, name: 'HDPS' },
   { id: 3, name: 'BKSVR2' },
   { id: 5, name: 'BKSVR3' },
   { id: 6, name: 'OBR' },
   { id: 7, name: 'BKSVR5' },
   { id: 8, name: 'BKSVR4' },
   { id: 10, name: 'EDW1' },
   { id: 11, name: 'EDW2' },*/
  { id: 12, name: 'COMMCELL' },
];


// Component chính
const TapePage = () => {
  const [tapes, setTapes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    location: 'all',
    serverId: 'all',
    dateRange: null
  });
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  // Xử lý lỗi xác thực
  const handleUnauthorized = () => {
    message.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Lấy danh sách tape
  const fetchTapes = async (page = 1, limit = 15, customFilters = filters) => {
    try {
      setLoading(true);
      // Chuẩn bị params filter
      const params = {
        page,
        limit,
      };
      if (customFilters.location && customFilters.location !== 'all') {
        params.location = customFilters.location;
      }
      if (customFilters.serverId && customFilters.serverId !== 'all') params.serverId = customFilters.serverId;
      if (customFilters.dateRange && customFilters.dateRange[0] && customFilters.dateRange[1]) {
        params.dateStart = customFilters.dateRange[0].startOf('day').toISOString();
        params.dateEnd = customFilters.dateRange[1].endOf('day').toISOString();
      }
      // Gọi API lấy tape có phân trang
      const res = await fetchAllTapes(params);
      setTapes(res.tapes || []);
      setPagination(prev => ({
        ...prev,
        total: res.total || 0,
        totalPages: res.totalPages || 0,
        page,
        limit
      }));
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        message.error('Không thể lấy danh sách tape');
        console.error('Lỗi khi lấy danh sách tape:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.get('/api/locations')
      .then(res => setLocations(res.data))
      .catch(() => setLocations([]));
  }, []);

  // Xử lý tạo mới tape (nhiều tape cùng lúc)
  const handleCreate = async (values) => {
    const barcodes = (values.tapes || []).map(tape => tape.barcode?.trim()).filter(Boolean);
    const hasDuplicate = barcodes.length !== new Set(barcodes).size;
    if (hasDuplicate) {
      message.error('Có barcode bị trùng trong danh sách tạo mới!');
      return;
    }
    const tapes = (values.tapes || []).map(tape => {
      let locationName = tape.location;
      if (locations.length > 0) {
        const found = locations.find(loc => loc.id === tape.location || loc.name === tape.location);
        if (found) locationName = found.name;
      }
      return {
        ...tape,
        location: locationName,
        dateStart: tape.dateStart ? dayjs(tape.dateStart).toISOString() : null,
        dateEnd: tape.dateEnd ? dayjs(tape.dateEnd).toISOString() : null,
        dateTerminal: tape.dateTerminal ? dayjs(tape.dateTerminal).toISOString() : null,
      };
    });
    try {
      for (const tape of tapes) {
        await createTape(tape);
      }
      message.success('Tạo tape thành công');
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchTapes(pagination.page, pagination.limit);
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Lỗi khi tạo tape:', error, error.response?.data);
        message.error(error.response?.data?.error || 'Không thể tạo tape');
      }
    }
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '3%',
      className: 'custom-header border-gray-200',
      render: (id) => id,
      align: 'center',
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
      width: '10%',
      className: 'custom-header border-gray-200',
    },
    {
      title: 'Nhãn Tape',
      dataIndex: 'label',
      key: 'label',
      width: '10%',
      className: 'custom-header border-gray-200',
    },
    {
      title: 'Dữ liệu',
      dataIndex: 'dbname',
      key: 'dbname',
      width: '10%',
      className: 'custom-header border-gray-200',
    },
    {
      title: 'Nơi lưu',
      dataIndex: 'location',
      key: 'location',
      width: '10%',
      className: 'custom-header border-gray-200',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'dateStart',
      key: 'dateStart',
      width: '10%',
      className: 'custom-header border-gray-200',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'dateEnd',
      key: 'dateEnd',
      width: '10%',
      className: 'custom-header border-gray-200',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Ngày cất',
      dataIndex: 'dateTerminal',
      key: 'dateTerminal',
      width: '10%',
      className: 'custom-header border-gray-200',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Người cất',
      dataIndex: ['User', 'fullname'],
      key: 'user',
      width: '10%',
      className: 'custom-header border-gray-200',
    },

  ];

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      page,
      limit: pageSize
    }));
    // Không gọi fetchTapes trực tiếp, useEffect sẽ tự động gọi khi page/limit thay đổi
  };

  const handleFilterChange = (changed, value) => {
    let newValue = value;
    if (changed === 'location' && locations.length > 0) {
      const found = locations.find(loc => loc.id === value || loc.name === value);
      if (found) newValue = found.name;
    }
    setFilters(prev => ({ ...prev, [changed]: newValue }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDateRangeChange = (dates) => {
    setFilters(prev => ({ ...prev, dateRange: dates }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchTapes(pagination.page, pagination.limit, filters);
  }, [pagination.page, pagination.limit, filters]);

  return (
    <div className="p-0">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={4} style={{ color: '#003c71', margin: 0 }}>Quản lý Tape</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
            style={{ backgroundColor: '#003c71', borderColor: '#003c71', color: 'white' }}
          >
            Tạo mới
          </Button>
        </div>
        {/* Bộ lọc */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={16} align="middle">
            <Col>
              <Text strong>Nơi lưu trữ:</Text>
            </Col>
            <Col>
              <Select
                style={{ width: 180 }}
                value={filters.location}
                onChange={val => handleFilterChange('location', val)}
              >
                <Select.Option value="all">Tất cả</Select.Option>
                {locations.map(loc => (
                  <Select.Option key={loc.id} value={loc.name}>{loc.name}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Text strong>Server:</Text>
            </Col>
            <Col>
              <Select
                style={{ width: 180 }}
                value={filters.serverId}
                onChange={val => handleFilterChange('serverId', val)}
              >
                <Select.Option value="all">Tất cả server</Select.Option>
                {SERVER_OPTIONS.map(server => (
                  <Select.Option key={server.id} value={server.id}>{server.name}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Text strong>Thời gian tạo:</Text>
            </Col>
            <Col>
              <RangePicker
                style={{ width: 300 }}
                onChange={handleDateRangeChange}
                value={filters.dateRange}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
                allowClear={true}
                showTime={false}
                disabledDate={current => current && current > dayjs()}
              />
            </Col>
          </Row>
        </Card>
        <Table
          columns={columns}
          dataSource={tapes}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            onChange: handlePaginationChange,
            showSizeChanger: true,
            pageSizeOptions: ['15', '20', '50', '100'],
            defaultPageSize: 15,
            showTotal: (total) => `Tổng số ${total}`,
            locale: { items_per_page: '/ Trang' }
          }}
          bordered
          defaultSortOrder="ascend"
        />

        {/* Modal tạo mới tape */}
        <Modal
          className="custom-modal"
          title="Lưu tape export"
          maskClosable={false}
          keyboard={false}
          open={createModalVisible}
          onCancel={() => {
            setCreateModalVisible(false);
            createForm.resetFields();
          }}
          footer={null}
          width={1500}
        >
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreate}
            initialValues={{ tapes: [{ dateTerminal: dayjs(), serverId: 12 }] }}
          >
            <div style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10, overflow: 'auto' }}>
              <Form.List name="tapes">
                {(fields, { add, remove }) => (
                  <>
                    <Row gutter={8} style={{ marginBottom: 8 }}>
                      <Col flex="auto">
                        <Button type="dashed" onClick={() => add({ dateTerminal: dayjs(), serverId: 12 })} icon={<PlusOutlined />}>
                          Thêm tape
                        </Button>
                      </Col>
                      <Col>
                        <Button danger onClick={() => {
                          createForm.setFieldsValue({ tapes: [] });
                        }}>
                          Xóa tất cả
                        </Button>
                      </Col>
                    </Row>
                    <Row gutter={8} style={{ marginBottom: 4, fontWeight: 500, color: '#003c71' }} align="middle">
                      {/* Header label cho các trường nhập */}
                      <Col span={3}>
                        <span style={{ fontSize: 14, color: '#003c71', marginLeft: 5 }}>Server</span></Col>
                      <Col span={3}>
                        <span style={{ fontSize: 14, color: '#003c71', marginLeft: 5 }}>Barcode</span></Col>
                      <Col span={4}>
                        <span style={{ fontSize: 14, color: '#003c71', marginLeft: 5 }}>Nhãn tape</span></Col>
                      <Col span={4}>
                        <span style={{ fontSize: 14, color: '#003c71', marginLeft: 5 }}>Dữ liệu</span></Col>
                      <Col span={3}>
                        <span style={{ fontSize: 14, color: '#003c71', marginLeft: 5 }}>Nơi lưu</span></Col>
                      <Col span={2}>
                        <span style={{ fontSize: 14, color: '#003c71', marginLeft: 5 }}>Bắt đầu</span></Col>
                      <Col span={2}>
                        <span style={{ fontSize: 14, color: '#003c71', marginLeft: 5 }}>Kết thúc</span></Col>
                      <Col span={2}>
                        <span style={{ fontSize: 14, color: '#003c71', marginLeft: 5 }}>Ngày nhập</span></Col>
                      <Col span={1}>
                        <span style={{ fontSize: 14, color: '#003c71', marginLeft: 10 }}></span></Col>
                    </Row>
                    {fields.map(({ name, ...restField }) => (

                      <Row gutter={8} align="middle" style={{ minHeight: 36, position: 'relative' }}>
                        <Col span={3}>
                          <Form.Item
                            {...restField}
                            name={[name, 'server']}
                            rules={[{ required: true, message: 'Chọn server' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select size="normal" placeholder="Server">
                              {SERVER_OPTIONS.map(server => (
                                <Select.Option key={server.id} value={server.id}>{server.name}</Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            {...restField}
                            name={[name, 'barcode']}
                            rules={[
                              { required: true, message: 'Nhập barcode' },
                              {
                                validator: async (_, value) => {
                                  if (!value) return Promise.resolve();
                                  const exists = await checkBarcodeExists(value);
                                  if (exists) return Promise.reject('Barcode đã tồn tại!');
                                  return Promise.resolve();
                                }
                              }
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input size="normal" placeholder="Barcode" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'label']}
                            rules={[{ required: true, message: 'Nhập label' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select size="normal" placeholder="Label">
                              <Select.Option value="DC-MA-02_ESL01_infinite">DC-MA-02_ESL01_infinite</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'dbname']}
                            rules={[{ required: true, message: 'Nhập DB' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select size="normal" placeholder="Dữ liệu">
                              <Select.Option value="DC-MA-02_ESL01_infinite">DC-MA-02_ESL01_infinite</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                          <Form.Item
                            {...restField}
                            name={[name, 'location']}
                            rules={[{ required: true, message: 'Chọn nơi lưu' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select size="normal" placeholder="Nơi lưu">
                              {locations.map(loc => (
                                <Select.Option key={loc.id} value={loc.name}>{loc.name}</Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            {...restField}
                            name={[name, 'dateStart']}
                            style={{ marginBottom: 0 }}
                          >
                            <DatePicker
                              size="normal"
                              style={{ width: '100%' }}
                              format="DD/MM/YYYY"
                              placeholder="Bắt đầu"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            {...restField}
                            name={[name, 'dateEnd']}
                            style={{ marginBottom: 0 }}
                          >
                            <DatePicker
                              size="normal"
                              style={{ width: '100%' }}
                              format="DD/MM/YYYY"
                              placeholder="Kết thúc"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item
                            {...restField}
                            name={[name, 'dateTerminal']}
                            style={{ marginBottom: 0 }}
                          >
                            <DatePicker
                              size="normal"
                              style={{ width: '100%' }}
                              format="DD/MM/YYYY"
                              placeholder="Ngày nhập"
                            />
                          </Form.Item>
                        </Col >
                        <Col span={1}>
                          <Button
                            danger
                            size="small"
                            onClick={() => remove(name)}
                            style={{
                              padding: 10,
                              width: 28,
                              height: 28,
                              marginLeft: 10,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: 1
                            }}
                            icon={<DeleteOutlined />}
                          />
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>
            </div>
            <Form.Item className="mb-0 text-right" style={{ padding: 10 }}>
              <Space>
                <Button onClick={() => {
                  setCreateModalVisible(false);
                  createForm.resetFields();
                }}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: '#003c71', borderColor: '#003c71', color: 'white' }}>
                  Tạo mới
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default TapePage;
