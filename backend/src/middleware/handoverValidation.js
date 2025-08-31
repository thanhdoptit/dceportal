import { handoverValidationSchema } from '../schemas/handoverFormSchema.js';

export const validateHandoverForm = (req, res, next) => {
  // Kiểm tra xem có dữ liệu form không
  if (!req.body.handoverForm) {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors: ['Thiếu dữ liệu form bàn giao']
    });
  }

  // Validate theo schema
  const { error } = handoverValidationSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true
  });

  if (error) {
    // Map lỗi validation sang thông báo tiếng Việt
    const errorMessages = error.details.map(detail => {
      const path = detail.path.join('.');
      
      // Thông báo lỗi tùy theo trường
      switch(path) {
        case 'handoverForm.tools.status':
          return 'Vui lòng chọn tình trạng công cụ tài liệu';
        
        case 'handoverForm.tools.missing.items':
          return 'Vui lòng chọn các mục thiếu';
        
        case 'handoverForm.tools.missing.description':
          return 'Vui lòng nhập mô tả nguyên nhân thiếu thiết bị';
        
        case 'handoverForm.environment.status':
          return 'Vui lòng chọn tình trạng môi trường';
        
        case 'handoverForm.environment.description':
          return 'Vui lòng nhập mô tả về hiện trạng môi trường';

        default:
          return detail.message;
      }
    });

    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages
    });
  }

  // Validate logic nghiệp vụ
  const form = req.body.handoverForm;
  const errors = [];

  // Kiểm tra tools
  if (form.tools.status === 'incomplete' && (!form.tools.missing.items || form.tools.missing.items.length === 0)) {
    errors.push('Vui lòng chọn ít nhất một mục thiếu');
  }

  // Kiểm tra environment
  if (!form.environment.status && !form.environment.description?.trim()) {
    errors.push('Vui lòng nhập mô tả khi tình trạng môi trường không tốt');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors: errors
    });
  }

  next();
}; 