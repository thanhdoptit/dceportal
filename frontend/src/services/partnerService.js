import axios from '../utils/axios.js';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token expired');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const getAllPartners = async () => {
  const headers = getAuthHeader();
  const res = await axios.get('/api/partners', { headers });
  return res.data;
};

export const getPartnerById = async (id) => {
  const headers = getAuthHeader();
  const res = await axios.get(`/api/partners/${id}`, { headers });
  return res.data;
};

export const fetchPartners = async ({ page = 1, limit = 10, search, donVi, fromDate, toDate } = {}) => {
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  const params = {
    page,
    limit,
    timestamp: Date.now()
  };

  if (search) params.search = search;
  if (donVi) params.donVi = donVi;
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;

  const res = await axios.get('/api/partners', {
    params,
    headers
  });
  return res.data;
};

export const fetchDonViList = async () => {
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  const res = await axios.get('/api/partners/donvi', { headers });
  return res.data;
};

export const createPartner = async (partnerData) => {
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  const res = await axios.post('/api/partners', partnerData, { headers });
  return res.data;
};

export const updatePartner = async (id, partnerData) => {
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  const res = await axios.put(`/api/partners/${id}`, partnerData, { headers });
  return res.data;
};

export const deletePartner = async (id) => {
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  const res = await axios.delete(`/api/partners/${id}`, { headers });
  return res.data;
};

export const searchPartners = async (keyword) => {
  const headers = getAuthHeader();
  const res = await axios.get('/api/partners/search', {
    params: { keyword },
    headers
  });
  return res.data;
};

export const getPartnersByUnit = async (unitId) => {
  const headers = getAuthHeader();
  const res = await axios.get(`/api/partners/unit/${unitId}`, { headers });
  return res.data;
};

export const filterPartners = async (filters) => {
  const headers = getAuthHeader();
  const res = await axios.get('/api/partners/filter', {
    params: filters,
    headers
  });
  return res.data;
};

// Kiểm tra trùng lặp partner
export const checkDuplicatePartner = async (fullname, donVi, cccd = '') => {
  const headers = getAuthHeader();
  const res = await axios.get('/api/partners/check-duplicate', {
    params: { fullname, donVi, cccd },
    headers
  });
  return res.data;
};

export const fetchPartnerTasks = async (partnerId, { page = 1, limit = 10, status } = {}) => {
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };

  const params = {
    page,
    limit,
    timestamp: Date.now()
  };

  if (status) params.status = status;

  const res = await axios.get(`/api/partners/${partnerId}/tasks`, {
    params,
    headers
  });
  return res.data;
};
