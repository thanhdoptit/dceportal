import db from '../models/index.js';
const { BackupJob, BackupDetail, sequelize } = db;

class BackupDataService {
  
  /**
   * Parse dữ liệu từ bảng Excel và chuyển thành object
   */
  parseExcelData(rawData) {
    const jobs = [];
    
    // Xử lý phần "Chạy đồng bộ GoodSync"
    if (rawData.goodsync) {
      rawData.goodsync.forEach((row, index) => {
        if (row.client_ip && row.export_path) {
          jobs.push({
            job_name: `GoodSync_${index + 1}`,
            job_type: 'SYNC',
            client_ip: this.extractIP(row.client_ip),
            client_name: this.extractClientName(row.client_ip),
            export_path: row.export_path,
            local_check_path: row.local_check_path,
            export_files: row.export_files,
            data_size: this.parseDataSize(row.export_files),
            schedule_info: row.schedule_info,
            description: 'Đồng bộ GoodSync'
          });
        }
      });
    }
    
    // Xử lý phần "Kiểm tra Export"
    if (rawData.export_check) {
      rawData.export_check.forEach((row, index) => {
        if (row.job_name) {
          jobs.push({
            job_name: row.job_name,
            job_type: 'EXPORT',
            client_ip: '10.6.176.66', // CS-HL-SVR
            client_name: 'CS-HL-SVR',
            export_path: row.export_path,
            local_check_path: row.local_check_path,
            tape_label: row.tape_label,
            end_time: this.parseTimeString(row.end_time),
            backup_result: row.backup_result,
            checked_by: row.checked_by,
            schedule_info: row.schedule_info,
            description: 'Export database'
          });
        }
      });
    }
    
    return jobs;
  }
  
  /**
   * Trích xuất IP từ chuỗi client
   */
  extractIP(clientString) {
    if (!clientString || typeof clientString !== 'string') {
      return null;
    }
    const ipMatch = clientString.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/);
    return ipMatch ? ipMatch[0] : null;
  }
  
  /**
   * Trích xuất tên client từ chuỗi
   */
  extractClientName(clientString) {
    if (!clientString || typeof clientString !== 'string') {
      return '';
    }
    // Loại bỏ IP và dấu ngoặc
    return clientString.replace(/\([^)]*\)/g, '').trim();
  }
  
  /**
   * Parse kích thước dữ liệu từ chuỗi
   */
  parseDataSize(sizeString) {
    if (!sizeString || typeof sizeString !== 'string') return null;
    
    // Ví dụ: "25 files", "116 folders, 1.250 files"
    const fileMatch = sizeString.match(/(\d+(?:\.\d+)?)\s*files?/i);
    if (fileMatch) {
      return parseInt(fileMatch[1].replace('.', ''));
    }
    
    return null;
  }
  
  /**
   * Parse thời gian từ chuỗi
   */
  parseTimeString(timeString) {
    if (!timeString || typeof timeString !== 'string') return null;
    
    // Ví dụ: "14h06", "01h52"
    const timeMatch = timeString.match(/(\d{1,2})h(\d{2})/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      
      const now = new Date();
      const result = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      
      // Nếu thời gian đã qua trong ngày hôm nay, giả sử là ngày hôm qua
      if (result < now) {
        result.setDate(result.getDate() - 1);
      }
      
      return result;
    }
    
    return null;
  }
  
  /**
   * Import dữ liệu vào database
   */
  async importBackupData(rawData) {
    try {
      const jobs = this.parseExcelData(rawData);
      const results = [];
      
      for (const jobData of jobs) {
        // Kiểm tra job đã tồn tại chưa
        const existingJob = await BackupJob.findOne({
          where: {
            job_name: jobData.job_name,
            client_ip: jobData.client_ip
          }
        });
        
        if (existingJob) {
          // Cập nhật job hiện có
          await existingJob.update(jobData);
          results.push({
            action: 'updated',
            job_name: jobData.job_name,
            id: existingJob.id
          });
        } else {
          // Tạo job mới
          const newJob = await BackupJob.create(jobData);
          results.push({
            action: 'created',
            job_name: jobData.job_name,
            id: newJob.id
          });
        }
      }
      
      return {
        success: true,
        message: `Import thành công ${jobs.length} jobs`,
        results
      };
      
    } catch (error) {
      console.error('Lỗi import backup data:', error);
      throw new Error(`Lỗi import dữ liệu: ${error.message}`);
    }
  }
  
  /**
   * Lấy danh sách backup jobs
   */
  async getBackupJobs(filters = {}) {
    try {
      const whereClause = {};
      
      if (filters.job_type) {
        whereClause.job_type = filters.job_type;
      }
      
      if (filters.status) {
        whereClause.status = filters.status;
      }
      
      if (filters.client_ip) {
        whereClause.client_ip = filters.client_ip;
      }
      
      const jobs = await BackupJob.findAll({
        where: whereClause,
        order: [['created_at', 'DESC']],
        include: [{
          model: BackupDetail,
          as: 'details'
        }]
      });
      
      return jobs;
      
    } catch (error) {
      console.error('Lỗi lấy danh sách backup jobs:', error);
      throw error;
    }
  }
  
  /**
   * Cập nhật trạng thái job
   */
  async updateJobStatus(jobId, status, checkedBy = null) {
    try {
      const job = await BackupJob.findByPk(jobId);
      if (!job) {
        throw new Error('Không tìm thấy job');
      }
      
      const updateData = { status };
      if (checkedBy) {
        updateData.checked_by = checkedBy;
        updateData.checked_at = new Date();
      }
      
      await job.update(updateData);
      
      return job;
      
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái job:', error);
      throw error;
    }
  }
  
  /**
   * Lấy backup job theo ID
   */
  async getBackupJobById(id) {
    try {
      const job = await BackupJob.findByPk(id, {
        include: [{
          model: BackupDetail,
          as: 'details'
        }]
      });
      
      return job;
      
    } catch (error) {
      console.error('Lỗi lấy backup job:', error);
      throw error;
    }
  }
  
  /**
   * Tạo backup job mới
   */
  async createBackupJob(jobData) {
    try {
      const job = await BackupJob.create(jobData);
      return job;
      
    } catch (error) {
      console.error('Lỗi tạo backup job:', error);
      throw error;
    }
  }
  
  /**
   * Xóa backup job
   */
  async deleteBackupJob(id) {
    try {
      const job = await BackupJob.findByPk(id);
      if (!job) {
        return false;
      }
      
      await job.destroy();
      return true;
      
    } catch (error) {
      console.error('Lỗi xóa backup job:', error);
      throw error;
    }
  }
  
  /**
   * Thống kê backup jobs
   */
  async getBackupStats() {
    try {
      const stats = await BackupJob.findAll({
        attributes: [
          'job_type',
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['job_type', 'status']
      });
      
      return stats;
      
    } catch (error) {
      console.error('Lỗi lấy thống kê backup:', error);
      throw error;
    }
  }
}

export default new BackupDataService(); 