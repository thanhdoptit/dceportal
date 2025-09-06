import {
  ApartmentOutlined,
  CloudOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  RadarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Col, Divider, Row, Space, Table, Tag, Typography } from 'antd';
import '../../shared/styles/SystemSection.css';
const { Title, Paragraph, Text } = Typography;

const LocationSection = () => {
  // Function to handle drawing download
  const handleDownload = drawingCode => {
    const fileMapping = {
      'VTB-FC-M-302': 'VTB-FC-M-302- Layout of equipment on 1st FP-Layout1.pdf',
      'VTB-FC-M-303': 'VTB-FC-M-303- Layout of equipment on 2nd FP-Layout1.pdf',
      'VTB-FC-M-304': 'VTB-FC-M-304- Layout of equipment on 4th FP-Layout1.pdf',
      'VTB-FC-M-306': 'VTB-FC-M-306- Layout of equipment on ceiling 1st FP-Layout1.pdf',
      'VTB-FC-M-307': 'VTB-FC-M-307- Layout of equipment on ceiling 2nd FP-Layout1.pdf',
      'VTB-FC-M-501': 'VTB-FC-M-501 - Chiller water system for CRAC 1st FP-Layout1.pdf',
      'VTB-FC-M-502': 'VTB-FC-M-502 - Chiller water system for CRAC 2nd FP rev1-Layout1.pdf',
      'VTB-FC-M-503': 'VTB-FC-M-503 - Chiller water system for CRAC 3rd FP-Layout1.pdf',
      'VTB-FC-M-504': 'VTB-FC-M-504 - Chiller water system for CRAC 4th FP-Layout1.pdf',
      'VTB-FC-M-505': 'VTB-FC-M-505 - Chiller water system from TES water tank - Copy-Layout1.pdf',
    };

    const filename = fileMapping[drawingCode];
    if (filename) {
      const link = document.createElement('a');
      link.href = `/documents/hvac-drawings/${filename}`;
      link.download = filename;
      link.target = '_blank';
      link.click();
    }
  };

  // Equipment Location Data từ mechanical equipment list
  const equipmentLocationData = [
    {
      key: '1',
      equipment: 'Chiller CH-01,02,03',
      quantity: '3',
      location: 'Tầng thượng',
      model: 'Máy làm lạnh nước giải nhiệt không khí',
      capacity: '632kW (180RT)',
      power: '194.6kW',
      notes: '2 chạy, 1 dự phòng, điều khiển VFD',
    },
    {
      key: '2',
      equipment: 'Pump P-01,02,03',
      quantity: '3',
      location: 'Tầng thượng',
      model: 'Bơm nước lạnh',
      capacity: '25.3 L/s, 40mH2O',
      power: '22kW',
      notes: '2 chạy, 1 dự phòng, VSD',
    },
    {
      key: '3',
      equipment: 'CRAC-DCH-01~08',
      quantity: '8',
      location: 'Tầng 2 - DC Hall',
      model: 'CRAC nước lạnh',
      capacity: '102.8kW',
      power: '8kW',
      notes: 'N+2, Thổi xuống, 4 máy tăng ẩm',
    },
    {
      key: '4',
      equipment: 'INROW-DCH-01~06',
      quantity: '6',
      location: 'Tầng 2 - DC Hall',
      model: 'Đơn vị InRow nước lạnh',
      capacity: '21.6kW (7RT)',
      power: '1.5kW',
      notes: 'N+1',
    },
    {
      key: '5',
      equipment: 'CRAC-ER.A-01,02',
      quantity: '2',
      location: 'Tầng 1 - Phòng điện A',
      model: 'CRAC nước lạnh',
      capacity: '64.4kW (18RT)',
      power: '3kW',
      notes: 'N+N, Thổi xuống',
    },
    {
      key: '6',
      equipment: 'CRAC-ER.B-01,02',
      quantity: '2',
      location: 'Tầng 1 - Phòng điện B',
      model: 'CRAC nước lạnh',
      capacity: '79.8kW (23RT)',
      power: '15kW',
      notes: 'N+N, Thổi xuống',
    },
    {
      key: '7',
      equipment: 'CRAC-BR.A-01,02',
      quantity: '2',
      location: 'Tầng 1 - Phòng ắc quy A',
      model: 'CRAC nước lạnh',
      capacity: '9.5kW (3RT)',
      power: '2kW',
      notes: 'N+N, Thổi xuống',
    },
    {
      key: '8',
      equipment: 'CRAC-BR.B-01,02',
      quantity: '2',
      location: 'Tầng 1 - Phòng ắc quy B',
      model: 'CRAC nước lạnh',
      capacity: '15.6kW (5RT)',
      power: '3kW',
      notes: 'N+N, Thổi xuống',
    },
  ];

  // Chilled Water System Layout
  const chilledWaterSystemData = [
    {
      key: '1',
      system: 'CRAC Tầng 1',
      drawing: 'VTB-FC-M-501',
      description: 'Hệ thống nước lạnh cho CRAC tầng 1',
      equipment: 'DC Hall, Phòng điện, Phòng ắc quy',
      scale: '1/125',
    },
    {
      key: '2',
      system: 'CRAC Tầng 2',
      drawing: 'VTB-FC-M-502',
      description: 'Hệ thống nước lạnh cho CRAC tầng 2',
      equipment: 'Hub Rooms, Thư viện bang',
      scale: '1/125',
    },
    {
      key: '3',
      system: 'CRAC Tầng 3',
      drawing: 'VTB-FC-M-503',
      description: 'Hệ thống nước lạnh cho CRAC tầng 3',
      equipment: 'Khu vực văn phòng',
      scale: '1/125',
    },
    {
      key: '4',
      system: 'CRAC Tầng 4',
      drawing: 'VTB-FC-M-504',
      description: 'Hệ thống nước lạnh cho CRAC tầng 4',
      equipment: 'Khu vực kỹ thuật',
      scale: '1/125',
    },
    {
      key: '5',
      system: 'Bể TES',
      drawing: 'VTB-FC-M-505',
      description: 'Hệ thống nước lạnh từ bể TES',
      equipment: 'Kết nối bể TES với hệ thống chính',
      scale: '1/50',
    },
  ];

  return (
    <div id='section-4' className='content-section'>
      <Title level={2}>
        <EnvironmentOutlined style={{ marginRight: '12px' }} />
        4. VỊ TRÍ HỆ THỐNG - TTDL Vân Canh
      </Title>

      <Alert
        message='Thông tin từ bản vẽ kỹ thuật chính thức'
        description='Dữ liệu vị trí thiết bị được trích xuất từ 29 bản vẽ HVAC chính thức của TTDL Vân Canh, bao gồm layout, schematic và as-built drawings.'
        type='info'
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <div id='section-4-1' className='subsection'>
        <Card>
          <Title level={3} className='subsection-title'>
            <ApartmentOutlined style={{ marginRight: '8px' }} />
            4.1. Sơ đồ bố trí tổng thể
          </Title>

          <Alert
            message='Bản vẽ tổng thể TTDL Vân Canh'
            description='Hệ thống làm mát được phân bố trên 4 tầng với thiết bị chính tại Terrace Floor'
            type='success'
            showIcon
            style={{ marginBottom: '20px' }}
          />
          {/* <div style={{ marginBottom: '20px', alignItems: 'center' }}> 
  <HVACSystemDiagram /></div> */}

          {/* <Tabs
            defaultActiveKey="1"
            style={{ marginTop: '20px' }}
            items={[
              {
                key: '1',
                label: 'Mặt bằng tầng',
                children: (
                  <Table
                    dataSource={floorPlansData}u
                    columns={[
                      {
                        title: 'Tầng',
                        dataIndex: 'floor',
                        key: 'floor',
                        width: '15%',
                        render: (text) => <Tag color="blue">{text}</Tag>
                      },
                      {
                        title: 'Mã bản vẽ',
                        dataIndex: 'drawing',
                        key: 'drawing',
                        width: '15%',
                        render: (text) => <Text code>{text}</Text>
                      },
                      {
                        title: 'Mô tả',
                        dataIndex: 'description',
                        key: 'description',
                        width: '30%'
                      },
                      {
                        title: 'Thiết bị chính',
                        dataIndex: 'equipment',
                        key: 'equipment',
                        width: '30%',
                        render: (equipment) => (
                          <div>
                            {equipment.map((item, index) => (
                              <Tag key={index} color="green" style={{ marginBottom: '4px' }}>
                                {item}
                              </Tag>
                            ))}
                          </div>
                        )
                      },
                      {
                        title: 'Tỷ lệ',
                        dataIndex: 'scale',
                        key: 'scale',
                        width: '8%',
                        render: (text) => <Tag color="orange">{text}</Tag>
                      },
                      {
                        title: 'Tải bản vẽ',
                        dataIndex: 'drawing',
                        key: 'download',
                        width: '12%',
                        render: (drawingCode) => (
                          <Button
                            type="primary"
                            size="small"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(drawingCode)}
                            title={`Tải ${drawingCode}.pdf`}
                          >
                            PDF
                          </Button>
                        )
                      }
                    ]}
                    pagination={false}
                    size="small"
                    bordered
                  />
                )
              },
              {
                key: '2',
                label: 'Tổng quan hệ thống',
                children: (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Card title="Tầng thượng - Thiết bị chính" size="small">
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', color: '#1890ff' }}>❄️</div>
                            <Text strong>3x CHILLER</Text>
                            <br />
                            <Text type="secondary">CH-01,02,03</Text>
                            <br />
                            <Tag color="blue">632kW each</Tag>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', color: '#52c41a' }}>🌊</div>
                            <Text strong>3x PUMP</Text>
                            <br />
                            <Text type="secondary">P-01,02,03</Text>
                            <br />
                            <Tag color="green">25.3 L/s each</Tag>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', color: '#faad14' }}>🏭</div>
                            <Text strong>1x PAU</Text>
                            <br />
                            <Text type="secondary">PAU-01</Text>
                            <br />
                            <Tag color="gold">850 L/s</Tag>
                          </div>
                        </Col>
                      </Row>
                    </Card>

                    <Card title="Tầng 1 - DC Hall & Phòng hỗ trợ" size="small">
                      <Row gutter={[16, 16]}>
                        <Col span={6}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '36px', color: '#1890ff' }}>🏢</div>
                            <Text strong>8x CRAC-DCH</Text>
                            <br />
                            <Text type="secondary">DC Hall</Text>
                            <br />
                            <Tag color="blue">102.8kW each</Tag>
                          </div>
                        </Col>
                        <Col span={6}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '36px', color: '#52c41a' }}>📦</div>
                            <Text strong>6x INROW</Text>
                            <br />
                            <Text type="secondary">DC Hall</Text>
                            <br />
                            <Tag color="green">21.6kW each</Tag>
                          </div>
                        </Col>
                        <Col span={6}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '36px', color: '#faad14' }}>⚡</div>
                            <Text strong>4x CRAC-ER</Text>
                            <br />
                            <Text type="secondary">Phòng điện</Text>
                            <br />
                            <Tag color="gold">64.4-79.8kW</Tag>
                          </div>
                        </Col>
                        <Col span={6}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '36px', color: '#f5222d' }}>🔋</div>
                            <Text strong>4x CRAC-BR</Text>
                            <br />
                            <Text type="secondary">Phòng ắc quy</Text>
                            <br />
                            <Tag color="red">9.5-15.6kW</Tag>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Space>
                )
              }
            ]}
          /> */}
        </Card>
      </div>

      <Divider />

      <div id='section-4-2' className='subsection'>
        <Card>
          <Title level={3}>
            <SettingOutlined style={{ marginRight: '8px' }} />
            4.2. Vị trí các thiết bị chính
          </Title>

          <Table
            dataSource={equipmentLocationData}
            columns={[
              {
                title: 'Thiết bị',
                dataIndex: 'equipment',
                key: 'equipment',
                width: '20%',
                render: text => <Text strong>{text}</Text>,
              },
              {
                title: 'SL',
                dataIndex: 'quantity',
                key: 'quantity',
                width: '8%',
                render: text => <Tag color='blue'>{text}</Tag>,
              },
              {
                title: 'Vị trí',
                dataIndex: 'location',
                key: 'location',
                width: '20%',
                render: text => <Text type='success'>{text}</Text>,
              },
              {
                title: 'Model',
                dataIndex: 'model',
                key: 'model',
                width: '15%',
              },
              {
                title: 'Công suất',
                dataIndex: 'capacity',
                key: 'capacity',
                width: '15%',
                render: text => <Tag color='green'>{text}</Tag>,
              },
              {
                title: 'Điện',
                dataIndex: 'power',
                key: 'power',
                width: '10%',
                render: text => <Tag color='orange'>{text}</Tag>,
              },
              {
                title: 'Ghi chú',
                dataIndex: 'notes',
                key: 'notes',
                width: '12%',
                render: text => <Text type='secondary'>{text}</Text>,
              },
            ]}
            pagination={false}
            size='small'
            bordered
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>

      <Divider />

      <div id='section-4-3' className='subsection'>
        <Card>
          <Title level={3}>
            <RadarChartOutlined style={{ marginRight: '8px' }} />
            4.3. Đường ống và hệ thống phân phối
          </Title>

          <Alert
            message='Hệ thống nước lạnh phân tầng'
            description='Hệ thống nước lạnh được phân phối từ Terrace Floor xuống các tầng thông qua 5 schematic chính'
            type='info'
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Table
            dataSource={chilledWaterSystemData}
            columns={[
              {
                title: 'Hệ thống',
                dataIndex: 'system',
                key: 'system',
                width: '20%',
                render: text => <Text strong>{text}</Text>,
              },
              {
                title: 'Bản vẽ',
                dataIndex: 'drawing',
                key: 'drawing',
                width: '15%',
                render: text => <Text code>{text}</Text>,
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '35%',
              },
              {
                title: 'Khu vực phục vụ',
                dataIndex: 'equipment',
                key: 'equipment',
                width: '25%',
                render: text => <Tag color='cyan'>{text}</Tag>,
              },
              {
                title: 'Tỷ lệ',
                dataIndex: 'scale',
                key: 'scale',
                width: '5%',
                render: text => <Tag color='purple'>{text}</Tag>,
              },
              {
                title: 'Tải bản vẽ',
                dataIndex: 'drawing',
                key: 'download',
                width: '10%',
                render: drawingCode => (
                  <Button
                    type='primary'
                    size='small'
                    icon={<DownloadOutlined />}
                    className='download-button'
                    onClick={() => handleDownload(drawingCode)}
                    title={`Tải ${drawingCode}.pdf`}
                  >
                    PDF
                  </Button>
                ),
              },
            ]}
            pagination={false}
            size='small'
            bordered
          />

          <div className='system-features'>
            <Title level={4} className='feature-title'>
              Đặc điểm hệ thống đường ống:
            </Title>
            <Space direction='vertical' size='small'>
              <Text>
                • <strong>Cấp chính:</strong> Từ tầng thượng (Chiller + Pump) xuống các tầng
              </Text>
              <Text>
                • <strong>Tích hợp TES:</strong> Bản vẽ VTB-FC-M-505 cho kết nối bể TES
              </Text>
              <Text>
                • <strong>Phân phối theo tầng:</strong> Mỗi tầng có sơ đồ riêng (VTB-FC-M-501~504)
              </Text>
              <Text>
                • <strong>Kích thước ống:</strong> Chính DN150, Nhánh DN80-DN100, Đầu cuối DN50
              </Text>
              <Text>
                • <strong>Lưu lượng:</strong> Tổng 75.9 L/s (3 bơm × 25.3 L/s)
              </Text>
              <Text>
                • <strong>Áp suất:</strong> Áp suất thiết kế 40mH2O
              </Text>
            </Space>
          </div>
        </Card>
      </div>

      <Divider />

      <div id='section-4-4' className='subsection'>
        <Card>
          <Title level={3}>
            <CloudOutlined style={{ marginRight: '8px' }} />
            4.4. Hệ thống thông gió và hút khói
          </Title>

          <Alert
            message='Hệ thống thông gió HVAC'
            description='Hệ thống thông gió và hút khói được thiết kế để đảm bảo chất lượng không khí và an toàn phòng cháy chữa cháy'
            type='success'
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card size='small' title='Hệ thống thông gió'>
                <div className='feature-content'>
                  <Text strong>Thiết bị chính:</Text>
                  <ul>
                    <li>PAU-01: 850 L/s (Tầng thượng)</li>
                    <li>Quạt hút khói khẩn cấp</li>
                    <li>Hệ thống ống gió phân phối</li>
                    <li>Van điều hòa và điều khiển</li>
                  </ul>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card size='small' title='Hệ thống hút khói'>
                <div className='feature-content'>
                  <Text strong>Chức năng:</Text>
                  <ul>
                    <li>Hút khói khi có cháy</li>
                    <li>Thông gió khẩn cấp</li>
                    <li>Kiểm soát áp suất phòng</li>
                    <li>Tích hợp với hệ thống PCCC</li>
                  </ul>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default LocationSection;
