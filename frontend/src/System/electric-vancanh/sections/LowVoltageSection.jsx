import { Alert, Card, Col, Divider, Row, Steps, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

const LowVoltageSection = () => {
  const [currentBloksetStep, setCurrentBloksetStep] = React.useState(0);
  const [currentACBStep, setCurrentACBStep] = React.useState(0);
  const [currentMCCBStep, setCurrentMCCBStep] = React.useState(0);
  const [currentMCBStep, setCurrentMCBStep] = React.useState(0);
  const [currentRCBOStep, setCurrentRCBOStep] = React.useState(0);

  const bloksetSteps = [
    'Kiểm tra tủ Blokset',
    'Kiểm tra cấu hình',
    'Kiểm tra thiết bị đóng cắt',
    'Kiểm tra hệ thống bảo vệ',
    'Kiểm tra kết nối mạng'
  ];

  const acbSteps = [
    'Kiểm tra máy cắt ACB',
    'Kiểm tra cài đặt bảo vệ',
    'Kiểm tra cơ cấu đóng cắt',
    'Kiểm tra tiếp điểm',
    'Kiểm tra hệ thống điều khiển'
  ];

  const mccbSteps = [
    'Kiểm tra MCCB',
    'Kiểm tra cài đặt bảo vệ',
    'Kiểm tra độ nhạy',
    'Kiểm tra thời gian phản ứng',
    'Kiểm tra trạng thái hoạt động'
  ];

  const mcbSteps = [
    'Kiểm tra MCB',
    'Kiểm tra dòng định mức',
    'Kiểm tra độ nhạy',
    'Kiểm tra kết nối',
    'Kiểm tra bảo vệ'
  ];

  const rcboSteps = [
    'Kiểm tra RCBO/RCCB',
    'Kiểm tra độ nhạy RCD',
    'Kiểm tra thời gian phản ứng',
    'Kiểm tra bảo vệ quá dòng',
    'Kiểm tra kết nối đất'
  ];

  return (
    <div className="content-section">
      <Title level={2} className="section-title">
        2. TỦ ĐIỆN HẠ THẾ
      </Title>

      {/* Tủ điện ACIT */}
      <div id="2.1" className="subsection">
        <Title level={3} className="subsection-title">
          2.1. Tủ điện ACIT
        </Title>
        
        <div id="2.1.1" className="subsection">
          <Title level={4} className="subsection-title">
            2.1.1. Đặc điểm kỹ thuật
          </Title>
          <Card title="Đặc điểm kỹ thuật tủ ACIT" className="subsection">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Thông số chính" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Điện áp định mức:</Text> 400V AC</li>
                    <li><Text strong>Dòng điện định mức:</Text> 3200A</li>
                    <li><Text strong>Độ bền điện:</Text> 8kA/1s</li>
                    <li><Text strong>Chuẩn bảo vệ:</Text> IP30</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Cấu trúc tủ" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Vỏ tủ:</Text> Thép mạ kẽm</li>
                    <li><Text strong>Kích thước:</Text> 800x600x2200mm</li>
                    <li><Text strong>Trọng lượng:</Text> 450kg</li>
                    <li><Text strong>Màu sắc:</Text> RAL 7035</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="2.1.2" className="subsection">
          <Title level={4} className="subsection-title">
            2.1.2. Cấu trúc và bố trí
          </Title>
          <Card title="Cấu trúc và bố trí tủ ACIT" className="subsection">
            <Paragraph>
              Tủ điện ACIT được thiết kế theo tiêu chuẩn IEC 61439 với cấu trúc modular:
            </Paragraph>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small" title="Ngăn đầu vào" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li>Máy cắt ACB chính</li>
                    <li>Đồng hồ đa năng</li>
                    <li>Rơ le bảo vệ</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Ngăn phân phối" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li>MCCB phân phối</li>
                    <li>MCB chi tiết</li>
                    <li>Contactor điều khiển</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Ngăn điều khiển" style={{ borderColor: '#faad14' }}>
                  <ul>
                    <li>PLC điều khiển</li>
                    <li>HMI giao diện</li>
                    <li>I/O modules</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="2.1.3" className="subsection">
          <Title level={4} className="subsection-title">
            2.1.3. Thiết bị bảo vệ
          </Title>
          <Card title="Thiết bị bảo vệ tủ ACIT" className="subsection">
            <Alert
              message="Hệ thống bảo vệ toàn diện"
              description="Tủ ACIT được trang bị đầy đủ các thiết bị bảo vệ theo tiêu chuẩn IEC"
              type="success"
              showIcon
            />
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={4}>Bảo vệ quá dòng</Title>
                <ul>
                  <li>Rơ le bảo vệ quá dòng</li>
                  <li>Rơ le bảo vệ ngắn mạch</li>
                  <li>Rơ le bảo vệ chạm đất</li>
                  <li>Rơ le bảo vệ hồ quang</li>
                </ul>
              </Col>
              <Col xs={24} md={12}>
                <Title level={4}>Bảo vệ nhiệt</Title>
                <ul>
                  <li>Cảm biến nhiệt độ</li>
                  <li>Rơ le bảo vệ nhiệt</li>
                  <li>Hệ thống thông gió</li>
                  <li>Bảo vệ quá nhiệt</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <Divider />

      {/* Tủ Blokset */}
      <div id="2.2" className="subsection">
        <Title level={3} className="subsection-title">
          2.2. Tủ Blokset
        </Title>
        
        <div id="2.2.1" className="subsection">
          <Title level={4} className="subsection-title">
            2.2.1. Thông số kỹ thuật
          </Title>
          <Card title="Thông số kỹ thuật tủ Blokset" className="subsection">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Thông số điện" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Điện áp:</Text> 400V AC</li>
                    <li><Text strong>Dòng điện:</Text> 1600A</li>
                    <li><Text strong>Tần số:</Text> 50Hz</li>
                    <li><Text strong>Hệ số công suất:</Text> ≥0.95</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Thông số cơ" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Kích thước:</Text> 600x400x2000mm</li>
                    <li><Text strong>Trọng lượng:</Text> 280kg</li>
                    <li><Text strong>Chuẩn bảo vệ:</Text> IP40</li>
                    <li><Text strong>Vật liệu:</Text> Thép mạ kẽm</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="2.2.2" className="subsection">
          <Title level={4} className="subsection-title">
            2.2.2. Cấu hình và lắp đặt
          </Title>
          <Card title="Cấu hình và lắp đặt tủ Blokset" className="subsection">
            <Paragraph>
              Quy trình cấu hình và lắp đặt tủ Blokset:
            </Paragraph>
            
            <Card title="Quy trình cấu hình" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentBloksetStep}
                onChange={setCurrentBloksetStep}
                direction="vertical"
                size="small"
                items={bloksetSteps.map((step, index) => ({
                  title: step,
                  description: `Bước ${index + 1} trong quy trình`
                }))}
              />
            </Card>
          </Card>
        </div>

        <div id="2.2.3" className="subsection">
          <Title level={4} className="subsection-title">
            2.2.3. Vận hành và bảo trì
          </Title>
          <Card title="Vận hành và bảo trì tủ Blokset" className="subsection">
            <Alert
              message="Hướng dẫn vận hành"
              description="Tuân thủ quy trình vận hành và bảo trì định kỳ để đảm bảo an toàn"
              type="info"
              showIcon
            />
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={4}>Vận hành hàng ngày</Title>
                <ul>
                  <li>Kiểm tra trạng thái hoạt động</li>
                  <li>Kiểm tra nhiệt độ tủ</li>
                  <li>Kiểm tra các đèn báo</li>
                  <li>Ghi chép thông số vận hành</li>
                </ul>
              </Col>
              <Col xs={24} md={12}>
                <Title level={4}>Bảo trì định kỳ</Title>
                <ul>
                  <li>Kiểm tra thiết bị bảo vệ</li>
                  <li>Kiểm tra kết nối điện</li>
                  <li>Làm sạch bên trong tủ</li>
                  <li>Kiểm tra hệ thống thông gió</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <Divider />

      {/* Máy cắt ACB MTZ2 Schneider */}
      <div id="2.3" className="subsection">
        <Title level={3} className="subsection-title">
          2.3. Máy cắt ACB MTZ2 Schneider
        </Title>
        
        <div id="2.3.1" className="subsection">
          <Title level={4} className="subsection-title">
            2.3.1. Đặc điểm kỹ thuật
          </Title>
          <Card title="Đặc điểm kỹ thuật ACB MTZ2" className="subsection">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Thông số điện" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Điện áp:</Text> 400V AC</li>
                    <li><Text strong>Dòng điện:</Text> 4000A</li>
                    <li><Text strong>Độ bền ngắn mạch:</Text> 65kA</li>
                    <li><Text strong>Độ bền nhiệt:</Text> 65kA/1s</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Tính năng bảo vệ" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li>Bảo vệ quá dòng</li>
                    <li>Bảo vệ ngắn mạch</li>
                    <li>Bảo vệ chạm đất</li>
                    <li>Bảo vệ hồ quang</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="2.3.2" className="subsection">
          <Title level={4} className="subsection-title">
            2.3.2. Cài đặt bảo vệ
          </Title>
          <Card title="Cài đặt bảo vệ ACB MTZ2" className="subsection">
            <Paragraph>
              Quy trình cài đặt các thông số bảo vệ:
            </Paragraph>
            
            <Card title="Quy trình cài đặt" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentACBStep}
                onChange={setCurrentACBStep}
                direction="vertical"
                size="small"
                items={acbSteps.map((step, index) => ({
                  title: step,
                  description: `Bước ${index + 1} trong quy trình`
                }))}
              />
            </Card>
          </Card>
        </div>

        <div id="2.3.3" className="subsection">
          <Title level={4} className="subsection-title">
            2.3.3. Vận hành và kiểm tra
          </Title>
          <Card title="Vận hành và kiểm tra ACB MTZ2" className="subsection">
            <Alert
              message="Hướng dẫn vận hành"
              description="Tuân thủ quy trình vận hành để đảm bảo an toàn và hiệu quả"
              type="warning"
              showIcon
            />
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={4}>Kiểm tra trước vận hành</Title>
                <ul>
                  <li>Kiểm tra trạng thái cơ khí</li>
                  <li>Kiểm tra cài đặt bảo vệ</li>
                  <li>Kiểm tra nguồn điều khiển</li>
                  <li>Kiểm tra hệ thống báo hiệu</li>
                </ul>
              </Col>
              <Col xs={24} md={12}>
                <Title level={4}>Vận hành an toàn</Title>
                <ul>
                  <li>Đóng cắt theo quy trình</li>
                  <li>Quan sát các đèn báo</li>
                  <li>Ghi chép thông số</li>
                  <li>Báo cáo sự cố nếu có</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <Divider />

      {/* MCCB Schneider */}
      <div id="2.4" className="subsection">
        <Title level={3} className="subsection-title">
          2.4. MCCB Schneider
        </Title>
        
        <div id="2.4.1" className="subsection">
          <Title level={4} className="subsection-title">
            2.4.1. Thông số kỹ thuật
          </Title>
          <Card title="Thông số kỹ thuật MCCB Schneider" className="subsection">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Thông số điện" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Điện áp:</Text> 400V AC</li>
                    <li><Text strong>Dòng điện:</Text> 63A - 800A</li>
                    <li><Text strong>Độ bền ngắn mạch:</Text> 10kA - 25kA</li>
                    <li><Text strong>Tiêu chuẩn:</Text> IEC 60947-2</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Tính năng bảo vệ" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li>Bảo vệ quá dòng</li>
                    <li>Bảo vệ ngắn mạch</li>
                    <li>Bảo vệ chạm đất</li>
                    <li>Bảo vệ nhiệt</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="2.4.2" className="subsection">
          <Title level={4} className="subsection-title">
            2.4.2. Cài đặt và bảo vệ
          </Title>
          <Card title="Cài đặt và bảo vệ MCCB" className="subsection">
            <Paragraph>
              Quy trình cài đặt và cấu hình bảo vệ:
            </Paragraph>
            
            <Card title="Quy trình cài đặt" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentMCCBStep}
                onChange={setCurrentMCCBStep}
                direction="vertical"
                size="small"
                items={mccbSteps.map((step, index) => ({
                  title: step,
                  description: `Bước ${index + 1} trong quy trình`
                }))}
              />
            </Card>
          </Card>
        </div>

        <div id="2.4.3" className="subsection">
          <Title level={4} className="subsection-title">
            2.4.3. Kiểm tra định kỳ
          </Title>
          <Card title="Kiểm tra định kỳ MCCB" className="subsection">
            <Alert
              message="Lịch kiểm tra định kỳ"
              description="Thực hiện kiểm tra theo lịch trình để đảm bảo hoạt động ổn định"
              type="info"
              showIcon
            />
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={4}>Kiểm tra hàng tháng</Title>
                <ul>
                  <li>Kiểm tra trạng thái hoạt động</li>
                  <li>Kiểm tra nhiệt độ</li>
                  <li>Kiểm tra các đèn báo</li>
                  <li>Ghi chép thông số</li>
                </ul>
              </Col>
              <Col xs={24} md={12}>
                <Title level={4}>Kiểm tra hàng quý</Title>
                <ul>
                  <li>Kiểm tra cài đặt bảo vệ</li>
                  <li>Kiểm tra độ nhạy</li>
                  <li>Kiểm tra thời gian phản ứng</li>
                  <li>Kiểm tra kết nối</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <Divider />

      {/* MCB Schneider */}
      <div id="2.5" className="subsection">
        <Title level={3} className="subsection-title">
          2.5. MCB Schneider
        </Title>
        
        <div id="2.5.1" className="subsection">
          <Title level={4} className="subsection-title">
            2.5.1. Đặc điểm kỹ thuật
          </Title>
          <Card title="Đặc điểm kỹ thuật MCB Schneider" className="subsection">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Thông số điện" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Điện áp:</Text> 230V/400V AC</li>
                    <li><Text strong>Dòng điện:</Text> 1A - 63A</li>
                    <li><Text strong>Độ bền ngắn mạch:</Text> 6kA - 10kA</li>
                    <li><Text strong>Tiêu chuẩn:</Text> IEC 60898</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Tính năng bảo vệ" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li>Bảo vệ quá dòng</li>
                    <li>Bảo vệ ngắn mạch</li>
                    <li>Bảo vệ nhiệt</li>
                    <li>Bảo vệ cơ khí</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="2.5.2" className="subsection">
          <Title level={4} className="subsection-title">
            2.5.2. Lắp đặt và kết nối
          </Title>
          <Card title="Lắp đặt và kết nối MCB" className="subsection">
            <Paragraph>
              Quy trình lắp đặt và kết nối MCB:
            </Paragraph>
            
            <Card title="Quy trình lắp đặt" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentMCBStep}
                onChange={setCurrentMCBStep}
                direction="vertical"
                size="small"
                items={mcbSteps.map((step, index) => ({
                  title: step,
                  description: `Bước ${index + 1} trong quy trình`
                }))}
              />
            </Card>
          </Card>
        </div>

        <div id="2.5.3" className="subsection">
          <Title level={4} className="subsection-title">
            2.5.3. Bảo trì và thay thế
          </Title>
          <Card title="Bảo trì và thay thế MCB" className="subsection">
            <Alert
              message="Hướng dẫn bảo trì"
              description="Thực hiện bảo trì định kỳ để đảm bảo tuổi thọ và hiệu quả hoạt động"
              type="success"
              showIcon
            />
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={4}>Bảo trì định kỳ</Title>
                <ul>
                  <li>Kiểm tra trạng thái hoạt động</li>
                  <li>Kiểm tra nhiệt độ</li>
                  <li>Kiểm tra kết nối</li>
                  <li>Làm sạch bề mặt</li>
                </ul>
              </Col>
              <Col xs={24} md={12}>
                <Title level={4}>Thay thế khi cần</Title>
                <ul>
                  <li>Khi có dấu hiệu hư hỏng</li>
                  <li>Khi không đáp ứng yêu cầu bảo vệ</li>
                  <li>Khi có thay đổi tải</li>
                  <li>Theo khuyến nghị nhà sản xuất</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <Divider />

      {/* RCBO & RCCB ABB */}
      <div id="2.6" className="subsection">
        <Title level={3} className="subsection-title">
          2.6. RCBO & RCCB ABB
        </Title>
        
        <div id="2.6.1" className="subsection">
          <Title level={4} className="subsection-title">
            2.6.1. Thông số kỹ thuật
          </Title>
          <Card title="Thông số kỹ thuật RCBO & RCCB ABB" className="subsection">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="RCBO (Residual Current Breaker with Overcurrent)" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Điện áp:</Text> 230V AC</li>
                    <li><Text strong>Dòng điện:</Text> 6A - 63A</li>
                    <li><Text strong>Độ nhạy RCD:</Text> 30mA</li>
                    <li><Text strong>Độ bền ngắn mạch:</Text> 6kA</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="RCCB (Residual Current Circuit Breaker)" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Điện áp:</Text> 230V/400V AC</li>
                    <li><Text strong>Dòng điện:</Text> 16A - 125A</li>
                    <li><Text strong>Độ nhạy RCD:</Text> 30mA, 100mA, 300mA</li>
                    <li><Text strong>Độ bền ngắn mạch:</Text> 6kA</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="2.6.2" className="subsection">
          <Title level={4} className="subsection-title">
            2.6.2. Cài đặt bảo vệ
          </Title>
          <Card title="Cài đặt bảo vệ RCBO & RCCB" className="subsection">
            <Paragraph>
              Quy trình cài đặt và cấu hình bảo vệ:
            </Paragraph>
            
            <Card title="Quy trình cài đặt" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentRCBOStep}
                onChange={setCurrentRCBOStep}
                direction="vertical"
                size="small"
                items={rcboSteps.map((step, index) => ({
                  title: step,
                  description: `Bước ${index + 1} trong quy trình`
                }))}
              />
            </Card>
          </Card>
        </div>

        <div id="2.6.3" className="subsection">
          <Title level={4} className="subsection-title">
            2.6.3. Kiểm tra và thử nghiệm
          </Title>
          <Card title="Kiểm tra và thử nghiệm RCBO & RCCB" className="subsection">
            <Alert
              message="Quy trình kiểm tra"
              description="Thực hiện kiểm tra định kỳ để đảm bảo độ nhạy và hiệu quả bảo vệ"
              type="warning"
              showIcon
            />
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={4}>Kiểm tra hàng tháng</Title>
                <ul>
                  <li>Kiểm tra trạng thái hoạt động</li>
                  <li>Kiểm tra đèn báo</li>
                  <li>Kiểm tra kết nối</li>
                  <li>Ghi chép thông số</li>
                </ul>
              </Col>
              <Col xs={24} md={12}>
                <Title level={4}>Thử nghiệm hàng quý</Title>
                <ul>
                  <li>Test độ nhạy RCD</li>
                  <li>Test thời gian phản ứng</li>
                  <li>Test chức năng bảo vệ</li>
                  <li>Test cơ cấu đóng cắt</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LowVoltageSection;
