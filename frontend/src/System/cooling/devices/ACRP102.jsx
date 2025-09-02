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

const ACRP102 = () => {
  return (
          <div id="section-2.5" className="subsection">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        2.5. ACRP102 - APC
      </Title>

      <div id="section-2.5.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> 2.5.1. Thông tin chung
        </Title>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="/cooling/acrp.png"
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
            Hiện tại TTDL Hòa Lạc có 4 điều hòa Inrows ACRP102 đặt ở trong phòng máy chủ 1</Paragraph>
        </div>
        <Alert
          message="Thiết bị điều hòa chính xác thế hệ mới của APC"
          description="Model ACRP102 là thiết bị điều hòa chính xác thế hệ mới của APC, thuộc dòng InRow Direct Expansion. Thiết kế 'InRow' trong hàng có nghĩa là thiết bị này được đặt ngay trong hàng rack, giúp đưa luồng khí mát trực tiếp đến các thiết bị IT, tối ưu hóa hiệu quả làm mát và tiết kiệm năng lượng."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />
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
              <Text>InRow RP DX (Direct Expansion)</Text>
            </div>
            <div key="model">
              <Tag color="blue">Model</Tag>
              <Text>ACRP102</Text>
            </div>
            <div key="type">
              <Tag color="blue">Loại thiết kế</Tag>
              <Text>InRow (Lắp đặt trong hàng rack)</Text>
            </div>
            <div key="purpose">
              <Tag color="blue">Mục đích sử dụng</Tag>
              <Text>Cung cấp giải pháp làm mát hiệu suất cao, có thể mở rộng, được tích hợp với hệ thống giám sát và kiểm soát cho các trung tâm dữ liệu</Text>
            </div>
          </Space>
        </Card>

        <Card title="Thông số kỹ thuật" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              { key: '1', spec: 'Công suất lạnh danh định', value: '29 kW' },
              { key: '2', spec: 'Cấu hình giải nhiệt', value: 'Giải nhiệt bằng khí (Air-cooled)' },
              { key: '3', spec: 'Điện áp', value: '380-415V, 3 pha, 50-60 Hz' },
              { key: '4', spec: 'Dòng điện tải đầy đủ (FLA)', value: '32 A' },
              { key: '5', spec: 'Kiểu luồng gió', value: 'Từ sau ra trước (Back to front)' },
              { key: '6', spec: 'Chức năng sưởi (Reheat)', value: 'Sưởi điện (Electric)' },
              { key: '7', spec: 'Chức năng tạo ẩm (Humidifier)', value: 'Hộp tạo hơi nước (Steam canister), có thể thay thế' },
              { key: '8', spec: 'Trọng lượng khi đóng gói', value: '488 kg' },
              { key: '9', spec: 'Trọng lượng không đóng gói', value: '378 kg' },
              { key: '10', spec: 'Kích thước (Cao x Rộng x Sâu)', value: '1991 x 600 x 1070 mm' },
              { key: '11', spec: 'Môi chất làm lạnh', value: 'R407C' },
              { key: '12', spec: 'Máy nén', value: '1 Digital Scroll' },
              { key: '13', spec: 'Mạch gas', value: '1' },
              { key: '14', spec: 'Serial Number', value: 'YK0831111036, YK0831110079, YK0831110076, YK0831110073' }
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
      </div>

      <div id="section-2.5.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.5.2. Hướng dẫn cài đặt và cấu hình ban đầu
        </Title>

        <Card title="2.5.2.1. Các hạng mục kiểm tra trước khi vận hành" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra lắp đặt</Title>
          <Paragraph>
            <ul>
              <li>Thiết bị phải được san phẳng và nối liền với các tủ rack liền kề</li>
              <li>Sàn, tường, trần phải được bịt kín bằng lớp chống ẩm (vapor barrier)</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra điện</Title>
          <Paragraph>
            <ul>
              <li>Điện áp đầu vào phải khớp với thông số trên nhãn thiết bị</li>
              <li>Tất cả các kết nối điện phải được siết chặt</li>
              <li>Thiết bị phải được nối đất đúng cách</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra cơ khí</Title>
          <Paragraph>
            <ul>
              <li>Đường ống thoát nước ngưng phải được lắp đúng kích thước và không bị tắc nghẽn</li>
              <li>Hệ thống được nạp sẵn một lượng khí nitơ từ nhà máy, cần được xả ra an toàn trước khi nạp gas</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Nạp gas R407C</Title>
          <Paragraph>
            <ul>
              <li>Việc tính toán và nạp gas phải được thực hiện theo công thức chính xác dựa trên chiều dài đường ống và nhiệt độ môi trường</li>
              <li>Chỉ được nạp gas R407C ở dạng lỏng. Việc nạp gas nhanh ở dạng lỏng vào cổng hút có thể làm hỏng máy nén</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="2.5.2.2. Cấu hình ban đầu" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Mật khẩu</Title>
          <Paragraph>
            <ul>
              <li>Hệ thống có hai cấp mật khẩu: Device (cho người dùng) và Admin (cho quản trị viên)</li>
              <li>Mật khẩu mặc định cho cả hai cấp là <PasswordField password="apc" label="" style={{ display: 'inline-flex' }} /> (viết thường)</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Cài đặt chung</Title>
          <Table
            dataSource={[
              {
                key: '1',
                setting: 'Start-up Dly (Độ trễ khởi động)',
                description: 'Thiết lập thời gian trễ sau khi có điện để các thiết bị khởi động tuần tự, tránh sụt áp đột ngột'
              },
              {
                key: '2',
                setting: 'Idle On Leak (Ngừng hoạt động khi có rò rỉ)',
                description: 'Cài đặt để thiết bị chuyển sang chế độ chờ nếu phát hiện rò rỉ nước (yêu cầu có cảm biến rò rỉ tùy chọn)'
              }
            ]}
            columns={[
              {
                title: 'Cài đặt',
                dataIndex: 'setting',
                key: 'setting',
                width: '40%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '60%',
                render: (text) => <Text>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Cài đặt Nhóm (Cooling Group)</Title>
          <Paragraph>
            <ul>
              <li>Có thể kết nối tối đa 12 thiết bị vào một nhóm để hoạt động đồng bộ</li>
              <li>Cấu hình số lượng thiết bị dự phòng (backup) và bật tính năng cân bằng giờ chạy (Runtime Balancing) để đảm bảo các máy có thời gian hoạt động tương đương nhau</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Cài đặt Môi trường (Setpoints)</Title>
          <Table
            dataSource={[
              {
                key: '1',
                parameter: 'Nhiệt độ làm mát (Cool)',
                range: '18.0 - 32.2°C',
                description: 'Dải cài đặt nhiệt độ làm mát'
              },
              {
                key: '2',
                parameter: 'Độ ẩm hút ẩm (Dehumid)',
                range: '35.0 - 80.0% RH',
                description: 'Dải cài đặt độ ẩm hút ẩm'
              },
              {
                key: '3',
                parameter: 'Độ ẩm tạo ẩm (Humidify)',
                range: '20.0 - 50.0% RH',
                description: 'Dải cài đặt độ ẩm tạo ẩm'
              }
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
                title: 'Dải cài đặt',
                dataIndex: 'range',
                key: 'range',
                width: '25%',
                render: (text) => <Tag color="blue">{text}</Tag>
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
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

      <div id="section-2.5.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.5.3. Hướng dẫn vận hành và kiểm tra hàng ngày
        </Title>

        <Card title="2.5.3.1. Vận hành cơ bản" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Giao diện điều khiển</Title>
          <Table
            dataSource={[
              { key: '1', component: '① Đèn báo động nghiêm trọng (Critical Alarm - đỏ)', function: 'Sáng lên khi có lỗi nghiêm trọng, yêu cầu xử lý ngay lập tức' },
              { key: '2', component: '② Đèn báo động cảnh báo (Warning Alarm - vàng)', function: 'Sáng lên khi có lỗi cảnh báo. Nếu không xử lý có thể dẫn đến lỗi nghiêm trọng' },
              { key: '3', component: '③ Đèn kiểm tra nhật ký (Check Log - vàng)', function: 'Sáng lên khi có một sự kiện mới được ghi lại' },
              { key: '4', component: '④ Đèn trạng thái (Status - xanh)', function: 'Sáng khi thiết bị đang được cấp điện' },
              { key: '5', component: '⑤ Màn hình LCD', function: 'Hiển thị thông tin, cảnh báo và menu' },
              { key: '6', component: '⑥, ⑧ Phím điều hướng (Mũi tên và Enter)', function: 'Dùng để điều hướng và xác nhận lựa chọn' },
              { key: '7', component: '⑦ Phím ESC', function: 'Quay lại màn hình trước đó' },
              { key: '8', component: '⑨ Phím Trợ giúp (Help)', function: 'Nhấn phím này để màn hình hiển thị giải thích chi tiết về mục hoặc thông số mà bạn đang chọn, giúp người dùng hiểu rõ hơn về các chức năng' }
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

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Khởi động thiết bị</Title>
          <Paragraph>
            <ol>
              <li>Trên màn hình, vào Main {'>'} On/Standby {'>'} Operate</li>
              <li>Nhấn ENTER để chuyển trạng thái sang On. Thiết bị sẽ bắt đầu hoạt động theo các cài đặt đã cấu hình</li>
            </ol>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Tắt thiết bị</Title>
          <Paragraph>
            <ol>
              <li>Vào Main {'>'} On/Standby {'>'} Operate</li>
              <li>Nhấn ENTER để chuyển trạng thái sang Standby</li>
            </ol>
            <Alert
              message="CẢNH BÁO"
              description="Chế độ Standby không ngắt hoàn toàn nguồn điện khỏi thiết bị."
              type="warning"
              showIcon
              style={{ marginTop: '10px' }}
            />
          </Paragraph>
        </Card>

        <Card title="2.5.3.2. Kiểm tra hàng ngày" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra Trạng thái Báo động (Ưu tiên hàng đầu)</Title>
          <Paragraph>
            <Text strong>Quan sát đèn LED:</Text> Việc đầu tiên khi đến gần thiết bị là nhìn vào dải đèn LED trên màn hình. Nếu tất cả các đèn báo động (đèn đỏ "Critical" và đèn vàng "Warning") đều tắt, đó là một dấu hiệu tốt.
          </Paragraph>
          <Paragraph>
            <Text strong>Xem màn hình "Active Alarms":</Text> Màn hình LCD sẽ tự động cuộn qua các thông tin vận hành chính. Hãy chú ý đến màn hình có tên cooling group hoặc cooling unit. Tìm dòng trạng thái báo động. Nếu nó hiển thị "No Alarms" (Không có báo động), ta có thể yên tâm. Nếu có bất kỳ cảnh báo nào xuất hiện, hãy ghi lại tên cảnh báo đó để thực hiện các bước xử lý tiếp theo.
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra Môi trường Làm mát</Title>
          <Paragraph>
            <Text strong>Nhiệt độ tủ rack so với cài đặt:</Text> Trên màn hình trạng thái cooling group, hãy tìm hai thông số quan trọng:
          </Paragraph>
          <ul>
            <li><Text strong>Maximum Rack Temperature:</Text> Đây là nhiệt độ nóng nhất mà cảm biến đang ghi nhận được tại cửa hút gió của tủ rack</li>
            <li><Text strong>Cool Setpoint:</Text> Đây là nhiệt độ mục tiêu mà ta đã cài đặt cho hệ thống. Hãy so sánh hai giá trị này. Nếu nhiệt độ thực tế chỉ cao hơn một chút hoặc bằng nhiệt độ cài đặt, hệ thống đang hoạt động rất hiệu quả. Nếu nhiệt độ thực tế cao hơn đáng kể, điều đó cho thấy tải nhiệt trong phòng đang tăng cao và hệ thống đang phải chạy công suất lớn</li>
          </ul>
          <Paragraph>
            <Text strong>Chênh lệch nhiệt độ vào/ra:</Text> Để hiểu sâu hơn về hiệu suất của máy, ta có thể vào menu Main {'>'} View Unit Status để xem:
          </Paragraph>
          <ul>
            <li><Text strong>Supply Air:</Text> Nhiệt độ luồng khí mát mà điều hòa thổi ra</li>
            <li><Text strong>Return Air:</Text> Nhiệt độ luồng khí nóng mà điều hòa hút vào từ khu vực nóng. Chênh lệch nhiệt độ càng lớn thì máy đang loại bỏ nhiệt càng hiệu quả</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Đánh giá Hiệu suất Vận hành</Title>
          <Paragraph>
            Bước này cho ta biết thiết bị đang "cố gắng" đến mức nào để làm mát.
          </Paragraph>
          <ul>
            <li><Text strong>Công suất làm mát:</Text> Trên màn hình cooling unit sẽ hiển thị Cool Output kW (Công suất làm mát thực tế). Con số này cho biết máy đang sử dụng bao nhiêu công suất để làm mát</li>
            <li><Text strong>Lưu lượng gió (Air Flow):</Text> Một lưu lượng gió mạnh và ổn định là rất tốt. Nếu ta thấy thông số này thấp hơn bình thường, đó có thể là dấu hiệu sớm cho thấy bộ lọc không khí đang bị bẩn và cần được vệ sinh hoặc thay thế</li>
            <li><Text strong>Tốc độ quạt (Fan Speed):</Text> Trong menu View Unit Status, ta có thể xem tốc độ quạt đang chạy. Quạt của ACRP102 là loại quạt thông minh (EC Fan), có thể tự điều chỉnh tốc độ. Nếu thấy quạt liên tục chạy ở tốc độ cao (gần 100%), điều đó có nghĩa là tải nhiệt rất lớn và có thể ta cần xem xét bổ sung thêm một thiết bị làm mát nữa trong tương lai</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Xác nhận Chế độ Hoạt động</Title>
          <Paragraph>
            Bước cuối cùng là đảm bảo thiết bị đang ở đúng trạng thái mà nó cần phải ở. Vào Main {'>'} View Unit Status và xem mục Op Mode (Chế độ hoạt động):
          </Paragraph>
          <Table
            dataSource={[
              {
                key: '1',
                mode: 'On',
                description: 'Máy đang chạy làm mát. Đây là trạng thái bình thường'
              },
              {
                key: '2',
                mode: 'Standby',
                description: 'Máy đang ở chế độ chờ. Trạng thái này cũng là bình thường'
              },
              {
                key: '3',
                mode: 'Backup',
                description: 'Máy được cấu hình làm dự phòng và đang ở chế độ chờ. Đây là trạng thái bình thường cho các hệ thống có dự phòng N+1'
              },
              {
                key: '4',
                mode: 'Assist',
                description: 'Máy dự phòng đang chạy để "trợ giúp" khi các máy chính không đủ sức làm mát. Đây là dấu hiệu cho thấy tải nhiệt đang tăng đột biến'
              },
              {
                key: '5',
                mode: 'Idle',
                description: 'Máy đang "đứng im" do có một lỗi nghiêm trọng. Nếu ta thấy trạng thái này, cần phải kiểm tra danh sách báo động ngay lập tức'
              }
            ]}
            columns={[
              {
                title: 'Chế độ',
                dataIndex: 'mode',
                key: 'mode',
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

      <div id="section-2.5.4" className="subsection">
        <Title level={4}>
          <ExclamationCircleOutlined /> 2.5.4. Hướng dẫn xác định nguyên nhân lỗi
        </Title>

        <Alert
          message="Quy trình xử lý cơ bản"
          description="Khi có lỗi, hệ thống sẽ cảnh báo bằng đèn LED, âm thanh (nếu bật), và thông báo trên màn hình. Các báo động được phân thành hai cấp: Critical (Nghiêm trọng) và Warning (Cảnh báo)."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="2.5.4.1. Quy trình xử lý cơ bản" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ol>
              <li><Text strong>Xem báo động:</Text> Vào Main {'>'} View Alarms để xem danh sách các báo động đang hoạt động, mức độ nghiêm trọng và mô tả ngắn</li>
              <li><Text strong>Xác định nguyên nhân:</Text> Dựa vào mô tả lỗi, đối chiếu với bảng dưới đây</li>
              <li><Text strong>Xóa báo động:</Text> Sau khi đã khắc phục sự cố, vào Main {'>'} Clear Alarms và nhập mật khẩu Admin để xóa báo động. Nếu nguyên nhân vẫn tồn tại, báo động sẽ tái diễn</li>
            </ol>
          </Paragraph>
        </Card>

        <Card title="2.5.4.2. Các lỗi thường gặp và cách xác định nguyên nhân" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <Text strong>Các Cảnh báo Mức độ Nghiêm trọng (Critical) của ACRP102</Text>
          </Paragraph>
          <Table
            dataSource={[
              {
                key: '1',
                error: 'Fault',
                causes: ['Lỗi phần cứng chung, không xác định'],
                actions: ['Cần liên hệ Hỗ trợ Kỹ thuật của ACP']
              },
              {
                key: '2',
                error: 'Compressor Drive Communication Fault',
                causes: ['Mất giao tiếp với bộ điều khiển máy nén'],
                actions: ['Đây là một lỗi phần cứng. Cần liên hệ Hỗ trợ Kỹ thuật của ACP']
              },
              {
                key: '3',
                error: 'Compressor Drive Fault',
                causes: ['Lỗi bộ điều khiển máy nén (VFD)'],
                actions: ['Đây là một lỗi phần cứng. Cần liên hệ Hỗ trợ Kỹ thuật của ACP']
              },
              {
                key: '4',
                error: 'Compressor Drive Locked',
                causes: ['Bộ điều khiển máy nén (VFD) đã bị khóa do lỗi'],
                actions: ['Tắt và bật lại nguồn của thiết bị để reset. Nếu sự cố vẫn tiếp diễn, hãy liên hệ hỗ trợ kỹ thuật']
              },
              {
                key: '5',
                error: 'Condensate Pan Full',
                causes: [
                  'Bơm nước ngưng không hoạt động',
                  'Đường ống thoát nước ngưng bị tắc'
                ],
                actions: [
                  'Kiểm tra hệ thống bơm và đường ống thoát nước',
                  'Liên hệ Hỗ trợ Kỹ thuật nếu cần'
                ]
              },
              {
                key: '6',
                error: 'Cooling Failure',
                causes: ['Lỗi phần cứng nghiêm trọng trong hệ thống làm mát'],
                actions: ['Liên hệ ngay với bộ phận Hỗ trợ Kỹ thuật của ACP']
              },
              {
                key: '7',
                error: 'External Communication Fault',
                causes: ['Lỗi giao tiếp với các hệ thống bên ngoài'],
                actions: ['Đây là một lỗi phần cứng. Cần liên hệ Hỗ trợ Kỹ thuật của ACP']
              },
              {
                key: '8',
                error: 'Internal Communication Fault',
                causes: ['Lỗi giao tiếp giữa các bo mạch điều khiển bên trong'],
                actions: ['Đây là một lỗi phần cứng. Cần liên hệ Hỗ trợ Kỹ thuật của ACP']
              },
              {
                key: '9',
                error: 'Persistent High Head Pressure',
                causes: ['Lỗi áp suất cao lặp lại liên tục (4 lần trong 30 phút), có thể do dàn nóng bị tắc nghẽn hoặc lỗi hệ thống gas'],
                actions: ['Cần liên hệ Hỗ trợ Kỹ thuật ngay lập tức để kiểm tra chuyên sâu']
              },
              {
                key: '10',
                error: 'Rack Inlet #n High Temperature Violation',
                causes: [
                  'Cảm biến nhiệt độ lỗi hoặc đặt sai vị trí',
                  'Ngưỡng cảnh báo cài đặt quá thấp',
                  'Tải nhiệt trong phòng quá cao'
                ],
                actions: [
                  'Kiểm tra lại kết nối và vị trí của cảm biến nhiệt độ',
                  'Kiểm tra lại giá trị cài đặt ngưỡng nhiệt độ cao trong menu',
                  'Nếu sự cố vẫn tiếp diễn, hãy liên hệ Hỗ trợ Kỹ thuật'
                ]
              },
              {
                key: '11',
                error: 'Rack Inlet #n Temperature Sensor Fault',
                causes: ['Cảm biến nhiệt độ tại tủ rack bị lỗi hoặc mất kết nối'],
                actions: [
                  'Đảm bảo các cảm biến được kết nối đúng cách',
                  'Nếu sự cố vẫn tiếp diễn, hãy thay thế cảm biến hoặc liên hệ Hỗ trợ Kỹ thuật'
                ]
              },
              {
                key: '12',
                error: 'Return Air Sensor Fault',
                causes: ['Cảm biến khí hồi bị lỗi hoặc mất kết nối'],
                actions: [
                  'Đảm bảo cảm biến được kết nối đúng cách',
                  'Nếu sự cố vẫn tiếp diễn, hãy thay thế cảm biến hoặc liên hệ Hỗ trợ Kỹ thuật'
                ]
              },
              {
                key: '13',
                error: 'Supply Air Sensor Fault (upper or lower)',
                causes: ['Cảm biến khí cấp (trên hoặc dưới) bị lỗi hoặc mất kết nối'],
                actions: [
                  'Đảm bảo cảm biến bị lỗi được kết nối đúng cách',
                  'Nếu sự cố vẫn tiếp diễn, hãy thay thế cảm biến hoặc liên hệ Hỗ trợ Kỹ thuật'
                ]
              },
              {
                key: '14',
                error: 'VFD Inverter Over Heated',
                causes: ['Bộ điều khiển máy nén (VFD) quá nóng'],
                actions: ['Biến tần sẽ tự khởi động lại sau khi nguội. Nếu lỗi này lặp lại thường xuyên, cần kiểm tra hệ thống thông gió của thiết bị và liên hệ hỗ trợ kỹ thuật']
              },
              {
                key: '15',
                error: 'Water Detection Shutdown',
                causes: ['Hệ thống đã tự động tắt do phát hiện rò rỉ nước'],
                actions: ['Đây là một tính năng an toàn. Cần xác định và khắc phục sự cố rò rỉ nước, sau đó khởi động lại hệ thống. Liên hệ Hỗ trợ Kỹ thuật nếu cần']
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

      <div id="section-2.5.5" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.5.5. Quy định và chu kỳ bảo trì
        </Title>

        <Card title="2.5.5.1. Chu kỳ bảo trì đề xuất" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng tháng</Title>
          <Table
            dataSource={[
              {
                key: '1',
                category: 'Môi trường',
                tasks: ['Ghi lại lịch sử báo động của tháng trước']
              },
              {
                key: '2',
                category: 'Vệ sinh',
                tasks: [
                  'Kiểm tra tình trạng bộ lọc gió, làm sạch hoặc thay thế',
                  'Kiểm tra và làm sạch khay hứng nước ngưng'
                ]
              },
              {
                key: '3',
                category: 'Cơ khí',
                tasks: [
                  'Kiểm tra các quạt di chuyển tự do',
                  'Kiểm tra đường ống thoát nước ngưng có thông suốt không'
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
              <li><Text strong>Vệ sinh:</Text> Làm sạch/thay thế bộ lọc. Làm sạch đường ống thoát nước ngưng</li>
              <li><Text strong>Cơ khí:</Text> Siết chặt lại phần cứng của quạt</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì bán niên (6 tháng)</Title>
          <Paragraph>
            <ul>
              <li>(Bao gồm tất cả các mục hàng tháng và hàng quý)</li>
              <li><Text strong>Vệ sinh:</Text> Kiểm tra độ sạch của dàn bay hơi (evaporator coil) và làm sạch nếu cần</li>
            </ul>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.5.6" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.5.6. Hướng dẫn bảo trì từng thành phần
        </Title>

        <Card title="Hướng dẫn bảo trì chi tiết từng thành phần" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                component: 'Bộ lọc khí (Air Filters)',
                function: 'Lọc bụi khỏi không khí nóng hút vào từ hành lang nóng, bảo vệ các linh kiện bên trong và duy trì hiệu suất',
                maintenance: 'Hàng tháng & Hàng quý',
                procedure: 'Hàng tháng: Kiểm tra tình trạng của bộ lọc gió hồi. Vệ sinh hoặc thay thế nếu cần thiết. Hàng quý: Thực hiện vệ sinh sâu hoặc thay mới bộ lọc'
              },
              {
                key: '2',
                component: 'Khay và ống thoát nước ngưng (Condensate Drain)',
                function: 'Thu gom và xả lượng nước ngưng tụ sinh ra trong quá trình làm lạnh và hút ẩm ra khỏi thiết bị',
                maintenance: 'Hàng tháng & Hàng quý',
                procedure: 'Hàng tháng: Kiểm tra và làm sạch cặn bẩn trong khay hứng nước ngưng. Đảm bảo đường ống thoát nước chảy thông suốt. Hàng quý: Vệ sinh toàn bộ đường ống thoát nước ngưng và loại bỏ cặn bẩn khỏi phao báo mức nước'
              },
              {
                key: '3',
                component: 'Quạt (Fans)',
                function: 'Tạo ra luồng không khí tuần hoàn, hút khí nóng từ phía sau và thổi khí mát ra phía trước thiết bị',
                maintenance: 'Hàng tháng & Hàng quý',
                procedure: 'Hàng tháng: Kiểm tra trực quan, đảm bảo các quạt quay trơn tru, không bị kẹt hay hư hỏng. Hàng quý: Siết chặt lại các phần cứng của quạt và vệ sinh bụi bẩn khỏi các viền quạt'
              },
              {
                key: '4',
                component: 'Dàn bay hơi (Evaporator Coil)',
                function: 'Là bộ phận trao đổi nhiệt chính, nơi môi chất lạnh (gas) bay hơi để hấp thụ nhiệt từ không khí nóng',
                maintenance: '6 tháng/lần',
                procedure: '6 tháng/lần: Kiểm tra độ sạch của dàn bay hơi và vệ sinh nếu cần để đảm bảo hiệu suất trao đổi nhiệt tối ưu'
              },
              {
                key: '5',
                component: 'Hệ thống điện (Electrical System)',
                function: 'Cung cấp điện và điều khiển toàn bộ hoạt động của thiết bị, bao gồm cầu dao, biến áp và các bo mạch',
                maintenance: 'Hàng tháng',
                procedure: 'Hàng tháng: (Lưu ý: Luôn tắt nguồn và khóa an toàn trước khi kiểm tra). Kiểm tra tủ điện, siết lại các đầu nối bị lỏng và tìm các dấu hiệu quá nhiệt'
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

export default ACRP102;
