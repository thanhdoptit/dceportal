import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Dropdown, Avatar, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import {
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  CalendarOutlined,
  SwapOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  IeOutlined,
  ContactsOutlined,
  BookOutlined,
  ControlOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { getSidebarConfig } from './sidebarConfig';

// Constants
const USER_MENU_ITEMS = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Thông tin cá nhân'
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Đăng xuất',
    danger: true
  }
];

const { Header, Content, Sider } = Layout;



// Menu configuration cho từng role
const getManagerMenu = (navigate) => [
  {
    key: 'overview',
    icon: <DashboardOutlined className="text-xl" />,
    label: 'Tổng quan',
    onClick: () => navigate('/manager/overview')
  },
  {
    key: 'shift-management',
    icon: <ScheduleOutlined className="text-xl" />,
    label: 'Quản lý ca',
    children: [
      {
        key: 'shift-list',
        icon: <CalendarOutlined className="text-lg" />,
        label: 'Danh sách ca',
        onClick: () => navigate('/manager/shifts')
      },
      {
        key: 'handover-list',
        icon: <SwapOutlined className="text-lg" />,
        label: 'Biên bản bàn giao',
        onClick: () => navigate('/manager/handovers')
      },
    ]
  },
  {
    key: 'task-management',
    icon: <ToolOutlined className="text-xl" />,
    label: 'Quản lý vào ra',
    onClick: () => navigate('/manager/tasks')
  },
  {
    key: 'device-management',
    icon: <ExclamationCircleOutlined className="text-xl" />,
    label: 'Quản lý sự cố',
    onClick: () => navigate('/manager/devices')
  },
  {
    key: 'tape-management',
    icon: <FileTextOutlined className="text-xl" />,
    label: 'Quản lý tape',
    onClick: () => navigate('/manager/tape')
  },
  {
    key: 'backup-management',
    icon: <DatabaseOutlined className="text-xl" />,
    label: 'Quản lý Backup',
    onClick: () => navigate('/manager/backup-management')
  },
  {
    key: 'partner-management',
    icon: <ContactsOutlined className="text-xl" />,
    label: 'Quản lý đối tác',
    onClick: () => navigate('/manager/partners')
  },
  {
    key: 'user-management',
    icon: <TeamOutlined className="text-xl" />,
    label: 'Quản lý nhân viên',
    onClick: () => navigate('/manager/users')
  },
  {
    key: 'system-info',
    icon: <BookOutlined className="text-xl" />,
    label: 'Thông tin hệ thống',
    onClick: () => navigate('/manager/system-info')
  },
  {
    key: 'system-info-manager',
    icon: <SettingOutlined className="text-xl" />,
    label: 'Quản lý thông tin hệ thống',
    onClick: () => navigate('/manager/system-info-manager')
  },
  {
    key: 'cooling-system',
    icon: <CloudOutlined className="text-xl" />,
    label: 'Hệ thống làm mát TTDL',
    onClick: () => navigate('/manager/cooling-system')
  },
  {
    key: 'settings',
    icon: <ControlOutlined className="text-xl" />,
    label: 'Cài đặt hệ thống',
    onClick: () => navigate('/manager/settings')
  },
  {
    key: 'datacenter-menu',
    icon: <DatabaseOutlined className="text-xl" />,
    label: 'Quản lý hệ thống TTDL',
    onClick: () => navigate('/manager/datacenter-menu')
  }
];

