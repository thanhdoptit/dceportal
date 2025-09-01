import React from 'react';
import { Typography, Card, Tag, Alert, Space, Divider, Row, Col } from 'antd';
import { 
  SafetyOutlined, 
  FireOutlined, 
  CheckCircleOutlined,
  PictureOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const FireProtectionSection = () => {
  return (
    <div id="section-5" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <SafetyOutlined style={{ marginRight: '8px' }} />
        5. HỆ THỐNG PCCC TTDL VÂN CANH
      </Title>

      <Alert
        message="HỆ THỐNG PCCC TỰ ĐỘNG BẰNG KHÍ NOVEC 1230"
        description="Kèm hệ thống báo khói sớm, hệ thống giám sát đồ họa đáp ứng tiêu chuẩn an toàn cao nhất."
        type="warning"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      {/* Hình ảnh hệ thống PCCC */}
      <Card 
        title={
          <Space>
            <PictureOutlined />
            Hệ thống PCCC Novec 1230
          </Space>
        }
        style={{ marginBottom: '20px' }}
      >
        <div style={{ textAlign: 'center' }}>
                      <img 
              src="/vancanh-overview/fire_protection_novec1230.jpg"
              alt="Hệ thống PCCC tự động bằng khí Novec 1230"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          <p style={{ 
            color: '#666', 
            margin: '8px 0 0 0', 
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            Hệ thống PCCC tự động bằng khí Novec 1230 (từ slide PPTX)
          </p>
        </div>
      </Card>

      <Card title="Thông số kỹ thuật hệ thống PCCC" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Tag color="red">Chất chữa cháy</Tag>
            <Text>Khí Novec 1230</Text>
          </div>
          <div>
            <Tag color="red">Tổng số bình</Tag>
            <Text>34 bình</Text>
          </div>
          <div>
            <Tag color="red">Phân bố bình</Tag>
            <Text>Tầng 1: 10 bình, Tầng 2: 16 bình, Tầng 3: 8 bình</Text>
          </div>
          <div>
            <Tag color="red">Trọng lượng bình</Tag>
            <Text>Tầng 1: 70kg, Tầng 2: 110kg, Tầng 3: 130kg</Text>
          </div>
          <div>
            <Tag color="red">Áp suất</Tag>
            <Text>50 Bar</Text>
          </div>
          <div>
            <Tag color="red">Đặc điểm</Tag>
            <Text>Chất chữa cháy sạch, an toàn, không dẫn điện, không ăn mòn</Text>
          </div>
          <div>
            <Tag color="red">Hiệu quả</Tag>
            <Text>Dập tắt đám cháy bằng hấp thụ nhiệt, không làm cạn kiệt oxy</Text>
          </div>
        </Space>
      </Card>

      <Card title="Hệ thống báo cháy" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Tag color="orange">Tủ trung tâm</Tag>
            <Text>ADVANCED với 2 loops quản lý</Text>
          </div>
          <div>
            <Tag color="orange">Đầu báo</Tag>
            <Text>Đầu báo khói/nhiệt dạng địa chỉ</Text>
          </div>
          <div>
            <Tag color="orange">Báo khói sớm</Tag>
            <Text>Hệ thống lấy mẫu qua đầu dò, phân tích và phát hiện</Text>
          </div>
          <div>
            <Tag color="orange">Tủ báo cháy khu vực</Tag>
            <Text>Tại các phòng chức năng với màn hình hiển thị</Text>
          </div>
        </Space>
      </Card>

      <Card title="Trung tâm điều khiển" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Tag color="blue">Vị trí</Tag>
            <Text>Cuối phòng NOC</Text>
          </div>
          <div>
            <Tag color="blue">Tủ trung tâm PCCC</Tag>
            <Text>Quản lý, giám sát toàn bộ hệ thống báo cháy, báo khói sớm</Text>
          </div>
          <div>
            <Tag color="blue">Tủ điều khiển loa</Tag>
            <Text>Thông báo sự cố, có bộ đàm và hệ thống loa</Text>
          </div>
          <div>
            <Tag color="blue">Tủ MFD Panel</Tag>
            <Text>Điều khiển mô tơ đóng mở đường ống dẫn khói, bụi</Text>
          </div>
          <div>
            <Tag color="blue">Tủ cảnh báo dò nước</Tag>
            <Text>Giám sát rò rỉ nước tại các tầng</Text>
          </div>
        </Space>
      </Card>

      <Card title="Đặc điểm an toàn" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Tag color="green">✅ An toàn cho người</Tag>
            <Text>Khí Novec 1230 không độc hại</Text>
          </div>
          <div>
            <Tag color="green">✅ Không làm hư thiết bị</Tag>
            <Text>Không gây ăn mòn điện tử</Text>
          </div>
          <div>
            <Tag color="green">✅ Phát hiện sớm</Tag>
            <Text>Hệ thống báo khói sớm</Text>
          </div>
          <div>
            <Tag color="green">✅ Tự động kích hoạt</Tag>
            <Text>Không cần can thiệp thủ công</Text>
          </div>
          <div>
            <Tag color="green">✅ Thân thiện môi trường</Tag>
            <Text>Không ảnh hưởng tầng ozone</Text>
          </div>
          <div>
            <Tag color="green">✅ Hiệu quả cao</Tag>
            <Text>Dập tắt đám cháy bằng hấp thụ nhiệt</Text>
          </div>
        </Space>
      </Card>

      <div id="section-5.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <SafetyOutlined style={{ marginRight: '8px' }} /> 5.2 Hệ thống báo khói sớm
        </Title>

        <Card title="Hệ thống báo khói sớm" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="orange">Phương pháp</Tag>
              <Text>Lấy mẫu qua các đầu dò nhờ 1 quạt hút nhỏ</Text>
            </div>
            <div>
              <Tag color="orange">Phân tích</Tag>
              <Text>Phân tích, phát hiện và gửi tín hiệu về tủ trung tâm</Text>
            </div>
            <div>
              <Tag color="orange">Tủ báo khói sớm</Tag>
              <Text>HSSD tại các phòng chức năng</Text>
            </div>
            <div>
              <Tag color="orange">Kết nối</Tag>
              <Text>Gửi về tủ trung tâm báo cháy phòng NOC</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-5.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <SafetyOutlined style={{ marginRight: '8px' }} /> 5.3 Hệ thống giám sát đồ họa
        </Title>

        <Card title="Hệ thống giám sát đồ họa" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="purple">Phần mềm giám sát</Tag>
              <Text>Máy trạm cài đặt phần mềm giám sát hệ thống báo cháy</Text>
            </div>
            <div>
              <Tag color="purple">Màn hình hiển thị</Tag>
              <Text>View lên màn hình lớn</Text>
            </div>
            <div>
              <Tag color="purple">Tính năng cách ly</Tag>
              <Text>Enable/disable từng Zone</Text>
            </div>
            <div>
              <Tag color="purple">Màn hình cảm ứng</Tag>
              <Text>Màn hình hiển thị phụ dạng LCD có cảm ứng dễ thao tác</Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default FireProtectionSection;
