import {
  CheckCircleOutlined,
  FileTextOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Alert, Card, Divider, Space, Tag, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

const EffectivenessRiskSection = () => {
  return (
    <div id="section-9" className="content-section">
      <Title level={2} >
        <FileTextOutlined style={{ marginRight: '8px' }} />
        9. HIỆU QUẢ VÀ RỦI RO TTDL VÂN CANH
      </Title>

      <div id="section-9.1" className="subsection">
        <Title level={3} >
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 9.1 Hiệu quả dự án
        </Title>

        <Card title="Hiệu quả chính của dự án" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">Hoạt động liên tục</Tag>
              <Text>Đảm bảo hoạt động liên tục cho hạ tầng trung tâm dữ liệu VietinBank với độ tin cậy cao theo tiêu chuẩn quốc tế</Text>
            </div>
            <div>
              <Tag color="green">Khắc phục yếu điểm</Tag>
              <Text>Khắc phục các yếu điểm hiện có của DC 108 Trần Hưng Đạo</Text>
            </div>
            <div>
              <Tag color="green">Sẵn sàng hạ tầng</Tag>
              <Text>Sẵn sàng hạ tầng để triển khai hệ thống CNTT, phát triển dịch vụ nhanh chóng</Text>
            </div>
            <div>
              <Tag color="green">Tiêu chuẩn quốc tế</Tag>
              <Text>Đáp ứng tiêu chuẩn Tier 3+ của Uptime Institute</Text>
            </div>
            <div>
              <Tag color="green">Khả năng mở rộng</Tag>
              <Text>Thiết kế cho 150 rack với khả năng mở rộng tương lai</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-9.2" className="subsection">
        <Title level={3} >
          <WarningOutlined style={{ marginRight: '8px' }} /> 9.2 Các rủi ro tiềm ẩn
        </Title>

        <Alert
          message="CÁC RỦI RO CẦN ĐƯỢC QUAN TÂM VÀ XỬ LÝ"
          description="Dự án có một số rủi ro tiềm ẩn cần được nhận diện và có giải pháp khắc phục phù hợp."
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="Rủi ro thiết bị trên mái" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="red">⚠️ Thiết bị quan trọng</Tag>
              <Text>Chiller, hệ thống bơm tuần hoàn, tủ điện cấp nguồn, tủ BMS đặt trên mái</Text>
            </div>
            <div>
              <Tag color="red">⚠️ Thời tiết cực đoan</Tag>
              <Text>Mưa bão, sấm sét, nắng nóng có thể làm giảm tuổi thọ, mau hư hỏng thiết bị</Text>
            </div>
            <div>
              <Tag color="red">⚠️ Rủi ro vận hành</Tag>
              <Text>Cán bộ vận hành xử lý sự cố tại tầng mái nguy cơ gặp rủi ro tai nạn</Text>
            </div>
          </Space>
        </Card>

        <Card title="Rủi ro nguồn điện" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="red">⚠️ Điểm yếu nguồn</Tag>
              <Text>Hệ thống 02 trạm biến áp mới được cấp từ 1 đầu nguồn 110KV</Text>
            </div>
            <div>
              <Tag color="red">⚠️ Ngấm dột</Tag>
              <Text>Nguy cơ ngấm dột qua trục kỹ thuật gây hư hỏng thiết bị điện tại tầng 1, tầng 2</Text>
            </div>
          </Space>
        </Card>

        <Card title="Rủi ro nhân sự" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="red">⚠️ Nhân sự kỹ thuật</Tag>
              <Text>Nhân sự kỹ thuật cao quản lý vận hành còn mỏng so với quy mô và độ phức tạp</Text>
            </div>
            <div>
              <Tag color="red">⚠️ Chuyên môn</Tag>
              <Text>Cán bộ kỹ thuật phòng Quản trị chưa có để đảm bảo vận hành xử lý sự cố phần hệ thống nguồn cung cấp</Text>
            </div>
          </Space>
        </Card>

        <Card title="Rủi ro công suất" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="red">⚠️ Mật độ công suất</Tag>
              <Text>Mật độ công suất các hệ thống máy chủ blade, máy chủ AI tăng cao đột biến lên tới 20-25 KW/thiết bị</Text>
            </div>
            <div>
              <Tag color="red">⚠️ Vượt thiết kế</Tag>
              <Text>Vượt công suất thiết kế, nguy cơ gây quá tải nhiệt cục bộ</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-9.3" className="subsection">
        <Title level={3} >
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 9.3 Giải pháp khắc phục
        </Title>

        <Card title="Giải pháp bảo vệ thiết bị" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">Mái che bổ sung</Tag>
              <Text>Lắp đặt bổ sung mái che cho các khu vực thiết bị trọng yếu của tầng mái</Text>
            </div>
            <div>
              <Tag color="green">Nguồn điện dự phòng</Tag>
              <Text>Triển khai bổ sung thêm 01 đường cấp nguồn từ trạm 110KVA khác</Text>
            </div>
          </Space>
        </Card>

        <Card title="Giải pháp nhân sự" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">Đào tạo nội bộ</Tag>
              <Text>Đào tạo nội bộ liên tục để nâng cao chất lượng cán bộ</Text>
            </div>
            <div>
              <Tag color="green">Tuyển dụng bổ sung</Tag>
              <Text>Tuyển dụng bổ sung kỹ thuật chuyên môn sâu</Text>
            </div>
            <div>
              <Tag color="green">Xây dựng đội ngũ</Tag>
              <Text>Xây dựng đội ngũ vận hành chuyên nghiệp, chuyên sâu về hạ tầng DC</Text>
            </div>
            <div>
              <Tag color="green">Nắm bắt toàn diện</Tag>
              <Text>Dần nắm bắt cả phần nguồn cung cấp: trạm biến áp, máy phát điện, hệ thống cấp dầu</Text>
            </div>
          </Space>
        </Card>

        <Card title="Giải pháp công suất" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">Giám sát công suất</Tag>
              <Text>Giám sát, đánh giá kỹ lưỡng công suất tải thực tế của các hệ thống công suất cao</Text>
            </div>
            <div>
              <Tag color="green">Bố trí linh hoạt</Tag>
              <Text>Linh hoạt bố trí vị trí lắp đặt các thiết bị phù hợp</Text>
            </div>
            <div>
              <Tag color="green">Điều chỉnh điều hòa</Tag>
              <Text>Điều chỉnh công suất điều hòa hợp lý</Text>
            </div>
            <div>
              <Tag color="green">Tăng cường quạt</Tag>
              <Text>Có kế hoạch tăng cường quạt Active Floor để xử lý nóng cục bộ</Text>
            </div>
            <div>
              <Tag color="green">Khu vực riêng</Tag>
              <Text>Có kế hoạch xây dựng khu vực riêng với diện tích nhỏ, đáp ứng công suất siêu cao, mật độ, băng thông mạng siêu cao tại tầng 3</Text>
            </div>
          </Space>
        </Card>
      </div>

      <Divider />

      <Alert
        message="Kết luận"
        description="TTDL Vân Canh mang lại hiệu quả cao cho hoạt động CNTT của VietinBank, tuy nhiên cần có các giải pháp đồng bộ để giảm thiểu rủi ro và đảm bảo vận hành ổn định lâu dài."
        type="success"
        showIcon
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default EffectivenessRiskSection;
