import axios from '../utils/axios';

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchAllTasks = async ({
  page = 1,
  limit = 15,
  status,
  location,
  fromDate,
  toDate,
  dateField,
  search,
} = {}) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  // Tạo object params với tất cả các tham số
  const params = {
    page,
    pageSize: limit,
    timestamp: Date.now(),
  };

  // Thêm các tham số filter nếu có
  if (status) params.status = status;
  if (location) params.location = location; // location sẽ chứa tên địa điểm
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;
  if (dateField) params.dateField = dateField;
  if (search && search.trim()) params.search = search.trim();

  try {
    const res = await axios.get('/api/tasks', {
      params,
      headers,
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const fetchTaskDetail = async taskId => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  try {
    const [taskRes, historyRes] = await Promise.all([
      axios.get(`/api/tasks/${taskId}`, { headers }),
      axios.get(`/api/tasks/${taskId}/history`, { headers }),
    ]);

    return {
      ...taskRes.data,
      history: historyRes.data.history || [],
    };
  } catch (error) {
    console.error('Error fetching task detail:', error);
    throw error;
  }
};

export const lockTask = async taskId => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  try {
    return await axios.post(`/api/tasks/${taskId}/lock`, {}, { headers });
  } catch (error) {
    console.error('Error locking task:', error);
    throw error;
  }
};

export const unlockTask = async taskId => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  try {
    return await axios.delete(`/api/tasks/${taskId}/lock`, { headers });
  } catch (error) {
    console.error('Error unlocking task:', error);
    throw error;
  }
};

export const updateTaskStatus = async ({ taskId, newStatus, reason, userId, system = false }) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  try {
    return await axios.put(
      `/api/tasks/${taskId}/status`,
      {
        status: newStatus,
        isSystemChange: system,
        changeReason: reason,
        completedBy: userId,
        completedAt: new Date(),
      },
      { headers }
    );
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

export const deleteTask = async taskId => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  try {
    return await axios.delete(`/api/tasks/${taskId}`, { headers });
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const createTask = async formData => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  // Xử lý nhân sự trước khi gửi
  const staff = formData.get('staff');
  if (staff) {
    try {
      const staffArray = JSON.parse(staff);
      formData.set('staff', JSON.stringify(staffArray));
    } catch (e) {
      console.error('Invalid staff data:', e);
    }
  }

  try {
    return await axios.post('/api/tasks', formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, formData) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  // Xử lý nhân sự trước khi gửi
  const staff = formData.get('staff');
  if (staff) {
    try {
      const staffArray = JSON.parse(staff);
      formData.set('staff', JSON.stringify(staffArray));
    } catch (e) {
      console.error('Invalid staff data:', e);
    }
  }

  try {
    return await axios.put(`/api/tasks/${taskId}`, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Thêm các hàm xử lý nhân sự task
export const addTaskStaff = async (taskId, staffData) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  try {
    return await axios.post(`/api/tasks/${taskId}/staff`, { staffData }, { headers });
  } catch (error) {
    console.error('Error adding task staff:', error);
    throw error;
  }
};

export const removeTaskStaff = async (taskId, staffId, staffType) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  try {
    return await axios.delete(`/api/tasks/${taskId}/staff`, {
      params: { staffId, staffType },
      headers,
    });
  } catch (error) {
    console.error('Error removing task staff:', error);
    throw error;
  }
};

export const updateTaskStaff = async (taskId, staffId, staffType, data) => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  try {
    return await axios.put(
      `/api/tasks/${taskId}/staff`,
      {
        staffId,
        staffType,
        ...data,
      },
      { headers }
    );
  } catch (error) {
    console.error('Error updating task staff:', error);
    throw error;
  }
};

export const getTaskStaff = async taskId => {
  const headers = getAuthHeader();
  if (!headers) throw new Error('Token expired');

  try {
    const res = await axios.get(`/api/tasks/${taskId}/staff`, { headers });
    return res.data;
  } catch (error) {
    console.error('Error getting task staff:', error);
    throw error;
  }
};
