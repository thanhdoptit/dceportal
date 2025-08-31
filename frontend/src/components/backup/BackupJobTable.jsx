import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, Select, Tooltip, Popconfirm, Row, Col } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { formatDateTime } from '../../utils/dateUtils.js';

const { Option } = Select;

const BackupJobTable = ({ 
  dataSource, 
  loading, 
  pagination, 
  onChange, 
  onStatusUpdate, 
  onDelete,
  userRole 
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Định nghĩa cột
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left'
    },
    {
      title: 'Tên Job',
      dataIndex: 'job_name',
      key: 'job_name',
      width: 200,
      fixed: 'left',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.client_name}
          </div>
        </div>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'job_type',
      key: 'job_type',
      width: 120,
      render: (type) => {
        const typeConfig = {
          'EXPORT': { color: 'blue', text: 'Export' },
          'BACKUP_DISK': { color: 'green', text: 'Backup DISK' },
          'BACKUP_TAPE': { color: 'orange', text: 'Backup TAPE' },
          'SYNC': { color: 'purple', text: 'Sync' }
        };
        const config = typeConfig[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Export', value: 'EXPORT' },
        { text: 'Backup DISK', value: 'BACKUP_DISK' },
        { text: 'Backup TAPE', value: 'BACKUP_TAPE' },
        { text: 'Sync', value: 'SYNC' }
      ]
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status, record) => {
        const statusConfig = {
          'RUNNING': { 
            color: 'processing', 
            icon: <SyncOutlined spin />, 
            text: 'Đang chạy' 
          },
          'COMPLETED': { 
            color: 'success', 
            icon: <CheckCircleOutlined />, 
            text: 'Hoàn thành' 
          },
          'FAILED': { 
            color: 'error', 
            icon: <ExclamationCircleOutlined />, 
            text: 'Lỗi' 
          },
          'PENDING': { 
            color: 'default', 
            icon: <ClockCircleOutlined />, 
            text: 'Chờ xử lý' 
          },
          'COMPLETED_WITH_WARNINGS': { 
            color: 'warning', 
            icon: <ExclamationCircleOutlined />, 
            text: 'Hoàn thành có cảnh báo' 
          }
        };
        const config = statusConfig[status] || { color: 'default', icon: null, text: status };
        
        return (
          <div>
            <Tag color={config.color} icon={config.icon}>
              {config.text}
            </Tag>
            {record.checked_by && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Kiểm tra bởi: {record.checked_by}
              </div>
            )}
          </div>
        );
      },
      filters: [
        { text: 'Đang chạy', value: 'RUNNING' },
        { text: 'Hoàn thành', value: 'COMPLETED' },
        { text: 'Lỗi', value: 'FAILED' },
        { text: 'Chờ xử lý', value: 'PENDING' },
        { text: 'Hoàn thành có cảnh báo', value: 'COMPLETED_WITH_WARNINGS' }
      ]
    },
    {
      title: 'Client IP',
      dataIndex: 'client_ip',
      key: 'client_ip',
      width: 150,
      render: (ip) => ip ? <code>{ip}</code> : '-'
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 200,
      render: (_, record) => (
        <div>
          {record.start_time && (
            <div>Bắt đầu: {formatDateTime(record.start_time)}</div>
          )}
          {record.end_time && (
            <div>Kết thúc: {formatDateTime(record.end_time)}</div>
          )}
          {record.scheduled_time && (
            <div>Lên lịch: {record.scheduled_time}</div>
          )}
        </div>
      )
    },
    {
      title: 'Dữ liệu',
      key: 'data',
      width: 150,
      render: (_, record) => (
        <div>
          {record.export_files && (
            <div>Files: {record.export_files}</div>
          )}
          {record.data_size && (
            <div>Size: {(record.data_size / 1024 / 1024).toFixed(2)} MB</div>
          )}
        </div>
      )
    },
    {
      title: 'Tape Label',
      dataIndex: 'tape_label',
      key: 'tape_label',
      width: 120,
      render: (label) => label ? <Tag color="orange">{label}</Tag> : '-'
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          
          {['admin', 'datacenter'].includes(userRole) && (
            <>
              <Tooltip title="Cập nhật trạng thái">
                <Select
                  size="small"
                  style={{ width: 120 }}
                  value={record.status}
                  onChange={(value) => handleStatusChange(record.id, value)}
                >
                  <Option value="PENDING">Chờ xử lý</Option>
                  <Option value="RUNNING">Đang chạy</Option>
                  <Option value="COMPLETED">Hoàn thành</Option>
                  <Option value="FAILED">Lỗi</Option>
                  <Option value="COMPLETED_WITH_WARNINGS">Hoàn thành có cảnh báo</Option>
                </Select>
              </Tooltip>
              
              {userRole === 'admin' && (
                <Tooltip title="Xóa">
                  <Popconfirm
                    title="Bạn có chắc muốn xóa job này?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </Tooltip>
              )}
            </>
          )}
        </Space>
      )
    }
  ];

  // Xử lý xem chi tiết
  const handleViewDetail = (job) => {
    setSelectedJob(job);
    setDetailModalVisible(true);
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (jobId, status) => {
    onStatusUpdate(jobId, status);
  };

  // Xử lý xóa
  const handleDelete = (jobId) => {
    onDelete(jobId);
  };

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        onChange={onChange}
        rowSelection={rowSelection}
        rowKey="id"
        scroll={{ x: 1500 }}
        size="middle"
      />

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết Backup Job"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedJob && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <h4>Thông tin cơ bản</h4>
                <p><strong>ID:</strong> {selectedJob.id}</p>
                <p><strong>Tên Job:</strong> {selectedJob.job_name}</p>
                <p><strong>Loại:</strong> {selectedJob.job_type}</p>
                <p><strong>Trạng thái:</strong> {selectedJob.status}</p>
                <p><strong>Client:</strong> {selectedJob.client_name} ({selectedJob.client_ip})</p>
              </Col>
              <Col span={12}>
                <h4>Thời gian</h4>
                <p><strong>Bắt đầu:</strong> {selectedJob.start_time ? formatDateTime(selectedJob.start_time) : '-'}</p>
                <p><strong>Kết thúc:</strong> {selectedJob.end_time ? formatDateTime(selectedJob.end_time) : '-'}</p>
                <p><strong>Lên lịch:</strong> {selectedJob.scheduled_time || '-'}</p>
                <p><strong>Kiểm tra:</strong> {selectedJob.checked_at ? formatDateTime(selectedJob.checked_at) : '-'}</p>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <h4>Đường dẫn</h4>
                <p><strong>Export Path:</strong> {selectedJob.export_path || '-'}</p>
                <p><strong>Local Check Path:</strong> {selectedJob.local_check_path || '-'}</p>
                <p><strong>Backup Disk Path:</strong> {selectedJob.backup_disk_path || '-'}</p>
                <p><strong>Backup Tape Path:</strong> {selectedJob.backup_tape_path || '-'}</p>
              </Col>
              <Col span={12}>
                <h4>Thông tin khác</h4>
                <p><strong>Export Files:</strong> {selectedJob.export_files || '-'}</p>
                <p><strong>Data Size:</strong> {selectedJob.data_size ? `${(selectedJob.data_size / 1024 / 1024).toFixed(2)} MB` : '-'}</p>
                <p><strong>Tape Label:</strong> {selectedJob.tape_label || '-'}</p>
                <p><strong>CommVault Job ID:</strong> {selectedJob.commvault_job_id || '-'}</p>
              </Col>
            </Row>
            
            {selectedJob.description && (
              <div style={{ marginTop: 16 }}>
                <h4>Mô tả</h4>
                <p>{selectedJob.description}</p>
              </div>
            )}
            
            {selectedJob.error_description && (
              <div style={{ marginTop: 16 }}>
                <h4>Lỗi</h4>
                <p style={{ color: '#ff4d4f' }}>{selectedJob.error_description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default BackupJobTable; 