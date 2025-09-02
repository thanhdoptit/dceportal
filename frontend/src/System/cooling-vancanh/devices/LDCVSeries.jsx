import React from 'react';
import { Typography, Card, Table, Space, Tag, Alert } from 'antd';
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const LDCVSeries = () => {
  return (
    <div id="section-2.3" className="content-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <SettingOutlined style={{ marginRight: '8px' }} />
        2.3. PAC UNIFLAIR LDCV Series - TTDL Vân Canh
      </Title>

      <div id="section-2.3.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> 2.3.1. Thông tin chung
        </Title>

        <Alert
          message="Thiết bị làm mát phòng lớn"
          description="PAC UNIFLAIR LDCV Series là thiết bị làm mát phòng lớn được sử dụng trong TTDL Vân Canh cho các phòng server có công suất cao."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="Thông tin cơ bản" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div key="brand">
              <Tag color="blue">Hãng sản xuất</Tag>
              <Text>UNIFLAIR</Text>
            </div>
            <div key="model">
              <Tag color="blue">Model</Tag>
              <Text>LDCV0600A, LDCV1800A, LDCV3400A, LDCV4300A</Text>
            </div>
            <div key="type">
              <Tag color="blue">Loại thiết bị</Tag>
              <Text>Large Room Cooling</Text>
            </div>
            <div key="capacity">
              <Tag color="blue">Công suất lạnh</Tag>
              <Text>16.8-110kW</Text>
            </div>
            <div key="precision">
              <Tag color="blue">Độ chính xác nhiệt độ</Tag>
              <Text>±0.5°C</Text>
            </div>
            <div key="humidity">
              <Tag color="blue">Điều khiển độ ẩm</Tag>
              <Text>45-55%</Text>
            </div>
          </Space>
        </Card>

        <Card title="Thông số kỹ thuật chi tiết" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              { key: '1', model: 'LDCV0600A', capacity: '16.8 kW', voltage: '380V/3P/50Hz', current: '20A' },
              { key: '2', model: 'LDCV1800A', capacity: '64.4 kW', voltage: '380V/3P/50Hz', current: '75A' },
              { key: '3', model: 'LDCV3400A', capacity: '79.8 kW', voltage: '380V/3P/50Hz', current: '90A' },
              { key: '4', model: 'LDCV4300A', capacity: '110 kW', voltage: '380V/3P/50Hz', current: '120A' },
            ]}
            columns={[
              {
                title: 'Model',
                dataIndex: 'model',
                key: 'model',
                width: '25%',
                render: (text) => <Tag color="green">{text}</Tag>
              },
              {
                title: 'Công suất lạnh',
                dataIndex: 'capacity',
                key: 'capacity',
                width: '25%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Điện áp',
                dataIndex: 'voltage',
                key: 'voltage',
                width: '25%',
                render: (text) => <Text>{text}</Text>
              },
              {
                title: 'Dòng điện',
                dataIndex: 'current',
                key: 'current',
                width: '25%',
                render: (text) => <Text>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title="Đặc điểm kỹ thuật nổi bật" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li><Text strong>Công suất lớn:</Text> Phù hợp cho phòng server có tải nhiệt cao</li>
              <li><Text strong>Hiệu suất tối ưu:</Text> Thiết kế tối ưu cho môi trường datacenter</li>
              <li><Text strong>Điều khiển thông minh:</Text> Hệ thống điều khiển tiên tiến</li>
              <li><Text strong>Tích hợp BMS:</Text> Giao tiếp Modbus, tích hợp hệ thống giám sát</li>
              <li><Text strong>Vận hành ổn định:</Text> Thiết kế robust cho vận hành 24/7</li>
              <li><Text strong>Bảo trì dễ dàng:</Text> Cấu trúc module, dễ dàng thay thế linh kiện</li>
            </ul>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.3.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.3.2. Hướng dẫn lắp đặt
        </Title>

        <Card title="Yêu cầu lắp đặt" style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Vị trí lắp đặt</Title>
          <Paragraph>
            <ul>
              <li>Đặt trong phòng server, cách tường tối thiểu 1m</li>
              <li>Đảm bảo không gian thông gió phía trước và sau</li>
              <li>Khoảng cách giữa các thiết bị tối thiểu 1.5m</li>
              <li>Đặt trên sàn phẳng, chắc chắn</li>
              <li>Có thể lắp đặt trên sàn nâng</li>
            </ul>
          </Paragraph>

          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Hệ thống điện</Title>
          <Paragraph>
            <ul>
              <li>Điện áp: 380V/3P/50Hz</li>
              <li>Dây cáp điện theo tiêu chuẩn</li>
              <li>Nối đất an toàn</li>
              <li>Bảo vệ quá tải và ngắn mạch</li>
              <li>Tủ điện riêng cho từng thiết bị</li>
            </ul>
          </Paragraph>

          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Hệ thống ống gió</Title>
          <Paragraph>
            <ul>
              <li>Ống gió cấp và hồi phù hợp</li>
              <li>Van điều chỉnh lưu lượng</li>
              <li>Bộ lọc không khí</li>
              <li>Đo lưu lượng gió</li>
              <li>Hệ thống phân phối gió đồng đều</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Quy trình lắp đặt" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ol>
              <li>Kiểm tra và chuẩn bị mặt bằng</li>
              <li>Đặt thiết bị lên vị trí</li>
              <li>Lắp đặt hệ thống điện</li>
              <li>Kết nối hệ thống ống gió</li>
              <li>Kiểm tra rò rỉ gas</li>
              <li>Chạy thử và hiệu chỉnh</li>
              <li>Bàn giao và hướng dẫn vận hành</li>
            </ol>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.3.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.3.3. Hướng dẫn vận hành và kiểm tra hàng ngày
        </Title>

        <Card title="Khởi động hệ thống" style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra trước khi khởi động</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra nguồn điện 380V</li>
              <li>Kiểm tra hệ thống ống gió</li>
              <li>Kiểm tra bộ lọc không khí</li>
              <li>Kiểm tra áp suất gas</li>
              <li>Kiểm tra các van và thiết bị phụ</li>
              <li>Kiểm tra hệ thống phân phối gió</li>
            </ul>
          </Paragraph>

          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Quy trình khởi động</Title>
          <Paragraph>
            <ol>
              <li>Bật nguồn tủ điện</li>
              <li>Khởi động quạt gió</li>
              <li>Khởi động máy nén</li>
              <li>Kiểm tra nhiệt độ và độ ẩm</li>
              <li>Theo dõi quá trình vận hành</li>
              <li>Ghi chép thông số</li>
            </ol>
          </Paragraph>
        </Card>

        <Card title="Kiểm tra hàng ngày" style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Thông số cần kiểm tra</Title>
          <Table
            dataSource={[
              { key: '1', parameter: 'Nhiệt độ phòng', normal: '22±2°C', check: 'Đọc cảm biến nhiệt độ' },
              { key: '2', parameter: 'Độ ẩm phòng', normal: '45-55%', check: 'Đọc cảm biến độ ẩm' },
              { key: '3', parameter: 'Nhiệt độ gió cấp', normal: '16-18°C', check: 'Đọc cảm biến gió cấp' },
              { key: '4', parameter: 'Dòng điện máy nén', normal: '<120A', check: 'Đọc ampe kế' },
              { key: '5', parameter: 'Áp suất gas cao', normal: '15-18 bar', check: 'Đọc đồng hồ' },
              { key: '6', parameter: 'Áp suất gas thấp', normal: '3-4 bar', check: 'Đọc đồng hồ' },
              { key: '7', parameter: 'Lưu lượng gió', normal: 'Theo thiết kế', check: 'Kiểm tra van gió' },
              { key: '8', parameter: 'Nhiệt độ các điểm trong phòng', normal: '22±3°C', check: 'Đo nhiệt độ tại các vị trí' },
            ]}
            columns={[
              {
                title: 'Thông số',
                dataIndex: 'parameter',
                key: 'parameter',
                width: '30%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Giá trị bình thường',
                dataIndex: 'normal',
                key: 'normal',
                width: '25%',
                render: (text) => <Tag color="green">{text}</Tag>
              },
              {
                title: 'Cách kiểm tra',
                dataIndex: 'check',
                key: 'check',
                width: '45%',
                render: (text) => <Text>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>

      <div id="section-2.3.4" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ExclamationCircleOutlined style={{ marginRight: '8px' }} /> 2.3.4. Hướng dẫn xác định nguyên nhân lỗi
        </Title>

        <Alert
          message="Xử lý sự cố"
          description="Khi có sự cố, hệ thống sẽ hiển thị mã lỗi trên màn hình điều khiển. Dưới đây là các lỗi thường gặp và cách xử lý."
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="Các lỗi thường gặp" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                error: 'E01 - Lỗi áp suất thấp',
                cause: 'Thiếu gas, rò rỉ gas, cảm biến lỗi',
                action: 'Kiểm tra rò rỉ, nạp gas, thay cảm biến'
              },
              {
                key: '2',
                error: 'E02 - Lỗi áp suất cao',
                cause: 'Dàn nóng bẩn, quạt dàn nóng lỗi',
                action: 'Vệ sinh dàn nóng, kiểm tra quạt'
              },
              {
                key: '3',
                error: 'E03 - Lỗi nhiệt độ cao',
                cause: 'Tải nhiệt cao, bộ lọc bẩn',
                action: 'Kiểm tra tải, vệ sinh bộ lọc'
              },
              {
                key: '4',
                error: 'E04 - Lỗi máy nén',
                cause: 'Máy nén quá tải, dầu máy nén',
                action: 'Kiểm tra dầu, reset máy nén'
              },
              {
                key: '5',
                error: 'E05 - Lỗi cảm biến',
                cause: 'Cảm biến hỏng, dây tín hiệu đứt',
                action: 'Kiểm tra dây, thay cảm biến'
              },
              {
                key: '6',
                error: 'E06 - Lỗi phân phối gió',
                cause: 'Van gió bị kẹt, ống gió bị tắc',
                action: 'Kiểm tra van gió, thông ống gió'
              }
            ]}
            columns={[
              {
                title: 'Mã lỗi',
                dataIndex: 'error',
                key: 'error',
                width: '25%',
                render: (text) => <Tag color="red">{text}</Tag>
              },
              {
                title: 'Nguyên nhân',
                dataIndex: 'cause',
                key: 'cause',
                width: '35%',
                render: (text) => <Text>{text}</Text>
              },
              {
                title: 'Cách xử lý',
                dataIndex: 'action',
                key: 'action',
                width: '40%',
                render: (text) => <Text>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>

      <div id="section-2.3.5" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.3.5. Quy trình và chu kỳ bảo trì
        </Title>

        <Card title="Bảo trì định kỳ" style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng tháng</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra thông số vận hành</li>
              <li>Vệ sinh bộ lọc không khí</li>
              <li>Kiểm tra rò rỉ gas</li>
              <li>Kiểm tra hệ thống điện</li>
              <li>Kiểm tra hệ thống phân phối gió</li>
              <li>Ghi chép nhật ký vận hành</li>
            </ul>
          </Paragraph>

          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng quý</Title>
          <Paragraph>
            <ul>
              <li>Vệ sinh dàn nóng</li>
              <li>Kiểm tra và thay dầu máy nén</li>
              <li>Kiểm tra cảm biến</li>
              <li>Hiệu chỉnh hệ thống điều khiển</li>
              <li>Vệ sinh hệ thống ống gió</li>
            </ul>
          </Paragraph>

          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng năm</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra toàn bộ hệ thống</li>
              <li>Thay thế bộ lọc</li>
              <li>Kiểm tra và bảo dưỡng máy nén</li>
              <li>Hiệu chỉnh hệ thống</li>
              <li>Kiểm tra hệ thống phân phối gió</li>
              <li>Lập báo cáo bảo trì</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Lưu ý bảo trì" style={{ marginBottom: '20px' }}>
          <Alert
            message="An toàn"
            description="Luôn tắt nguồn và khóa an toàn trước khi thực hiện bảo trì. Sử dụng dụng cụ bảo hộ phù hợp."
            type="warning"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Paragraph>
            <ul>
              <li>Chỉ nhân viên được đào tạo mới được thực hiện bảo trì</li>
              <li>Tuân thủ quy trình an toàn</li>
              <li>Ghi chép đầy đủ các hoạt động bảo trì</li>
              <li>Báo cáo ngay các sự cố bất thường</li>
              <li>Đặc biệt chú ý đến hệ thống phân phối gió</li>
            </ul>
          </Paragraph>
        </Card>
      </div>
    </div>
  );
};

export default LDCVSeries;
