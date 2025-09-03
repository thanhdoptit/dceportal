import { Alert, Card, Col, Divider, Row, Steps, Table, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const BatteryBMSSection = () => {
  const [currentBatteryStep, setCurrentBatteryStep] = React.useState(0);
  const [currentBMSStep, setCurrentBMSStep] = React.useState(0);

  // Thông tin ắc quy
  const batteryTypes = [
    {
      key: '1',
      type: 'VRLA (Valve Regulated Lead Acid)',
      voltage: '12V',
      capacity: '100Ah',
      life: '5-7 năm',
      maintenance: 'Không cần bảo trì',
      advantages: ['Độ tin cậy cao', 'Giá thành hợp lý', 'Tuổi thọ tốt'],
      disadvantages: ['Khối lượng lớn', 'Không thể sạc nhanh']
    },
    {
      key: '2',
      type: 'LiFePO4 (Lithium Iron Phosphate)',
      voltage: '3.2V',
      capacity: '100Ah',
      life: '10-15 năm',
      maintenance: 'Không cần bảo trì',
      advantages: ['Tuổi thọ dài', 'Khối lượng nhẹ', 'Sạc nhanh'],
      disadvantages: ['Giá thành cao', 'Yêu cầu BMS phức tạp']
    }
  ];

  // Quy trình tính toán dung lượng ắc quy
  const batteryCalculationSteps = [
    {
      title: 'Xác định tải',
      description: 'Tính toán tổng công suất và thời gian backup cần thiết'
    },
    {
      title: 'Tính toán năng lượng',
      description: 'Công suất (W) × Thời gian backup (giờ) = Năng lượng (Wh)'
    },
    {
      title: 'Chọn loại ắc quy',
      description: 'Dựa trên điện áp, dung lượng và tuổi thọ yêu cầu'
    },
    {
      title: 'Tính số lượng',
      description: 'Năng lượng cần / (Điện áp × Dung lượng × Hiệu suất)'
    },
    {
      title: 'Kiểm tra khả năng',
      description: 'Đảm bảo đáp ứng yêu cầu về công suất và thời gian'
    }
  ];

  // Các thông số BMS giám sát
  const bmsMonitoringParams = [
    {
      key: '1',
      parameter: 'Điện áp cell',
      normal: '3.0-3.6V (LiFePO4)',
      warning: '2.8-3.0V hoặc 3.6-3.8V',
      critical: '< 2.8V hoặc > 3.8V',
      unit: 'V'
    },
    {
      key: '2',
      parameter: 'Dòng điện sạc/xả',
      normal: '0.1C - 1C',
      warning: '1C - 2C',
      critical: '> 2C',
      unit: 'A'
    },
    {
      key: '3',
      parameter: 'Nhiệt độ cell',
      normal: '0-45°C',
      warning: '45-55°C',
      critical: '> 55°C',
      unit: '°C'
    },
    {
      key: '4',
      parameter: 'Trạng thái sạc (SOC)',
      normal: '20-90%',
      warning: '10-20% hoặc 90-100%',
      critical: '< 10% hoặc > 100%',
      unit: '%'
    },
    {
      key: '5',
      parameter: 'Sức khỏe ắc quy (SOH)',
      normal: '80-100%',
      warning: '60-80%',
      critical: '< 60%',
      unit: '%'
    }
  ];

  // Cảnh báo và báo cáo BMS
  const bmsAlerts = [
    {
      level: 'Thông tin',
      type: 'info',
      description: 'Thông báo trạng thái bình thường',
      examples: ['Ắc quy đã sạc đầy', 'Kết nối BMS ổn định']
    },
    {
      level: 'Cảnh báo',
      type: 'warning',
      description: 'Cảnh báo khi thông số vượt ngưỡng',
      examples: ['Điện áp cell thấp', 'Nhiệt độ cao']
    },
    {
      level: 'Nguy hiểm',
      type: 'error',
      description: 'Cảnh báo khi có nguy cơ hư hỏng',
      examples: ['Điện áp quá thấp', 'Nhiệt độ quá cao']
    },
    {
      level: 'Khẩn cấp',
      type: 'critical',
      description: 'Cảnh báo khẩn cấp cần xử lý ngay',
      examples: ['Ngắn mạch', 'Quá nhiệt nghiêm trọng']
    }
  ];

  const columns = [
    {
      title: 'Thông số',
      dataIndex: 'parameter',
      key: 'parameter',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Bình thường',
      dataIndex: 'normal',
      key: 'normal',
      render: (text) => <Tag color="green">{text}</Tag>
    },
    {
      title: 'Cảnh báo',
      dataIndex: 'warning',
      key: 'warning',
      render: (text) => <Tag color="orange">{text}</Tag>
    },
    {
      title: 'Nguy hiểm',
      dataIndex: 'critical',
      key: 'critical',
      render: (text) => <Tag color="red">{text}</Tag>
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      render: (text) => <Text code>{text}</Text>
    }
  ];

  return (
    <div className="content-section">
      <Title level={2} id="section-3">
        3. HỆ THỐNG ẮC QUY & BMS
      </Title>
      
      <Paragraph>
        Hệ thống ắc quy và BMS (Battery Management System) là thành phần quan trọng của hệ thống UPS, 
        đảm bảo cung cấp năng lượng dự phòng khi có sự cố nguồn điện lưới.
      </Paragraph>

      {/* 3.1 - Hệ thống ắc quy */}
      <div id="3.1" className="subsection">
        <Title level={3}>
          3.1. Hệ thống ắc quy
        </Title>
        <Card title="Thông tin tổng quan hệ thống ắc quy" style={{ marginBottom: '20px' }}>
        {/* 3.1.1 - Loại ắc quy sử dụng */}
        <div id="3.1.1" className="subsection">
          <Title level={4}>
            3.1.1. Loại ắc quy sử dụng
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card size="small" title="Đặc điểm kỹ thuật">
              <Paragraph>
                Hệ thống UPS Galaxy VL sử dụng ắc quy VRLA (Valve Regulated Lead Acid) với các đặc điểm:
              </Paragraph>
              <ul>
                <li><Text strong>Loại:</Text> VRLA Sealed Lead Acid</li>
                <li><Text strong>Điện áp:</Text> 12V per cell</li>
                <li><Text strong>Dung lượng:</Text> 100Ah - 200Ah</li>
                <li><Text strong>Tuổi thọ:</Text> 5-7 năm</li>
                <li><Text strong>Bảo trì:</Text> Không cần bảo trì</li>
              </ul>
            </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card size="small" title="So sánh loại ắc quy">
                <Table 
                  dataSource={batteryTypes} 
                  rowKey="key"
                  columns={[
                    { title: 'Loại', dataIndex: 'type', key: 'type' },
                    { title: 'Điện áp', dataIndex: 'voltage', key: 'voltage' },
                    { title: 'Dung lượng', dataIndex: 'capacity', key: 'capacity' },
                    { title: 'Tuổi thọ', dataIndex: 'life', key: 'life' }
                  ]}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* 3.1.2 - Tính toán dung lượng */}
        <div id="3.1.2" className="subsection">
          <Title level={4}>
            3.1.2. Tính toán dung lượng
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card size="small" title="Quy trình tính toán">
              <Steps
                current={currentBatteryStep}
                onChange={setCurrentBatteryStep}
                direction="vertical"
                size="small"
                items={batteryCalculationSteps.map((step) => ({
                  title: step.title,
                  description: step.description
                }))}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="Ví dụ tính toán">
              <Paragraph>
                <Text strong>Yêu cầu:</Text> Tải 100kW, backup 30 phút
              </Paragraph>
              <ul>
                <li>Năng lượng cần: 100kW × 0.5h = 50kWh</li>
                <li>Với ắc quy 12V, 100Ah:</li>
                <li>Số lượng: 50,000Wh ÷ (12V × 100Ah × 0.8) = 52 ắc quy</li>
                <li>Kết luận: Cần 52 ắc quy 12V, 100Ah</li>
              </ul>
            </Card>
            </Col>
          </Row>
        </div>

        {/* 3.1.3 - Tuổi thọ và thay thế */}
        <div id="3.1.3" className="subsection">
          <Title level={4}>
            3.1.3. Tuổi thọ và thay thế
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card size="small" title="Yếu tố ảnh hưởng tuổi thọ">
              <ul>
                <li><Text strong>Nhiệt độ:</Text> Nhiệt độ cao làm giảm tuổi thọ</li>
                <li><Text strong>Độ sâu xả:</Text> Xả sâu làm giảm tuổi thọ</li>
                <li><Text strong>Chu kỳ sạc/xả:</Text> Số lần sạc/xả ảnh hưởng trực tiếp</li>
                <li><Text strong>Chất lượng sạc:</Text> Sạc không đúng làm hỏng ắc quy</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card size="small" title="Dấu hiệu cần thay thế">
              <ul>
                <li>Thời gian backup giảm đáng kể</li>
                <li>Điện áp ắc quy không ổn định</li>
                <li>Nhiệt độ ắc quy tăng bất thường</li>
                <li>Tuổi thọ đã đạt 80% thiết kế</li>
                <li>Cảnh báo BMS về sức khỏe ắc quy</li>
              </ul>
            </Card>
            </Col>
          </Row>
        </div>
      </Card>
      </div>

      {/* 3.2 - Hệ thống giám sát BMS */}
      <div id="3.2" className="subsection">
        <Title level={3}>
          3.2. Hệ thống giám sát BMS
        </Title>
        <Card title="Thông tin tổng quan BMS" style={{ marginBottom: '20px' }}>
        {/* 3.2.1 - Cấu trúc BMS272 */}
        <div id="3.2.1" className="subsection">
          <Title level={4}>
            3.2.1. Cấu trúc BMS272
          </Title>
          
          {/* BMS272 Main Unit */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Title level={5}>BMS272 Data Collector - Main Unit</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card size="small" title="Hardware Specifications">
                  <ul>
                    <li><Text strong>CPU:</Text> Quad Core 1.2GHz Broadcom BCM2837 64bit</li>
                    <li><Text strong>OS:</Text> Windows IoT</li>
                    <li><Text strong>Display:</Text> 7" 1024x600 Graphic Touch Screen</li>
                    <li><Text strong>Communications:</Text> WiFi, 3G, Ethernet, RS485</li>
                    <li><Text strong>Capacity:</Text> Up to 4x256 kits of BMK/SMK</li>
                    <li><Text strong>Max Cells:</Text> Up to 1020 cells monitoring</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card size="small" title="Supported Battery Types">
                  <ul>
                    <li><Text strong>VRLA:</Text> Valve Regulated Lead Acid</li>
                    <li><Text strong>Ni-Cd:</Text> Nickel-Cadmium batteries</li>
                    <li><Text strong>Lithium:</Text> Li-Ion battery systems</li>
                    <li><Text strong>Salt Water:</Text> Alternative chemistry</li>
                    <li><Text strong>Installation:</Text> Non-intrusive, online compatible</li>
                    <li><Text strong>Data Storage:</Text> Web server with internet connectivity</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* String Measure Kit (SMK) */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Title level={5}>String Measure Kit (SMK)</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Card size="small" title="Voltage Monitoring">
                  <ul>
                    <li>Battery String voltage measurement</li>
                    <li>Real-time voltage tracking</li>
                    <li>String-level voltage analysis</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card size="small" title="Current Monitoring">
                  <ul>
                    <li>String current from Hall CT Kit</li>
                    <li>Charge/discharge monitoring</li>
                    <li>Non-intrusive current sensing</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card size="small" title="Environmental">
                  <ul>
                    <li>Environment Temperature monitoring</li>
                    <li>Wireless transmission</li>
                    <li>Data to collector communication</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* Battery Measure Kit (BMK) */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Title level={5}>Battery Measure Kit (BMK)</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Card size="small" title="Cell Voltage">
                  <ul>
                    <li>Individual Battery Block voltage</li>
                    <li>Cell-level precision monitoring</li>
                    <li>Voltage imbalance detection</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card size="small" title="Impedance Testing">
                  <ul>
                    <li>Battery internal resistance</li>
                    <li>Connection resistance monitoring</li>
                    <li>Health status assessment</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card size="small" title="Temperature">
                  <ul>
                    <li>Battery block temperature</li>
                    <li>Thermal monitoring per cell</li>
                    <li>Overheating protection alerts</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* IMAGE IMPORT NOTES */}
          {/* 
          === IMAGES NEEDED FOR SECTION 3.2.1 ===
          1. BMS272 main unit - 7" touch screen interface
          2. String Measure Kit (SMK) hardware components
          3. Battery Measure Kit (BMK) installation 
          4. Hall CT Kit for current measurement
          5. System topology showing wireless communication
          
          Example ImageGallery:
          <ImageGallery
            images={[
              { src: '/images/bms/bms272-main-unit.jpg', alt: 'BMS272 Main Unit', caption: 'BMS272 với màn hình cảm ứng 7"' },
              { src: '/images/bms/smk-kit.jpg', alt: 'String Measure Kit', caption: 'String Measure Kit (SMK)' },
              { src: '/images/bms/bmk-kit.jpg', alt: 'Battery Measure Kit', caption: 'Battery Measure Kit (BMK)' }
            ]}
          />
          */}
        </div>

        {/* 3.2.2 - Các thông số giám sát BMS272 */}
        <div id="3.2.2" className="subsection">
          <Title level={4}>
            3.2.2. Các thông số giám sát BMS272
          </Title>
          
          {/* BMS272 Monitoring Capabilities */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Title level={5}>Khả năng giám sát và đo lường</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card size="small" title="Thông số điện">
                  <ul>
                    <li><Text strong>String Voltages:</Text> Điện áp string real-time</li>
                    <li><Text strong>String Currents:</Text> Dòng điện string</li>
                    <li><Text strong>Cell Voltages:</Text> Điện áp từng cell</li>
                    <li><Text strong>Internal Voltages:</Text> Điện áp nội bộ</li>
                    <li><Text strong>Internal Resistance:</Text> Trở kháng nội</li>
                    <li><Text strong>Connection Resistance:</Text> Trở kháng kết nối</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card size="small" title="Thông số môi trường">
                  <ul>
                    <li><Text strong>Temperature:</Text> Nhiệt độ từng cell và môi trường</li>
                    <li><Text strong>Liquid Level:</Text> Mức chất điện phân (nếu có)</li>
                    <li><Text strong>Battery Health:</Text> Đánh giá sức khỏe ắc quy</li>
                    <li><Text strong>Life Expectancy:</Text> Dự báo tuổi thọ</li>
                    <li><Text strong>Charge/Discharge Status:</Text> Trạng thái sạc/xả</li>
                    <li><Text strong>Trend Analysis:</Text> Phân tích xu hướng</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* BMS272 Software Features */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Title level={5}>Tính năng phần mềm BMS272</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={8}>
                <Card size="small" title="Hiển thị và báo cáo">
                  <ul>
                    <li>Biểu đồ màu dễ đọc</li>
                    <li>Trending analysis colored graphs</li>
                    <li>Daily Excel reporting via email</li>
                    <li>Detailed log alarm outbreak history</li>
                    <li>Web browser data access</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card size="small" title="Cảnh báo và thông báo">
                  <ul>
                    <li>Email alerts during alarm conditions</li>
                    <li>SMS alerts for operators</li>
                    <li>Priority access level management</li>
                    <li>Automatic event recording</li>
                    <li>Discharge/recharge playback</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card size="small" title="Tích hợp và giao tiếp">
                  <ul>
                    <li>Modbus protocol integration</li>
                    <li>DCS/SCADA communication</li>
                    <li>Internet connection data saving</li>
                    <li>Mobile device access</li>
                    <li>HMI interface support</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* Monitoring Parameters Table */}
          <Table 
            dataSource={bmsMonitoringParams} 
            rowKey="key"
            columns={columns}
            pagination={false}
            size="small"
            style={{ marginBottom: '16px' }}
          />

          {/* IMAGE IMPORT NOTES */}
          {/* 
          === IMAGES NEEDED FOR SECTION 3.2.2 ===
          1. BMS272 monitoring interface screenshots
          2. Trending analysis colored graphs
          3. Email/SMS alert examples  
          4. Web browser data access interface
          5. Excel reporting samples
          
          Example ImageGallery:
          <ImageGallery
            images={[
              { src: '/images/bms/bms272-monitoring-interface.jpg', alt: 'BMS272 Monitoring Interface', caption: 'Giao diện giám sát BMS272' },
              { src: '/images/bms/trending-analysis-graphs.jpg', alt: 'Trending Analysis', caption: 'Biểu đồ phân tích xu hướng' }
            ]}
          />
          */}
        </div>

        {/* 3.2.3 - Cảnh báo và báo cáo */}
        <div id="3.2.3" className="subsection">
          <Title level={4}>
            3.2.3. Cảnh báo và báo cáo
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card size="small" title="Hệ thống cảnh báo">
              {bmsAlerts.map((alert, index) => (
                <Alert
                  key={index}
                  message={alert.level}
                  description={alert.description}
                  type={alert.type === 'critical' ? 'error' : alert.type}
                  showIcon
                  style={{ marginBottom: '8px' }}
                />
              ))}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="Báo cáo định kỳ">
              <ul>
                <li><Text strong>Báo cáo hàng ngày:</Text> Thống kê hoạt động</li>
                <li><Text strong>Báo cáo hàng tuần:</Text> Phân tích hiệu suất</li>
                <li><Text strong>Báo cáo hàng tháng:</Text> Đánh giá sức khỏe ắc quy</li>
                <li><Text strong>Báo cáo hàng năm:</Text> Kế hoạch thay thế</li>
              </ul>
            </Card>
            </Col>
          </Row>
        </div>
        <Card title="Quy trình vận hành BMS" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card size="small" title="Quy trình khởi động">
              <Steps
                current={currentBMSStep}
                onChange={setCurrentBMSStep}
                direction="vertical"
                size="small"
                items={[
                  { title: 'Kiểm tra kết nối', description: 'Kiểm tra tất cả cảm biến' },
                  { title: 'Khởi động BMS', description: 'Khởi động hệ thống giám sát' },
                  { title: 'Kiểm tra giao tiếp', description: 'Kiểm tra kết nối với UPS' },
                  { title: 'Bắt đầu giám sát', description: 'Bắt đầu thu thập dữ liệu' }
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="Giám sát liên tục">
              <Paragraph>
                BMS hoạt động 24/7 để giám sát:
              </Paragraph>
              <ul>
                <li>Điện áp từng cell ắc quy</li>
                <li>Dòng điện sạc/xả</li>
                <li>Nhiệt độ môi trường</li>
                <li>Trạng thái kết nối</li>
                <li>Tuổi thọ còn lại</li>
              </ul>
            </Card>
            </Col>
          </Row>
        </Card>
      </Card>
      </div>

      <Divider />

      <Paragraph className="section-footer">
        Hệ thống ắc quy & BMS - TTDL Vân Canh | Đảm bảo độ tin cậy và tuổi thọ tối ưu
      </Paragraph>
    </div>
  );
};

export default BatteryBMSSection;
