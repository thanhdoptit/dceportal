import { Button, Space, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

/**
 * StandardTable Component - Áp dụng styling standards từ DevicePage
 *
 * @param {Object} props
 * @param {Array} props.columns - Cấu hình cột
 * @param {Array} props.dataSource - Dữ liệu bảng
 * @param {boolean} props.loading - Trạng thái loading
 * @param {Object} props.pagination - Cấu hình phân trang
 * @param {Function} props.onPaginationChange - Callback khi thay đổi trang
 * @param {string} props.rowKey - Key cho mỗi row (default: 'id')
 */
const StandardTable = ({
  columns,
  dataSource,
  loading = false,
  pagination,
  onPaginationChange,
  rowKey = 'id',
  ...props
}) => {
  // Standard pagination config
  const standardPagination = {
    current: pagination?.page || 1,
    pageSize: pagination?.limit || 15,
    total: pagination?.total || 0,
    onChange: onPaginationChange,
    showSizeChanger: true,
    pageSizeOptions: ['15', '20', '50', '100'],
    defaultPageSize: 15,
    showTotal: total => `Tổng số ${total}`,
    locale: { items_per_page: '/ Trang' },
    ...pagination,
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey={rowKey}
      pagination={standardPagination}
      bordered
      defaultSortOrder='ascend'
      {...props}
    />
  );
};

/**
 * Utility functions để tạo columns theo standards
 */
export const createStandardColumns = {
  // ID column với styling chuẩn
  id: (title = 'Mã', dataIndex = 'id') => ({
    title,
    dataIndex,
    key: dataIndex,
    width: '3%',
    className: 'custom-header border-gray-200',
    render: id => id,
    align: 'center',
    defaultSortOrder: 'ascend',
  }),

  // Status column với Tag
  status: (title = 'Trạng thái', dataIndex = 'status', statusMap = {}, customRender = null) => ({
    title,
    dataIndex,
    key: dataIndex,
    width: '5%',
    className: 'custom-header border-gray-200',
    align: 'center',
    render: customRender || (status => <Tag color={statusMap[status] || 'default'}>{status}</Tag>),
  }),

  // Date column với format chuẩn
  date: (title = 'Thời gian', dataIndex = 'createdAt', format = 'DD/MM/YYYY HH:mm') => ({
    title,
    dataIndex,
    key: dataIndex,
    width: '7%',
    className: 'custom-header border-gray-200',
    render: date => dayjs(date).format(format),
  }),

  // Text column với word wrap
  text: (title, dataIndex, width = '10%') => ({
    title,
    dataIndex,
    key: dataIndex,
    width,
    className: 'custom-header border-gray-200',
    render: text => <div className='whitespace-pre-line break-words'>{text}</div>,
  }),

  // Actions column với buttons
  actions: (title = 'Thao tác', actions = []) => ({
    title,
    key: 'actions',
    width: '5%',
    align: 'center',
    className: 'custom-header border-gray-200',
    render: (_, record) => (
      <Space>
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={() => action.onClick(record)}
            size='small'
            type={action.type || 'primary'}
            className={
              action.className ||
              'flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap'
            }
            icon={action.icon}
          >
            {action.text}
          </Button>
        ))}
      </Space>
    ),
  }),
};

/**
 * Standard status mappings
 */
export const STATUS_COLORS = {
  // Device errors
  'Chưa xử lý': 'red',
  'Đã xử lý': 'green',

  // Task status
  'Chờ xử lý': 'orange',
  'Đang xử lý': 'blue',
  'Hoàn thành': 'green',
  'Từ chối': 'red',

  // User status
  Active: 'green',
  Inactive: 'red',

  // Location status
  'Hoạt động': 'green',
  'Không hoạt động': 'red',
};

export default StandardTable;
