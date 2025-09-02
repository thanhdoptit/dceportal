import React from 'react';
import { Card, Typography, Alert, Space, Tag, Divider, Steps, Collapse, Table } from 'antd';
import { 
  SettingOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ToolOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { PasswordField } from '../../shared';

const { Title, Paragraph, Text } = Typography;

const FM40H = () => {
  return (
          <div id="section-2.4" className="subsection">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        2.4. FM40H-AGB-ESD-APC
      </Title>

      <div id="section-2.4.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> 2.4.1. Thông tin chung
        </Title>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="/cooling/FM40.png"
            alt="TDAV2842A đang được sử dụng trong phòng Server 1 và Server 2"
            style={{
              maxWidth: '50%',
              height: 'auto',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'block',
              margin: '0 auto'
            }}
          />
          <Paragraph style={{ marginTop: '10px', fontWeight: 'bold' }}>
            Hiện tại TTDL có tổng cộng 5 điều hòa FM40H, trong đó có 2 điều hòa đặt ở phòng IPS- trước phòng máy chủ 1
          </Paragraph>
        </div>
        <Card title="Thông tin cơ bản" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div key="brand">
              <Tag color="blue">Tên hãng</Tag>
              <Text>APC</Text>
            </div>
            <div key="manufacturer">
              <Tag color="blue">Nhà sản xuất</Tag>
              <Text>American Power Conversion (APC)</Text>
            </div>
            <div key="product-line">
              <Tag color="blue">Dòng sản phẩm</Tag>
              <Text>NetworkAIR FM DX</Text>
            </div>
            <div key="model">
              <Tag color="blue">Model đầy đủ</Tag>
              <Text>FM40H-AGB-ESD</Text>
            </div>
            <div key="type">
              <Tag color="blue">Loại thiết bị</Tag>
              <Text>Điều hòa chính xác dạng tủ đứng (CRAC- Computer Room Air Conditioner), giải nhiệt bằng khí (Air-Cooled)</Text>
            </div>
            <div key="purpose">
              <Tag color="blue">Mục đích sử dụng</Tag>
              <Text>Kiểm soát chính xác nhiệt độ và độ ẩm cho trung tâm dữ liệu</Text>
            </div>
          </Space>
        </Card>

        <Card title="Thông số kỹ thuật chi tiết" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              { key: '1', spec: 'Công suất lạnh danh định', value: '40 kW' },
              { key: '2', spec: 'Cấu hình giải nhiệt', value: 'Giải nhiệt bằng khí (Air-cooled)' },
              { key: '3', spec: 'Môi chất làm lạnh (Gas)', value: 'R407C' },
              { key: '4', spec: 'Máy nén', value: '2 Scroll' },
              { key: '5', spec: 'Mạch gas', value: '2' },
              { key: '6', spec: 'Điện áp', value: '400V' },
              { key: '7', spec: 'Loại điện', value: '3 pha' },
              { key: '8', spec: 'Tần số', value: '50 Hz' },
              { key: '9', spec: 'Kiểu luồng gió', value: 'Thổi sàn (Downflow)' },
              { key: '10', spec: 'Sưởi điện (Electric Reheat)', value: 'Có' },
              { key: '11', spec: 'Tạo ẩm bằng hơi nước (Steam Canister Humidification)', value: 'Có, loại hộp tạo hơi có thể thay thế' },
              { key: '12', spec: 'Trọng lượng (khi đóng gói vận chuyển)', value: '841.5 kg' },
              { key: '13', spec: 'Kích thước bên ngoài (Cao x Rộng x Sâu)', value: '1954 mm x 1800 mm x 889 mm' },
              { key: '14', spec: 'Serial Number IPS', value: 'GK0702120018, GK0709180048' },
              { key: '15', spec: 'Serial Number PCCC', value: 'GK0702120008, GK0702120027, GK0701120002' },
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

        <Card title="Các thành phần chính" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>Máy nén song song (Tandem compressors)</li>
              <li>Dàn bay hơi (DX coil)</li>
              <li>Bộ lọc khí (Air filters)</li>
              <li>Bộ tạo ẩm (Humidifier)</li>
              <li>Bộ sưởi điện (Electric reheat coil)</li>
              <li>Bơm nước ngưng (Condensate pump - Tùy chọn)</li>
              <li>Card quản lý mạng (Network management card - NMC)</li>
              <li>Bộ điều khiển biến tần cho quạt (Variable frequency drive - VFD)</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Kiến trúc hệ thống" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Các thiết bị FM40H có thể được kết nối với nhau theo 3 cấp độ:
          </Paragraph>
          <Table
            dataSource={[
              {
                key: '1',
                level: 'Khối (Module)',
                description: 'Là một tủ điều hòa hoạt động độc lập, dựa trên cảm biến nhiệt độ và độ ẩm của chính nó'
              },
              {
                key: '2',
                level: 'Hệ thống (System)',
                description: 'Là một tập hợp từ 1 đến 3 khối (Module) hoạt động chung với nhau như một thể thống nhất để tăng công suất làm lạnh. Trong một Hệ thống, sẽ có một khối chính (Main Module) điều khiển các khối phụ (Expansion Module). Chỉ có màn hình trên khối chính hoạt động'
              },
              {
                key: '3',
                level: 'Nhóm (Group)',
                description: 'Là một tập hợp từ 2 đến 4 Hệ thống, hoạt động cùng nhau để cung cấp khả năng dự phòng (redundancy) và chia tải (load sharing)'
              }
            ]}
            columns={[
              {
                title: 'Cấp độ',
                dataIndex: 'level',
                key: 'level',
                width: '20%',
                render: (text) => <Tag color="green" style={{ fontSize: '11px' }}>{text}</Tag>
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '80%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>

      <div id="section-2.4.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.4.2. Hướng dẫn cài đặt và cấu hình ban đầu
        </Title>

        <Card title="2.4.2.1. Các hạng mục kiểm tra trước khi vận hành" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra lắp đặt ban đầu</Title>
          <Paragraph>
            <ul>
              <li>Sàn, tường, và trần của phòng phải được bịt kín bằng lớp chống ẩm (vapor barrier) để duy trì độ ẩm ổn định</li>
              <li>Thiết bị phải được lắp đặt chắc chắn, không có dấu hiệu hư hỏng</li>
              <li>Cần có khoảng trống tối thiểu 914 mm (36 inches) phía trước thiết bị để phục vụ cho việc bảo trì</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra hệ thống điện</Title>
          <Paragraph>
            <ul>
              <li>Điện áp đầu vào phải khớp với thông số trên nhãn của thiết bị</li>
              <li>Thiết bị phải được nối đất đúng tiêu chuẩn</li>
              <li>Tất cả các kết nối điện, cầu dao, và terminal phải được siết chặt</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra cơ khí và gas</Title>
          <Paragraph>
            <ul>
              <li>Quạt phải quay trơn tru, không bị kẹt hay cong vênh</li>
              <li>Đường ống thoát nước ngưng phải được lắp đặt đúng độ dốc và không bị tắc</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="2.4.2.2. Cấu hình ban đầu" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Cấu hình hệ thống được thực hiện qua màn hình điều khiển và yêu cầu mật khẩu cấp dịch vụ (service password) cho các thay đổi nâng cao.
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Mật khẩu</Title>
          <Paragraph>
            <ul>
              <li>Hệ thống có 2 cấp mật khẩu: User (cho người dùng cơ bản) và Service (cho kỹ thuật viên)</li>
              <li>Mật khẩu mặc định cho cả hai cấp là <PasswordField password="APC" label="" style={{ display: 'inline-flex' }} /></li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Cài đặt nhiệt độ và độ ẩm (Setpoints)</Title>
          <Table
            dataSource={[
              {
                key: '1',
                parameter: 'Nhiệt độ làm mát (Cool)',
                default_value: '22.2°C (72°F)',
                description: 'Mặc định của nhà máy'
              },
              {
                key: '2',
                parameter: 'Nhiệt độ sưởi lại (Reheat)',
                default_value: '20°C (68°F)',
                description: 'Mặc định của nhà máy'
              },
              {
                key: '3',
                parameter: 'Vùng đệm (Deadband)',
                default_value: '1.1°C (2°F)',
                description: 'Khoảng dung sai để tránh máy bật/tắt liên tục'
              }
            ]}
            columns={[
              {
                title: 'Thông số',
                dataIndex: 'parameter',
                key: 'parameter',
                width: '35%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Giá trị mặc định',
                dataIndex: 'default_value',
                key: 'default_value',
                width: '25%',
                render: (text) => <Tag color="blue">{text}</Tag>
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '40%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>

      <div id="section-2.4.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.4.3. Hướng dẫn vận hành và kiểm tra hàng ngày
        </Title>

        <Card title="2.4.3.1. Vận hành cơ bản" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Giao diện điều khiển</Title>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="/cooling/fmcontrol.png"
              alt="TDAV2842A đang được sử dụng trong phòng Server 1 và Server 2"
              style={{
                maxWidth: '50%',
                height: 'auto',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'block',
                margin: '0 auto'
              }}
            />
            <Paragraph style={{ marginTop: '10px', fontWeight: 'bold' }}>
              Giao diện điều khiển của điều hòa FM40H                   </Paragraph>
          </div>
          <Table
            dataSource={[
              { key: '1', component: '① Đèn báo động nghiêm trọng (Major Alarm)', function: 'Sáng lên khi có lỗi nghiêm trọng' },
              { key: '2', component: '② Đèn báo động cảnh báo (Minor Alarm)', function: 'Sáng lên khi có lỗi cảnh báo, cần chú ý' },
              { key: '3', component: '③ Đèn kiểm tra nhật ký (Check Log)', function: 'Báo hiệu có một sự kiện hoặc báo động mới chưa được xem' },
              { key: '4', component: '④ Đèn trạng thái (Status)', function: 'Sáng khi Khối (Module) đang bật' },
              { key: '5', component: '⑤ Màn hình LCD', function: 'Hiển thị trạng thái, báo động, và các menu cấu hình' },
              { key: '6', component: '⑥, ⑧ Các phím điều hướng', function: 'Dùng để di chuyển lên/xuống và chọn (ENTER)' },
              { key: '7', component: '⑦ Phím ESC', function: 'Dùng để quay lại màn hình trước đó' }
            ]}
            columns={[
              {
                title: 'Thành phần',
                dataIndex: 'component',
                key: 'component',
                width: '50%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Chức năng',
                dataIndex: 'function',
                key: 'function',
                width: '50%',
                render: (text) => <Text>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Khởi động hệ thống</Title>
          <Paragraph>
            <ol>
              <li>Bật nguồn điện tổng</li>
              <li>Tại tủ điều hòa, gạt cầu dao chính (main breaker) sang vị trí "1" (ON)</li>
              <li>Trên màn hình điều khiển, vào Main Menu {'>'} On/Off, và chuyển trạng thái thành On</li>
            </ol>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Tắt hệ thống</Title>
          <Paragraph>
            <ol>
              <li>Trên màn hình điều khiển, vào Main Menu {'>'} On/Off, và chuyển trạng thái thành Off. Thao tác này sẽ dừng các chế độ hoạt động nhưng bộ điều khiển vẫn có điện</li>
              <li>Nhấn nút ngắt khẩn cấp màu đỏ (power interrupt) trên cửa tủ</li>
              <li>Tắt nguồn điện tổng</li>
            </ol>
          </Paragraph>
        </Card>

        <Card title="2.4.3.2. Kiểm tra hàng ngày" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Công việc kiểm tra hàng ngày đối với điều hòa FM40H chủ yếu là quan sát trực quan và theo dõi các thông số vận hành trên màn hình điều khiển để đảm bảo hệ thống hoạt động ổn định và phát hiện sớm các dấu hiệu bất thường.
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra các đèn báo động (Alarm LEDs)</Title>
          <Paragraph>
            Quan sát các đèn LED ở mặt trước của màn hình hiển thị. Đảm bảo đèn Báo động nghiêm trọng (Major Alarm) và đèn Báo động cảnh báo (Minor Alarm) không sáng. Nếu bất kỳ đèn nào trong số này sáng, điều đó cho thấy có một lỗi đang tồn tại cần được xử lý ngay lập tức.
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Theo dõi các màn hình trạng thái tự động cuộn (Scrolling Status Screens)</Title>
          <Paragraph>
            Màn hình LCD sẽ tự động và liên tục cuộn qua 9 màn hình hiển thị thông tin trạng thái khác nhau. Việc quan sát các màn hình này là cách hiệu quả nhất để kiểm tra hàng ngày:
          </Paragraph>
          <Table
            dataSource={[
              {
                key: '1',
                screen: 'Màn hình Báo động đang hoạt động (Active Alarms)',
                description: 'Đây là mục quan trọng nhất cần kiểm tra. Hãy chắc chắn rằng màn hình này không hiển thị bất kỳ cảnh báo nào'
              },
              {
                key: '2',
                screen: 'Màn hình Nhiệt độ & Độ ẩm điều khiển (Control Temp & Humidity)',
                description: 'Kiểm tra các giá trị nhiệt độ và độ ẩm thực tế mà cảm biến đang đo được. So sánh các giá trị này với điểm cài đặt (setpoint) để đảm bảo môi trường trong phòng đang được kiểm soát đúng'
              },
              {
                key: '3',
                screen: 'Màn hình Nhu cầu (Demands)',
                description: 'Xem các màn hình Cool/Dehum Demands (Nhu cầu làm mát/hút ẩm) và Humidify Demand (Nhu cầu tạo ẩm). Các chỉ số phần trăm (%) hiển thị trên màn hình này cho biết hệ thống đang làm việc ở mức độ nào để đáp ứng tải nhiệt'
              },
              {
                key: '4',
                screen: 'Màn hình Trạng thái Nhóm (Group Status)',
                description: 'Nếu thiết bị được kết nối trong một nhóm, hãy kiểm tra màn hình này để xem vai trò (Role) và trạng thái (State) của nó, ví dụ như đang là máy chính (primary) hay dự phòng (backup), đang hoạt động (online) hay chờ (idle)'
              },
              {
                key: '5',
                screen: 'Màn hình Điểm cài đặt (Setpoints)',
                description: 'Lướt qua các màn hình hiển thị điểm cài đặt cho các chế độ Làm mát (Cool), Sưởi (Reheat), Hút ẩm (Dehumidify) và Tạo ẩm (Humidify). Việc này nhằm đảm bảo các thông số cài đặt không bị thay đổi ngoài ý muốn'
              }
            ]}
            columns={[
              {
                title: 'Màn hình',
                dataIndex: 'screen',
                key: 'screen',
                width: '40%',
                render: (text) => <Tag color="blue" style={{ fontSize: '11px' }}>{text}</Tag>
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '60%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra vật lý (tùy chọn)</Title>
          <Paragraph>
            <ul>
              <li>Lắng nghe các tiếng ồn bất thường từ quạt hoặc máy nén</li>
              <li>Đảm bảo không có vật cản trước các cửa hút gió và thổi gió của thiết bị</li>
            </ul>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.4.4" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ExclamationCircleOutlined style={{ marginRight: '8px' }} /> 2.4.4. Hướng dẫn xác định nguyên nhân lỗi
        </Title>

        <Alert
          message="Quy trình xử lý cơ bản"
          description="Khi có lỗi, hệ thống sẽ cảnh báo bằng đèn, tiếng bíp và thông báo trên màn hình."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="2.4.4.1. Quy trình xử lý cơ bản" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ol>
              <li><Text strong>Tắt tiếng bíp:</Text> Vào menu Respond to Alarms để tắt âm thanh cảnh báo</li>
              <li><Text strong>Xem báo động đang hoạt động:</Text> Vào Main {'>'} Respond to Alarms {'>'} View Active Alarms để xem mô tả chi tiết về lỗi</li>
              <li><Text strong>Tra cứu nguyên nhân:</Text> Dựa vào thông báo lỗi, đối chiếu với bảng dưới đây để xác định nguyên nhân và hành động khắc phục</li>
              <li><Text strong>Xóa báo động:</Text> Sau khi khắc phục sự cố, vào Main {'>'} Respond to Alarms {'>'} Clear Active Alarms để xóa cảnh báo</li>
            </ol>
          </Paragraph>
        </Card>

        <Card title="2.4.4.2. Các lỗi thường gặp và cách xác định nguyên nhân" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                error: 'Air Filter Clogged (Lọc gió bị nghẹt)',
                causes: [
                  'Lọc gió tích tụ quá nhiều bụi bẩn',
                  'Cảm biến chênh lệch áp suất lỗi'
                ],
                actions: [
                  'Kiểm tra tình trạng thực tế của bộ lọc gió và thay thế nếu cần',
                  'Kiểm tra các ống cảm biến áp suất có được kết nối đúng và không bị tắc nghẽn không'
                ]
              },
              {
                key: '2',
                error: 'Env Temperature High (Nhiệt độ môi trường cao)',
                causes: [
                  'Tải nhiệt trong phòng tăng đột ngột',
                  'Chế độ làm mát bị tắt',
                  'Ngưỡng cảnh báo cài đặt quá thấp'
                ],
                actions: [
                  'Kiểm tra xem máy có đang làm mát hiệu quả không',
                  'Đảm bảo chế độ làm mát (Cool mode) đã được bật',
                  'Kiểm tra lại giá trị cài đặt ngưỡng cảnh báo'
                ]
              },
              {
                key: '3',
                error: 'Head Pressure High (Áp suất đầu đẩy cao)',
                causes: [
                  'Dàn nóng bị bẩn hoặc bị cản trở luồng gió',
                  'Quạt dàn nóng không hoạt động',
                  'Thừa gas trong hệ thống'
                ],
                actions: [
                  'Vệ sinh dàn nóng, đảm bảo khu vực xung quanh thông thoáng',
                  'Kiểm tra hoạt động của quạt dàn nóng',
                  'Cần kỹ thuật viên kiểm tra áp suất gas'
                ]
              },
              {
                key: '4',
                error: 'Suction Pressure Low (Áp suất đầu hút thấp)',
                causes: [
                  'Thiếu gas do rò rỉ',
                  'Lọc gió hoặc dàn bay hơi bị tắc',
                  'Nhiệt độ phòng quá thấp (dưới 20°C)'
                ],
                actions: [
                  'Cần kỹ thuật viên kiểm tra rò rỉ và nạp lại gas',
                  'Vệ sinh bộ lọc và kiểm tra dàn bay hơi',
                  'Kiểm tra lại nhiệt độ cài đặt của phòng'
                ]
              },
              {
                key: '5',
                error: 'Water Detected (Phát hiện rò rỉ nước)',
                causes: [
                  'Có nước rò rỉ dưới sàn',
                  'Cảm biến nước bị lỗi hoặc chạm vào kim loại'
                ],
                actions: [
                  'Xác định và khắc phục nguồn rò rỉ',
                  'Đảm bảo cảm biến nước được lắp đúng cách và sạch sẽ'
                ]
              },
              {
                key: '6',
                error: 'Humidifier Fail (Lỗi bộ tạo ẩm)',
                causes: [
                  'Lỗi hệ thống tạo ẩm (hết nước, cylinder hết hạn, lỗi điện)'
                ],
                actions: [
                  'Kiểm tra nhật ký lỗi (event log) để xem cảnh báo chi tiết hơn về bộ tạo ẩm và xử lý theo nguyên nhân cụ thể'
                ]
              },
              {
                key: '7',
                error: 'Condensate Pump Fail (Lỗi bơm nước ngưng)',
                causes: [
                  'Bơm bị kẹt hoặc hỏng',
                  'Đường ống thoát nước ngưng bị tắc',
                  'Phao báo mức nước bị kẹt'
                ],
                actions: [
                  'Kiểm tra cầu dao của bơm',
                  'Kiểm tra và thông tắc đường ống thoát nước',
                  'Kiểm tra phao báo có di chuyển tự do không'
                ]
              },
              {
                key: '8',
                error: 'Compressor Fails To Start (Máy nén không khởi động)',
                causes: [
                  'Chế độ làm mát bị vô hiệu hóa',
                  'Cầu dao (circuit breaker) của máy nén bị nhảy'
                ],
                actions: [
                  'Bật lại chế độ làm mát',
                  'Reset lại cầu dao và kiểm tra điện áp'
                ]
              },
              {
                key: '9',
                error: 'Airflow Too Low (Lưu lượng gió quá thấp)',
                causes: [
                  'Lọc gió bẩn hoặc bị tắc',
                  'Cài đặt quạt quá thấp'
                ],
                actions: [
                  'Kiểm tra và thay thế bộ lọc',
                  'Tăng tốc độ cài đặt cho quạt'
                ]
              }
            ]}
            columns={[
              {
                title: 'STT',
                dataIndex: 'key',
                key: 'key',
                width: '5%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Loại lỗi (Thông báo trên màn hình)',
                dataIndex: 'error',
                key: 'error',
                width: '25%',
                render: (text) => <Tag color="red" style={{ fontSize: '11px' }}>{text}</Tag>
              },
              {
                title: 'Nguyên nhân có thể',
                dataIndex: 'causes',
                key: 'causes',
                width: '30%',
                render: (causes) => (
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px' }}>
                    {causes.map((cause, index) => (
                      <li key={index}>{cause}</li>
                    ))}
                  </ul>
                )
              },
              {
                title: 'Cách kiểm tra và xử lý',
                dataIndex: 'actions',
                key: 'actions',
                width: '40%',
                render: (actions) => (
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px' }}>
                    {actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                )
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>

      <div id="section-2.4.5" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.4.5. Quy định và chu kỳ bảo trì
        </Title>

        <Card title="2.4.5.1. Các hạng mục cần bảo trì định kỳ" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng tháng</Title>
          <Table
            dataSource={[
              {
                key: '1',
                category: 'Môi trường',
                tasks: ['Kiểm tra xem nhiệt độ, độ ẩm có được duy trì ổn định không']
              },
              {
                key: '2',
                category: 'Vệ sinh',
                tasks: [
                  'Kiểm tra tình trạng bộ lọc gió và thay thế nếu cần',
                  'Kiểm tra và làm sạch khay hứng nước ngưng'
                ]
              },
              {
                key: '3',
                category: 'Cơ khí',
                tasks: [
                  'Kiểm tra quạt bay hơi và động cơ',
                  'Kiểm tra đường ống thoát nước ngưng không bị tắc'
                ]
              },
              {
                key: '4',
                category: 'Điện',
                tasks: ['Kiểm tra tủ điện xem có kết nối lỏng hoặc quá nhiệt không']
              }
            ]}
            columns={[
              {
                title: 'Hạng mục',
                dataIndex: 'category',
                key: 'category',
                width: '20%',
                render: (text) => <Tag color="blue">{text}</Tag>
              },
              {
                title: 'Công việc cần thực hiện',
                dataIndex: 'tasks',
                key: 'tasks',
                width: '80%',
                render: (tasks) => (
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {tasks.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                )
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng quý</Title>
          <Paragraph>
            <ul>
              <li>(Bao gồm tất cả các mục hàng tháng)</li>
              <li><Text strong>Cơ khí:</Text> Kiểm tra rò rỉ trên các đường ống gas</li>
              <li><Text strong>Điện:</Text> Đo và ghi lại cường độ dòng điện (Ampe) của các thành phần chính như quạt, máy nén, bộ sưởi</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì bán niên (6 tháng)</Title>
          <Paragraph>
            <ul>
              <li>(Bao gồm tất cả các mục hàng tháng và hàng quý)</li>
              <li><Text strong>Vệ sinh:</Text> Kiểm tra độ sạch của dàn bay hơi (evaporator coil) và làm sạch nếu cần</li>
              <li><Text strong>Điện:</Text> Kiểm tra hoạt động của các contactor và relay</li>
              <li><Text strong>Kiểm tra chức năng:</Text></li>
              <ul>
                <li>Đo áp suất gas</li>
                <li>Kiểm tra hoạt động của van tiết lưu nhiệt</li>
                <li>Kiểm tra hoạt động của các cảnh báo khói, lửa, nước (nếu có)</li>
              </ul>
            </ul>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.4.6" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.4.6. Hướng dẫn bảo trì từng thành phần
        </Title>

        <Card title="Hướng dẫn bảo trì chi tiết từng thành phần" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                component: 'Bộ lọc khí (Air Filter)',
                function: 'Lọc bụi bẩn khỏi không khí trước khi đi qua dàn lạnh, bảo vệ linh kiện và đảm bảo luồng không khí sạch',
                maintenance: 'Hàng tháng',
                procedure: 'Kiểm tra tình trạng trực quan của các tấm lọc. Thay thế nếu thấy bám nhiều bụi, đổi màu hoặc hư hỏng'
              },
              {
                key: '2',
                component: 'Dàn nóng (Condenser Coil)',
                function: 'Là bộ phận đặt ngoài trời, có chức năng thải nhiệt của môi chất lạnh (gas) ra môi trường',
                maintenance: 'Hàng tháng',
                procedure: 'Kiểm tra bề mặt dàn xem có bị bụi bẩn, lá cây hoặc rác bám vào làm cản trở luồng gió không. Vệ sinh nếu cần'
              },
              {
                key: '3',
                component: 'Dàn bay hơi (Evaporator Coil)',
                function: 'Là bộ phận bên trong tủ, hấp thụ nhiệt từ không khí nóng trong phòng máy để làm lạnh không khí',
                maintenance: '6 tháng/lần',
                procedure: 'Kiểm tra độ sạch của dàn bay hơi bên trong thiết bị. Vệ sinh bằng dụng cụ chuyên dụng nếu cần'
              },
              {
                key: '4',
                component: 'Quạt và Động cơ (Fans and Motors)',
                function: 'Tạo ra luồng không khí tuần hoàn trong phòng (quạt dàn lạnh) và giải nhiệt cho dàn nóng (quạt dàn nóng)',
                maintenance: 'Hàng tháng & Hàng quý',
                procedure: 'Hàng tháng: Kiểm tra tất cả các quạt quay có trơn tru, không có tiếng ồn, rung động bất thường. Siết lại các ốc vít trên cánh quạt. Hàng quý: Kiểm tra và siết chặt lại toàn bộ phần cứng lắp đặt của cụm quạt/động cơ'
              },
              {
                key: '5',
                component: 'Máy nén (Compressor)',
                function: 'Là "trái tim" của hệ thống, có nhiệm vụ nén môi chất lạnh để bắt đầu chu trình làm mát',
                maintenance: 'Hàng quý & 6 tháng/lần',
                procedure: 'Hàng quý: Đo và ghi lại dòng điện hoạt động (ampe) của máy nén để theo dõi hiệu suất. 6 tháng: Đo áp suất gas đầu hút/đẩy, kiểm tra hoạt động của van tiết lưu và các thông số siêu nhiệt/độ lạnh sâu'
              },
              {
                key: '6',
                component: 'Hệ thống điện và điều khiển (Electrical System)',
                function: 'Cung cấp nguồn và điều khiển mọi hoạt động của thiết bị, bao gồm cầu dao, contactor, bo mạch',
                maintenance: 'Hàng tháng & 6 tháng/lần',
                procedure: 'Hàng tháng: Kiểm tra trực quan tủ điện, tìm dấu hiệu quá nhiệt, siết lại các đầu nối điện. 6 tháng: Kiểm tra hoạt động của contactor, relay và hệ thống dây dẫn điện chính'
              },
              {
                key: '7',
                component: 'Hệ thống tạo ẩm (Humidifier)',
                function: 'Bổ sung độ ẩm cho không khí để duy trì trong ngưỡng an toàn cho thiết bị IT',
                maintenance: 'Hàng tháng',
                procedure: 'Kiểm tra rò rỉ nước tại các van cấp và van xả. Kiểm tra chức năng hoạt động. Thay thế các bình tạo hơi (cylinder) nếu cần'
              },
              {
                key: '8',
                component: 'Khay và ống thoát nước ngưng (Drain Pan & Line)',
                function: 'Thu gom và xả nước ngưng tụ từ dàn lạnh ra ngoài',
                maintenance: 'Hàng tháng',
                procedure: 'Kiểm tra khay hứng nước ngưng, xem có cặn bẩn tích tụ không và làm sạch. Đảm bảo đường ống thoát nước không bị tắc nghẽn'
              }
            ]}
            columns={[
              {
                title: 'STT',
                dataIndex: 'key',
                key: 'key',
                width: '5%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Tên thiết bị',
                dataIndex: 'component',
                key: 'component',
                width: '15%',
                render: (text) => <Tag color="green" style={{ fontSize: '11px' }}>{text}</Tag>
              },
              {
                title: 'Chức năng',
                dataIndex: 'function',
                key: 'function',
                width: '25%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              },
              {
                title: 'Bảo trì định kỳ',
                dataIndex: 'maintenance',
                key: 'maintenance',
                width: '15%',
                render: (text) => <Tag color="orange">{text}</Tag>
              },
              {
                title: 'Cách thực hiện',
                dataIndex: 'procedure',
                key: 'procedure',
                width: '40%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>
    </div>
  );
};

export default FM40H;
