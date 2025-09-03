import {
  MonitorOutlined,
  PoweroffOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { Card, Col, Divider, Row, Steps, Tag, Typography, Alert, Descriptions } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const IntroductionSection = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  // Thông tin hệ thống từ tài liệu thực tế
  const systemOverview = {
    title: 'Hệ thống UPS Galaxy VL & Ắc quy BMS - TTDL Vân Canh',
    description: 'Hệ thống UPS (Uninterruptible Power Supply) Galaxy VL và ắc quy BMS tại Trung tâm Dữ liệu Vân Canh được thiết kế để đảm bảo cung cấp nguồn điện liên tục và ổn định cho các thiết bị quan trọng của trung tâm dữ liệu.',
    location: 'Trung tâm Dữ liệu Vân Canh',
    manufacturer: 'Schneider Electric',
    model: 'Galaxy VL Series',
    capacity: '200-500 kVA',
    standard: 'IEC/UL Standards'
  };

  // Đặc điểm kỹ thuật chính từ tài liệu
  const systemFeatures = [
    {
      icon: <ThunderboltOutlined />,
      title: 'Hệ thống UPS Galaxy VL',
      description: 'UPS 3 pha công suất cao 200-500kVA theo tiêu chuẩn IEC/UL',
      features: [
        'Độ tin cậy cao với thiết kế N+X redundancy',
        'Hiệu suất tối ưu lên đến 96.5%',
        'Bảo vệ toàn diện cho thiết bị tải',
        'Hỗ trợ chế độ High Efficiency Mode',
        'Tích hợp sẵn hệ thống giám sát thông minh'
      ]
    },
    {
      icon: <PoweroffOutlined />,
      title: 'Hệ thống ắc quy BMS272',
      description: 'Giám sát và quản lý ắc quy thông minh với công nghệ tiên tiến',
      features: [
        'Giám sát real-time lên đến 1020 cell',
        'Cảnh báo sớm qua SMS/Email',
        'Tối ưu tuổi thọ ắc quy',
        'Hỗ trợ nhiều loại ắc quy (VRLA, Ni-Cd, Lithium)',
        'Giao diện cảm ứng 7" độ phân giải cao'
      ]
    },
    {
      icon: <SafetyOutlined />,
      title: 'Bảo mật và an toàn',
      description: 'Bảo vệ thiết bị và dữ liệu với các tiêu chuẩn an toàn cao',
      features: [
        'Bảo vệ quá tải và ngắn mạch',
        'Bảo vệ nhiệt độ và môi trường',
        'Hệ thống EPO (Emergency Power Off)',
        'Kirk Key Interlock System',
        'Tuân thủ tiêu chuẩn an toàn IEC/UL'
      ]
    },
    {
      icon: <MonitorOutlined />,
      title: 'Giám sát từ xa',
      description: 'Quản lý và giám sát qua mạng với giao thức chuẩn công nghiệp',
      features: [
        'Web interface thân thiện',
        'Modbus TCP/RTU protocol',
        'SNMP v2/v3 support',
        'SCADA integration',
        'Mobile app support'
      ]
    }
  ];

  // Thông số kỹ thuật chi tiết từ tài liệu
  const technicalSpecs = [
    {
      category: 'Điện áp đầu vào',
      specs: ['380V', '400V', '415V', '440V', '480V'],
      unit: 'V',
      tolerance: '±10%',
      description: 'Hỗ trợ đa dạng điện áp đầu vào theo tiêu chuẩn IEC/UL'
    },
    {
      category: 'Tần số',
      specs: ['50Hz', '60Hz'],
      unit: 'Hz',
      tolerance: '±2%',
      description: 'Tự động điều chỉnh theo tần số lưới điện'
    },
    {
      category: 'Công suất',
      specs: ['200kVA', '250kVA', '300kVA', '350kVA', '400kVA', '450kVA', '500kVA'],
      unit: 'kVA',
      tolerance: '±2%',
      description: 'Dải công suất rộng, hỗ trợ mở rộng linh hoạt'
    },
    {
      category: 'Hệ số công suất',
      specs: ['0.9'],
      unit: '',
      tolerance: '±0.02',
      description: 'Hệ số công suất cao, tối ưu hiệu suất hệ thống'
    },
    {
      category: 'Hiệu suất',
      specs: ['96.5%'],
      unit: '',
      tolerance: '±0.5%',
      description: 'Hiệu suất cao nhất trong ngành, tiết kiệm năng lượng'
    }
  ];

  // Các chế độ vận hành từ tài liệu
  const operationModes = [
    {
      title: 'Chế độ Normal (Online)',
      description: 'Vận hành bình thường với nguồn điện lưới, ắc quy được sạc đầy',
      icon: '🟢',
      features: [
        'Điện áp đầu ra ổn định 380-480V ±1%',
        'Tần số đầu ra chính xác 50/60Hz ±0.1%',
        'Ắc quy được sạc liên tục',
        'Giám sát real-time các thông số'
      ]
    },
    {
      title: 'Chế độ Battery (Backup)',
      description: 'Vận hành bằng ắc quy khi mất điện lưới, thời gian backup lên đến 120 phút',
      icon: '🔋',
      features: [
        'Chuyển đổi tự động khi mất điện lưới',
        'Thời gian chuyển đổi <10ms',
        'Điện áp đầu ra ổn định',
        'Cảnh báo thời gian backup còn lại'
      ]
    },
    {
      title: 'Chế độ Bypass (Static Bypass)',
      description: 'Bỏ qua UPS, cung cấp điện trực tiếp từ lưới khi cần thiết',
      icon: '⚡',
      features: [
        'Chuyển đổi tự động khi UPS quá tải',
        'Bảo vệ tải khỏi mất điện',
        'Thời gian chuyển đổi <4ms',
        'Giám sát chất lượng điện lưới'
      ]
    },
    {
      title: 'Chế độ Maintenance',
      description: 'Chế độ bảo trì và kiểm tra, cho phép bảo trì an toàn',
      icon: '🔧',
      features: [
        'Bảo trì an toàn không mất điện tải',
        'Kiểm tra toàn bộ hệ thống',
        'Thay thế linh kiện dễ dàng',
        'Test chức năng từng module'
      ]
    }
  ];

  // Hệ thống giám sát BMS từ tài liệu
  const bmsSystem = {
    title: 'Hệ thống giám sát ắc quy BMS272',
    description: 'Hệ thống giám sát ắc quy thông minh với khả năng giám sát lên đến 1020 cell và tích hợp nhiều giao thức truyền thông.',
    components: [
      {
        name: 'Data Collector (BMS272)',
        description: 'Bộ thu thập dữ liệu chính với màn hình cảm ứng 7"',
        features: [
          'Quad Core 1.2GHz Broadcom BCM2837 64bit CPU',
          'Windows IoT OS',
          'Màn hình cảm ứng 7" 1024x600',
          'Giao tiếp WiFi, 3G, Ethernet, RS485'
        ]
      },
      {
        name: 'String Measure Kit (SMK)',
        description: 'Bộ đo điện áp và dòng điện string ắc quy',
        features: [
          'Đo điện áp string ắc quy',
          'Đo dòng điện qua Hall CT Kit',
          'Đo nhiệt độ môi trường',
          'Truyền dữ liệu không dây'
        ]
      },
      {
        name: 'Battery Measure Kit (BMK)',
        description: 'Bộ đo điện áp và trở kháng cell ắc quy',
        features: [
          'Đo điện áp block ắc quy',
          'Đo trở kháng ắc quy',
          'Đo nhiệt độ block ắc quy',
          'Giám sát tình trạng từng cell'
        ]
      }
    ],
    capabilities: [
      'Giám sát điện áp, dòng điện, nhiệt độ real-time',
      'Phân tích xu hướng với biểu đồ màu sắc',
      'Báo cáo Excel hàng ngày qua email',
      'Truy cập dữ liệu qua web browser',
      'Cảnh báo SMS/Email khi có sự cố',
      'Tích hợp Modbus cho SCADA/DCS'
    ]
  };

  // Cấu trúc hệ thống từ tài liệu
  const systemArchitecture = {
    title: 'Cấu trúc hệ thống UPS Galaxy VL',
    description: 'Hệ thống được thiết kế theo kiến trúc module hóa, hỗ trợ cả cấu hình đơn lẻ và song song với khả năng mở rộng linh hoạt.',
    configurations: [
      {
        type: 'Single System',
        description: 'Hệ thống đơn lẻ với một UPS module',
        features: [
          'Công suất 200-500kVA',
          'Độ tin cậy cao',
          'Dễ bảo trì và vận hành',
          'Phù hợp cho ứng dụng vừa và nhỏ'
        ]
      },
      {
        type: 'Parallel System',
        description: 'Hệ thống song song với N+X redundancy',
        features: [
          'Khả năng mở rộng linh hoạt',
          'Độ tin cậy cực cao với N+X redundancy',
          'Load sharing tự động',
          'Bảo trì không mất điện tải'
        ]
      }
    ]
  };

  return (
    <div className="content-section">
      <Title level={2} id="section-1">
        1. GIỚI THIỆU CHUNG
      </Title>
      
      <Paragraph>
        Hệ thống UPS (Uninterruptible Power Supply) Galaxy VL và ắc quy BMS tại Trung tâm Dữ liệu Vân Canh 
        được thiết kế để đảm bảo cung cấp nguồn điện liên tục và ổn định cho các thiết bị quan trọng.
      </Paragraph>

      {/* 1.1 - Thông số kỹ thuật hệ thống UPS */}
      <div id="1.1" className="subsection">
        <Title level={3}>
          1.1. Thông số kỹ thuật hệ thống UPS
        </Title>
        <Card title="Tổng quan hệ thống" style={{ marginBottom: '20px' }}>
          <Descriptions bordered column={{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Vị trí">{systemOverview.location}</Descriptions.Item>
            <Descriptions.Item label="Nhà sản xuất">{systemOverview.manufacturer}</Descriptions.Item>
            <Descriptions.Item label="Model">{systemOverview.model}</Descriptions.Item>
            <Descriptions.Item label="Công suất">{systemOverview.capacity}</Descriptions.Item>
            <Descriptions.Item label="Tiêu chuẩn">{systemOverview.standard}</Descriptions.Item>
          </Descriptions>
          <Divider />
          <Paragraph>{systemOverview.description}</Paragraph>
        </Card>

        {/* Thông số kỹ thuật chi tiết */}
        <Card title="Thông số kỹ thuật chi tiết" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            {technicalSpecs.map((spec, index) => (
              <Col xs={24} lg={12} key={index}>
                <Card 
                  size="small" 
                  title={spec.category}
                  style={{ height: '100%' }}
                  headStyle={{ backgroundColor: '#f0f9ff', borderBottom: '1px solid #d1ecf1' }}
                >
                  <Descriptions column={1} size="small" bordered={false}>
                    <Descriptions.Item label="Giá trị">
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {spec.specs.map((value, i) => (
                          <Tag key={i} color="blue">{value}</Tag>
                        ))}
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Đơn vị">
                      {spec.unit ? <Tag color="green">{spec.unit}</Tag> : <Text type="secondary">-</Text>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Độ chính xác">
                      <Tag color="orange">{spec.tolerance}</Tag>
                    </Descriptions.Item>
                  </Descriptions>
                  <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {spec.description}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>

      {/* 1.2 - Cấu trúc và nguyên lý hoạt động */}
      <div id="1.2" className="subsection">
        <Title level={3}>
          1.2. Cấu trúc và nguyên lý hoạt động
        </Title>
        <Card title="Cấu trúc hệ thống UPS Galaxy VL" style={{ marginBottom: '20px' }}>
          <Paragraph>{systemArchitecture.description}</Paragraph>
          <Row gutter={[16, 16]}>
            {systemArchitecture.configurations.map((config, index) => (
              <Col xs={24} lg={12} key={index}>
                <Card size="small" title={config.type}>
                  <Paragraph>{config.description}</Paragraph>
                  <Text strong>Đặc điểm:</Text>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {config.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        <Card title="Đặc điểm chính của hệ thống" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            {systemFeatures.map((feature, index) => (
              <Col xs={24} lg={12} key={index}>
                <Card 
                  size="small" 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {feature.icon}
                      {feature.title}
                    </div>
                  }
                  style={{ height: '100%' }}
                >
                  <Paragraph>{feature.description}</Paragraph>
                  <Text strong>Đặc điểm nổi bật:</Text>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {feature.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>

      {/* 1.3 - Các chế độ vận hành chính */}
      <div id="1.3" className="subsection">
        <Title level={3}>
          1.3. Các chế độ vận hành chính
        </Title>
        <Card title="Các chế độ vận hành UPS Galaxy VL" style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            {operationModes.map((mode, index) => (
              <Col xs={24} lg={12} key={index}>
                <Card 
                  size="small" 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{mode.icon}</span>
                      {mode.title}
                    </div>
                  }
                  style={{ height: '100%' }}
                >
                  <Paragraph>{mode.description}</Paragraph>
                  <Text strong>Đặc điểm:</Text>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {mode.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>

      {/* 1.4 - Hệ thống giám sát BMS */}
      <div id="1.4" className="subsection">
        <Title level={3}>
          1.4. Hệ thống giám sát BMS
        </Title>
        <Card title={bmsSystem.title} style={{ marginBottom: '20px' }}>
          <Paragraph>{bmsSystem.description}</Paragraph>
          
          <Title level={4}>Các thành phần chính</Title>
          <Row gutter={[16, 16]}>
            {bmsSystem.components.map((component, index) => (
              <Col xs={24} lg={8} key={index}>
                <Card size="small" title={component.name}>
                  <Paragraph>{component.description}</Paragraph>
                  <Text strong>Thông số:</Text>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {component.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>

          <Divider />
          <Title level={4}>Khả năng giám sát</Title>
          <Row gutter={[16, 16]}>
            {bmsSystem.capabilities.map((capability, index) => (
              <Col xs={24} sm={12} key={index}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DatabaseOutlined  />
                  <Text>{capability}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </div>


      <Divider />

      {/* Lưu ý quan trọng */}
      <Card title="Lưu ý quan trọng" style={{ marginBottom: '20px' }}>
        <Alert
          message="Yêu cầu về môi trường"
          description="Hệ thống UPS Galaxy VL yêu cầu môi trường vận hành: nhiệt độ 0-40°C, độ ẩm 20-80% RH, không có bụi bẩn và khí ăn mòn."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Alert
          message="Yêu cầu về nhân sự"
          description="Chỉ nhân viên có trình độ và được đào tạo mới được vận hành, bảo trì và sửa chữa hệ thống UPS. Tuân thủ nghiêm ngặt các quy trình an toàn."
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Alert
          message="Tuân thủ tiêu chuẩn"
          description="Hệ thống được thiết kế theo tiêu chuẩn IEC/UL. Việc lắp đặt, vận hành và bảo trì phải tuân thủ các tiêu chuẩn này và hướng dẫn của nhà sản xuất."
          type="success"
          showIcon
        />
      </Card>
      
      <Paragraph className="section-footer">
        Hệ thống UPS & Ắc quy BMS - TTDL Vân Canh | Giới thiệu tổng quan hệ thống
      </Paragraph>
    </div>
  );
};

export default IntroductionSection;
