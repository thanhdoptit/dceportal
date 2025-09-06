import api from './api.js';

export const backupService = {
  /**
   * Lấy danh sách backup jobs
   */
  async getBackupJobs(params = {}) {
    try {
      const response = await api.get('/api/backup', { params });
      return response.data;
    } catch (error) {
      console.error('Get backup jobs error:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết backup job
   */
  async getBackupJobDetail(id) {
    try {
      const response = await api.get(`/api/backup/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get backup job detail error:', error);
      throw error;
    }
  },

  /**
   * Cập nhật trạng thái backup job
   */
  async updateJobStatus(jobId, status, checkedBy = null) {
    try {
      const data = { status };
      if (checkedBy) {
        data.checked_by = checkedBy;
      }

      const response = await api.patch(`/api/backup/${jobId}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Update job status error:', error);
      throw error;
    }
  },

  /**
   * Lấy thống kê backup jobs
   */
  async getBackupStats() {
    try {
      const response = await api.get('/api/backup/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Get backup stats error:', error);
      throw error;
    }
  },

  /**
   * Tạo backup job mới
   */
  async createBackupJob(jobData) {
    try {
      const response = await api.post('/api/backup', jobData);
      return response.data;
    } catch (error) {
      console.error('Create backup job error:', error);
      throw error;
    }
  },

  /**
   * Xóa backup job
   */
  async deleteBackupJob(jobId) {
    try {
      const response = await api.delete(`/api/backup/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Delete backup job error:', error);
      throw error;
    }
  },

  /**
   * Import dữ liệu backup từ Excel
   */
  async importBackupData(rawData) {
    try {
      const response = await api.post('/api/backup/import', { rawData });
      return response.data;
    } catch (error) {
      console.error('Import backup data error:', error);
      throw error;
    }
  },

  /**
   * Parse dữ liệu Excel thành format phù hợp
   */
  parseExcelData(excelData) {
    const result = {
      goodsync: [],
      export_check: [],
    };

    // Parse phần GoodSync
    if (excelData.goodsync) {
      result.goodsync = excelData.goodsync.map((row, index) => ({
        client_ip: row.client_ip || '',
        export_path: row.export_path || '',
        local_check_path: row.local_check_path || '',
        export_files: row.export_files || '',
        schedule_info: row.schedule_info || '',
      }));
    }

    // Parse phần Export Check
    if (excelData.export_check) {
      result.export_check = excelData.export_check.map((row, index) => ({
        job_name: row.job_name || '',
        export_path: row.export_path || '',
        local_check_path: row.local_check_path || '',
        tape_label: row.tape_label || '',
        end_time: row.end_time || '',
        backup_result: row.backup_result || '',
        checked_by: row.checked_by || '',
        schedule_info: row.schedule_info || '',
      }));
    }

    return result;
  },
};
