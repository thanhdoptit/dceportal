import {
  EnvironmentOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { Alert, Card, Col, Row, Table, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const PumpSystemSection = () => {
  // Thông tin hệ thống bơm nước lạnh
  const pumpSystem = [
    {
      pump: 'PCH-01',
      type: 'Bơm tuần hoàn nước lạnh',
      capacity: '3D 40-200',
      control: 'VFD với cảm biến chênh áp PDT 4-20mA',
      function: 'Tuần hoàn nước lạnh từ Chiller đến CRAC và TES',
      redundancy: '2N+N (2 hoạt động + 1 dự phòng)'
    },
    {
      pump: 'PCH-02',
      type: 'Bơm tuần hoàn nước lạnh',
      capacity: '3D 40-200',
      control: 'VFD với cảm biến chênh áp PDT 4-20mA',
      function: 'Tuần hoàn nước lạnh từ Chiller đến CRAC và TES',
      redundancy: '2N+N (2 hoạt động + 1 dự phòng)'
    },
    {
      pump: 'PCH-03',
      type: 'Bơm tuần hoàn nước lạnh',
      capacity: '3D 40-200',
      control: 'VFD với cảm biến chênh áp PDT 4-20mA',
      function: 'Tuần hoàn nước lạnh từ Chiller đến CRAC và TES',
      redundancy: '2N+N (2 hoạt động + 1 dự phòng)'
    }
  ];

  // Bảng dữ liệu Testing & Commissioning
  const tcData = [
    {
      scenario: '1 bơm chạy - Line A',
      pump: 'PCH-01',
      frequency: '20-50 Hz',
      flow: '11.5-25.1 l/s',
      pressure: '0.3-2.4 bar',
      notes: 'Tần số tối ưu: 40Hz (25.1 l/s, 1.0 bar)'
    },
    {
      scenario: '2 bơm chạy - Line A',
      pump: 'PCH-01 + PCH-02',
      frequency: '30-50 Hz',
      flow: '14.7-22.1 l/s',
      pressure: '1.6-3.2 bar',
      notes: 'Tần số tối ưu: 45Hz (19.6 l/s, 2.5 bar)'
    },
    {
      scenario: '3 bơm chạy - Line A',
      pump: 'PCH-01 + PCH-02 + PCH-03',
      frequency: '30-45 Hz',
      flow: '8-22.1 l/s',
      pressure: '1.2-2.1 bar',
      notes: 'Tần số tối ưu: 45Hz (22.1 l/s, 2.1 bar)'
    }
  ];





  return (
    <div className="content-section">
      <div id="section-3" className="content-section">
        <Title level={2}>
          <ThunderboltOutlined style={{ marginRight: '12px' }} />
          3.Hệ thống bơm & thiết bị phụ trợ
        </Title>
      </div>

      <Alert
        message="Hệ thống bơm thông minh"
        description="TTDL Vân Canh sử dụng hệ thống bơm nước lạnh với điều khiển VFD thông minh, cơ chế dự phòng 2N+N và các thiết bị phụ trợ tiên tiến, đảm bảo cung cấp nước lạnh ổn định cho toàn bộ hệ thống."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* Hệ thống bơm nước lạnh */}
      <div id="section-3.1" className="subsection">
        <Title level={3} >
          <ThunderboltOutlined style={{ marginRight: '12px' }} />
          3.1. Hệ thống bơm nước lạnh
        </Title>
        <div id="section-3.1.1" className="subsection">
          <Title level={4}>
            <ThunderboltOutlined style={{ marginRight: '12px' }} />
            3.1.1. Bơm PCH-01, PCH-02, PCH-03
          </Title>
          <Row gutter={[16, 16]}>
            {pumpSystem.map((pump, index) => (
              <Col xs={24} lg={8} key={index}>
                <Card size="small" style={{ height: '100%' }}>
                  <Title level={4}>
                    {pump.pump}
                  </Title>
                  <Paragraph style={{ marginBottom: '8px' }}>
                    <Text strong>Loại:</Text> {pump.type}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: '8px' }}>
                    <Text strong>Công suất:</Text> {pump.capacity}
                  </Paragraph>
                  <Paragraph style={{ marginRight: '8px' }}>
                    <Text strong>Điều khiển:</Text> {pump.control}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: '8px' }}>
                    <Text strong>Chức năng:</Text> {pump.function}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: '0' }}>
                    <Text strong>Dự phòng:</Text> {pump.redundancy}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      
      <div id="section-3.1.2" className="subsection">
        <Title level={4}>
          <SettingOutlined style={{ marginRight: '12px' }} />
          3.1.2. Điều khiển VFD và chênh áp
        </Title>
        
        <Card style={{ marginBottom: '16px' }}>
          <Title level={5}>
            <ThunderboltOutlined style={{ marginRight: '8px' }} />
            Nguyên lý điều khiển VFD
          </Title>
          <Paragraph>
            <Text strong>Mục đích:</Text> Điều chỉnh tần số bơm nước lạnh tăng giảm theo tải lạnh của DC, dựa trên điều chỉnh chênh lệch áp suất giữa đường nước cấp – hồi đáp ứng giá trị cài đặt.
          </Paragraph>
          <Paragraph>
            <Text strong>Phạm vi điều chỉnh:</Text> Tần số bơm nước lạnh điều chỉnh trong dải sao cho vẫn đảm bảo lưu lượng tối thiểu đi qua Chiller và đảm bảo được lưu lượng nước tối thiểu đi qua từng máy làm lạnh nước khi đang vận hành.
          </Paragraph>
        </Card>

        <Card style={{ marginBottom: '16px' }}>
          <Title level={5}>
            <SettingOutlined style={{ marginRight: '8px' }} />
            Hệ thống van Bypass
          </Title>
          <Paragraph>
            <Text strong>Nguyên lý:</Text> Mỗi cụm van Bypass được vận hành dựa theo chênh lệch áp suất đo được giữa đường ống nước lạnh cấp và đường ống nước lạnh hồi, với tham số cài đặt trước.
          </Paragraph>
          <Paragraph>
            <Text strong>Yêu cầu:</Text> Tham số cài đặt phải đảm bảo duy trì chênh lệch áp suất giữa đường ống tối thiểu vận hành của hệ thống. Sẽ thực hiện trong quá trình T&C để tìm ra tham số phù hợp.
          </Paragraph>
        </Card>

        <Card style={{ marginBottom: '16px' }}>
          <Title level={5}>
            <InfoCircleOutlined style={{ marginRight: '8px' }} />
            Thiết bị đo chênh áp
          </Title>
          <Paragraph>
            <Text strong>Vị trí:</Text> Được lắp đặt tại bơm chiller để kiểm tra chênh lệch áp suất giữa đầu hút và đầu đẩy của bơm.
          </Paragraph>
          <Paragraph>
            <Text strong>Chức năng:</Text> Lấy tín hiệu về BMS để theo dõi và điều khiển tự động hệ thống bơm.
          </Paragraph>
          <Paragraph>
            <Text strong>Lưu ý:</Text> Cần kiểm định lại hằng năm để đảm bảo độ chính xác.
          </Paragraph>
          </Card>
        </div>

      {/* Bảng dữ liệu Testing & Commissioning */}
      <div id="section-3.1.3" className="subsection">
        <Title level={4}>
          <SettingOutlined style={{ marginRight: '12px' }} />
          3.1.3. Quy trình Testing & Commissioning
        </Title>
   
      <Card style={{ marginBottom: '16px' }}>
      <Title level={5} style={{ color: '#1890ff', marginBottom: '12px' }}>
            <ThunderboltOutlined style={{ marginRight: '8px' }} />
            Quy trình Testing & Commissioning
          </Title>
        <Table
          dataSource={tcData}
          rowKey={(record) => `tc-${record.scenario || record.pump || Math.random().toString(36).substr(2, 9)}`}
          columns={[
            {
              title: 'Kịch bản',
              dataIndex: 'scenario',
              key: 'scenario',
              width: 200,
              render: (text) => <Tag color="blue">{text}</Tag>
            },
            {
              title: 'Bơm hoạt động',
              dataIndex: 'pump',
              key: 'pump',
              width: 150
            },
            {
              title: 'Tần số (Hz)',
              dataIndex: 'frequency',
              key: 'frequency',
              width: 120
            },
            {
              title: 'Lưu lượng (l/s)',
              dataIndex: 'flow',
              key: 'flow',
              width: 150
            },
            {
              title: 'Áp suất (bar)',
              dataIndex: 'pressure',
              key: 'pressure',
              width: 120
            },
            {
              title: 'Ghi chú',
              dataIndex: 'notes',
              key: 'notes'
            }
          ]}
          pagination={false}
          size="small"
          scroll={{ x: 800 }}
        />
      </Card>
      </div>      
      <div id="section-3.1.4" className="subsection">
        <Title level={4}>
          <InfoCircleOutlined style={{ marginRight: '12px' }} />
          3.1.4. Bảng dữ liệu vận hành
        </Title>
        
        <Card style={{ marginBottom: '16px' }}>
          <Title level={5} style={{ color: '#1890ff', marginBottom: '12px' }}>
            <ThunderboltOutlined style={{ marginRight: '8px' }} />
            Thông số vận hành bơm
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card size="small" title="Thông số điện">
                <Paragraph><Text strong>Điện áp:</Text> 400V/3ph/50Hz</Paragraph>
                <Paragraph><Text strong>Công suất:</Text> Theo thiết kế từng bơm</Paragraph>
                <Paragraph><Text strong>Điều khiển:</Text> VFD với tín hiệu 4-20mA</Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card size="small" title="Thông số thủy lực">
                <Paragraph><Text strong>Lưu lượng:</Text> Điều chỉnh theo tải (l/s)</Paragraph>
                <Paragraph><Text strong>Áp suất:</Text> Chênh áp đầu hút-đẩy (kPa)</Paragraph>
                <Paragraph><Text strong>Nhiệt độ:</Text> 10-16°C (nước lạnh)</Paragraph>
              </Card>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginBottom: '16px' }}>
          <Title level={5} style={{ color: '#1890ff', marginBottom: '12px' }}>
            <SettingOutlined style={{ marginRight: '8px' }} />
            Dữ liệu hiệu suất thiết bị
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card size="small" title="LDCV3400A (79.8KW)">
                <Paragraph><Text strong>Lưu lượng nước:</Text> 3.61 l/s</Paragraph>
                <Paragraph><Text strong>Áp suất coil:</Text> 13.4 kPa</Paragraph>
                <Paragraph><Text strong>EER:</Text> 28.7 kW/kW</Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card size="small" title="LDCV1800A (64.4KW)">
                <Paragraph><Text strong>Lưu lượng nước:</Text> Theo thiết kế</Paragraph>
                <Paragraph><Text strong>Áp suất coil:</Text> Theo thiết kế</Paragraph>
                <Paragraph><Text strong>EER:</Text> Theo thiết kế</Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card size="small" title="LDCV0600A (16.8KW)">
                <Paragraph><Text strong>Lưu lượng nước:</Text> Theo thiết kế</Paragraph>
                <Paragraph><Text strong>Áp suất coil:</Text> Theo thiết kế</Paragraph>
                <Paragraph><Text strong>EER:</Text> Theo thiết kế</Paragraph>
              </Card>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginBottom: '16px' }}>
          <Title level={5} style={{ color: '#1890ff', marginBottom: '12px' }}>
            <InfoCircleOutlined style={{ marginRight: '8px' }} />
            Quy trình vận hành luân phiên
          </Title>
          <Paragraph>
            <Text strong>Nguyên tắc:</Text> Hệ thống BMS liên tục theo dõi trạng thái hoạt động của các thành phần trong hệ thống, từ đó tính toán vận hành luân phiên các cụm Chiller theo giờ, đảm bảo thời gian vận hành của các cụm là tương đương nhau.
          </Paragraph>
          <Paragraph>
            <Text strong>Thời gian luân phiên:</Text> Giá trị cài đặt mặc định là 8h, có thể điều chỉnh theo yêu cầu vận hành thực tế.
          </Paragraph>
          <Paragraph>
            <Text strong>Lưu ý:</Text> Đảm bảo ít nhất phải có một máy chiller hoạt động nếu trong điều kiện hoạt động bình thường khi tải giảm.
          </Paragraph>
                </Card>
      </div>
      </div>
      
      {/* 3.2 Thiết bị phụ trợ hệ nước */}
      <div id="section-3.2" className="subsection">
        <Title level={3} >
          <ToolOutlined style={{ marginRight: '12px' }} />
          3.2. Thiết bị phụ trợ hệ nước
        </Title>
      
      {/* 3.2.1 Van cổng, van xả, van PICV */}
      <div id="section-3.2.1" className="subsection">
        <Title level={4}>
          <ToolOutlined style={{ marginRight: '12px' }} />
          3.2.1. Van cổng, van xả, van PICV
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card size="small" title="Van cổng F2B16 BRASS NRS GATE VALVE">
              <Paragraph><Text strong>Tác dụng:</Text> Đóng/mở ngăn dòng nước chảy qua đường ống</Paragraph>
              <Paragraph><Text strong>Vận hành:</Text> Vặn tay van theo chiều kim đồng hồ để khóa van, ngược lại để mở van</Paragraph>
              <Paragraph><Text strong>Lưu ý:</Text> Có thể tháo tay van tránh vô tình/cố ý khóa/mở van tại các vị trí quan trọng</Paragraph>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card size="small" title="Van xả F4B25 BRASS BALL VALVE">
              <Paragraph><Text strong>Tác dụng:</Text> Đóng/mở ngăn dòng nước chảy qua đường ống</Paragraph>
              <Paragraph><Text strong>Vận hành:</Text> Gạt tay van song song với chiều đường ống để mở, vuông góc để đóng van</Paragraph>
              <Paragraph><Text strong>Lưu ý:</Text> Có thể tháo tay van tránh vô tình/cố ý khóa/mở van</Paragraph>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card size="small" title="Van PICV 4206">
              <Paragraph><Text strong>Tác dụng:</Text> Thiết lập tự động theo lưu lượng yêu cầu của CRAC</Paragraph>
              <Paragraph><Text strong>Chức năng:</Text> Duy trì dòng chảy theo mong muốn không phụ thuộc vào sự thay đổi áp suất</Paragraph>
              <Paragraph><Text strong>Kích thước:</Text> DN32, DN40</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* 3.2.2 Lọc Y, khớp nối mềm */}
      <div id="section-3.2.2" className="subsection">
        <Title level={4} >
          <ToolOutlined style={{ marginRight: '12px' }} />
          3.2.2. Lọc Y, khớp nối mềm
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" title="Lọc Y F7B16 BRASS Y-TYPE STRAINER">
              <Paragraph><Text strong>Tác dụng:</Text> Lọc rác và cặn bã trên hệ thống đường ống, bảo vệ thiết bị hoạt động ổn định</Paragraph>
              <Paragraph><Text strong>Bảo trì:</Text> 2 năm 01 lần để loại bỏ cặn bã trong Y lọc</Paragraph>
              <Paragraph><Text strong>Quy trình:</Text> Tắt bơm → Khóa van → Tháo nắp lọc → Vệ sinh rọ lưới → Lắp lại</Paragraph>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="Khớp nối mềm">
              <Paragraph><Text strong>F83SJ16:</Text> Dùng cho ống DN80, DN125</Paragraph>
              <Paragraph><Text strong>F85DJ16:</Text> Dùng cho ống DN32, DN40</Paragraph>
              <Paragraph><Text strong>Tác dụng:</Text> Bảo vệ đường ống không bị gãy vỡ do thay đổi nhiệt độ và áp suất</Paragraph>
              <Paragraph><Text strong>Chức năng:</Text> Kiểm soát chấn động, giảm tiếng ồn và độ rung</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* 3.2.3 Đồng hồ áp suất, nhiệt độ */}
      <div id="section-3.2.3" className="subsection">
        <Title level={4} >
          <ToolOutlined style={{ marginRight: '12px' }} />
          3.2.3. Đồng hồ áp suất, nhiệt độ
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" title="Đồng hồ áp suất FP31">
              <Paragraph><Text strong>Tác dụng:</Text> Đo áp lực của chất lỏng trên đường ống hoặc cả một hệ thống</Paragraph>
              <Paragraph><Text strong>Chức năng:</Text> Xác định áp suất hiện tại để có cách điều chỉnh áp lực hợp lý</Paragraph>
              <Paragraph><Text strong>Bảo trì:</Text> Cần kiểm định lại hằng năm</Paragraph>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="Đồng hồ nhiệt độ FT11/FT12">
              <Paragraph><Text strong>Tác dụng:</Text> Đo kiểm, theo dõi nhiệt độ đường ống nước lạnh của chiller</Paragraph>
              <Paragraph><Text strong>Chức năng:</Text> Căn chỉnh điều hòa, kiểm tra kết quả điện tử, cơ khí</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* 3.2.4 Van tách khí, van cân bằng */}
      <div id="section-3.2.4" className="subsection">
        <Title level={4} >
          <ToolOutlined style={{ marginRight: '12px' }} />
          3.2.4. Van tách khí, van cân bằng
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" title="Van tách khí KVS-870">
              <Paragraph><Text strong>Vị trí:</Text> Lắp đặt tại vị trí cao nhất và phía trên của bơm nước lạnh</Paragraph>
              <Paragraph><Text strong>Tác dụng:</Text> Tự động đẩy không khí ra ngoài khỏi hệ thống đường ống chiller</Paragraph>
              <Paragraph><Text strong>Lợi ích:</Text> Giúp lưu thông và giải nhiệt hiệu quả, chống xâm thực</Paragraph>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="Van cân bằng F4006">
              <Paragraph><Text strong>Kích thước:</Text> DN80</Paragraph>
              <Paragraph><Text strong>Tác dụng:</Text> Thiết lập tự động theo lưu lượng, nhiệt độ yêu cầu của CRAC</Paragraph>
              <Paragraph><Text strong>Chức năng:</Text> Duy trì dòng chảy theo mong muốn không phụ thuộc vào sự thay đổi áp suất</Paragraph>
              <Paragraph><Text strong>Điều khiển:</Text> Khi nhiệt độ phòng đạt set point, motor tự động đóng dần</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      </div>


      {/* Hệ thống TES */}
      <div id="section-3.3" className="subsection">
        <Title level={3} >
          <EnvironmentOutlined style={{ marginRight: '12px' }} />
          3.3. Hệ thống TES (Thermal Energy Storage)
        </Title>
      
      {/* 3.3.1 Bình dự trữ nước lạnh */}
              <div id="section-3.3.1" className="subsection">
        <Title level={4} >
          <EnvironmentOutlined style={{ marginRight: '8px' }} />
          3.3.1. Bình dự trữ nước lạnh
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" title="Thông số kỹ thuật">
              <Paragraph><Text strong>Dung tích:</Text> 02 TES chứa nước lạnh (mỗi TES 20 m³)</Paragraph>
              <Paragraph><Text strong>Chức năng:</Text> Dự trữ nước lạnh để cung cấp khẩn cấp khi có sự cố</Paragraph>
              <Paragraph><Text strong>Vị trí:</Text> Lắp đặt tại tầng hầm, kết nối trực tiếp với hệ thống chiller</Paragraph>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="Nguyên lý hoạt động">
              <Paragraph><Text strong>Chế độ nạp:</Text> Nước lạnh từ chiller được bơm vào TES để dự trữ</Paragraph>
              <Paragraph><Text strong>Chế độ xả:</Text> Khi cần thiết, nước lạnh từ TES được cung cấp cho hệ thống</Paragraph>
              <Paragraph><Text strong>Điều khiển:</Text> Tự động thông qua hệ thống BMS và các van điện</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* 3.3.2 Chế độ Charging & Discharge */}
      <div id="section-3.3.2" className="subsection">
        <Title level={4} >
          <EnvironmentOutlined style={{ marginRight: '12px' }} />
          3.3.2. Chế độ Charging & Discharge
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" title="Chế độ Charging (Nạp)">
              <Paragraph><Text strong>Điều kiện:</Text> Khi chiller hoạt động bình thường</Paragraph>
              <Paragraph><Text strong>Quy trình:</Text> Van V1A, V1B mở → Van V2A, V2B đóng → Van V3A, V3B đóng</Paragraph>
              <Paragraph><Text strong>Mục đích:</Text> Nạp nước lạnh vào TES để dự trữ</Paragraph>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="Chế độ Discharge (Xả)">
              <Paragraph><Text strong>Điều kiện:</Text> Khi có sự cố mất điện hoặc chiller bị lỗi</Paragraph>
              <Paragraph><Text strong>Quy trình:</Text> Van V1A, V1B đóng → Van V2A, V2B mở → Van V3A, V3B mở</Paragraph>
              <Paragraph><Text strong>Mục đích:</Text> Cung cấp nước lạnh từ TES cho hệ thống</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* 3.3.3 Điều khiển van V1A, V1B, V2A, V2B, V3A, V3B */}
      <div id="section-3.3.3" className="subsection">
        <Title level={4} >
          <EnvironmentOutlined style={{ marginRight: '12px' }} />
          3.3.3. Điều khiển van V1A, V1B, V2A, V2B, V3A, V3B
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card size="small" title="Van V1A, V1B">
              <Paragraph><Text strong>Vị trí:</Text> Đường ống từ chiller đến TES</Paragraph>
              <Paragraph><Text strong>Chức năng:</Text> Điều khiển dòng nước từ chiller vào TES</Paragraph>
              <Paragraph><Text strong>Trạng thái:</Text> Mở khi nạp, đóng khi xả</Paragraph>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card size="small" title="Van V2A, V2B">
              <Paragraph><Text strong>Vị trí:</Text> Đường ống từ TES đến hệ thống phân phối</Paragraph>
              <Paragraph><Text strong>Chức năng:</Text> Điều khiển dòng nước từ TES ra ngoài</Paragraph>
              <Paragraph><Text strong>Trạng thái:</Text> Đóng khi nạp, mở khi xả</Paragraph>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card size="small" title="Van V3A, V3B">
              <Paragraph><Text strong>Vị trí:</Text> Đường ống đến datacenter</Paragraph>
              <Paragraph><Text strong>Chức năng:</Text> Điều khiển dòng nước đến các thiết bị làm mát</Paragraph>
              <Paragraph><Text strong>Trạng thái:</Text> Đóng khi nạp, mở khi xả</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* 3.3.4 Thời gian dự phòng khẩn cấp */}
      <div id="section-3.3.4" className="subsection">
        <Title level={4} >
          <EnvironmentOutlined style={{ marginRight: '12px' }} />
          3.3.4. Thời gian dự phòng khẩn cấp
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card size="small" title="Thời gian dự phòng">
              <Paragraph><Text strong>Thiết kế:</Text> Đầy tải lên đến 10 phút</Paragraph>
              <Paragraph><Text strong>Dung tích:</Text> 02 TES x 20 m³ = 40 m³ nước lạnh</Paragraph>
              <Paragraph><Text strong>Ứng dụng:</Text> Cung cấp nước lạnh khẩn cấp khi có sự cố</Paragraph>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title="Kịch bản sử dụng">
              <Paragraph><Text strong>Sự cố mất điện:</Text> TES cung cấp nước lạnh trong 10 phút</Paragraph>
              <Paragraph><Text strong>Chiller bị lỗi:</Text> Chuyển sang chế độ xả TES</Paragraph>
              <Paragraph><Text strong>Bảo trì:</Text> Sử dụng TES để duy trì hoạt động</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
      


      {/* Thông tin bổ sung */}
      <Card 
        title={
          <span>
            <InfoCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Thông tin bổ sung
          </span>
        }
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Alert
              message="Điều khiển thông minh"
              description="Hệ thống bơm sử dụng VFD với cảm biến chênh áp PDT 4-20mA, tự động điều chỉnh tốc độ theo tải nhiệt và áp suất."
              type="success"
              showIcon
            />
          </Col>
          <Col xs={24} lg={12}>
            <Alert
              message="Dự phòng cao"
              description="Cơ chế 2N+N đảm bảo hoạt động liên tục ngay cả khi có 1 bơm bị lỗi, với thời gian dự phòng TES 10 phút."
              type="warning"
              showIcon
            />
          </Col>
        </Row>
      </Card>
    </div>
    </div>

  );
};

export default PumpSystemSection;
