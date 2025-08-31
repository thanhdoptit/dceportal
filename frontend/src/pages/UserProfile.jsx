import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Spin,
  message,
  Card,
  Tabs,
  Divider,
  Alert,
  Space,
  Modal,
  Typography
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MailOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';

const { Option } = Select;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

export default function UserProfile() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, updateUserData } = useAuth();
  const [profileForm] = Form.useForm();
  const hasFetched = useRef(false);





  // Xử lý cập nhật thông tin cá nhân
  const handleUpdateProfile = async (values) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
        return;
      }

      // Hiển thị loading khi cập nhật
      const loadingMessage = message.loading('Đang cập nhật thông tin...', 0);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        {
          fullname: values.fullname,
          gender: values.gender,
          dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      loadingMessage();

      if (response.data.success) {
        // Cập nhật thông tin người dùng trong context
        await updateUserData(token);

        // Refresh form với dữ liệu mới
        const updatedData = response.data.user || response.data;
        profileForm.setFieldsValue({
          username: updatedData.username,
          fullname: updatedData.fullname,
          email: updatedData.email,
          dob: updatedData.dob ? moment(updatedData.dob) : null,
          gender: updatedData.gender || undefined,
          role: updatedData.role
        });

        message.success({
          content: response.data.message || 'Cập nhật thông tin thành công!',
          duration: 2
        });
      } else {
        // Hiển thị lỗi nếu cập nhật thất bại
        message.error({
          content: response.data.message || 'Không thể cập nhật thông tin',
          duration: 3
        });
      }

    } catch (error) {
      // Xử lý lỗi khi cập nhật profile
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Không thể cập nhật thông tin';

      message.error({
        content: errorMessage,
        duration: 3
      });
    } finally {
      setSaving(false);
    }
  };


  // Hiển thị thông tin vai trò
  const getRoleDisplay = (role) => {
    const roleMap = {
      'manager': { color: 'blue', text: 'Quản lý' },
      'datacenter': { color: 'green', text: 'DataCenter' },
      'be': { color: 'orange', text: 'Batch Engineer' },
      'admin': { color: 'red', text: 'Admin' },
      'user': { color: 'default', text: 'Người dùng' }
    };
    return roleMap[role] || { color: 'default', text: role };
  };

  // Component hiển thị thông tin user
  const UserInfoCard = () => (
    <Card className="mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-[#003c71] rounded-full flex items-center justify-center">
          <UserOutlined className="text-white text-2xl" />
        </div>
        <div className="flex-1 items-center">
          <Title level={3} className="mb-1">{currentUser.fullname}</Title>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {currentUser.isADUser ? 'AD User' : 'Local User'}
          </div>
        </div>
      </div>
    </Card>
  );

  // Tạo function fetch user data với useCallback
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      // Luôn fetch dữ liệu mới từ server để đảm bảo tính nhất quán
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Lấy user data từ response (có thể là res.data hoặc res.data.user)
      const userData = res.data.user || res.data;
      
      if (userData && userData.id) {
        // Cập nhật context với dữ liệu mới
        if (typeof updateUserData === 'function') {
          await updateUserData(token);
        }

        // Cập nhật form với dữ liệu mới
        const formData = {
          username: userData.username,
          fullname: userData.fullname,
          email: userData.email,
          dob: userData.dob ? moment(userData.dob) : null,
          gender: userData.gender || undefined,
          role: userData.role
        };

        // Đảm bảo form được cập nhật sau khi context đã được cập nhật
        setTimeout(() => {
          profileForm.setFieldsValue(formData);
        }, 100);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
        return;
      }
      message.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  }, [navigate, updateUserData, profileForm]);

  // Lấy thông tin user và đồng bộ form
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchUserData();
    }
  }, [fetchUserData]);

  // Đồng bộ form khi currentUser thay đổi (sau khi fetch xong)
  useEffect(() => {
    if (currentUser && !loading) {
      const formData = {
        username: currentUser.username,
        fullname: currentUser.fullname,
        email: currentUser.email,
        dob: currentUser.dob ? moment(currentUser.dob) : null,
        gender: currentUser.gender || undefined,
        role: currentUser.role
      };
      profileForm.setFieldsValue(formData);
    }
  }, [currentUser, loading, profileForm]);

  // Hiển thị loading khi đang fetch dữ liệu
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">Đang tải thông tin người dùng...</div>
        </div>
      </div>
    );
  }

  // Kiểm tra currentUser sau khi loading xong
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Alert
            message="Không thể tải thông tin người dùng"
            description="Vui lòng thử lại hoặc đăng nhập lại"
            type="error"
            showIcon
            className="max-w-md"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Title level={2} className="text-gray-900 mb-2">
            Quản lý tài khoản cá nhân
          </Title>
          <Text type="secondary">
            Cập nhật thông tin cá nhân và quản lý phiên đăng nhập
          </Text>
        </div>

        {/* Thông tin user */}
        <UserInfoCard />

        {/* Thông báo cho AD User */}
        {currentUser.isADUser && (
          <Alert
            message="Tài khoản Active Directory"
            description="Bạn đang sử dụng tài khoản AD. Thông tin đăng nhập được quản lý bởi hệ thống Active Directory."
            type="info"
            showIcon
            className="mb-6"
          />
        )}
        <Tabs defaultActiveKey="profile" className="bg-white rounded-lg shadow-sm p-2">
          {/* Tab Thông tin cá nhân */}
          <TabPane
            tab={
              <span>
                <UserOutlined /> Thông tin cá nhân
              </span>
            }
            key="profile"
          >
            <div className="p-2">
              <Form
                form={profileForm}
                layout="vertical"
                onFinish={handleUpdateProfile}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tên đăng nhập */}
                  <Form.Item
                    name="username"
                    label={<span className="text-gray-700 font-medium">Tên đăng nhập</span>}
                  >
                    <Input
                      readOnly
                      className="bg-gray-50"
                      prefix={<UserOutlined className="text-gray-400" />}
                    />
                  </Form.Item>

                  {/* Email */}
                  <Form.Item
                    name="email"
                    label={<span className="text-gray-700 font-medium">Email</span>}
                  >
                    <Input
                      readOnly
                      className="bg-gray-50"
                      prefix={<MailOutlined className="text-gray-400" />}
                    />
                  </Form.Item>

                  {/* Họ và tên */}
                  <Form.Item
                    name="fullname"
                    label={<span className="text-gray-700 font-medium">Họ và tên</span>}
                    rules={[
                      { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' },
                      { max: 100, message: 'Họ tên không được quá 100 ký tự' }
                    ]}
                  >
                    <Input
                      className="bg-gray-50"
                      readOnly />
                  </Form.Item>

                  {/* Vai trò */}
                  <Form.Item
                    name="role"
                    label={<span className="text-gray-700 font-medium">Nhóm</span>}
                  >
                    <Input
                      readOnly
                      className="bg-gray-50"
                      value={getRoleDisplay(currentUser.role).text}
                    />
                  </Form.Item>

                  {/* Ngày sinh */}
                  <Form.Item
                    name="dob"
                    label={<span className="text-gray-700 font-medium">Ngày sinh</span>}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value && value.isAfter(moment())) {
                            return Promise.reject('Ngày sinh không thể là tương lai');
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: '100%' }}
                      className="hover:border-[#003c71] focus:border-[#003c71]"
                      placeholder="Chọn ngày sinh"
                      disabledDate={(current) => current && current > moment().endOf('day')}
                    />
                  </Form.Item>

                  {/* Giới tính */}
                  <Form.Item
                    name="gender"
                    label={<span className="text-gray-700 font-medium">Giới tính</span>}
                  >
                    <Select
                      className="hover:border-[#003c71] focus:border-[#003c71]"
                      placeholder="Chọn giới tính"
                    >
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Divider />

                <Form.Item className="flex justify-end mb-0">
                  <Space>
                    <Button
                      onClick={() => navigate(-1)}
                      className="h-10 px-6"
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={saving}
                      className="bg-[#003c71] hover:bg-[#002d54] h-10 px-6"
                    >
                      Cập nhật thông tin
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
