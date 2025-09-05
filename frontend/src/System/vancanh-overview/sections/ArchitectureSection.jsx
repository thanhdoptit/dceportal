import {
    BuildOutlined,
    CloudOutlined,
    PictureOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import { Alert, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import React from 'react';
import { ImagePreview } from '../../shared';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const ArchitectureSection = () => {
  return (
    <div id="section-2" className="content-section">
      <Title level={2} >
        <CloudOutlined style={{ marginRight: '8px' }} />
        2. KIẾN TRÚC VÀ THIẾT KẾ TTDL VÂN CANH
      </Title>

      <div id="section-2-1" className="subsection">
        <Title level={3} >
          <BuildOutlined style={{ marginRight: '8px' }} /> 2.1 Kiến trúc phân vùng
        </Title>

        <Alert
          message="KIẾN TRÚC 'PHÂN VÙNG': ĐẢM BẢO AN NINH BẢO MẬT, AN TOÀN PCCC, HOẠT ĐỘNG LIÊN TỤC"
          description="TTDL Vân Canh được thiết kế theo kiến trúc phân vùng độc lập, đảm bảo tính bảo mật cao và khả năng hoạt động liên tục ngay cả khi có sự cố xảy ra."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        {/* Hình ảnh kiến trúc tổng quan */}
        <Card
          title={
            <Space>
              <PictureOutlined />
              Kiến trúc tổng quan TTDL Vân Canh
            </Space>
          }
          style={{ marginBottom: '20px' }}
        >
          <div style={{ textAlign: 'center' }}>
            <ImagePreview
              src="/vancanh-overview/electrical_system_digital.jpg"
              alt="Kiến trúc tổng quan TTDL Vân Canh"
              width={600}
              height={400}
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <p style={{
              color: '#666',
              margin: '8px 0 0 0',
              fontSize: '12px',
              fontStyle: 'italic'
            }}>
              Kiến trúc tổng quan TTDL Vân Canh - Thiết kế phân vùng độc lập
            </p>
          </div>
        </Card>

        <Card title="Đặc điểm kiến trúc phân vùng" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">✅ Phân vùng độc lập</Tag>
              <Text>Mỗi vùng hoạt động độc lập, không ảnh hưởng lẫn nhau</Text>
            </div>
            <div>
              <Tag color="green">✅ Bảo mật cao</Tag>
              <Text>Kiểm soát truy cập nghiêm ngặt giữa các vùng</Text>
            </div>
            <div>
              <Tag color="green">✅ An toàn PCCC</Tag>
              <Text>Hệ thống PCCC độc lập cho từng vùng</Text>
            </div>
            <div>
              <Tag color="green">✅ Hoạt động liên tục</Tag>
              <Text>Khả năng chuyển đổi và dự phòng giữa các vùng</Text>
            </div>
            <div>
              <Tag color="green">✅ Bảo trì không gián đoạn</Tag>
              <Text>Bảo trì một vùng không ảnh hưởng vùng khác</Text>
            </div>
          </Space>
        </Card>
      </div>


      <div id="section-2-2" className="subsection">
        <Title level={3} >
          <SafetyOutlined style={{ marginRight: '8px' }} /> 2.3 Tiêu chuẩn thiết kế
        </Title>

        <Card title="Tiêu chuẩn quốc tế" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">Uptime Institute</Tag>
              <Text>Tier 3 - Concurrently Maintainable</Text>
            </div>
            <div>
              <Tag color="green">TCVN 9250:2012</Tag>
              <Text>Mức 3 - Trung tâm dữ liệu</Text>
            </div>
            <div>
              <Tag color="green">Fault Tolerance</Tag>
              <Text>Đạt tiêu chuẩn Tier IV</Text>
            </div>
            <div>
              <Tag color="green">Compartmentalization</Tag>
              <Text>Phân vùng độc lập Tier IV</Text>
            </div>
            <div>
              <Tag color="green">N+1 Redundancy</Tag>
              <Text>Dự phòng cho tất cả thành phần quan trọng</Text>
            </div>
          </Space>
        </Card>

        <Card title="Tiêu chuẩn an toàn" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔥</div>
                <Text strong>PCCC</Text>
                <br />
                <Text>Hệ thống khí Novec 1230</Text>
                <br />
                <Text>Báo khói sớm</Text>
              </div>
            </Col>
            <Col xs={24} lg={8}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
                <Text strong>An ninh</Text>
                <br />
                <Text>CCTV toàn bộ</Text>
                <br />
                <Text>ACS kiểm soát vào ra</Text>
              </div>
            </Col>
            <Col xs={24} lg={8}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                <Text strong>Điện</Text>
                <br />
                <Text>UPS dự phòng</Text>
                <br />
                <Text>Máy phát điện</Text>
              </div>
            </Col>
          </Row>
        </Card>

        <Card title="Tiêu chuẩn môi trường" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Nhiệt độ</Tag>
              <Text>18-24°C (duy trì ổn định)</Text>
            </div>
            <div>
              <Tag color="blue">Độ ẩm</Tag>
              <Text>45-55% RH</Text>
            </div>
            <div>
              <Tag color="blue">Độ sạch không khí</Tag>
              <Text>ISO Class 8</Text>
            </div>
            <div>
              <Tag color="blue">Tiếng ồn</Tag>
              <Text>&lt; 75 dB(A)</Text>
            </div>
            <div>
              <Tag color="blue">Rung động</Tag>
              <Text>Đáp ứng tiêu chuẩn IT equipment</Text>
            </div>
          </Space>
        </Card>
      </div>

      <Divider />

      <Alert
        message="Tóm tắt kiến trúc"
        description="TTDL Vân Canh được thiết kế theo kiến trúc phân vùng hiện đại, đáp ứng tiêu chuẩn quốc tế cao nhất. Với quy mô 150 rack và công suất tối đa 2250KW, hệ thống đảm bảo khả năng mở rộng và hoạt động ổn định trong tương lai."
        type="success"
        showIcon
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default ArchitectureSection;
