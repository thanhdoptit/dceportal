import React from 'react';
import { Typography, Card, Tag, Alert, Space, Divider, Row, Col } from 'antd';
import { 
  CloudOutlined, 
  SafetyOutlined, 
  CheckCircleOutlined,
  BuildOutlined,
  PictureOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ArchitectureSection = () => {
  return (
    <div id="section-2" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <CloudOutlined style={{ marginRight: '8px' }} />
        2. KIẾN TRÚC VÀ THIẾT KẾ TTDL VÂN CANH
      </Title>

      <div id="section-2.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
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
            <img 
              src="/vancanh-overview/project_overview_3.jpg"
              alt="Kiến trúc tổng quan TTDL Vân Canh"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <p style={{ 
              color: '#666', 
              margin: '8px 0 0 0', 
              fontSize: '12px',
              fontStyle: 'italic'
            }}>
              Kiến trúc tổng quan TTDL Vân Canh - Thiết kế phân vùng độc lập (từ slide PPTX)
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

      <div id="section-2.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.2 Quy mô và công suất
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Quy mô xây dựng" style={{ marginBottom: '20px' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Tag color="blue">Vị trí</Tag>
                  <Text>Trường Đào tạo và Phát triển Nguồn nhân lực Vietinbank</Text>
                </div>
                <div>
                  <Tag color="blue">Kích thước</Tag>
                  <Text>54m x 65m (rộng x sâu)</Text>
                </div>
                <div>
                  <Tag color="blue">Diện tích sàn</Tag>
                  <Text>952m²/tầng (34m x 28m)</Text>
                </div>
                <div>
                  <Tag color="blue">Cấu trúc</Tag>
                  <Text>3 tầng + 1 tầng mái</Text>
                </div>
                <div>
                  <Tag color="blue">Tổng số phòng</Tag>
                  <Text>29 phòng chức năng</Text>
                </div>
                <div>
                  <Tag color="blue">Khu vực ngoài</Tag>
                  <Text>Trạm biến áp, máy phát, bể dầu</Text>
                </div>
                <div>
                  <Tag color="blue">Khu vực trong</Tag>
                  <Text>Thiết bị hạ tầng TTDL</Text>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Công suất và mật độ" style={{ marginBottom: '20px' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Tag color="orange">Giai đoạn 1</Tag>
                  <Text>120 rack server</Text>
                </div>
                <div>
                  <Tag color="orange">Mở rộng tương lai</Tag>
                  <Text>+30 rack (tổng 150 rack)</Text>
                </div>
                <div>
                  <Tag color="purple">Mật độ trung bình</Tag>
                  <Text>5KW/rack</Text>
                </div>
                <div>
                  <Tag color="purple">Mật độ cao</Tag>
                  <Text>15KW/rack</Text>
                </div>
                <div>
                  <Tag color="red">Công suất tối đa</Tag>
                  <Text>2250KW (150 rack × 15KW)</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      <div id="section-2.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
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
