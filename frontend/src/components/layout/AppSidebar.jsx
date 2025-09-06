import React, { useState } from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useSidebar } from '../../contexts/SidebarContext';

const { Sider } = Layout;

// Component Sidebar cho AppLayout
const AppSidebar = ({ menuItemsWithFAQ, currentPath, currentConfig }) => {
  const { collapsed, setCollapsed, isAnimating } = useSidebar();
  const [userOverridden, setUserOverridden] = useState(false);

  // Xử lý khi user click vào trigger để thay đổi trạng thái
  const handleCollapseChange = newCollapsed => {
    setCollapsed(newCollapsed);
    setUserOverridden(true); // Đánh dấu user đã override cấu hình tự động
  };

  // Reset user override khi chuyển page (nếu cần)
  React.useEffect(() => {
    if (currentConfig.autoCollapse) {
      setUserOverridden(false);
    }
  }, [currentPath, currentConfig.autoCollapsed]);

  return (
    <Sider
      width={collapsed ? 70 : 200}
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapseChange}
      style={{
        position: 'fixed',
        top: 71,
        left: 1,
        bottom: 1,
        zIndex: 6,
        background: '#003c71',
        borderRadius: 6,
        overflow: 'hidden',
        paddingTop: 0,
        minHeight: 'calc(100vh - 83px)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', // Thêm transition mượt mà
      }}
      trigger={
        <Tooltip title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'} placement='right'>
          <div className='flex justify-center items-center h-12 cursor-pointer hover:bg-[#005fa3]/80 transition-all duration-300'>
            {collapsed ? (
              <MenuUnfoldOutlined className='text-white text-lg' />
            ) : (
              <MenuFoldOutlined className='text-white text-lg' />
            )}
          </div>
        </Tooltip>
      }
    >
      <Menu
        mode='inline'
        selectedKeys={[currentPath]}
        defaultOpenKeys={['shift-manager', 'shift-management']}
        style={{
          background: 'transparent',
          marginTop: 2, // Giảm margin top
          padding: '0 6px 0 2px', // Điều chỉnh padding: 6px phải, 2px trái để cân bằng
        }}
        className='custom-menu'
        items={menuItemsWithFAQ}
        theme='dark'
      />
      <style>{`
        /* ========================================
         * EXPANDED SIDEBAR STYLES (200px width)
         * ======================================== */

        /* Menu container - Expanded */
        .custom-menu {
          background: transparent !important;
          margin-top: 6px !important;

        }

        /* Menu items - Expanded */
        .custom-menu .ant-menu-item,
        .custom-menu .ant-menu-submenu-title {
          height: 42px !important;
          line-height: 42px !important;
          border-radius: 8px !important;
          color: rgba(255,255,255,0.85) !important;
          font-size: 14px !important;
          font-weight: 400 !important;
          margin-left: 6px !important;
          padding: 0 1px 0 1px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          display: flex !important;
          align-items: center !important;
          position: relative !important;
          overflow: hidden !important;
        }

        /* Selected state - Expanded */
        .custom-menu .ant-menu-item-selected {
          background: linear-gradient(135deg, #0072bc 0%, #005fa3 50%, #004d8a 100%) !important;
          color: #fff !important;
          font-weight: 600 !important;
          box-shadow: 4px 4px 12px rgba(0, 114, 188, 0.3) !important;
          border-radius: 8px !important;
          transform: translateY(-1px) !important;
        }

        /* Hover effects - Expanded */
        .custom-menu .ant-menu-item:hover,
        .custom-menu .ant-menu-submenu-title:hover {
          background: linear-gradient(135deg, #005fa3 0%, #004d8a 100%) !important;
          color: #fff !important;
        }

        /* Icons - Expanded */
        .custom-menu .ant-menu-item .anticon,
        .custom-menu .ant-menu-submenu-title .anticon {
          font-size: 20px !important;
          margin-right: 6px !important;
          margin-left: 10px !important;
          opacity: 0.9 !important;
          flex-shrink: 0 !important;
          transition: all 0.3s ease !important;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1)) !important;
        }

        /* Icon hover - Expanded */
        .custom-menu .ant-menu-item:hover .anticon,
        .custom-menu .ant-menu-submenu-title:hover .anticon {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)) !important;
        }

        /* ========================================
         * COLLAPSED SIDEBAR STYLES (70px width)
         * ======================================== */

        /* Menu container - Collapsed */
        .ant-layout-sider-collapsed .custom-menu {
          padding: 0 1px !important;
          margin-left: 5px !important;
          margin-right: 13px !important;
          margin-top: 6px !important;
          margin-bottom: 6px !important;
        }

        /* Menu items - Collapsed */
        .ant-layout-sider-collapsed .custom-menu .ant-menu-item,
        .ant-layout-sider-collapsed .custom-menu .ant-menu-submenu-title {
          height: 42px !important;
          line-height: 42px !important;

          border-radius: 8px !important;
          justify-content: center !important;
          text-align: center !important;
          width: calc(100% - 4px) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Hover effects - Collapsed */
        .ant-layout-sider-collapsed .custom-menu .ant-menu-item:hover,
        .ant-layout-sider-collapsed .custom-menu .ant-menu-submenu-title:hover {
          background: linear-gradient(135deg, #005fa3 0%, #004d8a 100%) !important;
          box-shadow: 0 2px 8px rgba(0, 95, 163, 0.3) !important;
        }

        /* Icons - Collapsed */
        .ant-layout-sider-collapsed .custom-menu .ant-menu-item .anticon,
        .ant-layout-sider-collapsed .custom-menu .ant-menu-submenu-title .anticon {
          margin: 0 !important;
          font-size: 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
          transition: all 0.3s ease !important;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1)) !important;
        }

        /* Hide text when collapsed */
        .ant-layout-sider-collapsed .custom-menu .ant-menu-item span:not(.anticon),
        .ant-layout-sider-collapsed .custom-menu .ant-menu-submenu-title span:not(.anticon) {
          display: none !important;
        }

        /* ========================================
         * SUBMENU STYLES (Both states)
         * ======================================== */

        /* Submenu container */
        .custom-menu .ant-menu-sub {
          background: transparent !important;
          padding-left: 12px !important;
        }

        /* Submenu items */
        .custom-menu .ant-menu-sub .ant-menu-item {
          height: 36px !important;
          line-height: 36px !important;
          margin: 1px 0 !important;
          padding: 0 10px !important;
          font-size: 12px !important;
          border-radius: 6px !important;
          transition: all 0.3s ease !important;
        }

        /* Submenu hover */
        .custom-menu .ant-menu-sub .ant-menu-item:hover {
          background: linear-gradient(135deg, #005fa3 0%, #004d8a 100%) !important;
          box-shadow: 0 2px 6px rgba(0, 95, 163, 0.2) !important;
        }

        /* Submenu icons */
        .custom-menu .ant-menu-sub .ant-menu-item .anticon {
          font-size: 20px !important;
          margin-right: 6px !important;
          transition: all 0.3s ease !important;
        }

        /* Submenu icon hover */
        .custom-menu .ant-menu-sub .ant-menu-item:hover .anticon {
          transform: scale(1.05) !important;
        }

        /* Selected submenu */
        .custom-menu .ant-menu-sub .ant-menu-item-selected {
          background: linear-gradient(135deg, #0072bc 0%, #005fa3 100%) !important;
          box-shadow: 0 2px 8px rgba(0, 114, 188, 0.25) !important;
        }
      `}</style>
    </Sider>
  );
};

export default AppSidebar;
