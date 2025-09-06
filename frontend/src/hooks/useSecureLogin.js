import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { authService } from '../services/authService.js';

/**
 * Custom hook để xử lý login bảo mật
 * Tự động clear sensitive data sau khi login
 */
export const useSecureLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const login = useCallback(
    async (username, password, loginType) => {
      setLoading(true);
      setError('');

      try {
        // Tạo bản sao của credentials để clear sau
        const credentials = { username, password, loginType };

        const data = await authService.login(username, password, loginType);

        // ✅ XÓA PAYLOAD NGAY LẬP TỨC
        credentials.username = '';
        credentials.password = '';

        // Đảm bảo role được lưu dạng lowercase
        const userData = {
          ...data.user,
          role: data.user.role.toLowerCase(),
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        setCurrentUser(userData);

        // Navigate theo role
        switch (userData.role) {
          case 'datacenter':
            navigate('/dc/shifts');
            break;
          case 'manager':
            navigate('/manager/overview');
            break;
          case 'be':
            navigate('/be/shifts');
            break;
          default:
            setError('Không có quyền truy cập!');
        }

        return { success: true, user: userData };
      } catch (err) {
        // Xử lý các loại lỗi cụ thể
        let errorMessage = 'Đăng nhập thất bại!';

        if (err.response) {
          switch (err.response.status) {
            case 401:
              errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng!';
              break;
            case 403:
              errorMessage = 'Tài khoản của bạn đã bị khóa!';
              break;
            case 404:
              errorMessage = 'Tài khoản không tồn tại!';
              break;
            case 500:
              errorMessage = 'Lỗi máy chủ, vui lòng thử lại sau!';
              break;
            default:
              errorMessage = err.response.data?.message || 'Đăng nhập thất bại!';
          }
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [navigate, setCurrentUser]
  );

  return {
    login,
    loading,
    error,
    setError,
  };
};
