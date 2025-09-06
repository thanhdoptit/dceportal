export const STATUS_COLORS = {
  waiting: 'gold',
  pending: 'purple',
  in_progress: 'blue',
  completed: 'green',
  cancelled: 'red',
};

export const STATUS_LABELS = {
  waiting: 'Chờ xác nhận',
  pending: 'Tạm dừng',
  in_progress: 'Đang thực hiện',
  completed: 'Đã kết thúc',
  cancelled: 'Đã hủy',
};

export const STATUS_ORDER = {
  waiting: 1,
  pending: 2,
  in_progress: 3,
  completed: 4,
  cancelled: 5,
};

// Add after STATUS_LABELS definition
export const getStatusText = status => {
  return STATUS_LABELS[status] || status;
};

// Lưu ý: LOCATIONS đã được chuyển sang sử dụng API
// Tham khảo: /api/locations endpoint
