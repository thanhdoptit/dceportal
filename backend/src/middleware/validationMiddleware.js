import { validationResult, body } from 'express-validator';

export const validateTask = [
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation rules cho create task
export const taskValidationRules = [
  // body('fullName').if(body('fullName').exists()).notEmpty().withMessage('Tên công việc không được để trống'),
  body('checkInTime').if(body('checkInTime').exists()).isISO8601().withMessage('Thời gian bắt đầu không hợp lệ'),
  body('checkOutTime')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value, { req }) => {
      // Nếu không có giá trị, cho phép đi tiếp
      if (!value || value === 'undefined' || value === '') {
        return true;
      }

      try {
        // Kiểm tra định dạng ISO
        const checkOutTime = new Date(value);
        if (isNaN(checkOutTime.getTime())) {
          throw new Error('Định dạng thời gian kết thúc không hợp lệ');
        }

        // Kiểm tra so với thời gian bắt đầu
        const checkInTime = new Date(req.body.checkInTime);
        if (checkOutTime < checkInTime) {
          throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu');
        }

        return true;
      } catch (error) {
        throw new Error('Định dạng thời gian kết thúc không hợp lệ');
      }
    }),
  body('taskDescription')
    .if(body('taskDescription').exists())
    .notEmpty()
    .withMessage('Nội dung công việc không được để trống'),
  // body('worker').notEmpty().withMessage('Vui lòng nhập tên người làm việc'),
  body('status')
    .optional()
    .isIn(['in_progress', 'completed', 'cancelled'])
    .withMessage('Trạng thái không hợp lệ')
]; 