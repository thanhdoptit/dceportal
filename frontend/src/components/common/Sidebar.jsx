import {
  CalendarOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
  SwapOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2];

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className='logo' />
      <Menu
        theme='dark'
        mode='inline'
        defaultSelectedKeys={[currentPath]}
        defaultOpenKeys={['shift-manager']}
      >
        <Menu.Item key='shifts' icon={<CalendarOutlined />}>
          <Link to='/dc/shifts'>Ca làm việc</Link>
        </Menu.Item>

        <SubMenu key='shift-manager' icon={<ScheduleOutlined />} title='Quản lý ca'>
          <Menu.Item key='handover' icon={<SwapOutlined />}>
            <Link to='/dc/handover'>Bàn giao ca</Link>
          </Menu.Item>
          <Menu.Item key='device-check' icon={<CheckCircleOutlined />}>
            <Link to='/dc/device-check'>Kiểm tra thiết bị</Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item key='tasks' icon={<ToolOutlined />}>
          <Link to='/dc/tasks'>Công việc</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