const getAdminMenu = (navigate) => [
  {
    key: 'overview',
    icon: <DashboardOutlined className="text-xl" />,
    label: 'Tổng quan',
    onClick: () => navigate('/manager/overview')
  },
  {
    key: 'shift-management',
    icon: <ScheduleOutlined className="text-xl" />,
    label: 'Quản lý ca',
    children: [
      {
        key: 'shift-list',
        icon: <CalendarOutlined className="text-lg" />,
        label: 'Danh sách ca',
        onClick: () => navigate('/manager/shifts')
      },
      {
        key: 'handover-list',
        icon: <SwapOutlined className="text-lg" />,
        label: 'Biên bản bàn giao',
        onClick: () => navigate('/manager/handovers')
      },
    ]
  },
  {
    key: 'task-management',
    icon: <ToolOutlined className="text-xl" />,
    label: 'Quản lý vào ra',
    onClick: () => navigate('/manager/tasks')
  },
  {
    key: 'device-management',
    icon: <ExclamationCircleOutlined className="text-xl" />,
    label: 'Quản lý sự cố',
    onClick: () => navigate('/manager/devices')
  },
  {
    key: 'tape-management',
    icon: <FileTextOutlined className="text-xl" />,
    label: 'Quản lý tape',
    onClick: () => navigate('/manager/tape')
  },
  {
    key: 'backup-management',
    icon: <DatabaseOutlined className="text-xl" />,
    label: 'Quản lý Backup',
    onClick: () => navigate('/manager/backup-management')
  },
  {
    key: 'partner-management',
    icon: <ContactsOutlined className="text-xl" />,
    label: 'Quản lý đối tác',
    onClick: () => navigate('/manager/partners')
  },
  {
    key: 'user-management',
    icon: <TeamOutlined className="text-xl" />,
    label: 'Quản lý nhân viên',
    onClick: () => navigate('/manager/users')
  },
  {
    key: 'system-info',
    icon: <BookOutlined className="text-xl" />,
    label: 'Thông tin hệ thống',
    onClick: () => navigate('/manager/system-info')
  },
  {
    key: 'system-info-manager',
    icon: <SettingOutlined className="text-xl" />,
    label: 'Quản lý thông tin hệ thống',
    onClick: () => navigate('/manager/system-info-manager')
  },
  {
    key: 'cooling-system',
    icon: <CloudOutlined className="text-xl" />,
    label: 'Hệ thống làm mát TTDL',
    onClick: () => navigate('/manager/cooling-system')
  },
  {
    key: 'settings',
    icon: <ControlOutlined className="text-xl" />,
    label: 'Cài đặt hệ thống',
    onClick: () => navigate('/manager/settings')
  },
  {
    key: 'datacenter-menu',
    icon: <DatabaseOutlined className="text-xl" />,
    label: 'Quản lý hệ thống TTDL',
    onClick: () => navigate('/manager/datacenter-menu')
  }
];

const getBEMenu = (navigate) => [
  {
    key: 'overview',
    icon: <DashboardOutlined className="text-xl" />,
    label: 'Tổng quan',
    onClick: () => navigate('/be/overview')
  },
  {
    key: 'shift-management',
    icon: <ScheduleOutlined className="text-xl" />,
    label: 'Quản lý ca',
    children: [
      {
        key: 'shift-list',
        icon: <CalendarOutlined className="text-lg" />,
        label: 'Danh sách ca',
        onClick: () => navigate('/be/shifts')
      },
      {
        key: 'handover-list',
        icon: <SwapOutlined className="text-lg" />,
        label: 'Biên bản bàn giao',
        onClick: () => navigate('/be/handovers')
      },
    ]
  },
  {
    key: 'task-management',
    icon: <ToolOutlined className="text-xl" />,
    label: 'Quản lý vào ra',
    onClick: () => navigate('/be/tasks')
  },
  {
    key: 'device-management',
    icon: <ExclamationCircleOutlined className="text-xl" />,
    label: 'Quản lý sự cố',
    onClick: () => navigate('/be/devices')
  },
  {
    key: 'tape-management',
    icon: <FileTextOutlined className="text-xl" />,
    label: 'Quản lý tape',
    onClick: () => navigate('/be/tape')
  },
  {
    key: 'backup-management',
    icon: <DatabaseOutlined className="text-xl" />,
    label: 'Quản lý Backup',
    onClick: () => navigate('/be/backup-management')
  },
  {
    key: 'partner-management',
    icon: <ContactsOutlined className="text-xl" />,
    label: 'Quản lý đối tác',
    onClick: () => navigate('/be/partners')
  },
  {
    key: 'user-management',
    icon: <TeamOutlined className="text-xl" />,
    label: 'Quản lý nhân viên',
    onClick: () => navigate('/be/users')
  },
  {
    key: 'system-info',
    icon: <BookOutlined className="text-xl" />,
    label: 'Thông tin hệ thống',
    onClick: () => navigate('/be/system-info')
  },
  {
    key: 'system-info-manager',
    icon: <SettingOutlined className="text-xl" />,
    label: 'Quản lý thông tin hệ thống',
    onClick: () => navigate('/be/system-info-manager')
  },
  {
    key: 'cooling-system',
    icon: <CloudOutlined className="text-xl" />,
    label: 'Hệ thống làm mát TTDL',
    onClick: () => navigate('/be/cooling-system')
  },
  {
    key: 'settings',
    icon: <ControlOutlined className="text-xl" />,
    label: 'Cài đặt hệ thống',
    onClick: () => navigate('/be/settings')
  },
  {
    key: 'datacenter-menu',
    icon: <DatabaseOutlined className="text-xl" />,
    label: 'Quản lý hệ thống TTDL',
    onClick: () => navigate('/be/datacenter-menu')
  }
];

