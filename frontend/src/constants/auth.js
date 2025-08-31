// Constants cho authentication
export const LOGIN_TYPES = [
  { value: 'ad', label: 'AD' },
  { value: 'local', label: 'Nội bộ' }
];

export const ROLE_ROUTES = {
  datacenter: '/dc/shifts',
  manager: '/manager/overview',
  be: '/be/shifts'
};

export const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  timeWindow: 60000 // 1 phút
};

export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Đăng nhập thất bại!',
  INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không đúng!',
  ACCOUNT_LOCKED: 'Tài khoản của bạn đã bị khóa!',
  ACCOUNT_NOT_FOUND: 'Tài khoản không tồn tại!',
  SERVER_ERROR: 'Lỗi máy chủ, vui lòng thử lại sau!',
  NO_ACCESS: 'Không có quyền truy cập!',
  RATE_LIMIT_EXCEEDED: 'Quá nhiều lần thử đăng nhập! Vui lòng thử lại sau 1 phút.',
  ACCOUNT_TEMPORARILY_LOCKED: 'Tài khoản tạm thời bị khóa do quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 1 phút.'
}; 