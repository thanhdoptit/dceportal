import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    SettingOutlined,
    ToolOutlined
} from '@ant-design/icons';
import { Alert, Card, Space, Table, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const EasyInRowCW = () => {
  return (
    <div>
      <div id="section-2-4" className="subsection">
      <Title level={3} >
        <SettingOutlined style={{ marginRight: '8px' }} />
        2.4. Easy InRow CW Series - TTDL Vân Canh
      </Title>

      <div id="section-2.4.1" className="subsection">
        <Title level={4}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> 2.4.1. Thông tin chung
        </Title>

        <Alert
          message="Thiết bị làm mát trực tiếp tại nguồn nhiệt"
          description="Easy InRow CW Series là thiết bị làm mát trực tiếp tại nguồn nhiệt, được lắp đặt trong hàng rack để tối ưu hiệu quả làm mát."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="Thông tin cơ bản" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div key="brand">
              <Tag color="blue">Hãng sản xuất</Tag>
              <Text>Easy</Text>
            </div>
            <div key="model">
              <Tag color="blue">Model</Tag>
              <Text>ERC311AD0HPE</Text>
            </div>
            <div key="type">
              <Tag color="blue">Loại thiết bị</Tag>
              <Text>Chilled Water InRow Cooling</Text>
            </div>
            <div key="capacity">
              <Tag color="blue">Công suất lạnh</Tag>
              <Text>21.6kW</Text>
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
              { key: '1', spec: 'Công suất lạnh danh định', value: '21.6 kW' },
              { key: '2', spec: 'Lưu lượng nước lạnh', value: '3.6 m³/h' },
              { key: '3', spec: 'Nhiệt độ nước lạnh vào', value: '7°C' },
              { key: '4', spec: 'Nhiệt độ nước lạnh ra', value: '12°C' },
              { key: '5', spec: 'Áp suất nước', value: '2-4 bar' },
              { key: '6', spec: 'Lưu lượng gió', value: '3,600 m³/h' },
              { key: '7', spec: 'Điện áp quạt', value: '24V DC' },
              { key: '8', spec: 'Kích thước (CxRxS)', value: '600 x 1200 x 1000 mm' },
              { key: '9', spec: 'Trọng lượng', value: '85 kg' },
              { key: '10', spec: 'Kết nối nước', value: 'DN25' },
            ]}
            columns={[
              {
                title: 'Thông số',
                dataIndex: 'spec',
                key: 'spec',
                width: '40%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Giá trị',
                dataIndex: 'value',
                key: 'value',
                width: '60%',
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
              <li><Text strong>Làm mát trực tiếp:</Text> Đặt trong hàng rack, làm mát trực tiếp tại nguồn nhiệt</li>
              <li><Text strong>Tiết kiệm không gian:</Text> Thiết kế compact, không chiếm nhiều không gian</li>
              <li><Text strong>Hiệu quả làm mát cao:</Text> Tối ưu hiệu quả làm mát cho từng rack</li>
              <li><Text strong>Dễ dàng mở rộng:</Text> Có thể thêm thiết bị khi cần mở rộng</li>
              <li><Text strong>Tiết kiệm năng lượng:</Text> Chỉ làm mát khi cần thiết</li>
              <li><Text strong>Tích hợp BMS:</Text> Giao tiếp Modbus, tích hợp hệ thống giám sát</li>
            </ul>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.4.2" className="subsection">
        <Title level={4}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.4.2. Hướng dẫn cài đặt và cấu hình ban đầu
        </Title>

        <Card title="Yêu cầu lắp đặt" style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Vị trí lắp đặt</Title>
          <Paragraph>
            <ul>
              <li>Lắp đặt trong hàng rack, giữa các tủ server</li>
              <li>Khoảng cách tối thiểu 1U giữa các thiết bị</li>
              <li>Đảm bảo không gian thông gió phía trước và sau</li>
              <li>Đặt trên sàn nâng hoặc sàn phẳng</li>
            </ul>
          </Paragraph>

          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Hệ thống nước</Title>
          <Paragraph>
            <ul>
              <li>Kết nối nước lạnh DN25</li>
              <li>Van cô lập và van cân bằng</li>
              <li>Bộ lọc nước và xả khí</li>
              <li>Đồng hồ đo lưu lượng và áp suất</li>
              <li>Ống nước chịu áp lực</li>
            </ul>
          </Paragraph>

          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Hệ thống điện</Title>
          <Paragraph>
            <ul>
              <li>Điện áp quạt: 24V DC</li>
              <li>Nguồn điều khiển: 24V DC</li>
              <li>Dây cáp tín hiệu</li>
              <li>Nối đất an toàn</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Quy trình lắp đặt" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ol>
              <li>Kiểm tra và chuẩn bị vị trí lắp đặt</li>
              <li>Đặt thiết bị vào vị trí trong hàng rack</li>
              <li>Kết nối hệ thống nước lạnh</li>
              <li>Kết nối hệ thống điện</li>
              <li>Kiểm tra rò rỉ nước</li>
              <li>Chạy thử và hiệu chỉnh</li>
              <li>Bàn giao và hướng dẫn vận hành</li>
            </ol>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.4.3" className="subsection">
        <Title level={4}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.4.3. Hướng dẫn vận hành và kiểm tra hàng ngày
        </Title>

        <Card title="Khởi động hệ thống" style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra trước khi khởi động</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra hệ thống nước lạnh</li>
              <li>Kiểm tra áp suất nước</li>
              <li>Kiểm tra lưu lượng nước</li>
              <li>Kiểm tra hệ thống điện</li>
              <li>Kiểm tra các van và thiết bị phụ</li>
            </ul>
          </Paragraph>

          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Quy trình khởi động</Title>
          <Paragraph>
            <ol>
              <li>Mở van nước lạnh</li>
              <li>Kiểm tra lưu lượng nước</li>
              <li>Khởi động quạt</li>
              <li>Kiểm tra nhiệt độ nước vào/ra</li>
              <li>Theo dõi quá trình vận hành</li>
              <li>Ghi chép thông số</li>
            </ol>
          </Paragraph>
        </Card>

        <Card title="Kiểm tra hàng ngày" style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Thông số cần kiểm tra</Title>
          <Table
            dataSource={[
              { key: '1', parameter: 'Nhiệt độ nước vào', normal: '7°C', check: 'Đọc cảm biến nhiệt độ' },
              { key: '2', parameter: 'Nhiệt độ nước ra', normal: '12°C', check: 'Đọc cảm biến nhiệt độ' },
              { key: '3', parameter: 'Áp suất nước', normal: '2-4 bar', check: 'Đọc đồng hồ áp suất' },
              { key: '4', parameter: 'Lưu lượng nước', normal: '3.6 m³/h', check: 'Đọc đồng hồ lưu lượng' },
              { key: '5', parameter: 'Tốc độ quạt', normal: 'Theo thiết kế', check: 'Kiểm tra tín hiệu quạt' },
              { key: '6', parameter: 'Nhiệt độ không khí ra', normal: '16-18°C', check: 'Đọc cảm biến nhiệt độ' },
              { key: '7', parameter: 'Rò rỉ nước', normal: 'Không có', check: 'Kiểm tra trực quan' },
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

      <div id="section-2.4.4" className="subsection">
        <Title level={4}>
          <ExclamationCircleOutlined style={{ marginRight: '8px' }} /> 2.4.4. Hướng dẫn xác định nguyên nhân lỗi
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
                error: 'E01 - Lỗi lưu lượng nước thấp',
                cause: 'Van bị đóng, ống bị tắc, bơm lỗi',
                action: 'Kiểm tra van, thông ống, kiểm tra bơm'
              },
              {
                key: '2',
                error: 'E02 - Lỗi áp suất nước cao',
                cause: 'Van bị đóng, ống bị tắc',
                action: 'Kiểm tra van, thông ống'
              },
              {
                key: '3',
                error: 'E03 - Lỗi nhiệt độ nước cao',
                cause: 'Chiller lỗi, tải nhiệt cao',
                action: 'Kiểm tra chiller, kiểm tra tải'
              },
              {
                key: '4',
                error: 'E04 - Lỗi quạt',
                cause: 'Quạt bị kẹt, mất điện',
                action: 'Kiểm tra quạt, kiểm tra điện'
              },
              {
                key: '5',
                error: 'E05 - Lỗi cảm biến',
                cause: 'Cảm biến hỏng, dây tín hiệu đứt',
                action: 'Kiểm tra dây, thay cảm biến'
              },
              {
                key: '6',
                error: 'E06 - Rò rỉ nước',
                cause: 'Ống nước bị rò rỉ, kết nối lỏng',
                action: 'Kiểm tra ống, siết lại kết nối'
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

      <div id="section-2.4.5" className="subsection">
        <Title level={4}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.4.5. Quy định và chu kỳ bảo trì
        </Title>

        <Card title="Bảo trì định kỳ" style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng tháng</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra thông số vận hành</li>
              <li>Kiểm tra rò rỉ nước</li>
              <li>Kiểm tra hệ thống điện</li>
              <li>Vệ sinh bộ lọc nước</li>
              <li>Ghi chép nhật ký vận hành</li>
            </ul>
          </Paragraph>

          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng quý</Title>
          <Paragraph>
            <ul>
              <li>Vệ sinh bộ trao đổi nhiệt</li>
              <li>Kiểm tra cảm biến</li>
              <li>Hiệu chỉnh hệ thống điều khiển</li>
              <li>Kiểm tra van nước</li>
            </ul>
          </Paragraph>

          <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng năm</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra toàn bộ hệ thống</li>
              <li>Thay thế bộ lọc nước</li>
              <li>Kiểm tra và bảo dưỡng quạt</li>
              <li>Hiệu chỉnh hệ thống</li>
              <li>Lập báo cáo bảo trì</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Lưu ý bảo trì" style={{ marginBottom: '20px' }}>
          <Alert
            message="An toàn"
            description="Luôn tắt nguồn và khóa van nước trước khi thực hiện bảo trì. Sử dụng dụng cụ bảo hộ phù hợp."
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
              <li>Đặc biệt chú ý đến hệ thống nước</li>
            </ul>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.4.6" className="subsection">
        <Title level={4}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.4.6. Hướng dẫn bảo trì từng thành phần
        </Title>

        <Card title="Bảo trì từng thành phần" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                component: 'Bộ trao đổi nhiệt',
                function: 'Trao đổi nhiệt giữa nước lạnh và không khí',
                maintenance: 'Hàng quý',
                procedure: 'Vệ sinh bề mặt trao đổi nhiệt, kiểm tra rò rỉ'
              },
              {
                key: '2',
                component: 'Quạt',
                function: 'Tạo luồng không khí qua bộ trao đổi nhiệt',
                maintenance: 'Hàng năm',
                procedure: 'Kiểm tra hoạt động, vệ sinh cánh quạt'
              },
              {
                key: '3',
                component: 'Van nước',
                function: 'Điều khiển lưu lượng nước',
                maintenance: 'Hàng quý',
                procedure: 'Kiểm tra hoạt động, bôi trơn'
              },
              {
                key: '4',
                component: 'Cảm biến',
                function: 'Đo nhiệt độ và áp suất',
                maintenance: 'Hàng quý',
                procedure: 'Kiểm tra độ chính xác, hiệu chỉnh'
              },
              {
                key: '5',
                component: 'Bộ lọc nước',
                function: 'Lọc cặn bẩn trong nước',
                maintenance: 'Hàng tháng',
                procedure: 'Vệ sinh hoặc thay thế bộ lọc'
              }
            ]}
            columns={[
              {
                title: 'Thành phần',
                dataIndex: 'component',
                key: 'component',
                width: '20%',
                render: (text) => <Tag color="green">{text}</Tag>
              },
              {
                title: 'Chức năng',
                dataIndex: 'function',
                key: 'function',
                width: '30%',
                render: (text) => <Text>{text}</Text>
              },
              {
                title: 'Chu kỳ bảo trì',
                dataIndex: 'maintenance',
                key: 'maintenance',
                width: '15%',
                render: (text) => <Tag color="orange">{text}</Tag>
              },
              {
                title: 'Quy trình bảo trì',
                dataIndex: 'procedure',
                key: 'procedure',
                width: '35%',
                render: (text) => <Text>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>
      </div>
    </div>
  );
};

export default EasyInRowCW;
