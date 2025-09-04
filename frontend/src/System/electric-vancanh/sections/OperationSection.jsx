import { PlayCircleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider, Row, Space, Steps, Tag, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const OperationSection = () => {
  // State management cho Steps theo tiêu chuẩn UI_UX_STANDARDS.md
  const [currentOperationStep, setCurrentOperationStep] = React.useState(0);
  const [currentBackupTestStep, setCurrentBackupTestStep] = React.useState(0);
  const [currentMaintenanceStep, setCurrentMaintenanceStep] = React.useState(0);

  // Quy trình vận hành steps
  const operationSteps = [
    {
      title: 'Kiểm tra trạng thái ban đầu',
      description: 'Xác nhận tất cả thiết bị ở trạng thái sẵn sàng'
    },
    {
      title: 'Khởi động nguồn lưới',
      description: 'Đóng ACB từ trạm biến áp A và B'
    },
    {
      title: 'Kiểm tra hệ thống giám sát',
      description: 'Xác nhận Power Monitoring.exe hoạt động bình thường'
    },
    {
      title: 'Vận hành bình thường',
      description: 'Hệ thống sử dụng 2 nguồn lưới từ 2 trạm biến áp'
    }
  ];

  // Quy trình kiểm tra hệ thống dự phòng steps
  const backupTestSteps = [
    {
      title: 'Bước 1: Chuẩn bị',
      description: 'Chuyển hệ thống Chiller về chế độ kiểm tra hệ thống điện dự phòng'
    },
    {
      title: 'Bước 2: Test mất nguồn A',
      description: 'Ngắt ACB 4000A trạm A - Hệ thống tự động chuyển sang nguồn B'
    },
    {
      title: 'Bước 3: Test mất cả 2 nguồn',
      description: 'Ngắt ACB 4000A trạm B - Hệ thống gọi máy phát điện'
    },
    {
      title: 'Bước 4: Test lỗi máy phát',
      description: 'Tắt cưỡng bức máy phát đang chạy - Hệ thống gọi máy phát còn lại'
    },
    {
      title: 'Bước 5: Khôi phục nguồn lưới',
      description: 'Đóng 1 nguồn lưới - Hệ thống tự động chuyển về lưới và dừng máy phát'
    },
    {
      title: 'Bước 6: Khôi phục hoàn toàn',
      description: 'Đóng nguồn lưới còn lại - Hệ thống về trạng thái bình thường'
    },
    {
      title: 'Bước 7: Kết thúc kiểm tra',
      description: 'Reset máy phát về Auto Mode, chuyển Chiller về chế độ bình thường'
    }
  ];

  // Quy trình bảo trì steps
  const maintenanceSteps = [
    {
      title: 'Kiểm tra trạng thái các ACB, MCCB, MCB',
      description: 'Kiểm tra trạng thái hoạt động và nhiệt độ'
    },
    {
      title: 'Kiểm tra độ nhạy RCD và RCBO',
      description: 'Test độ nhạy và thời gian phản ứng'
    },
    {
      title: 'Kiểm tra hệ thống tiếp địa',
      description: 'Đo điện trở nối đất và kiểm tra kết nối'
    },
    {
      title: 'Kiểm tra hệ thống chiếu sáng khẩn cấp',
      description: 'Test đèn Exit và Emergency lighting'
    },
    {
      title: 'Kiểm tra UPS và ắc quy',
      description: 'Test thời gian dự phòng và trạng thái ắc quy'
    },
    {
      title: 'Kiểm tra hệ thống giám sát',
      description: 'Kiểm tra log và cảnh báo hệ thống'
    }
  ];

  return (
    <div className="content-section">
      <Title level={2} className="section-title">
        <PlayCircleOutlined /> VẬN HÀNH VÀ BẢO TRÌ HỆ THỐNG ĐIỆN
      </Title>
      
      <Paragraph className="section-description">
        Quy trình vận hành, kiểm tra hệ thống dự phòng và bảo trì định kỳ hệ thống điện 
        tại Trung tâm Dữ liệu Vân Canh - VietinBank.
      </Paragraph>

      <Divider />

      {/* Quy trình vận hành */}
      <div id="7.1" className="subsection">
        <Title level={3} className="subsection-title">
          7.1. Quy trình vận hành hệ thống điện
        </Title>
        <Card title="Quy trình vận hành hệ thống điện" className="subsection">
          <Paragraph>
            Quy trình khởi động và vận hành hệ thống điện theo 4 bước chuẩn, đảm bảo an toàn và hiệu quả.
          </Paragraph>
          
          <Steps
            current={currentOperationStep}
            onChange={setCurrentOperationStep}
            direction="vertical"
            size="small"
            items={operationSteps}
            style={{ marginTop: '16px' }}
          />

          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col xs={24} lg={12}>
              <Title level={4}>Trạng thái vận hành bình thường</Title>
              <Alert
                message="Trạng thái hoạt động bình thường"
                description="Hệ thống sử dụng 2 nguồn lưới từ 2 trạm biến áp cho 2 phòng điện A, B"
                type="success"
                showIcon
              />
              <Divider />
              <Space direction="vertical" style={{ width: '100%' }}>
                <Tag color="green">Nguồn lưới A: Hoạt động</Tag>
                <Tag color="green">Nguồn lưới B: Hoạt động</Tag>
                <Tag color="blue">Tủ MainLT A: Online</Tag>
                <Tag color="blue">Tủ MainLT B: Online</Tag>
                <Tag color="orange">UPS: Hoạt động bình thường</Tag>
              </Space>
            </Col>
            
            <Col xs={24} lg={12}>
              <Title level={4}>Thông số vận hành</Title>
              <ul>
                <li><Text strong>Điện áp:</Text> 400V ±5%</li>
                <li><Text strong>Tần số:</Text> 50Hz ±0.5%</li>
                <li><Text strong>Hệ số công suất:</Text> ≥0.95</li>
                <li><Text strong>Nhiệt độ tủ:</Text> ≤45°C</li>
                <li><Text strong>Độ ẩm:</Text> ≤85%</li>
              </ul>
            </Col>
          </Row>
        </Card>
      </div>

      <Divider />

      {/* Kiểm tra hệ thống dự phòng */}
      <div id="7.2" className="subsection">
        <Title level={3} className="subsection-title">
          7.2. Kiểm tra hệ thống điện dự phòng
        </Title>
        <Card title="Kiểm tra hệ thống điện dự phòng" className="subsection">
          <Alert
            message="Quy trình kiểm tra hệ thống dự phòng"
            description="Thực hiện theo 7 bước kiểm tra để đảm bảo hệ thống hoạt động ổn định"
            type="info"
            showIcon
          />
          
          <Divider />
          
          <Steps
            current={currentBackupTestStep}
            onChange={setCurrentBackupTestStep}
            direction="vertical"
            size="default"
            items={backupTestSteps}
            style={{ marginTop: '16px' }}
          />

          <Divider />

          <Title level={4}>Lưu ý quan trọng</Title>
          <Alert
            message="Xử lý sự cố trong quá trình kiểm tra"
            description="Nếu có sự cố về hệ thống như không gọi được máy phát, hệ thống đóng cắt không hoạt động thì báo các bộ phận liên quan để khắc phục sự cố"
            type="warning"
            showIcon
          />

          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} lg={12}>
              <Title level={4}>Thời gian thực hiện</Title>
              <ul>
                <li><Text strong>Bước 1-2:</Text> 5-10 phút</li>
                <li><Text strong>Bước 3-4:</Text> 10-15 phút</li>
                <li><Text strong>Bước 5-6:</Text> 15-20 phút</li>
                <li><Text strong>Bước 7:</Text> 5-10 phút</li>
                <li><Text strong>Tổng thời gian:</Text> 45-60 phút</li>
              </ul>
            </Col>
            
            <Col xs={24} lg={12}>
              <Title level={4}>Yêu cầu an toàn</Title>
              <ul>
                <li>Mang đồ bảo hộ đầy đủ</li>
                <li>Kiểm tra môi trường xung quanh</li>
                <li>Thông báo cho các bộ phận liên quan</li>
                <li>Chuẩn bị thiết bị cứu hộ</li>
                <li>Ghi chép đầy đủ quá trình</li>
              </ul>
            </Col>
          </Row>
        </Card>
      </div>

      <Divider />

      {/* Bảo trì định kỳ */}
      <div id="7.3" className="subsection">
        <Title level={3} className="subsection-title">
          7.3. Bảo trì định kỳ hệ thống điện
        </Title>
        <Card title="Bảo trì định kỳ hệ thống điện" className="subsection">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Title level={4}>Lịch bảo trì</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Tag color="blue">Hàng ngày: Kiểm tra trạng thái hệ thống</Tag>
                <Tag color="green">Hàng tuần: Kiểm tra log và cảnh báo</Tag>
                <Tag color="orange">Hàng tháng: Kiểm tra thiết bị bảo vệ</Tag>
                <Tag color="red">Hàng quý: Test hệ thống dự phòng</Tag>
                <Tag color="purple">Hàng năm: Bảo trì toàn bộ hệ thống</Tag>
              </Space>
            </Col>
            
            <Col xs={24} lg={12}>
              <Title level={4}>Quy trình bảo trì</Title>
              <Steps
                current={currentMaintenanceStep}
                onChange={setCurrentMaintenanceStep}
                direction="vertical"
                size="small"
                items={maintenanceSteps}
              />
            </Col>
          </Row>

          <Divider />

          <Title level={4}>Báo cáo và ghi nhận</Title>
          <Paragraph>
            Tất cả các hoạt động bảo trì phải được ghi chép đầy đủ vào sổ sách theo quy định:
          </Paragraph>
          <ul>
            <li>Ghi nhận thời gian bảo trì</li>
            <li>Ghi nhận nội dung thực hiện</li>
            <li>Ghi nhận kết quả kiểm tra</li>
            <li>Ghi nhận các vấn đề phát hiện</li>
            <li>Ghi nhận biện pháp khắc phục</li>
            <li>Ký xác nhận của người thực hiện</li>
          </ul>
        </Card>
      </div>

      <Divider />

      {/* Hướng dẫn vận hành từng thiết bị */}
      <div id="7.4" className="subsection">
        <Title level={3} className="subsection-title">
          7.4. Hướng dẫn vận hành từng thiết bị
        </Title>
        <Card title="Hướng dẫn vận hành từng thiết bị" className="subsection">
          <Title level={4}>Thiết bị chính cần vận hành</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card size="small" title="Máy phát điện" className="subsection">
                <ul>
                  <li>Khởi động và dừng máy phát</li>
                  <li>Kiểm tra nhiên liệu và dầu</li>
                  <li>Kiểm tra nhiệt độ và áp suất</li>
                  <li>Test tải định kỳ</li>
                </ul>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card size="small" title="Trạm biến áp" className="subsection">
                <ul>
                  <li>Kiểm tra trạng thái ACB</li>
                  <li>Kiểm tra nhiệt độ cuộn dây</li>
                  <li>Kiểm tra dầu biến áp</li>
                  <li>Kiểm tra hệ thống bảo vệ</li>
                </ul>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card size="small" title="Tủ hạ thế" className="subsection">
                <ul>
                  <li>Kiểm tra trạng thái các máy cắt</li>
                  <li>Kiểm tra nhiệt độ tủ</li>
                  <li>Kiểm tra hệ thống bảo vệ</li>
                  <li>Kiểm tra kết nối cáp</li>
                </ul>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Alert
            message="Tham khảo tài liệu vận hành"
            description="Chi tiết vận hành từng thiết bị: máy phát, trạm biến áp, tủ hạ thế, các ACB, MCCB... Tham khảo thêm tài liệu vận hành của từng thiết bị"
            type="info"
            showIcon
          />
        </Card>
      </div>
    </div>
  );
};

export default OperationSection;
