import { body, validationResult } from 'express-validator';
import db from '../models/index.js';
import { Op } from 'sequelize';

const Partners = db.Partners;

// Validation rules cho partner
export const partnerValidationRules = [
  body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Họ tên đối tác là bắt buộc')
    .isLength({ max: 255 })
    .withMessage('Họ tên không được vượt quá 255 ký tự'),

  body('donVi')
    .trim()
    .notEmpty()
    .withMessage('Đơn vị là bắt buộc')
    .isLength({ max: 255 })
    .withMessage('Đơn vị không được vượt quá 255 ký tự'),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Email không đúng định dạng')
    .isLength({ max: 100 })
    .withMessage('Email không được vượt quá 100 ký tự'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9+\-\s()]{10,15}$/)
    .withMessage('Số điện thoại không đúng định dạng')
    .isLength({ max: 50 })
    .withMessage('Số điện thoại không được vượt quá 50 ký tự'),

  body('cccd')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\d{1,12}$/)
    .withMessage('Số thẻ nhân viên phải có 1-12 chữ số')
    .isLength({ max: 50 })
    .withMessage('Số thẻ nhân viên không được vượt quá 50 ký tự')
];

// Middleware kiểm tra kết quả validation
export const validatePartner = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      message: 'Validation error',
      errors: errorMessages
    });
  }
  next();
};

// Middleware kiểm tra trùng lặp đối tác (cho create)
export const checkDuplicatePartner = async (req, res, next) => {
  try {
    const { fullname, donVi, cccd } = req.body;

    // Kiểm tra trùng lặp CCCD riêng biệt (nếu có CCCD)
    if (cccd && cccd.trim()) {
      const existingPartnerWithCccd = await Partners.findOne({
        where: { cccd: cccd.trim() }
      });

      if (existingPartnerWithCccd) {
        return res.status(400).json({
          message: 'Validation error',
          errors: [`Đã tồn tại đối tác với số thẻ nhân viên/CCCD "${cccd.trim()}"`]
        });
      }
    }

    // Kiểm tra trùng lặp khi có đủ họ tên và đơn vị
    if (fullname && fullname.trim() && donVi && donVi.trim()) {
      const whereCondition = {
        fullname: fullname.trim(),
        donVi: donVi.trim(),
        cccd: cccd?.trim() || ''
      };

      const existingPartner = await Partners.findOne({ where: whereCondition });

      if (existingPartner) {
        const cccdText = cccd && cccd.trim() ? ' và số thẻ nhân viên này' : '';
        return res.status(400).json({
          message: 'Validation error',
          errors: [`Đã tồn tại đối tác với họ tên, đơn vị${cccdText}`]
        });
      }

      // Kiểm tra cảnh báo: cùng họ tên và đơn vị nhưng CCCD khác nhau
      const sameNameAndUnit = await Partners.findOne({
        where: {
          fullname: fullname.trim(),
          donVi: donVi.trim(),
          cccd: { [Op.ne]: cccd?.trim() || '' } // CCCD khác nhau
        }
      });

      if (sameNameAndUnit) {
        // Chỉ cảnh báo, không block tạo mới
        console.log(`Cảnh báo: Đã tồn tại đối tác với họ tên "${fullname.trim()}" và đơn vị "${donVi.trim()}" nhưng có CCCD khác`);
      }
    }

    next();
  } catch (error) {
    console.error('Lỗi khi kiểm tra trùng lặp đối tác:', error);
    res.status(500).json({
      message: 'Lỗi hệ thống',
      errors: ['Không thể kiểm tra trùng lặp đối tác']
    });
  }
};

// Middleware kiểm tra trùng lặp đối tác (cho update)
export const checkDuplicatePartnerUpdate = async (req, res, next) => {
  try {
    const { fullname, donVi, cccd } = req.body;
    const { id } = req.params;

    // Kiểm tra trùng lặp CCCD riêng biệt (nếu có CCCD)
    if (cccd && cccd.trim()) {
      const existingPartnerWithCccd = await Partners.findOne({
        where: {
          cccd: cccd.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (existingPartnerWithCccd) {
        return res.status(400).json({
          message: 'Validation error',
          errors: [`Đã tồn tại đối tác khác với số thẻ nhân viên/CCCD "${cccd.trim()}"`]
        });
      }
    }

    // Kiểm tra trùng lặp khi có đủ họ tên và đơn vị
    if (fullname && fullname.trim() && donVi && donVi.trim()) {
      const whereCondition = {
        fullname: fullname.trim(),
        donVi: donVi.trim(),
        cccd: cccd?.trim() || '',
        id: { [Op.ne]: id }
      };

      const existingPartner = await Partners.findOne({ where: whereCondition });

      if (existingPartner) {
        const cccdText = cccd && cccd.trim() ? ' và số thẻ nhân viên này' : '';
        return res.status(400).json({
          message: 'Validation error',
          errors: [`Đã tồn tại đối tác khác với họ tên, đơn vị${cccdText}`]
        });
      }

      // Kiểm tra cảnh báo: cùng họ tên và đơn vị nhưng CCCD khác nhau
      const sameNameAndUnit = await Partners.findOne({
        where: {
          fullname: fullname.trim(),
          donVi: donVi.trim(),
          cccd: { [Op.ne]: cccd?.trim() || '' }, // CCCD khác nhau
          id: { [Op.ne]: id } // Loại trừ partner hiện tại
        }
      });

      if (sameNameAndUnit) {
        // Chỉ cảnh báo, không block cập nhật
        console.log(`Cảnh báo: Đã tồn tại đối tác khác với họ tên "${fullname.trim()}" và đơn vị "${donVi.trim()}" nhưng có CCCD khác`);
      }
    }

    next();
  } catch (error) {
    console.error('Lỗi khi kiểm tra trùng lặp đối tác:', error);
    res.status(500).json({
      message: 'Lỗi hệ thống',
      errors: ['Không thể kiểm tra trùng lặp đối tác']
    });
  }
};
