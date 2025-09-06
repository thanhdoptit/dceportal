import React, { useState } from 'react';
import { Button, message, Card, Form, Input } from 'antd';
import EmailService from '../../utils/emailService';
import emailConfig from '../../config/emailConfig';

const TestEmail = () => {
  const [loading, setLoading] = useState(false);
  const emailService = new EmailService(emailConfig);

  const handleTestBasicEmail = async () => {
    try {
      setLoading(true);
      const result = await emailService.sendEmail({
        to: 'recipient@example.com',
        subject: 'Test Email Cơ Bản',
        body: 'Nội dung test email cơ bản',
      });

      if (result.success) {
        message.success('Gửi email thành công!');
      } else {
        message.error('Gửi email thất bại: ' + result.error);
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestHandoverEmail = async () => {
    try {
      setLoading(true);
      const testData = {
        to: 'recipient@example.com',
        subject: 'Test Biên Bản Bàn Giao',
        content: 'Nội dung test biên bản bàn giao',
        devices: [
          {
            deviceName: 'UPS',
            status: 'Có lỗi',
            errorCode: 'E001',
            errorCause: 'Mất điện',
            solution: 'Kiểm tra nguồn điện',
          },
        ],
      };

      const result = await emailService.sendHandoverEmail(testData);

      if (result.success) {
        message.success('Gửi biên bản bàn giao thành công!');
      } else {
        message.error('Gửi biên bản bàn giao thất bại: ' + result.error);
      }
    } catch (error) {
      message.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title='Test Gửi Email' style={{ maxWidth: 600, margin: '20px auto' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button type='primary' onClick={handleTestBasicEmail} loading={loading}>
          Test Email Cơ Bản
        </Button>
        <Button type='primary' onClick={handleTestHandoverEmail} loading={loading}>
          Test Biên Bản Bàn Giao
        </Button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Hướng dẫn:</h3>
        <ol>
          <li>Đảm bảo đã cấu hình email trong file .env</li>
          <li>Nhấn nút "Test Email Cơ Bản" để gửi email đơn giản</li>
          <li>Nhấn nút "Test Biên Bản Bàn Giao" để gửi email biên bản</li>
          <li>Kiểm tra kết quả trong console và thông báo</li>
        </ol>
      </div>
    </Card>
  );
};

export default TestEmail;
