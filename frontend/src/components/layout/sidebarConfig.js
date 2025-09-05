// Cấu hình sidebar cho từng page
export const SIDEBAR_CONFIG = {
  // Manager pages
  '/manager/overview': { autoCollapse: false, defaultCollapsed: false },
  '/manager/shifts': { autoCollapse: false, defaultCollapsed: false },
  '/manager/handovers': { autoCollapse: false, defaultCollapsed: false },
  '/manager/tasks': { autoCollapse: false, defaultCollapsed: false },
  '/manager/devices': { autoCollapse: false, defaultCollapsed: false },
  '/manager/tape': { autoCollapse: false, defaultCollapsed: false },
  '/manager/backup-management': { autoCollapse: false, defaultCollapsed: false },
  '/manager/partners': { autoCollapse: false, defaultCollapsed: false },
  '/manager/users': { autoCollapse: false, defaultCollapsed: false },
  '/manager/settings': { autoCollapse: false, defaultCollapsed: false },
  
  // Datacenter pages
  '/dc/shifts': { autoCollapse: false, defaultCollapsed: false },
  '/dc/tasks': { autoCollapse: false, defaultCollapsed: false },
  '/dc/handovers': { autoCollapse: false, defaultCollapsed: false },
  '/dc/faq': { autoCollapse: false, defaultCollapsed: false },
  '/dc/cooling-system': { autoCollapse: true, defaultCollapsed: true }, // Tự động thu gọn cho cooling system
  '/dc/cooling-system-vancanh': { autoCollapse: true, defaultCollapsed: true }, // Tự động thu gọn cho cooling system vân canh
  '/dc/vancanh-overview': { autoCollapse: true, defaultCollapsed: true }, // Tự động thu gọn cho vân canh overview
  '/dc/ups-system': { autoCollapse: true, defaultCollapsed: true },
  '/dc/ups-vancanh': { autoCollapse: true, defaultCollapsed: true },
  '/dc/electric-vancanh': { autoCollapse: true, defaultCollapsed: true },
  '/dc/fire-system': { autoCollapse: true, defaultCollapsed: true },
  '/dc/security-system': { autoCollapse: true, defaultCollapsed: true },
  
  // BE pages
  '/be/overview': { autoCollapse: false, defaultCollapsed: false },
  '/be/shifts': { autoCollapse: false, defaultCollapsed: false },
  '/be/handovers': { autoCollapse: false, defaultCollapsed: false },
  '/be/tasks': { autoCollapse: false, defaultCollapsed: false },
  '/be/devices': { autoCollapse: false, defaultCollapsed: false },
  '/be/tape': { autoCollapse: false, defaultCollapsed: false },
  '/be/backup-management': { autoCollapse: false, defaultCollapsed: false },
  '/be/partners': { autoCollapse: false, defaultCollapsed: false },
  '/be/users': { autoCollapse: false, defaultCollapsed: false },
  '/be/settings': { autoCollapse: false, defaultCollapsed: false },
  
  // Profile page
  '/profile': { autoCollapse: false, defaultCollapsed: false },
  
  // Default config cho các page chưa được cấu hình
  'default': { autoCollapse: false, defaultCollapsed: false }
};

// Helper function để lấy cấu hình cho một path
export const getSidebarConfig = (pathname) => {
  return SIDEBAR_CONFIG[pathname] || SIDEBAR_CONFIG['default'];
};

// Helper function để thêm cấu hình mới
export const addSidebarConfig = (path, config) => {
  SIDEBAR_CONFIG[path] = config;
};

// Helper function để cập nhật cấu hình
export const updateSidebarConfig = (path, config) => {
  if (SIDEBAR_CONFIG[path]) {
    SIDEBAR_CONFIG[path] = { ...SIDEBAR_CONFIG[path], ...config };
  }
}; 