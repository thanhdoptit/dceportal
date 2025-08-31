import db from '../models/index.js';
import { Op } from 'sequelize';
import { publicAPIConfig } from '../config/publicAPI.js';

const { WorkShift, User, WorkSession } = db;

// Middleware kiểm tra API key
const validateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required'
    });
  }
  
  if (apiKey !== publicAPIConfig.apiKey) {
    return res.status(403).json({
      success: false,
      message: 'Invalid API key'
    });
  }
  
  next();
};

// Lấy thông tin thành viên các ca đang làm việc
export const getActiveShiftMembers = async (req, res) => {
  try {
    const { date, location } = req.query;
    
    // Xây dựng điều kiện query
    const whereCondition = {
      status: {
        [Op.in]: ['doing', 'handover'] // Chỉ lấy ca đang làm việc hoặc đang bàn giao
      }
    };
    
    // Filter theo ngày nếu có
    if (date) {
      whereCondition.date = date;
    } else {
      // Mặc định lấy ngày hôm nay
      const today = new Date().toISOString().split('T')[0];
      whereCondition.date = today;
    }
    
    // Filter theo location nếu có
    if (location) {
      whereCondition.code = {
        [Op.like]: `${location}%`
      };
    }
    
    console.log('🔍 Querying active shifts with condition:', whereCondition);
    
    // Lấy danh sách ca đang làm việc
    const activeShifts = await WorkShift.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'Users',
          through: { attributes: [] },
          attributes: ['username', 'email', 'phone']
        }
      ],
      attributes: ['code', 'name', 'date', 'status'],
      order: [
        ['date', 'ASC'],
        ['code', 'ASC']
      ]
    });
    
    // Format dữ liệu trả về gọn gàng
    const formattedShifts = activeShifts.map(shift => ({
      shiftCode: shift.code,
      shiftName: shift.name,
      date: shift.date,
      status: shift.status,
      members: shift.Users.map(user => ({
        username: user.username,
        email: user.email,
        phone: user.phone
      }))
    }));
    
    // Thống kê tổng quan
    const totalShifts = formattedShifts.length;
    const totalMembers = formattedShifts.reduce((sum, shift) => sum + shift.members.length, 0);
    
    console.log(`✅ Found ${totalShifts} active shifts with ${totalMembers} total members`);
    
    res.json({
      success: true,
      data: {
        shifts: formattedShifts,
        summary: {
          totalShifts,
          totalMembers,
          date: date || new Date().toISOString().split('T')[0],
          location: location || 'all'
        }
      },
      message: `Đã tìm thấy ${totalShifts} ca đang làm việc với ${totalMembers} thành viên`
    });
    
  } catch (error) {
    console.error('❌ Error in getActiveShiftMembers:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin thành viên ca làm việc',
      error: error.message
    });
  }
};

// Lấy thông tin chi tiết một ca cụ thể
export const getShiftDetails = async (req, res) => {
  try {
    const { shiftId } = req.params;
    
    const shift = await WorkShift.findByPk(shiftId, {
      include: [
        {
          model: User,
          as: 'Users',
          through: { attributes: [] },
          attributes: ['username', 'email', 'phone']
        }
      ],
      attributes: ['code', 'name', 'date', 'status']
    });
    
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ca làm việc'
      });
    }
    
    const formattedShift = {
      shiftCode: shift.code,
      shiftName: shift.name,
      date: shift.date,
      status: shift.status,
      members: shift.Users.map(user => ({
        username: user.username,
        email: user.email,
        phone: user.phone
      }))
    };
    
    res.json({
      success: true,
      data: formattedShift
    });
    
  } catch (error) {
    console.error('❌ Error in getShiftDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin chi tiết ca làm việc',
      error: error.message
    });
  }
};

// Lấy danh sách tất cả ca đang active (có thể filter theo ngày hoặc lấy tất cả)
export const getAllShifts = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Xây dựng điều kiện query - chỉ lấy ca đang active
    const whereCondition = {
      status: {
        [Op.in]: ['doing', 'handover'] // Chỉ lấy ca đang làm việc hoặc đang bàn giao
      },
      // Lọc cả ca V và H
      code: {
        [Op.or]: [
          { [Op.like]: '%V%' },
          { [Op.like]: '%H%' }
        ]
      }
    };
    
    // Chỉ filter theo ngày nếu có tham số date
    if (date) {
      whereCondition.date = date;
    }
    
    const shifts = await WorkShift.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'Users',
          through: { attributes: [] },
          attributes: ['username', 'email', 'phone']
        }
      ],
      attributes: ['code', 'name', 'date', 'status'],
      order: [['date', 'DESC'], ['code', 'ASC']]
    });
    
    const formattedShifts = shifts.map(shift => ({
      shiftCode: shift.code,
      shiftName: shift.name,
      date: shift.date,
      status: shift.status,
      members: shift.Users.map(user => ({
        username: user.username,
        email: user.email,
        phone: user.phone
      }))
    }));
    
    res.json({
      success: true,
      data: {
        date: date || 'all',
        shifts: formattedShifts,
        totalShifts: formattedShifts.length,
        totalMembers: formattedShifts.reduce((sum, shift) => sum + shift.members.length, 0)
      },
      message: `Đã tìm thấy ${formattedShifts.length} ca đang active với ${formattedShifts.reduce((sum, shift) => sum + shift.members.length, 0)} thành viên`
    });
    
  } catch (error) {
    console.error('❌ Error in getAllShifts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách ca làm việc',
      error: error.message
    });
  }
};

export { validateAPIKey }; 