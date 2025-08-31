/**
 * Utility functions cho menu handling
 */

/**
 * Xử lý khi click vào menu item - Tối ưu UX
 * @param {string} key - Key của menu item
 * @param {Function} setSelectedKey - Function để set selected key
 */
export const handleMenuClick = ({ key }, setSelectedKey) => {
  setSelectedKey(key);
  
  // Tìm element tương ứng trong content
  let targetElement = document.getElementById(`section-${key}`);
  
  // Nếu không tìm thấy, thử tìm trực tiếp với key (cho section 2.x.x)
  if (!targetElement) {
    targetElement = document.getElementById(key);
  }
  
  // Nếu vẫn không tìm thấy, thử tìm với key chính (ví dụ: 4.1 -> 4)
  if (!targetElement && key.includes('.')) {
    const mainKey = key.split('.')[0];
    targetElement = document.getElementById(`section-${mainKey}`);
  }
  
  if (targetElement) {
    // Scroll trong content area thay vì toàn trang
    const contentElement = document.querySelector('.system-content, .cooling-system-content');
    if (contentElement) {
      const targetRect = targetElement.getBoundingClientRect();
      const contentRect = contentElement.getBoundingClientRect();
      const scrollTop = contentElement.scrollTop;
      const targetTop = targetRect.top - contentRect.top + scrollTop;
      
      contentElement.scrollTo({
        top: targetTop - 20, // Offset 20px từ top
        behavior: 'smooth'
      });
    }
  } else {
    // Nếu không tìm thấy section, scroll đến top của content
    const contentElement = document.querySelector('.system-content, .cooling-system-content');
    if (contentElement) {
      contentElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
};

/**
 * Tạo menu header style
 * @param {string} backgroundColor - Màu nền (default: #0072BC)
 * @returns {Object} Style object
 */
export const getMenuHeaderStyle = (backgroundColor = '#0072BC') => ({
  backgroundColor,
  color: '#fff',
  padding: '8px',
  borderRadius: '8px',
  margin: '8px',
  textAlign: 'center'
});

/**
 * Tạo menu header title style
 * @param {string} backgroundColor - Màu nền (default: #0072BC)
 * @returns {Object} Style object
 */
export const getMenuHeaderTitleStyle = (backgroundColor = '#0072BC') => ({
  margin: '0',
  fontSize: '20px',
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#fff',
  backgroundColor
});

/**
 * Tạo cấu trúc menu cơ bản
 * @param {Array} items - Array các menu items
 * @returns {Array} Menu items với cấu trúc chuẩn
 */
export const createMenuStructure = (items) => {
  return items.map(item => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    children: item.children || [],
    style: item.style || {}
  }));
};

/**
 * Tạo menu item với icon
 * @param {string} key - Key của menu item
 * @param {ReactNode} icon - Icon component
 * @param {string} label - Label của menu item
 * @param {Array} children - Children menu items
 * @param {Object} style - Style object
 * @returns {Object} Menu item object
 */
export const createMenuItem = (key, icon, label, children = [], style = {}) => ({
  key,
  icon,
  label,
  children,
  style
});

/**
 * Tạo sub menu item
 * @param {string} key - Key của menu item
 * @param {string} label - Label của menu item
 * @param {Array} children - Children menu items
 * @returns {Object} Sub menu item object
 */
export const createSubMenuItem = (key, label, children = []) => ({
  key,
  label,
  children
});

/**
 * Tạo leaf menu item
 * @param {string} key - Key của menu item
 * @param {string} label - Label của menu item
 * @returns {Object} Leaf menu item object
 */
export const createLeafMenuItem = (key, label) => ({
  key,
  label
});
