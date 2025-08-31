import handoverFormTemplate from '../templates/handoverForm.js';
import db from '../models/index.js';
import { handoverValidationSchema } from '../schemas/handoverFormSchema.js';

const formTemplateController = {
  // Get current active template
  getCurrentTemplate: async (req, res) => {
    try {
      const template = await db.FormTemplate.findOne({
        where: { isActive: true }
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'No active template found'
        });
      }

      res.json({
        success: true,
        data: template
      });
    } catch (error) {
      console.error('Error getting current template:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while getting current template'
      });
    }
  },

  // Get handover form template
  getHandoverTemplate: async (req, res) => {
    try {
      // Tìm template trong database
      let template = await db.FormTemplate.findOne({
        where: {
          type: 'handover',
          isActive: true
        }
      });

      // Nếu không có trong database, sử dụng template mặc định
      if (!template) {
        template = {
          type: 'handover',
          content: {
            tools: {
              status: 'complete',
              missing: {
                items: [],
                description: ''
              }
            },
            environment: {
              status: true,
              description: ''
            }
          },
          isActive: true
        };
      }

      res.json({
        success: true,
        data: template.content
      });
    } catch (error) {
      console.error('Error getting handover template:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while getting handover template'
      });
    }
  },

  // Update template (admin only)
  updateTemplate: async (req, res) => {
    try {
      const { type, content } = req.body;

      // Validate content structure
      if (type === 'handover') {
        const { error } = handoverValidationSchema.validate({ handoverForm: content });
        if (error) {
          return res.status(400).json({
            success: false,
            message: 'Invalid template structure',
            errors: error.details.map(detail => detail.message)
          });
        }
      }

      // Deactivate all current templates of this type
      await db.FormTemplate.update(
        { isActive: false },
        {
          where: {
            type,
            isActive: true
          }
        }
      );

      // Create new template
      const newTemplate = await db.FormTemplate.create({
        type,
        content,
        isActive: true,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });

      res.json({
        success: true,
        message: 'Template updated successfully',
        data: newTemplate
      });
    } catch (error) {
      console.error('Error updating template:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating template'
      });
    }
  },

  // Update handover form template (admin only)
  updateHandoverTemplate: async (req, res) => {
    try {
      // Deactivate all current handover templates
      await db.FormTemplate.update(
        { isActive: false },
        {
          where: {
            type: 'handover',
            isActive: true
          }
        }
      );

      // Create new handover template
      const newTemplate = await db.FormTemplate.create({
        type: 'handover',
        content: req.body,
        isActive: true,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });

      res.json({
        success: true,
        message: 'Handover template updated successfully',
        data: newTemplate
      });
    } catch (error) {
      console.error('Error updating handover template:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating handover template'
      });
    }
  }
};

export default formTemplateController; 