/**
 * Utility functions cho layout positioning
 */

/**
 * Tính toán vị trí các element dựa trên trạng thái sidebar
 * @param {boolean} collapsed - Trạng thái sidebar (collapsed hay không)
 * @param {Object} options - Các tùy chọn layout
 * @param {number} options.sidebarCollapsedWidth - Chiều rộng sidebar khi collapsed (default: 70)
 * @param {number} options.sidebarExpandedWidth - Chiều rộng sidebar khi expanded (default: 200)
 * @param {number} options.menuWidth - Chiều rộng menu (default: 320)
 * @param {number} options.spacing - Khoảng cách giữa các element (default: 10)
 * @returns {Object} Object chứa các vị trí đã tính toán
 */
export const calculateLayoutPositions = (collapsed, options = {}) => {
  const {
    sidebarCollapsedWidth = 70,
    sidebarExpandedWidth = 200,
    menuWidth = 320,
    spacing = 10
  } = options;

  // Tính toán vị trí sidebar
  const sidebarLeft = collapsed ? sidebarCollapsedWidth : sidebarExpandedWidth;
  
  // Tính toán vị trí header (ngay sau sidebar)
  const headerLeft = sidebarLeft + spacing;
  
  // Tính toán vị trí menu (ngay sau sidebar)
  const menuLeft = sidebarLeft + spacing;
  
  // Tính toán vị trí content (sau sidebar + menu)
  const contentLeft = sidebarLeft + menuWidth + spacing;

  return {
    sidebarLeft,
    headerLeft,
    menuLeft,
    contentLeft
  };
};

/**
 * Tạo style object cho header với vị trí động
 * @param {boolean} collapsed - Trạng thái sidebar
 * @param {Object} options - Các tùy chọn layout
 * @returns {Object} Style object cho header
 */
export const getHeaderStyle = (collapsed, options = {}) => {
  const { headerLeft } = calculateLayoutPositions(collapsed, options);
  
  return {
    left: `${headerLeft}px`,
    right: 0
  };
};

/**
 * Tạo style object cho menu với vị trí động
 * @param {boolean} collapsed - Trạng thái sidebar
 * @param {Object} options - Các tùy chọn layout
 * @returns {Object} Style object cho menu
 */
export const getMenuStyle = (collapsed, options = {}) => {
  const { menuLeft } = calculateLayoutPositions(collapsed, options);
  
  return {
    left: `${menuLeft}px`
  };
};

/**
 * Tạo style object cho content với vị trí động
 * @param {boolean} collapsed - Trạng thái sidebar
 * @param {Object} options - Các tùy chọn layout
 * @returns {Object} Style object cho content
 */
export const getContentStyle = (collapsed, options = {}) => {
  const { contentLeft } = calculateLayoutPositions(collapsed, options);
  
  return {
    left: `${contentLeft}px`
  };
};

/**
 * Hook để sử dụng layout positions trong React component
 * @param {boolean} collapsed - Trạng thái sidebar
 * @param {Object} options - Các tùy chọn layout
 * @returns {Object} Object chứa tất cả style objects và positions
 */
export const useLayoutPositions = (collapsed, options = {}) => {
  const positions = calculateLayoutPositions(collapsed, options);
  
  return {
    ...positions,
    headerStyle: getHeaderStyle(collapsed, options),
    menuStyle: getMenuStyle(collapsed, options),
    contentStyle: getContentStyle(collapsed, options)
  };
};
