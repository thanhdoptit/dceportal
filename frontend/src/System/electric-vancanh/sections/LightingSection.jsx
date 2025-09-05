import { BulbOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider, Progress, Row, Steps, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const LightingSection = () => {
  const [currentLightingStep, setCurrentLightingStep] = React.useState(0);
  const [currentSocketStep, setCurrentSocketStep] = React.useState(0);
  const [currentEmergencyStep, setCurrentEmergencyStep] = React.useState(0);

  const lightingSteps = [
    'Kiểm tra hệ thống chiếu sáng',
    'Kiểm tra công tắc điều khiển',
    'Kiểm tra đèn và bóng đèn',
    'Kiểm tra hệ thống cảm biến',
    'Kiểm tra hiệu suất chiếu sáng'
  ];

  const socketSteps = [
    'Kiểm tra ổ cắm điện',
    'Kiểm tra công tắc',
    'Kiểm tra kết nối dây',
    'Kiểm tra bảo vệ RCD',
    'Kiểm tra an toàn điện'
  ];

  const emergencySteps = [
    'Kiểm tra đèn Exit',
    'Kiểm tra đèn Emergency',
    'Kiểm tra hệ thống điều khiển',
    'Kiểm tra nguồn dự phòng',
    'Kiểm tra thời gian sáng'
  ];

  return (
    <div className="content-section">
      <Title level={2} id="section-5" style={{ color: '#0072BC', marginBottom: '24px' }}>
        5. HỆ THỐNG CHIẾU SÁNG & Ổ CẮM
      </Title>

      <div id="section-5-1" className="subsection" style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#333333', marginBottom: '16px' }}>
          5.1. Hệ thống chiếu sáng
        </Title>
        
        <div id="5.1.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            5.1.1. Loại đèn và công suất
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Alert
              message="Hệ thống chiếu sáng tiết kiệm năng lượng"
              description="Sử dụng đèn LED công nghệ cao để tiết kiệm điện năng và bảo vệ môi trường"
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small" title="Đèn LED Panel" className="card-blue">
                  <ul>
                    <li><Text strong>Công suất:</Text> 18W, 24W, 36W</li>
                    <li><Text strong>Quang thông:</Text> 1800-3600lm</li>
                    <li><Text strong>Nhiệt độ màu:</Text> 4000K</li>
                    <li><Text strong>Tuổi thọ:</Text> 50,000 giờ</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Đèn LED Tube" className="card-green">
                  <ul>
                    <li><Text strong>Công suất:</Text> 9W, 18W</li>
                    <li><Text strong>Quang thông:</Text> 900-1800lm</li>
                    <li><Text strong>Nhiệt độ màu:</Text> 6500K</li>
                    <li><Text strong>Tuổi thọ:</Text> 30,000 giờ</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Đèn LED Downlight" className="card-orange">
                  <ul>
                    <li><Text strong>Công suất:</Text> 12W, 18W</li>
                    <li><Text strong>Quang thông:</Text> 1200-1800lm</li>
                    <li><Text strong>Góc chiếu:</Text> 120°</li>
                    <li><Text strong>Tuổi thọ:</Text> 40,000 giờ</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="5.1.2" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            5.1.2. Bố trí và điều khiển
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Paragraph>
              Hệ thống điều khiển chiếu sáng thông minh:
            </Paragraph>
            
            <Card title="Quy trình kiểm tra" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentLightingStep}
                onChange={setCurrentLightingStep}
                direction="vertical"
                size="small"
                items={lightingSteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Hệ thống điều khiển" className="card-blue">
                  <ul>
                    <li><Text strong>Điều khiển tự động:</Text> Theo thời gian</li>
                    <li><Text strong>Cảm biến chuyển động:</Text> PIR sensor</li>
                    <li><Text strong>Cảm biến ánh sáng:</Text> LDR sensor</li>
                    <li><Text strong>Giao diện:</Text> Touch panel</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Bố trí chiếu sáng" className="card-green">
                  <ul>
                    <li><Text strong>Khu vực làm việc:</Text> 500 lux</li>
                    <li><Text strong>Khu vực hành lang:</Text> 200 lux</li>
                    <li><Text strong>Khu vực kho:</Text> 300 lux</li>
                    <li><Text strong>Khu vực vệ sinh:</Text> 150 lux</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <div id="section-5-2" className="subsection" style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#333333', marginBottom: '16px' }}>
          5.2. Ổ cắm và công tắc
        </Title>
        
        <div id="5.2.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            5.2.1. Loại ổ cắm Schneider
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Ổ cắm 3 pha" className="card-blue">
                  <ul>
                    <li><Text strong>Điện áp:</Text> 400V AC</li>
                    <li><Text strong>Dòng điện:</Text> 32A, 63A</li>
                    <li><Text strong>Chuẩn bảo vệ:</Text> IP44</li>
                    <li><Text strong>Kết nối:</Text> Screw terminal</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Ổ cắm 1 pha" className="card-green">
                  <ul>
                    <li><Text strong>Điện áp:</Text> 230V AC</li>
                    <li><Text strong>Dòng điện:</Text> 16A, 32A</li>
                    <li><Text strong>Chuẩn bảo vệ:</Text> IP44</li>
                    <li><Text strong>Bảo vệ:</Text> RCD tích hợp</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="5.2.2" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            5.2.2. Bố trí và lắp đặt
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Paragraph>
              Quy trình lắp đặt ổ cắm và công tắc:
            </Paragraph>
            
            <Card title="Quy trình lắp đặt" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentSocketStep}
                onChange={setCurrentSocketStep}
                direction="vertical"
                size="small"
                items={socketSteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Yêu cầu lắp đặt" className="card-blue">
                  <ul>
                    <li>Chiều cao lắp đặt: 0.3m từ sàn</li>
                    <li>Khoảng cách giữa các ổ cắm: 3m</li>
                    <li>Khoảng cách từ cửa: 0.5m</li>
                    <li>Bảo vệ RCD cho mỗi nhóm</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Kiểm tra sau lắp đặt" className="card-green">
                  <ul>
                    <li>Kiểm tra kết nối dây</li>
                    <li>Kiểm tra bảo vệ RCD</li>
                    <li>Kiểm tra an toàn điện</li>
                    <li>Kiểm tra hoạt động</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <div id="section-5-3" className="subsection" style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#333333', marginBottom: '16px' }}>
          5.3. Hệ thống Exit & Emergency
        </Title>
        
        <div id="5.3.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            5.3.1. Đèn Exit và Emergency
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Đèn Exit" className="card-blue">
                  <ul>
                    <li><Text strong>Loại đèn:</Text> LED Exit sign</li>
                    <li><Text strong>Công suất:</Text> 3W</li>
                    <li><Text strong>Nguồn điện:</Text> 230V AC</li>
                    <li><Text strong>Tuổi thọ:</Text> 50,000 giờ</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Đèn Emergency" className="card-green">
                  <ul>
                    <li><Text strong>Loại đèn:</Text> LED Emergency</li>
                    <li><Text strong>Công suất:</Text> 5W, 10W</li>
                    <li><Text strong>Nguồn dự phòng:</Text> 3 giờ</li>
                    <li><Text strong>Quang thông:</Text> 500-1000lm</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="5.3.2" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            5.3.2. Hệ thống điều khiển
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Paragraph>
              Hệ thống điều khiển đèn Exit và Emergency:
            </Paragraph>
            
            <Card title="Quy trình kiểm tra" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentEmergencyStep}
                onChange={setCurrentEmergencyStep}
                direction="vertical"
                size="small"
                items={emergencySteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Điều khiển tự động" className="card-blue">
                  <ul>
                    <li><Text strong>Chế độ vận hành:</Text> Tự động</li>
                    <li><Text strong>Thời gian sáng:</Text> 3 giờ</li>
                    <li><Text strong>Cảm biến mất điện:</Text> Tự động</li>
                    <li><Text strong>Kiểm tra định kỳ:</Text> Hàng tháng</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Bảo trì và kiểm tra" className="card-green">
                  <ul>
                    <li>Kiểm tra nguồn dự phòng</li>
                    <li>Kiểm tra thời gian sáng</li>
                    <li>Kiểm tra độ sáng đèn</li>
                    <li>Kiểm tra hệ thống cảnh báo</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <Divider style={{ margin: '32px 0', borderColor: '#e8e8e8', opacity: 0.6 }} />

      <Alert
        message="Lưu ý vận hành"
        description="Hệ thống chiếu sáng và ổ cắm phải được kiểm tra định kỳ và bảo trì theo đúng quy trình. Đảm bảo tuân thủ các quy định an toàn khi thao tác với thiết bị điện."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card title="Trạng thái hệ thống chiếu sáng" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <BulbOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
              <div>Hệ thống chiếu sáng</div>
              <Tag color="success">Hoạt động bình thường</Tag>
              <Progress percent={95} size="small" style={{ marginTop: '8px' }} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <ThunderboltOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
              <div>Ổ cắm và công tắc</div>
              <Tag color="processing">Đang kiểm tra</Tag>
              <Progress percent={88} size="small" style={{ marginTop: '8px' }} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <SafetyOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }} />
              <div>Exit & Emergency</div>
              <Tag color="warning">Cần bảo trì</Tag>
              <Progress percent={72} size="small" style={{ marginTop: '8px' }} />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default LightingSection;
