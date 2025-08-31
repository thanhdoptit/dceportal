import axios from '../utils/axios';

// Lấy danh sách tất cả locations
export const fetchAllLocations = async () => {
  try {
    const response = await axios.get('/api/locations');
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw new Error('Không thể tải danh sách địa điểm');
  }
};

// Lấy location theo ID
export const fetchLocationById = async (locationId) => {
  try {
    const response = await axios.get(`/api/locations/${locationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching location by ID:', error);
    throw new Error('Không thể tải thông tin địa điểm');
  }
};

// Tạo location mới
export const createLocation = async (locationData) => {
  try {
    const response = await axios.post('/api/locations', locationData);
    return response.data;
  } catch (error) {
    console.error('Error creating location:', error);
    throw new Error('Không thể tạo địa điểm mới');
  }
};

// Cập nhật location
export const updateLocation = async (locationId, locationData) => {
  try {
    const response = await axios.put(`/api/locations/${locationId}`, locationData);
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw new Error('Không thể cập nhật địa điểm');
  }
};

// Xóa location
export const deleteLocation = async (locationId) => {
  try {
    const response = await axios.delete(`/api/locations/${locationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting location:', error);
    throw new Error('Không thể xóa địa điểm');
  }
};

// Lấy locations theo trạng thái active
export const fetchActiveLocations = async () => {
  try {
    const response = await axios.get('/api/locations?isActive=true');
    return response.data;
  } catch (error) {
    console.error('Error fetching active locations:', error);
    throw new Error('Không thể tải danh sách địa điểm hoạt động');
  }
};

// Tìm kiếm locations theo tên
export const searchLocations = async (searchTerm) => {
  try {
    const response = await axios.get(`/api/locations?search=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching locations:', error);
    throw new Error('Không thể tìm kiếm địa điểm');
  }
}; 