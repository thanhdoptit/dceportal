import db from '../models/index.js';
import { Op } from 'sequelize';

const { WorkShift, User, WorkSession } = db;

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
    
    const shift = await WorkShift.findOne({
      where: { code: shiftId },
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

// Tìm ca theo pattern (H, V, T) - không giới hạn status
export const getShiftsByPattern = async (req, res) => {
  try {
    const { pattern, date } = req.query;
    
    if (!pattern) {
      return res.status(400).json({
        success: false,
        message: 'Pattern parameter is required (H, V, T)'
      });
    }
    
    // Xây dựng điều kiện query
    const whereCondition = {
      code: {
        [Op.like]: `${pattern}%` // Tìm ca bắt đầu bằng pattern
      }
    };
    
    // Filter theo ngày nếu có
    if (date) {
      whereCondition.date = date;
    }
    
    console.log('🔍 Querying shifts with pattern:', pattern, 'condition:', whereCondition);
    
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
      order: [
        ['date', 'DESC'],
        ['code', 'ASC']
      ]
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
    
    const totalShifts = formattedShifts.length;
    const totalMembers = formattedShifts.reduce((sum, shift) => sum + shift.members.length, 0);
    
    console.log(`✅ Found ${totalShifts} shifts with pattern '${pattern}' and ${totalMembers} total members`);
    
    res.json({
      success: true,
      data: {
        pattern,
        date: date || 'all',
        shifts: formattedShifts,
        summary: {
          totalShifts,
          totalMembers
        }
      },
      message: `Đã tìm thấy ${totalShifts} ca với pattern '${pattern}' và ${totalMembers} thành viên`
    });
    
  } catch (error) {
    console.error('❌ Error in getShiftsByPattern:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tìm ca theo pattern',
      error: error.message
    });
  }
};

// Lấy số điện thoại user trong ca đang active theo pattern (H, V, T)
export const getActiveShiftPhones = async (req, res) => {
  try {
    const { pattern, date } = req.query;
    
    if (!pattern) {
      return res.status(400).json({
        success: false,
        message: 'Pattern parameter is required (H, V, T)'
      });
    }
    
    // Xây dựng điều kiện query - chỉ lấy ca đang active
    const whereCondition = {
      status: {
        [Op.in]: ['doing', 'handover'] // Chỉ lấy ca đang làm việc hoặc đang bàn giao
      },
      code: {
        [Op.like]: `${pattern}%` // Tìm ca bắt đầu bằng pattern
      }
    };
    
    // Filter theo ngày nếu có
    if (date) {
      whereCondition.date = date;
    }
    
    console.log('📞 Querying active shift phones with pattern:', pattern, 'condition:', whereCondition);
    
    const shifts = await WorkShift.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'Users',
          through: { attributes: [] },
          attributes: ['username', 'phone'] // Chỉ lấy username và phone
        }
      ],
      attributes: ['code', 'name', 'date', 'status'],
      order: [
        ['date', 'DESC'],
        ['code', 'ASC']
      ]
    });
    
    // Format dữ liệu trả về - chỉ focus vào phone numbers
    const formattedShifts = shifts.map(shift => ({
      shiftCode: shift.code,
      shiftName: shift.name,
      date: shift.date,
      status: shift.status,
      phones: shift.Users
        .filter(user => user.phone) // Chỉ lấy user có phone
        .map(user => ({
          username: user.username,
          phone: user.phone
        }))
    }));
    
    // Tạo danh sách phone numbers duy nhất
    const allPhones = [];
    const phoneMap = new Map(); // Để tránh duplicate
    
    formattedShifts.forEach(shift => {
      shift.phones.forEach(user => {
        if (!phoneMap.has(user.phone)) {
          phoneMap.set(user.phone, user);
          allPhones.push(user);
        }
      });
    });
    
    const totalShifts = formattedShifts.length;
    const totalPhones = allPhones.length;
    
    console.log(`📞 Found ${totalShifts} active shifts with pattern '${pattern}' and ${totalPhones} unique phone numbers`);
    
    res.json({
      success: true,
      data: {
        pattern,
        date: date || new Date().toISOString().split('T')[0],
        shifts: formattedShifts,
        phoneList: allPhones, // Danh sách phone numbers duy nhất
        summary: {
          totalShifts,
          totalPhones,
          totalUsers: allPhones.length
        }
      },
      message: `Đã tìm thấy ${totalShifts} ca đang active với pattern '${pattern}' và ${totalPhones} số điện thoại`
    });
    
  } catch (error) {
    console.error('❌ Error in getActiveShiftPhones:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy số điện thoại ca làm việc',
      error: error.message
    });
  }
};

// Public API không cần authentication - có thể fetch trực tiếp 