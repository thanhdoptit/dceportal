import backupDataService from '../services/backupDataService.js';

/**
 * Import dữ liệu backup từ Excel
 */
export const importBackupData = async (req, res) => {
  try {
    const { rawData } = req.body;
    
    if (!rawData) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không được để trống'
      });
    }
    
    const result = await backupDataService.importBackupData(rawData);
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Lỗi import backup data:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Lấy danh sách backup jobs
 */
export const getBackupJobs = async (req, res) => {
  try {
    const { job_type, status, client_ip, page = 1, limit = 20 } = req.query;
    
    const filters = {};
    if (job_type) filters.job_type = job_type;
    if (status) filters.status = status;
    if (client_ip) filters.client_ip = client_ip;
    
    const jobs = await backupDataService.getBackupJobs(filters);
    
    // Phân trang
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedJobs = jobs.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      data: paginatedJobs,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(jobs.length / limit),
        total_items: jobs.length,
        items_per_page: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Lỗi lấy danh sách backup jobs:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Lấy chi tiết backup job
 */
export const getBackupJobDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await backupDataService.getBackupJobById(id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy backup job'
      });
    }
    
    res.status(200).json({
      success: true,
      data: job
    });
    
  } catch (error) {
    console.error('Lỗi lấy chi tiết backup job:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Cập nhật trạng thái backup job
 */
export const updateBackupJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, checked_by } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không được để trống'
      });
    }
    
    const job = await backupDataService.updateJobStatus(id, status, checked_by);
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: job
    });
    
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái backup job:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Lấy thống kê backup jobs
 */
export const getBackupStats = async (req, res) => {
  try {
    const stats = await backupDataService.getBackupStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Lỗi lấy thống kê backup:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Tạo backup job mới
 */
export const createBackupJob = async (req, res) => {
  try {
    const jobData = req.body;
    
    // Validate dữ liệu
    if (!jobData.job_name || !jobData.job_type) {
      return res.status(400).json({
        success: false,
        message: 'Tên job và loại job không được để trống'
      });
    }
    
    const job = await backupDataService.createBackupJob(jobData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo backup job thành công',
      data: job
    });
    
  } catch (error) {
    console.error('Lỗi tạo backup job:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Xóa backup job
 */
export const deleteBackupJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await backupDataService.deleteBackupJob(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy backup job'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa backup job thành công'
    });
    
  } catch (error) {
    console.error('Lỗi xóa backup job:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 