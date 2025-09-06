import { Layout, Menu } from 'antd';
import { useState } from 'react';
import '../styles/SystemLayout.css';
import { getMenuHeaderStyle, getMenuHeaderTitleStyle, handleMenuClick } from '../utils/menuUtils';

const { Sider, Content } = Layout;

/**
 * SystemLayout Component - Layout chung cho tất cả hệ thống
 * @param {Object} props - Component props
 * @param {Array} props.menuItems - Menu items array
 * @param {ReactNode} props.children - Content children
 * @param {string} props.title - Menu header title
 * @param {string} props.headerBgColor - Menu header background color (default: #0072BC)
 * @param {string} props.layoutClassName - Additional CSS class cho layout
 * @param {string} props.contentClassName - Additional CSS class cho content
 * @param {Array} props.defaultOpenKeys - Default open menu keys (default: ['1', '2', '3', '4'])
 * @param {string} props.selectedKey - Selected menu key (default: '1')
 * @param {Function} props.onMenuClick - Custom menu click handler
 */
const SystemLayout = ({
  menuItems,
  children,
  title = 'Hệ thống tài liệu kỹ thuật',
  headerBgColor = '#0072BC',
  layoutClassName = '',
  contentClassName = '',
  defaultOpenKeys = ['1', '2', '3', '4'],
  selectedKey = '1',
  onMenuClick,
}) => {
  const [currentSelectedKey, setCurrentSelectedKey] = useState(selectedKey);

  // Xử lý menu click
  const handleMenuClickWrapper = menuInfo => {
    if (onMenuClick) {
      onMenuClick(menuInfo);
    } else {
      handleMenuClick(menuInfo, setCurrentSelectedKey);
    }
  };

  return (
    <Layout className={`system-layout ${layoutClassName}`}>
      {/* Menu bên trái - Cố định width */}
      <div className='menu-container'>
        <Sider width={320} className='system-sider' theme='dark'>
          <div className='menu-header' style={getMenuHeaderStyle(headerBgColor)}>
            <h3 style={getMenuHeaderTitleStyle(headerBgColor)}>{title}</h3>
          </div>
          <Menu
            mode='inline'
            theme='dark'
            selectedKeys={[currentSelectedKey]}
            defaultOpenKeys={defaultOpenKeys}
            items={menuItems}
            onClick={handleMenuClickWrapper}
            className='system-menu'
            expandIcon={null}
          />
        </Sider>
      </div>

      {/* Content - Full width với responsive */}
      <Layout>
        <Content className={`system-content ${contentClassName}`}>
          <div className='content-wrapper'>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SystemLayout;
