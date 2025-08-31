import React from 'react';
import { Typography, Card, Row, Col, Table, Tag, Divider, Alert } from 'antd';
import { 
  CloudOutlined, 
  ThunderboltOutlined, 
  SettingOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const IntroductionSection = () => {
  // Thông số kỹ thuật chính
  const systemSpecs = [
    {
      category: 'Chiller SMARDT',
      model: 'AE054.2B.F2HAJA.A010DX.E10',
      capacity: '632kW (180RT)',
      type: 'Air-cooled, Oil-free',
      features: ['Công nghệ Oil-free', 'Hiệu suất cao', 'Điều khiển thông minh']
    },
    {
      category: 'PAC UNIFLAIR SDCV',
      model: 'SDCV Series (3-15.6kW)',
      capacity: '3-15.6kW',
      type: 'Precision Air Conditioning',
      features: ['Độ chính xác cao', 'Tiết kiệm năng lượng', 'Dễ bảo trì']
    },
    {
      category: 'PAC UNIFLAIR LDCV',
      model: 'LDCV Series (16.8-110kW)',
      capacity: '16.8-110kW',
      type: 'Large Room Cooling',
      features: ['Công suất lớn', 'Phù hợp phòng server', 'Hiệu suất tối ưu']
    },
    {
      category: 'InRow Cooling',
      model: 'Easy InRow CW ERC311',
      capacity: '21.6kW',
      type: 'Chilled Water InRow',
      features: ['Làm mát trực tiếp', 'Tiết kiệm không gian', 'Hiệu quả cao']
    }
  ];

  // Cấu trúc đặt tên model
  const namingStructure = [
    {
      prefix: 'AE',
      meaning: 'Air-cooled Chiller Series',
      example: 'AE054.2B.F2HAJA.A010DX.E10',
      description: 'Chiller làm mát bằng không khí, công nghệ Oil-free'
    },
    {
      prefix: 'SDCV',
      meaning: 'Small Data Center Ventilation',
      example: 'SDCV0300A, SDCV0400A, SDCV0600A',
      description: 'Điều hòa chính xác cho phòng server nhỏ'
    },
    {
      prefix: 'LDCV',
      meaning: 'Large Data Center Ventilation',
      example: 'LDCV0600A, LDCV1800A, LDCV3400A, LDCV4300A',
      description: 'Điều hòa chính xác cho phòng server lớn'
    },
    {
      prefix: 'ERC',
      meaning: 'Easy Row Cooling',
      example: 'ERC311AD0HPE',
      description: 'Hệ thống làm mát InRow dễ lắp đặt'
    }
  ];

  // Nguyên lý hoạt động
  const operationPrinciple = [
    {
      step: '1',
      title: 'Thu nhiệt từ server',
      description: 'Server trong phòng datacenter sinh nhiệt do hoạt động, nhiệt độ không khí tăng lên',
      details: [
        'Server hoạt động sinh nhiệt từ CPU, GPU, các linh kiện điện tử',
        'Nhiệt độ không khí trong phòng tăng lên 22-25°C',
        'Độ ẩm không khí cần được duy trì 45-55%',
        'Luồng không khí nóng cần được thu gom và làm mát'
      ]
    },
    {
      step: '2',
      title: 'Hệ thống bơm và phân phối nước',
      description: 'Hệ thống bơm nước lạnh với điều khiển VFD và các thiết bị phụ trợ đảm bảo cung cấp nước lạnh ổn định',
      details: [
        'Hệ thống 2N+N: 3 bơm nước lạnh (2 hoạt động + 1 dự phòng)',
        'Điều khiển VFD với cảm biến chênh áp (PDT) 4-20mA',
        'Tự động điều chỉnh tốc độ bơm theo tải nhiệt và áp suất',
        'Bình TES dự trữ nước lạnh cho trường hợp khẩn cấp (10 phút)'
      ]
    },
    {
      step: '3',
      title: 'Làm mát bằng PAC và InRow',
      description: 'PAC UNIFLAIR và Easy InRow CW hấp thụ nhiệt từ không khí nóng, làm mát xuống nhiệt độ mục tiêu',
      details: [
        'PAC UNIFLAIR: Làm mát không khí toàn phòng với độ chính xác ±0.5°C',
        'Easy InRow CW: Làm mát trực tiếp tại nguồn nhiệt trong hàng rack',
        'Nước lạnh 7°C từ chiller chảy qua bộ trao đổi nhiệt',
        'Không khí nóng được làm mát xuống 16-18°C'
      ]
    },
    {
      step: '4',
      title: 'Điều khiển lưu lượng nước lạnh',
      description: 'Van PICV tự động điều chỉnh lưu lượng nước lạnh theo tải nhiệt và nhiệt độ phòng',
      details: [
        'Van PICV điều khiển lưu lượng độc lập áp suất theo tải nhiệt',
        'Cảm biến nhiệt độ phòng gửi tín hiệu về BMS để điều khiển',
        'Tự động mở/đóng van theo nhu cầu làm mát thực tế',
        'Điều chỉnh áp suất đường ống thông qua cảm biến PDT'
      ]
    },
    {
      step: '5',
      title: 'Chiller làm mát nước',
      description: 'Chiller SMARDT hoạt động 24/7 với hệ thống điều khiển thông minh và bảo vệ an toàn',
      details: [
        'Hoạt động 24/7 với bộ vi xử lý điều chỉnh tự động theo tải nhiệt',
        'Hệ thống 2N+N: 3 chiller (2 hoạt động + 1 dự phòng)',
        'Tự động khởi động/dừng theo tín hiệu BMS và điều kiện tải',
        'Bảo vệ an toàn với kiểm tra hệ thống trước khi vận hành'
      ]
    },
    {
      step: '6',
      title: 'Quy trình khởi động hệ thống',
      description: 'Trình tự khởi động an toàn: kiểm tra → bơm → quạt → chiller → PAC/CRAC',
      details: [
        'Kiểm tra an toàn hệ thống trước khi khởi động',
        'Khởi động bơm nước lạnh đến tốc độ đầy tải',
        'Khởi động quạt dàn ngưng khi máy nén đạt trạng thái đầy tải',
        'Khởi động PAC/CRAC và bắt đầu điều khiển theo tải nhiệt'
      ]
    },
    {
      step: '7',
      title: 'BMS giám sát và điều khiển hệ thống',
      description: 'Hệ thống BMS điều khiển toàn bộ quá trình vận hành theo logic tương hỗ giữa chiller và bơm',
      details: [
        'Điều khiển logic tương hỗ: chiller ↔ bơm ↔ van PICV ↔ cảm biến',
        'Giám sát lưu lượng nước qua lưu lượng kế trên từng bơm',
        'Đảm bảo lưu lượng nước tối thiểu qua chiller khi vận hành',
        'Tuân thủ tiêu chuẩn Uptime Institute Tier III cho độ tin cậy'
      ]
    }
  ];

  return (
    <div style={{ padding: '20px 0' }}>
      <Title level={2} style={{ color: '#1890ff', marginBottom: '24px' }}>
        <InfoCircleOutlined style={{ marginRight: '12px' }} />
        1. GIỚI THIỆU CHUNG - TTDL Vân Canh
      </Title>

      <Alert
        message="Hệ thống làm mát TTDL Vân Canh"
        description="TTDL Vân Canh sử dụng công nghệ làm mát hiện đại với chiller SMARDT Oil-free, PAC UNIFLAIR và InRow cooling để đảm bảo hiệu suất tối ưu và độ tin cậy cao."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* 1.1 Thông số kỹ thuật */}
      <div id="section-1a" style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
          1.1 Thông số kỹ thuật
        </Title>
        
        <Row gutter={[16, 16]}>
          {systemSpecs.map((spec, index) => (
            <Col xs={24} lg={12} key={index}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CloudOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    {spec.category}
                  </div>
                }
                style={{ height: '100%' }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <Text strong>Model:</Text> {spec.model}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Text strong>Công suất:</Text> {spec.capacity}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <Text strong>Loại:</Text> {spec.type}
                </div>
                <div>
                  <Text strong>Tính năng:</Text>
                  <div style={{ marginTop: '8px' }}>
                    {spec.features.map((feature, idx) => (
                      <Tag key={idx} color="blue" style={{ marginBottom: '4px' }}>
                        <CheckCircleOutlined style={{ marginRight: '4px' }} />
                        {feature}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Divider />

      {/* 1.2 Cấu trúc đặt tên model */}
      <div id="section-1b" style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
          1.2 Cấu trúc đặt tên của các model thuộc TTDL Vân Canh
        </Title>

        <Table
          dataSource={namingStructure}
          columns={[
            {
              title: 'Prefix',
              dataIndex: 'prefix',
              key: 'prefix',
              width: 120,
              render: (text) => <Tag color="blue">{text}</Tag>
            },
            {
              title: 'Ý nghĩa',
              dataIndex: 'meaning',
              key: 'meaning',
              width: 200
            },
            {
              title: 'Ví dụ',
              dataIndex: 'example',
              key: 'example',
              width: 200,
              render: (text) => <Text code>{text}</Text>
            },
            {
              title: 'Mô tả',
              dataIndex: 'description',
              key: 'description'
            }
          ]}
          pagination={false}
          size="small"
        />
      </div>

      <Divider />

      {/* 1.3 Nguyên lý hoạt động */}
      <div id="section-1c" style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
          1.3 Nguyên lý hoạt động và chu trình làm mát của hệ thống TTDL Vân Canh
        </Title>

        <Row gutter={[16, 16]}>
          {operationPrinciple.map((principle, index) => (
            <Col xs={24} lg={12} key={index}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SettingOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    Bước {principle.step}: {principle.title}
                  </div>
                }
                style={{ height: '100%' }}
              >
                <Paragraph style={{ marginBottom: '12px' }}>
                  {principle.description}
                </Paragraph>
                <div>
                  <Text strong>Chi tiết:</Text>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {principle.details.map((detail, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        <Text>{detail}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Thông tin bổ sung */}
      <Alert
        message="Lưu ý quan trọng"
        description="Hệ thống làm mát TTDL Vân Canh được thiết kế với công nghệ tiên tiến, đảm bảo hiệu suất cao và độ tin cậy. Việc vận hành và bảo trì cần tuân thủ nghiêm ngặt các quy trình hướng dẫn."
        type="warning"
        showIcon
        style={{ marginTop: '24px' }}
      />
    </div>
  );
};

export default IntroductionSection;
