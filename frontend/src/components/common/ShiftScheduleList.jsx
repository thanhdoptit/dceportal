import React, { useState, useEffect } from 'react';
import { Card, List, Button, Space, Typography, Row, Col, Avatar } from 'antd';
import { CalendarOutlined, TeamOutlined, EyeOutlined } from '@ant-design/icons';
import ShiftScheduleModal from './ShiftScheduleModal';

const { Title, Text } = Typography;

const ShiftScheduleList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Dữ liệu mẫu locations - có thể thay thế bằng API call
  const mockLocations = [
    {
      id: 1,
      name: 'Phòng Datacenter 1',
      code: 'DC1',
      description: 'Phòng datacenter chính',
      staffCount: 15,
      status: 'active',
    },
    {
      id: 2,
      name: 'Phòng Datacenter 2',
      code: 'DC2',
      description: 'Phòng datacenter phụ',
      staffCount: 12,
      status: 'active',
    },
    {
      id: 3,
      name: 'Phòng Backup',
      code: 'BACKUP',
      description: 'Phòng backup dữ liệu',
      staffCount: 8,
      status: 'active',
    },
  ];

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setLoading(true);
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await api.get('/api/locations');
      // setLocations(response.data);

      // Tạm thời sử dụng dữ liệu mẫu
      console.log('Loading locations:', mockLocations);
      setLocations(mockLocations);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phòng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedule = location => {
    console.log('Opening schedule for location:', location);
    console.log('Current modalVisible state:', modalVisible);
    setSelectedLocation(location);
    setModalVisible(true);
    console.log('Set modalVisible to true');
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedLocation(null);
  };

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Space direction='vertical' size='small'>
              <Title level={3}>
                <TeamOutlined /> Danh Sách Phòng Datacenter
              </Title>
              <Text type='secondary'>Chọn phòng để xem lịch trực chi tiết</Text>
            </Space>
          </Col>
        </Row>

        <List
          loading={loading}
          dataSource={locations}
          renderItem={location => (
            <List.Item
              actions={[
                <Button
                  key='view'
                  type='primary'
                  icon={<EyeOutlined />}
                  onClick={() => handleViewSchedule(location)}
                >
                  Xem Lịch Trực
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<TeamOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                title={
                  <Space>
                    <Text strong>{location.name}</Text>
                    <Text code>{location.code}</Text>
                  </Space>
                }
                description={
                  <Space direction='vertical' size='small'>
                    <Text>{location.description}</Text>
                    <Text type='secondary'>Số nhân viên: {location.staffCount} người</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <ShiftScheduleModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        locationId={selectedLocation?.id}
      />
    </div>
  );
};

export default ShiftScheduleList;