const getDatacenterMenu = (navigate) => [
  {
    key: 'dc-shifts',
    icon: <CalendarOutlined className="text-xl" />,
    label: 'Quản lý công việc',
    onClick: () => navigate('/dc/shifts')
  },
  {
    key: 'dc-work',
    icon: <SwapOutlined className="text-xl" />,
    label: 'Quản lý bàn giao ca',
    onClick: () => navigate('/dc/handover')
  },
  {
    key: 'dc-tasks',
    icon: <ToolOutlined className="text-xl" />,
    label: 'Quản lý vào ra TTDL',
    onClick: () => navigate('/dc/tasks')
  },
  {
    key: 'dc-devices',
    icon: <ExclamationCircleOutlined className="text-xl" />,
    label: 'Quản lý sự cố TTDL',
    onClick: () => navigate('/dc/devices')
  },
  {
    key: 'dc-tape',
    icon: <FileTextOutlined className="text-xl" />,
    label: 'Quản lý tape',
    onClick: () => navigate('/dc/tape')
  },
  {
    key: 'dc-datacenter-menu',
    icon: <BookOutlined className="text-xl" />,
    label: 'Tài liệu hệ thống',
    onClick: () => navigate('/dc/datacenter-menu')
  }
];

// Hàm lấy menu theo role
const getMenuByRole = (role, navigate) => {
  switch (role) {
    case 'manager':
      return getManagerMenu(navigate);
    case 'admin':
      return getAdminMenu(navigate);
    case 'be':
      return getBEMenu(navigate);
    case 'datacenter':
      return getDatacenterMenu(navigate);
    default:
      return [];
  }
};

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, reloadUserInfo } = useAuth();
  const { collapsed, setCollapsed, getCurrentConfig } = useSidebar();

  const currentConfig = getCurrentConfig();

  // Menu chính theo role
  const menuItems = useMemo(() => {
    return getMenuByRole(currentUser?.role?.toLowerCase(), navigate);
  }, [currentUser?.role, navigate]);

  // Menu với FAQ cho datacenter
  const menuItemsWithFAQ = useMemo(() => {
    if (currentUser?.role?.toLowerCase() === 'datacenter') {
      const faqMenuItem = {
        key: 'faq',
        icon: <BookOutlined className="text-xl" />,
        label: 'FAQ - Hướng dẫn',
        onClick: () => navigate('/dc/faq')
      };
      return [...menuItems,];
    }
    return menuItems;
  }, [menuItems, navigate, currentUser?.role]);

  // Xử lý logout: gọi API, xóa localStorage, chuyển về trang login
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      // Có thể log lỗi hoặc bỏ qua
      console.error('Logout API error:', err);
    }
    localStorage.clear();
    navigate('/login');
  };

  // Xử lý click menu user (profile, logout)
  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'profile') {
      navigate('/profile');
    }
  };

  // Kiểm tra quyền truy cập và điều hướng về login nếu không hợp lệ
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || !user?.role) {
      navigate('/login');
      return;
    }

    const path = location.pathname;
    const role = user.role.toLowerCase();

    if (
      (path.startsWith('/manager') && role !== 'manager' && role !== 'admin') ||
      (path.startsWith('/dc') && role !== 'datacenter') ||
      (path.startsWith('/be') && role !== 'be')
    ) {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  // Reload user info khi chuyển từ profile ra ngoài hoặc lần đầu vào app
  useEffect(() => {
    const shouldReload = location.pathname !== '/profile' &&
      sessionStorage.getItem('lastPath') === '/profile';

    if (shouldReload) {
      reloadUserInfo();
    }

    // Lưu path hiện tại
    sessionStorage.setItem('lastPath', location.pathname);
  }, [location.pathname, reloadUserInfo]);



  const currentPath = location.pathname.split('/')[2];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Header */}
      <AppHeader
        currentUser={currentUser}
        USER_MENU_ITEMS={USER_MENU_ITEMS}
        handleMenuClick={handleMenuClick}
      />
      {/* Layout dưới header */}
      <Layout style={{ marginTop: 69, minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        <AppSidebar
          menuItemsWithFAQ={menuItemsWithFAQ}
          currentPath={currentPath}
          currentConfig={currentConfig}
        />
        {/* Content area với margin-left để không bị che bởi sidebar fixed */}
        <Content style={{
          margin: '1px 1px 0px ' + (collapsed ? '82px' : '202px'),
          padding: '0px',
          background: '#ffffff',
          borderRadius: 6,
          minHeight: 'calc(100vh - 71px)', // Tăng chiều cao tối thiểu
          height: 'calc(100vh - 71px)', // Thêm chiều cao cố định
          overflow: 'auto', // Thêm scroll khi content vượt quá
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', // Tối ưu transition
          border: '1px solid #f1f5f9'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
