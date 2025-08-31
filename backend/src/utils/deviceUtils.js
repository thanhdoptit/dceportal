/**
 * Utility functions để xử lý thông tin device
 */

/**
 * Lấy thông tin device để hiển thị, ưu tiên snapshot nếu có
 * @param {Object} shiftCheckItem - Bản ghi ShiftCheckItem
 * @param {Object} device - Thông tin device hiện tại (optional)
 * @returns {Object} Thông tin device để hiển thị
 */
export const getDeviceDisplayInfo = (shiftCheckItem, device = null) => {
  // Ưu tiên sử dụng snapshot nếu có
  if (shiftCheckItem.deviceNameSnapshot) {
    return {
      id: shiftCheckItem.deviceId,
      deviceName: shiftCheckItem.deviceNameSnapshot,
      category: shiftCheckItem.deviceCategorySnapshot,
      position: shiftCheckItem.devicePositionSnapshot,
      serialNumber: shiftCheckItem.deviceSerialNumberSnapshot,
      isSnapshot: true, // Đánh dấu đây là dữ liệu snapshot
      snapshotDate: shiftCheckItem.createdAt
    };
  }
  
  // Fallback về thông tin device hiện tại
  if (device) {
    return {
      id: device.id,
      deviceName: device.deviceName,
      category: device.category,
      position: device.position,
      serialNumber: device.serialNumber,
      isSnapshot: false,
      snapshotDate: null
    };
  }
  
  // Trường hợp không có thông tin
  return {
    id: shiftCheckItem.deviceId,
    deviceName: 'Thiết bị không xác định',
    category: 'Không xác định',
    position: 'Không xác định',
    serialNumber: null,
    isSnapshot: false,
    snapshotDate: null
  };
};

/**
 * So sánh thông tin device snapshot với thông tin hiện tại
 * @param {Object} shiftCheckItem - Bản ghi ShiftCheckItem có snapshot
 * @param {Object} currentDevice - Thông tin device hiện tại
 * @returns {Object} Kết quả so sánh
 */
export const compareDeviceInfo = (shiftCheckItem, currentDevice) => {
  if (!shiftCheckItem.deviceNameSnapshot || !currentDevice) {
    return {
      hasChanges: false,
      changes: []
    };
  }
  
  const changes = [];
  
  // So sánh tên thiết bị
  if (shiftCheckItem.deviceNameSnapshot !== currentDevice.deviceName) {
    changes.push({
      field: 'deviceName',
      oldValue: shiftCheckItem.deviceNameSnapshot,
      newValue: currentDevice.deviceName,
      label: 'Tên thiết bị'
    });
  }
  
  // So sánh danh mục
  if (shiftCheckItem.deviceCategorySnapshot !== currentDevice.category) {
    changes.push({
      field: 'category',
      oldValue: shiftCheckItem.deviceCategorySnapshot,
      newValue: currentDevice.category,
      label: 'Danh mục'
    });
  }
  
  // So sánh vị trí
  if (shiftCheckItem.devicePositionSnapshot !== currentDevice.position) {
    changes.push({
      field: 'position',
      oldValue: shiftCheckItem.devicePositionSnapshot,
      newValue: currentDevice.position,
      label: 'Vị trí'
    });
  }
  
  // So sánh serial number
  if (shiftCheckItem.deviceSerialNumberSnapshot !== currentDevice.serialNumber) {
    changes.push({
      field: 'serialNumber',
      oldValue: shiftCheckItem.deviceSerialNumberSnapshot,
      newValue: currentDevice.serialNumber,
      label: 'Số serial'
    });
  }
  
  return {
    hasChanges: changes.length > 0,
    changes
  };
};

/**
 * Tạo message thông báo về thay đổi device
 * @param {Array} changes - Danh sách thay đổi
 * @returns {string} Message thông báo
 */
export const createDeviceChangeMessage = (changes) => {
  if (!changes || changes.length === 0) {
    return null;
  }
  
  const changeMessages = changes.map(change => 
    `${change.label}: "${change.oldValue}" → "${change.newValue}"`
  );
  
  return `Thiết bị đã được cập nhật: ${changeMessages.join(', ')}`;
};

/**
 * Lấy danh sách device IDs từ ShiftCheckItems
 * @param {Array} shiftCheckItems - Danh sách ShiftCheckItem
 * @returns {Array} Danh sách device IDs
 */
export const extractDeviceIds = (shiftCheckItems) => {
  if (!Array.isArray(shiftCheckItems)) {
    return [];
  }
  
  return [...new Set(shiftCheckItems.map(item => item.deviceId))];
};

/**
 * Tạo map device cho việc so sánh
 * @param {Array} devices - Danh sách device
 * @returns {Object} Map device ID -> device object
 */
export const createDeviceMap = (devices) => {
  if (!Array.isArray(devices)) {
    return {};
  }
  
  return devices.reduce((map, device) => {
    map[device.id] = device;
    return map;
  }, {});
}; 