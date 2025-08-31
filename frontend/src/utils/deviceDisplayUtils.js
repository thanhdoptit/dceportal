/**
 * Utility functions để hiển thị tên device với ưu tiên snapshot data
 */

// Tên device mặc định hiện tại
const CURRENT_DEVICE_NAMES = {
  1: 'Hệ thống phân phối điện UPS',
  2: 'Hệ thống UPS',
  3: 'Hệ thống làm mát',
  4: 'Hệ thống giám sát hình ảnh',
  5: 'Hệ thống kiểm soát truy cập',
  6: 'PCCC',
  7: 'Hệ thống giám sát hạ tầng TTDL',
  8: 'Hệ thống khác'
};

/**
 * Lấy tên device với ưu tiên snapshot
 * @param {number} deviceId - ID của device
 * @param {Array} items - Mảng các item có thể chứa snapshot data (ShiftCheckItem)
 * @param {Array} devices - Mảng devices từ handover (ShiftHandoverDevices)
 * @returns {string} Tên device
 */
export const getDeviceDisplayName = (deviceId, items = [], devices = []) => {
  // 1. Ưu tiên cao nhất: snapshot từ items (ShiftCheckItem)
  if (items && items.length > 0) {
    const itemWithSnapshot = items.find(item => item.deviceId === deviceId);
    if (itemWithSnapshot && itemWithSnapshot.deviceNameSnapshot) {
      return itemWithSnapshot.deviceNameSnapshot;
    }
  }

  // 2. Ưu tiên thứ hai: snapshot từ devices (ShiftHandoverDevices)
  if (devices && devices.length > 0) {
    const deviceWithSnapshot = devices.find(device => device.deviceId === deviceId);
    if (deviceWithSnapshot && deviceWithSnapshot.deviceNameSnapshot) {
      return deviceWithSnapshot.deviceNameSnapshot;
    }
  }

  // 3. Fallback: tên hiện tại
  return CURRENT_DEVICE_NAMES[deviceId] || `Thiết bị ${deviceId}`;
};

/**
 * Lấy thông tin device đầy đủ với ưu tiên snapshot
 * @param {number} deviceId - ID của device
 * @param {Array} items - Mảng các item có thể chứa snapshot data
 * @param {Array} devices - Mảng devices từ handover (nếu có)
 * @returns {Object} Thông tin device
 */
export const getDeviceDisplayInfo = (deviceId, items = [], devices = []) => {
  // Tìm item có snapshot
  const itemWithSnapshot = items?.find(item => item.deviceId === deviceId);
  const deviceWithSnapshot = devices?.find(device => device.deviceId === deviceId);

  if (itemWithSnapshot && itemWithSnapshot.deviceNameSnapshot) {
    return {
      id: deviceId,
      name: itemWithSnapshot.deviceNameSnapshot,
      category: itemWithSnapshot.deviceCategorySnapshot,
      position: itemWithSnapshot.devicePositionSnapshot,
      serialNumber: itemWithSnapshot.deviceSerialNumberSnapshot,
      isSnapshot: true,
      snapshotDate: itemWithSnapshot.createdAt
    };
  }

  if (deviceWithSnapshot && deviceWithSnapshot.deviceNameSnapshot) {
    return {
      id: deviceId,
      name: deviceWithSnapshot.deviceNameSnapshot,
      category: deviceWithSnapshot.deviceCategorySnapshot,
      position: deviceWithSnapshot.devicePositionSnapshot,
      serialNumber: deviceWithSnapshot.deviceSerialNumberSnapshot,
      isSnapshot: true,
      snapshotDate: deviceWithSnapshot.createdAt
    };
  }

  // Fallback về thông tin hiện tại
  return {
    id: deviceId,
    name: CURRENT_DEVICE_NAMES[deviceId] || `Thiết bị ${deviceId}`,
    isSnapshot: false
  };
};

/**
 * Kiểm tra xem device có thay đổi tên không
 * @param {Object} item - Item có snapshot data
 * @param {Object} currentDevice - Device hiện tại
 * @returns {Object} Thông tin thay đổi
 */
export const checkDeviceNameChange = (item, currentDevice) => {
  if (!item || !currentDevice) return { hasChange: false };

  const snapshotName = item.deviceNameSnapshot;
  const currentName = currentDevice.deviceName || CURRENT_DEVICE_NAMES[currentDevice.id];

  if (snapshotName && snapshotName !== currentName) {
    return {
      hasChange: true,
      oldName: snapshotName,
      newName: currentName,
      changeMessage: `Tên thiết bị đã thay đổi từ "${snapshotName}" thành "${currentName}"`
    };
  }

  return { hasChange: false };
};

export { CURRENT_DEVICE_NAMES }; 