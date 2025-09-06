import { useCallback, useEffect, useState } from 'react';
import deviceService from '../services/deviceService';

/**
 * Hook để quản lý device names
 */
export const useDeviceNames = () => {
  const [deviceNames, setDeviceNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch device names
  const fetchDeviceNames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await deviceService.getDeviceNames();
      setDeviceNames(names);
    } catch (err) {
      console.error('Lỗi khi lấy device names:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh device names
  const refreshDeviceNames = useCallback(async () => {
    deviceService.clearCache();
    await fetchDeviceNames();
  }, [fetchDeviceNames]);

  // Lấy tên device theo ID
  const getDeviceName = useCallback(
    deviceId => {
      return deviceNames[deviceId]?.name || `Thiết bị ${deviceId}`;
    },
    [deviceNames]
  );

  // Lấy thông tin device theo ID
  const getDeviceInfo = useCallback(
    deviceId => {
      return deviceNames[deviceId] || { id: deviceId, name: `Thiết bị ${deviceId}` };
    },
    [deviceNames]
  );

  // Lấy danh sách device dạng array
  const getDeviceList = useCallback(() => {
    return Object.values(deviceNames).sort((a, b) => a.id - b.id);
  }, [deviceNames]);

  // Fetch device names khi component mount
  useEffect(() => {
    fetchDeviceNames();
  }, [fetchDeviceNames]);

  return {
    deviceNames,
    loading,
    error,
    fetchDeviceNames,
    refreshDeviceNames,
    getDeviceName,
    getDeviceInfo,
    getDeviceList,
  };
};

/**
 * Hook để lấy tên device với ưu tiên snapshot
 * @param {number} deviceId - ID của device
 * @param {Array} items - Mảng ShiftCheckItem có snapshot data
 * @param {Array} devices - Mảng ShiftHandoverDevices có snapshot data
 */
export const useDeviceDisplayName = (deviceId, items = [], devices = []) => {
  const { deviceNames, loading, error } = useDeviceNames();

  // Ưu tiên snapshot từ items (ShiftCheckItem)
  if (items && items.length > 0) {
    const itemWithSnapshot = items.find(item => item.deviceId === deviceId);
    if (itemWithSnapshot && itemWithSnapshot.deviceNameSnapshot) {
      return {
        name: itemWithSnapshot.deviceNameSnapshot,
        isSnapshot: true,
        loading: false,
        error: null,
      };
    }
  }

  // Ưu tiên snapshot từ devices (ShiftHandoverDevices)
  if (devices && devices.length > 0) {
    const deviceWithSnapshot = devices.find(device => device.deviceId === deviceId);
    if (deviceWithSnapshot && deviceWithSnapshot.deviceNameSnapshot) {
      return {
        name: deviceWithSnapshot.deviceNameSnapshot,
        isSnapshot: true,
        loading: false,
        error: null,
      };
    }
  }

  // Fallback về tên hiện tại từ API
  return {
    name: deviceNames[deviceId]?.name || `Thiết bị ${deviceId}`,
    isSnapshot: false,
    loading,
    error,
  };
};
