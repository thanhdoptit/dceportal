import axios from '../utils/axios';

// Bàn giao ca
export const createHandover = async (data) => {
  try {
    const response = await axios.post('/shifts/handover', data);
    return response.data;
  } catch (error) {
    console.error('Error creating handover:', error);
    throw error;
  }
};

export const getHandoverDetails = async (handoverId) => {
  try {
    const response = await axios.get(`/api/shifts/handover/${handoverId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching handover details:', error);
    throw error;
  }
};

export const confirmHandover = async (handoverId, data) => {
  try {
    const response = await axios.put(`/api/shifts/handover/${handoverId}/confirm`, data);
    return response.data;
  } catch (error) {
    console.error('Error confirming handover:', error);
    throw error;
  }
};

export const rejectHandover = async (handoverId, data) => {
  try {
    const response = await axios.put(`/api/shifts/handover/${handoverId}/reject`, data);
    return response.data;
  } catch (error) {
    console.error('Error rejecting handover:', error);
    throw error;
  }
};

export const getHandoversByStatus = async (params) => {
  try {
    const response = await axios.get('/shifts/handover', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching handovers by status:', error);
    throw error;
  }
};

export const getHandoverHistory = async (params) => {
  try {
    const response = await axios.get('/shifts/handover/history', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching handover history:', error);
    throw error;
  }
};

export const updateHandover = async (handoverId, data) => {
  try {
    const response = await axios.put(`/api/shifts/handover/${handoverId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating handover:', error);
    throw error;
  }
};

export const deleteHandover = async (handoverId) => {
  try {
    const response = await axios.delete(`/api/shifts/handover/${handoverId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting handover:', error);
    throw error;
  }
};

export const getHandoverStats = async (params) => {
  try {
    const response = await axios.get('/shifts/handover/stats', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching handover stats:', error);
    throw error;
  }
};

export const getHandoversByShift = async (shiftId) => {
  try {
    const response = await axios.get(`/shifts/${shiftId}/handovers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching handovers by shift:', error);
    throw error;
  }
};

export const getHandoversByDate = async (date) => {
  try {
    const response = await axios.get('/shifts/handover/by-date', {
      params: { date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching handovers by date:', error);
    throw error;
  }
};

// Lấy danh sách phiên làm việc
export const getWorkSessions = async (params = {}) => {
  try {
    const response = await axios.get('/shifts/work-sessions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching work sessions:', error);
    throw error;
  }
}; 

export const getCurrentShift = async () => {
  try {
    const response = await axios.get('/shifts/current');
    return response.data;
  } catch (error) {
    console.error('Error getting current shift:', error);
    throw error;
  }
};

export const getNextShift = async (currentShiftId) => {
  try {
    const response = await axios.get(`/shifts/${currentShiftId}/next`);
    return response.data;
  } catch (error) {
    console.error('Error getting next shift:', error);
    throw error;
  }
};

// Temp files management
export const uploadTempHandoverFiles = async (formData) => {
  try {
    const response = await axios.post('/api/shifts/handover/temp/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading temp files:', error);
    throw error;
  }
};

export const commitTempFilesToHandover = async (handoverId, sessionId) => {
  try {
    const response = await axios.post('/api/shifts/handover/temp/commit', {
      handoverId,
      sessionId
    });
    return response.data;
  } catch (error) {
    console.error('Error committing temp files:', error);
    throw error;
  }
};

export const cleanupTempFiles = async (sessionId) => {
  try {
    const response = await axios.delete(`/api/shifts/handover/temp/cleanup/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
    throw error;
  }
};

export const deleteTempFile = async (sessionId, filename) => {
  try {
    const response = await axios.delete(`/api/shifts/handover/temp/delete/${sessionId}/${filename}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting temp file:', error);
    throw error;
  }
};