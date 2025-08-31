import { gmailService } from '../services/gmail.service.js';

// Gửi email qua Gmail
export const sendGmail = async (req, res) => {
  try {
    const {
      to,
      cc,
      bcc,
      subject,
      html,
      text,
      attachments,
      template,
      templateData,
      from,
      replyTo,
      priority
    } = req.body;
    
    let result;
    if (template) {
      result = await gmailService.sendTemplateMail(template, {
        to,
        cc,
        bcc,
        templateData,
        priority
      });
    } else {
      result = await gmailService.sendMail({
        to,
        cc,
        bcc,
        subject,
        html,
        text,
        attachments,
        from,
        replyTo,
        priority
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 