import axios, { setAccessToken } from '../utils/axios';

export const authService = {
  login: async (username, password, loginType) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
        loginType
      });

      const data = response.data;
      if (data.token) setAccessToken(data.token);
      // if (data.csrfToken) { // TẠM TẮT
      //   localStorage.setItem('csrfToken', data.csrfToken);
      // }
      return data; // { token, user }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  },
  
  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      // bỏ qua lỗi logout
    }
    setAccessToken(null);
  },
  
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await axios.get('/api/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
};
