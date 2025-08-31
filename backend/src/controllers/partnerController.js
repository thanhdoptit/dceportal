import db from '../models/index.js';
import { Op } from 'sequelize';

const Partners = db.Partners;

export const createPartner = async (req, res) => {
  try {
    const { fullname, donVi, email, phone, cccd } = req.body;

    // Tạo đối tác mới (validation đã được xử lý ở middleware)
    const partner = await Partners.create({
      fullname: fullname.trim(),
      donVi: donVi.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      cccd: cccd?.trim() || ''
    });

    res.status(201).json(partner);
  } catch (error) {
    console.error('Lỗi khi tạo đối tác:', error);

    // Xử lý các lỗi Sequelize cụ thể
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => {
        switch (err.path) {
          case 'fullname':
            return 'Họ tên đối tác là bắt buộc';
          case 'donVi':
            return 'Đơn vị là bắt buộc';
          case 'email':
            return 'Email không đúng định dạng';
          case 'phone':
            return 'Số điện thoại không đúng định dạng';
          case 'cccd':
            return 'Số thẻ nhân viên không đúng định dạng';
          default:
            return err.message;
        }
      });

      return res.status(400).json({
        message: 'Validation error',
        errors: errors
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      // Xác định trường nào bị trùng lặp
      const duplicateField = error.fields?.cccd ? 'cccd' : 'unknown';

      let errorMessage = 'Đã tồn tại đối tác với thông tin này';
      if (duplicateField === 'cccd') {
        errorMessage = 'Số thẻ nhân viên/CCCD đã tồn tại trong hệ thống';
      }

      return res.status(400).json({
        message: 'Validation error',
        errors: [errorMessage]
      });
    }

    // Lỗi khác
    res.status(500).json({
      message: 'Lỗi hệ thống',
      errors: ['Không thể tạo đối tác. Vui lòng thử lại sau.']
    });
  }
};

