import React from 'react';
import { Typography, Card, Table, Space, Tag, Alert } from 'antd';
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ToolOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const TDAV2842A = () => {
  return (
    <div id="section-2.3" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        2.3. TDAV2842A - UNIFLAIR
      </Title>

      <div id="section-2.3.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> 2.3.1. Thông tin chung
        </Title>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="/cooling/2842.png"
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
            Hiện tại các điều hòa TDAV2842A đang được sử dụng để làm mát cho phòng Server 2, vị trí ở bên cạnh phòng Server 2.
          </Paragraph>
        </div>

        <Card title="Thông tin cơ bản" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div key="manufacturer">
              <Tag color="blue">Hãng sản xuất</Tag>
              <Text>Schneider Electric</Text>
            </div>
            <div key="origin">
              <Tag color="blue">Xuất xứ</Tag>
              <Text>Trung Quốc</Text>
            </div>
            <div key="model">
              <Tag color="blue">Model</Tag>
              <Text>TDAV2842A</Text>
            </div>
            <div key="system">
              <Tag color="blue">Loại hệ thống</Tag>
              <Text>Điều hòa chính xác (precision cooling), giải nhiệt không khí (air-cooled)</Text>
            </div>
            <div key="type">
              <Tag color="blue">Loại thiết bị</Tag>
              <Text>Tủ đứng, mặt trước (full frontal accessibility)</Text>
            </div>
            <div key="location">
              <Tag color="blue">Vị trí lắp đặt</Tag>
              <Text>Trong nhà (indoor), gió thổi từ dưới lên (upflow)</Text>
            </div>
          </Space>
        </Card>

        <Card title="Thông số kỹ thuật chi tiết" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              { key: '1', spec: 'Công suất lạnh', value: '88 kW' },
              { key: '2', spec: 'Tần số, điện áp đầu vào', value: '380V/400V/415V, 3 pha, 50Hz hoặc 1 pha 220/230V, 50Hz' },
              { key: '3', spec: 'Dung sai nhiệt độ cho phép', value: '≤ ± 1ºC (so với chuẩn 24ºC)' },
              { key: '4', spec: 'Dung sai độ ẩm cho phép', value: '≤ ± 5% (so với chuẩn 50%RH)' },
              { key: '5', spec: 'Tần suất làm việc liên tục', value: '24/24, 365 ngày/năm' },
              { key: '6', spec: 'Chỉ số SHR tại điều kiện tiêu chuẩn', value: '≥ 0.99' },
              { key: '7', spec: 'Môi chất làm lạnh', value: 'R410A hoặc R407C' },
              { key: '8', spec: 'Kích thước dàn lạnh', value: '2200mm (C) x 2600mm (R) x 900mm (Sâu)' },
              { key: '9', spec: 'Máy nén (compressor)', value: '≥ 4 Scroll (tốc độ cố định) và ≥ 2 mạch ga' },
              { key: '10', spec: 'Quạt dàn lạnh', value: '≥ 3 quạt điều khiển điện tử EC centrifugal fan (hiệu suất cao, tiết kiệm năng lượng)' },
              { key: '11', spec: 'Lưu lượng gió', value: '≥ 23500m³/h' },
              { key: '12', spec: 'Quạt dàn nóng', value: '≥ 3 quạt' },
              { key: '13', spec: 'Bộ lọc khí', value: 'Chuẩn EU4' },
              { key: '14', spec: 'Bộ sưởi', value: 'Thanh điện trở (electrical heater)' },
              { key: '15', spec: 'Công suất bộ sưởi', value: '≥ 24kW' },
              { key: '16', spec: 'Bộ phun ẩm', value: 'Điều khiển bằng vi xử lý' },
              { key: '17', spec: 'Bộ lọc bụi', value: 'Self-extinguishing (tuân thủ tiêu chuẩn EU4)' },
              { key: '18', spec: 'Van tiết lưu', value: 'Van tiết lưu điện tử (Electronic Expansion Valve – EEV)' },
              { key: '19', spec: 'Bộ điều khiển', value: 'Màn hình LCD độ phân giải tối thiểu 64x120 pixel và phím điều khiển tại chỗ cho từng máy' },
              { key: '20', spec: 'Vi xử lý (microprocessor control)', value: 'Tự khởi động lại sau mất điện. Giám sát áp suất sàn nâng, nhiệt độ, độ ẩm. Ghi lưu đến 100 trạng thái lỗi. Hỗ trợ hoạt động dự phòng N+1, override các thành phần (compressor, fan, EEV)' },
              { key: '21', spec: 'Kết nối hệ thống', value: 'SNMP, Modbus, tương thích BMS (Siemens, Johnson, EcoStruxure…)' },
              { key: '22', spec: 'Nhóm điều khiển', value: 'Tối đa 10 thiết bị có thể kết nối làm việc nhóm' },
              { key: '23', spec: 'Dòng vận hành', value: '41 A, dòng khởi động: 120 A' },
              { key: '24', spec: 'Serial Number', value: 'UCX116205, UCX116204, UCX116206' }
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

      <div id="section-2.3.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.3.2. Hướng dẫn lắp đặt
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
              <li>Bề mặt sàn chắc chắn, cân bằng</li>
              <li>Khoảng cách thông thoáng ≥ 800 mm ở mặt trước và sau để bảo trì</li>
              <li>Gần điểm cấp nguồn 3 pha 380 V, 50 Hz hoặc 1 pha 220 V/230 V</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Nguồn điện" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li>Kết nối nguồn 3 pha (380V/415V), bảo vệ bằng CB hoặc ACB</li>
              <li>Dây tín hiệu điều khiển nối từ LCD controller đến mainboard máy</li>
              <li>Lắp tiếp đất đầy đủ (theo tiêu chuẩn IEC 60364-5-54)</li>
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

      <div id="section-2.3.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ExclamationCircleOutlined style={{ marginRight: '8px' }} /> 2.3.3. Hướng dẫn vận hành và kiểm tra hàng ngày
        </Title>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="/cooling/2242control.png"
            alt="Màn hình điều khiển TDAV2842A"
            style={{
              maxWidth: '60%',
              height: 'auto',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'block',
              margin: '0 auto'
            }}
          />
          <Paragraph style={{ marginTop: '10px', fontWeight: 'bold' }}>
            Màn hình điều khiển TDAV2842A - Giao diện LCD độ phân giải 64x120 pixel
          </Paragraph>
        </div>

        <Card title="2.3.3.1. Hướng dẫn vận hành" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Khởi động thiết bị</Title>
          <Paragraph>
            <ul>
              <li>Nhấn nút "Power ON" trên màn hình điều khiển</li>
              <li>Kiểm tra trạng thái vận hành: Trên màn hình hiển thị
                <ul>
                  <li>Nhiệt độ phòng</li>
                  <li>Độ ẩm</li>
                  <li>Trạng thái từng thành phần: Fan / Comp / EEV / Heater / Humidifier</li>
                </ul>
              </li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Xác nhận các chỉ số hiển thị</Title>
          <Paragraph>
            <ul>
              <li><Text strong>Nhiệt độ phòng:</Text> 15 &lt; t &lt; 27 độ C</li>
              <li><Text strong>Giới hạn nhiệt độ cảnh báo:</Text> ±1 °C</li>
              <li><Text strong>Độ ẩm:</Text> 45% - 55% RH</li>
              <li><Text strong>Giới hạn độ ẩm cảnh báo:</Text> ±5 %</li>
              <li><Text strong>Chế độ quạt:</Text> Auto hoặc Constant (tùy thiết kế)</li>
              <li><Text strong>Cảnh báo:</Text> Không có hoặc chỉ báo "NORMAL"</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Cài đặt chế độ vận hành</Title>
          <Paragraph>
            Chọn chế độ Auto hoặc cấu hình thủ công từng phần:
            <ul>
              <li>Compressor (nén)</li>
              <li>Fan speed (tốc độ quạt)</li>
              <li>Heater / Humidifier / Dehumidifier (nếu có)</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Tích hợp hệ thống giám sát</Title>
          <Paragraph>
            <ul>
              <li>Cấu hình kết nối SNMP/BACnet/Modbus nếu kết nối BMS</li>
              <li>Thử kiểm tra kết nối với ISX Central hoặc phần mềm EcoStruxure</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="2.3.3.2. Kiểm tra hằng ngày" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                component: 'Quạt EC (Indoor Fan)',
                check: 'Có quay đều, không kêu',
                guide: 'Dựa vào âm thanh + báo tốc độ RPM trên controller'
              },
              {
                key: '2',
                component: 'Máy nén',
                check: 'Hoạt động đúng chế độ',
                guide: 'Kiểm tra thông số áp suất nếu hiển thị, nghe tiếng hoạt động trơn tru'
              },
              {
                key: '3',
                component: 'Dàn lạnh (Coil)',
                check: 'Không bị ngưng đọng nước quá nhiều',
                guide: 'Quan sát mắt thường / sensor khay nước'
              },
              {
                key: '4',
                component: 'Bộ điều khiển',
                check: 'Phản hồi nhanh, không treo',
                guide: 'Đảm bảo cài đặt hiển thị đúng, có kết nối SNMP nếu cần'
              }
            ]}
            columns={[
              {
                title: 'Thành phần',
                dataIndex: 'component',
                key: 'component',
                width: '25%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Kiểm tra',
                dataIndex: 'check',
                key: 'check',
                width: '30%',
                render: (text) => <Text>{text}</Text>
              },
              {
                title: 'Hướng dẫn',
                dataIndex: 'guide',
                key: 'guide',
                width: '45%',
                render: (text) => <Text style={{ color: '#1890ff' }}>{text}</Text>
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

        <Card title="Phân loại lỗi và dấu hiệu nhận biết" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                group: 'Lỗi nhiệt độ',
                symptom: 'TEMP SENSOR ERROR / HIGH ROOM TEMP',
                impact: 'Mất kiểm soát nhiệt độ phòng'
              },
              {
                key: '2',
                group: 'Lỗi độ ẩm',
                symptom: 'HUMID SENSOR ERROR / HIGH RH',
                impact: 'Không điều chỉnh được ẩm'
              },
              {
                key: '3',
                group: 'Lỗi gas',
                symptom: 'LOW PRESSURE / HIGH PRESSURE / NO GAS',
                impact: 'Máy nén không hoạt động'
              },
              {
                key: '4',
                group: 'Lỗi máy nén',
                symptom: 'COMP1/2/3/4 FAILURE / THERMAL TRIP',
                impact: 'Máy nén không chạy / tắt'
              },
              {
                key: '5',
                group: 'Lỗi quạt',
                symptom: 'FAN FAILURE / RPM ERROR',
                impact: 'Không lưu thông khí'
              },
              {
                key: '6',
                group: 'Lỗi van tiết lưu',
                symptom: 'EEV ERROR / VALVE STUCK',
                impact: 'Không điều chỉnh được lạnh'
              },
              {
                key: '7',
                group: 'Lỗi mất kết nối',
                symptom: 'MODBUS FAIL / DISPLAY COMM FAIL',
                impact: 'Mất điều khiển / theo dõi'
              },
              {
                key: '8',
                group: 'Tràn nước ngưng',
                symptom: 'HIGH WATER LEVEL / DRAIN FAIL',
                impact: 'Ngưng hoạt động toàn hệ thống'
              }
            ]}
            columns={[
              {
                title: 'Nhóm lỗi',
                dataIndex: 'group',
                key: 'group',
                width: '20%',
                render: (text) => <Tag color="red" style={{ fontSize: '11px' }}>{text}</Tag>
              },
              {
                title: 'Biểu hiện trên màn hình',
                dataIndex: 'symptom',
                key: 'symptom',
                width: '40%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              },
              {
                title: 'Tác động',
                dataIndex: 'impact',
                key: 'impact',
                width: '40%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title="Quy trình xác định lỗi cơ bản" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bước 1: Xem cảnh báo trên màn hình điều khiển</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra tab "ALARM" → Ghi lại mã lỗi và thời điểm xảy ra</li>
              <li>Ghi nhật ký: nhiệt độ, độ ẩm tại thời điểm lỗi</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bước 2: Kiểm tra cảm biến</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra các đầu nối sensor (TEMP, RH, water float)</li>
              <li>Nếu "TEMP/RH SENSOR ERROR":
                <ul>
                  <li>Rút dây sensor và cắm lại</li>
                  <li>Kiểm tra điện trở của sensor (thường ~10kΩ ở 25°C)</li>
                </ul>
              </li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bước 3: Kiểm tra quạt và nguồn</Title>
          <Paragraph>
            <ul>
              <li>Nếu lỗi "FAN FAILURE": mở tủ kiểm tra kết nối EC Fan</li>
              <li>Dùng màn hình → xem RPM từng quạt (EC Fan hỗ trợ giám sát số vòng)</li>
              <li>Quạt quay bất thường → kiểm tra nguồn cấp, tín hiệu điều khiển từ mainboard</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bước 4: Kiểm tra máy nén và hệ thống gas</Title>
          <Paragraph>
            <ul>
              <li>Nếu "HIGH/LOW PRESSURE":
                <ul>
                  <li>Kiểm tra áp suất gas qua đồng hồ nạp</li>
                  <li>Kiểm tra van EEV có mở đúng không</li>
                </ul>
              </li>
              <li>Nếu "COMP FAILURE / OVERLOAD":
                <ul>
                  <li>Đo dòng tiêu thụ thực tế → so với định mức</li>
                  <li>Kiểm tra rơ-le nhiệt, contactor, tụ khởi động (nếu dùng)</li>
                </ul>
              </li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bước 5: Kiểm tra lỗi điều khiển & truyền thông</Title>
          <Paragraph>
            <ul>
              <li>Nếu "MODBUS/COMM ERROR":
                <ul>
                  <li>Kiểm tra dây RS485 kết nối BMS</li>
                  <li>Kiểm tra cấu hình ID trùng hoặc baudrate sai</li>
                </ul>
              </li>
              <li>Nếu không hiển thị: màn hình hoặc mainboard có thể hỏng</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Công cụ hỗ trợ chuẩn đoán" style={{ marginBottom: '20px' }}>
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
                width: '60%',
                render: (text) => <Text>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title="Một số lỗi hay gặp trên màn hình" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                error: 'TEMP SENSOR ERROR',
                cause: 'Sensor hỏng / đứt / sai kết nối',
                solution: 'Thay hoặc kiểm tra lại đấu nối'
              },
              {
                key: '2',
                error: 'HIGH ROOM TEMP',
                cause: 'Máy nén không chạy / tải tăng đột ngột',
                solution: 'Kiểm tra máy nén, tải nhiệt'
              },
              {
                key: '3',
                error: 'FAN FAILURE',
                cause: 'EC Fan lỗi driver / mất nguồn / kẹt',
                solution: 'Kiểm tra nguồn + tín hiệu điều khiển'
              },
              {
                key: '4',
                error: 'DRAIN ERROR',
                cause: 'Ống thoát nước ngưng bị tắc / cảm biến nước hỏng',
                solution: 'Thông ống thoát, vệ sinh phao nước'
              },
              {
                key: '5',
                error: 'EEV FAILURE',
                cause: 'Van tiết lưu kẹt / không mở',
                solution: 'Kiểm tra tín hiệu điều khiển EEV'
              },
              {
                key: '6',
                error: 'MODBUS ERROR',
                cause: 'Đứt dây tín hiệu / trùng ID',
                solution: 'Cấu hình lại BMS hoặc thay dây'
              }
            ]}
            columns={[
              {
                title: 'Mã lỗi hiển thị',
                dataIndex: 'error',
                key: 'error',
                width: '25%',
                render: (text) => <Tag color="red" style={{ fontSize: '11px' }}>{text}</Tag>
              },
              {
                title: 'Nguyên nhân thường gặp',
                dataIndex: 'cause',
                key: 'cause',
                width: '35%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              },
              {
                title: 'Hướng xử lý',
                dataIndex: 'solution',
                key: 'solution',
                width: '40%',
                render: (text) => <Text style={{ fontSize: '11px', color: '#1890ff' }}>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title="Một số lỗi dấu hiệu cảnh báo cần xử lý ngay" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                symptom: 'Đèn lỗi đỏ nhấp nháy liên tục',
                cause: 'Cảnh báo nhiệt độ/áp suất bất thường'
              },
              {
                key: '2',
                symptom: 'Màn hình mất tín hiệu / không hiển thị',
                cause: 'Lỗi nguồn cấp hoặc module điều khiển'
              },
              {
                key: '3',
                symptom: 'Quạt không quay / quay giật',
                cause: 'Hỏng EC driver hoặc kết nối quạt'
              },
              {
                key: '4',
                symptom: 'Máy nén chạy liên tục không ngắt',
                cause: 'Sensor sai lệch / hư van EEV / quá tải lạnh'
              }
            ]}
            columns={[
              {
                title: 'Hiện tượng',
                dataIndex: 'symptom',
                key: 'symptom',
                width: '40%',
                render: (text) => <Tag color="orange" style={{ fontSize: '11px' }}>{text}</Tag>
              },
              {
                title: 'Nguyên nhân có thể',
                dataIndex: 'cause',
                key: 'cause',
                width: '60%',
                render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Alert
          message="Lưu ý quan trọng"
          description={
            <ul>
              <li key="1">Lỗi nghiêm trọng (gas, máy nén, bo điều khiển) → liên hệ kỹ thuật hãng Schneider</li>
              <li key="2">Thường xuyên ghi nhật ký cảnh báo → giúp phát hiện lỗi định kỳ</li>
              <li key="3">Không can thiệp phần mềm điều khiển cấp hệ thống (firmware) nếu không được hãng hướng dẫn</li>
            </ul>
          }
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      </div>

      <div id="section-2.3.5" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.3.5. Quy trình và chu kỳ bảo trì
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
              { key: '1', component: 'Lưới lọc gió (Filter)', cycle: 'Hàng tháng' },
              { key: '2', component: 'Quạt EC (Indoor Fan)', cycle: '6 tháng' },
              { key: '3', component: 'Dàn lạnh (Evaporator Coil)', cycle: '6 tháng' },
              { key: '4', component: 'Cảm biến nhiệt độ & độ ẩm', cycle: '3–6 tháng' },
              { key: '5', component: 'Máy nén (Compressor)', cycle: '3–12 tháng' },
              { key: '6', component: 'Van tiết lưu điện tử (EEV)', cycle: '6–12 tháng' },
              { key: '7', component: 'Bộ gia nhiệt (Heater)', cycle: '6 tháng' },
              { key: '8', component: 'Bộ tạo ẩm (Humidifier)', cycle: '6–12 tháng' },
              { key: '9', component: 'Ống thoát nước ngưng', cycle: 'Tháng / 3 tháng' },
              { key: '10', component: 'Nguồn điện và cầu đấu', cycle: '3–6 tháng' },
              { key: '11', component: 'Mạch điều khiển chính (Mainboard)', cycle: '12 tháng' },
              { key: '12', component: 'Màn hình LCD / Giao diện điều khiển', cycle: '6 Tháng' },
              { key: '13', component: 'Hệ thống gas lạnh (áp suất hút/xả)', cycle: '6–12 tháng' },
              { key: '14', component: 'Tủ điện & khay cáp', cycle: '6 tháng' },
              { key: '15', component: 'Giao tiếp SNMP / Modbus / BMS', cycle: '6 tháng' }
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
                render: (text) => <Text>{text}</Text>
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
                component: 'Lưới lọc gió (Filter)',
                location: 'Phía trước hoặc dưới mặt hút gió',
                cycle: 'Hàng tháng',
                content: 'Vệ sinh bằng khí nén hoặc rửa nước sạch, thay mới khi rách hoặc nghẹt',
                note: 'Phơi khô hoàn toàn trước khi lắp lại'
              },
              {
                key: '2',
                component: 'Quạt EC (Indoor Fan)',
                location: 'Cuối dòng khí, nối với motor',
                cycle: '3 – 6 tháng',
                content: 'Vệ sinh cánh, kiểm tra tiếng ồn, tốc độ quay, tình trạng driver điều khiển',
                note: 'Không dùng lực tác động mạnh vào cánh'
              },
              {
                key: '3',
                component: 'Cảm biến nhiệt độ/độ ẩm',
                location: 'Gắn gần đầu hồi gió',
                cycle: '3 tháng',
                content: 'So sánh thông số, hiệu chuẩn nếu sai lệch ±1°C hoặc ±5%RH',
                note: 'Kiểm tra kết nối dây sensor'
              },
              {
                key: '4',
                component: 'Dàn lạnh (Evaporator Coil)',
                location: 'Bên trong thân máy, phía sau lọc gió',
                cycle: '6 tháng',
                content: 'Vệ sinh bằng dung dịch trung tính, lau khô hoàn toàn',
                note: 'Không dùng hóa chất ăn mòn, tránh cong lá nhôm'
              },
              {
                key: '5',
                component: 'Máy nén (Compressor)',
                location: 'Trong khoang kỹ thuật (tủ chính)',
                cycle: '6 – 12 tháng',
                content: 'Đo dòng, kiểm tra rung/tiếng ồn, vận hành đúng chu kỳ',
                note: 'Ghi nhật ký dòng định mức'
              },
              {
                key: '6',
                component: 'Van tiết lưu điện tử (EEV)',
                location: 'Gắn giữa đường gas trước coil',
                cycle: '12 tháng',
                content: 'Kiểm tra tín hiệu điều khiển, test khả năng đóng/mở',
                note: 'Không chỉnh tay nếu không có chỉ định từ hãng'
              },
              {
                key: '7',
                component: 'Bộ tạo ẩm (Humidifier)',
                location: 'Gắn trong buồng gió hoặc riêng biệt',
                cycle: '6 tháng',
                content: 'Làm sạch buồng ẩm, thay điện cực nếu bị cáu cặn, kiểm tra cấp nước và đường xả',
                note: 'Dùng nước sạch, tránh cặn khoáng'
              },
              {
                key: '8',
                component: 'Bộ gia nhiệt (Heater)',
                location: 'Gắn trong buồng gió hoặc riêng biệt',
                cycle: '6 – 12 tháng',
                content: 'Kiểm tra điện trở, test khởi động, vệ sinh điện trở',
                note: 'Cắt nguồn trước khi thao tác'
              },
              {
                key: '9',
                component: 'Khay và ống thoát nước ngưng',
                location: 'Dưới dàn lạnh',
                cycle: '3 tháng',
                content: 'Làm sạch, test cảm biến chống tràn hoạt động',
                note: 'Tránh nước tràn gây chập tủ'
              },
              {
                key: '10',
                component: 'Mạch điều khiển chính (Mainboard)',
                location: 'Bên trong tủ điều khiển chính (control compartment), phía trên hoặc phía trước máy nén, phía sau cửa tủ điện mặt trước của thiết bị',
                cycle: '12 tháng',
                content: 'Kiểm tra kết nối, vệ sinh bụi, cập nhật firmware nếu có',
                note: 'Tránh tĩnh điện, tháo đúng chuẩn'
              },
              {
                key: '11',
                component: 'Màn hình điều khiển LCD',
                location: 'Mặt trước tủ',
                cycle: '3 – 6 tháng',
                content: 'Lau sạch bề mặt, kiểm tra phím chức năng, độ nhạy',
                note: 'Không dùng hóa chất lỏng'
              },
              {
                key: '12',
                component: 'Tủ điện, CB, contactor, relay',
                location: 'Nằm bên hông hoặc phía trước thiết bị',
                cycle: '6 tháng',
                content: 'Siết đầu nối, kiểm tra tiếp điểm, vệ sinh bụi',
                note: 'Kiểm tra khi có tải để đánh giá chính xác'
              },
              {
                key: '13',
                component: 'Giao tiếp SNMP/Modbus/BMS',
                location: 'Mặt trước thiết bị hoặc giao diện web',
                cycle: '6 tháng',
                content: 'Kiểm tra truyền nhận dữ liệu, địa chỉ, ID, thông số kết nối',
                note: 'Đảm bảo dây tín hiệu không lỏng, chống nhiễu'
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
                title: 'Thành phần',
                dataIndex: 'component',
                key: 'component',
                width: '15%',
                render: (text) => <Text style={{ fontSize: '10px' }}>{text}</Text>
              },
              {
                title: 'Vị trí',
                dataIndex: 'location',
                key: 'location',
                width: '20%',
                render: (text) => <Text style={{ fontSize: '10px' }}>{text}</Text>
              },
              {
                title: 'Chu kỳ',
                dataIndex: 'cycle',
                key: 'cycle',
                width: '10%',
                render: (text) => <Tag color="blue" style={{ fontSize: '10px' }}>{text}</Tag>
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
                width: '25%',
                render: (text) => <Text style={{ fontSize: '10px', color: '#1890ff' }}>{text}</Text>
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
              <li key="1">Luôn ngắt điện trước khi thực hiện các thao tác vật lý</li>
              <li key="2">Có thể vận hành dự phòng N+1, tạm dừng từng thiết bị để bảo trì mà không ảnh hưởng hệ thống</li>
              <li key="3">Ghi chép phiếu bảo trì, ảnh chụp log lỗi, kết quả đo đạc</li>
              <li key="4">Sử dụng vật tư tiêu chuẩn: lọc khí EU4, R410A hoặc R407C đúng áp suất, quạt EC chính hãng</li>
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

export default TDAV2842A;
