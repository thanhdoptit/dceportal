import { FileTextOutlined, ThunderboltOutlined, ToolOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider, Progress, Row, Steps, Tag, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

const CableSection = () => {
  const [currentMainCableStep, setCurrentMainCableStep] = React.useState(0);
  const [currentCableTrayStep, setCurrentCableTrayStep] = React.useState(0);
  const [currentInstallationStep, setCurrentInstallationStep] = React.useState(0);

  const mainCableSteps = [
    'Kiểm tra loại cáp',
    'Kiểm tra tiết diện',
    'Kiểm tra cách điện',
    'Kiểm tra vỏ bảo vệ',
    'Kiểm tra chứng chỉ'
  ];

  const cableTraySteps = [
    'Kiểm tra thang máng cáp',
    'Kiểm tra kết nối',
    'Kiểm tra độ bền',
    'Kiểm tra khoảng cách',
    'Kiểm tra an toàn'
  ];

  const installationSteps = [
    'Lập kế hoạch kéo cáp',
    'Chuẩn bị thiết bị',
    'Kéo cáp theo tuyến',
    'Kết nối và đánh nhãn',
    'Kiểm tra và nghiệm thu'
  ];

  return (
    <div className="content-section">
      <Title level={2} id="section-6" style={{ color: '#0072BC', marginBottom: '24px' }}>
        6. HỆ THỐNG CÁP ĐIỆN
      </Title>

      <div id="6.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#333333', marginBottom: '16px' }}>
          6.1. Cáp điện chính
        </Title>
        
        <div id="6.1.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            6.1.1. Loại cáp và tiết diện
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Alert
              message="Hệ thống cáp điện theo tiêu chuẩn IEC"
              description="Sử dụng cáp điện chất lượng cao, đảm bảo an toàn và hiệu quả truyền tải điện năng"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Cáp điện 3 pha" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Loại cáp:</Text> Cu/PVC/PVC</li>
                    <li><Text strong>Tiết diện:</Text> 240mm², 400mm²</li>
                    <li><Text strong>Điện áp:</Text> 0.6/1kV</li>
                    <li><Text strong>Dòng điện:</Text> 400A, 600A</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Cáp điện 1 pha" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Loại cáp:</Text> Cu/PVC/PVC</li>
                    <li><Text strong>Tiết diện:</Text> 16mm², 25mm²</li>
                    <li><Text strong>Điện áp:</Text> 0.6/1kV</li>
                    <li><Text strong>Dòng điện:</Text> 80A, 100A</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="6.1.2" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            6.1.2. Lắp đặt và kéo cáp
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Paragraph>
              Quy trình lắp đặt và kéo cáp điện:
            </Paragraph>
            
            <Card title="Quy trình kiểm tra" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentMainCableStep}
                onChange={setCurrentMainCableStep}
                direction="vertical"
                size="small"
                items={mainCableSteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Yêu cầu lắp đặt" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li>Khoảng cách giữa các cáp: ≥1D</li>
                    <li>Bán kính uốn cong: ≥12D</li>
                    <li>Độ sâu chôn cáp: ≥0.8m</li>
                    <li>Bảo vệ cơ học: Ống PVC</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Kiểm tra sau lắp đặt" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li>Kiểm tra cách điện</li>
                    <li>Kiểm tra kết nối</li>
                    <li>Kiểm tra tiếp địa</li>
                    <li>Kiểm tra an toàn</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <div id="6.2" className="subsection" style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#333333', marginBottom: '16px' }}>
          6.2. Thang máng cáp
        </Title>
        
        <div id="6.2.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            6.2.1. Bố trí thang máng
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small" title="Thang máng chính" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Kích thước:</Text> 600x150mm</li>
                    <li><Text strong>Chất liệu:</Text> Thép mạ kẽm</li>
                    <li><Text strong>Độ dày:</Text> 2.5mm</li>
                    <li><Text strong>Tải trọng:</Text> 100kg/m</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Thang máng nhánh" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Kích thước:</Text> 400x100mm</li>
                    <li><Text strong>Chất liệu:</Text> Thép mạ kẽm</li>
                    <li><Text strong>Độ dày:</Text> 2.0mm</li>
                    <li><Text strong>Tải trọng:</Text> 50kg/m</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="Phụ kiện" style={{ borderColor: '#faad14' }}>
                  <ul>
                    <li><Text strong>Khớp nối:</Text> 2m/khớp</li>
                    <li><Text strong>Giá đỡ:</Text> 1.5m/giá</li>
                    <li><Text strong>Nút bịt:</Text> 2 đầu</li>
                    <li><Text strong>Ống xuyên:</Text> Theo yêu cầu</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="6.2.2" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            6.2.2. Lắp đặt và kết nối
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Paragraph>
              Quy trình lắp đặt thang máng cáp:
            </Paragraph>
            
            <Card title="Quy trình lắp đặt" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentCableTrayStep}
                onChange={setCurrentCableTrayStep}
                direction="vertical"
                size="small"
                items={cableTraySteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Yêu cầu lắp đặt" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li>Chiều cao từ sàn: ≥2.5m</li>
                    <li>Khoảng cách giá đỡ: ≤1.5m</li>
                    <li>Độ nghiêng cho phép: ≤5°</li>
                    <li>Khoảng cách từ tường: ≥0.1m</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Kết nối và bảo vệ" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li>Kết nối bằng bulong M8</li>
                    <li>Tiếp địa mỗi đoạn</li>
                    <li>Bảo vệ chống ăn mòn</li>
                    <li>Kiểm tra độ bền</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <div id="6.3" className="subsection" style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#333333', marginBottom: '16px' }}>
          6.3. Kéo cáp đến thiết bị
        </Title>
        
        <div id="6.3.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            6.3.1. Quy trình kéo cáp
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Paragraph>
              Quy trình kéo cáp từ thang máng đến thiết bị:
            </Paragraph>
            
            <Card title="Quy trình thực hiện" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentInstallationStep}
                onChange={setCurrentInstallationStep}
                direction="vertical"
                size="small"
                items={installationSteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Chuẩn bị" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li>Kiểm tra tuyến cáp</li>
                    <li>Chuẩn bị thiết bị</li>
                    <li>Kiểm tra an toàn</li>
                    <li>Phân công nhân sự</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Thực hiện" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li>Kéo cáp theo tuyến</li>
                    <li>Tránh căng và gập</li>
                    <li>Bảo vệ cáp</li>
                    <li>Ghi chép quá trình</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="6.3.2" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            6.3.2. Kết nối và đánh nhãn
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Kết nối cáp" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Đầu cáp:</Text> Đầu cosse</li>
                    <li><Text strong>Kết nối:</Text> Bulong M8</li>
                    <li><Text strong>Tiếp địa:</Text> Bắt buộc</li>
                    <li><Text strong>Bảo vệ:</Text> Ống PVC</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Đánh nhãn cáp" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Loại nhãn:</Text> Nhãn dán</li>
                    <li><Text strong>Nội dung:</Text> Ký hiệu cáp</li>
                    <li><Text strong>Vị trí:</Text> 2 đầu cáp</li>
                    <li><Text strong>Chất liệu:</Text> Chống thấm</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <Divider style={{ margin: '32px 0', borderColor: '#e8e8e8', opacity: 0.6 }} />

      <Alert
        message="Lưu ý an toàn"
        description="Khi thao tác với cáp điện phải tuân thủ nghiêm ngặt các quy định an toàn. Đảm bảo cắt điện trước khi thao tác và sử dụng thiết bị bảo hộ đầy đủ."
        type="warning"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card title="Trạng thái hệ thống cáp điện" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <ThunderboltOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
              <div>Cáp điện chính</div>
              <Tag color="success">Hoạt động bình thường</Tag>
              <Progress percent={90} size="small" style={{ marginTop: '8px' }} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <ToolOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
              <div>Thang máng cáp</div>
              <Tag color="processing">Đang kiểm tra</Tag>
              <Progress percent={85} size="small" style={{ marginTop: '8px' }} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <FileTextOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }} />
              <div>Đánh nhãn cáp</div>
              <Tag color="warning">Cần cập nhật</Tag>
              <Progress percent={75} size="small" style={{ marginTop: '8px' }} />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default CableSection;
