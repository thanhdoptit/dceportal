import { SafetyOutlined, ThunderboltOutlined, ToolOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider, Row, Steps, Tag, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

const ProtectionSection = () => {
  const [currentARCStep, setCurrentARCStep] = React.useState(0);
  const [currentSPDStep, setCurrentSPDStep] = React.useState(0);
  const [currentGroundStep, setCurrentGroundStep] = React.useState(0);

  const arcSteps = [
    'Kiểm tra rơ le ARC',
    'Kiểm tra cài đặt thông số',
    'Kiểm tra kết nối cảm biến',
    'Kiểm tra hệ thống điều khiển',
    'Kiểm tra đèn báo và cảnh báo'
  ];

  const spdSteps = [
    'Kiểm tra thiết bị SPD',
    'Kiểm tra kết nối đất',
    'Kiểm tra trạng thái hoạt động',
    'Kiểm tra tuổi thọ còn lại',
    'Kiểm tra hệ thống cảnh báo'
  ];

  const groundSteps = [
    'Kiểm tra hệ thống tiếp địa',
    'Đo điện trở nối đất',
    'Kiểm tra kết nối cáp đất',
    'Kiểm tra điểm nối đất',
    'Kiểm tra hệ thống bảo vệ'
  ];

  return (
    <div className="content-section">
      <Title level={2} id="section-3" className="ant-typography">
        3. HỆ THỐNG BẢO VỆ
      </Title>

      <div id="3.1" className="subsection">
        <Title level={3} className="ant-typography">
          3.1. Rơ le bảo vệ hồ quang ARC Schneider
        </Title>
        
        <div id="3.1.1" className="subsection">
          <Title level={4} className="ant-typography">
            3.1.1. Nguyên lý hoạt động
          </Title>
          <Card>
            <Alert
              message="Bảo vệ hồ quang điện"
              description="Rơ le ARC phát hiện và cắt nhanh hồ quang điện trong tủ điện để bảo vệ người và thiết bị"
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Nguyên lý phát hiện" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Cảm biến ánh sáng:</Text> Phát hiện tia lửa điện</li>
                    <li><Text strong>Cảm biến áp suất:</Text> Phát hiện sóng nổ</li>
                    <li><Text strong>Cảm biến dòng điện:</Text> Phát hiện quá dòng</li>
                    <li><Text strong>Thời gian phản ứng:</Text> ≤5ms</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Cơ chế bảo vệ" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Phát hiện hồ quang:</Text> Tự động</li>
                    <li><Text strong>Truyền tín hiệu:</Text> Fiber optic</li>
                    <li><Text strong>Thời gian cắt:</Text> ≤10ms</li>
                    <li><Text strong>Bảo vệ toàn bộ:</Text> Tủ điện</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="3.1.2" className="subsection">
          <Title level={4} className="ant-typography">
            3.1.2. Cài đặt thông số
          </Title>
          <Card>
            <Paragraph>
              Cài đặt các thông số bảo vệ cho rơ le ARC:
            </Paragraph>
            
            <Card title="Quy trình cài đặt" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentARCStep}
                onChange={setCurrentARCStep}
                direction="vertical"
                size="small"
                items={arcSteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Thông số cài đặt" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Độ nhạy ánh sáng:</Text> 0.1 lux</li>
                    <li><Text strong>Độ nhạy áp suất:</Text> 0.1 bar</li>
                    <li><Text strong>Thời gian delay:</Text> 0-1000ms</li>
                    <li><Text strong>Ngưỡng dòng điện:</Text> 100A</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Cài đặt cảnh báo" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Đèn báo:</Text> Xanh, vàng, đỏ</li>
                    <li><Text strong>Relay output:</Text> 2 cặp tiếp điểm</li>
                    <li><Text strong>Giao diện:</Text> LCD + nút bấm</li>
                    <li><Text strong>Truyền thông:</Text> Modbus RTU</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <div id="3.2" className="subsection">
        <Title level={3} className="ant-typography">
          3.2. Chống sét lan truyền
        </Title>
        
        <div id="3.2.1" className="subsection">
          <Title level={4} className="ant-typography">
            3.2.1. Loại thiết bị SPD
          </Title>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small" title="SPD Type 1" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Vị trí:</Text> Đầu vào tủ điện</li>
                    <li><Text strong>Bảo vệ:</Text> Sét đánh trực tiếp</li>
                    <li><Text strong>Dòng sét:</Text> 50kA (10/350μs)</li>
                    <li><Text strong>Điện áp:</Text> 400V AC</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="SPD Type 2" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Vị trí:</Text> Phân phối điện</li>
                    <li><Text strong>Bảo vệ:</Text> Sét lan truyền</li>
                    <li><Text strong>Dòng sét:</Text> 20kA (8/20μs)</li>
                    <li><Text strong>Điện áp:</Text> 400V AC</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="SPD Type 3" style={{ borderColor: '#faad14' }}>
                  <ul>
                    <li><Text strong>Vị trí:</Text> Thiết bị cuối</li>
                    <li><Text strong>Bảo vệ:</Text> Nhiễu điện</li>
                    <li><Text strong>Dòng sét:</Text> 10kA (8/20μs)</li>
                    <li><Text strong>Điện áp:</Text> 230V AC</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="3.2.2" className="subsection">
          <Title level={4} className="ant-typography">
            3.2.2. Lắp đặt và kết nối
          </Title>
          <Card>
            <Paragraph>
              Quy trình lắp đặt SPD theo tiêu chuẩn IEC 61643:
            </Paragraph>
            
            <Card title="Quy trình lắp đặt" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentSPDStep}
                onChange={setCurrentSPDStep}
                direction="vertical"
                size="small"
                items={spdSteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Yêu cầu lắp đặt" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li>Khoảng cách dây đất ≤0.5m</li>
                    <li>Tiết diện dây đất ≥16mm²</li>
                    <li>Điện trở đất ≤10Ω</li>
                    <li>Kết nối song song</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Kiểm tra sau lắp đặt" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li>Kiểm tra kết nối điện</li>
                    <li>Kiểm tra kết nối đất</li>
                    <li>Kiểm tra đèn báo trạng thái</li>
                    <li>Đo điện trở đất</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <div id="3.3" className="subsection">
        <Title level={3} className="ant-typography">
          3.3. Tiếp địa và nối đất
        </Title>
        
        <div id="3.3.1" className="subsection">
          <Title level={4} className="ant-typography">
            3.3.1. Hệ thống tiếp địa
          </Title>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Cấu trúc hệ thống" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Loại cọc đất:</Text> Đồng mạ kẽm</li>
                    <li><Text strong>Chiều dài cọc:</Text> 3m</li>
                    <li><Text strong>Số lượng cọc:</Text> 8 cọc</li>
                    <li><Text strong>Khoảng cách:</Text> 3m</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Thông số kỹ thuật" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Điện trở đất:</Text> ≤2Ω</li>
                    <li><Text strong>Tiết diện cáp:</Text> 70mm²</li>
                    <li><Text strong>Chất liệu cáp:</Text> Đồng trần</li>
                    <li><Text strong>Độ sâu chôn:</Text> 0.8m</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="3.3.2" className="subsection">
          <Title level={4} className="ant-typography">
            3.3.2. Điện trở nối đất
          </Title>
          <Card>
            <Paragraph>
              Kiểm tra và đo điện trở nối đất định kỳ:
            </Paragraph>
            
            <Card title="Quy trình kiểm tra" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentGroundStep}
                onChange={setCurrentGroundStep}
                direction="vertical"
                size="small"
                items={groundSteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Tiêu chuẩn đo" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Phương pháp:</Text> 3 điểm</li>
                    <li><Text strong>Thiết bị đo:</Text> Earth tester</li>
                    <li><Text strong>Tần số đo:</Text> 128Hz</li>
                    <li><Text strong>Độ chính xác:</Text> ±2%</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Chu kỳ kiểm tra" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Kiểm tra định kỳ:</Text> 6 tháng</li>
                    <li><Text strong>Kiểm tra sau sét:</Text> Ngay lập tức</li>
                    <li><Text strong>Kiểm tra sau mưa:</Text> 24h</li>
                    <li><Text strong>Ghi chép:</Text> Bắt buộc</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <Divider />

      <Alert
        message="Lưu ý an toàn"
        description="Hệ thống bảo vệ phải được kiểm tra định kỳ và bảo trì theo đúng quy trình. Đảm bảo tuân thủ các quy định an toàn khi thao tác với thiết bị điện."
        type="warning"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card title="Trạng thái hệ thống bảo vệ">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <SafetyOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
              <div>Rơ le ARC</div>
              <Tag color="success">Hoạt động bình thường</Tag>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <ThunderboltOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }} />
              <div>SPD</div>
              <Tag color="warning">Cần kiểm tra</Tag>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <ToolOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
              <div>Tiếp địa</div>
              <Tag color="processing">Đang đo</Tag>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProtectionSection;
