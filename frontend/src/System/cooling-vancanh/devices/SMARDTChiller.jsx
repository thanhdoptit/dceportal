import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Alert, Card, Space, Table, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const SMARDTChiller = () => {
  return (
    <div>
      <div id='section-2-1' className='subsection'>
        <Title level={3}>
          <SettingOutlined style={{ marginRight: '8px' }} />
          2.1. Chiller SMARDT AE Series - TTDL Vân Canh
        </Title>

        <div id='section-2-1-1' className='subsection'>
          <Title level={4}>
            <InfoCircleOutlined style={{ marginRight: '8px' }} /> 2.1.1. Thông tin chung
          </Title>

          <Alert
            message='Thiết bị chính của hệ thống làm mát'
            description='Chiller SMARDT AE Series là thiết bị làm mát chính của TTDL Vân Canh, sử dụng công nghệ Oil-free compressor với hiệu suất cao.'
            type='info'
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Card title='Thông tin cơ bản' style={{ marginBottom: '20px' }}>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              <div key='brand'>
                <Tag color='blue'>Hãng sản xuất</Tag>
                <Text>SMARDT</Text>
              </div>
              <div key='model'>
                <Tag color='blue'>Model</Tag>
                <Text>AE054.2B.F2HAJA.A010DX.E10</Text>
              </div>
              <div key='type'>
                <Tag color='blue'>Loại thiết bị</Tag>
                <Text>Air-cooled Chiller</Text>
              </div>
              <div key='capacity'>
                <Tag color='blue'>Công suất lạnh</Tag>
                <Text>632kW (180RT)</Text>
              </div>
              <div key='compressor'>
                <Tag color='blue'>Loại máy nén</Tag>
                <Text>Oil-free Compressor</Text>
              </div>
              <div key='control'>
                <Tag color='blue'>Hệ thống điều khiển</Tag>
                <Text>PLC với giao diện màn hình cảm ứng</Text>
              </div>
            </Space>
          </Card>

          <Card title='Thông số kỹ thuật chi tiết từ tài liệu APC' style={{ marginBottom: '20px' }}>
            <Table
              dataSource={[
                { key: '1', spec: 'Công suất lạnh danh định', value: '632.0 kW (180 RT)' },
                { key: '2', spec: 'Công suất điện tiêu thụ', value: '194.6 kW' },
                { key: '3', spec: 'Hiệu suất năng lượng (COP) Full Load', value: '3.238' },
                { key: '4', spec: 'Hiệu suất năng lượng (COP) Average', value: '7.839' },
                { key: '5', spec: 'Nhiệt độ nước lạnh cấp', value: '10.00°C' },
                { key: '6', spec: 'Nhiệt độ nước lạnh hồi', value: '16.00°C' },
                { key: '7', spec: 'Lưu lượng nước lạnh thiết kế', value: '25.1 L/s (90.36 m³/h)' },
                { key: '8', spec: 'Lưu lượng nước lạnh tối thiểu', value: '8.6 L/s' },
                { key: '9', spec: 'Điện áp', value: '400V/3P/50Hz' },
                { key: '10', spec: 'Dòng định mức (RLA)', value: '312 A' },
                { key: '11', spec: 'Dòng tối thiểu (MCA)', value: '367 A' },
                { key: '12', spec: 'Bảo vệ quá tải tối đa (MOCP)', value: '519 A' },
                { key: '13', spec: 'Môi chất làm lạnh', value: 'R134a (255 kg)' },
                { key: '14', spec: 'Số lượng quạt', value: '10 quạt EBM AxiBlade W3G910' },
                { key: '15', spec: 'Tốc độ quạt', value: '850 RPM' },
                { key: '16', spec: 'Áp suất nước evaporator', value: '41.6 kPa' },
                { key: '17', spec: 'Kết nối ống nước', value: '6 inch' },
                { key: '18', spec: 'Sound Pressure Level', value: '69.0 dB(A) @ 1m' },
                { key: '19', spec: 'Sound Power Level', value: '88.5 dB(A)' },
                { key: '20', spec: 'Nhiệt độ môi trường thiết kế', value: '43.0°C' },
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

          <Card title='Đặc điểm kỹ thuật nổi bật' style={{ marginBottom: '20px' }}>
            <Paragraph>
              <ul>
                <li>
                  <Text strong>Công nghệ Oil-free:</Text> Máy nén không dầu, giảm thiểu bảo trì và
                  tăng tuổi thọ
                </li>
                <li>
                  <Text strong>Hiệu suất cao:</Text> COP đạt 3.5, tiết kiệm 30% năng lượng so với
                  chiller thông thường
                </li>
                <li>
                  <Text strong>Điều khiển thông minh:</Text> PLC tích hợp với giao diện màn hình cảm
                  ứng
                </li>
                <li>
                  <Text strong>Vận hành ổn định:</Text> 2 máy nén song song, đảm bảo độ tin cậy cao
                </li>
                <li>
                  <Text strong>Bảo trì dễ dàng:</Text> Thiết kế module hóa, dễ dàng thay thế linh
                  kiện
                </li>
                <li>
                  <Text strong>Tích hợp BMS:</Text> Giao tiếp Modbus RTU, tích hợp với hệ thống BMS
                </li>
              </ul>
            </Paragraph>
          </Card>

          <Card title='Control Logic - Logic điều khiển hệ thống' style={{ marginBottom: '20px' }}>
            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Chế độ Commissioning (Khởi tạo)
            </Title>
            <Paragraph>
              <ul>
                <li>
                  Nước ra khỏi Chiller ở <Text strong>10°C</Text>
                </li>
                <li>
                  Van 3A & 3B: <Tag color='green'>Mở hoàn toàn</Tag>
                </li>
                <li>
                  Van 2A & 2B: <Tag color='green'>Mở hoàn toàn</Tag>
                </li>
                <li>Nước từ chiller chỉ đi qua Két dự phòng TES</li>
                <li>
                  Nước lưu trữ trong TES được duy trì ở <Text strong>10°C</Text>
                </li>
                <li>
                  Khi nước ở đỉnh TES đạt <Text strong>10°C</Text> thì chuyển về chế độ BÌNH THƯỜNG
                </li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Chế độ BÌNH THƯỜNG (Normal Mode)
            </Title>
            <Paragraph>
              <ul>
                <li>Nước ra khỏi Chiller → Két dự phòng TES → CRAC</li>
                <li>
                  Van 3A & 3B: <Tag color='red'>Đóng</Tag>
                </li>
                <li>
                  Van 2A & 2B: <Tag color='red'>Đóng</Tag>
                </li>
                <li>
                  Van 1A & 1B: <Tag color='green'>Mở hoàn toàn</Tag>
                </li>
                <li>
                  Nước lạnh <Text strong>10°C</Text> từ Chiller → TES qua van 1A & 1B (đỉnh két)
                </li>
                <li>
                  Nước <Text strong>10°C</Text> từ đáy két → CRAC
                </li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Chế độ XẢ (Discharge Mode)
            </Title>
            <Paragraph>
              <ul>
                <li>Khi Chiller tắt do hỏng hóc/mất nguồn</li>
                <li>
                  Nhiệt độ nước vào TES tăng dần đến <Text strong>10°C</Text>
                </li>
                <li>
                  Nước vào Chiller: <Text strong>~16°C</Text>
                </li>
                <li>
                  Nước ra Chiller: <Text strong>~16°C</Text>
                </li>
                <li>
                  Nước từ TES vẫn duy trì <Text strong>10°C</Text> đến CRAC
                </li>
                <li>
                  Thời gian dự phòng: <Text strong>10 phút</Text>
                </li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Chế độ NẠP (Charge Mode)
            </Title>
            <Paragraph>
              <ul>
                <li>
                  Van 2A & 2B và 3A & 3B: <Tag color='green'>Mở</Tag>
                </li>
                <li>
                  Van 3A & 3B: <Tag color='green'>Mở 100%</Tag>
                </li>
                <li>
                  Van 2A & 2B: <Tag color='orange'>Điều tiết theo tải</Tag> (tối thiểu 10%)
                </li>
                <li>Tải lạnh DC = 70% → Van 2A & 2B mở 30%</li>
                <li>
                  Van 1A & 1B: <Tag color='red'>Đóng</Tag>
                </li>
                <li>Mục đích: Nạp TES sớm nhất có thể</li>
              </ul>
            </Paragraph>
          </Card>
        </div>

        <div id='section-2-1-2' className='subsection'>
          <Title level={4}>
            <CheckCircleOutlined style={{ marginRight: '8px' }} /> 2.1.2. Chế độ Commissioning (Khởi
            tạo)
          </Title>

          <Card title='Yêu cầu lắp đặt' style={{ marginBottom: '20px' }}>
            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Vị trí lắp đặt
            </Title>
            <Paragraph>
              <ul>
                <li>Đặt ngoài trời, trên sàn bê tông cốt thép</li>
                <li>Khoảng cách tối thiểu 1.5m từ tường và các vật cản</li>
                <li>Đảm bảo thông gió tốt cho dàn nóng</li>
                <li>Mái che chống mưa nắng trực tiếp</li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Hệ thống điện
            </Title>
            <Paragraph>
              <ul>
                <li>Điện áp: 380V/3P/50Hz</li>
                <li>Công suất tủ điện: 250A</li>
                <li>Dây cáp điện: 3x95mm² + 1x50mm²</li>
                <li>Nối đất theo tiêu chuẩn TCVN</li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Hệ thống nước
            </Title>
            <Paragraph>
              <ul>
                <li>Ống nước lạnh: DN150</li>
                <li>Van cô lập và van cân bằng</li>
                <li>Bộ lọc nước và xả khí</li>
                <li>Đồng hồ đo lưu lượng và áp suất</li>
              </ul>
            </Paragraph>
          </Card>
        </div>

        <div id='section-2-1-3' className='subsection'>
          <Title level={4}>
            <ToolOutlined style={{ marginRight: '8px' }} /> 2.1.3. Chế độ Bình thường (Normal Mode)
          </Title>

          <Card title='Quy trình khởi động hệ thống' style={{ marginBottom: '20px' }}>
            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Bước 1: Khởi động Cụm Chiller đầu tiên
            </Title>
            <Paragraph>
              <ol>
                <li>
                  <Text strong>Ra lệnh bật Chiller 01</Text>
                  <ul>
                    <li>Chiller được cài đặt ở chế độ Remote trên màn hình HMI</li>
                    <li>
                      Thứ tự Chiller được tính toán để tổng thời gian hoạt động tương đương nhau
                    </li>
                  </ul>
                </li>
                <li>
                  <Text strong>Ra lệnh mở van chặn Chiller 01</Text>
                  <ul>
                    <li>BMS theo dõi tín hiệu gọi cấp nước lạnh từ bộ điều khiển Chiller</li>
                    <li>Ra lệnh đóng/mở van chặn của mỗi Chiller</li>
                  </ul>
                </li>
                <li>
                  <Text strong>Ra lệnh bật bơm nước lạnh</Text>
                  <ul>
                    <li>Sau khi van chặn Chiller đã mở hoàn toàn</li>
                    <li>Với tham số cài đặt trước đảm bảo lưu lượng nước tối thiểu</li>
                  </ul>
                </li>
              </ol>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Bước 2: Vận hành hệ thống van Bypass
            </Title>
            <Paragraph>
              <ul>
                <li>Vận hành dựa theo chênh lệch áp suất giữa đường ống nước lạnh cấp và hồi</li>
                <li>Duy trì chênh lệch áp suất tối thiểu vận hành của hệ thống</li>
                <li>Tham số cài đặt được xác định trong quá trình T&C</li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Bước 3: Vận hành hệ thống Két dự phòng TES ở chế độ Commissioning
            </Title>
            <Paragraph>
              <ul>
                <li>
                  <Tag color='red'>Đóng hoàn toàn Van V1A, V1B</Tag>
                </li>
                <li>
                  <Tag color='green'>Mở hoàn toàn Van V2A, V2B</Tag>
                </li>
                <li>
                  <Tag color='green'>Mở hoàn toàn Van V3A, V3B</Tag>
                </li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Bước 4: Vận hành hệ thống bơm bù áp
            </Title>
            <Paragraph>
              <ul>
                <li>Vận hành dựa theo áp suất tĩnh đo được trên đường ống</li>
                <li>Duy trì áp suất đường ống tối thiểu vận hành</li>
                <li>Các bơm trong mỗi cụm vận hành luân phiên</li>
                <li>Đảm bảo thời gian hoạt động của các bơm tương đương nhau</li>
              </ul>
            </Paragraph>
          </Card>

          <Card title='Quy trình vận hành chế độ BÌNH THƯỜNG' style={{ marginBottom: '20px' }}>
            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Bước 1: Hệ thống vận hành sau khi khởi động hoàn tất
            </Title>
            <Paragraph>
              <ul>
                <li>
                  <Text strong>Điều chỉnh tần số bơm nước lạnh:</Text> Tăng giảm theo tải lạnh của
                  DC, dựa trên chênh lệch áp suất giữa đường nước cấp – hồi
                </li>
                <li>
                  <Text strong>Vận hành TES chế độ Commissioning:</Text> Cho tới khi nhiệt độ tại
                  đỉnh TES đạt 10°C thì chuyển sang chế độ BÌNH THƯỜNG
                </li>
                <li>
                  <Text strong>Vận hành TES chế độ BÌNH THƯỜNG:</Text>
                  <ul>
                    <li>
                      <Tag color='green'>Mở hoàn toàn Van V1A, V1B</Tag>
                    </li>
                    <li>
                      <Tag color='red'>Đóng hoàn toàn Van V2A, V2B</Tag>
                    </li>
                    <li>
                      <Tag color='red'>Đóng hoàn toàn Van V3A, V3B</Tag>
                    </li>
                  </ul>
                </li>
                <li>
                  <Text strong>Vận hành hệ thống van Bypass:</Text> Tiếp tục từ quy trình khởi động
                </li>
                <li>
                  <Text strong>Vận hành hệ thống bơm bù:</Text> Tiếp tục từ quy trình khởi động
                </li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Bước 2: Quy trình gọi thêm, cắt bớt cụm Chiller
            </Title>

            <Title level={4} style={{ color: '#8c8c8c', marginBottom: '8px', fontSize: '14px' }}>
              2.1 Gọi thêm cụm Chiller
            </Title>
            <Paragraph>
              <Text strong>Điều kiện:</Text>
              <ul>
                <li>Nhiệt độ nước lạnh cấp cho tải không đạt 10°C</li>
                <li>Công suất làm việc của các Chiller đang hoạt động lớn hơn 80%</li>
                <li>Duy trì tình trạng này trong 300s</li>
              </ul>
              <Text strong>Quy trình:</Text>
              <ol>
                <li>Ra lệnh bật Chiller 02</li>
                <li>Ra lệnh mở van chặn Chiller 02 (nếu BMS xác nhận có tín hiệu)</li>
                <li>Ra lệnh bật bơm nước lạnh với tham số cài đặt trước</li>
              </ol>
            </Paragraph>

            <Title level={4} style={{ color: '#8c8c8c', marginBottom: '8px', fontSize: '14px' }}>
              2.2 Cắt bớt cụm Chiller
            </Title>
            <Paragraph>
              <Text strong>Điều kiện:</Text>
              <ul>
                <li>Nhiệt độ nước lạnh cấp cho tải thấp hơn 8°C</li>
                <li>Công suất làm việc của các Chiller đang hoạt động thấp hơn 60%</li>
                <li>Duy trì tình trạng này trong 300s</li>
              </ul>
              <Text strong>Quy trình:</Text>
              <ol>
                <li>Ra lệnh tắt Chiller 01 (cụm bật trước sẽ tắt trước)</li>
                <li>Ra lệnh tắt bơm nước lạnh 01 (nếu BMS xác nhận Chiller đã tắt)</li>
                <li>Ra lệnh đóng van chặn Chiller 01 (nếu BMS xác nhận Chiller và bơm đã tắt)</li>
              </ol>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Bước 3: Quy trình vận hành luân phiên hệ thống
            </Title>
            <Paragraph>
              <ul>
                <li>BMS theo dõi trạng thái hoạt động của các thành phần</li>
                <li>Tính toán vận hành luân phiên các cụm Chiller theo giờ</li>
                <li>Đảm bảo thời gian vận hành của các cụm tương đương nhau</li>
                <li>
                  Thời gian luân phiên mặc định: <Text strong>8h</Text>
                </li>
              </ul>
            </Paragraph>
          </Card>

          <Card title='Quy trình vận hành chế độ SỰ CỐ' style={{ marginBottom: '20px' }}>
            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Khi 01 cụm Chiller bị lỗi
            </Title>
            <Paragraph>
              <Text strong>Nguyên nhân:</Text>
              <ul>
                <li>Máy lạnh Chiller bị lỗi hoặc không khởi động được</li>
                <li>Van chặn không mở được hoàn toàn</li>
                <li>Bộ điều khiển thuộc cụm Chiller bị lỗi</li>
              </ul>
              <Text strong>Xử lý:</Text>
              <ul>
                <li>BMS cập nhật trạng thái và xuất tín hiệu cảnh báo</li>
                <li>Tính toán gọi thêm cụm Chiller thay thế</li>
                <li>Nếu nhiệt độ tại đỉnh TES vượt quá 10°C → Chuyển TES sang chế độ XẢ</li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Khi xảy ra sự cố mất điện
            </Title>
            <Paragraph>
              <ol>
                <li>
                  <Text strong>Chuyển TES sang chế độ XẢ:</Text> Cung cấp nước lạnh cho DC trong 10
                  phút
                </li>
                <li>
                  <Text strong>Khắc phục sự cố nguồn:</Text> Khởi động lại hệ thống Chiller
                </li>
                <li>
                  <Text strong>Vận hành TES chế độ NẠP:</Text> Cho tới khi nhiệt độ đỉnh TES đạt
                  10°C
                </li>
                <li>
                  <Text strong>Vận hành TES chế độ BÌNH THƯỜNG:</Text> Sau khi đạt nhiệt độ cài đặt
                </li>
              </ol>
            </Paragraph>
          </Card>

          <Card title='Các chế độ vận hành' style={{ marginBottom: '20px' }}>
            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Chế độ vận hành tự động (Auto)
            </Title>
            <Paragraph>
              <ul>
                <li>Hệ thống vận hành tự động theo chương trình lập trình sẵn</li>
                <li>Dựa trên các thuật toán điều khiển để đáp ứng quy trình vận hành</li>
                <li>
                  <Text strong>Tham số cài đặt:</Text>
                  <ul>
                    <li>Nhiệt độ cài đặt nước lạnh mong muốn</li>
                    <li>Công suất giới hạn ngưỡng trên (gọi thêm Chiller)</li>
                    <li>Công suất giới hạn ngưỡng dưới (cắt bớt Chiller)</li>
                    <li>Thời gian chờ xác nhận tính chính xác</li>
                    <li>Thời gian cài đặt chạy luân phiên các cụm Chiller</li>
                  </ul>
                </li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Chế độ vận hành bằng tay (Manual)
            </Title>
            <Paragraph>
              <ul>
                <li>Chuyển sang trạng thái MAN trên giao diện vận hành</li>
                <li>Vận hành trực tiếp bởi cán bộ vận hành</li>
                <li>Có thể thao tác bật/tắt, điều khiển tần số từng thiết bị cụ thể</li>
                <li>Điều khiển trên trang đồ họa bảng điều khiển</li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Chế độ vận hành tại chỗ (Local)
            </Title>
            <Paragraph>
              <ul>
                <li>Vận hành tại nút nhấn điều khiển trên tủ động lực</li>
                <li>Điều khiển trực tiếp tại thiết bị</li>
              </ul>
            </Paragraph>
          </Card>

          <Card title='Kiểm tra hàng ngày' style={{ marginBottom: '20px' }}>
            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Thông số cần kiểm tra
            </Title>
            <Table
              dataSource={[
                {
                  key: '1',
                  parameter: 'Nhiệt độ nước lạnh ra',
                  normal: '10°C',
                  check: 'Ghi chép và so sánh',
                },
                {
                  key: '2',
                  parameter: 'Nhiệt độ nước lạnh vào',
                  normal: '16°C',
                  check: 'Ghi chép và so sánh',
                },
                {
                  key: '3',
                  parameter: 'Áp suất nước lạnh',
                  normal: '3-4 bar',
                  check: 'Kiểm tra đồng hồ',
                },
                { key: '4', parameter: 'Dòng điện máy nén', normal: '<90A', check: 'Đọc ampe kế' },
                {
                  key: '5',
                  parameter: 'Áp suất gas cao',
                  normal: '15-18 bar',
                  check: 'Đọc đồng hồ',
                },
                {
                  key: '6',
                  parameter: 'Áp suất gas thấp',
                  normal: '3-4 bar',
                  check: 'Đọc đồng hồ',
                },
                {
                  key: '7',
                  parameter: 'Nhiệt độ dầu',
                  normal: '60-80°C',
                  check: 'Kiểm tra cảm biến',
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
                  title: 'Giá trị bình thường',
                  dataIndex: 'normal',
                  key: 'normal',
                  width: '25%',
                  render: text => <Tag color='green'>{text}</Tag>,
                },
                {
                  title: 'Cách kiểm tra',
                  dataIndex: 'check',
                  key: 'check',
                  width: '45%',
                  render: text => <Text>{text}</Text>,
                },
              ]}
              pagination={false}
              size='small'
              bordered
            />
          </Card>
        </div>

        <div id='section-2-1-4' className='subsection'>
          <Title level={4}>
            <ExclamationCircleOutlined style={{ marginRight: '8px' }} /> 2.1.4. Chế độ Xả (Discharge
            Mode)
          </Title>

          <Card title='Chế độ Xả TES' style={{ marginBottom: '20px' }}>
            <Paragraph>
              <Text strong>Khi nào sử dụng chế độ Xả:</Text>
              <ul>
                <li>Khi có sự cố mất điện</li>
                <li>Khi Chiller bị lỗi</li>
                <li>Khi cần dự phòng khẩn cấp</li>
              </ul>
            </Paragraph>

            <Paragraph>
              <Text strong>Quy trình chuyển sang chế độ Xả:</Text>
              <ol>
                <li>Đóng hoàn toàn Van V1A, V1B (ngăn nước từ Chiller)</li>
                <li>Mở hoàn toàn Van V2A, V2B (cho phép nước từ TES)</li>
                <li>Mở hoàn toàn Van V3A, V3B (cho phép nước đến DC)</li>
                <li>TES cung cấp nước lạnh trong 10 phút</li>
              </ol>
            </Paragraph>
          </Card>
        </div>

        <div id='section-2-1-5' className='subsection'>
          <Title level={4}>
            <ToolOutlined style={{ marginRight: '8px' }} /> 2.1.5. Quy trình và chu kỳ bảo trì
          </Title>

          <Card title='Bảo trì định kỳ' style={{ marginBottom: '20px' }}>
            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Bảo trì hàng tháng
            </Title>
            <Paragraph>
              <ul>
                <li>Kiểm tra thông số vận hành</li>
                <li>Vệ sinh bộ lọc không khí</li>
                <li>Kiểm tra rò rỉ gas</li>
                <li>Kiểm tra hệ thống điện</li>
                <li>Ghi chép nhật ký vận hành</li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Bảo trì hàng quý
            </Title>
            <Paragraph>
              <ul>
                <li>Vệ sinh dàn nóng</li>
                <li>Kiểm tra và thay dầu máy nén</li>
                <li>Kiểm tra cảm biến</li>
                <li>Hiệu chỉnh hệ thống điều khiển</li>
              </ul>
            </Paragraph>

            <Title level={4} style={{ color: '#595959', marginBottom: '8px', fontSize: '16px' }}>
              Bảo trì hàng năm
            </Title>
            <Paragraph>
              <ul>
                <li>Kiểm tra toàn bộ hệ thống</li>
                <li>Thay thế bộ lọc</li>
                <li>Kiểm tra và bảo dưỡng máy nén</li>
                <li>Hiệu chỉnh hệ thống</li>
                <li>Lập báo cáo bảo trì</li>
              </ul>
            </Paragraph>
          </Card>

          <Card title='Lưu ý bảo trì' style={{ marginBottom: '20px' }}>
            <Alert
              message='An toàn'
              description='Luôn tắt nguồn và khóa an toàn trước khi thực hiện bảo trì. Sử dụng dụng cụ bảo hộ phù hợp.'
              type='warning'
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Paragraph>
              <ul>
                <li>Chỉ nhân viên được đào tạo mới được thực hiện bảo trì</li>
                <li>Tuân thủ quy trình an toàn</li>
                <li>Ghi chép đầy đủ các hoạt động bảo trì</li>
                <li>Báo cáo ngay các sự cố bất thường</li>
              </ul>
            </Paragraph>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SMARDTChiller;
