import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Input, Button, Space, Radio, Row, Col, Checkbox, message } from 'antd';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const DeviceCheckFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentShift, setCurrentShift] = useState(null);
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchDeviceCheck();
    } else {
      fetchCurrentShift();
    }
  }, [id]);

  const fetchDeviceCheck = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/shifts/${id}/device-check`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setCurrentShift(response.data.workShift);
        form.setFieldsValue(response.data.deviceCheckForm);
      }
    } catch (error) {
      console.error('Error fetching device check:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentShift = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/shifts/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.shift) {
        setCurrentShift(response.data.shift);
      }
    } catch (error) {
      console.error('Error fetching current shift:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const endpoint = isEdit
        ? `${API_URL}/api/shifts/${id}/device-check`
        : `${API_URL}/api/shifts/device-check`;

      const response = await axios.post(endpoint, {
        workShiftId: currentShift.id,
        deviceCheckForm: values
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        message.success('Lưu thông tin kiểm tra thiết bị thành công');
        navigate('/dc/device-check');
      }
    } catch (error) {
      console.error('Error saving device check:', error);
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    powerDistribution: {
      status: 'normal',
      error: {
        deviceName: '',
        serialNumber: '',
        location: '',
        description: '',
        currentWork: '',
        nextActions: ''
      }
    },
    ups: {
      status: 'normal',
      error: {
        deviceName: '',
        serialNumber: '',
        location: '',
        description: '',
        currentWork: '',
        nextActions: ''
      }
    },
    cooling: {
      status: 'normal',
      error: {
        deviceName: '',
        serialNumber: '',
        location: '',
        description: '',
        currentWork: '',
        nextActions: ''
      }
    },
    surveillance: {
      status: 'normal',
      error: {
        deviceName: '',
        serialNumber: '',
        location: '',
        description: '',
        currentWork: '',
        nextActions: ''
      }
    },
    accessControl: {
      status: 'normal',
      error: {
        deviceName: '',
        serialNumber: '',
        location: '',
        description: '',
        currentWork: '',
        nextActions: ''
      }
    },
    fireSystem: {
      status: 'normal',
      error: {
        deviceName: '',
        serialNumber: '',
        location: '',
        description: '',
        currentWork: '',
        nextActions: ''
      }
    },
    dataCenter: {
      status: 'normal',
      error: {
        deviceName: '',
        serialNumber: '',
        location: '',
        description: '',
        currentWork: '',
        nextActions: ''
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (!currentShift) {
    return <div className="text-center py-4">Không tìm thấy thông tin ca làm việc</div>;
  }

  return (
    <div className="p-6">
      <Card title={`Kiểm tra thiết bị - Ca ${currentShift.code}`}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
        >
          {/* Hệ thống phân phối điện UPS */}
          <Card title="1. Hệ thống phân phối điện UPS" className="mb-4">
            <Form.Item name={['powerDistribution', 'status']}>
              <Radio.Group>
                <Radio value="normal">Hoạt động bình thường</Radio>
                <Radio value="error">Có lỗi</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.powerDistribution?.status !== currentValues.powerDistribution?.status
              }
            >
              {({ getFieldValue }) =>
                getFieldValue(['powerDistribution', 'status']) === 'error' && (
                  <div className="bg-gray-50 p-4 rounded">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Tên thiết bị"
                          name={['powerDistribution', 'error', 'deviceName']}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Số serial"
                          name={['powerDistribution', 'error', 'serialNumber']}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      label="Vị trí"
                      name={['powerDistribution', 'error', 'location']}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Mô tả lỗi"
                      name={['powerDistribution', 'error', 'description']}
                    >
                      <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                      label="Công việc đang xử lý"
                      name={['powerDistribution', 'error', 'currentWork']}
                    >
                      <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                      label="Đề xuất xử lý tiếp theo"
                      name={['powerDistribution', 'error', 'nextActions']}
                    >
                      <Input.TextArea rows={3} />
                    </Form.Item>
                  </div>
                )
              }
            </Form.Item>
          </Card>

          {/* Các hệ thống khác tương tự */}
          {/* ... */}

          <div className="flex justify-end gap-2">
            <Button onClick={() => navigate('/dc/device-check')}>
              Quay lại
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default DeviceCheckFormPage;
