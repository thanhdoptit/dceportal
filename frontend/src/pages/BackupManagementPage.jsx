import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Space, message } from 'antd';
import React, { useEffect, useState } from 'react';
import BackupJobTable from '../components/backup/BackupJobTable.jsx';
import BackupStats from '../components/backup/BackupStats.jsx';
import CreateBackupJobModal from '../components/backup/CreateBackupJobModal.jsx';
import ImportBackupModal from '../components/backup/ImportBackupModal.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { backupService } from '../services/backupService.js';
import '../styles/BackupManagement.css';

const BackupManagementPage = () => {
  console.log('BackupManagementPage: Component loaded');

  const { currentUser } = useAuth();
  console.log('BackupManagementPage: currentUser', currentUser);

  const [loading, setLoading] = useState(false);
  const [backupJobs, setBackupJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // Load dữ liệu
  const loadBackupJobs = async (page = 1, pageSize = 20, filters = {}) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pageSize,
        ...filters,
      };

      const response = await backupService.getBackupJobs(params);

      if (response.success) {
        setBackupJobs(response.data);
        setPagination({
          current: response.pagination.current_page,
          pageSize: response.pagination.items_per_page,
          total: response.pagination.total_items,
        });
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách backup jobs');
      console.error('Load backup jobs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await backupService.getBackupStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  useEffect(() => {
    console.log('BackupManagementPage: useEffect triggered');
    loadBackupJobs();
    loadStats();
  }, []);

  // Xử lý thay đổi trang
  const handleTableChange = (pagination, filters, sorter) => {
    const newFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].length > 0) {
        newFilters[key] = filters[key][0];
      }
    });

    setFilters(newFilters);
    loadBackupJobs(pagination.current, pagination.pageSize, newFilters);
  };

  // Xử lý cập nhật trạng thái
  const handleStatusUpdate = async (jobId, status) => {
    try {
      const response = await backupService.updateJobStatus(jobId, status, currentUser?.fullname);
      if (response.success) {
        message.success('Cập nhật trạng thái thành công');
        loadBackupJobs(pagination.current, pagination.pageSize, filters);
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái');
      console.error('Update status error:', error);
    }
  };

  // Xử lý import dữ liệu
  const handleImport = async data => {
    try {
      const response = await backupService.importBackupData(data);
      if (response.success) {
        message.success(`Import thành công ${response.results.length} jobs`);
        setImportModalVisible(false);
        loadBackupJobs();
        loadStats();
      }
    } catch (error) {
      message.error('Lỗi khi import dữ liệu');
      console.error('Import error:', error);
    }
  };

  // Xử lý tạo job mới
  const handleCreateJob = async jobData => {
    try {
      const response = await backupService.createBackupJob(jobData);
      if (response.success) {
        message.success('Tạo backup job thành công');
        setCreateModalVisible(false);
        loadBackupJobs();
        loadStats();
      }
    } catch (error) {
      message.error('Lỗi khi tạo backup job');
      console.error('Create job error:', error);
    }
  };

  // Xử lý xóa job
  const handleDeleteJob = async jobId => {
    try {
      const response = await backupService.deleteBackupJob(jobId);
      if (response.success) {
        message.success('Xóa backup job thành công');
        loadBackupJobs(pagination.current, pagination.pageSize, filters);
        loadStats();
      }
    } catch (error) {
      message.error('Lỗi khi xóa backup job');
      console.error('Delete job error:', error);
    }
  };

  console.log('BackupManagementPage: Rendering component');

  return (
    <div className='backup-management-page'>
      <div className='page-header'>
        <h1>Quản lý Backup Jobs</h1>
        <p>Quản lý và theo dõi các job backup từ CommVault và các hệ thống khác</p>
      </div>

      {/* Thống kê */}
      <BackupStats stats={stats} />

      {/* Actions */}
      <Card className='actions-section'>
        <Space>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
            disabled={!['admin', 'datacenter'].includes(currentUser?.role)}
          >
            Tạo Job Mới
          </Button>
          <Button
            icon={<UploadOutlined />}
            onClick={() => setImportModalVisible(true)}
            disabled={!['admin', 'datacenter'].includes(currentUser?.role)}
          >
            Import từ Excel
          </Button>
          <Button onClick={() => loadBackupJobs()}>Làm mới</Button>
        </Space>
      </Card>

      {/* Bảng dữ liệu */}
      <Card title='Danh sách Backup Jobs' className='table-section'>
        <BackupJobTable
          dataSource={backupJobs}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteJob}
          userRole={currentUser?.role}
        />
      </Card>

      {/* Modals */}
      <ImportBackupModal
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onImport={handleImport}
      />

      <CreateBackupJobModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onCreate={handleCreateJob}
      />
    </div>
  );
};

export default BackupManagementPage;
