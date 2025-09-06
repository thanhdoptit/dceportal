import React from 'react';
import { Layout, Dropdown, Avatar } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';

const { Header } = Layout;

// Component Header cho AppLayout
const AppHeader = ({ currentUser, USER_MENU_ITEMS, handleMenuClick }) => (
  <Header
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      marginLeft: 1,
      marginRight: 1,
      height: 70,
      zIndex: 100,
      borderRadius: 6,
      padding: '0 25px',
      background: 'linear-gradient(90deg, #0072BC  0%, #ED1C24 110%)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      transition: 'all 0.2s',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    }}
  >
    {/* Logo góc trái */}
    <div className='flex items-center'>
      <span className='text-xl  text-white tracking-wide select-none' style={{ letterSpacing: 1 }}>
        DataCenter & Equipment Management
      </span>
    </div>
    {/* Dropdown user */}
    <Dropdown
      menu={{ items: USER_MENU_ITEMS, onClick: handleMenuClick }}
      trigger={['click']}
      placement='bottomRight'
    >
      <div className='flex items-center cursor-pointer px-4 py-2 rounded-xl hover:bg-white/10 hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200'>
        <Avatar
          style={{
            backgroundColor: '#fff',
            color: '#003c71',
            marginRight: 12,
            boxShadow: '0 2px 8px rgba(0,60,113,0.3)',
          }}
          icon={<UserOutlined />}
        />
        <div className='flex flex-col'>
          <span className='text-sm font-semibold text-white'>{currentUser?.fullname}</span>
          <span className='text-xs text-blue-100'>
            {currentUser?.role === 'admin'
              ? 'Quản trị viên'
              : currentUser?.role === 'datacenter'
                ? 'DataCenter'
                : currentUser?.role === 'manager'
                  ? 'Quản lý'
                  : currentUser?.role === 'be'
                    ? 'Batch Engineer'
                    : 'Nhân viên'}
          </span>
        </div>
        <DownOutlined className='text-white ml-3' />
      </div>
    </Dropdown>
  </Header>
);

export default AppHeader;
