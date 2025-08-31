import axios from '../utils/axios';

// Hàm lấy token giống taskService.js
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`
  };
};

export const fetchAllTapes = async (params) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');
  
  try {
    const res = await axios.get('/api/tapes', { params, headers });
    return res.data;
  } catch (error) {
    console.error('Error fetching tapes:', error);
    throw error;
  }
};

export const getTapeById = async (id) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');
  
  try {
    const res = await axios.get(`/api/tapes/${id}`, { headers });
    return res.data;
  } catch (error) {
    console.error('Error fetching tape by ID:', error);
    throw error;
  }
};

export const createTape = async (data) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');
  
  try {
    const res = await axios.post('/api/tapes', data, { headers });
    return res.data;
  } catch (error) {
    console.error('Error creating tape:', error);
    throw error;
  }
};

export const updateTape = async (id, data) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');
  
  try {
    const res = await axios.put(`/api/tapes/${id}`, data, { headers });
    return res.data;
  } catch (error) {
    console.error('Error updating tape:', error);
    throw error;
  }
};

export const deleteTape = async (id) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');
  
  try {
    const res = await axios.delete(`/api/tapes/${id}`, { headers });
    return res.data;
  } catch (error) {
    console.error('Error deleting tape:', error);
    throw error;
  }
};

// Hàm kiểm tra barcode đã tồn tại chưa
export const checkBarcodeExists = async (barcode) => {
  if (!barcode) return false;
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');
  
  try {
    const res = await axios.get('/api/tapes/check-barcode', {
      params: { barcode },
      headers
    });
    return res.data.exists;
  } catch (error) {
    console.error('Error checking barcode:', error);
    throw error;
  }
}; 