export const getPartners = async (req, res) => {
  try {
    const {
      keyword,
      donVi,
      startDate,
      endDate,
      page = 1,
      limit = 15
    } = req.query;

    const where = {};
    const offset = (page - 1) * limit;

    // Tìm kiếm theo keyword
    if (keyword) {
      where[Op.or] = [
        { fullname: { [Op.like]: `%${keyword}%` } },
        { donVi: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
        { phone: { [Op.like]: `%${keyword}%` } },
        { cccd: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // Filter theo đơn vị
    if (donVi && donVi !== 'Tất cả') {
      where.donVi = donVi;
    }

    // Filter theo thời gian
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const { count, rows } = await Partners.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      partners: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPartnerById = async (req, res) => {
  try {
    const partner = await Partners.findByPk(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Không tìm thấy đối tác' });
    res.json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePartner = async (req, res) => {
  try {
    const partner = await Partners.findByPk(req.params.id);
    if (!partner) {
      return res.status(404).json({
        message: 'Không tìm thấy đối tác',
        errors: ['Đối tác không tồn tại trong hệ thống']
      });
    }

    const { fullname, donVi, email, phone, cccd } = req.body;

    // Cập nhật đối tác (validation đã được xử lý ở middleware)
    await partner.update({
      fullname: fullname.trim(),
      donVi: donVi.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      cccd: cccd?.trim() || ''
    });

    res.json(partner);
  } catch (error) {
    console.error('Lỗi khi cập nhật đối tác:', error);

    // Xử lý các lỗi Sequelize cụ thể
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => {
        switch (err.path) {
          case 'fullname':
            return 'Họ tên đối tác là bắt buộc';
          case 'donVi':
            return 'Đơn vị là bắt buộc';
          case 'email':
            return 'Email không đúng định dạng';
          case 'phone':
            return 'Số điện thoại không đúng định dạng';
          case 'cccd':
            return 'Số thẻ nhân viên không đúng định dạng';
          default:
            return err.message;
        }
      });

      return res.status(400).json({
        message: 'Validation error',
        errors: errors
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      // Xác định trường nào bị trùng lặp
      const duplicateField = error.fields?.cccd ? 'cccd' : 'unknown';

      let errorMessage = 'Đã tồn tại đối tác khác với thông tin này';
      if (duplicateField === 'cccd') {
        errorMessage = 'Số thẻ nhân viên/CCCD đã tồn tại trong hệ thống';
      }

      return res.status(400).json({
        message: 'Validation error',
        errors: [errorMessage]
      });
    }

    // Lỗi khác
    res.status(500).json({
      message: 'Lỗi hệ thống',
      errors: ['Không thể cập nhật đối tác. Vui lòng thử lại sau.']
    });
  }
};

export const deletePartner = async (req, res) => {
  try {
    const partner = await Partners.findByPk(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Không tìm thấy đối tác' });
    await partner.destroy();
    res.json({ message: 'Đã xóa đối tác' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPartners = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm' });
    }

    const partners = await Partners.findAll({
      where: {
        [Op.or]: [
          { fullname: { [Op.like]: `%${keyword}%` } },
          { donVi: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });

    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPartnersByUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const partners = await Partners.findAll({
      where: { donVi: unitId }
    });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const filterPartners = async (req, res) => {
  try {
    const { donVi, fromDate, toDate } = req.query;
    const where = {};

    if (donVi) {
      where.donVi = donVi;
    }

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
      if (toDate) where.createdAt[Op.lte] = new Date(toDate);
    }

    const partners = await Partners.findAll({ where });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách đơn vị distinct
export const getDonViList = async (req, res) => {
  try {
    const donViList = await Partners.findAll({
      attributes: [
        [db.sequelize.fn('DISTINCT', db.sequelize.col('donVi')), 'donVi']
      ],
      where: {
        donVi: {
          [Op.ne]: null,
          [Op.ne]: ''
        }
      },
      order: [['donVi', 'ASC']],
      raw: true
    });

    const result = donViList.map(item => item.donVi).filter(Boolean);
    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn vị:', error);
    res.status(500).json({
      message: 'Lỗi hệ thống',
      errors: ['Không thể lấy danh sách đơn vị']
    });
  }
};

// Kiểm tra trùng lặp partner
export const checkDuplicatePartnerAPI = async (req, res) => {
  try {
    const { fullname, donVi, cccd } = req.query;

    if (!fullname || !fullname.trim() || !donVi || !donVi.trim()) {
      return res.status(400).json({
        message: 'Validation error',
        errors: ['Họ tên và đơn vị là bắt buộc để kiểm tra trùng lặp']
      });
    }

    const normalizedFullname = fullname.trim();
    const normalizedDonVi = donVi.trim();
    const normalizedCccd = (cccd || '').trim();

    // Kiểm tra trùng lặp CCCD riêng biệt (nếu có CCCD)
    if (normalizedCccd) {
      const existingPartnerWithCccd = await Partners.findOne({
        where: { cccd: normalizedCccd }
      });

      if (existingPartnerWithCccd) {
        return res.json({
          isDuplicate: true,
          message: `Đã tồn tại đối tác với số thẻ nhân viên/CCCD "${normalizedCccd}"`,
          duplicateType: 'cccd',
          existingPartner: {
            id: existingPartnerWithCccd.id,
            fullname: existingPartnerWithCccd.fullname,
            donVi: existingPartnerWithCccd.donVi,
            cccd: existingPartnerWithCccd.cccd
          }
        });
      }
    }

    // Kiểm tra trùng lặp khi có đủ họ tên và đơn vị
    const whereCondition = {
      fullname: normalizedFullname,
      donVi: normalizedDonVi,
      cccd: normalizedCccd || ''
    };

    const existingPartner = await Partners.findOne({ where: whereCondition });

    if (existingPartner) {
      const cccdText = normalizedCccd ? ` và số thẻ nhân viên "${normalizedCccd}"` : '';
      return res.json({
        isDuplicate: true,
        message: `Đã tồn tại đối tác với họ tên "${normalizedFullname}", đơn vị "${normalizedDonVi}"${cccdText}`,
        duplicateType: 'combination',
        existingPartner: {
          id: existingPartner.id,
          fullname: existingPartner.fullname,
          donVi: existingPartner.donVi,
          cccd: existingPartner.cccd
        }
      });
    }

    // Kiểm tra cảnh báo: cùng họ tên và đơn vị nhưng CCCD khác nhau
    const sameNameAndUnit = await Partners.findOne({
      where: {
        fullname: normalizedFullname,
        donVi: normalizedDonVi,
        cccd: { [Op.ne]: normalizedCccd || '' } // CCCD khác nhau
      }
    });

    if (sameNameAndUnit) {
      return res.json({
        isDuplicate: false,
        hasWarning: true,
        message: `Cảnh báo: Đã tồn tại thông tin với họ tên "${normalizedFullname}" và đơn vị "${normalizedDonVi}"  Vui lòng kiểm tra lại để tránh tạo nhầm.`,
        warningType: 'same_name_unit',
        existingPartner: {
          id: sameNameAndUnit.id,
          fullname: sameNameAndUnit.fullname,
          donVi: sameNameAndUnit.donVi,
          cccd: sameNameAndUnit.cccd
        }
      });
    }

    // Không có trùng lặp
    return res.json({
      isDuplicate: false,
      message: 'Không có trùng lặp'
    });

  } catch (error) {
    console.error('Lỗi khi kiểm tra trùng lặp đối tác:', error);
    res.status(500).json({
      message: 'Lỗi hệ thống',
      errors: ['Không thể kiểm tra trùng lặp đối tác']
    });
  }
};

// Lấy danh sách task của một đối tác
export const getPartnerTasks = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    // Kiểm tra đối tác tồn tại
    const partner = await Partners.findByPk(partnerId);
    if (!partner) {
      return res.status(404).json({ message: 'Không tìm thấy đối tác' });
    }

    // Xây dựng điều kiện tìm kiếm cho TaskUsers
    const taskUsersWhere = { partnerId };

    // Xây dựng điều kiện tìm kiếm cho Task
    const taskWhere = {};
    if (status) taskWhere.status = status;

    // Lấy danh sách task từ TaskUsers
    const { count, rows } = await db.TaskUsers.findAndCountAll({
      where: taskUsersWhere,
      include: [
        {
          model: db.Task,
          as: 'task',
          attributes: ['id', 'taskTitle', 'taskDescription', 'location', 'status', 'checkInTime', 'checkOutTime', 'createdAt'],
          where: Object.keys(taskWhere).length > 0 ? taskWhere : undefined,
          include: [
            {
              model: db.User,
              as: 'creator',
              attributes: ['id', 'fullname']
            },
            {
              model: db.User,
              as: 'completer',
              attributes: ['id', 'fullname']
            }
          ]
        }
      ],
      order: [['task', 'createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Format kết quả
    const tasks = rows
      .filter(row => row.task) // Lọc bỏ những task đã bị xóa
      .map(row => ({
        id: row.task.id,
        taskTitle: row.task.taskTitle,
        taskDescription: row.task.taskDescription,
        location: row.task.location,
        status: row.task.status,
        checkInTime: row.task.checkInTime,
        checkOutTime: row.task.checkOutTime,
        createdAt: row.task.createdAt,
        creator: row.task.creator,
        completer: row.task.completer,
        role: row.role
      }));

    res.json({
      tasks,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      partner: {
        id: partner.id,
        fullname: partner.fullname,
        donVi: partner.donVi
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách task của đối tác:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách task của đối tác' });
  }
};
