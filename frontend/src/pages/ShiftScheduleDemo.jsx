import React from 'react';
import { Card, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import ShiftScheduleList from '../components/common/ShiftScheduleList';

const { Title } = Typography;

const ShiftScheduleDemo = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>
            <CalendarOutlined /> Demo Lịch Trực Datacenter
          </Title>
          <p>Đây là demo component hiển thị lịch trực datacenter dựa theo form ảnh bạn cung cấp.</p>
        </div>
        
        <ShiftScheduleList />
      </Card>
    </div>
  );
};

export default ShiftScheduleDemo; 