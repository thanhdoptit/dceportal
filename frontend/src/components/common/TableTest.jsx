import React, { useState } from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import StandardTable, { createStandardColumns } from './StandardTable';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { ActionButton } from './PrimaryButton';

const { Title } = Typography;

/**
 * Component test để kiểm tra table format
 */
const TableTest = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 3,
  });

  // Mock data cho test
  const mockLocations = [
    {
      id: 1,
      code: 'HCM',
      name: 'Hồ Chí Minh',
      description: 'Trung tâm dữ liệu TP.HCM',
      hotline: '1900-1234',
      isActive: true,
    },
    {
      id: 2,
      code: 'HN',
      name: 'Hà Nội',
      description: 'Trung tâm dữ liệu Hà Nội',
      hotline: '1900-5678',
      isActive: false,
    },
    {
      id: 3,
      code: 'DN',
      name: 'Đà Nẵng',
      description: 'Trung tâm dữ liệu Đà Nẵng',
      hotline: '1900-9012',
      isActive: true,
    },
  ];

  // Test columns với format giống SettingsPage
  const testColumns = [
    createStandardColumns.id('Mã địa điểm', 'code'),
    createStandardColumns.text('Tên địa điểm', 'name', '18%'),
    createStandardColumns.text('Mô tả', 'description', '25%'),
    createStandardColumns.text('Hotline', 'hotline', '10%'),
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '12%',
      className: 'custom-header border-gray-200',
      align: 'center',
      render: isActive => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Hoạt động' : 'Không hoạt động'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '15%',
      align: 'center',
      className: 'custom-header border-gray-200',
      render: (_, record) => (
        <Space>
          <ActionButton
            onClick={() => console.log('Edit:', record)}
            icon={<EditOutlined />}
            className='bg-orange-600 hover:bg-orange-700'
          >
            Sửa
          </ActionButton>
          {record.isActive ? (
            <ActionButton
              onClick={() => console.log('Delete:', record)}
              icon={<DeleteOutlined />}
              className='bg-red-600 hover:bg-red-700'
            >
              Xóa
            </ActionButton>
          ) : (
            <ActionButton
              onClick={() => console.log('Restore:', record)}
              icon={<UndoOutlined />}
              className='bg-green-600 hover:bg-green-700'
            >
              Khôi phục
            </ActionButton>
          )}
        </Space>
      ),
    },
  ];

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      page,
      limit: pageSize,
    }));
    console.log('Pagination changed:', { page, pageSize });
  };

  return (
    <div className='p-6'>
      <Title level={2} style={{ color: '#003c71', marginBottom: 24 }}>
        Table Format Test
      </Title>

      <Card title='Test Location Table Format'>
        <StandardTable
          columns={testColumns}
          dataSource={mockLocations}
          loading={false}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          rowKey='id'
          bordered
        />
      </Card>

      <Card title='Column Width Analysis' style={{ marginTop: 24 }}>
        <div className='space-y-2'>
          <div>Mã địa điểm: 3%</div>
          <div>Tên địa điểm: 18%</div>
          <div>Mô tả: 25%</div>
          <div>Hotline: 10%</div>
          <div>Trạng thái: 12%</div>
          <div>Thao tác: 15%</div>
          <div className='font-bold'>Tổng: 83% (OK)</div>
        </div>
      </Card>
    </div>
  );
};

export default TableTest;
