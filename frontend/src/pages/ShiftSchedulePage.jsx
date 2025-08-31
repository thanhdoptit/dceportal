import React from 'react';
import { Breadcrumb, Space } from 'antd';
import { CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import ShiftScheduleList from '../components/common/ShiftScheduleList';

const ShiftSchedulePage = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb
        items={[
          {
            title: <HomeOutlined />,
          },
          {
            title: 'Quản lý',
          },
          {
            title: <CalendarOutlined />,
          },
          {
            title: 'Lịch Trực Datacenter',
          },
        ]}
        style={{ marginBottom: '16px' }}
      />
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <ShiftScheduleTest />
        <ShiftScheduleList />
      </Space>
    </div>
  );
};

export default ShiftSchedulePage; 