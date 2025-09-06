import React from 'react';
import { Card, Typography, Alert, Space, Tag, Divider, Steps, Collapse, Table } from 'antd';
import {
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ToolOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { PasswordField } from '../../shared';

const { Title, Paragraph, Text } = Typography;

const AFM4500B = () => {
  return (
    <div id='section-2.6' className='subsection'>
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        2.6. Quạt sàn AFM4500B
      </Title>

      <div id='section-2.6.1' className='subsection'>
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> 2.6.1. Thông tin chung
        </Title>

        <Card title='Cấu tạo chính' style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                component: 'Quạt EC',
                description: 'Sử dụng một quạt công nghệ EC (Electronically Commutated)',
              },
              {
                key: '2',
                component: 'Bộ điều khiển vi xử lý',
                description: 'Dùng để giám sát, điều khiển và hiển thị trạng thái hoạt động',
              },
              {
                key: '3',
                component: 'Cảm biến nhiệt độ',
                description: 'Đi kèm hai cảm biến nhiệt độ cho Zone A và Zone B',
              },
              {
                key: '4',
                component: 'Lưới sàn và cánh đảo gió',
                description:
                  'Bao gồm lưới sàn chịu lực phía trên và các cánh đảo gió có thể điều chỉnh để hướng luồng khí',
              },
              {
                key: '5',
                component: 'Khung và vỏ',
                description: 'Khung kim loại chứa các bộ phận điện, quạt và lưới bảo vệ',
              },
            ]}
            columns={[
              {
                title: 'Thành phần',
                dataIndex: 'component',
                key: 'component',
                width: '30%',
                render: text => <Tag color='blue'>{text}</Tag>,
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '70%',
                render: text => <Text>{text}</Text>,
              },
            ]}
            pagination={false}
            size='small'
            bordered
          />
        </Card>

        <Card title='Thông số kỹ thuật' style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              { key: '1', spec: 'Nguồn điện', value: '230V/1 pha + N/50Hz' },
              { key: '2', spec: 'Lưu lượng gió tối đa', value: '1.38 m³/s' },
              { key: '3', spec: 'Lưu lượng gió danh định', value: '0.8 m³/s' },
              { key: '4', spec: 'Lưu lượng gió tối thiểu', value: '0.53 m³/s' },
              { key: '5', spec: 'Công suất tiêu thụ (danh định)', value: '0.39 kW' },
              {
                key: '6',
                spec: 'Kích thước (Cao x Dài x Rộng)',
                value: '230 mm x 600 mm x 600 mm',
              },
              { key: '7', spec: 'Dòng điện hoạt động (OA) - Tốc độ tối thiểu', value: '0.65A' },
              { key: '8', spec: 'Dòng điện hoạt động (OA) - Tốc độ danh định', value: '1.2A' },
              { key: '9', spec: 'Dòng điện hoạt động (OA) - Tốc độ tối đa', value: '2.2A' },
            ]}
            columns={[
              {
                title: 'Thông số',
                dataIndex: 'spec',
                key: 'spec',
                width: '40%',
                render: text => <Text strong>{text}</Text>,
              },
              {
                title: 'Giá trị',
                dataIndex: 'value',
                key: 'value',
                width: '60%',
                render: text => <Text>{text}</Text>,
              },
            ]}
            pagination={false}
            size='small'
            bordered
          />
        </Card>
      </div>

      <div id='section-2.6.2' className='subsection'>
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.6.2. Hướng dẫn lắp đặt
        </Title>

        <Card title='Hướng dẫn lắp đặt chi tiết' style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Vị trí lắp đặt
          </Title>
          <Paragraph>
            Mỗi module phải được đặt trực tiếp lên kết cấu gồm bốn cột và thanh giằng của hệ thống
            sàn nâng. Có các tay cầm bên trong module để hỗ trợ việc đặt thiết bị vào vị trí.
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Khoảng hở
          </Title>
          <Paragraph>
            Để đảm bảo luồng không khí, cần duy trì khoảng cách tối thiểu 150 mm từ mặt sàn bê tông
            (basement) đến đáy của module.
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Kết nối điện
          </Title>
          <Alert
            message='Lưu ý an toàn'
            description='Trước khi thao tác, hãy đảm bảo đã ngắt nguồn điện cung cấp cho thiết bị.'
            type='warning'
            showIcon
            style={{ marginBottom: '15px' }}
          />
          <Paragraph>
            <ol>
              <li>
                Kiểm tra điện áp nguồn phải tương ứng với thông số trên nhãn dữ liệu của thiết bị.
                Điện áp phải nằm trong khoảng ±10% so với giá trị danh định
              </li>
              <li>
                Kết nối cáp nguồn vào đầu vào (màu nâu = pha; xanh dương = trung tính; vàng-xanh =
                đất)
              </li>
              <li>
                Kết nối các đầu dò nhiệt độ và cáp LAN vào các cổng cắm tương ứng trên bo mạch
              </li>
            </ol>
          </Paragraph>
        </Card>
      </div>

      <div id='section-2.6.3' className='subsection'>
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.6.3. Hướng dẫn vận hành
        </Title>

        <Card title='Hệ thống điều khiển' style={{ marginBottom: '20px' }}>
          <Paragraph>
            Hệ thống điều khiển sẽ tự động điều chỉnh luồng không khí do quạt tạo ra dựa trên nhiệt
            độ từ các đầu dò.
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Bảng điều khiển
          </Title>
          <Table
            dataSource={[
              {
                key: '1',
                component: 'Màn hình',
                function: 'Hiển thị giá trị của đầu dò và mã lỗi khi có báo động',
              },
              {
                key: '2',
                component: 'Nút "SEL"',
                function: 'Dùng để hiển thị và cài đặt giá trị nhiệt độ mục tiêu (set point)',
              },
              {
                key: '3',
                component: 'Nút "PRG/mute"',
                function:
                  'Nhấn giữ 5 giây để truy cập các thông số thường dùng; dùng để tắt chuông báo động',
              },
              {
                key: '4',
                component: 'Nút mũi tên Lên/Xuống',
                function:
                  'Dùng để xem giá trị của đầu dò 1 và 2, cuộn qua các thông số hoặc tăng/giảm giá trị khi lập trình',
              },
            ]}
            columns={[
              {
                title: 'Thành phần',
                dataIndex: 'component',
                key: 'component',
                width: '30%',
                render: text => <Text strong>{text}</Text>,
              },
              {
                title: 'Chức năng',
                dataIndex: 'function',
                key: 'function',
                width: '70%',
                render: text => <Text>{text}</Text>,
              },
            ]}
            pagination={false}
            size='small'
            bordered
          />

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Thay đổi cài đặt
          </Title>
          <Paragraph>
            <ol>
              <li>Để thay đổi giá trị set point, nhấn giữ nút "PRG/mute" trong 5 giây</li>
              <li>
                Nhập mật khẩu{' '}
                <PasswordField password='77' label='' style={{ display: 'inline-flex' }} /> bằng các
                nút mũi tên
              </li>
              <li>Nhấn "SEL" để xác nhận</li>
              <li>Sử dụng các nút mũi tên để thay đổi giá trị và nhấn "SEL" để lưu</li>
            </ol>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Thông tin cài đặt
          </Title>
          <Table
            dataSource={[
              {
                key: '1',
                parameter: 'Mật khẩu mặc định',
                value: <PasswordField password='77' label='' style={{ display: 'inline-flex' }} />,
                description: 'Mật khẩu của nhà sản xuất',
              },
              {
                key: '2',
                parameter: 'Set point 1',
                value: '35°C',
                description: 'Giá trị cài đặt gốc quan trọng',
              },
              {
                key: '3',
                parameter: 'Giá trị đầu ra tối thiểu',
                value: '20%',
                description: 'Giá trị cài đặt gốc quan trọng',
              },
              {
                key: '4',
                parameter: 'Giá trị đầu ra tối đa',
                value: '70%',
                description: 'Giá trị cài đặt gốc quan trọng',
              },
            ]}
            columns={[
              {
                title: 'Thông số',
                dataIndex: 'parameter',
                key: 'parameter',
                width: '30%',
                render: text => <Text strong>{text}</Text>,
              },
              {
                title: 'Giá trị',
                dataIndex: 'value',
                key: 'value',
                width: '20%',
                render: text => <Tag color='blue'>{text}</Tag>,
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '50%',
                render: text => <Text>{text}</Text>,
              },
            ]}
            pagination={false}
            size='small'
            bordered
          />
        </Card>
      </div>

      <div id='section-2.6.4' className='subsection'>
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ExclamationCircleOutlined style={{ marginRight: '8px' }} /> 2.6.4. Cách xác nhận lỗi
        </Title>

        <Card title='Hệ thống giám sát lỗi' style={{ marginBottom: '20px' }}>
          <Paragraph>
            Thiết bị liên tục kiểm soát và kiểm tra các điều kiện báo động trong quá trình hoạt
            động.
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Dấu hiệu cảnh báo
          </Title>
          <Paragraph>
            <ul>
              <li>
                Khi có lỗi, màn hình sẽ hiển thị một thông báo xác định loại báo động, xen kẽ với
                thông số hiển thị thông thường
              </li>
              <li>Chuông báo động sẽ kêu</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Bảng mã lỗi thường gặp
          </Title>
          <Table
            dataSource={[
              {
                key: '1',
                error: 'Er0 / Er1',
                description: 'Mất kết nối đầu dò ST1 / ST2',
                impact:
                  'Quá trình điều khiển bị vô hiệu hóa, đầu ra analog được xác định bởi thông số C10',
                solution:
                  'Tự động khôi phục ngay khi đầu dò được kết nối lại; cần reset thủ công để tắt chuông và xóa tin nhắn',
              },
              {
                key: '2',
                error: 'Er2',
                description: 'Lỗi bộ nhớ thông số',
                impact: 'Bị vô hiệu hóa, đầu ra analog về 0 V',
                solution: 'Cần lập trình lại',
              },
              {
                key: '3',
                error: 'Er4',
                description: 'Báo động nhiệt độ cao',
                impact: 'Đầu ra được xác định bởi thông số C10',
                solution: 'Tự động khôi phục với chênh lệch có thể lập trình',
              },
              {
                key: '4',
                error: 'Er5',
                description: 'Báo động nhiệt độ thấp',
                impact: 'Tương tự Er4',
                solution: 'Tương tự Er4',
              },
            ]}
            columns={[
              {
                title: 'Mã lỗi',
                dataIndex: 'error',
                key: 'error',
                width: '15%',
                render: text => (
                  <Tag color='red' style={{ fontSize: '11px' }}>
                    {text}
                  </Tag>
                ),
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '25%',
                render: text => <Text style={{ fontSize: '11px' }}>{text}</Text>,
              },
              {
                title: 'Ảnh hưởng đến hoạt động',
                dataIndex: 'impact',
                key: 'impact',
                width: '30%',
                render: text => <Text style={{ fontSize: '11px' }}>{text}</Text>,
              },
              {
                title: 'Cách xử lý',
                dataIndex: 'solution',
                key: 'solution',
                width: '30%',
                render: text => <Text style={{ fontSize: '11px' }}>{text}</Text>,
              },
            ]}
            pagination={false}
            size='small'
            bordered
          />

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Tắt báo động
          </Title>
          <Paragraph>
            Nhấn nút "PRG" một lần để tắt chuông và nhấn lần thứ hai để xóa thông báo lỗi khỏi màn
            hình (sau khi nguyên nhân đã được khắc phục).
          </Paragraph>
        </Card>
      </div>
      <div id='section-2.6.5' className='subsection'>
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.6.5. Bảo trì
        </Title>

        <Alert
          message='Lưu ý an toàn'
          description='Tất cả các hoạt động bảo trì và dịch vụ phải được thực hiện khi thiết bị đã ngắt điện.'
          type='warning'
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title='Kiểm tra định kỳ' style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Kiểm tra định kỳ hàng tuần
          </Title>
          <Table
            dataSource={[
              {
                key: '1',
                check: 'Điều kiện phòng',
                task: 'Kiểm tra các điều kiện phòng trên màn hình bảng điều khiển có bình thường không',
              },
              {
                key: '2',
                check: 'Nhiệt độ và độ ồn',
                task: 'Kiểm tra nhiệt độ và độ ồn của quạt ở mức bình thường',
              },
              {
                key: '3',
                check: 'Điện áp nguồn',
                task: 'Kiểm tra điện áp nguồn cung cấp có nằm trong giới hạn thiết kế không',
              },
            ]}
            columns={[
              {
                title: 'Hạng mục kiểm tra',
                dataIndex: 'check',
                key: 'check',
                width: '30%',
                render: text => <Tag color='blue'>{text}</Tag>,
              },
              {
                title: 'Nội dung kiểm tra',
                dataIndex: 'task',
                key: 'task',
                width: '70%',
                render: text => <Text>{text}</Text>,
              },
            ]}
            pagination={false}
            size='small'
            bordered
          />

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
            Kiểm tra định kỳ hàng tháng
          </Title>
          <Paragraph>
            Kiểm tra các đầu nối điện có được siết chặt và ở trong tình trạng tốt không.
          </Paragraph>
        </Card>

        <Card title='Giải quyết vấn đề' style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>
                Việc giải quyết sự cố được thực hiện nhờ màn hình điều khiển của bộ vi xử lý. Khi có
                báo động, hãy xem mã lỗi trên bảng điều khiển
              </li>
              <li>
                Nếu cần thiết, hãy gọi cho bên bảo trì trong hợp đồng và mô tả lỗi đang gặp phải
              </li>
            </ul>
          </Paragraph>
        </Card>
      </div>
    </div>
  );
};

export default AFM4500B;
