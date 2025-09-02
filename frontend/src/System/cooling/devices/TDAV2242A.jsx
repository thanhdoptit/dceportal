import React from 'react';
import { Typography, Card, Table, Space, Tag, Alert } from 'antd';
import { InfoCircleOutlined, ToolOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const TDAV2242A = () => {
  // Bảng thông số kỹ thuật
  const technicalSpecs = [
    { parameter: 'Hãng sản xuất', value: 'Schneider Electric' },
    { parameter: 'Xuất xứ', value: 'Trung Quốc' },
    { parameter: 'Model', value: 'TDAV2242A' },
    { parameter: 'Model dàn nóng', value: 'CAP2002' },
    { parameter: 'Loại hệ thống', value: 'Điều hòa chính xác (precision cooling), giải nhiệt không khí (air-cooled)' },
    { parameter: 'Loại thiết bị', value: 'Tủ đứng, mặt trước (full frontal accessibility)' },
    { parameter: 'Vị trí lắp đặt', value: 'Trong nhà (indoor), gió thổi từ dưới lên (upflow)' },
    { parameter: 'Công suất lạnh', value: '82.6 kW' },
    { parameter: 'Tần số, điện áp đầu vào', value: '400V 3 pha, 50Hz' },
    { parameter: 'Dung sai nhiệt độ cho phép', value: '≤ &plusmn; 0.5ºC (so với chuẩn 24ºC)' },
    { parameter: 'Dung sai độ ẩm cho phép', value: '≤ &plusmn; 3% (so với chuẩn 50%RH)' },
    { parameter: 'Tần suất làm việc', value: '24/24, 365 ngày/năm' },
    { parameter: 'Chỉ số SHR', value: '0.99 (tại điều kiện tiêu chuẩn)' },
    { parameter: 'Chỉ số EER', value: '≥ 3.5' },
    { parameter: 'Môi chất làm lạnh', value: 'R410A' },
    { parameter: 'Kích thước dàn lạnh', value: '2175mm (C) x 2580mm (R) x 865mm (Sâu)' },
    { parameter: 'Máy nén', value: '4 Scroll (tốc độ cố định) và 2 mạch ga' },
    { parameter: 'Quạt dàn lạnh', value: '3 quạt điều khiển điện tử EC centrifugal fan' },
    { parameter: 'Quạt dàn nóng', value: '4 quạt' },
    { parameter: 'Bộ lọc khí', value: 'Chuẩn EU4' },
    { parameter: 'Bộ sưởi', value: 'Điện (electrical heater)' },
    { parameter: 'Van tiết lưu', value: 'Van tiết lưu điện tử (Electronic Expansion Valve – EEV)' },
    { parameter: 'Màn hình hiển thị', value: 'Semi-graphic, có thể tải/cập nhật firmware' },
    { parameter: 'Dòng vận hành', value: '41 A' },
    { parameter: 'Dòng khởi động', value: '120 A' },
    { parameter: 'Serial Number Server 1', value: 'E12150T00391, E12150T00392' },
    { parameter: 'Serial Number Server 2', value: 'E12150T00390' }
  ];

  const columns = [
    {
      title: 'Thông số',
      dataIndex: 'parameter',
      key: 'parameter',
      width: '40%',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      width: '60%'
    }
  ];

  return (
    <div id="section-2.2" className="subsection">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <ToolOutlined style={{ marginRight: '8px' }} /> 2.2. TDAV2242A - UNIFLAIR
      </Title>

      <div id="section-2.2.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> 2.2.1. Thông tin chung
          <div style={{ textAlign: 'center' }}>
            <img
              src="/cooling/2242.png"
              alt="TDAV1321A đang được sử dụng trong phòng UPS tầng 1"
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
              Hiện tại các điều hòa TDAV2242A đang được sử dụng để làm mát cho phòng Server 1 và Server 2, vị trí ở bên trong phòng Server 1 và Server 2.          </Paragraph>
          </div>

        </Title>

        <Alert
          message="Thiết bị điều hòa chính xác công suất cao"
          description="TDAV2242A là thiết bị điều hòa chính xác công suất 82.6kW, phù hợp cho các trung tâm dữ liệu lớn với yêu cầu độ chính xác cao về nhiệt độ và độ ẩm."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="Thông số kỹ thuật chi tiết" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={technicalSpecs}
            columns={columns}
            rowKey="parameter"
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title="Đặc điểm nổi bật" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div key="power">
              <Tag color="blue">Công suất cao</Tag>
              <Text>82.6 kW - Phù hợp cho trung tâm dữ liệu lớn</Text>
            </div>
            <div key="accuracy">
              <Tag color="green">Độ chính xác cao</Tag>
              <Text>Dung sai nhiệt độ &plusmn;0.5°C, độ ẩm &plusmn;3%</Text>
            </div>
            <div key="efficiency">
              <Tag color="orange">Hiệu suất năng lượng</Tag>
              <Text>EER ≥ 3.5, quạt EC tiết kiệm điện</Text>
            </div>
            <div key="continuous">
              <Tag color="purple">Vận hành liên tục</Tag>
              <Text>24/7, 365 ngày/năm</Text>
            </div>
            <div key="monitoring">
              <Tag color="red">Giám sát thông minh</Tag>
              <Text>Màn hình semi-graphic, kết nối BMS</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-2.2.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <SettingOutlined style={{ marginRight: '8px' }} /> 2.2.2. Hướng dẫn lắp đặt
        </Title>

        <Card title="Kiểm tra thiết bị" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>Kiểm tra ngoại quan vỏ máy, phụ kiện đi kèm (ống gas, bộ lọc, cảm biến…)</li>
              <li>Đảm bảo thiết bị còn nguyên đai kiện của hãng</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Nguồn điện" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li><Text strong>Nguồn cấp:</Text> 400V – 3 pha – 50Hz</li>
              <li><Text strong>Dây nguồn:</Text> 5 x (4 – 10) mm² tùy chiều dài & tải</li>
              <li><Text strong>Bảo vệ:</Text> Dùng CB chống giật, tiếp địa riêng (≤ 1Ω)</li>
              <li><Text strong>Hệ thống dự phòng:</Text> Có hệ thống ATS/UPS nếu yêu cầu độ sẵn sàng cao</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Xác định vị trí lắp đặt" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>Cố định dàn lạnh tại vị trí trong phòng server theo đúng hướng gió (thổi sàn hoặc trần)</li>
              <li>Đặt thiết bị trên sàn cố định, đảm bảo độ cân bằng</li>
              <li>Kết nối nguồn điện 400V 3 pha, đảm bảo tiếp địa</li>
              <li>Gắn dàn nóng lên giá đỡ chắc chắn, có khe thoát nước ngưng và không đặt nghiêng quá mức khuyến nghị</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Kết nối tín hiệu" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>Cấp điện từ tủ phân phối (ATS nếu có)</li>
              <li>Đấu nối cảm biến nhiệt độ/độ ẩm tại các vị trí đo trung tâm của phòng</li>
              <li>Cáp truyền thông kết nối BMS: RS485 (Modbus) hoặc RJ45 (SNMP)</li>
            </ul>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.2.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.2.3. Hướng dẫn vận hành và kiểm tra hàng ngày
        </Title>

        <Card title="2.2.3.1. Hướng dẫn vận hành" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Khởi động thiết bị</Title>
          <Paragraph>
            <ul>
              <li>Nhấn nút "Power ON" trên màn hình điều khiển hoặc qua giao diện Web</li>
              <li>Thiết bị khởi động theo thứ tự:
                <ul>
                  <li>Quạt EC chạy trước (gió ổn định)</li>
                  <li>Máy nén hoạt động (từng mạch gas bật cách nhau 30–60s)</li>
                  <li>Hệ thống sưởi/phun ẩm (nếu cài đặt cần)</li>
                </ul>
              </li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Xác nhận các chỉ số hiển thị</Title>
          <Card size="small" style={{ marginBottom: '15px' }}>
            <Paragraph>
              <ul>
                <li><Text strong>Nhiệt độ phòng:</Text> 15 &lt; t &lt; 27 độ C</li>
                <li><Text strong>Cài đặt giới hạn sai số:</Text> &plusmn;0.5°C</li>
                <li><Text strong>Độ ẩm:</Text> 45% - 55% RH</li>
                <li><Text strong>Giới hạn độ ẩm cảnh báo:</Text> &plusmn;5%</li>
                <li><Text strong>Chế độ quạt:</Text> Auto hoặc Constant (tùy thiết kế)</li>
                <li><Text strong>Cài đặt chế độ vận hành:</Text> Làm mát / Sưởi / Tự động</li>
                <li><Text strong>Cảnh báo:</Text> Không có hoặc chỉ báo "NORMAL"</li>
              </ul>
            </Paragraph>
          </Card>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Thiết lập kết nối giám sát</Title>
          <Paragraph>
            Vào menu Communication Settings:
            <ul>
              <li><Text strong>Modbus Address:</Text> chọn theo sơ đồ BMS</li>
              <li><Text strong>SNMP IP:</Text> gán IP tĩnh nếu giám sát qua LAN</li>
              <li><Text strong>Trap Receiver:</Text> nhập địa chỉ máy chủ nhận cảnh báo</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Cấu hình cảnh báo</Title>
          <Paragraph>
            <ul>
              <li>Thiết lập cảnh báo nhiệt độ cao, mất nguồn, quạt lỗi…</li>
              <li>Bật tính năng gửi cảnh báo Email hoặc SNMP trap nếu hệ thống hỗ trợ</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="2.2.3.2. Kiểm tra hằng ngày" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Quan sát trạng thái thiết bị</Title>
          <Paragraph>
            <ul>
              <li><Text strong>Màn hình LCD:</Text> Không hiển thị cảnh báo, menu phản hồi nhanh</li>
              <li><Text strong>Cửa gió thổi:</Text> Luồng gió đều, không rung hoặc kêu lạch cạch</li>
              <li><Text strong>Âm thanh:</Text> Êm, không có tiếng nén lạ hoặc quạt xè xè</li>
              <li><Text strong>Dàn nóng:</Text> Quạt hoạt động theo nhiệt độ, không lỗi HP/LP</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Xem thông tin hệ thống</Title>
          <Paragraph>
            Vào các menu:
            <ul>
              <li><Text strong>System Info:</Text> Xem tổng quát trạng thái các thành phần</li>
              <li><Text strong>Alarm History:</Text> Xem các cảnh báo gần nhất</li>
              <li><Text strong>Sensor Status:</Text> Kiểm tra cảm biến nhiệt, ẩm</li>
              <li><Text strong>Fan/Motor Status:</Text> Hiện trạng quạt, dòng điện, RPM</li>
            </ul>
          </Paragraph>

          <Alert
            message="Lưu ý quan trọng"
            description={
              <ul>
                <li key="setpoint">Không đổi setpoint nhiều hơn &plusmn;2°C hoặc 10% RH trong 1 lần</li>
                <li key="continuous">Duy trì vận hành liên tục – tránh bật/tắt liên tục trong ngày</li>
                <li key="filter">Kiểm tra lọc gió định kỳ hàng tuần/tháng để tránh sụt gió</li>
                <li key="rotation">Luân phiên thiết bị (nếu nhiều tủ) theo mô hình N+1 để cân tải</li>
              </ul>
            }
            type="warning"
            showIcon
            style={{ marginTop: '15px' }}
          />
        </Card>
      </div>

      <div id="section-2.2.4" className="subsection">
        <Title level={4}>
          <ToolOutlined /> 2.2.4. Hướng dẫn xác định nguyên nhân lỗi
        </Title>

        <Card title="Qua màn hình điều khiển tại thiết bị" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>Vào menu: <Text code>Main Menu &gt; Alarms &gt; Active Alarm</Text></li>
              <li>Hoặc xem nhật ký: <Text code>Main Menu &gt; Alarms &gt; Alarm History</Text></li>
              <li>Lỗi thường hiển thị dạng: <Text code>AL#04: High Pressure</Text>, <Text code>AL#17: Fan Failure</Text>, ...</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Bảng mã lỗi phổ biến và nguyên nhân theo tài liệu hãng" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                code: 'AL#01',
                description: 'High Room Temperature',
                cause: 'Cảm biến sai, lọc khí bẩn, block không chạy',
                solution: 'Kiểm tra cảm biến, lọc, kiểm tra máy nén và dòng điện'
              },
              {
                key: '2',
                code: 'AL#02',
                description: 'Low Room Temperature',
                cause: 'Cảm biến lỗi, van EEV kẹt mở rộng',
                solution: 'Kiểm tra setpoint, hiệu chuẩn cảm biến, reset EEV'
              },
              {
                key: '3',
                code: 'AL#04',
                description: 'High Pressure',
                cause: 'Quạt dàn nóng lỗi, gas dư, dàn nóng tắc',
                solution: 'Vệ sinh dàn nóng CAP2002, kiểm tra áp kế, quạt'
              },
              {
                key: '4',
                code: 'AL#05',
                description: 'Low Pressure',
                cause: 'Thiếu gas, rò rỉ gas, block yếu',
                solution: 'Kiểm tra áp suất, test rò gas, cân chỉnh lại lượng gas'
              },
              {
                key: '5',
                code: 'AL#10',
                description: 'Fan Failure (Indoor EC Fan)',
                cause: 'Hỏng motor EC, dây lỏng, driver lỗi',
                solution: 'Thay thế motor/quạt, kiểm tra cáp tín hiệu'
              },
              {
                key: '6',
                code: 'AL#13',
                description: 'Communication Failure (Sensor/BMS)',
                cause: 'Mất kết nối cảm biến, địa chỉ sai, cáp tín hiệu lỗi',
                solution: 'Kiểm tra cáp RS485, cấu hình địa chỉ Modbus, thay cảm biến'
              },
              {
                key: '7',
                code: 'AL#17',
                description: 'High Humidity',
                cause: 'Phun ẩm không ngắt, cảm biến độ ẩm sai',
                solution: 'Kiểm tra phun ẩm, kiểm chuẩn cảm biến RH'
              },
              {
                key: '8',
                code: 'AL#18',
                description: 'Low Humidity',
                cause: 'Không hoạt động bộ phun ẩm hoặc chạy sưởi quá lâu',
                solution: 'Kiểm tra bộ tạo ẩm, relay, nhiệt độ đầu ra'
              },
              {
                key: '9',
                code: 'AL#22',
                description: 'Condensate Pump Full / Alarm',
                cause: 'Nước ngưng không thoát, phao chống tràn kích hoạt',
                solution: 'Vệ sinh khay ngưng, kiểm tra bơm xả nước, ống thoát ngưng'
              },
              {
                key: '10',
                code: 'AL#25',
                description: 'EEPROM Failure',
                cause: 'Hỏng bộ nhớ điều khiển vi xử lý',
                solution: 'Liên hệ hãng – có thể phải thay bo điều khiển'
              }
            ]}
            columns={[
              {
                title: 'Mã lỗi',
                dataIndex: 'code',
                key: 'code',
                width: '10%',
                render: (text) => <Text code style={{ color: '#ff4d4f' }}>{text}</Text>
              },
              {
                title: 'Mô tả lỗi',
                dataIndex: 'description',
                key: 'description',
                width: '20%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Nguyên nhân thường gặp',
                dataIndex: 'cause',
                key: 'cause',
                width: '35%'
              },
              {
                title: 'Hướng xử lý cơ bản',
                dataIndex: 'solution',
                key: 'solution',
                width: '35%'
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title="Xử lý nhanh khi gặp lỗi" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                situation: 'Báo lỗi nhiều mục cùng lúc',
                action: 'Tắt khẩn cấp, kiểm tra mất pha hoặc mất nguồn trung tính'
              },
              {
                key: '2',
                situation: 'Mỗi lần bật lại đều báo lỗi áp suất',
                action: 'Kiểm tra gas → có thể bơm dư, hoặc nghẹt dàn nóng'
              },
              {
                key: '3',
                situation: 'Không điều khiển được quạt/máy nén',
                action: 'Kiểm tra relay điều khiển, driver EC fan'
              },
              {
                key: '4',
                situation: 'Không xem được dữ liệu từ xa',
                action: 'Kiểm tra địa chỉ IP, port SNMP/Modbus, cáp LAN'
              },
              {
                key: '5',
                situation: 'Cảnh báo không tự reset dù đã sửa lỗi',
                action: 'Cần reset thủ công hoặc khởi động lại hệ thống từ màn hình điều khiển'
              }
            ]}
            columns={[
              {
                title: 'Tình huống',
                dataIndex: 'situation',
                key: 'situation',
                width: '40%',
                render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>
              },
              {
                title: 'Hành động',
                dataIndex: 'action',
                key: 'action',
                width: '60%'
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title="Công cụ hỗ trợ chuẩn đoán lỗi" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                tool: 'Đồng hồ đo áp suất gas',
                purpose: 'Kiểm tra áp suất hút/xả thực tế'
              },
              {
                key: '2',
                tool: 'Ampe kìm',
                purpose: 'Đo dòng điện của quạt/máy nén'
              },
              {
                key: '3',
                tool: 'Đồng hồ vạn năng',
                purpose: 'Đo điện trở sensor, kiểm tra tiếp điểm'
              },
              {
                key: '4',
                tool: 'Phần mềm giám sát (EcoStruxure / BMS)',
                purpose: 'Theo dõi lỗi từ xa, log dữ liệu'
              }
            ]}
            columns={[
              {
                title: 'Công cụ',
                dataIndex: 'tool',
                key: 'tool',
                width: '40%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Mục đích',
                dataIndex: 'purpose',
                key: 'purpose',
                width: '60%'
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Alert
          message="Lưu ý quan trọng khi xử lý lỗi"
          description={
            <ul>
              <li key="reset">Một số lỗi không tự động reset sau khi hết điều kiện → yêu cầu kỹ thuật viên của đối tác xác nhận và bấm "Reset Alarm" trên màn hình</li>
              <li key="repeat">Nếu lỗi tái xuất hiện &gt;3 lần trong ngày → cần lập biên bản sự cố, báo bộ phận kỹ thuật của đối tác/hãng</li>
              <li key="serious">Với lỗi EEPROM, lỗi điều khiển nghiêm trọng: không nên tự sửa chữa → báo bộ phận kỹ thuật của đối tác/hãng</li>
            </ul>
          }
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      </div>

      <div id="section-2.2.5" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.2.5. Quy trình và chu kỳ bảo trì
        </Title>

        <Card title="Mục tiêu của bảo trì định kỳ" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>Duy trì khả năng làm mát chính xác (precision cooling) ổn định 24/7</li>
              <li>Phát hiện sớm và ngăn ngừa lỗi thiết bị đột ngột</li>
              <li>Tối ưu hóa tuổi thọ các linh kiện: máy nén, quạt EC, cảm biến, lọc khí, bộ sưởi</li>
              <li>Giảm thiểu thời gian dừng hệ thống và tránh rủi ro cho thiết bị CNTT</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Các hạng mục cần bảo trì định kỳ" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              { key: '1', component: 'Lọc khí EU4', cycle: 'Hàng tháng' },
              { key: '2', component: 'Dàn lạnh', cycle: '3 tháng' },
              { key: '3', component: 'Quạt EC', cycle: '3 – 6 tháng' },
              { key: '4', component: 'Máy nén', cycle: '6 tháng' },
              { key: '5', component: 'Cảm biến nhiệt – ẩm', cycle: '6 tháng' },
              { key: '6', component: 'Bộ phun ẩm', cycle: '6 tháng' },
              { key: '7', component: 'Dàn nóng (CAP2002)', cycle: '3 tháng' },
              { key: '8', component: 'Điều khiển & màn hình', cycle: '6 – 12 tháng' }
            ]}
            columns={[
              {
                title: 'STT',
                dataIndex: 'key',
                key: 'key',
                width: '10%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Thành phần',
                dataIndex: 'component',
                key: 'component',
                width: '60%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Chu kỳ',
                dataIndex: 'cycle',
                key: 'cycle',
                width: '30%',
                render: (text) => <Tag color="blue">{text}</Tag>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title="Bảo trì từng thành phần" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                component: 'Bộ lọc khí (EU4 filter)',
                location: 'Phía mặt trước dàn lạnh (sau lớp mặt nạ dễ tháo)',
                cycle: 'Vệ sinh hàng tháng, thay mới mỗi 12 tháng',
                content: 'Tháo lọc → hút bụi hoặc rửa bằng nước sạch → để khô hoàn toàn → lắp lại',
                note: 'Nếu lọc chuyển màu nâu đen hoặc bị rách → thay mới ngay bằng loại tương đương'
              },
              {
                key: '2',
                component: 'Quạt EC (Indoor Fan)',
                location: 'Dưới khoang gió đẩy ra, tiếp xúc trực tiếp với bộ lọc',
                cycle: 'Kiểm tra 3 – 6 tháng/lần',
                content: 'Kiểm tra tiếng ồn, độ rung, tốc độ RPM trên màn hình. Vệ sinh cánh quạt bằng khí nén hoặc khăn khô',
                note: 'Nếu quạt rung mạnh hoặc không quay đều → kiểm tra mô-đun điều khiển (EC Driver) hoặc thay quạt'
              },
              {
                key: '3',
                component: 'Dàn lạnh (Evaporator Coil)',
                location: 'Sau quạt và lọc khí, bên trong tủ lạnh',
                cycle: '3 tháng/lần vệ sinh bằng khí nén, 6 tháng/lần bằng hóa chất (nếu bụi bẩn)',
                content: 'Thổi khí nén nhẹ nhàng từ trong ra ngoài. Hoặc dùng dung dịch làm sạch coil không ăn mòn',
                note: 'Không dùng vòi nước áp lực cao – dễ cong cánh tản nhiệt'
              },
              {
                key: '4',
                component: 'Máy nén (Scroll Compressor)',
                location: 'Trong khoang kỹ thuật phía sau tủ',
                cycle: 'Kiểm tra 6 tháng/lần',
                content: 'Đo dòng điện hoạt động, áp suất hút – đẩy bằng đồng hồ gas (R410A). Kiểm tra rò rỉ dầu quanh thân máy',
                note: 'Mạch gas chia 2 → cần kiểm tra từng block riêng biệt. Cảnh báo: Nếu phát hiện tiếng gõ – nhiệt độ vỏ cao bất thường → ngừng ngay để kiểm tra sâu'
              },
              {
                key: '5',
                component: 'Cảm biến nhiệt độ và độ ẩm (T/RH sensors)',
                location: 'Gắn trong khoang hồi khí hoặc gắn tường phòng',
                cycle: '6 tháng/lần',
                content: 'So sánh với nhiệt ẩm kế chuẩn. Điều chỉnh nếu sai số > ±1°C hoặc ±5% RH',
                note: 'Không lau trực tiếp bằng hóa chất – dễ làm sai lệch giá trị'
              },
              {
                key: '6',
                component: 'Bộ thu và xả nước ngưng (Condensate Tray & Drain)',
                location: 'Dưới dàn lạnh, khay hứng nước ngưng',
                cycle: '1 tháng/lần kiểm tra và vệ sinh',
                content: 'Vệ sinh khay bằng nước sạch, vệ sinh lưới lọc (nếu có). Dùng máy hút bụi nước hoặc khí thổi làm sạch đường ống xả',
                note: 'Luôn kiểm tra phao chống tràn hoạt động tốt, tránh nước tràn vào mạch điện'
              },
              {
                key: '7',
                component: 'Bộ điều khiển & giao tiếp (Controller + SNMP/Modbus)',
                location: 'Mặt trước thiết bị hoặc giao diện web',
                cycle: '6 – 12 tháng/lần',
                content: 'Kiểm tra độ nhạy nút bấm, màn hình hiển thị, phản hồi điều khiển. Thử login IP, SNMP trap, kết nối với BMS',
                note: 'Cập nhật firmware nếu có bản mới từ Schneider (qua USB hoặc cổng LAN)'
              },
              {
                key: '8',
                component: 'Dàn nóng (CAP2002 – Outdoor Unit)',
                location: 'Ngoài trời, kết nối ống đồng với dàn lạnh TDAV2242A',
                cycle: '3 tháng/lần vệ sinh, 6 tháng/lần kiểm tra gas/quạt',
                content: 'Dùng khí nén hoặc nước xịt nhẹ từ trong ra. Kiểm tra hoạt động của quạt, độ rung, tốc độ quay',
                note: 'Đảm bảo khu vực dàn nóng thông thoáng – không bị che chắn gió hồi'
              },
              {
                key: '9',
                component: 'Bộ gia nhiệt và bộ tạo ẩm (Electric Heater/ Humidifier)',
                location: 'Gắn trong buồng gió hoặc riêng biệt',
                cycle: '6 tháng/lần',
                content: 'Kiểm tra điện trở heater bằng đồng hồ đo điện trở. Kiểm tra điện cực tạo ẩm có bị bám cặn hay không',
                note: 'Tháo ra vệ sinh nếu điện cực có mảng trắng (muối khoáng). Chạy test thủ công để kiểm tra kích hoạt được hay không'
              }
            ]}
            columns={[
              {
                title: 'STT',
                dataIndex: 'key',
                key: 'key',
                width: '8%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Thành phần',
                dataIndex: 'component',
                key: 'component',
                width: '20%',
                render: (text) => <Text strong style={{ fontSize: '12px' }}>{text}</Text>
              },
              {
                title: 'Vị trí',
                dataIndex: 'location',
                key: 'location',
                width: '15%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              },
              {
                title: 'Chu kỳ',
                dataIndex: 'cycle',
                key: 'cycle',
                width: '12%',
                render: (text) => <Tag color="green" style={{ fontSize: '11px' }}>{text}</Tag>
              },
              {
                title: 'Nội dung bảo trì',
                dataIndex: 'content',
                key: 'content',
                width: '25%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              },
              {
                title: 'Lưu ý kỹ thuật',
                dataIndex: 'note',
                key: 'note',
                width: '20%',
                render: (text) => <Text style={{ fontSize: '11px', color: '#ff4d4f' }}>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Alert
          message="Lưu ý khi bảo trì"
          description={
            <ul>
              <li key="power">Luôn ngắt điện trước khi thực hiện các thao tác vật lý</li>
              <li key="backup">Có thể vận hành dự phòng N+1, tạm dừng từng thiết bị để bảo trì mà không ảnh hưởng hệ thống</li>
              <li key="record">Ghi chép phiếu bảo trì, ảnh chụp log lỗi, kết quả đo đạc</li>
              <li key="material">Sử dụng vật tư tiêu chuẩn: lọc khí EU4, R410A đúng áp suất, quạt EC chính hãng</li>
            </ul>
          }
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      </div>
    </div>
  );
};

export default TDAV2242A;
