import React from 'react';
import { Typography, Card, Table, Space, Tag, Alert, Divider } from 'antd';
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
  SettingOutlined
} from '@ant-design/icons';
import WaterSystemDevices from '../components/WaterSystemDevices';

const { Title, Paragraph, Text } = Typography;

const BMSChiller = () => {
  return (
    <div id="section-2.5" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <SettingOutlined style={{ marginRight: '8px' }} />
        2.5. Hệ thống BMS Chiller - TTDL Vân Canh
      </Title>

      <div id="section-2.5.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> 2.5.1. Thông tin chung
        </Title>

        <Alert
          message="Hệ thống quản lý tòa nhà"
          description="BMS (Building Management System) là hệ thống quản lý tòa nhà tích hợp giám sát và điều khiển toàn bộ hệ thống chiller trong TTDL Vân Canh."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="Thông tin cơ bản hệ thống BMS Chiller TTDL Vân Canh" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div key="type">
              <Tag color="blue">Loại hệ thống</Tag>
              <Text>Building Management System tích hợp Chiller Control</Text>
            </div>
            <div key="function">
              <Tag color="blue">Chức năng chính</Tag>
              <Text>Giám sát và điều khiển toàn bộ hệ thống làm mát TTDL Vân Canh</Text>
            </div>
            <div key="protocol">
              <Tag color="blue">Giao thức truyền thông</Tag>
              <Text>Modbus RTU/TCP, PLC S7-1200</Text>
            </div>
            <div key="integration">
              <Tag color="blue">Tích hợp thiết bị</Tag>
              <Text>SMARDT Chiller, UNIFLAIR PAC, InRow CW, TES Tank, Pumps, Valves</Text>
            </div>
            <div key="monitoring">
              <Tag color="blue">Giám sát realtime</Tag>
              <Text>Nhiệt độ, áp suất, lưu lượng, trạng thái thiết bị, báo cáo lỗi</Text>
            </div>
            <div key="control">
              <Tag color="blue">Điều khiển tự động</Tag>
              <Text>Auto Start/Stop, Load balancing, Emergency shutdown</Text>
            </div>
            <div key="modes">
              <Tag color="blue">Chế độ vận hành</Tag>
              <Text>Commissioning, Normal, Charge, Discharge, Emergency</Text>
            </div>
            <div key="backup">
              <Tag color="blue">Hệ thống dự phòng</Tag>
              <Text>TES Tank 10 phút, Automatic failover</Text>
            </div>
          </Space>
        </Card>

        <Card title="Thành phần hệ thống BMS Chiller TTDL Vân Canh" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              { key: '1', component: 'PLC S7-1200', function: 'Điều khiển trung tâm toàn hệ thống', location: 'Tủ điều khiển chính tại Electrical Room' },
              { key: '2', component: 'HMI Touch Panel', function: 'Giao diện vận hành và giám sát', location: 'Phòng điều khiển NOC' },
              { key: '3', component: 'SMARDT Chiller Controller', function: 'Điều khiển Chiller AE054.2B.F2HAJA.A010DX.E10', location: 'Chiller outdoor' },
              { key: '4', component: 'TES Tank Control System', function: 'Điều khiển kết dự phòng 10 phút', location: 'Utility Room' },
              { key: '5', component: 'Temperature Sensors (TT)', function: 'Đo nhiệt độ nước lạnh cấp/hồi', location: 'Các đường ống chính' },
              { key: '6', component: 'Pressure Sensors (PT)', function: 'Đo áp suất hệ thống nước lạnh', location: 'Header chính và phụ' },
              { key: '7', component: 'Flow Meters (FIT)', function: 'Đo lưu lượng nước lạnh realtime', location: 'Main header và branch' },
              { key: '8', component: 'Modbus RTU Gateway', function: 'Giao tiếp với UNIFLAIR PAC', location: 'Control cabinet' },
              { key: '9', component: 'Van điều khiển 3-way (V1A/V1B/V2A/V2B/V3A/V3B)', function: 'Điều khiển chế độ TES', location: 'TES tank area' },
              { key: '10', component: 'Bơm nước lạnh (P1A/P1B)', function: 'Bơm nước lạnh chính', location: 'Pump room' },
              { key: '11', component: 'Bơm bù áp (booster pumps)', function: 'Duy trì áp suất hệ thống', location: 'Pump room' },
            ]}
            columns={[
              {
                title: 'Thành phần',
                dataIndex: 'component',
                key: 'component',
                width: '25%',
                render: (text) => <Tag color="green">{text}</Tag>
              },
              {
                title: 'Chức năng',
                dataIndex: 'function',
                key: 'function',
                width: '35%',
                render: (text) => <Text>{text}</Text>
              },
              {
                title: 'Vị trí',
                dataIndex: 'location',
                key: 'location',
                width: '40%',
                render: (text) => <Text>{text}</Text>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title="Đặc điểm kỹ thuật nổi bật TTDL Vân Canh" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ul>
              <li><Text strong>Hệ thống TES Tank:</Text> Dự phòng 10 phút với 4 chế độ (Commissioning, Normal, Charge, Discharge)</li>
              <li><Text strong>SMARDT Chiller Integration:</Text> Điều khiển Oil-free Chiller 632kW (180RT)</li>
              <li><Text strong>Load Balancing:</Text> Tự động gọi thêm/cắt bớt Chiller theo tải DC (&gt;80% gọi thêm, &lt;60% cắt bớt)</li>
              <li><Text strong>UNIFLAIR PAC Control:</Text> Quản lý SDCV/LDCV Series qua Modbus RTU</li>
              <li><Text strong>Emergency Response:</Text> Tự động chuyển sang chế độ Discharge khi mất điện</li>
              <li><Text strong>Temperature Control:</Text> Duy trì 10°C nước lạnh cấp, 16°C nước hồi</li>
              <li><Text strong>Pump Management:</Text> Điều khiển biến tần bơm theo chênh lệch áp suất</li>
              <li><Text strong>Rotation Control:</Text> Vận hành luân phiên Chiller mỗi 8 giờ</li>
              <li><Text strong>Real-time Monitoring:</Text> Giám sát 24/7 với báo cáo tự động</li>
              <li><Text strong>Bypass System:</Text> Van bypass tự động duy trì áp suất tối thiểu</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Các chế độ vận hành TES Tank" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>1. Chế độ Commissioning (Khởi tạo)</Title>
          <Paragraph>
            <ul>
              <li><Tag color="green">Van V2A, V2B, V3A, V3B: MỞ</Tag></li>
              <li><Tag color="red">Van V1A, V1B: ĐÓNG</Tag></li>
              <li>Nước từ Chiller (10°C) chỉ đi qua TES Tank để làm mát</li>
              <li>Chuyển sang chế độ Normal khi nhiệt độ đỉnh TES đạt 10°C</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>2. Chế độ Normal (Bình thường)</Title>
          <Paragraph>
            <ul>
              <li><Tag color="green">Van V1A, V1B: MỞ</Tag></li>
              <li><Tag color="red">Van V2A, V2B, V3A, V3B: ĐÓNG</Tag></li>
              <li>Luồng: Chiller → TES Tank (đỉnh) → CRAC (đáy TES)</li>
              <li>TES Tank hoạt động như buffer tank</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>3. Chế độ Charge (Nạp lạnh)</Title>
          <Paragraph>
            <ul>
              <li><Tag color="orange">Van V2A, V2B: Điều tiết theo tải (tối thiểu 10%)</Tag></li>
              <li><Tag color="green">Van V3A, V3B: MỞ 100%</Tag></li>
              <li><Tag color="red">Van V1A, V1B: ĐÓNG</Tag></li>
              <li>Ví dụ: Tải DC 70% → Van V2A, V2B mở 30%</li>
              <li>Mục đích: Nạp TES sớm nhất có thể</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>4. Chế độ Discharge (Xả lạnh)</Title>
          <Paragraph>
            <ul>
              <li>Kích hoạt khi Chiller tắt (hỏng hóc/mất nguồn)</li>
              <li>TES Tank cung cấp nước lạnh 10°C trong <Text strong>10 phút</Text></li>
              <li>Nước vào Chiller ~16°C, nước ra Chiller ~16°C (không làm việc)</li>
              <li>Đủ thời gian để khắc phục sự cố hoặc khởi động backup</li>
            </ul>
          </Paragraph>
        </Card>

        <Divider />

        {/* Hiển thị thiết bị hệ thống nước */}
        <WaterSystemDevices />
      </div>

      <div id="section-2.5.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.5.2. Hướng dẫn cài đặt và cấu hình ban đầu
        </Title>

        <Card title="Yêu cầu cài đặt" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Phần cứng</Title>
          <Paragraph>
            <ul>
              <li>PLC S7-1200 với module mở rộng</li>
              <li>HMI Panel với màn hình cảm ứng</li>
              <li>Modbus Gateway cho giao tiếp</li>
              <li>Tủ điện điều khiển</li>
              <li>Hệ thống dây cáp tín hiệu</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Phần mềm</Title>
          <Paragraph>
            <ul>
              <li>Phần mềm lập trình PLC</li>
              <li>Phần mềm cấu hình HMI</li>
              <li>Phần mềm giám sát SCADA</li>
              <li>Driver Modbus</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kết nối mạng</Title>
          <Paragraph>
            <ul>
              <li>Mạng Ethernet cho PLC và HMI</li>
              <li>Mạng Modbus RTU cho thiết bị</li>
              <li>Kết nối internet cho giám sát từ xa</li>
              <li>Hệ thống bảo mật mạng</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Quy trình cài đặt" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <ol>
              <li>Lắp đặt phần cứng (PLC, HMI, Gateway)</li>
              <li>Kết nối hệ thống dây cáp</li>
              <li>Cài đặt phần mềm</li>
              <li>Cấu hình giao thức Modbus</li>
              <li>Lập trình logic điều khiển</li>
              <li>Thiết lập giao diện HMI</li>
              <li>Kiểm tra và hiệu chỉnh</li>
              <li>Bàn giao và hướng dẫn sử dụng</li>
            </ol>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.5.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.5.3. Hướng dẫn vận hành và kiểm tra hàng ngày
        </Title>

        <Card title="Khởi động hệ thống" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Kiểm tra trước khi khởi động</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra nguồn điện PLC và HMI</li>
              <li>Kiểm tra kết nối mạng</li>
              <li>Kiểm tra giao tiếp Modbus</li>
              <li>Kiểm tra cảm biến và thiết bị</li>
              <li>Kiểm tra phần mềm SCADA</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Quy trình khởi động</Title>
          <Paragraph>
            <ol>
              <li>Bật nguồn PLC và HMI</li>
              <li>Khởi động phần mềm SCADA</li>
              <li>Kiểm tra kết nối thiết bị</li>
              <li>Kiểm tra dữ liệu cảm biến</li>
              <li>Khởi động chế độ tự động</li>
              <li>Theo dõi hoạt động hệ thống</li>
            </ol>
          </Paragraph>
        </Card>

        <Card title="Kiểm tra hàng ngày" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Thông số cần kiểm tra</Title>
          <Table
            dataSource={[
              { key: '1', parameter: 'Trạng thái PLC', normal: 'Online', check: 'Kiểm tra đèn LED' },
              { key: '2', parameter: 'Kết nối HMI', normal: 'Connected', check: 'Kiểm tra màn hình' },
              { key: '3', parameter: 'Giao tiếp Modbus', normal: 'OK', check: 'Kiểm tra trạng thái' },
              { key: '4', parameter: 'Dữ liệu cảm biến', normal: 'Valid', check: 'Kiểm tra giá trị' },
              { key: '5', parameter: 'Trạng thái thiết bị', normal: 'Running', check: 'Kiểm tra từ xa' },
              { key: '6', parameter: 'Báo cáo lỗi', normal: 'No Error', check: 'Kiểm tra log' },
              { key: '7', parameter: 'Backup dữ liệu', normal: 'Success', check: 'Kiểm tra backup' },
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

      <div id="section-2.5.4" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ExclamationCircleOutlined style={{ marginRight: '8px' }} /> 2.5.4. Hướng dẫn xác định nguyên nhân lỗi
        </Title>

        <Alert
          message="Xử lý sự cố"
          description="Khi có sự cố, hệ thống sẽ hiển thị mã lỗi trên HMI và ghi log. Dưới đây là các lỗi thường gặp và cách xử lý."
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="Các lỗi thường gặp" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                error: 'E01 - Lỗi giao tiếp Modbus',
                cause: 'Dây cáp đứt, thiết bị offline, cấu hình sai',
                action: 'Kiểm tra dây cáp, reset thiết bị, kiểm tra cấu hình'
              },
              {
                key: '2',
                error: 'E02 - Lỗi cảm biến',
                cause: 'Cảm biến hỏng, dây tín hiệu đứt, nguồn lỗi',
                action: 'Kiểm tra cảm biến, thay dây, kiểm tra nguồn'
              },
              {
                key: '3',
                error: 'E03 - Lỗi PLC',
                cause: 'PLC lỗi, chương trình crash, nguồn lỗi',
                action: 'Reset PLC, tải lại chương trình, kiểm tra nguồn'
              },
              {
                key: '4',
                error: 'E04 - Lỗi HMI',
                cause: 'HMI lỗi, màn hình hỏng, kết nối mạng',
                action: 'Reset HMI, kiểm tra màn hình, kiểm tra mạng'
              },
              {
                key: '5',
                error: 'E05 - Lỗi thiết bị',
                cause: 'Thiết bị offline, lỗi phần cứng',
                action: 'Kiểm tra thiết bị, thay thế nếu cần'
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

      <div id="section-2.5.5" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.5.5. Quy định và chu kỳ bảo trì
        </Title>

        <Card title="Bảo trì định kỳ" style={{ marginBottom: '20px' }}>
          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng tháng</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra hoạt động PLC và HMI</li>
              <li>Kiểm tra giao tiếp Modbus</li>
              <li>Kiểm tra cảm biến</li>
              <li>Backup dữ liệu</li>
              <li>Ghi chép nhật ký vận hành</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng quý</Title>
          <Paragraph>
            <ul>
              <li>Vệ sinh thiết bị</li>
              <li>Kiểm tra kết nối dây cáp</li>
              <li>Cập nhật phần mềm</li>
              <li>Kiểm tra bảo mật mạng</li>
            </ul>
          </Paragraph>

          <Title level={5} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>Bảo trì hàng năm</Title>
          <Paragraph>
            <ul>
              <li>Kiểm tra toàn bộ hệ thống</li>
              <li>Thay thế linh kiện nếu cần</li>
              <li>Cập nhật chương trình</li>
              <li>Kiểm tra hiệu suất</li>
              <li>Lập báo cáo bảo trì</li>
            </ul>
          </Paragraph>
        </Card>

        <Card title="Lưu ý bảo trì" style={{ marginBottom: '20px' }}>
          <Alert
            message="An toàn"
            description="Luôn tắt nguồn và khóa an toàn trước khi thực hiện bảo trì. Sao lưu dữ liệu trước khi thay đổi."
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
              <li>Đặc biệt chú ý đến bảo mật hệ thống</li>
            </ul>
          </Paragraph>
        </Card>
      </div>

      <div id="section-2.5.6" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ToolOutlined style={{ marginRight: '8px' }} /> 2.5.6. Hướng dẫn bảo trì từng thành phần
        </Title>

        <Card title="Bảo trì từng thành phần" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                component: 'PLC S7-1200',
                function: 'Điều khiển trung tâm',
                maintenance: 'Hàng năm',
                procedure: 'Kiểm tra hoạt động, cập nhật firmware, backup chương trình'
              },
              {
                key: '2',
                component: 'HMI Panel',
                function: 'Giao diện người dùng',
                maintenance: 'Hàng quý',
                procedure: 'Vệ sinh màn hình, kiểm tra cảm ứng, cập nhật phần mềm'
              },
              {
                key: '3',
                component: 'Modbus Gateway',
                function: 'Chuyển đổi giao thức',
                maintenance: 'Hàng quý',
                procedure: 'Kiểm tra kết nối, cập nhật driver, kiểm tra cấu hình'
              },
              {
                key: '4',
                component: 'Cảm biến',
                function: 'Đo lường thông số',
                maintenance: 'Hàng tháng',
                procedure: 'Kiểm tra độ chính xác, vệ sinh, hiệu chỉnh'
              },
              {
                key: '5',
                component: 'Hệ thống mạng',
                function: 'Truyền thông dữ liệu',
                maintenance: 'Hàng quý',
                procedure: 'Kiểm tra kết nối, cập nhật bảo mật, tối ưu hiệu suất'
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
                width: '25%',
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
    </div>
  );
};

export default BMSChiller;
