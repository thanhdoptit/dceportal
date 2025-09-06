import axios from '../utils/axios';

/**
 * Service quản lý device names
 */
class DeviceService {
  constructor() {
    this.deviceNamesCache = null;
    this.lastFetchTime = null;
    this.cacheExpiry = 5 * 60 * 1000; // 5 phút
  }

  /**
   * Lấy danh sách tên device từ API
   */
  async fetchDeviceNames() {
    try {
      const response = await axios.get('/api/devices/names');

      if (response.data.success) {
        this.deviceNamesCache = response.data.data;
        this.lastFetchTime = Date.now();
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Không thể lấy danh sách tên device');
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tên device:', error);
      throw error;
    }
  }

  /**
   * Lấy tên device với cache
   */
  async getDeviceNames() {
    // Kiểm tra cache có hợp lệ không
    if (
      this.deviceNamesCache &&
      this.lastFetchTime &&
      Date.now() - this.lastFetchTime < this.cacheExpiry
    ) {
      return this.deviceNamesCache;
    }

    // Cache hết hạn hoặc chưa có, fetch lại
    return await this.fetchDeviceNames();
  }

  /**
   * Lấy tên device theo ID
   */
  async getDeviceName(deviceId) {
    const deviceNames = await this.getDeviceNames();
    return deviceNames[deviceId]?.name || `Thiết bị ${deviceId}`;
  }

  /**
   * Lấy thông tin device theo ID
   */
  async getDeviceInfo(deviceId) {
    const deviceNames = await this.getDeviceNames();
    return deviceNames[deviceId] || { id: deviceId, name: `Thiết bị ${deviceId}` };
  }

  /**
   * Lấy danh sách device dạng array
   */
  async getDeviceList() {
    const deviceNames = await this.getDeviceNames();
    return Object.values(deviceNames).sort((a, b) => a.id - b.id);
  }

  /**
   * Xóa cache để force refresh
   */
  clearCache() {
    this.deviceNamesCache = null;
    this.lastFetchTime = null;
  }

  /**
   * Kiểm tra xem cache có hợp lệ không
   */
  isCacheValid() {
    return (
      this.deviceNamesCache &&
      this.lastFetchTime &&
      Date.now() - this.lastFetchTime < this.cacheExpiry
    );
  }
}

// Export singleton instance
export const deviceService = new DeviceService();
export default deviceService;
