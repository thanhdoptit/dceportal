import { Alert, Card, Col, Row, Table, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const MonitoringSection = () => {
  // Thông tin giao diện người dùng từ tài liệu thực tế
  const userInterfaceInfo = {
    title: 'Giao diện người dùng UPS Galaxy VL',
    description:
      'Hệ thống UPS Galaxy VL được trang bị màn hình cảm ứng thông minh với các tính năng điều khiển và giám sát tiên tiến.',
    mainFeatures: [
      {
        name: 'Màn hình cảm ứng 7"',
        description: 'Độ phân giải cao, giao diện thân thiện với người dùng',
        icon: '📱',
      },
      {
        name: 'Nút điều khiển chính',
        description: 'Home, Menu, Sơ đồ, Cảnh báo - dễ dàng truy cập từ mọi màn hình',
        icon: '🎛️',
      },
      {
        name: 'Hiển thị trạng thái real-time',
        description: 'Cập nhật liên tục các thông số hoạt động',
        icon: '⚡',
      },
      {
        name: 'Menu điều hướng trực quan',
        description: 'Cấu trúc menu logic, dễ sử dụng',
        icon: '📋',
      },
    ],
  };

  // Các màn hình chính từ tài liệu
  const mainScreens = [
    {
      name: 'Màn hình chính (Home)',
      description: 'Hiển thị tổng quan trạng thái hệ thống',
      features: [
        'Trạng thái hoạt động UPS',
        'Điện áp đầu vào/ra',
        'Tần số và công suất',
        'Trạng thái ắc quy',
        'Cảnh báo và báo động',
        'Thời gian backup còn lại',
      ],
      icon: '🏠',
    },
    {
      name: 'Màn hình Menu chính',
      description: 'Truy cập các chức năng chính của hệ thống',
      features: [
        'Cài đặt thông số',
        'Giám sát chi tiết',
        'Lịch sử sự kiện',
        'Báo cáo và thống kê',
        'Cài đặt hệ thống',
        'Bảo trì và kiểm tra',
      ],
      icon: '📋',
    },
    {
      name: 'Màn hình Sơ đồ',
      description: 'Hiển thị sơ đồ hệ thống và trạng thái các thành phần',
      features: [
        'Sơ đồ tổng thể hệ thống',
        'Trạng thái từng module',
        'Kết nối điện và mạng',
        'Luồng dữ liệu',
        'Cảnh báo trực quan',
        'Điều khiển từ xa',
      ],
      icon: '📊',
    },
    {
      name: 'Màn hình Cảnh báo',
      description: 'Quản lý và xử lý các cảnh báo hệ thống',
      features: [
        'Danh sách cảnh báo hiện tại',
        'Lịch sử cảnh báo',
        'Mức độ ưu tiên',
        'Hướng dẫn xử lý',
        'Ghi chép hành động',
        'Báo cáo sự cố',
      ],
      icon: '⚠️',
    },
  ];

  // Thông số giám sát chính
  const monitoringParameters = [
    {
      category: 'Thông số điện',
      parameters: [
        { name: 'Điện áp đầu vào', unit: 'V', range: '380-480V', accuracy: '±1%' },
        { name: 'Điện áp đầu ra', unit: 'V', range: '380-480V', accuracy: '±1%' },
        { name: 'Tần số đầu ra', unit: 'Hz', range: '50/60Hz', accuracy: '±0.1%' },
        { name: 'Công suất tải', unit: 'kVA', range: '0-500kVA', accuracy: '±2%' },
        { name: 'Hệ số công suất', unit: '', range: '0.8-1.0', accuracy: '±0.02' },
      ],
    },
    {
      category: 'Thông số ắc quy',
      parameters: [
        { name: 'Điện áp ắc quy', unit: 'V', range: '180-280V', accuracy: '±1%' },
        { name: 'Dòng sạc ắc quy', unit: 'A', range: '0-100A', accuracy: '±2%' },
        { name: 'Trạng thái sạc', unit: '', range: 'Charging/Ready/Discharging', accuracy: '-' },
        { name: 'Thời gian backup', unit: 'phút', range: '0-120 phút', accuracy: '±1 phút' },
        { name: 'Nhiệt độ ắc quy', unit: '°C', range: '0-50°C', accuracy: '±1°C' },
      ],
    },
    {
      category: 'Thông số môi trường',
      parameters: [
        { name: 'Nhiệt độ môi trường', unit: '°C', range: '0-40°C', accuracy: '±1°C' },
        { name: 'Độ ẩm', unit: '%RH', range: '20-80%', accuracy: '±5%' },
        { name: 'Nhiệt độ UPS', unit: '°C', range: '0-60°C', accuracy: '±2°C' },
        { name: 'Tiếng ồn', unit: 'dB', range: '0-70dB', accuracy: '±3dB' },
      ],
    },
  ];

  // Giao thức truyền thông
  const communicationProtocols = [
    {
      name: 'Modbus TCP',
      description: 'Giao thức truyền thông công nghiệp chuẩn',
      features: [
        'Hỗ trợ Modbus TCP/IP',
        'Tốc độ truyền 10/100 Mbps',
        'Địa chỉ IP có thể cấu hình',
        'Port mặc định 502',
        'Hỗ trợ đa kết nối đồng thời',
      ],
      icon: '🌐',
    },
    {
      name: 'Modbus RTU',
      description: 'Giao thức truyền thông nối tiếp',
      features: [
        'Hỗ trợ Modbus RTU qua RS485',
        'Tốc độ baud 9600-115200',
        'Cấu hình master/slave',
        'Khoảng cách truyền tối đa 1200m',
        'Hỗ trợ đa thiết bị trên một bus',
      ],
      icon: '🔌',
    },
    {
      name: 'SNMP v2/v3',
      description: 'Giao thức quản lý mạng',
      features: [
        'Hỗ trợ SNMP v2c và v3',
        'MIB chuẩn cho UPS',
        'Trap và notification',
        'Bảo mật authentication',
        'Tích hợp với hệ thống quản lý mạng',
      ],
      icon: '📡',
    },
  ];

  // Kết nối mạng và SCADA
  const networkConnections = [
    {
      type: 'Ethernet',
      description: 'Kết nối mạng có dây',
      specifications: [
        'Cổng RJ45 10/100 Mbps',
        'Hỗ trợ Auto-negotiation',
        'Cấu hình IP tĩnh hoặc DHCP',
        'Hỗ trợ VLAN tagging',
        'Cấu hình subnet mask và gateway',
      ],
      icon: '🔗',
    },
    {
      type: 'WiFi (tùy chọn)',
      description: 'Kết nối mạng không dây',
      specifications: [
        'Hỗ trợ WiFi 802.11 b/g/n',
        'Bảo mật WPA2/WPA3',
        'Cấu hình SSID và password',
        'Hỗ trợ WPS',
        'Phạm vi phủ sóng lên đến 100m',
      ],
      icon: '📶',
    },
    {
      type: '3G/4G (tùy chọn)',
      description: 'Kết nối mạng di động',
      specifications: [
        'Hỗ trợ SIM card',
        'Kết nối internet độc lập',
        'Báo cáo qua SMS/Email',
        'Backup kết nối mạng',
        'Cấu hình APN và authentication',
      ],
      icon: '📱',
    },
  ];

  // Tích hợp SCADA
  const scadaIntegration = {
    title: 'Tích hợp hệ thống SCADA',
    description:
      'UPS Galaxy VL được thiết kế để tích hợp dễ dàng với các hệ thống SCADA và DCS hiện có.',
    features: [
      {
        name: 'Giao thức chuẩn',
        description: 'Hỗ trợ các giao thức truyền thông công nghiệp phổ biến',
        details: ['Modbus TCP/RTU', 'SNMP', 'OPC UA', 'DNP3'],
      },
      {
        name: 'Dữ liệu real-time',
        description: 'Cung cấp dữ liệu giám sát theo thời gian thực',
        details: ['Cập nhật mỗi giây', 'Độ trễ thấp', 'Độ tin cậy cao'],
      },
      {
        name: 'Báo cáo và logging',
        description: 'Hệ thống ghi chép và báo cáo tự động',
        details: ['Log sự kiện', 'Báo cáo định kỳ', 'Xuất dữ liệu Excel'],
      },
      {
        name: 'Cảnh báo và báo động',
        description: 'Hệ thống cảnh báo thông minh',
        details: ['Cảnh báo real-time', 'Escalation', 'SMS/Email alerts'],
      },
    ],
  };

  // Cài đặt thông số
  const systemSettings = [
    {
      category: 'Cài đặt điện',
      settings: [
        {
          name: 'Điện áp đầu ra',
          description: 'Cấu hình điện áp đầu ra (380V, 400V, 415V, 440V, 480V)',
        },
        { name: 'Tần số đầu ra', description: 'Cấu hình tần số đầu ra (50Hz hoặc 60Hz)' },
        { name: 'Giới hạn tải', description: 'Thiết lập giới hạn công suất tải tối đa' },
        {
          name: 'Chế độ hoạt động',
          description: 'Cấu hình chế độ hoạt động (Normal, Eco, Line-interactive)',
        },
      ],
    },
    {
      category: 'Cài đặt ắc quy',
      settings: [
        { name: 'Thời gian sạc', description: 'Cấu hình thời gian sạc ắc quy' },
        { name: 'Ngưỡng cảnh báo', description: 'Thiết lập ngưỡng cảnh báo mức sạc ắc quy' },
        { name: 'Chế độ sạc', description: 'Cấu hình chế độ sạc (Float, Boost, Equalization)' },
        { name: 'Bảo vệ ắc quy', description: 'Thiết lập các thông số bảo vệ ắc quy' },
      ],
    },
    {
      category: 'Cài đặt mạng',
      settings: [
        { name: 'Địa chỉ IP', description: 'Cấu hình địa chỉ IP tĩnh hoặc DHCP' },
        { name: 'Subnet mask', description: 'Thiết lập subnet mask cho mạng' },
        { name: 'Gateway', description: 'Cấu hình gateway mặc định' },
        { name: 'DNS servers', description: 'Thiết lập DNS servers' },
      ],
    },
  ];

  return (
    <div className='content-section'>
      <Title level={2} id='section-4'>
        4. GIÁM SÁT & ĐIỀU KHIỂN
      </Title>

      <Paragraph>
        Hệ thống UPS Galaxy VL được trang bị các tính năng giám sát và điều khiển tiên tiến, cho
        phép người vận hành theo dõi và điều khiển hệ thống một cách hiệu quả và an toàn.
      </Paragraph>

      {/* 4.1 - Giao diện người dùng */}
      <div id='section-4-1' className='subsection'>
        <Title level={3}>4.1. Giao diện người dùng</Title>
        <Card title={userInterfaceInfo.title} style={{ marginBottom: '20px' }}>
          <Paragraph>{userInterfaceInfo.description}</Paragraph>
          <Row gutter={[16, 16]}>
            {userInterfaceInfo.mainFeatures.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card size='small' style={{ height: '100%', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{feature.icon}</div>
                  <Text strong>{feature.name}</Text>
                  <br />
                  <Text type='secondary' style={{ fontSize: '12px' }}>
                    {feature.description}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Các màn hình chính */}
        <Card title='Các màn hình chính của hệ thống' style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            {mainScreens.map((screen, index) => (
              <Col xs={24} lg={12} key={index}>
                <Card
                  size='small'
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{screen.icon}</span>
                      {screen.name}
                    </div>
                  }
                  style={{ height: '100%' }}
                >
                  <Paragraph>{screen.description}</Paragraph>
                  <Text strong>Chức năng chính:</Text>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {screen.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Thông số giám sát */}
        <Card title='Thông số giám sát chính' style={{ marginBottom: '20px' }}>
          {monitoringParameters.map((category, index) => (
            <div key={index}>
              <Title level={4}>{category.category}</Title>
              <Table
                dataSource={category.parameters}
                rowKey='name'
                columns={[
                  {
                    title: 'Thông số',
                    dataIndex: 'name',
                    key: 'name',
                    width: '25%',
                    render: text => <Text strong>{text}</Text>,
                  },
                  {
                    title: 'Đơn vị',
                    dataIndex: 'unit',
                    key: 'unit',
                    width: '15%',
                    render: text => <Tag color='blue'>{text}</Tag>,
                  },
                  {
                    title: 'Dải đo',
                    dataIndex: 'range',
                    key: 'range',
                    width: '25%',
                  },
                  {
                    title: 'Độ chính xác',
                    dataIndex: 'accuracy',
                    key: 'accuracy',
                    width: '20%',
                    render: text => (text === '-' ? '-' : <Tag color='green'>{text}</Tag>),
                  },
                ]}
                pagination={false}
                size='small'
                style={{ marginBottom: '16px' }}
              />
            </div>
          ))}
        </Card>

        {/* Giao thức truyền thông */}
        <Card title='Giao thức truyền thông' style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            {communicationProtocols.map((protocol, index) => (
              <Col xs={24} lg={8} key={index}>
                <Card
                  size='small'
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{protocol.icon}</span>
                      {protocol.name}
                    </div>
                  }
                  style={{ height: '100%' }}
                >
                  <Paragraph>{protocol.description}</Paragraph>
                  <Text strong>Tính năng:</Text>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {protocol.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>

      {/* 4.2 - Kết nối mạng và SCADA */}
      <div id='section-4-2' className='subsection'>
        <Title level={3}>4.2. Kết nối mạng và SCADA</Title>
        <Card title='Kết nối mạng và truyền thông' style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]}>
            {networkConnections.map((connection, index) => (
              <Col xs={24} lg={8} key={index}>
                <Card
                  size='small'
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{connection.icon}</span>
                      {connection.type}
                    </div>
                  }
                  style={{ height: '100%' }}
                >
                  <Paragraph>{connection.description}</Paragraph>
                  <Text strong>Thông số kỹ thuật:</Text>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {connection.specifications.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Tích hợp SCADA */}
        <Card title={scadaIntegration.title} style={{ marginBottom: '20px' }}>
          <Paragraph>{scadaIntegration.description}</Paragraph>
          <Row gutter={[16, 16]}>
            {scadaIntegration.features.map((feature, index) => (
              <Col xs={24} lg={12} key={index}>
                <Card size='small' title={feature.name}>
                  <Paragraph>{feature.description}</Paragraph>
                  <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {feature.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Cài đặt hệ thống */}
        <Card title='Cài đặt thông số hệ thống' style={{ marginBottom: '20px' }}>
          {systemSettings.map((category, index) => (
            <div key={index}>
              <Title level={4}>{category.category}</Title>
              <Row gutter={[16, 16]}>
                {category.settings.map((setting, i) => (
                  <Col xs={24} sm={12} key={i}>
                    <Card size='small' style={{ height: '100%' }}>
                      <Text strong>{setting.name}</Text>
                      <br />
                      <Text type='secondary'>{setting.description}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Card>

        {/* Lưu ý quan trọng */}
        <Card title='Lưu ý quan trọng về giám sát' style={{ marginBottom: '20px' }}>
          <Alert
            message='Bảo mật mạng'
            description='Đảm bảo cấu hình bảo mật mạng phù hợp khi kết nối UPS vào mạng doanh nghiệp. Sử dụng firewall và VLAN để bảo vệ hệ thống.'
            type='warning'
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Alert
            message='Backup cấu hình'
            description='Luôn backup cấu hình hệ thống trước khi thay đổi. Cấu hình có thể được xuất/nhập qua web interface hoặc USB.'
            type='info'
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Alert
            message='Cập nhật firmware'
            description='Thường xuyên kiểm tra và cập nhật firmware để đảm bảo hiệu suất tối ưu và bảo mật hệ thống.'
            type='success'
            showIcon
          />
        </Card>
      </div>
    </div>
  );
};

export default MonitoringSection;
