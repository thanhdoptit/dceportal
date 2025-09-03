import { Alert, Card, Col, Divider, Row, Steps, Table, Tag, Typography } from 'antd';
import React from 'react';
import ImageGallery from '../../shared/components/ImageGallery';
import '../../shared/styles/SystemSection.css';
const { Title, Paragraph, Text } = Typography;

const GalaxyVLSection = () => {
  const [currentInstallStep, setCurrentInstallStep] = React.useState(0);
  const [currentOperationStep, setCurrentOperationStep] = React.useState(0);
  const [currentMaintenanceStep, setCurrentMaintenanceStep] = React.useState(0);

  // Thông số kỹ thuật Galaxy VL chi tiết từ technical specifications
  const technicalSpecs = [
    {
      key: '1',
      model: 'Galaxy VL 200kW',
      partNumber: 'GVL200K500DS',
      input: '380/400/415/440/480V ±10%, 50/60Hz',
      output: '380/400/415/440/480V ±1%, 50/60Hz',
      power: '200kVA / 200kW',
      efficiency: 'Normal: 96.6-97.1%, ECO: 99.0-99.4%',
      battery: '480-576V DC, VRLA/Li-Ion'
    },
    {
      key: '2',
      model: 'Galaxy VL 300kW',
      partNumber: 'GVL300K500DS', 
      input: '380/400/415/440/480V ±10%, 50/60Hz',
      output: '380/400/415/440/480V ±1%, 50/60Hz',
      power: '300kVA / 300kW',
      efficiency: 'Normal: 96.6-97.1%, ECO: 99.0-99.4%',
      battery: '480-576V DC, VRLA/Li-Ion'
    },
    {
      key: '3',
      model: 'Galaxy VL 400kW',
      partNumber: 'GVL400K500DS',
      input: '380/400/415/440/480V ±10%, 50/60Hz',
      output: '380/400/415/440/480V ±1%, 50/60Hz',
      power: '400kVA / 400kW',
      efficiency: 'Normal: 96.5-97.2%, ECO: 99.3-99.4%',
      battery: '480-576V DC, VRLA/Li-Ion'
    },
    {
      key: '4',
      model: 'Galaxy VL 500kW',
      partNumber: 'GVL500KDS',
      input: '380/400/415/440/480V ±10%, 50/60Hz',
      output: '380/400/415/440/480V ±1%, 50/60Hz',
      power: '500kVA / 500kW',
      efficiency: 'Normal: 96.4-97.1%, ECO: 99.0-99.4%',
      battery: '480-576V DC, VRLA/Li-Ion'
    }
  ];

  // Efficiency data at different load levels (500kW model)
  const efficiencyData = [
    {
      key: '1',
      load: '25%',
      normal: '96.6%',
      eco: '99.0%',
      eConversion: '98.4%',
      battery: '96.3%'
    },
    {
      key: '2', 
      load: '50%',
      normal: '97.1%',
      eco: '99.3%',
      eConversion: '99.0%',
      battery: '96.7%'
    },
    {
      key: '3',
      load: '75%',
      normal: '97.0%',
      eco: '99.4%',
      eConversion: '99.2%',
      battery: '96.6%'
    },
    {
      key: '4',
      load: '100%',
      normal: '96.8%',
      eco: '99.4%',
      eConversion: '99.3%',
      battery: '96.4%'
    }
  ];

  // Input voltage window specifications
  const inputVoltageSpecs = [
    {
      key: '1',
      nominal: '380V',
      min: '304V (-20%)',
      max: '456V (+20%)',
      frequency: '50/60Hz ±5%'
    },
    {
      key: '2',
      nominal: '400V',
      min: '320V (-20%)',
      max: '480V (+20%)',
      frequency: '50/60Hz ±5%'
    },
    {
      key: '3',
      nominal: '415V', 
      min: '332V (-20%)',
      max: '498V (+20%)',
      frequency: '50/60Hz ±5%'
    },
    {
      key: '4',
      nominal: '440V',
      min: '352V (-20%)',
      max: '528V (+20%)',
      frequency: '50/60Hz ±5%'
    },
    {
      key: '5',
      nominal: '480V',
      min: '384V (-20%)',
      max: '576V (+20%)',
      frequency: '50/60Hz ±5%'
    }
  ];

  return (
    <div className="content-section">
      <Title level={2} id="section-2">
        2. HỆ THỐNG UPS GALAXY VL
      </Title>
      
      <Paragraph>
        Hệ thống UPS Galaxy VL là giải pháp UPS 3 pha công suất cao của Schneider Electric, 
        được thiết kế đặc biệt cho các ứng dụng trung tâm dữ liệu yêu cầu độ tin cậy cao.
      </Paragraph>

      {/* 2.1 - Thông tin chung Galaxy VL */}
      <div id="2.1" className="subsection">
        <Title level={3}>
          2.1. Thông tin chung Galaxy VL
        </Title>
        
        {/* 2.1.1 - Đặc điểm kỹ thuật */}
        <div id="2.1.1" className="subsection">
          <Title level={4}>
            2.1.1. Đặc điểm kỹ thuật
          </Title>
          <Card size="small" style={{ marginBottom: '16px' }}>
            <ul>
              <li><Text strong>Công nghệ:</Text> Double-conversion online</li>
              <li><Text strong>Topology:</Text> IGBT-based inverter</li>
              <li><Text strong>PFC:</Text> Unity power factor correction</li>
              <li><Text strong>Hiệu suất:</Text> Lên đến 97.2% ở chế độ Double-conversion</li>
              <li><Text strong>THD:</Text> {'<'}3% (linear load), {'<'}8% (non-linear load)</li>
              <li><Text strong>Overload:</Text> 125% trong 10 phút, 150% trong 1 phút</li>
            </ul>
          </Card>
        </div>

        {/* 2.1.2 - Thông số điện */}
        <div id="2.1.2" className="subsection">
          <Title level={4}>
            2.1.2. Thông số điện
          </Title>
          <Table
            dataSource={technicalSpecs}
            rowKey="key"
            size="small"
            scroll={{ x: 'max-content' }}
            style={{ marginBottom: '16px' }}
          >
            <Table.Column title="Model" dataIndex="model" key="model" 
              render={(text, record) => (
                <div>
                  <Text strong>{text}</Text><br/>
                  <Text type="secondary" style={{ fontSize: '11px' }}>{record.partNumber}</Text>
                </div>
              )}
            />
            <Table.Column title="Input Voltage" dataIndex="input" key="input" />
            <Table.Column title="Output Voltage" dataIndex="output" key="output" />
            <Table.Column title="Power Rating" dataIndex="power" key="power" />
            <Table.Column title="Efficiency" dataIndex="efficiency" key="efficiency" />
            <Table.Column title="Battery DC Voltage" dataIndex="battery" key="battery" />
          </Table>
          
          {/* Thêm bảng Input Voltage Window */}
          <Title level={5}>Input Voltage Window Specifications</Title>
          <Table
            dataSource={inputVoltageSpecs}
            rowKey="key"
            size="small"
            scroll={{ x: 'max-content' }}
            style={{ marginBottom: '16px' }}
          >
            <Table.Column title="Nominal Voltage" dataIndex="nominal" key="nominal" />
            <Table.Column title="Minimum (-20%)" dataIndex="min" key="min" />
            <Table.Column title="Maximum (+20%)" dataIndex="max" key="max" />
            <Table.Column title="Frequency Range" dataIndex="frequency" key="frequency" />
          </Table>
        </div>

        {/* 2.1.3 - Cấu hình hệ thống và hiệu suất */}
        <div id="2.1.3" className="subsection">
          <Title level={4}>
            2.1.3. Cấu hình hệ thống và hiệu suất
          </Title>
          
          {/* System Configuration */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Title level={5}>Cấu hình hệ thống</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="Cấu hình đơn lẻ (Single System)">
                  <ul>
                    <li>1 x Galaxy VL UPS (200-500kW)</li>
                    <li>External Battery Cabinet</li>
                    <li>Maintenance Bypass Cabinet</li>
                    <li>Distribution Panel</li>
                    <li>Network Management Card</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="Cấu hình song song (Parallel System)">
                  <ul>
                    <li>2-4 x Galaxy VL UPS modules</li>
                    <li>Shared Battery Bank (up to 1500kW)</li>
                    <li>Parallel Control Module</li>
                    <li>Centralized Maintenance Bypass</li>
                    <li>N+X Redundancy support</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* Efficiency Performance Table */}
          <Title level={5}>Hiệu suất hoạt động (500kW model)</Title>
          <Table
            dataSource={efficiencyData}
            rowKey="key"
            size="small"
            scroll={{ x: 'max-content' }}
            style={{ marginBottom: '16px' }}
          >
            <Table.Column title="Load Level" dataIndex="load" key="load" />
            <Table.Column title="Normal Operation" dataIndex="normal" key="normal" 
              render={(text) => <Tag color="blue">{text}</Tag>}
            />
            <Table.Column title="ECO Mode" dataIndex="eco" key="eco" 
              render={(text) => <Tag color="green">{text}</Tag>}
            />
            <Table.Column title="eConversion Mode" dataIndex="eConversion" key="eConversion" 
              render={(text) => <Tag color="purple">{text}</Tag>}
            />
            <Table.Column title="Battery Operation" dataIndex="battery" key="battery" 
              render={(text) => <Tag color="orange">{text}</Tag>}
            />
          </Table>

          {/* IMAGE IMPORT NOTES */}
          
          === IMAGES NEEDED FOR SECTION 2.1.3 ===
          1. Galaxy VL single system diagram
          2. Galaxy VL parallel system topology 
          3. Efficiency performance charts
          4. System configuration diagrams from Galaxy VL brochure
          
          Example usage:
          <ImageGallery
            images={[
              { src: '/ups-vancanh/ups/galaxy-vl-brochure-page01-001.png', alt: 'Galaxy VL Single System', caption: 'Cấu hình hệ thống đơn lẻ' },
              { src: '/images/ups/galaxy-vl-parallel-system.jpg', alt: 'Galaxy VL Parallel System', caption: 'Cấu hình hệ thống song song' }
            ]}
            columns={2}
            imageWidth={300}
            imageHeight={200}
          />
         
        </div>
      </div>

      {/* 2.2 - Hướng dẫn lắp đặt */}
      <div id="2.2" className="subsection">
        <Title level={3}>
          2.2. Hướng dẫn lắp đặt
        </Title>
        
        {/* 2.2.1 - Yêu cầu môi trường */}
        <div id="2.2.1" className="subsection">
          <Title level={4}>
            2.2.1. Yêu cầu môi trường
          </Title>
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <Text strong>Nhiệt độ hoạt động:</Text>
                  <ul>
                    <li>Bình thường: 0°C đến +40°C</li>
                    <li>Giảm công suất: +40°C đến +50°C</li>
                    <li>Lưu trữ: -25°C đến +70°C</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text strong>Độ ẩm và môi trường:</Text>
                  <ul>
                    <li>Độ ẩm tương đối: 0-95% (không ngưng tụ)</li>
                    <li>Độ cao: Lên đến 1000m không giảm công suất</li>
                    <li>Môi trường: Sạch, không ăn mòn</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        {/* 2.2.2 - Quy trình lắp đặt */}
        <div id="2.2.2" className="subsection">
          <Title level={4}>
            2.2.2. Quy trình lắp đặt
          </Title>
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Steps
              current={currentInstallStep}
              onChange={setCurrentInstallStep}
              direction="vertical"
              size="small"
              items={[
                { title: 'Chuẩn bị vị trí lắp đặt', description: 'Kiểm tra không gian, nền móng, thông gió' },
                { title: 'Vận chuyển và định vị', description: 'Di chuyển thiết bị đến vị trí cuối cùng' },
                { title: 'Kết nối cơ khí', description: 'Lắp đặt thanh đồng, cable tray, grounding' },
                { title: 'Kết nối điện', description: 'Đấu nối input, output, bypass, battery' },
                { title: 'Kiểm tra và commissioning', description: 'Test chức năng, calibration, documentation' }
              ]}
            />
          </Card>
        </div>

        {/* 2.2.3 - Kết nối điện và mạng */}
        <div id="2.2.3" className="subsection">
          <Title level={4}>
            2.2.3. Kết nối điện và mạng
          </Title>
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card size="small" title="Kết nối điện">
                  <ul>
                    <li>Input: 3P+N+PE cable từ MDB</li>
                    <li>Output: 3P+N+PE cable đến Distribution</li>
                    <li>Battery: DC cable đến Battery Bank</li>
                    <li>Bypass: Manual/Automatic bypass switch</li>
                    <li>Ground: Dedicated PE connection</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card size="small" title="Kết nối mạng">
                  <ul>
                    <li>RS232/485: Local communication</li>
                    <li>Ethernet: Network monitoring</li>
                    <li>SNMP: Network management</li>
                    <li>Modbus: SCADA integration</li>
                    <li>Dry contacts: Alarm relay outputs</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      {/* 2.3 - Hướng dẫn vận hành */}
      <div id="2.3" className="subsection">
        <Title level={3}>
          2.3. Hướng dẫn vận hành
        </Title>
        
        {/* 2.3.1 - Khởi động hệ thống */}
        <div id="2.3.1" className="subsection">
          <Title level={4}>
            2.3.1. Khởi động hệ thống
          </Title>
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Steps
              current={currentOperationStep}
              onChange={setCurrentOperationStep}
              direction="vertical"
              size="small"
              items={[
                { title: 'Kiểm tra trước khởi động', description: 'Voltage, connections, battery status' },
                { title: 'Khởi động rectifier', description: 'Turn ON input breaker, wait for DC bus charge' },
                { title: 'Khởi động inverter', description: 'Press START button, verify output voltage' },
                { title: 'Chuyển load', description: 'Transfer load từ bypass sang inverter' },
                { title: 'Kiểm tra hoạt động', description: 'Verify all parameters, alarms, measurements' }
              ]}
            />
          </Card>
        </div>

        {/* 2.3.2 - Chế độ vận hành */}
        <div id="2.3.2" className="subsection">
          <Title level={4}>
            2.3.2. Chế độ vận hành
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={6}>
              <Card size="small" style={{ textAlign: 'center', height: '100%' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px', color: '#52c41a' }}>🟢</div>
                <Title level={5}>Normal Mode</Title>
                <Text style={{ fontSize: '12px' }}>
                  Double conversion, load được cung cấp qua inverter
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card size="small" style={{ textAlign: 'center', height: '100%' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px', color: '#1890ff' }}>🔋</div>
                <Title level={5}>Battery Mode</Title>
                <Text style={{ fontSize: '12px' }}>
                  Vận hành bằng battery khi mất điện lưới
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card size="small" style={{ textAlign: 'center', height: '100%' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px', color: '#faad14' }}>⚡</div>
                <Title level={5}>Bypass Mode</Title>
                <Text style={{ fontSize: '12px' }}>
                  Load được cung cấp trực tiếp từ lưới
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card size="small" style={{ textAlign: 'center', height: '100%' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px', color: '#ff4d4f' }}>🔧</div>
                <Title level={5}>Maintenance</Title>
                <Text style={{ fontSize: '12px' }}>
                  Chế độ bảo trì, UPS isolated
                </Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* 2.3.3 - Giám sát thông số */}
        <div id="2.3.3" className="subsection">
          <Title level={4}>
            2.3.3. Giám sát thông số
          </Title>
          <Alert 
            message="Thông số cần theo dõi hàng ngày"
            description={
              <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                <li>Input voltage, frequency, current</li>
                <li>Output voltage, frequency, current, power</li>
                <li>Battery voltage, current, temperature</li>
                <li>DC bus voltage, inverter temperature</li>
                <li>Bypass voltage, frequency</li>
                <li>Alarms và events log</li>
              </ul>
            }
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        </div>
      </div>

      {/* 2.4 - Bảo trì và bảo dưỡng */}
      <div id="2.4" className="subsection">
        <Title level={3}>
          2.4. Bảo trì và bảo dưỡng
        </Title>
        
        {/* 2.4.1 - Bảo trì định kỳ */}
        <div id="2.4.1" className="subsection">
          <Title level={4}>
            2.4.1. Bảo trì định kỳ
          </Title>
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Steps
              current={currentMaintenanceStep}
              onChange={setCurrentMaintenanceStep}
              direction="vertical"
              size="small"
              items={[
                { title: 'Hàng tháng', description: 'Visual inspection, measurement log, battery test' },
                { title: 'Hàng quý', description: 'Detailed inspection, filter cleaning, calibration check' },
                { title: 'Hàng năm', description: 'Complete overhaul, battery replacement assessment' },
                { title: 'Theo event', description: 'Post-fault analysis, component replacement' }
              ]}
            />
          </Card>
        </div>

        {/* 2.4.2 - Thay thế ắc quy */}
        <div id="2.4.2" className="subsection">
          <Title level={4}>
            2.4.2. Thay thế ắc quy
          </Title>
          <Alert 
            message="Quy trình thay thế ắc quy an toàn"
            description={
              <div style={{ marginTop: '8px' }}>
                <Text strong>Các bước thực hiện:</Text>
                <ol style={{ marginTop: '8px', marginBottom: 0 }}>
                  <li>Chuyển UPS sang chế độ Bypass</li>
                  <li>Tắt Battery breaker, đo voltage = 0V</li>
                  <li>Tháo kết nối battery cũ</li>
                  <li>Lắp battery mới, kiểm tra polarity</li>
                  <li>Đo voltage, impedance test</li>
                  <li>Bật Battery breaker, chuyển về Normal</li>
                </ol>
              </div>
            }
            type="warning"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        </div>

        {/* 2.4.3 - Xử lý sự cố */}
        <div id="2.4.3" className="subsection">
          <Title level={4}>
            2.4.3. Xử lý sự cố
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card size="small" title="Sự cố thường gặp" style={{ height: '100%' }}>
                <ul>
                  <li>Input voltage out of range</li>
                  <li>Battery low voltage alarm</li>
                  <li>Overload condition</li>
                  <li>Over temperature</li>
                  <li>Communication loss</li>
                  <li>Fan failure</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card size="small" title="Hành động khắc phục" style={{ height: '100%' }}>
                <ul>
                  <li>Kiểm tra input supply quality</li>
                  <li>Test battery capacity, replace if needed</li>
                  <li>Reduce load, check load balance</li>
                  <li>Check ventilation, clean filters</li>
                  <li>Verify network settings, cables</li>
                  <li>Replace faulty fan, check airflow</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Divider />

      <Paragraph style={{ textAlign: 'center', color: '#666', fontSize: '12px' }}>
        Hệ thống UPS Galaxy VL - TTDL Vân Canh | Schneider Electric Solution
      </Paragraph>
    </div>
  );
};

export default GalaxyVLSection;