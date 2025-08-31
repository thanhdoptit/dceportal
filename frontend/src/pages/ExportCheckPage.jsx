import React, { useState, useEffect } from 'react';
import { Form, Upload, Button, Table, Input, Space, message, Tabs, Card, Descriptions, Tag } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const ExportCheckPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [result, setResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Kiểm tra authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Vui lòng đăng nhập để sử dụng chức năng này!');
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Cấu hình cho Upload component
  const uploadProps = {
    name: 'file',
    accept: '.xlsx,.xls',
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                      file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error('Chỉ chấp nhận file Excel!');
        return Upload.LIST_IGNORE;
      }
      setSelectedFile(file);
      return false;
    },
    maxCount: 1,
    onChange: (info) => {
      console.log('Upload onChange:', info);
      if (info.file.status === 'done') {
        message.success(`${info.file.name} đã được chọn`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} upload thất bại`);
      }
    },
    onRemove: () => {
      setSelectedFile(null);
    }
  };

  // Thêm dòng mới vào bảng
  const handleAddRow = () => {
    const newRow = {
      key: Date.now(),
      ip: '',
      exportPath: '',
      username: '',
      password: '',
    };
    setDataSource([...dataSource, newRow]);
  };

  // Xóa dòng khỏi bảng
  const handleDeleteRow = (key) => {
    setDataSource(dataSource.filter(item => item.key !== key));
  };

  // Cập nhật giá trị của một ô
  const handleCellChange = (key, field, value) => {
    setDataSource(dataSource.map(item => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setResult(null);
      let response;
      const token = localStorage.getItem('token');
      
      if (!token) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        navigate('/login');
        return;
      }

      if (activeTab === '1') {
        // Xử lý upload file
        if (!selectedFile) {
          message.error('Vui lòng chọn file Excel!');
          return;
        }

        const formData = new FormData();
        formData.append('excel', selectedFile);
        
        // Tạo object credentials từ dataSource
        const credentials = {};
        dataSource.forEach(item => {
          if (item.ip && item.username && item.password) {
            credentials[item.ip] = {
              username: item.username,
              password: item.password
            };
          }
        });
        
        // Thêm credentials vào formData dưới dạng chuỗi JSON
        formData.append('credentials', JSON.stringify(credentials));
        
        console.log('Sending file:', selectedFile.name, selectedFile.type, selectedFile.size);
        console.log('Credentials:', credentials);

        try {
          response = await axios.post('http://192.168.1.12:3001/check-export', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 30000, // 30 seconds timeout
          });
        } catch (error) {
          console.error('API Error:', error.response?.data || error.message);
          if (error.response?.data?.message) {
            message.error(`Lỗi server: ${error.response.data.message}`);
          } else if (error.code === 'ECONNABORTED') {
            message.error('Server không phản hồi. Vui lòng thử lại sau!');
          } else {
            message.error('Có lỗi xảy ra khi gửi file. Vui lòng thử lại!');
          }
          return;
        }
      } else {
        // Xử lý dữ liệu từ bảng
        if (dataSource.length === 0) {
          message.error('Vui lòng nhập ít nhất một dòng dữ liệu!');
          return;
        }

        // Tạo object credentials từ dataSource
        const credentials = {};
        dataSource.forEach(item => {
          if (item.ip && item.username && item.password) {
            credentials[item.ip] = {
              username: item.username,
              password: item.password
            };
          }
        });

        try {
          response = await axios.post('http://192.168.1.12:3001/check-export', {
            credentials: JSON.stringify(credentials)
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 30000
          });
        } catch (error) {
          console.error('API Error:', error.response?.data || error.message);
          if (error.response?.data?.message) {
            message.error(`Lỗi server: ${error.response.data.message}`);
          } else {
            message.error('Có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại!');
          }
          return;
        }
      }

      // Xử lý response
      if (response.data.file) {
        // Lưu kết quả để hiển thị
        setResult(response.data);
        
        // Tạo link tải file
        const url = window.URL.createObjectURL(new Blob([response.data.file]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'export_check_result.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        message.success('Đã tải file kết quả!');
      } else {
        setResult(response.data);
        message.success('Kiểm tra hoàn tất!');
      }
    } catch (error) {
      console.error('Submit error:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        navigate('/login');
      } else {
        message.error('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      render: (_, record) => (
        <Input
          value={record.ip}
          onChange={(e) => handleCellChange(record.key, 'ip', e.target.value)}
          placeholder="Nhập IP"
        />
      ),
    },
    {
      title: 'Export Path',
      dataIndex: 'exportPath',
      key: 'exportPath',
      render: (_, record) => (
        <Input
          value={record.exportPath}
          onChange={(e) => handleCellChange(record.key, 'exportPath', e.target.value)}
          placeholder="Nhập đường dẫn export"
        />
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (_, record) => (
        <Input
          value={record.username}
          onChange={(e) => handleCellChange(record.key, 'username', e.target.value)}
          placeholder="Nhập username"
        />
      ),
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
      render: (_, record) => (
        <Input.Password
          value={record.password}
          onChange={(e) => handleCellChange(record.key, 'password', e.target.value)}
          placeholder="Nhập password"
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRow(record.key)}
        />
      ),
    },
  ];

  // Render kết quả
  const renderResult = () => {
    if (!result) return null;

    return (
      <Card title="Kết quả kiểm tra" style={{ marginTop: 24 }}>
        <Descriptions bordered>
          <Descriptions.Item label="Tổng số" span={3}>
            {result.total || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Thành công">
            <Tag color="success">{result.success || 0}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Thất bại">
            <Tag color="error">{result.failed || 0}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Đang xử lý">
            <Tag color="processing">{result.processing || 0}</Tag>
          </Descriptions.Item>
        </Descriptions>

        {result.details && (
          <Table
            dataSource={result.details}
            columns={[
              {
                title: 'IP',
                dataIndex: 'ip',
                key: 'ip',
              },
              {
                title: 'Export Path',
                dataIndex: 'exportPath',
                key: 'exportPath',
              },
              {
                title: 'Trạng thái',
                dataIndex: 'status',
                key: 'status',
                render: (status) => (
                  <Tag color={
                    status === 'success' ? 'success' :
                    status === 'failed' ? 'error' :
                    'processing'
                  }>
                    {status === 'success' ? 'Thành công' :
                     status === 'failed' ? 'Thất bại' :
                     'Đang xử lý'}
                  </Tag>
                ),
              },
              {
                title: 'Thông báo',
                dataIndex: 'message',
                key: 'message',
              },
            ]}
            style={{ marginTop: 16 }}
          />
        )}

        {result.file && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => {
                const url = window.URL.createObjectURL(new Blob([result.file]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'export_check_result.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
              }}
            >
              Tải lại file kết quả
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Kiểm tra Export</h1>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Upload File Excel" key="1">
          <Form form={form} layout="vertical">
            <Form.Item
              name="file"
              label="Chọn file Excel"
              rules={[{ required: true, message: 'Vui lòng chọn file!' }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Chọn file</Button>
              </Upload>
            </Form.Item>
            <div style={{ marginTop: 16 }}>
              <h3>Thông tin xác thực cho các IP</h3>
              <div style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddRow}
                >
                  Thêm IP
                </Button>
              </div>
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                rowKey="key"
              />
            </div>
          </Form>
        </TabPane>

        <TabPane tab="Nhập trực tiếp" key="2">
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddRow}
            >
              Thêm dòng
            </Button>
          </div>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowKey="key"
          />
        </TabPane>
      </Tabs>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          size="large"
          disabled={activeTab === '1' && !selectedFile}
        >
          Kiểm tra
        </Button>
      </div>

      {renderResult()}
    </div>
  );
};

export default ExportCheckPage; 