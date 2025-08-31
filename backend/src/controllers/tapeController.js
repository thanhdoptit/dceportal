import db from '../models/index.js';
import { Op } from 'sequelize';

// Lấy danh sách tape
export const getTapes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;

    // Xây dựng điều kiện where
    const where = {};
    if (req.query.location && req.query.location !== 'all') {
      where.location = req.query.location;
    }
    if (req.query.serverId && req.query.serverId !== 'all') {
      where.serverId = req.query.serverId;
    }
    // Lọc theo dateTerminal
    if (req.query.dateStart && req.query.dateEnd) {
      where.dateTerminal = {
        [Op.between]: [req.query.dateStart, req.query.dateEnd]
      };
    }
    // Lọc theo dateStart
    if (req.query.filterDateStart && req.query.filterDateEnd) {
      where.dateStart = {
        [Op.between]: [req.query.filterDateStart, req.query.filterDateEnd]
      };
    }
    // Lọc theo dateEnd
    if (req.query.filterDateEndStart && req.query.filterDateEndEnd) {
      where.dateEnd = {
        [Op.between]: [req.query.filterDateEndStart, req.query.filterDateEndEnd]
      };
    }

    const { count, rows } = await db.TapeData.findAndCountAll({
      where,
      include: [
        {
          model: db.User,
          as: 'User',
          attributes: ['id', 'username', 'fullname']
        }
      ],
      order: [['id', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      tapes: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết tape theo id
export const getTapeById = async (req, res) => {
  try {
    const tape = await db.TapeData.findByPk(req.params.id, {
      include: [
        {
          model: db.User,
          as: 'User',
          attributes: ['id', 'username', 'fullname']
        }
      ]
    });
    if (!tape) {
      return res.status(404).json({ error: 'Không tìm thấy tape' });
    }
    res.status(200).json(tape);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa tape theo id
export const deleteTape = async (req, res) => {
  try {
    const tape = await db.TapeData.findByPk(req.params.id);
    if (!tape) {
      return res.status(404).json({ error: 'Không tìm thấy tape' });
    }
    await tape.destroy();
    res.status(200).json({ message: 'Xóa tape thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sửa tape theo id
export const updateTape = async (req, res) => {
  try {
    const tape = await db.TapeData.findByPk(req.params.id);
    if (!tape) {
      return res.status(404).json({ error: 'Không tìm thấy tape' });
    }
    await tape.update(req.body);
    res.status(200).json(tape);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cleanDate = (val) => (!val || val === '' || val === 'Invalid date') ? null : val;

// Tạo mới tape
export const createTape = async (req, res) => {
  try {
    console.log('Dữ liệu nhận được từ frontend:', req.body);
    const data = {
      ...req.body,
      userId: req.user?.id || req.body.userId || null,
      dateStart: cleanDate(req.body.dateStart),
      dateEnd: cleanDate(req.body.dateEnd),
      dateTerminal: cleanDate(req.body.dateTerminal),
      dateError: cleanDate(req.body.dateError),
    };
    const tape = await db.TapeData.create(data);
    res.status(201).json(tape);
  } catch (err) {
    console.error('Lỗi khi tạo tape:', err, err.stack);
    res.status(400).json({ error: err.message });
  }
};

// Kiểm tra barcode đã tồn tại chưa
export const checkBarcode = async (req, res) => {
  const { barcode } = req.query;
  if (!barcode) return res.status(400).json({ exists: false });
  const tape = await db.TapeData.findOne({ where: { barcode } });
  res.json({ exists: !!tape });
}; 