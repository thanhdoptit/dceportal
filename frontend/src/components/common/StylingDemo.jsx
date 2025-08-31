import React, { useState } from 'react';
import { Card, Typography, Space, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import StandardTable, { createStandardColumns, STATUS_COLORS } from './StandardTable';
import PrimaryButton, { ActionButton, StatusButton } from './PrimaryButton';

const { Title, Text } = Typography;

/**
 * Demo component để show cách sử dụng styling standards
 */
const StylingDemo = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 100
  });

  // Mock data
  const mockData = [
    {
      id: 1,
      location: 'Hà Nội',
      deviceName: 'Server HP DL380',
      serialNumber: 'SN123456789',
      errorCode: 'ERR001',
      errorCause: 'Lỗi kết nối mạng',
      solution: 'Kiểm tra cable và restart switch',
      createdAt: '2024-01-15T10:30:00Z',
      resolveStatus: 'Chưa xử lý'
    },
    {
      id: 2,
      location: 'TP.HCM',
      deviceName: 'UPS APC 3000VA',
      serialNumber: 'SN987654321',
      errorCode: 'ERR002',
      errorCause: 'Pin yếu',
      solution: 'Thay pin mới',
      createdAt: '2024-01-14T15:45:00Z',
      resolveStatus: 'Đã xử lý'
    }
  ];

  // Tạo columns sử dụng utility functions
  const columns = [
    createStandardColumns.id('Mã', 'id'),
    createStandardColumns.text('Địa điểm', 'location', '6%'),
    createStandardColumns.text('Tên thiết bị', 'deviceName', '10%'),
    createStandardColumns.text('Số serial', 'serialNumber', '10%'),
    createStandardColumns.text('Mã lỗi', 'errorCode', '10%'),
    createStandardColumns.text('Nguyên nhân', 'errorCause', '10%'),
    createStandardColumns.text('Giải pháp', 'solution', '10%'),
    createStandardColumns.date('Thời gian tạo', 'createdAt'),
    createStandardColumns.status('Trạng thái', 'resolveStatus', STATUS_COLORS),
    createStandardColumns.actions('Thao tác', [
      {
        text: 'Chi tiết',
        onClick: (record) => console.log('View details:', record),
        icon: <EyeOutlined />,
        className: "flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
      },
      {
        text: 'Sửa',
        onClick: (record) => console.log('Edit:', record),
        icon: <EditOutlined />,
        type: 'default',
        className: "flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white whitespace-nowrap"
      },
      {
        text: 'Xóa',
        onClick: (record) => console.log('Delete:', record),
        icon: <DeleteOutlined />,
        type: 'default',
        className: "flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white whitespace-nowrap"
      }
    ])
  ];

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      page,
      limit: pageSize
    }));
    console.log('Pagination changed:', { page, pageSize });
  };

  return (
    <div className="p-6">
      <Title level={2} style={{ color: '#003c71', marginBottom: 24 }}>
        Styling Standards Demo
      </Title>

      {/* Button Examples */}
      <Card title="Button Standards" style={{ marginBottom: 24 }}>
        <Space wrap>
          <PrimaryButton variant="primary" icon={<PlusOutlined />}>
            Tạo mới (Primary)
          </PrimaryButton>
          
          <PrimaryButton variant="secondary" icon={<EditOutlined />}>
            Chỉnh sửa (Secondary)
          </PrimaryButton>
          
          <PrimaryButton variant="danger" icon={<DeleteOutlined />}>
            Xóa (Danger)
          </PrimaryButton>
          
          <ActionButton icon={<EyeOutlined />}>
            Chi tiết (Action)
          </ActionButton>
          
          <StatusButton status="success">
            Thành công
          </StatusButton>
          
          <StatusButton status="error">
            Lỗi
          </StatusButton>
          
          <StatusButton status="warning">
            Cảnh báo
          </StatusButton>
        </Space>
      </Card>

      {/* Table Example */}
      <Card title="Table Standards">
        <div className="flex justify-between items-center mb-4">
          <Text strong>Quản lý sự cố thiết bị</Text>
          <PrimaryButton variant="primary" icon={<PlusOutlined />}>
            Tạo mới
          </PrimaryButton>
        </div>

        <StandardTable
          columns={columns}
          dataSource={mockData}
          loading={false}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          rowKey="id"
        />
      </Card>

      {/* Color Palette */}
      <Card title="Color Palette" style={{ marginTop: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Primary Colors:</Text>
            <div className="flex gap-4 mt-2">
              <div className="w-20 h-10 bg-[#003c71] rounded flex items-center justify-center text-white text-xs">
                #003c71
              </div>
              <div className="w-20 h-10 bg-[#2563eb] rounded flex items-center justify-center text-white text-xs">
                #2563eb
              </div>
              <div className="w-20 h-10 bg-[#1d4ed8] rounded flex items-center justify-center text-white text-xs">
                #1d4ed8
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div>
            <Text strong>Status Colors:</Text>
            <div className="flex gap-4 mt-2">
              <div className="w-20 h-10 bg-green-500 rounded flex items-center justify-center text-white text-xs">
                Success
              </div>
              <div className="w-20 h-10 bg-red-500 rounded flex items-center justify-center text-white text-xs">
                Error
              </div>
              <div className="w-20 h-10 bg-orange-500 rounded flex items-center justify-center text-white text-xs">
                Warning
              </div>
              <div className="w-20 h-10 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
                Info
              </div>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default StylingDemo; 