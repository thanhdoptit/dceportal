import React from 'react';
import { Typography, Table, Card, Divider, Alert, Space, Tag } from 'antd';
import {
  InfoCircleOutlined,
  ToolOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const TDAV1321A = () => {
  return (
    <div id="section-2.1" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        2.1. TDAV1321A - UNIFLAIR
      </Title>

      <div id="section-2.1.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> 2.1.1. Thông tin chung
        </Title>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="/cooling/1321.png"
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
            TDAV1321A đang được sử dụng trong phòng UPS tầng 1 của trung tâm dữ liệu Hòa Lạc
          </Paragraph>
        </div>

        <Card title="Thông tin cơ bản" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div key="basic">
              <Tag color="blue">Tên dòng</Tag>
              <Text>Uniflair TDAV / TUAV</Text>
            </div>
            <div key="type">
              <Tag color="blue">Loại thiết bị</Tag>
              <Text>Điều hòa làm mát không khí trực tiếp (Direct Expansion – DX), giải nhiệt bằng không khí (Air Cooled)</Text>
            </div>
            <div key="purpose">
              <Tag color="blue">Mục đích sử dụng</Tag>
              <Text>Dành cho trung tâm dữ liệu cỡ nhỏ đến vừa</Text>
            </div>
            <div key="location">
              <Tag color="blue">Vị trí lắp đặt</Tag>
              <Text>Trong nhà, có cấu hình gió thổi từ dưới lên (upflow)</Text>
            </div>
          </Space>
        </Card>

        <Card title="Thông số kỹ thuật chi tiết" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              { key: '1', spec: 'Model', value: 'TDAV1321A' },
              { key: '2', spec: 'Công suất lạnh', value: '48.1 kW' },
              { key: '3', spec: 'Tần số, điện áp đầu vào', value: '380V/400V/415V 3 pha, 50Hz hoặc 1 pha 220/230V' },
              { key: '4', spec: 'Môi chất làm lạnh', value: 'R410A' },
              { key: '5', spec: 'Tần suất làm việc liên tục', value: '24/24, 365 ngày/năm' },
              { key: '6', spec: 'Kích thước dàn lạnh', value: '1960mm (C) x 1720mm (R) x 865mm (Sâu)' },
              { key: '7', spec: 'Kích thước dàn nóng', value: '2277mm x 350mm x 700mm' },
              { key: '8', spec: 'Máy nén (compressor)', value: '2 Scroll (tốc độ cố định)' },
              { key: '9', spec: 'Quạt dàn lạnh', value: '2 quạt điều khiển điện tử EC centrifugal fan (hiệu suất cao, tiết kiệm năng lượng)' },
              { key: '10', spec: 'Quạt dàn nóng', value: '4 quạt' },
              { key: '11', spec: 'Bộ lọc khí', value: 'Chuẩn EU4' },
              { key: '12', spec: 'Bộ sưởi', value: 'Điện (electrical heater)' },
              { key: '13', spec: 'Van tiết lưu', value: 'Van tiết lưu điện tử (Electronic Expansion Valve – EEV)' },
              { key: '14', spec: 'Mức độ ồn', value: '54.6 dB(A) khi quạt chạy 100%' },
              { key: '15', spec: 'Màn hình hiển thị', value: 'Semi-graphic, có thể tải/cập nhật firmware và giám sát hoạt động' },
              { key: '16', spec: 'Tủ điện/microprocessor', value: 'Theo dõi và tối ưu các điều kiện vận hành, hiển thị cảnh báo khi có lỗi' },
              { key: '17', spec: 'Dòng vận hành', value: '26 A, dòng khởi động: 65 A' }
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

      <div id="section-2.1.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.1.2. Hướng dẫn lắp đặt
        </Title>

        <Card title="Kiểm tra thiết bị" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>Kiểm tra ngoại quan vỏ máy, phụ kiện đi kèm (ống gas, bộ lọc, cảm biến…)</li>
              <li>Đảm bảo thiết bị còn nguyên đai kiện của hãng</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Xác định vị trí lắp đặt" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>Thiết bị dàn lạnh cần được đặt trong nhà (indoor) với kích thước 1960mm x 1720mm x 865mm</li>
              <li>Dàn nóng (outdoor unit) đặt ngoài trời, có khả năng chịu nhiệt độ tới 45°C, kích thước 2277mm x 350mm x 700mm</li>
              <li>Đảm bảo thông thoáng cho gió vào/ra (không cản trở luồng không khí từ quạt EC)</li>
              <li>Không lắp quá sát tường hoặc thiết bị khác, đảm bảo bảo trì mặt trước (full frontal accessibility)</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Nguồn điện" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>Nguồn yêu cầu: 380V/400V/415V - 3 pha, 50Hz hoặc 1 pha 220/230V</li>
              <li>Cần đảm bảo ổn định &plusmn;10% điện áp đầu vào</li>
              <li>Cài đặt tiếp địa an toàn theo tiêu chuẩn điện IEC/EN 60204-1</li>
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

      <div id="section-2.1.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ExclamationCircleOutlined style={{ marginRight: '8px' }} /> 2.1.3. Hướng dẫn vận hành và kiểm tra hàng ngày
        </Title>

        <Card title="2.1.3.1. Vận hành cơ bản" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Máy điều hòa chính xác TDAV1321A hoạt động theo chế độ tự động, điều khiển bằng vi xử lý (microprocessor controller) và giao diện màn hình semi-graphic. Người dùng chỉ cần vận hành theo các bước:
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Khởi động máy:</Title>
          <ul>
            <li>Đảm bảo nguồn cấp điện ổn định</li>
            <li>Bật công tắc nguồn ở tủ điều khiển hoặc màn hình</li>
            <li>Máy sẽ tự kiểm tra hệ thống (self-check)</li>
            <li>Quan sát màn hình: trạng thái khởi động, cảnh báo nếu có, thông số cài đặt</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Chọn chế độ vận hành:</Title>
          <Paragraph>Trên màn hình điều khiển, có thể chọn:</Paragraph>
          <ul>
            <li>Cool (làm mát)</li>
            <li>Heat (nếu sử dụng bộ sưởi)</li>
            <li>Auto (tự động chuyển đổi theo điều kiện)</li>
            <li>Dehumidify (hút ẩm)</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Điều chỉnh các thông số:</Title>
          <ul>
            <li><Text strong>Nhiệt độ:</Text> 15°C &lt; t &lt; 27°C</li>
            <li><Text strong>Giới hạn nhiệt độ cảnh báo:</Text> &plusmn;0.5°C</li>
            <li><Text strong>Độ ẩm:</Text> 45% - 55% RH</li>
            <li><Text strong>Giới hạn độ ẩm cảnh báo:</Text> &plusmn;3 %</li>
            <li><Text strong>Cài đặt chế độ vận hành:</Text> Làm mát / Sưởi / Tự động</li>
            <li><Text strong>Bật/tắt chức năng:</Text> Phun ẩm, bộ sưởi hoặc quạt theo thời gian</li>
            <li><Text strong>Kiểm tra chế độ dự phòng N+1:</Text> Đảm bảo chỉ 1 thiết bị ở chế độ standby</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kết nối với hệ thống quản lý tập trung (tùy chọn):</Title>
          <ul>
            <li><Text strong>SNMP:</Text> Cấu hình IP thiết bị, subnet mask, gateway</li>
            <li><Text strong>Modbus:</Text> Đặt địa chỉ thiết bị, tốc độ baud rate, parity, stop bit</li>
            <li>Cài đặt tích hợp với NetBotz</li>
          </ul>
        </Card>

        <Card title="2.1.3.2. Kiểm tra hàng ngày" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra qua màn hình điều khiển</Title>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="/cooling/1321control.png"
              alt="Màn hình điều khiển của TDAV1321A"
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
              Màn hình điều khiển của TDAV1321A
            </Paragraph>
          </div>
          <ul>
            <li><Text strong>Xem trạng thái thiết bị:</Text> "RUNNING", "STANDBY", "ALARM"</li>
            <li><Text strong>Kiểm tra thông số:</Text>
              <ul>
                <li>Nhiệt độ phòng</li>
                <li>Độ ẩm tương đối</li>
                <li>Trạng thái máy nén, quạt, bộ sưởi, phun ẩm</li>
                <li>Kiểm tra cảnh báo (nếu có): như lỗi cảm biến, quạt ngừng, áp suất gas</li>
              </ul>
            </li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Quan sát thiết bị vật lý</Title>
          <ul>
            <li>Kiểm tra luồng gió thổi ra đều và mát</li>
            <li>Không có tiếng ồn bất thường từ quạt, máy nén</li>
            <li>Không có rung lắc hoặc chảy nước ngưng tại thân máy</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra cảnh báo hệ thống</Title>
          <Paragraph><Text strong>Cảnh báo thường gặp:</Text></Paragraph>
          <ul>
            <li>Cảnh báo lưu lượng khí (lọc bẩn, quạt yếu)</li>
            <li>Cảnh báo áp suất gas (cao/thấp)</li>
            <li>Mất kết nối tín hiệu BMS/NetBotz</li>
          </ul>
          <Paragraph>
            <Text strong>Lưu ý:</Text> Các cảnh báo được lưu và có thể xem lại lịch sử trong menu ALARM LOG
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.1.4" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ExclamationCircleOutlined style={{ marginRight: '8px' }} /> 2.1.4. Hướng dẫn xác định nguyên nhân lỗi
        </Title>

        <Card title="Các phương pháp xác định lỗi" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Màn hình điều khiển trung tâm (trên dàn lạnh)</Title>
          <ul>
            <li>Hiển thị lỗi trực tiếp bằng mã hoặc mô tả</li>
            <li>Có chức năng lưu lịch sử báo động để tra cứu lại</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Giao diện phần mềm giám sát từ xa</Title>
          <ul>
            <li>Giao tiếp SNMP (qua MIB) hoặc Modbus</li>
            <li>Cho phép xem báo động, trạng thái thiết bị, nhật ký lỗi</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Các thiết bị giám sát môi trường đi kèm (NetBotz...)</Title>
          <ul>
            <li>Có thể phát hiện lỗi từ môi trường: độ ẩm quá cao, nhiệt độ tăng đột ngột, rò rỉ nước...</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Xem mã lỗi và mô tả lỗi trên màn hình</Title>
          <ul>
            <li>Thường có dạng: HP ALARM, FAN ERROR, SENSOR ERROR...</li>
            <li>Vào mục "Alarm Log" để xem lịch sử lỗi và thời gian xảy ra</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra thông số hoạt động thực tế</Title>
          <ul>
            <li>So sánh nhiệt độ, độ ẩm hiển thị với thiết bị đo ngoài</li>
            <li>Kiểm tra tình trạng quạt, máy nén, độ rung, độ ồn</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Phân tích theo nhóm lỗi</Title>
          <ul>
            <li><Text strong>Nhóm nguồn:</Text> máy không khởi động, mất điện</li>
            <li><Text strong>Nhóm lưu lượng gió:</Text> yếu lạnh, lỗi quạt, tắc lọc</li>
            <li><Text strong>Nhóm môi chất lạnh:</Text> thiếu gas, nghẹt ống, hỏng van</li>
            <li><Text strong>Nhóm điều khiển:</Text> cảm biến sai, mất tín hiệu, cấu hình sai</li>
          </ul>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Sử dụng thiết bị hỗ trợ</Title>
          <ul>
            <li>Đồng hồ đo gas, vạn năng kế, thiết bị kiểm tra tiếp địa</li>
            <li>Laptop để truy xuất dữ liệu qua giao thức SNMP hoặc Modbus</li>
          </ul>
        </Card>

        <Card title="Các lỗi thường gặp và cách xác định nguyên nhân" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                error: 'Không khởi động được',
                symptom: 'Màn hình không sáng, máy không chạy',
                cause: 'Mất nguồn điện, Aptomat chưa bật, Dây nguồn đứt',
                solution: 'Kiểm tra nguồn cấp, aptomat, cầu chì'
              },
              {
                key: '2',
                error: 'Báo lỗi áp suất gas',
                symptom: 'Mã lỗi HP/LP, áp suất cao/thấp',
                cause: 'Thiếu gas / rò rỉ gas, Block hỏng, Tắc van tiết lưu',
                solution: 'Đo áp suất gas, kiểm tra rò rỉ'
              },
              {
                key: '3',
                error: 'Cảnh báo quạt dàn lạnh',
                symptom: 'Không có gió thổi ra, cảnh báo EC fan',
                cause: 'Quạt hỏng, Bộ điều khiển quạt lỗi, Lỏng dây kết nối',
                solution: 'Kiểm tra cấp nguồn và tín hiệu điều khiển'
              },
              {
                key: '4',
                error: 'Lỗi bộ lọc khí (lọc bẩn)',
                symptom: 'Báo "Air Filter Dirty"',
                cause: 'Tích bụi lâu ngày, Gió yếu, tăng tải máy nén',
                solution: 'Kiểm tra trực tiếp bộ lọc, thay/làm sạch'
              },
              {
                key: '5',
                error: 'Quá nhiệt dàn nóng',
                symptom: 'Báo lỗi nhiệt độ cao',
                cause: 'Môi trường ngoài trời quá nóng, Dàn nóng đặt sai vị trí',
                solution: 'Đo nhiệt độ môi trường, kiểm tra thông gió'
              },
              {
                key: '6',
                error: 'Lỗi cảm biến nhiệt/ẩm',
                symptom: 'Giá trị đọc bị sai hoặc không hiển thị',
                cause: 'Cảm biến hỏng, Dây tín hiệu đứt, Mất kết nối điều khiển',
                solution: 'So sánh với nhiệt ẩm kế độc lập'
              },
              {
                key: '7',
                error: 'Cảnh báo rò rỉ nước',
                symptom: 'Hệ thống NetBotz báo động Leak',
                cause: 'Dây cảm biến ẩm ướt do rò, Ngưng tụ bất thường',
                solution: 'Kiểm tra sàn dưới thiết bị, khay nước ngưng'
              },
              {
                key: '8',
                error: 'Không đạt nhiệt độ/độ ẩm',
                symptom: 'Thông số chênh lệch lớn với cài đặt',
                cause: 'Cảm biến sai, Dàn lạnh không đủ tải, Rò khí nóng',
                solution: 'So sánh nhiệt ẩm kế, kiểm tra lưu lượng gió'
              },
              {
                key: '9',
                error: 'Không chuyển sang dự phòng',
                symptom: 'Thiết bị phụ không hoạt động khi lỗi',
                cause: 'Cài sai chế độ N+1, Thiết bị dự phòng bị lỗi',
                solution: 'Kiểm tra cấu hình dự phòng, test chuyển đổi'
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
                title: 'Loại lỗi',
                dataIndex: 'error',
                key: 'error',
                width: '18%',
                render: (text) => <Tag color="red" style={{ fontSize: '11px' }}>{text}</Tag>
              },
              {
                title: 'Dấu hiệu / Cảnh báo',
                dataIndex: 'symptom',
                key: 'symptom',
                width: '22%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              },
              {
                title: 'Nguyên nhân cụ thể',
                dataIndex: 'cause',
                key: 'cause',
                width: '26%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              },
              {
                title: 'Cách kiểm tra',
                dataIndex: 'solution',
                key: 'solution',
                width: '26%',
                render: (text) => <Text style={{ fontSize: '11px', color: '#1890ff' }}>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>

      <div id="section-2.1.5" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.1.5. Quy trình và chu kỳ bảo trì
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
              { key: '1', component: 'Bộ lọc khí (EU4)', cycle: 'Hàng tháng' },
              { key: '2', component: 'Dàn lạnh, dàn nóng', cycle: '3 – 6 tháng' },
              { key: '3', component: 'Quạt EC', cycle: '3 – 6 tháng' },
              { key: '4', component: 'Máy nén (Scroll)', cycle: '6 – 12 tháng' },
              { key: '5', component: 'Bộ sưởi', cycle: '6 tháng' },
              { key: '6', component: 'Hệ thống van tiết lưu điện tử (EEV)', cycle: '6 – 12 tháng' },
              { key: '7', component: 'Hệ thống điều khiển', cycle: '6 – 12 tháng' },
              { key: '8', component: 'Cảm biến nhiệt độ, độ ẩm', cycle: '3 – 6 tháng' },
              { key: '9', component: 'Bộ phun ẩm (Humidifier)', cycle: '6 – 12 tháng' },
              { key: '10', component: 'Bộ sưởi điện (Electric heater)', cycle: '6 – 12 tháng' },
              { key: '11', component: 'Kiểm tra gas lạnh', cycle: '6 – 12 tháng' },
              { key: '12', component: 'Kiểm tra kết nối điện', cycle: '6 tháng' },
              { key: '13', component: 'Kiểm tra cảnh báo NetBotz (nếu dùng)', cycle: '6 tháng' }
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
                width: '65%',
                render: (text) => <Text strong style={{ fontSize: '12px' }}>{text}</Text>
              },
              {
                title: 'Chu kỳ',
                dataIndex: 'cycle',
                key: 'cycle',
                width: '27%',
                render: (text) => <Tag color="blue" style={{ fontSize: '11px' }}>{text}</Tag>
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
                component: 'Bộ lọc khí EU4',
                location: 'Mặt trước dàn lạnh (khe hút gió)',
                cycle: 'Hàng tháng',
                content: 'Tháo bộ lọc ra vệ sinh (bụi bám). Thay mới nếu biến dạng, thủng hoặc giảm lưu lượng',
                note: 'Làm sạch bằng khí nén hoặc nước áp lực thấp. Phơi khô hoàn toàn trước khi lắp lại'
              },
              {
                key: '2',
                component: 'Dàn trao đổi nhiệt (dàn lạnh)',
                location: 'Phía trong thiết bị, sau lớp lọc khí',
                cycle: '3 – 6 tháng',
                content: 'Vệ sinh cánh tản nhiệt nhôm. Kiểm tra oxy hóa ăn mòn',
                note: 'Dùng chổi mềm, nước hoặc hóa chất chuyên dụng, tránh làm cong cánh nhôm'
              },
              {
                key: '3',
                component: 'Quạt EC dàn lạnh',
                location: 'Bên trong khoang gió đẩy, dưới nắp trên',
                cycle: '3 – 6 tháng',
                content: 'Kiểm tra độ ồn, độ rung. Làm sạch bụi cánh quạt',
                note: 'Không tháo bộ điều tốc khi không cần thiết. Tránh va đập vào động cơ quạt'
              },
              {
                key: '4',
                component: 'Máy nén Scroll',
                location: 'Khoang kỹ thuật bên dưới (sau vách dưới thiết bị)',
                cycle: '6 tháng – 12 tháng',
                content: 'Đo dòng vận hành & khởi động. Kiểm tra độ rung, ống đồng, tiếng ồn bất thường',
                note: 'Đảm bảo cách ly điện trước khi kiểm tra. Không mở vỏ nén, tránh rò gas'
              },
              {
                key: '5',
                component: 'Dàn nóng (condenser CAP)',
                location: 'Ngoài trời (gần thiết bị hoặc trên mái)',
                cycle: '3 – 6 tháng',
                content: 'Làm sạch cánh tản nhiệt. Kiểm tra quạt dàn nóng. Đảm bảo thông gió tốt',
                note: 'Tránh nước áp lực mạnh vào motor quạt. Kiểm tra chuột/rác cản trở thông gió'
              },
              {
                key: '6',
                component: 'Van tiết lưu điện tử (EEV)',
                location: 'Trong đường ống gas, gần coil lạnh',
                cycle: '6 tháng – 12 tháng',
                content: 'Kiểm tra khả năng đóng/mở. Kiểm tra nhiệt độ trước và sau van',
                note: 'Không điều chỉnh bằng tay. Cần kỹ thuật viên có đồng hồ manifold để đo'
              },
              {
                key: '7',
                component: 'Cảm biến nhiệt độ / độ ẩm',
                location: 'Gắn trên đường gió hồi và gió cấp',
                cycle: '3 – 6 tháng',
                content: 'Đo và đối chiếu sai số. Hiệu chuẩn nếu sai số vượt ngưỡng ±0.5°C, ±3% RH',
                note: 'Không tháo khi có điện. Dùng thiết bị hiệu chuẩn đúng tiêu chuẩn công nghiệp'
              },
              {
                key: '8',
                component: 'Bộ sưởi điện (Electric heater)',
                location: 'Gắn sau dàn lạnh',
                cycle: '6 tháng',
                content: 'Kiểm tra điện trở cách điện. Kiểm tra relay điều khiển',
                note: 'Đảm bảo thiết bị không quá nhiệt. Có thể kiểm tra nhiệt độ bề mặt trong lúc hoạt động ngắn hạn'
              },
              {
                key: '9',
                component: 'Bộ phun ẩm (Humidifier)',
                location: 'Dưới đáy dàn lạnh, gần khay nước ngưng',
                cycle: '6 tháng – 12 tháng',
                content: 'Kiểm tra vòi phun, bơm nước. Tẩy cặn canxi nếu dùng nước cứng. Kiểm tra điện trở bốc hơi',
                note: 'Dùng nước tinh khiết nếu có. Tắt hoàn toàn thiết bị trước khi tháo rửa'
              },
              {
                key: '10',
                component: 'Khay nước ngưng và ống xả',
                location: 'Dưới đáy thiết bị',
                cycle: 'Hàng tháng – 3 tháng',
                content: 'Vệ sinh khay. Kiểm tra ống xả không nghẹt. Đảm bảo không tràn nước hoặc rò rỉ',
                note: 'Có thể đổ thêm dung dịch chống nấm mốc vào khay nếu phòng ẩm'
              },
              {
                key: '11',
                component: 'Tủ điều khiển và màn hình',
                location: 'Phía trước thân máy',
                cycle: '6 tháng – 12 tháng',
                content: 'Kiểm tra màn hình, nút bấm. Cập nhật phần mềm nếu Schneider cung cấp. Kiểm tra giao tiếp Modbus/SNMP',
                note: 'Lưu lại log lỗi định kỳ. Backup cấu hình trước khi nâng cấp firmware'
              },
              {
                key: '12',
                component: 'Hệ thống điện và tiếp địa',
                location: 'Cáp nguồn, tủ CB',
                cycle: '6 tháng – 12 tháng',
                content: 'Đo áp – dòng hoạt động. Siết lại đầu cos. Kiểm tra tiếp địa, rò rỉ điện',
                note: 'Cần kỹ thuật viên có đồng hồ đo cách điện / đo trở kháng đất'
              },
              {
                key: '13',
                component: 'Cảnh báo & log lỗi',
                location: 'Menu điều khiển hoặc kết nối từ xa',
                cycle: 'Hàng tuần',
                content: 'Xem lại log alarm. Phân tích và khắc phục cảnh báo. Đánh giá hiệu suất thiết bị',
                note: 'Không xóa log nếu chưa lưu lại để đối chiếu. Đặt lịch xuất log tự động (nếu có phần mềm giám sát)'
              }
            ]}
            columns={[
              {
                title: 'STT',
                dataIndex: 'key',
                key: 'key',
                width: '6%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Thành phần',
                dataIndex: 'component',
                key: 'component',
                width: '18%',
                render: (text) => <Text strong style={{ fontSize: '11px' }}>{text}</Text>
              },
              {
                title: 'Vị trí trên thiết bị',
                dataIndex: 'location',
                key: 'location',
                width: '15%',
                render: (text) => <Text style={{ fontSize: '10px' }}>{text}</Text>
              },
              {
                title: 'Chu kỳ bảo trì',
                dataIndex: 'cycle',
                key: 'cycle',
                width: '10%',
                render: (text) => <Tag color="green" style={{ fontSize: '10px' }}>{text}</Tag>
              },
              {
                title: 'Nội dung bảo trì',
                dataIndex: 'content',
                key: 'content',
                width: '25%',
                render: (text) => <Text style={{ fontSize: '10px' }}>{text}</Text>
              },
              {
                title: 'Lưu ý kỹ thuật',
                dataIndex: 'note',
                key: 'note',
                width: '26%',
                render: (text) => <Text style={{ fontSize: '10px', color: '#ff4d4f' }}>{text}</Text>
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

export default TDAV1321A;
