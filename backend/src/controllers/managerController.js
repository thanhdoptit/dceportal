import db from '../models/index.js';
import { Op } from 'sequelize';
import { subDays, format } from 'date-fns';

/**
 * Lấy thống kê tổng quan cho dashboard
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getStats = async (req, res) => {
  try {
    // Mặc định lấy dữ liệu 7 ngày gần nhất nếu không có tham số
    const endDate = req.query.endDate || format(new Date(), 'yyyy-MM-dd');
    const startDate = req.query.startDate || format(subDays(new Date(), 7), 'yyyy-MM-dd');
    
    // Lấy tổng số nhân viên
    const totalUsers = await db.User.count();
    
    // Lấy số ca làm việc đang diễn ra
    const activeShifts = await db.WorkShift.count({
      where: {
        status: 'active'
      }
    });
    
    // Lấy thống kê bàn giao
    const handovers = await db.ShiftHandover.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    
    const completedHandovers = handovers.filter(h => h.status === 'completed').length;
    const pendingHandovers = handovers.filter(h => h.status === 'pending').length;
    
    // Lấy thống kê công việc
    const tasks = await db.Task.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    
    // Lấy thống kê ca làm việc
    const shifts = await db.WorkShift.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    
    const totalShifts = shifts.length;
    const completedShifts = shifts.filter(s => s.status === 'completed').length;
    const ongoingShifts = shifts.filter(s => s.status === 'active').length;

    // Trả về kết quả
    return res.status(200).json({
      totalUsers,
      activeShifts,
      completedHandovers,
      pendingHandovers,
      totalTasks,
      completedTasks,
      inProgressTasks,
      totalShifts,
      completedShifts,
      ongoingShifts
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
    return res.status(500).json({ 
      message: 'Lỗi khi lấy thống kê',
      error: error.message 
    });
  }
};

/**
 * Lấy danh sách bàn giao gần đây
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getRecentHandovers = async (req, res) => {
  try {
    // Mặc định lấy dữ liệu 7 ngày gần nhất nếu không có tham số
    const endDate = req.query.endDate || format(new Date(), 'yyyy-MM-dd');
    const startDate = req.query.startDate || format(subDays(new Date(), 7), 'yyyy-MM-dd');
    
    // Lấy danh sách bàn giao với thông tin liên quan
    const handovers = await db.ShiftHandover.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: db.User,
          as: 'FromUser',
          attributes: ['id', 'fullname']
        },
        {
          model: db.User,
          as: 'ToUser',
          attributes: ['id', 'fullname']
        },
        {
          model: db.WorkShift,
          as: 'FromShift',
          attributes: ['id', 'code']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Trả về kết quả
    return res.status(200).json(handovers);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bàn giao:', error);
    return res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách bàn giao gần đây',
      error: error.message 
    });
  }
};

/**
 * Lấy thống kê chi tiết theo ngày
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getDailyStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp khoảng thời gian',
        error: 'Thiếu tham số startDate hoặc endDate'
      });
    }

    // Lấy thống kê công việc theo ngày
    const dailyTasks = await db.Task.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total'],
        [db.sequelize.literal('SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END)'), 'completed']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'ASC']]
    });

    // Lấy thống kê ca làm việc theo ngày
    const dailyShifts = await db.WorkShift.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total'],
        [db.sequelize.literal('SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END)'), 'completed']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'ASC']]
    });

    return res.status(200).json({
      tasks: dailyTasks,
      shifts: dailyShifts
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê theo ngày:', error);
    return res.status(500).json({
      message: 'Lỗi khi lấy thống kê theo ngày',
      error: error.message
    });
  }
};

/**
 * Lấy danh sách công việc gần đây
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getRecentTasks = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp khoảng thời gian',
        error: 'Thiếu tham số startDate hoặc endDate'
      });
    }

    const tasks = await db.Task.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: db.User,
          as: 'AssignedTo',
          attributes: ['id', 'fullname']
        },
        {
          model: db.WorkShift,
          attributes: ['id', 'code']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách công việc:', error);
    return res.status(500).json({
      message: 'Lỗi khi lấy danh sách công việc gần đây',
      error: error.message
    });
  }
};

/**
 * Lấy thống kê nhân viên
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getEmployeeStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp khoảng thời gian',
        error: 'Thiếu tham số startDate hoặc endDate'
      });
    }

    // Lấy thống kê công việc theo nhân viên
    const employeeTasks = await db.Task.findAll({
      attributes: [
        'assignedToId',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalTasks'],
        [db.sequelize.literal('SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END)'), 'completedTasks']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: db.User,
          as: 'AssignedTo',
          attributes: ['id', 'fullname']
        }
      ],
      group: ['assignedToId'],
      order: [[db.sequelize.literal('totalTasks'), 'DESC']],
      limit: 5
    });

    // Lấy thống kê ca làm việc theo nhân viên
    const employeeShifts = await db.WorkShift.findAll({
      attributes: [
        'userId',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalShifts'],
        [db.sequelize.literal('SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END)'), 'completedShifts']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'fullname']
        }
      ],
      group: ['userId'],
      order: [[db.sequelize.literal('totalShifts'), 'DESC']],
      limit: 5
    });

    return res.status(200).json({
      tasks: employeeTasks,
      shifts: employeeShifts
    });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê nhân viên:', error);
    return res.status(500).json({
      message: 'Lỗi khi lấy thống kê nhân viên',
      error: error.message
    });
  }
}; 