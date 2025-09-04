import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  SafetyOutlined,
  SettingOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { Alert, Card, Col, Row, Steps, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const OperationSection = () => {
  // State để quản lý step hiện tại
  const [currentStep, setCurrentStep] = React.useState(0);
  const [currentEmergencyStep, setCurrentEmergencyStep] = React.useState(0);
  const [currentMaintenanceStep, setCurrentMaintenanceStep] = React.useState(0);

  // State riêng cho từng phase trong phần 5.2
  const [phase1Step, setPhase1Step] = React.useState(0);
  const [phase2Step, setPhase2Step] = React.useState(0);

  // Quy trình khởi động hệ thống
  const startupProcedure = [
    {
      step: 1,
      title: 'Khởi động Cụm Chiller đầu tiên',
      actions: [
        'Ra lệnh bật Chiller 01',
        'Ra lệnh mở van chặn Chiller 01',
        'Ra lệnh bật bơm nước lạnh với tham số cài đặt trước',
        'Cụm Chiller được khởi động thành công'
      ],
      notes: 'Thứ tự Chiller sẽ được tính toán và cài đặt sao cho tổng thời gian hoạt động của các Chiller tương đương nhau. Chiller được cài đặt ở chế độ Remote để hệ thống BMS có thể can thiệp.'
    },
    {
      step: 2,
      title: 'Vận hành hệ thống van Bypass',
      actions: [
        'Mỗi cụm van Bypass được vận hành dựa theo chênh lệch áp suất',
        'Đo được giữa đường ống nước lạnh cấp và đường ống nước lạnh hồi',
        'Với tham số cài đặt trước'
      ],
      notes: 'Tham số cài đặt phải đảm bảo duy trì chênh lệch áp suất giữa đường ống tối thiểu vận hành của hệ thống.'
    },
    {
      step: 3,
      title: 'Vận hành hệ thống Két dự phòng TES ở chế độ Commissioning',
      actions: [
        'Ra lệnh đóng hoàn toàn Van V1A, V1B',
        'Ra lệnh mở hoàn toàn Van V2A, V2B',
        'Ra lệnh mở hoàn toàn Van V3A, V3B'
      ],
      notes: 'Vận hành ở chế độ nạp. Van V2A, V2B sẽ được điều tiết mở theo tải làm mát đòi hỏi của DC, phần trăm mở tối thiểu là 10%.'
    },
    {
      step: 4,
      title: 'Vận hành hệ thống bơm bù áp',
      actions: [
        'Mỗi cụm bơm bù áp được vận hành dựa theo áp suất tĩnh đo được trên đường ống',
        'Với tham số cài đặt trước'
      ],
      notes: 'Tham số cài đặt phải đảm bảo duy trì áp suất đường ống tối thiểu vận hành của hệ thống. Các bơm trong mỗi cụm được vận hành luân phiên sao cho thời gian hoạt động của các bơm là tương đương nhau.'
    }
  ];

  // Quy trình vận hành chế độ Normal
  const normalOperation = [
    {
      phase: 'Vận hành ổn định',
      description: 'Hệ thống vận hành sau khi quá trình khởi động hoàn tất',
      actions: [
        'Điều chỉnh tần số bơm nước lạnh tăng giảm theo tải lạnh của DC',
        'Dựa trên điều chỉnh chênh lệch áp suất giữa đường nước cấp – hồi đáp ứng giá trị cài đặt',
        'Vận hành hệ thống Két dự phòng Tes ở chế độ Commissioning - Nạp',
        'Cho tới khi nhiệt độ đo được tại đỉnh Tes đạt giá trị cài đặt của hệ thống',
        'Chuyển sang chế độ tiếp theo'
      ],
      parameters: 'Tần số bơm nước lạnh điều chỉnh trong dải sao cho vẫn đảm bảo lưu lượng tối thiểu đi qua Chiller và đảm bảo được lưu lượng nước tối thiểu đi qua từng máy làm lạnh nước khi đang vận hành.'
    },
    {
      phase: 'Chế độ Normal',
      description: 'Nước sẽ ra khỏi Chiller và đi qua Két dự phòng TES và sau đó đi vào các CRAC',
      actions: [
        'Ra lệnh mở hoàn toàn Van V1A, V1B',
        'Ra lệnh đóng hoàn toàn Van V2A, V2B',
        'Ra lệnh đóng hoàn toàn Van V3A, V3B'
      ],
      parameters: 'Vận hành hệ thống van Bypass tiếp tục từ Quy trình khởi động. Vận hành hệ thống bơm bù tiếp tục từ Quy trình khởi động.'
    }
  ];

  // Quy trình gọi thêm, cắt bớt cụm Chiller
  const chillerControl = [
    {
      action: 'Gọi thêm cụm Chiller',
      conditions: [
        'Nhiệt độ nước lạnh cấp cho tải không đạt giá trị cài đặt (mặc định = 10°C)',
        'Công suất làm việc của các Chiller đang hoạt động lớn hơn giá trị cài đặt (mặc định = 80%)',
        'Hệ thống liên tục duy trì tình trạng này trong khoảng thời gian cài đặt (mặc định = 300s)'
      ],
      procedure: [
        'Ra lệnh bật Chiller 02',
        'Ra lệnh mở van chặn Chiller 02',
        'Ra lệnh bật bơm nước lạnh với tham số cài đặt trước',
        'Cụm Chiller được khởi động thành công'
      ],
      notes: 'Nếu BMS xác nhận đã có tín hiệu từ bộ điều khiển của Chiller'
    },
    {
      action: 'Cắt bớt cụm Chiller',
      conditions: [
        'Nhiệt độ nước lạnh cấp cho tải thấp hơn giá trị cài đặt (mặc định = 8°C)',
        'Công suất làm việc của các Chiller đang hoạt động thấp hơn giá trị cài đặt (mặc định = 60%)',
        'Hệ thống liên tục duy trì tình trạng này trong khoảng thời gian cài đặt (mặc định = 300s)'
      ],
      procedure: [
        'Ra lệnh tắt Chiller 01',
        'Ra lệnh tắt bơm nước lạnh 01',
        'Ra lệnh đóng van chặn Chiller 01'
      ],
      notes: 'Cụm Chiller nào bật trước sẽ được ra lệnh tắt trước khi có yêu cầu tắt từ hệ thống, sao cho thời gian hoạt động của các Chiller là tương đương nhau.'
    }
  ];

  // Quy trình vận hành luân phiên
  const rotationOperation = {
    description: 'Hệ thống BMS liên tục theo dõi trạng thái hoạt động của các thành phần trong hệ thống, từ đó tính toán vận hành luân phiên các cụm Chiller theo giờ, đảm bảo thời gian vận hành của các cụm là tương đương nhau.',
    parameters: 'Giá trị cài đặt thời gian luân phiên có thể được cài đặt bởi người vận hành để phù hợp với thực tế vận hành của hệ thống. Giá trị cài đặt mặc định là 8h.'
  };

  // Quy trình vận hành chế độ sự cố
  const emergencyOperation = [
    {
      scenario: 'Khi 01 cụm Chiller bị lỗi',
      description: 'Một thành phần bất kỳ của cụm bị lỗi: Máy lạnh Chiller bị lỗi hoặc không khởi động lên được, van chặn không mở được hoàn toàn, hoặc bộ điều khiển thuộc cụm Chiller bị lỗi.',
      actions: [
        'Hệ thống BMS cập nhật trạng thái hoạt động liên tục của các thành phần trong hệ thống',
        'Xuất tín hiệu cảnh báo cho người vận hành nắm bắt được thông tin',
        'Căn cứ vào số lượng cụm Chiller đang vận hành tại thời điểm có cụm Chiller bị lỗi',
        'Tính toán đưa ra phương án gọi thêm cụm Chiller thay thế'
      ],
      response: [
        'Hệ thống đang vận hành với 01 cụm Chiller: hệ thống tiếp tục vận hành ở chế độ BÌNH THƯỜNG, hệ thống tự động tính toán gọi thêm cụm Chiller khi đạt đủ điều kiện của hệ thống.',
        'Hệ thống đang không có cụm Chiller nào vận hành: ngay lập tức khởi động cụm Chiller tiếp theo. Song song với quá trình khởi động cụm Chiller thay thế này, nếu nhiệt độ tại đỉnh Két dự phòng Tes vượt quá giá trị cài đặt (10°C) thì lập tức chuyển hệ thống Két dự phòng Tes sang chế độ XẢ.'
      ]
    },
    {
      scenario: 'Khi xảy ra sự cố mất điện, Chiller không hoạt động được',
      actions: [
        'Chuyển hệ thống Két dự phòng Tes sang vận hành ở chế độ XẢ',
        'Nhanh chóng khắc phục sự cố về nguồn để khởi động lại hệ thống Chiller',
        'Vận hành hệ thống Két dự phòng Tes ở chế độ NẠP, cho tới khi nhiệt độ đo được tại đỉnh Tes đạt giá trị cài đặt của hệ thống',
        'Vận hành hệ thống Két dự phòng Tes ở chế độ BÌNH THƯỜNG'
      ],
      notes: 'Phải đảm bảo cung cấp nước lạnh lấy sẵn từ Két dự phòng Tes cung cấp cho tải lạnh của DC trong thời gian ~ 10 phút. Chỉ thực hiện sau khi đã khắc phục xong sự cố về mất điện nguồn Chiller và hệ thống đã hoạt động ổn định trở lại.'
    }
  ];

  // Các chế độ vận hành
  const operationModes = [
    {
      mode: 'Local',
      description: 'Chế độ vận hành tại chỗ, tại nút nhấn điều khiển trên tủ động lực.',
      usage: 'Sử dụng khi cần điều khiển trực tiếp tại thiết bị'
    },
    {
      mode: 'Manual',
      description: 'Chế độ vận hành trên giao diện vận hành, vận hành trực tiếp bởi cán bộ vận hành.',
      usage: 'Sử dụng khi cần can thiệp thủ công vào quá trình vận hành'
    },
    {
      mode: 'Auto',
      description: 'Chế độ vận hành tự động, dựa trên thời gian hoạt động thực tế của thiết bị mà xác định thứ tự hoạt động của cả cụm thiết bị.',
      usage: 'Sử dụng trong vận hành bình thường, hệ thống tự động điều khiển'
    }
  ];

  return (
    <div className="content-section">
      <Title level={2}>
        <PlayCircleOutlined style={{ marginRight: '12px' }} />
        5. Quy trình vận hành hệ thống làm mát
      </Title>

      <Alert
        message="Quy trình vận hành tiêu chuẩn"
        description="TTDL Vân Canh sử dụng quy trình vận hành hệ thống làm mát được thiết kế theo tiêu chuẩn quốc tế, đảm bảo an toàn, hiệu quả và độ tin cậy cao trong mọi tình huống vận hành."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* 5.1 Quy trình khởi động hệ thống */}
      <div id="section-5.1" className="subsection">
        <Title level={3}>
          <PlayCircleOutlined style={{ marginRight: '12px' }} />
          5.1. Quy trình khởi động hệ thống
        </Title>
        <Card title="Quy trình khởi động hệ thống làm mát" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Quy trình khởi động hệ thống làm mát được thực hiện theo các bước tuần tự để đảm bảo an toàn và hiệu quả.
          </Paragraph>

          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            direction="vertical"
            size="small"
            items={startupProcedure.map((step) => ({
              title: step.title,
              description: (
                <div>
                  <Paragraph style={{ marginBottom: '8px' }}>
                    <Text strong>Các bước thực hiện:</Text>
                  </Paragraph>
                  <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>
                    {step.actions.map((action, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        <Text>{action}</Text>
                      </li>
                    ))}
                  </ul>
                  <Paragraph style={{ marginBottom: '0px' }}>
                    <Text strong>Lưu ý:</Text> {step.notes}
                  </Paragraph>
                </div>
              )
            }))}
          />
        </Card>
      </div>

      {/* 5.2 Vận hành chế độ Normal */}
      <div id="section-5.2" className="subsection">
        <Title level={3} >
          <SettingOutlined style={{ marginRight: '12px' }} />
          5.2. Vận hành chế độ Normal
        </Title>

        <Card title="Quy trình vận hành chế độ Normal" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Hệ thống vận hành sau khi quá trình khởi động hoàn tất và chuyển sang chế độ Normal.
          </Paragraph>

          {normalOperation.map((phase, index) => (
            <div key={index} style={{ marginBottom: '24px' }}>
              <Title level={4} style={{ color: '#1890ff', marginBottom: '16px' }}>
                {phase.phase}
              </Title>
              <Paragraph style={{ marginBottom: '16px' }}>
                <Text strong>Mô tả:</Text> {phase.description}
              </Paragraph>
              <Paragraph style={{ marginBottom: '8px' }}>
                <Text strong>Các bước thực hiện:</Text>
              </Paragraph>
              <Steps
                current={index === 0 ? phase1Step : phase2Step}
                onChange={index === 0 ? setPhase1Step : setPhase2Step}
                direction="vertical"
                size="small"
                items={phase.actions.map((action) => ({
                  title: action,
                  description: null
                }))}
              />
              <Paragraph style={{ marginTop: '16px', marginBottom: '0px' }}>
                <Text strong>Tham số:</Text> {phase.parameters}
              </Paragraph>
            </div>
          ))}
        </Card>
      </div>

      {/* 5.3 Quy trình gọi thêm, cắt bớt cụm Chiller */}
      <div id="section-5.3" className="subsection">
        <Title level={3} >
          <ThunderboltOutlined style={{ marginRight: '12px' }} />
          5.3. Quy trình gọi thêm, cắt bớt cụm Chiller
        </Title>
        <Card title="Quy trình điều khiển cụm Chiller" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Hệ thống tự động điều khiển việc gọi thêm hoặc cắt bớt cụm Chiller dựa trên tải làm mát và điều kiện vận hành.
          </Paragraph>

          <Steps
            current={currentEmergencyStep}
            onChange={setCurrentEmergencyStep}
            direction="vertical"
            size="small"
            items={chillerControl.map((control) => ({
              title: control.action,
              description: (
                <div>
                  <Paragraph style={{ marginBottom: '8px' }}>
                    <Text strong>Điều kiện:</Text>
                  </Paragraph>
                  <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>
                    {control.conditions.map((condition, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        <Text>{condition}</Text>
                      </li>
                    ))}
                  </ul>
                  <Paragraph style={{ marginBottom: '8px' }}>
                    <Text strong>Quy trình:</Text>
                  </Paragraph>
                  <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>
                    {control.procedure.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        <Text>{step}</Text>
                      </li>
                    ))}
                  </ul>
                  <Paragraph style={{ marginBottom: '0px' }}>
                    <Text strong>Ghi chú:</Text> {control.notes}
                  </Paragraph>
                </div>
              )
            }))}
          />
        </Card>
      </div>

      {/* 5.4 Quy trình vận hành luân phiên hệ thống */}
      <div id="section-5.4" className="subsection">
        <Title level={3} >
          <SettingOutlined style={{ marginRight: '12px' }} />
          5.4. Quy trình vận hành luân phiên hệ thống
        </Title>
        <Paragraph style={{ marginBottom: '16px' }}>
          {rotationOperation.description}
        </Paragraph>
        <Paragraph style={{ marginBottom: '0' }}>
          <Text strong>Tham số cài đặt:</Text> {rotationOperation.parameters}
        </Paragraph>
      </div>

      {/* 5.5 Xử lý sự cố và chế độ khẩn cấp */}
      <div id="section-5.5" className="subsection">
        <Title level={3} >
          <ExclamationCircleOutlined style={{ marginRight: '12px' }} />
          5.5. Xử lý sự cố và chế độ khẩn cấp
        </Title>

        <Card title="Quy trình xử lý sự cố và chế độ khẩn cấp" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Các quy trình xử lý sự cố và chế độ khẩn cấp để đảm bảo an toàn và ổn định của hệ thống làm mát.
          </Paragraph>

          <Steps
            current={currentEmergencyStep}
            onChange={setCurrentEmergencyStep}
            direction="vertical"
            size="small"
            items={emergencyOperation.map((emergency) => ({
              title: emergency.scenario,
              description: (
                <div>
                  <Paragraph style={{ marginBottom: '8px' }}>
                    <Text strong>Mô tả:</Text> {emergency.description}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: '8px' }}>
                    <Text strong>Các bước thực hiện:</Text>
                  </Paragraph>
                  <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>
                    {emergency.actions.map((action, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        <Text>{action}</Text>
                      </li>
                    ))}
                  </ul>
                  {emergency.response && emergency.response.length > 0 && (
                    <>
                      <Paragraph style={{ marginBottom: '8px' }}>
                        <Text strong>Phản ứng của hệ thống:</Text>
                      </Paragraph>
                      <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>
                        {emergency.response.map((response, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            <Text>{response}</Text>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <Paragraph style={{ marginBottom: '0px' }}>
                    <Text strong>Lưu ý:</Text> {emergency.notes}
                  </Paragraph>
                </div>
              )
            }))}
          />
        </Card>
      </div>

      {/* 5.6 Các chế độ vận hành */}
      <div id="section-5.6" className="subsection">
        <Title level={3} >
          <SafetyOutlined style={{ marginRight: '12px' }} />
          5.6. Các chế độ vận hành
        </Title>
        <Card title="Các chế độ vận hành hệ thống" style={{ marginBottom: '20px' }}>
          <Paragraph style={{ marginBottom: '16px' }}>
            Với mỗi cụm thiết bị sẽ được vận hành tuần tự theo thứ tự được định sẵn và có các chế độ vận hành riêng tùy theo yêu cầu vận hành của hệ thống, người vận hành cần phải thao tác chọn chế độ thích hợp trước khi vận hành hệ thống.
          </Paragraph>

          <Steps
            current={currentMaintenanceStep}
            onChange={setCurrentMaintenanceStep}
            direction="vertical"
            size="small"
            items={operationModes.map((mode) => ({
              title: mode.mode,
              description: (
                <div>
                  <Paragraph style={{ marginBottom: '8px' }}>
                    <Text strong>Mô tả:</Text> {mode.description}
                  </Paragraph>
                  <Paragraph style={{ marginBottom: '0px' }}>
                    <Text strong>Sử dụng:</Text> {mode.usage}
                  </Paragraph>
                </div>
              )
            }))}
          />
        </Card>
      </div>

      {/* 5.7 Thông tin bổ sung */}
      <div id="section-5.7" className="subsection">
        <Title level={3} >
          <InfoCircleOutlined style={{ marginRight: '12px' }} />
          5.7. Thông tin bổ sung
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Alert
              message="Điều khiển tự động"
              description="Hệ thống BMS tự động điều khiển toàn bộ quá trình vận hành theo logic tương hỗ giữa chiller, bơm và van, đảm bảo hiệu suất tối ưu."
              type="success"
              showIcon
            />
          </Col>
          <Col xs={24} lg={12}>
            <Alert
              message="An toàn vận hành"
              description="Mọi quy trình vận hành đều có kiểm tra an toàn và bảo vệ tự động, đảm bảo hệ thống hoạt động ổn định và an toàn."
              type="warning"
              showIcon
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OperationSection;
