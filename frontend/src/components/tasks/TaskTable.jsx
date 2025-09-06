import { UserOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import React from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/taskStatus';

export default function TaskTable({
  tasks,
  loading,
  onView,
  onDelete,
  getCurrentUserId,
  getCurrentUserRole,
  pagination,
  onPaginationChange,
  exportToExcel,
}) {
  const columns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      width: '4%',
      className: 'custom-header border-gray-200',
      render: text => <div className='text-center'>CV {text}</div>,
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      width: '8%',
      className: 'custom-header border-gray-200',
      render: location => <div className='text-s whitespace-pre-line break-words'>{location}</div>,
    },
    {
      title: 'Họ tên nhân sự vào/ra TTDL',
      dataIndex: 'staff',
      key: 'staff',
      width: '14%',
      className: 'custom-header border-gray-200',
      render: (staff, record) => {
        if (staff && staff.length > 0) {
          return (
            <div className='whitespace-pre-line break-words'>
              {staff.map((person, index) => (
                <div key={index} className='items-center mb-1'>
                  <UserOutlined className='mr-2 text-blue-500' />
                  <span className='break-words'>{person.fullName}</span>
                  <span className='text-gray-500'>{person.donVi ? ` (${person.donVi})` : ''} </span>
                </div>
              ))}
            </div>
          );
        } else if (record.fullName) {
          return (
            <div className='whitespace-pre-line break-words'>
              {record.fullName.split(',').map((person, index) => (
                <div key={index} className='flex items-center mb-1'>
                  <UserOutlined className='mr-2 text-blue-500' />
                  <span className='break-words'>{person.trim()}</span>
                </div>
              ))}
            </div>
          );
        } else {
          return '-';
        }
      },
    },
    {
      title: 'Công việc thực hiện',
      dataIndex: 'taskTitle',
      key: 'taskTitle',
      width: '20%',
      className: 'custom-header border-gray-200',
      render: text => <div className='whitespace-pre-line break-words'>{text}</div>,
    },
    {
      title: 'Nội dung',
      dataIndex: 'taskDescription',
      key: 'taskDescription',
      width: '20%',
      className: 'custom-header border-gray-200',
      render: text => <div className='whitespace-pre-line break-words'>{text}</div>,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      width: '8%',
      className: 'custom-header border-gray-200',
      render: time => (
        <div className='whitespace-pre-line break-words'>
          {new Date(time).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>
      ),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'checkOutTime',
      key: 'checkOutTime',
      width: '8%',
      className: 'custom-header border-gray-200',
      render: time => (
        <div className='whitespace-pre-line break-words'>
          {time
            ? new Date(time).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '-'}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '6%',
      align: 'center',
      className: 'custom-header border-gray-200',
      render: status => <Tag color={STATUS_COLORS[status]}> {STATUS_LABELS[status]} </Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '5%',
      align: 'center',
      className: 'custom-header border-gray-200',
      render: (_, record) => {
        const isCreator = record.creator?.id === getCurrentUserId();
        const isManager = getCurrentUserRole() === 'manager';
        const canDelete = (isCreator || isManager) && record.status !== 'completed';
        return (
          <Space>
            <Button
              type='primary'
              size='small'
              className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap'
              onClick={() => onView(record)}
            >
              Chi Tiết
            </Button>
            {canDelete && (
              <Popconfirm
                title='Xóa công việc?'
                description='Bạn có chắc chắn muốn xóa công việc này?'
                onConfirm={() => onDelete(record.id)}
                okText='Xóa'
                cancelText='Hủy'
                okButtonProps={{
                  style: {
                    backgroundColor: '#003c71',
                    borderColor: '#003c71',
                    color: 'white',
                  },
                }}
              >
                <Button
                  danger
                  type='primary'
                  size='small'
                  className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap'
                >
                  Xóa
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tasks}
      rowKey='id'
      pagination={{
        current: pagination?.page || 1,
        pageSize: pagination?.limit || 15,
        total: pagination?.total || 0,
        onChange: onPaginationChange,
        showSizeChanger: true,
        pageSizeOptions: ['15', '20', '50', '100'],
        defaultPageSize: 15,
        showTotal: total => `Tổng số ${total}`,
        locale: { items_per_page: '/ Trang' },
      }}
      bordered
      loading={loading}
      defaultSortOrder='ascend'
    />
  );
}
