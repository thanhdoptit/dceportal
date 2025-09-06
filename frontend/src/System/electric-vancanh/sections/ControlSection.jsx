import { SettingOutlined, SyncOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider, Progress, Row, Steps, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const ControlSection = () => {
  const [currentCapacitorStep, setCurrentCapacitorStep] = React.useState(0);
  const [currentInverterStep, setCurrentInverterStep] = React.useState(0);
  const [currentContactorStep, setCurrentContactorStep] = React.useState(0);

  const capacitorSteps = [
    'Kiểm tra tụ bù',
    'Kiểm tra bộ điều khiển',
    'Kiểm tra contactor',
    'Kiểm tra hệ thống bảo vệ',
    'Kiểm tra hiệu suất bù',
  ];

  const inverterSteps = [
    'Kiểm tra biến tần',
    'Kiểm tra cài đặt thông số',
    'Kiểm tra nhiệt độ hoạt động',
    'Kiểm tra hệ thống làm mát',
    'Kiểm tra hiệu suất vận hành',
  ];

  const contactorSteps = [
    'Kiểm tra contactor',
    'Kiểm tra tiếp điểm',
    'Kiểm tra cuộn dây',
    'Kiểm tra hệ thống điều khiển',
    'Kiểm tra bảo vệ nhiệt',
  ];

  return (
    <div className='content-section'>
      <Title level={2} id='section-4' className='ant-typography'>
        4. HỆ THỐNG ĐIỀU KHIỂN
      </Title>

      <div id='section-4-1' className='subsection'>
        <Title level={3} className='ant-typography'>
          4.1. Tụ bù khô & bộ điều khiển
        </Title>

        <div id='4.1.1' className='subsection'>
          <Title level={4} className='ant-typography'>
            4.1.1. Thông số kỹ thuật
          </Title>
          <Card>
            <Alert
              message='Hệ thống bù công suất phản kháng'
              description='Tự động bù công suất phản kháng để nâng cao hệ số công suất và giảm tổn thất điện năng'
              type='info'
              showIcon
              style={{ marginBottom: '16px' }}
            />

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size='small' title='Thông số tụ bù' className='card-blue'>
                  <ul>
                    <li>
                      <Text strong>Điện áp:</Text> 400V AC
                    </li>
                    <li>
                      <Text strong>Công suất:</Text> 25kVar
                    </li>
                    <li>
                      <Text strong>Số bước:</Text> 8 bước
                    </li>
                    <li>
                      <Text strong>Tổng công suất:</Text> 200kVar
                    </li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size='small' title='Bộ điều khiển' className='card-green'>
                  <ul>
                    <li>
                      <Text strong>Loại:</Text> Microprocessor
                    </li>
                    <li>
                      <Text strong>Hiển thị:</Text> LCD 2x16
                    </li>
                    <li>
                      <Text strong>Giao diện:</Text> RS485 Modbus
                    </li>
                    <li>
                      <Text strong>Bảo vệ:</Text> Quá áp, quá dòng
                    </li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id='4.1.2' className='subsection'>
          <Title level={4} className='ant-typography'>
            4.1.2. Cài đặt và điều chỉnh
          </Title>
          <Card>
            <Paragraph>Cài đặt và điều chỉnh hệ thống tụ bù:</Paragraph>

            <Card title='Quy trình cài đặt' style={{ marginBottom: '16px' }}>
              <Steps
                current={currentCapacitorStep}
                onChange={setCurrentCapacitorStep}
                direction='vertical'
                size='small'
                items={capacitorSteps.map(step => ({
                  title: step,
                  description: null,
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size='small' title='Cài đặt thông số' className='card-blue'>
                  <ul>
                    <li>
                      <Text strong>Hệ số công suất mục tiêu:</Text> 0.95
                    </li>
                    <li>
                      <Text strong>Thời gian delay:</Text> 30s
                    </li>
                    <li>
                      <Text strong>Ngưỡng quá áp:</Text> 110%
                    </li>
                    <li>
                      <Text strong>Ngưỡng quá dòng:</Text> 130%
                    </li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size='small' title='Điều chỉnh tự động' className='card-green'>
                  <ul>
                    <li>
                      <Text strong>Chế độ vận hành:</Text> Tự động
                    </li>
                    <li>
                      <Text strong>Bước tăng:</Text> 25kVar
                    </li>
                    <li>
                      <Text strong>Bước giảm:</Text> 25kVar
                    </li>
                    <li>
                      <Text strong>Thời gian chuyển:</Text> 5s
                    </li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <div id='section-4-2' className='subsection'>
        <Title level={3} className='ant-typography'>
          4.2. Biến tần
        </Title>

        <div id='4.2.1' className='subsection'>
          <Title level={4} className='ant-typography'>
            4.2.1. Đặc điểm kỹ thuật
          </Title>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size='small' title='Thông số điện' className='card-blue'>
                  <ul>
                    <li>
                      <Text strong>Điện áp đầu vào:</Text> 400V AC
                    </li>
                    <li>
                      <Text strong>Điện áp đầu ra:</Text> 0-400V AC
                    </li>
                    <li>
                      <Text strong>Công suất:</Text> 75kW
                    </li>
                    <li>
                      <Text strong>Tần số đầu ra:</Text> 0-400Hz
                    </li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size='small' title='Đặc tính điều khiển' className='card-green'>
                  <ul>
                    <li>
                      <Text strong>Phương pháp:</Text> V/F control
                    </li>
                    <li>
                      <Text strong>Độ chính xác:</Text> ±0.1%
                    </li>
                    <li>
                      <Text strong>Thời gian tăng tốc:</Text> 0.1-3000s
                    </li>
                    <li>
                      <Text strong>Thời gian giảm tốc:</Text> 0.1-3000s
                    </li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id='4.2.2' className='subsection'>
          <Title level={4} className='ant-typography'>
            4.2.2. Cài đặt thông số
          </Title>
          <Card>
            <Paragraph>Cài đặt các thông số cho biến tần:</Paragraph>

            <Card title='Quy trình cài đặt' style={{ marginBottom: '16px' }}>
              <Steps
                current={currentInverterStep}
                onChange={setCurrentInverterStep}
                direction='vertical'
                size='small'
                items={inverterSteps.map(step => ({
                  title: step,
                  description: null,
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size='small' title='Thông số cơ bản' className='card-blue'>
                  <ul>
                    <li>
                      <Text strong>Tần số định mức:</Text> 50Hz
                    </li>
                    <li>
                      <Text strong>Điện áp định mức:</Text> 400V
                    </li>
                    <li>
                      <Text strong>Dòng điện định mức:</Text> 150A
                    </li>
                    <li>
                      <Text strong>Công suất định mức:</Text> 75kW
                    </li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size='small' title='Thông số điều khiển' className='card-green'>
                  <ul>
                    <li>
                      <Text strong>Chế độ điều khiển:</Text> V/F
                    </li>
                    <li>
                      <Text strong>Thời gian tăng tốc:</Text> 10s
                    </li>
                    <li>
                      <Text strong>Thời gian giảm tốc:</Text> 10s
                    </li>
                    <li>
                      <Text strong>Chế độ vận hành:</Text> Tự động
                    </li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <div id='section-4-3' className='subsection'>
        <Title level={3} className='ant-typography'>
          4.3. Contactor cho tụ bù
        </Title>

        <div id='4.3.1' className='subsection'>
          <Title level={4} className='ant-typography'>
            4.3.1. Thông số kỹ thuật
          </Title>
          <Card>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size='small' title='Thông số điện' className='card-blue'>
                  <ul>
                    <li>
                      <Text strong>Điện áp định mức:</Text> 400V AC
                    </li>
                    <li>
                      <Text strong>Dòng điện định mức:</Text> 63A
                    </li>
                    <li>
                      <Text strong>Điện áp điều khiển:</Text> 24V DC
                    </li>
                    <li>
                      <Text strong>Công suất tiêu thụ:</Text> 8W
                    </li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size='small' title='Đặc tính cơ khí' className='card-green'>
                  <ul>
                    <li>
                      <Text strong>Số cực:</Text> 3 cực
                    </li>
                    <li>
                      <Text strong>Tiếp điểm phụ:</Text> 2NO + 2NC
                    </li>
                    <li>
                      <Text strong>Tuổi thọ cơ:</Text> 10 triệu lần
                    </li>
                    <li>
                      <Text strong>Tuổi thọ điện:</Text> 1 triệu lần
                    </li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>

        <div id='4.3.2' className='subsection'>
          <Title level={4} className='ant-typography'>
            4.3.2. Lắp đặt và kết nối
          </Title>
          <Card>
            <Paragraph>Quy trình lắp đặt contactor cho tụ bù:</Paragraph>

            <Card title='Quy trình lắp đặt' style={{ marginBottom: '16px' }}>
              <Steps
                current={currentContactorStep}
                onChange={setCurrentContactorStep}
                direction='vertical'
                size='small'
                items={contactorSteps.map(step => ({
                  title: step,
                  description: null,
                }))}
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size='small' title='Kết nối điện' className='card-blue'>
                  <ul>
                    <li>Kết nối nguồn 3 pha</li>
                    <li>Kết nối tải tụ bù</li>
                    <li>Kết nối mạch điều khiển</li>
                    <li>Kết nối tiếp điểm phụ</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size='small' title='Kiểm tra sau lắp đặt' className='card-green'>
                  <ul>
                    <li>Kiểm tra kết nối điện</li>
                    <li>Kiểm tra mạch điều khiển</li>
                    <li>Kiểm tra hoạt động đóng cắt</li>
                    <li>Kiểm tra tiếp điểm phụ</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <Divider />

      <Alert
        message='Lưu ý vận hành'
        description='Hệ thống điều khiển phải được kiểm tra định kỳ và bảo trì theo đúng quy trình. Đảm bảo tuân thủ các quy định an toàn khi thao tác với thiết bị điện.'
        type='info'
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card title='Trạng thái hệ thống điều khiển'>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <SettingOutlined
                style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }}
              />
              <div>Tụ bù</div>
              <Tag color='success'>Hoạt động bình thường</Tag>
              <Progress percent={85} size='small' style={{ marginTop: '8px' }} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <ThunderboltOutlined
                style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }}
              />
              <div>Biến tần</div>
              <Tag color='processing'>Đang vận hành</Tag>
              <Progress percent={92} size='small' style={{ marginTop: '8px' }} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <SyncOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }} />
              <div>Contactor</div>
              <Tag color='warning'>Cần bảo trì</Tag>
              <Progress percent={78} size='small' style={{ marginTop: '8px' }} />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ControlSection;
