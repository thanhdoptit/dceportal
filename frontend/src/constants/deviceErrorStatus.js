// Constants cho DeviceError status
export const DEVICE_ERROR_STATUS = {
  PENDING: 'Chưa xử lý',
  IN_PROGRESS: 'Đang xử lý',
  RESOLVED: 'Đã xử lý'
};

// Labels hiển thị
export const DEVICE_ERROR_STATUS_LABELS = {
  [DEVICE_ERROR_STATUS.PENDING]: 'Chưa xử lý',
  [DEVICE_ERROR_STATUS.IN_PROGRESS]: 'Đang xử lý',
  [DEVICE_ERROR_STATUS.RESOLVED]: 'Đã xử lý'
};

// Colors cho từng trạng thái
export const DEVICE_ERROR_STATUS_COLORS = {
  [DEVICE_ERROR_STATUS.PENDING]: 'red',
  [DEVICE_ERROR_STATUS.IN_PROGRESS]: 'orange',
  [DEVICE_ERROR_STATUS.RESOLVED]: 'green'
};

// Workflow transitions - quy tắc chuyển trạng thái
export const DEVICE_ERROR_STATUS_TRANSITIONS = {
  [DEVICE_ERROR_STATUS.PENDING]: [DEVICE_ERROR_STATUS.IN_PROGRESS, DEVICE_ERROR_STATUS.RESOLVED],
  [DEVICE_ERROR_STATUS.IN_PROGRESS]: [DEVICE_ERROR_STATUS.RESOLVED],
  [DEVICE_ERROR_STATUS.RESOLVED]: [] // Không thể chuyển từ đã xử lý
};

// Helper functions
export const canTransitionTo = (currentStatus, targetStatus) => {
  return DEVICE_ERROR_STATUS_TRANSITIONS[currentStatus]?.includes(targetStatus) || false;
};

export const getNextAvailableStatuses = (currentStatus) => {
  return DEVICE_ERROR_STATUS_TRANSITIONS[currentStatus] || [];
};

export const isStatusFinal = (status) => {
  return status === DEVICE_ERROR_STATUS.RESOLVED;
};

// Status order cho sorting
export const STATUS_ORDER = {
  [DEVICE_ERROR_STATUS.PENDING]: 1,
  [DEVICE_ERROR_STATUS.IN_PROGRESS]: 2,
  [DEVICE_ERROR_STATUS.RESOLVED]: 3
};

// Options cho Select component
export const DEVICE_ERROR_STATUS_OPTIONS = [
  { value: DEVICE_ERROR_STATUS.PENDING, label: DEVICE_ERROR_STATUS_LABELS[DEVICE_ERROR_STATUS.PENDING] },
  { value: DEVICE_ERROR_STATUS.IN_PROGRESS, label: DEVICE_ERROR_STATUS_LABELS[DEVICE_ERROR_STATUS.IN_PROGRESS] },
  { value: DEVICE_ERROR_STATUS.RESOLVED, label: DEVICE_ERROR_STATUS_LABELS[DEVICE_ERROR_STATUS.RESOLVED] }
];

// Filter options
export const DEVICE_ERROR_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  ...DEVICE_ERROR_STATUS_OPTIONS
];
