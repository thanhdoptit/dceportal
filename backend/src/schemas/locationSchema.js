import Joi from 'joi';

export const validateLocation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(100)
      .messages({
        'string.empty': 'Tên địa điểm không được để trống',
        'string.min': 'Tên địa điểm phải có ít nhất 2 ký tự',
        'string.max': 'Tên địa điểm không được vượt quá 100 ký tự'
      }),
    code: Joi.string().required().length(1)
      .messages({
        'string.empty': 'Mã địa điểm không được để trống',
        'string.length': 'Mã địa điểm phải có đúng 1 ký tự'
      }),
    description: Joi.string().allow('', null).max(500)
      .messages({
        'string.max': 'Mô tả không được vượt quá 500 ký tự'
      }),
    hotline: Joi.string().allow('', null).max(50)
      .messages({
        'string.max': 'Hotline không được vượt quá 50 ký tự'
      }),
    index: Joi.number().integer().min(0).max(10).default(0)
      .messages({
        'number.base': 'Số ca trong ngày phải là số',
        'number.integer': 'Số ca trong ngày phải là số nguyên',
        'number.min': 'Số ca trong ngày phải từ 0-10',
        'number.max': 'Số ca trong ngày phải từ 0-10'
      }),
    isActive: Joi.boolean().default(true)
  });

  return schema.validate(data);
}; 