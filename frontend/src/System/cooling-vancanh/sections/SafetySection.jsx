import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SafetyOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Alert, Card, Col, Divider, Row, Steps, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const SafetySection = () => {
  // Biện pháp an toàn vận hành
  const safetyMeasures = [
    {
      category: 'An toàn điện',
      measures: [
        {
          title: 'Kiểm tra nguồn điện',
          description: 'Đảm bảo nguồn điện ổn định trước khi khởi động hệ thống',
          procedure: 'Kiểm tra điện áp, tần số và trạng thái các thiết bị bảo vệ',
          frequency: 'Trước mỗi lần khởi động',
        },
        {
          title: 'Bảo vệ quá tải',
          description: 'Hệ thống tự động bảo vệ khi có quá tải hoặc sự cố điện',
          procedure: 'Kiểm tra các thiết bị bảo vệ và cài đặt thông số an toàn',
          frequency: 'Định kỳ hàng tháng',
        },
        {
          title: 'Nối đất an toàn',
          description: 'Đảm bảo tất cả thiết bị được nối đất đúng quy định',
          procedure: 'Kiểm tra điện trở nối đất và kết nối dây nối đất',
          frequency: 'Định kỳ hàng quý',
        },
      ],
    },
    {
      category: 'An toàn cơ khí',
      measures: [
        {
          title: 'Bảo vệ chuyển động',
          description: 'Các bộ phận chuyển động phải có bảo vệ an toàn',
          procedure: 'Kiểm tra tình trạng các bảo vệ và khóa liên động',
          frequency: 'Trước mỗi lần vận hành',
        },
        {
          title: 'Áp suất an toàn',
          description: 'Đảm bảo áp suất hệ thống trong giới hạn cho phép',
          procedure: 'Kiểm tra van an toàn và cảm biến áp suất',
          frequency: 'Liên tục trong quá trình vận hành',
        },
        {
          title: 'Nhiệt độ an toàn',
          description: 'Giám sát nhiệt độ các thiết bị để tránh quá nhiệt',
          procedure: 'Kiểm tra cảm biến nhiệt độ và hệ thống báo động',
          frequency: 'Liên tục trong quá trình vận hành',
        },
      ],
    },
    {
      category: 'An toàn hóa chất',
      measures: [
        {
          title: 'Xử lý nước làm mát',
          description: 'Đảm bảo chất lượng nước và hóa chất xử lý',
          procedure: 'Kiểm tra pH, độ cứng và nồng độ hóa chất',
          frequency: 'Định kỳ hàng tuần',
        },
        {
          title: 'Bảo vệ môi trường',
          description: 'Xử lý an toàn nước thải và hóa chất thải',
          procedure: 'Thu gom và xử lý theo quy định môi trường',
          frequency: 'Theo quy định',
        },
      ],
    },
  ];

  // Quy trình bảo trì thiết bị
  const maintenanceProcedures = [
    {
      equipment: 'Chiller SMARDT',
      maintenance: [
        {
          type: 'Bảo trì hàng ngày',
          tasks: [
            'Kiểm tra nhiệt độ nước cấp và hồi',
            'Kiểm tra áp suất hệ thống',
            'Kiểm tra hoạt động của bơm nước',
            'Ghi chép các thông số vận hành',
          ],
          frequency: 'Hàng ngày',
          duration: '30 phút',
        },
        {
          type: 'Bảo trì hàng tuần',
          tasks: [
            'Kiểm tra tình trạng dàn ngưng',
            'Vệ sinh bộ lọc không khí',
            'Kiểm tra mức dầu và chất lỏng',
            'Kiểm tra các kết nối điện',
          ],
          frequency: 'Hàng tuần',
          duration: '2 giờ',
        },
        {
          type: 'Bảo trì hàng tháng',
          tasks: [
            'Kiểm tra và bảo dưỡng van',
            'Kiểm tra hệ thống điều khiển',
            'Vệ sinh bên trong thiết bị',
            'Kiểm tra hiệu suất làm mát',
          ],
          frequency: 'Hàng tháng',
          duration: '4 giờ',
        },
        {
          type: 'Bảo trì hàng quý',
          tasks: [
            'Kiểm tra toàn diện hệ thống',
            'Thay thế bộ lọc và phụ tùng',
            'Kiểm tra và hiệu chỉnh cảm biến',
            'Bảo dưỡng động cơ và máy nén',
          ],
          frequency: 'Hàng quý',
          duration: '8 giờ',
        },
      ],
    },
    {
      equipment: 'Hệ thống bơm nước',
      maintenance: [
        {
          type: 'Bảo trì hàng ngày',
          tasks: [
            'Kiểm tra áp suất và lưu lượng',
            'Kiểm tra nhiệt độ bơm',
            'Kiểm tra rung động và tiếng ồn',
            'Ghi chép thông số vận hành',
          ],
          frequency: 'Hàng ngày',
          duration: '20 phút',
        },
        {
          type: 'Bảo trì hàng tuần',
          tasks: [
            'Kiểm tra tình trạng cơ khí',
            'Kiểm tra kết nối đường ống',
            'Vệ sinh bộ lọc nước',
            'Kiểm tra hệ thống điều khiển VFD',
          ],
          frequency: 'Hàng tuần',
          duration: '1.5 giờ',
        },
        {
          type: 'Bảo trì hàng tháng',
          tasks: [
            'Kiểm tra và bảo dưỡng ổ trục',
            'Kiểm tra độ mòn cánh bơm',
            'Kiểm tra hệ thống làm mát',
            'Hiệu chỉnh thông số vận hành',
          ],
          frequency: 'Hàng tháng',
          duration: '3 giờ',
        },
      ],
    },
    {
      equipment: 'Hệ thống PAC UNIFLAIR',
      maintenance: [
        {
          type: 'Bảo trì hàng ngày',
          tasks: [
            'Kiểm tra nhiệt độ và độ ẩm phòng',
            'Kiểm tra hoạt động của quạt',
            'Kiểm tra tình trạng bộ lọc không khí',
            'Ghi chép thông số vận hành',
          ],
          frequency: 'Hàng ngày',
          duration: '15 phút',
        },
        {
          type: 'Bảo trì hàng tuần',
          tasks: [
            'Vệ sinh bộ lọc không khí',
            'Kiểm tra hệ thống thoát nước',
            'Kiểm tra kết nối đường ống nước',
            'Kiểm tra hệ thống điều khiển',
          ],
          frequency: 'Hàng tuần',
          duration: '1 giờ',
        },
        {
          type: 'Bảo trì hàng tháng',
          tasks: [
            'Vệ sinh bên trong thiết bị',
            'Kiểm tra và bảo dưỡng quạt',
            'Kiểm tra hiệu suất trao đổi nhiệt',
            'Hiệu chỉnh thông số điều khiển',
          ],
          frequency: 'Hàng tháng',
          duration: '2 giờ',
        },
      ],
    },
  ];

  // Xử lý mã lỗi và sự cố
  const errorHandling = [
    {
      error: 'E001 - Nhiệt độ nước cao',
      description: 'Nhiệt độ nước cấp vượt quá giới hạn cho phép',
      causes: [
        'Chiller hoạt động quá tải',
        'Bơm nước không hoạt động đúng',
        'Bộ lọc nước bị tắc',
        'Van điều khiển bị lỗi',
      ],
      solutions: [
        'Kiểm tra tải nhiệt và điều chỉnh Chiller',
        'Kiểm tra hoạt động của bơm nước',
        'Vệ sinh hoặc thay thế bộ lọc',
        'Kiểm tra và sửa chữa van điều khiển',
      ],
      prevention: 'Bảo trì định kỳ hệ thống lọc và kiểm tra van',
    },
    {
      error: 'E002 - Áp suất thấp',
      description: 'Áp suất nước trong hệ thống thấp hơn mức tối thiểu',
      causes: [
        'Bơm nước không hoạt động',
        'Rò rỉ trong hệ thống đường ống',
        'Van bypass mở quá lớn',
        'Bộ lọc bị tắc',
      ],
      solutions: [
        'Kiểm tra và khởi động lại bơm nước',
        'Tìm và sửa chữa điểm rò rỉ',
        'Điều chỉnh van bypass',
        'Vệ sinh hoặc thay thế bộ lọc',
      ],
      prevention: 'Kiểm tra định kỳ hệ thống đường ống và van',
    },
    {
      error: 'E003 - Lỗi động cơ',
      description: 'Động cơ bơm hoặc quạt bị lỗi hoặc quá nhiệt',
      causes: [
        'Quá tải cơ học',
        'Vấn đề về điện (điện áp, dòng điện)',
        'Bảo trì không đúng định kỳ',
        'Môi trường vận hành khắc nghiệt',
      ],
      solutions: [
        'Kiểm tra và giảm tải cơ học',
        'Kiểm tra nguồn điện và bảo vệ',
        'Thực hiện bảo trì định kỳ',
        'Cải thiện điều kiện môi trường',
      ],
      prevention: 'Bảo trì định kỳ và kiểm tra điều kiện vận hành',
    },
    {
      error: 'E004 - Lỗi hệ thống điều khiển',
      description: 'Hệ thống BMS hoặc điều khiển cục bộ bị lỗi',
      causes: [
        'Lỗi phần mềm hoặc firmware',
        'Vấn đề về kết nối mạng',
        'Cảm biến bị lỗi',
        'Nguồn điện điều khiển không ổn định',
      ],
      solutions: [
        'Khởi động lại hệ thống điều khiển',
        'Kiểm tra kết nối mạng và cáp',
        'Kiểm tra và thay thế cảm biến',
        'Kiểm tra nguồn điện điều khiển',
      ],
      prevention: 'Cập nhật phần mềm định kỳ và kiểm tra hệ thống',
    },
  ];

  // Kiểm tra và kiểm định
  const inspectionProcedures = [
    {
      type: 'Kiểm tra hàng ngày',
      items: [
        'Kiểm tra nhiệt độ và áp suất hệ thống',
        'Kiểm tra hoạt động của các thiết bị chính',
        'Ghi chép thông số vận hành',
        'Kiểm tra báo động và cảnh báo',
      ],
      responsible: 'Nhân viên vận hành',
      duration: '30-60 phút',
    },
    {
      type: 'Kiểm tra hàng tuần',
      items: [
        'Kiểm tra tình trạng cơ khí tổng thể',
        'Kiểm tra hệ thống bảo vệ',
        'Kiểm tra chất lượng nước',
        'Kiểm tra hiệu suất làm mát',
      ],
      responsible: 'Kỹ thuật viên',
      duration: '2-3 giờ',
    },
    {
      type: 'Kiểm tra hàng tháng',
      items: [
        'Kiểm tra toàn diện hệ thống',
        'Kiểm tra và hiệu chỉnh cảm biến',
        'Kiểm tra hệ thống an toàn',
        'Đánh giá hiệu suất tổng thể',
      ],
      responsible: 'Kỹ sư kỹ thuật',
      duration: '4-6 giờ',
    },
    {
      type: 'Kiểm định hàng năm',
      items: [
        'Kiểm định thiết bị đo lường',
        'Kiểm tra tuân thủ tiêu chuẩn',
        'Đánh giá hiệu suất năng lượng',
        'Lập kế hoạch bảo trì dài hạn',
      ],
      responsible: 'Đơn vị kiểm định',
      duration: '1-2 ngày',
    },
  ];

  return (
    <div id='section-6' className='content-section'>
      <Title level={2}>
        <SafetyOutlined style={{ marginRight: '12px' }} />
        6. An toàn & Bảo trì hệ thống làm mát
      </Title>

      <Alert
        message='An toàn là ưu tiên hàng đầu'
        description='TTDL Vân Canh tuân thủ nghiêm ngặt các quy định về an toàn vận hành và bảo trì hệ thống làm mát, đảm bảo môi trường làm việc an toàn và thiết bị hoạt động ổn định.'
        type='warning'
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* Biện pháp an toàn vận hành */}
      <div id='section-6-1' className='subsection'>
        <Title level={3}>
          <SafetyOutlined style={{ marginRight: '12px' }} />
          6.1. Biện pháp an toàn vận hành
        </Title>
        <Card>
          {safetyMeasures.map((category, catIndex) => (
            <div key={catIndex} style={{ marginBottom: '24px' }}>
              <Title level={4}>{category.category}</Title>
              <Row gutter={[16, 16]}>
                {category.measures.map((measure, measureIndex) => (
                  <Col xs={24} lg={8} key={measureIndex}>
                    <Card size='small' style={{ height: '100%' }}>
                      <Title level={4} className='success-title'>
                        {measure.title}
                      </Title>
                      <Paragraph style={{ marginBottom: '8px' }}>
                        <Text strong>Mô tả:</Text> {measure.description}
                      </Paragraph>
                      <Paragraph style={{ marginBottom: '8px' }}>
                        <Text strong>Quy trình:</Text> {measure.procedure}
                      </Paragraph>
                      <Paragraph style={{ marginBottom: '0' }}>
                        <Text strong>Tần suất:</Text> {measure.frequency}
                      </Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
              {catIndex < safetyMeasures.length - 1 && <Divider />}
            </div>
          ))}
        </Card>
      </div>

      {/* Quy trình bảo trì thiết bị */}
      <div id='section-6-2' className='subsection'>
        <Title level={3}>
          <ToolOutlined style={{ marginRight: '12px' }} />
          6.2. Quy trình bảo trì thiết bị
        </Title>
        <Card>
          {maintenanceProcedures.map((equipment, equipIndex) => (
            <div key={equipIndex} style={{ marginBottom: '24px' }}>
              <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
                {equipment.equipment}
              </Title>
              <Row gutter={[16, 16]}>
                {equipment.maintenance.map((maintenance, maintIndex) => (
                  <Col xs={24} lg={6} key={maintIndex}>
                    <Card size='small' style={{ height: '100%' }}>
                      <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
                        {maintenance.type}
                      </Title>
                      <div style={{ marginBottom: '12px' }}>
                        <Text strong>Công việc:</Text>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                          {maintenance.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} style={{ marginBottom: '4px' }}>
                              <Text>{task}</Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Paragraph style={{ marginBottom: '8px' }}>
                        <Text strong>Tần suất:</Text> {maintenance.frequency}
                      </Paragraph>
                      <Paragraph style={{ marginBottom: '0' }}>
                        <Text strong>Thời gian:</Text> {maintenance.duration}
                      </Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
              {equipIndex < maintenanceProcedures.length - 1 && <Divider />}
            </div>
          ))}
        </Card>
      </div>

      {/* Xử lý mã lỗi và sự cố */}
      <div id='section-6-3' className='subsection'>
        <Title level={3}>
          <ExclamationCircleOutlined style={{ marginRight: '12px' }} />
          6.3. Xử lý mã lỗi và sự cố
        </Title>
        <Card>
          <Row gutter={[16, 16]}>
            {errorHandling.map((error, index) => (
              <Col xs={24} lg={12} key={index}>
                <Card size='small' style={{ height: '100%' }}>
                  <Title level={4} style={{ color: '#fa8c16', marginBottom: '12px' }}>
                    {error.error}
                  </Title>
                  <Paragraph style={{ marginBottom: '8px' }}>
                    <Text strong>Mô tả:</Text> {error.description}
                  </Paragraph>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Nguyên nhân:</Text>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      {error.causes.map((cause, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>
                          <Text>{cause}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Giải pháp:</Text>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      {error.solutions.map((solution, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>
                          <Text>{solution}</Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Paragraph style={{ marginBottom: '0' }}>
                    <Text strong>Phòng ngừa:</Text> {error.prevention}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </div>

      {/* Kiểm tra và kiểm định */}
      <div id='section-6-4' className='subsection'>
        <Title level={3}>
          <CheckCircleOutlined style={{ marginRight: '12px' }} />
          6.4. Kiểm tra và kiểm định
        </Title>

        <Row gutter={[16, 16]}>
          {inspectionProcedures.map((inspection, index) => (
            <Col xs={24} lg={6} key={index}>
              <Card size='small' style={{ height: '100%' }}>
                <Title level={4} style={{ color: '#722ed1', marginBottom: '12px' }}>
                  {inspection.type}
                </Title>
                <div style={{ marginBottom: '12px' }}>
                  <Text strong>Nội dung:</Text>
                  <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                    {inspection.items.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        <Text>{item}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
                <Paragraph style={{ marginBottom: '8px' }}>
                  <Text strong>Người thực hiện:</Text> {inspection.responsible}
                </Paragraph>
                <Paragraph style={{ marginBottom: '0' }}>
                  <Text strong>Thời gian:</Text> {inspection.duration}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Thông tin bổ sung */}
      <div id='section-6-5' className='subsection'>
        <Title level={3}>
          <InfoCircleOutlined style={{ marginRight: '12px' }} />
          6.5. Thông tin bổ sung
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Alert
              message='Bảo trì phòng ngừa'
              description='Thực hiện bảo trì định kỳ theo lịch trình để ngăn chặn sự cố và duy trì hiệu suất tối ưu của hệ thống.'
              type='success'
              showIcon
            />
          </Col>
          <Col xs={24} lg={12}>
            <Alert
              message='An toàn vận hành'
              description='Tuân thủ nghiêm ngặt các quy trình an toàn và sử dụng đầy đủ thiết bị bảo hộ khi thực hiện bảo trì.'
              type='warning'
              showIcon
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SafetySection;
