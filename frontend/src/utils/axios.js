import axios from 'axios';

// Cấu hình chung cho axios global và instance (để các file dùng axios trực tiếp vẫn hưởng interceptor)
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.timeout = 60000;
axios.defaults.withCredentials = true; // gửi cookie HttpOnly (refresh)
axios.defaults.headers['Content-Type'] = 'application/json';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Bộ nhớ tạm cho access token để tránh đọc localStorage nhiều lần
let accessToken = localStorage.getItem('token');
export const setAccessToken = token => {
  accessToken = token;
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
};

// Tránh refresh song song
let isRefreshing = false;
let pendingQueue = [];
const enqueue = () => new Promise(resolve => pendingQueue.push(resolve));
const resolveQueue = token => {
  pendingQueue.forEach(res => res(token));
  pendingQueue = [];
};

const attachRequestInterceptor = client =>
  client.interceptors.request.use(
    config => {
      const token = accessToken || localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      // Không set Content-Type cho FormData, để browser tự set
      if (config.data instanceof FormData) delete config.headers['Content-Type'];
      return config;
    },
    error => Promise.reject(error)
  );

const refreshAccessToken = async () => {
  // Gọi endpoint refresh, cookie HttpOnly sẽ được gửi kèm do withCredentials=true
  const res = await instance.post('/api/auth/refresh');
  return res.data.token;
};

const attachResponseInterceptor = client =>
  client.interceptors.response.use(
    response => response,
    async error => {
      const original = error.config;
      const status = error.response?.status;
      const isRefreshCall = original?.url?.includes('/api/auth/refresh');
      if (status === 401 && !original?._retry && !isRefreshCall) {
        if (isRefreshing) {
          const newToken = await enqueue();
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
            original._retry = true;
            return client(original);
          }
          return Promise.reject(error);
        }
        original._retry = true;
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          setAccessToken(newToken);
          resolveQueue(newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return client(original);
        } catch (e) {
          resolveQueue(null);
          setAccessToken(null);
          // Chuyển hướng login
          window.location.href = '/login';
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );

// Gắn interceptor cho cả instance và axios global
attachRequestInterceptor(instance);
attachResponseInterceptor(instance);
attachRequestInterceptor(axios);
attachResponseInterceptor(axios);

export default instance;
