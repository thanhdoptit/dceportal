import { MonitorOutlined, SafetyOutlined, ToolOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider, Progress, Row, Steps, Table, Tag, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

const MonitoringSection = () => {
  const [currentMonitoringStep, setCurrentMonitoringStep] = React.useState(0);
  const [currentMaintenanceStep, setCurrentMaintenanceStep] = React.useState(0);
  const [currentTroubleshootingStep, setCurrentTroubleshootingStep] = React.useState(0);

  const monitoringSteps = [
    'Kiểm tra hệ thống SCADA',
    'Kiểm tra các thông số giám sát',
    'Kiểm tra hệ thống cảnh báo',
    'Kiểm tra báo cáo và ghi chép',
    'Kiểm tra truyền thông dữ liệu'
  ];

  const maintenanceSteps = [
    'Lập kế hoạch bảo trì',
    'Chuẩn bị thiết bị và nhân sự',
    'Thực hiện bảo trì theo quy trình',
    'Kiểm tra và nghiệm thu',
    'Ghi chép và báo cáo'
  ];

  const troubleshootingSteps = [
    'Phân tích sự cố',
    'Xác định nguyên nhân',
    'Thực hiện khắc phục',
    'Kiểm tra khôi phục',
    'Ghi chép và rút kinh nghiệm'
  ];

  // Dữ liệu bảng bảo trì
  const maintenanceData = [
    {
      key: '1',
      equipment: 'Tủ điện ACIT',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-07-15',
      status: 'Hoàn thành',
      technician: 'Nguyễn Văn A'
    },
    {
      key: '2',
      equipment: 'Máy cắt ACB',
      lastMaintenance: '2024-02-01',
      nextMaintenance: '2024-08-01',
      status: 'Hoàn thành',
      technician: 'Trần Văn B'
    },
    {
      key: '3',
      equipment: 'Hệ thống tụ bù',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-07-20',
      status: 'Đang thực hiện',
      technician: 'Lê Văn C'
    }
  ];

  const maintenanceColumns = [
    {
      title: 'Thiết bị',
      dataIndex: 'equipment',
      key: 'equipment',
    },
    {
      title: 'Bảo trì lần cuối',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
    },
    {
      title: 'Bảo trì lần tới',
      dataIndex: 'nextMaintenance',
      key: 'nextMaintenance',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Hoàn thành' ? 'success' : 'processing'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Kỹ thuật viên',
      dataIndex: 'technician',
      key: 'technician',
    }
  ];

  return (
    <div className="content-section">
      <Title level={2} id="section-7" style={{ color: '#0072BC', marginBottom: '24px' }}>
        7. GIÁM SÁT & BẢO TRÌ
      </Title>

      <div id="7.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#333333', marginBottom: '16px' }}>
          7.1. Hệ thống giám sát
        </Title>
        
        <div id="7.1.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            7.1.1. Monitoring và SCADA
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Alert
              message="Hệ thống SCADA tích hợp"
              description="Hệ thống giám sát và điều khiển thu thập dữ liệu từ tất cả thiết bị điện để giám sát và điều khiển tập trung"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Hệ thống SCADA" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Phần mềm:</Text> WinCC SCADA</li>
                    <li><Text strong>Giao diện:</Text> HMI Touch Screen</li>
                    <li><Text strong>Truyền thông:</Text> Modbus TCP/IP</li>
                    <li><Text strong>Lưu trữ:</Text> SQL Server</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Chức năng chính" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li>Giám sát thời gian thực</li>
                    <li>Điều khiển từ xa</li>
                    <li>Ghi chép dữ liệu</li>
                    <li>Báo cáo tự động</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="7.1.2" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            7.1.2. Các thông số giám sát
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Paragraph>
              Các thông số được giám sát liên tục:
            </Paragraph>
            
            <Card title="Quy trình kiểm tra" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentMonitoringStep}
                onChange={setCurrentMonitoringStep}
                direction="vertical"
                size="small"
                items={monitoringSteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Thông số điện" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Điện áp:</Text> 3 pha, 400V AC</li>
                    <li><Text strong>Dòng điện:</Text> 3 pha, 0-3200A</li>
                    <li><Text strong>Công suất:</Text> P, Q, S, cosφ</li>
                    <li><Text strong>Tần số:</Text> 50Hz ±0.5%</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Thông số môi trường" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Nhiệt độ:</Text> -10°C đến +60°C</li>
                    <li><Text strong>Độ ẩm:</Text> 0-95% RH</li>
                    <li><Text strong>Áp suất:</Text> 860-1060 hPa</li>
                    <li><Text strong>Bụi:</Text> ≤10mg/m³</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <div id="7.2" className="subsection" style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#333333', marginBottom: '16px' }}>
          7.2. Bảo trì định kỳ
        </Title>
        
        <div id="7.2.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            7.2.1. Lịch bảo trì
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Bảo trì định kỳ" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Hàng ngày:</Text> Kiểm tra tổng quan</li>
                    <li><Text strong>Hàng tuần:</Text> Kiểm tra chi tiết</li>
                    <li><Text strong>Hàng tháng:</Text> Bảo trì nhỏ</li>
                    <li><Text strong>Hàng năm:</Text> Bảo trì lớn</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Bảo trì theo tình trạng" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Bảo trì phòng ngừa:</Text> Theo lịch</li>
                    <li><Text strong>Bảo trì dự đoán:</Text> Theo cảm biến</li>
                    <li><Text strong>Bảo trì khắc phục:</Text> Khi có sự cố</li>
                    <li><Text strong>Bảo trì cải tiến:</Text> Nâng cấp hệ thống</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id="7.2.2" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            7.2.2. Quy trình bảo trì
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Paragraph>
              Quy trình bảo trì chuẩn:
            </Paragraph>
            
            <Card title="Quy trình thực hiện" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentMaintenanceStep}
                onChange={setCurrentMaintenanceStep}
                direction="vertical"
                size="small"
                items={maintenanceSteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Chuẩn bị bảo trì" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li>Lập kế hoạch chi tiết</li>
                    <li>Chuẩn bị thiết bị</li>
                    <li>Phân công nhân sự</li>
                    <li>Kiểm tra an toàn</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Thực hiện bảo trì" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li>Tuân thủ quy trình</li>
                    <li>Kiểm tra từng bước</li>
                    <li>Ghi chép đầy đủ</li>
                    <li>Kiểm tra chất lượng</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <div id="7.3" className="subsection" style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#333333', marginBottom: '16px' }}>
          7.3. Xử lý sự cố
        </Title>
        
        <div id="7.3.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
          <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
            7.3.1. Quy trình xử lý sự cố
          </Title>
          <Card style={{ marginBottom: '24px' }}>
            <Alert
              message="Xử lý sự cố khẩn cấp"
              description="Khi có sự cố xảy ra, phải tuân thủ nghiêm ngặt quy trình xử lý sự cố để đảm bảo an toàn và khôi phục nhanh chóng"
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <Card title="Quy trình xử lý" style={{ marginBottom: '16px' }}>
              <Steps
                current={currentTroubleshootingStep}
                onChange={setCurrentTroubleshootingStep}
                direction="vertical"
                size="small"
                items={troubleshootingSteps.map((step) => ({
                  title: step,
                  description: null
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Phân loại sự cố" style={{ borderColor: '#1890ff' }}>
                  <ul>
                    <li><Text strong>Mức 1:</Text> Sự cố nhỏ</li>
                    <li><Text strong>Mức 2:</Text> Sự cố trung bình</li>
                    <li><Text strong>Mức 3:</Text> Sự cố lớn</li>
                    <li><Text strong>Mức 4:</Text> Sự cố nghiêm trọng</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Thời gian xử lý" style={{ borderColor: '#52c41a' }}>
                  <ul>
                    <li><Text strong>Mức 1:</Text> ≤2 giờ</li>
                    <li><Text strong>Mức 2:</Text> ≤8 giờ</li>
                    <li><Text strong>Mức 3:</Text> ≤24 giờ</li>
                    <li><Text strong>Mức 4:</Text> ≤72 giờ</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <Divider style={{ margin: '32px 0', borderColor: '#e8e8e8', opacity: 0.6 }} />

      <Alert
        message="Lưu ý quan trọng"
        description="Tất cả hoạt động bảo trì và xử lý sự cố phải được ghi chép đầy đủ và báo cáo theo đúng quy định. Đảm bảo tuân thủ các quy trình an toàn."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card title="Lịch bảo trì hệ thống điện" style={{ marginBottom: '24px' }}>
        <Table
          dataSource={maintenanceData}
          columns={maintenanceColumns}
          pagination={false}
          size="small"
        />
      </Card>

      <Card title="Trạng thái hệ thống giám sát" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <MonitorOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
              <div>Hệ thống SCADA</div>
              <Tag color="success">Hoạt động bình thường</Tag>
              <Progress percent={95} size="small" style={{ marginTop: '8px' }} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <ToolOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
              <div>Bảo trì định kỳ</div>
              <Tag color="processing">Đang thực hiện</Tag>
              <Progress percent={78} size="small" style={{ marginTop: '8px' }} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <SafetyOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }} />
              <div>Xử lý sự cố</div>
              <Tag color="warning">Cần cải thiện</Tag>
              <Progress percent={65} size="small" style={{ marginTop: '8px' }} />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MonitoringSection;
