import {
  CloudOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  SafetyOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Alert, Card, Col, Row, Tag, Typography } from 'antd';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const IntroductionSection = () => {
  // Thông số kỹ thuật chính từ tài liệu thực tế TTDL Vân Canh
  const systemSpecs = [
    {
      category: 'Chiller SMARDT',
      model: 'AE Series (Oil-free)',
      capacity: '632kW (180RT)',
      type: 'Air-cooled, Oil-free',
      features: [
        'Công nghệ Oil-free tiên tiến',
        'Hiệu suất cao',
        'Điều khiển thông minh qua BMS',
        'Hỗ trợ chế độ TES',
      ],
    },
    {
      category: 'PAC UNIFLAIR SDCV',
      model: 'SDCV Series',
      capacity: '3-15.6kW',
      type: 'Precision Air Conditioning',
      features: [
        'Độ chính xác cao ±0.5°C',
        'Tiết kiệm năng lượng',
        'Dễ bảo trì',
        'Phù hợp phòng server nhỏ',
      ],
    },
    {
      category: 'PAC UNIFLAIR LDCV',
      model: 'LDCV Series',
      capacity: '16.8-110kW',
      type: 'Large Room Cooling',
      features: [
        'Công suất lớn',
        'Phù hợp phòng server lớn',
        'Hiệu suất tối ưu',
        'Điều khiển thông minh',
      ],
    },
    {
      category: 'InRow Cooling',
      model: 'Easy InRow CW ERC311',
      capacity: '21.6kW',
      type: 'Chilled Water InRow',
      features: [
        'Làm mát trực tiếp tại rack',
        'Tiết kiệm không gian',
        'Hiệu quả cao',
        'Dễ lắp đặt',
      ],
    },
  ];

  // Cấu trúc hệ thống và nguyên lý hoạt động
  const systemStructure = [
    {
      component: 'Hệ thống Chiller chính',
      description: '2 Chiller SMARDT AE Series hoạt động song song với 1 dự phòng',
      function: 'Làm lạnh nước xuống 10°C để cung cấp cho hệ thống CRAC',
      control: 'Điều khiển tự động qua BMS với chế độ Local/Manual/Auto',
    },
    {
      component: 'Hệ thống bơm nước lạnh',
      description: '3 bơm PCH-01, PCH-02, PCH-03 với cơ chế 2N+N',
      function: 'Tuần hoàn nước lạnh từ Chiller đến CRAC và TES',
      control: 'VFD với cảm biến chênh áp PDT 4-20mA',
    },
    {
      component: 'Hệ thống TES (Thermal Energy Storage)',
      description: 'Bình dự trữ nước lạnh với dung tích 360m³',
      function: 'Dự trữ nước lạnh 10°C cho trường hợp khẩn cấp (10 phút)',
      control: '3 chế độ: Commissioning, Normal, Discharge với van V1A, V1B, V2A, V2B, V3A, V3B',
    },
    {
      component: 'Hệ thống CRAC (Computer Room Air Conditioning)',
      description: 'PAC UNIFLAIR SDCV, LDCV và Easy InRow CW',
      function: 'Làm mát không khí trong phòng server với độ chính xác cao',
      control: 'Điều khiển nhiệt độ ±0.5°C và độ ẩm 45-55%',
    },
  ];

  // Các chế độ vận hành chính
  const operationModes = [
    {
      mode: 'Commissioning (Nạp)',
      description: 'Chế độ khởi động và nạp nước lạnh vào TES',
      vanStatus: 'V1A, V1B: Đóng; V2A, V2B: Mở 10-30%; V3A, V3B: Mở 100%',
      temperature: 'Nước ra Chiller: 10°C, nạp vào TES cho đến khi đỉnh TES đạt 10°C',
      purpose: 'Chuẩn bị hệ thống cho vận hành bình thường',
    },
    {
      mode: 'Normal (Bình thường)',
      description: 'Chế độ vận hành hàng ngày',
      vanStatus: 'V1A, V1B: Mở; V2A, V2B: Đóng; V3A, V3B: Đóng',
      temperature: 'Nước từ Chiller qua TES đến CRAC, duy trì 10°C',
      purpose: 'Vận hành ổn định, tiết kiệm năng lượng',
    },
    {
      mode: 'Discharge (Xả)',
      description: 'Chế độ khẩn cấp khi Chiller mất nguồn',
      vanStatus: 'V1A, V1B: Mở; V2A, V2B: Đóng; V3A, V3B: Đóng',
      temperature: 'Nước từ TES cung cấp cho CRAC, duy trì 10°C trong 10 phút',
      purpose: 'Đảm bảo hoạt động liên tục khi có sự cố',
    },
  ];

  // Thông tin về hệ thống điều khiển BMS
  const bmsInfo = [
    {
      feature: 'Điều khiển tự động Chiller',
      description: 'Tự động khởi động/dừng Chiller theo tải nhiệt và thời gian hoạt động',
      parameters: 'Nhiệt độ nước cấp: 10°C, Công suất Chiller: 80% (gọi thêm), 60% (cắt bớt)',
      timing: 'Thời gian duy trì: 300s, Luân phiên: 8h',
    },
    {
      feature: 'Điều khiển bơm nước',
      description: 'Tự động điều chỉnh tốc độ bơm theo chênh áp và lưu lượng',
      parameters: 'Chênh áp tối thiểu: 0.1-0.3 bar, Lưu lượng tối thiểu qua Chiller',
      control: 'VFD với cảm biến chênh áp PDT 4-20mA',
    },
    {
      feature: 'Điều khiển hệ thống TES',
      description: 'Tự động chuyển đổi giữa các chế độ vận hành',
      parameters: 'Nhiệt độ TES: 10°C, Thời gian dự phòng: 10 phút',
      logic: 'Theo dõi nhiệt độ và trạng thái Chiller để quyết định chế độ',
    },
  ];

  return (
    <div id='section-1' className='content-section'>
      <Title level={2}>
        <InfoCircleOutlined style={{ marginRight: '12px' }} />
        1. Giới thiệu chung hệ thống làm mát TTDL Vân Canh
      </Title>

      <Alert
        message='Hệ thống làm mát tiên tiến'
        description='TTDL Vân Canh sử dụng hệ thống làm mát hiện đại với công nghệ Oil-free Chiller, hệ thống TES dự phòng và điều khiển thông minh qua BMS, đảm bảo độ tin cậy cao và hiệu suất tối ưu.'
        type='info'
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* Thông số kỹ thuật chính */}
      <div id='section-1-1' className='subsection'>
        <Title level={3}>
          <SettingOutlined style={{ marginRight: '12px' }} />
          1.1. Thông số kỹ thuật hệ thống
        </Title>
        <Row gutter={[16, 16]}>
          {systemSpecs.map((spec, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card size='small' style={{ height: '100%' }}>
                <Title level={4}>{spec.category}</Title>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Model:</Text> {spec.model}
                </Paragraph>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Công suất:</Text> {spec.capacity}
                </Paragraph>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Loại:</Text> {spec.type}
                </Paragraph>
                <div style={{ marginTop: '12px' }}>
                  {spec.features.map((feature, idx) => (
                    <Tag key={idx} color='blue' style={{ marginBottom: '4px' }}>
                      {feature}
                    </Tag>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Cấu trúc và nguyên lý hoạt động */}
      <div id='section-1-2' className='subsection'>
        <Title level={3}>
          <CloudOutlined style={{ marginRight: '12px' }} />
          1.2. Cấu trúc và nguyên lý hoạt động
        </Title>
        <Row gutter={[16, 16]}>
          {systemStructure.map((item, index) => (
            <Col xs={24} lg={12} key={index}>
              <Card size='small' style={{ height: '100%' }}>
                <Title level={4}>{item.component}</Title>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Mô tả:</Text> {item.description}
                </Paragraph>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Chức năng:</Text> {item.function}
                </Paragraph>
                <Paragraph style={{ marginBottom: '0' }}>
                  <Text strong>Điều khiển:</Text> {item.control}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Các chế độ vận hành chính */}
      <div id='section-1-3' className='subsection'>
        <Title level={3}>
          <ThunderboltOutlined style={{ marginRight: '12px' }} />
          1.3. Các chế độ vận hành chính
        </Title>

        <Row gutter={[16, 16]}>
          {operationModes.map((mode, index) => (
            <Col xs={24} lg={8} key={index}>
              <Card
                size='small'
                style={{
                  height: '100%',
                  background: index === 1 ? '#f6ffed' : 'white',
                }}
              >
                <Title level={4} className='success-title'>
                  {mode.mode}
                </Title>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Mô tả:</Text> {mode.description}
                </Paragraph>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Trạng thái van:</Text> {mode.vanStatus}
                </Paragraph>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Nhiệt độ:</Text> {mode.temperature}
                </Paragraph>
                <Paragraph style={{ marginBottom: '0' }}>
                  <Text strong>Mục đích:</Text> {mode.purpose}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Hệ thống điều khiển BMS */}
      <div id='section-1-4' className='subsection'>
        <Title level={3}>
          <SafetyOutlined style={{ marginRight: '12px' }} />
          1.4. Hệ thống điều khiển BMS (Building Management System)
        </Title>
        <Row gutter={[16, 16]}>
          {bmsInfo.map((info, index) => (
            <Col xs={24} lg={8} key={index}>
              <Card size='small' style={{ height: '100%' }}>
                <Title level={4} className='technical-title'>
                  {info.feature}
                </Title>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Mô tả:</Text> {info.description}
                </Paragraph>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Tham số:</Text> {info.parameters}
                </Paragraph>
                <Paragraph style={{ marginBottom: '0' }}>
                  <Text strong>Điều khiển:</Text> {info.control}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Thông tin bổ sung */}
      <div id='section-1-5' className='subsection'>
        <Title level={3}>
          <EnvironmentOutlined style={{ marginRight: '12px' }} />
          1.5. Thông tin bổ sung
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Alert
              message='Độ tin cậy cao'
              description='Hệ thống được thiết kế với cơ chế dự phòng 2N+N cho bơm và Chiller, đảm bảo hoạt động liên tục 24/7.'
              type='success'
              showIcon
            />
          </Col>
          <Col xs={24} lg={12}>
            <Alert
              message='Tiết kiệm năng lượng'
              description='Sử dụng công nghệ Oil-free Chiller và điều khiển VFD thông minh, giảm thiểu tiêu thụ năng lượng.'
              type='warning'
              showIcon
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default IntroductionSection;
