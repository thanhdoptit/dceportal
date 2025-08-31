import Joi from 'joi';

// Schema cho phần tools
const toolsSchema = Joi.object({
    status: Joi.string().valid('complete', 'incomplete').required(),
  missing: Joi.when('status', {
    is: 'incomplete',
        then: Joi.object({
      items: Joi.array().items(Joi.string()).required(),
      description: Joi.string().allow('')
    }).required(),
    otherwise: Joi.object().optional()
  })
});

// Schema cho phần environment
const environmentSchema = Joi.object({
  status: Joi.boolean().required(),
  description: Joi.string().allow('').optional()
});

// Schema cho phần infrastructure issues
const infrastructureIssuesSchema = Joi.object({
  deviceName: Joi.string().required(),
  serialNumber: Joi.string().required(),
  location: Joi.string().required(),
  issue: Joi.string().required(),
  ongoingTasks: Joi.string().required()
});

// Schema cho phần infrastructure item
const infrastructureItemSchema = Joi.object({
  status: Joi.string().valid('normal', 'abnormal').required(),
  issues: Joi.when('status', {
    is: 'abnormal',
    then: infrastructureIssuesSchema.required(),
    otherwise: Joi.object({
      deviceName: Joi.string().allow('').default(''),
      serialNumber: Joi.string().allow('').default(''),
      location: Joi.string().allow('').default(''),
      issue: Joi.string().allow('').default(''),
      ongoingTasks: Joi.string().allow('').default('')
    }).default({})
  })
});

// Schema cho phần infrastructure
const infrastructureSchema = Joi.object({
  powerDistribution: infrastructureItemSchema,
  ups: infrastructureItemSchema,
  cooling: infrastructureItemSchema,
  cctv: infrastructureItemSchema,
  accessControl: infrastructureItemSchema,
  fireSystem: infrastructureItemSchema,
  dcimSystem: infrastructureItemSchema
});

// Schema cho phần ongoing tasks
const ongoingTasksSchema = Joi.object({
  hasOngoingTasks: Joi.boolean().required(),
  taskInfo: Joi.when('hasOngoingTasks', {
    is: true,
    then: Joi.string().min(5).required(),
    otherwise: Joi.string().allow('').optional()
  }),
  relatedTasks: Joi.string().allow('').optional()
});

// Schema chính cho form bàn giao
const handoverFormSchema = Joi.object({
  tools: toolsSchema.required(),
  environment: environmentSchema.required()
});

const handoverValidationSchema = Joi.object({
  handoverForm: handoverFormSchema.required()
});

export { handoverFormSchema, handoverValidationSchema }; 