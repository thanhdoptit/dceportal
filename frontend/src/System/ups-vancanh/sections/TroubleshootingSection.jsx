import { Alert, Card, Col, Collapse, Divider, Row, Steps, Table, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const TroubleshootingSection = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  // Các sự cố thường gặp từ tài liệu thực tế
  const commonIssues = [
    {
      category: 'Sự cố ắc quy',
      issues: [
        {
          symptom: 'Ắc quy không sạc',
          causes: [
            'Kết nối ắc quy bị lỏng hoặc hư hỏng',
            'Bộ sạc ắc quy bị lỗi',
            'Ắc quy bị hỏng hoặc hết tuổi thọ',
            'Nhiệt độ môi trường quá cao (>50°C)',
            'Điện áp ắc quy quá thấp'
          ],
          solutions: [
            'Kiểm tra kết nối ắc quy',
            'Kiểm tra bộ sạc và điện áp sạc',
            'Thay thế ắc quy nếu cần thiết',
            'Kiểm soát nhiệt độ môi trường',
            'Kiểm tra điện áp ắc quy'
          ],
          severity: 'high',
          icon: '🔋'
        },
        {
          symptom: 'Thời gian backup ngắn',
          causes: [
            'Ắc quy bị lão hóa',
            'Tải quá cao',
            'Nhiệt độ môi trường cao',
            'Ắc quy không được sạc đầy',
            'Kết nối ắc quy bị lỏng'
          ],
          solutions: [
            'Kiểm tra tuổi thọ ắc quy',
            'Giảm tải hoặc tăng dung lượng ắc quy',
            'Kiểm soát nhiệt độ môi trường',
            'Kiểm tra chu trình sạc',
            'Kiểm tra kết nối ắc quy'
          ],
          severity: 'medium',
          icon: '⏰'
        }
      ]
    },
    {
      category: 'Sự cố điện',
      issues: [
        {
          symptom: 'Điện áp đầu ra không ổn định',
          causes: [
            'Điện áp đầu vào không ổn định',
            'Bộ lọc điện bị lỗi',
            'Inverter bị lỗi',
            'Tải không cân bằng',
            'Cảm biến điện áp bị lỗi'
          ],
          solutions: [
            'Kiểm tra nguồn điện đầu vào',
            'Kiểm tra bộ lọc điện',
            'Kiểm tra inverter',
            'Cân bằng tải',
            'Kiểm tra cảm biến điện áp'
          ],
          severity: 'high',
          icon: '⚡'
        },
        {
          symptom: 'Tần số đầu ra không chính xác',
          causes: [
            'Bộ dao động tần số bị lỗi',
            'Inverter bị lỗi',
            'Cảm biến tần số bị lỗi',
            'Phần mềm điều khiển bị lỗi'
          ],
          solutions: [
            'Kiểm tra bộ dao động tần số',
            'Kiểm tra inverter',
            'Kiểm tra cảm biến tần số',
            'Cập nhật firmware'
          ],
          severity: 'medium',
          icon: '📊'
        }
      ]
    },
    {
      category: 'Sự cố mạng và truyền thông',
      issues: [
        {
          symptom: 'Không thể kết nối mạng',
          causes: [
            'Cấu hình IP không đúng',
            'Cáp mạng bị hư hỏng',
            'Switch/router bị lỗi',
            'Firewall chặn kết nối',
            'Cấu hình mạng không đúng'
          ],
          solutions: [
            'Kiểm tra cấu hình IP',
            'Kiểm tra cáp mạng',
            'Kiểm tra switch/router',
            'Kiểm tra cấu hình firewall',
            'Kiểm tra cấu hình mạng'
          ],
          severity: 'medium',
          icon: '🌐'
        },
        {
          symptom: 'Modbus communication lỗi',
          causes: [
            'Cấu hình Modbus không đúng',
            'Địa chỉ register không đúng',
            'Tốc độ baud không khớp',
            'Cấu hình master/slave sai',
            'Kết nối RS485 bị lỗi'
          ],
          solutions: [
            'Kiểm tra cấu hình Modbus',
            'Kiểm tra địa chỉ register',
            'Đồng bộ tốc độ baud',
            'Kiểm tra cấu hình master/slave',
            'Kiểm tra kết nối RS485'
          ],
          severity: 'medium',
          icon: '🔌'
        }
      ]
    }
  ];

  // Quy trình khắc phục sự cố
  const troubleshootingProcedure = [
    {
      title: 'Phân tích sự cố',
      description: 'Xác định chính xác vấn đề và mức độ nghiêm trọng',
      steps: [
        'Thu thập thông tin về sự cố',
        'Kiểm tra các chỉ báo LED và màn hình',
        'Xem xét log sự kiện và cảnh báo',
        'Xác định mức độ ảnh hưởng',
        'Phân loại sự cố theo mức độ ưu tiên'
      ],
      icon: '🔍'
    },
    {
      title: 'Các bước khắc phục',
      description: 'Thực hiện các biện pháp khắc phục theo thứ tự ưu tiên',
      steps: [
        'Thực hiện các biện pháp an toàn',
        'Kiểm tra các kết nối cơ bản',
        'Kiểm tra cấu hình hệ thống',
        'Thực hiện các test chẩn đoán',
        'Thay thế linh kiện nếu cần thiết'
      ],
      icon: '🔧'
    },
    {
      title: 'Kiểm tra sau khắc phục',
      description: 'Xác nhận sự cố đã được khắc phục hoàn toàn',
      steps: [
        'Kiểm tra trạng thái hệ thống',
        'Thực hiện test vận hành',
        'Kiểm tra các thông số hoạt động',
        'Ghi chép quá trình khắc phục',
        'Cập nhật tài liệu bảo trì'
      ],
      icon: '✅'
    }
  ];

  // Các test chẩn đoán
  const diagnosticTests = [
    {
      name: 'Runtime Calibration Test',
      description: 'Test hiệu chỉnh thời gian backup của ắc quy',
      procedure: [
        'Đảm bảo tải ổn định',
        'Khởi động test từ menu hệ thống',
        'Theo dõi quá trình test',
        'Ghi chép kết quả test',
        'Dừng test khi cần thiết'
      ],
      duration: '30-120 phút',
      frequency: 'Hàng tháng',
      icon: '⏱️'
    },
    {
      name: 'Battery Test',
      description: 'Test kiểm tra trạng thái và hiệu suất ắc quy',
      procedure: [
        'Kiểm tra trạng thái ắc quy',
        'Khởi động test từ menu hệ thống',
        'Theo dõi điện áp và dòng điện',
        'Ghi chép kết quả test',
        'Phân tích kết quả test'
      ],
      duration: '15-60 phút',
      frequency: 'Hàng tuần',
      icon: '🔋'
    },
    {
      name: 'Self-Test',
      description: 'Test tự động kiểm tra các thành phần hệ thống',
      procedure: [
        'Khởi động test từ menu hệ thống',
        'Theo dõi quá trình test',
        'Kiểm tra kết quả test',
        'Xử lý các lỗi nếu có',
        'Ghi chép kết quả test'
      ],
      duration: '5-15 phút',
      frequency: 'Hàng ngày',
      icon: '🧪'
    }
  ];

  // Các chỉ báo LED và trạng thái
  const statusIndicators = [
    {
      category: 'Power Module Status LEDs',
      indicators: [
        {
          name: 'Module Enable LED',
          colors: {
            'Green': 'Module đang hoạt động bình thường',
            'Red': 'Module bị lỗi hoặc tắt',
            'Yellow': 'Module đang khởi động hoặc bảo trì',
            'Off': 'Module bị tắt hoặc không có nguồn'
          }
        },
        {
          name: 'Power Flow LED',
          colors: {
            'Green': 'Dòng điện bình thường',
            'Red': 'Quá tải hoặc lỗi',
            'Yellow': 'Tải trung bình',
            'Off': 'Không có tải'
          }
        }
      ]
    },
    {
      category: 'System Status LEDs',
      indicators: [
        {
          name: 'UPS Status LED',
          colors: {
            'Green': 'UPS hoạt động bình thường',
            'Red': 'UPS bị lỗi hoặc tắt',
            'Yellow': 'UPS đang chuyển đổi chế độ',
            'Off': 'UPS bị tắt'
          }
        },
        {
          name: 'Battery Status LED',
          colors: {
            'Green': 'Ắc quy sạc đầy',
            'Red': 'Ắc quy yếu hoặc lỗi',
            'Yellow': 'Ắc quy đang sạc',
            'Off': 'Không có ắc quy'
          }
        }
      ]
    }
  ];

  // Các biện pháp phòng ngừa
  const preventiveMeasures = [
    {
      category: 'Bảo trì định kỳ',
      measures: [
        'Kiểm tra trực quan hàng ngày',
        'Vệ sinh thiết bị hàng tuần',
        'Kiểm tra kết nối hàng tháng',
        'Test hệ thống hàng quý',
        'Bảo trì toàn diện hàng năm'
      ]
    },
    {
      category: 'Giám sát liên tục',
      measures: [
        'Theo dõi thông số hoạt động',
        'Giám sát nhiệt độ môi trường',
        'Kiểm tra log sự kiện',
        'Theo dõi cảnh báo và báo động',
        'Phân tích xu hướng dữ liệu'
      ]
    },
    {
      category: 'Đào tạo nhân viên',
      measures: [
        'Đào tạo vận hành cơ bản',
        'Đào tạo xử lý sự cố',
        'Cập nhật kiến thức thường xuyên',
        'Thực hành các tình huống khẩn cấp',
        'Đánh giá năng lực định kỳ'
      ]
    }
  ];

  // Các lỗi thường gặp và mã lỗi
  const errorCodes = [
    {
      code: 'E001',
      description: 'Lỗi điện áp đầu vào quá thấp',
      severity: 'High',
      action: 'Kiểm tra nguồn điện đầu vào và cấu hình',
      icon: '⚠️'
    },
    {
      code: 'E002',
      description: 'Lỗi điện áp đầu ra quá cao',
      severity: 'High',
      action: 'Kiểm tra inverter và cảm biến điện áp',
      icon: '⚡'
    },
    {
      code: 'E003',
      description: 'Lỗi nhiệt độ quá cao',
      severity: 'Medium',
      action: 'Kiểm tra hệ thống làm mát và thông gió',
      icon: '🌡️'
    },
    {
      code: 'E004',
      description: 'Lỗi ắc quy yếu',
      severity: 'Medium',
      action: 'Kiểm tra trạng thái ắc quy và bộ sạc',
      icon: '🔋'
    },
    {
      code: 'E005',
      description: 'Lỗi kết nối mạng',
      severity: 'Low',
      action: 'Kiểm tra cáp mạng và cấu hình IP',
      icon: '🌐'
    }
  ];

  return (
    <div className="content-section">
      <Title level={2} id="section-6">
        6. XỬ LÝ SỰ CỐ & KHẮC PHỤC
      </Title>
      
      <Paragraph>
        Hệ thống UPS Galaxy VL được thiết kế với độ tin cậy cao, tuy nhiên trong quá trình vận hành vẫn có thể gặp phải một số sự cố. 
        Phần này cung cấp hướng dẫn chi tiết về cách nhận diện, phân tích và khắc phục các sự cố thường gặp.
      </Paragraph>

      <Alert
        message="Lưu ý quan trọng về an toàn"
        description="Khi xử lý sự cố, luôn ưu tiên an toàn. Chỉ nhân viên có trình độ mới được thực hiện các thao tác sửa chữa. Tuân thủ nghiêm ngặt các quy trình an toàn."
        type="warning"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      {/* 6.1 - Các sự cố thường gặp */}
      <div id="6.1" className="subsection">
        <Title level={3}>
          6.1. Các sự cố thường gặp
        </Title>
        <Card title="Phân loại sự cố theo nguyên nhân" style={{ marginBottom: '20px' }}>
        {commonIssues.map((category, index) => (
          <div key={index} id={`6.1.${index + 1}`} className="subsection">
            <Title level={4}>
              6.1.{index + 1}. {category.category}
            </Title>
            <Row gutter={[16, 16]}>
              {category.issues.map((issue, i) => (
                <Col xs={24} lg={12} key={i}>
                <Card 
                  size="small" 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{issue.icon}</span>
                        {issue.symptom}
                      </div>
                    }
                    style={{ 
                      height: '100%',
                      borderLeft: `4px solid ${issue.severity === 'high' ? '#ff4d4f' : 
                                           issue.severity === 'medium' ? '#fa8c16' : '#faad14'}`
                    }}
                  >
                    <div>
                      <Tag color={issue.severity === 'high' ? 'red' : 
                                 issue.severity === 'medium' ? 'orange' : 'yellow'}>
                        {issue.severity === 'high' ? 'Cao' : 
                         issue.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                      </Tag>
                    </div>
                    
                    <div>
                      <Text strong>Nguyên nhân:</Text>
                      <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                        {issue.causes.map((cause, j) => (
                          <li key={j}>{cause}</li>
                        ))}
                      </ul>
                      </div>
                    
                    <div>
                      <Text strong>Giải pháp:</Text>
                      <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                        {issue.solutions.map((solution, j) => (
                          <li key={j}>{solution}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                    </Col>
              ))}
            </Row>
          </div>
        ))}
        </Card>
      </div>

      {/* 6.2 - Quy trình khắc phục */}
      <div id="6.2" className="subsection">
        <Title level={3}>
          6.2. Quy trình khắc phục
        </Title>
        
        {/* 6.2.1 - Phân tích sự cố */}
        <div id="6.2.1" className="subsection">
          <Title level={4}>
            6.2.1. Phân tích sự cố
          </Title>
          <Card title="Các bước phân tích sự cố" style={{ marginBottom: '20px' }}>
          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            direction="vertical"
            size="small"
          >
            {troubleshootingProcedure.map((step, index) => (
              <Steps.Step
                key={index}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{step.icon}</span>
                    {step.title}
                  </div>
                }
                description={step.description}
                subTitle={
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>Các bước thực hiện:</Text>
                    <ol style={{ margin: '4px 0', paddingLeft: '20px' }}>
                      {step.steps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                  </div>
                }
              />
            ))}
          </Steps>
          </Card>
        </div>
        
        {/* 6.2.2 - Các bước khắc phục */}
        <div id="6.2.2" className="subsection">
          <Title level={4}>
            6.2.2. Các bước khắc phục
          </Title>
          <Card title="Quy trình khắc phục chi tiết" style={{ marginBottom: '20px' }}>
          <Collapse 
            defaultActiveKey={['0']}
            items={troubleshootingProcedure.map((procedure, index) => ({
              key: index.toString(),
              label: procedure.title,
              children: (
                <>
                  <Paragraph>{procedure.description}</Paragraph>
                  <Text strong>Các bước thực hiện:</Text>
                  <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    {procedure.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </>
              )
            }))}
          />
          </Card>
        </div>
        
        {/* 6.2.3 - Kiểm tra sau khắc phục */}
        <div id="6.2.3" className="subsection">
          <Title level={4}>
            6.2.3. Kiểm tra sau khắc phục
          </Title>
          <Card title="Checklist kiểm tra hệ thống" style={{ marginBottom: '20px' }}>
          <Alert
            message="Yêu cầu kiểm tra bắt buộc"
            description="Sau khi khắc phục sự cố, phải thực hiện đầy đủ các bước kiểm tra để đảm bảo hệ thống hoạt động ổn định và an toàn."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card size="small" title="Kiểm tra chức năng cơ bản">
                <ul>
                  <li>Kiểm tra điện áp đầu vào/ra</li>
                  <li>Kiểm tra tần số đầu ra</li>
                  <li>Kiểm tra dòng điện tải</li>
                  <li>Kiểm tra trạng thái ắc quy</li>
                  <li>Test chế độ backup</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card size="small" title="Kiểm tra an toàn">
                <ul>
                  <li>Kiểm tra kết nối đất</li>
                  <li>Kiểm tra cách điện</li>
                  <li>Kiểm tra nhiệt độ thiết bị</li>
                  <li>Kiểm tra hệ thống cảnh báo</li>
                  <li>Ghi chép vào nhật ký</li>
                </ul>
              </Card>
            </Col>
          </Row>
          </Card>
        </div>
      </div>

      {/* Các test chẩn đoán */}
      <Card title="Các test chẩn đoán hệ thống" style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          {diagnosticTests.map((test, index) => (
            <Col xs={24} lg={8} key={index}>
              <Card 
                size="small"
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{test.icon}</span>
                    {test.name}
                  </div>
                }
                style={{ height: '100%' }}
              >
                <Paragraph>{test.description}</Paragraph>
                
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>Quy trình:</Text>
                  <ol style={{ margin: '4px 0', paddingLeft: '20px' }}>
                    {test.procedure.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                  </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>Thời gian:</Text> <Tag color="blue">{test.duration}</Tag>
                  </div>
                
                  <div>
                  <Text strong>Tần suất:</Text> <Tag color="green">{test.frequency}</Tag>
                  </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Chỉ báo LED và trạng thái */}
      <Card title="Chỉ báo LED và trạng thái hệ thống" style={{ marginBottom: '20px' }}>
        {statusIndicators.map((category, index) => (
          <div key={index}>
            <Title level={4}>
              {category.category}
            </Title>
        <Row gutter={[16, 16]}>
              {category.indicators.map((indicator, i) => (
                <Col xs={24} lg={12} key={i}>
                  <Card size="small" title={indicator.name}>
                    <Row gutter={[8, 8]}>
                      {Object.entries(indicator.colors).map(([color, meaning], j) => (
                        <Col xs={12} key={j}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: color === 'Green' ? '#52c41a' : 
                                             color === 'Red' ? '#ff4d4f' : 
                                             color === 'Yellow' ? '#faad14' : '#d9d9d9'
                            }} />
                            <Text strong style={{ fontSize: '12px' }}>{color}:</Text>
                          </div>
                          <Text type="secondary" style={{ fontSize: '11px' }}>{meaning}</Text>
          </Col>
                      ))}
        </Row>
            </Card>
          </Col>
              ))}
        </Row>
          </div>
        ))}
      </Card>

      {/* Mã lỗi thường gặp */}
      <Card title="Mã lỗi thường gặp và hướng dẫn xử lý" style={{ marginBottom: '20px' }}>
        <Table
          dataSource={errorCodes}
          rowKey="code"
          columns={[
            {
              title: 'Mã lỗi',
              dataIndex: 'code',
              key: 'code',
              width: '15%',
              render: (text) => <Tag color="red" style={{ fontWeight: 'bold' }}>{text}</Tag>
            },
            {
              title: 'Mô tả',
              dataIndex: 'description',
              key: 'description',
              width: '35%'
            },
            {
              title: 'Mức độ',
              dataIndex: 'severity',
              key: 'severity',
              width: '15%',
              render: (text) => {
                const color = text === 'High' ? 'red' : text === 'Medium' ? 'orange' : 'yellow';
                return <Tag color={color}>{text}</Tag>;
              }
            },
            {
              title: 'Hành động',
              dataIndex: 'action',
              key: 'action',
              width: '35%'
            }
          ]}
          pagination={false}
          size="small"
        />
            </Card>

      {/* Biện pháp phòng ngừa */}
      <Card title="Biện pháp phòng ngừa sự cố" style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          {preventiveMeasures.map((category, index) => (
            <Col xs={24} lg={8} key={index}>
              <Card size="small" title={category.category}>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  {category.measures.map((measure, i) => (
                    <li key={i}>{measure}</li>
                  ))}
              </ul>
            </Card>
          </Col>
          ))}
        </Row>
      </Card>

      {/* Hướng dẫn khẩn cấp */}
      <Card title="Hướng dẫn xử lý khẩn cấp" style={{ marginBottom: '20px' }}>
        <Collapse 
          defaultActiveKey={['0']}
          items={[
            {
              key: '0',
              label: 'Khi có sự cố điện nghiêm trọng',
              children: (
                <ol>
                  <li>Không hoảng loạn, giữ bình tĩnh</li>
                  <li>Kiểm tra trạng thái UPS và ắc quy</li>
                  <li>Xác nhận tải đang được cung cấp</li>
                  <li>Chuẩn bị khởi động máy phát điện nếu cần</li>
                  <li>Báo cáo ngay cho cấp trên</li>
                  <li>Ghi chép chi tiết sự cố</li>
                </ol>
              )
            },
            {
              key: '1',
              label: 'Khi có sự cố ắc quy',
              children: (
                <ol>
                  <li>Kiểm tra trạng thái ắc quy</li>
                  <li>Xác nhận thời gian backup còn lại</li>
                  <li>Chuẩn bị nguồn điện dự phòng</li>
                  <li>Không tự ý sửa chữa ắc quy</li>
                  <li>Liên hệ kỹ thuật viên có chuyên môn</li>
                </ol>
              )
            },
            {
              key: '2',
              label: 'Khi có sự cố mạng',
              children: (
                <ol>
                  <li>Kiểm tra kết nối mạng</li>
                  <li>Kiểm tra cấu hình IP</li>
                  <li>Test kết nối từ xa</li>
                  <li>Kiểm tra firewall và switch</li>
                  <li>Liên hệ quản trị viên mạng nếu cần</li>
                </ol>
              )
            }
          ]}
        />
      </Card>

      {/* Lưu ý quan trọng */}
      <Card title="Lưu ý quan trọng về xử lý sự cố" style={{ marginBottom: '20px' }}>
        <Alert
          message="Không tự ý sửa chữa"
          description="Không tự ý sửa chữa thiết bị nếu không có đủ kiến thức và kinh nghiệm. Luôn liên hệ với kỹ thuật viên có chuyên môn."
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Alert
          message="Ghi chép đầy đủ"
          description="Luôn ghi chép chi tiết quá trình xử lý sự cố, bao gồm thời gian, triệu chứng, nguyên nhân và biện pháp khắc phục."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Alert
          message="Báo cáo kịp thời"
          description="Báo cáo ngay các sự cố nghiêm trọng cho cấp trên và bộ phận kỹ thuật để có biện pháp xử lý phù hợp."
          type="success"
          showIcon
        />
      </Card>
      
      <Divider />

      <Paragraph className="section-footer">
        Hệ thống UPS & Ắc quy BMS - TTDL Vân Canh | Xử lý sự cố và khắc phục
      </Paragraph>
    </div>
  );
};

export default TroubleshootingSection;
