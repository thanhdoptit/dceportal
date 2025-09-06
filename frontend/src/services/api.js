import axios from '../utils/axios';

const api = {
  // Auth
  login: data => axios.post('/auth/login', data),
  refresh: () => axios.post('/auth/refresh'),
  register: data => axios.post('/auth/register', data),
  logout: () => axios.post('/auth/logout'),
  getProfile: () => axios.get('/auth/profile'),

  // Users
  getUsers: params => axios.get('/api/users', { params }),
  getUser: id => axios.get(`/api/users/${id}`),
  createUser: data => axios.post('/api/users', data),
  updateUser: (id, data) => axios.put(`/api/users/${id}`, data),
  deleteUser: id => axios.delete(`/api/users/${id}`),

  // Shifts
  getShifts: params => axios.get('/shifts', { params }),
  getShift: id => axios.get(`/shifts/${id}`),
  createShift: data => axios.post('/shifts', data),
  updateShift: (id, data) => axios.put(`/shifts/${id}`, data),
  deleteShift: id => axios.delete(`/shifts/${id}`),

  // Shift Checks
  getShiftChecks: params => axios.get('/shift-checks', { params }),
  getShiftCheck: id => axios.get(`/shift-checks/${id}`),
  createShiftCheck: data => axios.post('/shift-checks', data),
  updateShiftCheck: (id, data) => axios.put(`/shift-checks/${id}`, data),
  deleteShiftCheck: id => axios.delete(`/shift-checks/${id}`),

  // Common CRUD operations
  get: (url, params) => axios.get(url, { params }),
  post: (url, data) => axios.post(url, data),
  put: (url, data) => axios.put(url, data),
  delete: url => axios.delete(url),
};

export default api;
