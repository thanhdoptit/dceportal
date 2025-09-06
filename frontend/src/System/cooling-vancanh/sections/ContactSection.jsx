import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Alert, Card, Col, Row, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const ContactSection = () => {
  return (
    <div style={{ padding: '20px 0' }}>
      <div id='section-8' className='content-section'>
        <Title level={2}>
          <PhoneOutlined style={{ marginRight: '12px' }} />
          8. LIÊN HỆ & HỖ TRỢ
        </Title>
        <Alert
          message='Thông tin liên hệ'
          description='Thông tin liên hệ kỹ thuật và hỗ trợ cho hệ thống làm mát TTDL Vân Canh.'
          type='info'
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <div id='section-8-1' className='subsection'>
          <Title level={3}>
            <InfoCircleOutlined style={{ marginRight: '12px' }} />
            8.1. Thông tin liên hệ
          </Title>
          <Card style={{ marginBottom: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Phòng Kỹ thuật:</Text>
                  <br />
                  <Text>Điện thoại: 024-xxxx-xxxx</Text>
                  <br />
                  <Text>Email: kythuat@vancanh.com</Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Phòng Vận hành:</Text>
                  <br />
                  <Text>Điện thoại: 024-xxxx-xxxx</Text>
                  <br />
                  <Text>Email: vanhanh@vancanh.com</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        <div id='section-8-2' className='subsection'>
          <Title level={3}>
            <SettingOutlined style={{ marginRight: '12px' }} />
            8.2. Hỗ trợ kỹ thuật
          </Title>
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Thời gian hỗ trợ:</Text>
              <br />
              <Text>24/7 cho các sự cố khẩn cấp</Text>
              <br />
              <Text>8:00 - 17:00 cho hỗ trợ thường</Text>
            </div>
            <div>
              <Text strong>Quy trình hỗ trợ:</Text>
              <br />
              <Text>1. Báo cáo sự cố qua điện thoại</Text>
              <br />
              <Text>2. Gửi email mô tả chi tiết</Text>
              <br />
              <Text>3. Nhân viên kỹ thuật sẽ liên hệ trong vòng 30 phút</Text>
            </div>
          </Card>
        </div>

        <div id='section-8-3' className='subsection'>
          <Title level={3}>
            <CheckCircleOutlined style={{ marginRight: '12px' }} />
            8.3. Báo cáo sự cố
          </Title>
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Thông tin cần cung cấp:</Text>
              <br />
              <Text>• Mô tả sự cố chi tiết</Text>
              <br />
              <Text>• Thời gian xảy ra sự cố</Text>
              <br />
              <Text>• Thiết bị bị ảnh hưởng</Text>
              <br />
              <Text>• Mức độ nghiêm trọng</Text>
            </div>
            <div>
              <Text strong>Kênh báo cáo:</Text>
              <br />
              <Text>• Điện thoại khẩn cấp: 090-xxxx-xxxx</Text>
              <br />
              <Text>• Email: suco@vancanh.com</Text>
              <br />
              <Text>• Hệ thống báo cáo nội bộ</Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
