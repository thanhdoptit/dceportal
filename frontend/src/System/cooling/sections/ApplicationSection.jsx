import { AppstoreOutlined } from '@ant-design/icons';
import { Alert, Card, Collapse, Steps, Table, Tag, Typography } from 'antd';
import React from 'react';
import { PasswordField } from '../../shared';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const ApplicationSection = () => {
  // State để quản lý step hiện tại
  const [currentStep, setCurrentStep] = React.useState(0);
  const [currentDetailStep, setCurrentDetailStep] = React.useState(0);

  return (
    <section id='section-4' className='content-section'>
      <Title level={2}>
        <AppstoreOutlined style={{ marginRight: '12px' }} />
        4. ỨNG DỤNG - TTDL Hòa Lạc
      </Title>

      <div id='section-4-1' className='subsection'>
        <Title level={3}>4.1. Quy trình vận hành hàng ngày chung của hệ thống làm mát</Title>

        <Card title='Quy trình kiểm tra ban đầu' style={{ marginBottom: '20px' }}>
          <Paragraph>
            Đây là bước kiểm tra tổng quan nhanh để đánh giá tình trạng chung của toàn bộ hệ thống.
          </Paragraph>

          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            direction='vertical'
            size='small'
            items={[
              {
                title: 'Kiểm tra trên Hệ thống Giám sát Trung tâm DCIM',
                description: (
                  <div>
                    <Paragraph style={{ marginBottom: '8px' }}>
                      <Text strong>1.</Text> Đăng nhập vào hệ thống DCIM.
                    </Paragraph>
                    <Paragraph style={{ marginBottom: '8px' }}>
                      <Text strong>2.</Text> Kiểm tra trang thái tổng quan (dashboard) của hệ thống
                      làm mát. Đảm bảo không có cảnh báo nghiêm trọng (Critical Alarms) nào đang
                      hoạt động.
                    </Paragraph>
                    <Paragraph>
                      <Text strong>3.</Text> Xem xét các cảnh báo cấp độ thấp hơn (Warning Alarms).
                      Đánh giá mức độ ưu tiên để xử lý.
                    </Paragraph>
                  </div>
                ),
              },
              {
                title: 'Đi tận nơi kiểm tra',
                description: (
                  <div>
                    <Paragraph style={{ marginBottom: '8px' }}>
                      <Text strong>1.</Text> <Text strong>Tiếng ồn:</Text> Lắng nghe âm thanh hoạt
                      động của các dàn lạnh và quạt sàn. Ghi nhận bất kỳ tiếng ồn bất thường nào như
                      tiếng rít, va đập cơ khí.
                    </Paragraph>
                    <Paragraph style={{ marginBottom: '8px' }}>
                      <Text strong>2.</Text> <Text strong>Rò rỉ:</Text> Kiểm tra khu vực xung quanh
                      tất cả các dàn lạnh và đường ống để phát hiện dấu hiệu rò rỉ nước.
                    </Paragraph>
                    <Paragraph style={{ marginBottom: '8px' }}>
                      <Text strong>3.</Text> <Text strong>Luồng khí:</Text> Đảm bảo các cửa gió,
                      lưới tản nhiệt của dàn lạnh và quạt sàn không bị che chắn hoặc cản trở bởi vật
                      lạ.
                    </Paragraph>
                    <Paragraph>
                      <Text strong>4.</Text> <Text strong>Đèn báo:</Text> Quan sát nhanh các đèn LED
                      trạng thái trên mỗi thiết bị. Đèn xanh lá (Status LED) sáng cho thấy thiết bị
                      đang có nguồn và hoạt động.
                    </Paragraph>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        <Card title='Quy trình kiểm tra chi tiết các thiết bị' style={{ marginBottom: '20px' }}>
          <Paragraph>
            Sau khi kiểm tra tổng quan, tiến hành kiểm tra chi tiết tại màn hình hiển thị của từng
            loại thiết bị.
          </Paragraph>

          <Collapse
            defaultActiveKey={['1', '2']}
            style={{ marginBottom: '16px' }}
            items={[
              {
                key: '1',
                label: 'Các điều hòa InRoom (Uniflair TDAV, FM40) và điều hòa Inrow (ACRP102)',
                children: (
                  <div>
                    <Paragraph>
                      Các thiết bị này thường hoạt động trong một nhóm (Group) để dự phòng và cân
                      bằng tải.
                    </Paragraph>

                    <Steps
                      current={currentDetailStep}
                      onChange={setCurrentDetailStep}
                      direction='vertical'
                      size='small'
                      items={[
                        {
                          title: 'Kiểm tra Màn hình chính (Main Menu/Status Screen)',
                          description: (
                            <div>
                              <Paragraph style={{ marginBottom: '8px' }}>
                                <Text strong>• Trạng thái báo động:</Text> Xác nhận màn hình hiển
                                thị "No Alarms" hoặc không có đèn báo động đỏ (Critical) sáng.
                              </Paragraph>
                              <Paragraph style={{ marginBottom: '8px' }}>
                                <Text strong>• Trạng thái hoạt động của Nhóm (Group Status):</Text>
                              </Paragraph>
                              <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>
                                <li>
                                  Kiểm tra vai trò (Role) và trạng thái (State) của từng điều hòa
                                  trong nhóm. Các điều hòa chính (Primary) phải ở trạng thái "On"
                                  hoặc "Cooling".
                                </li>
                                <li>
                                  Nếu có điều hòa ở trạng thái "Backup" hoặc "Assist", cần tìm hiểu
                                  nguyên nhân. Có thể một điều hòa khác trong nhóm đã gặp lỗi hoặc
                                  đang quá tải.
                                </li>
                              </ul>
                              <Paragraph>
                                <Text strong>
                                  • Kiểm tra các thông số vận hành chính (View Unit Status):
                                </Text>
                              </Paragraph>
                              <ul style={{ marginLeft: '20px' }}>
                                <li>
                                  <Text strong>
                                    Nhiệt độ không khí hồi về (Return Air Temperature):
                                  </Text>{' '}
                                  So sánh với giá trị cài đặt (Setpoint). Đây là thông số quan trọng
                                  nhất cho thấy khả năng làm mát của dàn lạnh.
                                </li>
                                <li>
                                  <Text strong>
                                    Nhiệt độ không khí cấp đi (Supply Air Temperature):
                                  </Text>{' '}
                                  Đảm bảo nhiệt độ khí ra khỏi dàn lạnh đủ mát.
                                </li>
                                <li>
                                  <Text strong>
                                    Nhiệt độ khí nóng vào tủ rack (Max Rack Inlet Temperature - đối
                                    với InRow):
                                  </Text>{' '}
                                  Đây là thông số điều khiển chính cho các điều hòa InRow, cần được
                                  duy trì ổn định dưới ngưỡng cho phép.
                                </li>
                                <li>
                                  <Text strong>
                                    Phần trăm tải làm mát (Cooling Output/Demand %):
                                  </Text>{' '}
                                  Cho biết mức độ hoạt động của máy nén.
                                </li>
                                <li>
                                  <Text strong>
                                    Tốc độ quạt và Lưu lượng gió (Fan Speed & Air Flow):
                                  </Text>{' '}
                                  Các thông số này sẽ tự động điều chỉnh. Ghi nhận nếu có dấu hiệu
                                  bất thường (ví dụ: quạt chạy 100% liên tục mà nhiệt độ không
                                  giảm).
                                </li>
                              </ul>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                ),
              },
              {
                key: '2',
                label: 'Các quạt sàn chủ động (AFM4500B)',
                children: (
                  <div>
                    <Paragraph>
                      Các thiết bị này hoạt động độc lập nhưng vẫn là một phần quan trọng của hệ
                      thống.
                    </Paragraph>

                    <Steps
                      current={currentDetailStep}
                      onChange={setCurrentDetailStep}
                      direction='vertical'
                      size='small'
                      items={[
                        {
                          title: 'Kiểm tra tại chỗ',
                          description: (
                            <div>
                              <Paragraph style={{ marginBottom: '8px' }}>
                                <Text strong>• Màn hình điều khiển:</Text> Đảm bảo không có mã lỗi
                                nào được hiển thị (ví dụ: Er0, Er1 - lỗi cảm biến; Er4 - nhiệt độ
                                quá cao).
                              </Paragraph>
                              <Paragraph style={{ marginBottom: '8px' }}>
                                <Text strong>• Hoạt động của quạt:</Text> Lắng nghe và xác nhận quạt
                                đang chạy. Tốc độ quạt sẽ thay đổi dựa trên nhiệt độ đo được từ cảm
                                biến tại tủ rack.
                              </Paragraph>
                              <Paragraph>
                                <Text strong>• Kiểm tra vật lý:</Text> Đảm bảo tấm lưới của quạt sàn
                                không bị vật cản che lấp, ảnh hưởng đến luồng gió.
                              </Paragraph>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />
        </Card>

        <Card title='Xử Lý Các Tình Huống Thường Gặp' style={{ marginBottom: '20px' }}>
          <Alert
            message={
              <div>
                Khi có cảnh báo <Text strong>Warning (Màu vàng)</Text>{' '}
              </div>
            }
            description={
              <div>
                <ol>
                  <li>
                    Vào mục <Text strong>View Alarms</Text> trên màn hình dàn lạnh để xem chi tiết
                    cảnh báo.
                  </li>
                  <li>Ghi lại mã lỗi.</li>
                  <li>
                    Xử lý lỗi theo hướng dẫn hoặc thông báo cho bên bảo trì để xử lý theo kế hoạch.
                  </li>
                  <li>Ghi nhận lại lỗi lên trang báo cáo 10.10.33.150.</li>
                </ol>
              </div>
            }
            type='warning'
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Alert
            message="Khi có cảnh báo 'Critical' (Màu đỏ)"
            description={
              <div>
                <ol>
                  <li>
                    Ưu tiên hàng đầu. Vào mục <Text strong>View Alarms</Text> để xác định lỗi.
                  </li>
                  <li>Báo cáo ngay lập tức theo quy trình khẩn cấp.</li>
                  <li>
                    Kiểm tra xem hệ thống dự phòng (backup) đã được kích hoạt hay chưa. Quan sát
                    trạng thái của các điều hòa khác trong cùng nhóm.
                  </li>
                  <li>Xử lý lỗi theo hướng dẫn hoặc yêu cầu bảo trì càng sớm càng tốt.</li>
                  <li>Ghi nhận lỗi lên trang báo cáo 10.10.33.150.</li>
                </ol>
              </div>
            }
            type='error'
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Alert
            message="Khi một điều hòa chuyển sang chế độ 'Backup'"
            description={
              <div>
                <ol>
                  <li>
                    Điều này cho thấy một điều hòa chính (<Text strong>primary</Text>) trong nhóm đã
                    gặp sự cố hoặc được xoay vòng để cân bằng thời gian chạy (Runtime Balancing).
                  </li>
                  <li>
                    Kiểm tra trạng thái của tất cả các điều hòa trong nhóm để xác định điều hòa nào
                    đang bị lỗi hoặc đã được đưa về trạng thái nghỉ.
                  </li>
                </ol>
              </div>
            }
            type='info'
            showIcon
          />
        </Card>
      </div>

      <div id='section-4-2' className='subsection'>
        <Title level={3}>4.2. Tổng hợp mã lỗi, nguyên nhân và cách giải quyết</Title>

        <Card
          title='Bảng Tổng Hợp Mã Lỗi Dàn Lạnh (Uniflair, FM40H & ACRP102)'
          style={{ marginBottom: '20px' }}
        >
          <Paragraph>
            Để xem xét cụ thể nhất lỗi của từng thiết bị, hãy xem phần xác nhận lỗi trong phần chi
            tiết của từng thiết bị để có cái nhìn chính xác hơn, dưới đây là phần liệt kê tổng hợp
            tất cả các mã lỗi:
          </Paragraph>

          <Table
            dataSource={[
              {
                key: '1',
                error: 'Air Filter Clogged (Bộ lọc không khí bị tắc)',
                cause:
                  '• Bộ lọc không khí bị bẩn, gây ra chênh lệch áp suất lớn.\n• Cảm biến chênh áp hoặc ống dẫn khí tới cảm biến bị lỗi, tắc nghẽn.',
                solution:
                  '• Vệ sinh hoặc thay thế bộ lọc không khí.\n• Đặt lại bộ đếm giờ của bộ lọc sau khi bảo trì.\n• Kiểm tra ống cảm biến áp suất và kết nối.',
              },
              {
                key: '2',
                error: 'Insufficient Airflow / Airflow Low (Lưu lượng gió thấp / không đủ)',
                cause:
                  '• Bộ lọc bị tắc, damper trong ống gió bị đóng, hoặc có vật cản luồng khí.\n• Tốc độ quạt được cài đặt quá thấp.',
                solution:
                  '• Kiểm tra và xử lý các nguyên nhân gây cản trở luồng gió.\n• Tăng tốc độ quạt nếu cần thiết.\n• Nếu sự cố vẫn tiếp diễn, liên hệ bộ phận hỗ trợ kỹ thuật.',
              },
              {
                key: '3',
                error:
                  'Compressor High Pressure / High Discharge Pressure Alarm (Áp suất đầu đẩy cao)',
                cause:
                  '• Dàn ngưng (dàn nóng) bị bẩn, bị chặn luồng gió hoặc đặt ở nơi quá nóng.\n• Quạt của dàn ngưng không hoạt động.\n• Thừa môi chất lạnh (gas) trong hệ thống.',
                solution:
                  '• Vệ sinh dàn ngưng, đảm bảo khu vực xung quanh thông thoáng.\n• Kiểm tra hoạt động của quạt dàn ngưng.\n• Reset thủ công công tắc áp suất cao sau khi khắc phục sự cố.\n• Cần kỹ thuật viên kiểm tra áp suất gas.',
              },
              {
                key: '4',
                error: 'Low / High Suction Pressure Alarm (Báo động áp suất hút thấp / cao)',
                cause:
                  'Thấp:\n• Thiếu gas do rò rỉ, tắc nghẽn bộ lọc hoặc dàn bay hơi.\n\nCao:\n• Tốc độ quạt không phù hợp, tải nhiệt nằm ngoài phạm vi của thiết bị.',
                solution:
                  'Thấp:\n• Kiểm tra rò rỉ, vệ sinh bộ lọc và dàn bay hơi, nạp lại gas.\n\nCao:\n• Đảm bảo cài đặt tốc độ quạt là chính xác và tải nhiệt phù hợp.',
              },
              {
                key: '5',
                error: 'Cooling Failure (Lỗi làm mát)',
                cause:
                  '• Lỗi phần cứng nghiêm trọng trong hệ thống làm mát.\n• Lỗi máy nén (compressor failure), quá tải nhiệt (thermal trip).',
                solution: 'Liên hệ với bộ phận hỗ trợ kỹ thuật để được trợ giúp.',
              },
              {
                key: '6',
                error: 'Excessive Compressor Cycling (Máy nén khởi động/dừng quá nhiều)',
                cause:
                  '• Hệ thống ghi nhận số lần khởi động máy nén trung bình vượt quá 12 lần/giờ trong một khoảng thời gian dài.',
                solution: 'Liên hệ với bộ phận hỗ trợ kỹ thuật để kiểm tra chuyên sâu.',
              },
              {
                key: '7',
                error: 'Fan Failure (Lỗi quạt)',
                cause:
                  '• Quạt dàn lạnh (EC fan) hỏng.\n• Bộ điều khiển quạt (driver) lỗi.\n• Lỏng dây kết nối.',
                solution:
                  '• Kiểm tra cấp nguồn và tín hiệu điều khiển.\n• Thay thế motor/quạt nếu cần thiết.',
              },
              {
                key: '8',
                error: 'EEV Failure (Lỗi van tiết lưu điện tử)',
                cause:
                  'Van tiết lưu điện tử (EEV) bị kẹt, không mở/đóng đúng cách, hoặc lỗi tín hiệu điều khiển.',
                solution:
                  'Kiểm tra tín hiệu điều khiển đến van EEV. Cần kỹ thuật viên chuyên nghiệp để kiểm tra sâu hơn.',
              },
              {
                key: '9',
                error: 'EEPROM Failure (Lỗi bộ nhớ điều khiển)',
                cause: 'Hỏng bộ nhớ trên bo mạch điều khiển vi xử lý.',
                solution: 'Liên hệ hãng – có thể phải thay bo điều khiển.',
              },
              {
                key: '10',
                error: 'Humidifier...(Các lỗi liên quan bộ tạo ẩm)',
                cause:
                  '• Cylinder Full/Replace Cylinder: Hộp tạo ẩm đã hết tuổi thọ hoặc đầy cặn.\n• Low Water Level: Mất nguồn cấp nước, áp lực nước yếu hoặc van cấp bị kẹt. \n• Drain Fault: Lỗi hệ thống xả nước của bộ tạo ẩm. ',
                solution:
                  '• Thay thế hộp tạo ẩm (cylinder). \n• Kiểm tra đường ống và van cấp nước.\n• Tham khảo hướng dẫn sử dụng của bộ tạo ẩm và liên hệ hỗ trợ kỹ thuật nếu cần',
              },
              {
                key: '11',
                error: 'Condensate Pump Fail / Drain Error (Lỗi bơm nước ngưng / Lỗi thoát nước)',
                cause:
                  '• Đường ống thoát nước ngưng bị tắc.\n• Phao cảm biến của bơm bị kẹt hoặc kích hoạt.\n• Bơm bị lỗi hoặc mất nguồn.',
                solution:
                  '• Kiểm tra và làm sạch đường ống thoát nước ngưng. \n• Kiểm tra phao và cầu dao (circuit breaker) của bơm',
              },
              {
                key: '12',
                error:
                  'Group Communication Fault / Exp Module #... Communication Lost (Lỗi giao tiếp)',
                cause:
                  '• Lỗi kết nối cáp mạng (A-Link / CAN bus / Modbus) giữa các dàn lạnh hoặc với BMS.\n• Cài đặt địa chỉ (DIP switch / ID) của các dàn lạnh sai hoặc trùng lặp.',
                solution:
                  '• Kiểm tra lại toàn bộ cáp kết nối và điện trở đầu cuối (terminator).\n• Kiểm tra cài đặt địa chỉ trên mỗi dàn lạnh để đảm bảo là duy nhất.',
              },
              {
                key: '13',
                error: '... Sensor Fault/Lỗi cảm biến',
                cause:
                  '• Cảm biến (khí hồi, khí cấp, tủ rack, độ ẩm, áp suất) bị lỗi hoặc mất kết nối',
                solution:
                  '• Kiểm tra lại kết nối cáp của cảm biến.\n• So sánh giá trị đọc được với một thiết bị đo chuẩn. \n• Nếu lỗi vẫn tiếp diễn, cần thay thế cảm biến bị lỗi.',
              },
              {
                key: '14',
                error: 'Water Detection Fault/Phát hiện nước',
                cause:
                  '• Cảm biến phát hiện có sự hiện diện của nước dưới sàn hoặc trong thiết bị.',
                solution:
                  '• Xác định nguồn rò rỉ và sửa chữa.\n• Tắt nguồn cấp nước chính nếu cần.',
              },
              {
                key: '15',
                error: '... Run Hours Violation (Hết giờ bảo trì)',
                cause:
                  '• Các bộ phận (bộ lọc, quạt, máy nén...) đã đạt đến số giờ hoạt động cần được bảo trì theo lịch cài đặt.',
                solution:
                  '• Thực hiện bảo trì cho bộ phận tương ứng, sau đó vào màn hình điều khiển để reset lại bộ đếm giờ.',
              },
              {
                key: '16',
                error: 'Fire / Smoke Detected (Phát hiện lửa / khói)',
                cause: '• Cảm biến lửa hoặc khói trong thiết bị được kích hoạt.',
                solution:
                  '• Thực hiện theo quy trình khẩn cấp PCCC của cơ sở. Đây là cảnh báo cho thiết bị, không thay thế hệ thống PCCC của tòa nhà.',
              },
            ]}
            columns={[
              {
                title: 'STT',
                dataIndex: 'key',
                key: 'key',
                align: 'center',
                width: '2%',
                render: text => <Text strong>{text}</Text>,
              },
              {
                title: 'Thông báo lỗi',
                dataIndex: 'error',
                key: 'error',
                width: '25%',
                render: text => (
                  <Text strong style={{ fontSize: '12px' }}>
                    {text}
                  </Text>
                ),
              },
              {
                title: 'Nguyên nhân có thể',
                dataIndex: 'cause',
                key: 'cause',
                width: '35%',
                render: text => (
                  <Text style={{ fontSize: '11px', whiteSpace: 'pre-line' }}>{text}</Text>
                ),
              },
              {
                title: 'Hành động khắc phục',
                dataIndex: 'solution',
                key: 'solution',
                width: '40%',
                render: text => (
                  <Text style={{ fontSize: '11px', whiteSpace: 'pre-line' }}>{text}</Text>
                ),
              },
            ]}
            rowKey='key'
            pagination={false}
            size='small'
            bordered
          />
        </Card>

        <Card
          title='Bảng Mã Lỗi Quạt Sàn Chủ Động (Active Floor Module - AFM4500B)'
          style={{ marginBottom: '20px' }}
        >
          <Paragraph>
            Bảng này chỉ áp dụng cho các module quạt sàn chủ động Uniflair AFM4500B
          </Paragraph>

          <Table
            dataSource={[
              {
                key: '1',
                code: 'Er0 / Er1',
                description:
                  'Đầu dò nhiệt độ ST1 hoặc ST2 bị ngắt kết nối. Quá trình điều khiển bị vô hiệu hóa.',
                solution:
                  'Tự động khôi phục ngay khi đầu dò được kết nối lại; cần reset thủ công để tắt chuông và xóa tin nhắn hiển thị.',
              },
              {
                key: '2',
                code: 'Er2',
                description: 'Lỗi bộ nhớ thông số (thường xảy ra khi khởi động hoặc lưu cài đặt).',
                solution: 'Cần lập trình lại các thông số. Nhấn PRG để xóa báo động.',
              },
              {
                key: '3',
                code: 'Er3',
                description: 'Báo động từ đầu vào kỹ thuật số (digital input).',
                solution:
                  'Có thể lập trình để reset tự động hoặc thủ công sau khi tín hiệu bên ngoài được giải quyết; cần reset thủ công cho chuông và tin nhắn.',
              },
              {
                key: '4',
                code: 'Er4 / Er5',
                description: 'Báo động nhiệt độ cao (Er4) hoặc nhiệt độ thấp (Er5).',
                solution: 'Tự động khôi phục khi nhiệt độ trở về trong giới hạn cho phép.',
              },
            ]}
            columns={[
              {
                title: 'Mã lỗi',
                dataIndex: 'code',
                key: 'code',
                width: '15%',
                render: text => <Tag color='red'>{text}</Tag>,
              },
              {
                title: 'Nguyên nhân / Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '45%',
                render: text => <Text style={{ fontSize: '11px' }}>{text}</Text>,
              },
              {
                title: 'Hành động khắc phục',
                dataIndex: 'solution',
                key: 'solution',
                width: '40%',
                render: text => <Text style={{ fontSize: '11px' }}>{text}</Text>,
              },
            ]}
            rowKey='key'
            pagination={false}
            size='small'
            bordered
          />
        </Card>
      </div>

      <div id='section-4-3' className='subsection'>
        <Title level={3}>4.3. Vị trí, Seri, IP, hợp đồng bảo trì liên quan cụ thể</Title>

        <Card title='Thông tin chi tiết thiết bị hệ thống làm mát' style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                name: 'PAC 02 H60R01',
                type: 'Uniflair TDAV 2242A',
                serial: 'E12150T00391',
                location: 'PMC1',
                ip: '68.68.68.112',
                contract:
                  'HĐ số: 02/2022 25/02/2022\nHĐ bảo trì 09/2025-SVTech có hiệu lực từ 07/9/2025',
              },
              {
                key: '2',
                name: 'PAC 03 H60R02',
                type: 'Uniflair TDAV 2242A',
                serial: 'E12150T00392',
                location: 'PMC1',
                ip: '68.68.68.111',
                contract:
                  'HĐ số: 02/2022 25/02/2022\nHĐ bảo trì 09/2025-SVTech có hiệu lực từ 07/9/2025',
              },
              {
                key: '3',
                name: 'PAC 04 H61R01',
                type: 'Uniflair TDAV 2242A',
                serial: 'E12150T00390',
                location: 'PMC2',
                ip: '68.68.68.113',
                contract:
                  'HĐ số: 02/2022 25/02/2022\nHĐ bảo trì 09/2025-SVTech có hiệu lực từ 07/9/2025',
              },
              {
                key: '4',
                name: 'IR 01 H60D06',
                type: 'InRow ACRP102',
                serial: 'YK0831111036',
                location: 'PMC1',
                ip: '68.68.68.100',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '5',
                name: 'IR 02 H60D03',
                type: 'InRow ACRP102',
                serial: 'YK0831110079',
                location: 'PMC1',
                ip: '68.68.68.101',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '6',
                name: 'IR 03 H60C07',
                type: 'InRow ACRP102',
                serial: 'YK0831110076',
                location: 'PMC1',
                ip: '68.68.68.103',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '7',
                name: 'IR 04 H60C03',
                type: 'InRow ACRP102',
                serial: 'YK0831110073',
                location: 'PMC1',
                ip: '68.68.68.102',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '8',
                name: 'FM 01 H30R02',
                type: 'FM40H-AGB-ESD',
                serial: 'GK0702120008',
                location: 'Phòng PCCC',
                ip: '68.68.68.105',
                contract: 'HĐ số: 34/2020 14/08/2020\nĐã hết hạn bảo trì',
              },
              {
                key: '9',
                name: 'FM 02 H30R03',
                type: 'FM40H-AGB-ESD',
                serial: 'GK0702120027',
                location: 'Phòng PCCC',
                ip: '68.68.68.104',
                contract: 'HĐ số: 34/2020 14/08/2020\nĐã hết hạn bảo trì',
              },
              {
                key: '10',
                name: 'FM 03 H30R01',
                type: 'FM40H-AGB-ESD',
                serial: 'GK0701120002',
                location: 'Phòng PCCC',
                ip: '68.68.68.106',
                contract: 'HĐ số: 34/2020 14/08/2020\nĐã hết hạn bảo trì',
              },
              {
                key: '11',
                name: 'FM 04 H40R01',
                type: 'FM40H-AGB-ESD',
                serial: 'GK0702120018',
                location: 'Phòng ISP\nLối vào PMC1',
                ip: '68.68.68.108',
                contract: 'HĐ số: 34/2020 14/08/2020\nHĐ số: 06/2025',
              },
              {
                key: '12',
                name: 'FM 05 H40R02',
                type: 'FM40H-AGB-ESD',
                serial: 'GK0709180048',
                location: 'Phòng ISP\nLối vào PMC1',
                ip: '68.68.68.107',
                contract: 'HĐ số: 34/2020 14/08/2020\nHĐ số: 06/2025',
              },
              {
                key: '13',
                name: 'CRAC 01 H20R01',
                type: 'Uniflair TDAV1321A',
                serial: 'E12019T00032',
                location: 'Phòng UPS',
                ip: '68.68.68.110',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '14',
                name: 'CRAC 02 H20R02',
                type: 'Uniflair TDAV1321A',
                serial: 'E12019T00031',
                location: 'Phòng UPS',
                ip: '68.68.68.109',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '15',
                name: 'PAC 01 H31R03',
                type: 'Uniflair TDAV 2842A',
                serial: 'UCX116205',
                location: 'PMC2\nGần hành lang ngoài',
                ip: '68.68.68.116',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '16',
                name: 'PAC 02 H31R01',
                type: 'Uniflair TDAV 2842A',
                serial: 'UCX116204',
                location: 'PMC2\nGần hành lang ngoài',
                ip: '68.68.68.114',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '17',
                name: 'PAC 03 H31R02',
                type: 'Uniflair TDAV 2842A',
                serial: 'UCX116206',
                location: 'PMC2\nGần hành lang ngoài',
                ip: '68.68.68.115',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '18',
                name: 'AF 01',
                type: 'AFM4500B',
                serial: 'SFF029628',
                location: 'PMC2',
                ip: '-',
                contract:
                  'HĐ số: 02/2022 25/02/2022\nHĐ bảo trì 09/2025-SVTech có hiệu lực từ 07/9/2025',
              },
              {
                key: '19',
                name: 'AF 02',
                type: 'AFM4500B',
                serial: 'SFF029647',
                location: 'PMC2',
                ip: '-',
                contract:
                  'HĐ số: 02/2022 25/02/2022\nHĐ bảo trì 09/2025-SVTech có hiệu lực từ 07/9/2025',
              },
              {
                key: '20',
                name: 'AF 03',
                type: 'AFM4500B',
                serial: 'UFW024725',
                location: 'PMC2',
                ip: '-',
                contract:
                  'HĐ số: 02/2022 25/02/2022\nHĐ bảo trì 09/2025-SVTech có hiệu lực từ 07/9/2025',
              },
              {
                key: '21',
                name: 'AF 04',
                type: 'AFM4500B',
                serial: 'UFW024713',
                location: 'PMC2',
                ip: '-',
                contract:
                  'HĐ số: 02/2022 25/02/2022\nHĐ bảo trì 09/2025-SVTech có hiệu lực từ 07/9/2025',
              },
              {
                key: '22',
                name: 'AF 05',
                type: 'AFM4500B',
                serial: 'UFW024718',
                location: 'PMC1',
                ip: '-',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '23',
                name: 'AF 06',
                type: 'AFM4500B',
                serial: 'SFF029644',
                location: 'PMC1',
                ip: '-',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '24',
                name: 'AF 07',
                type: 'AFM4500B',
                serial: 'SFF029643',
                location: 'PMC1',
                ip: '-',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '25',
                name: 'AF 08',
                type: 'AFM4500B',
                serial: 'UFW024727',
                location: 'PMC1',
                ip: '-',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '26',
                name: 'AF 09',
                type: 'AFM4500B',
                serial: 'UFW024726',
                location: 'PMC1',
                ip: '-',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
              {
                key: '27',
                name: 'AF 10',
                type: 'AFM4500B',
                serial: 'UFW024721',
                location: 'PMC1',
                ip: '-',
                contract: 'HĐ Số: 79/2023 16/10/2023',
              },
            ]}
            columns={[
              {
                title: 'Tên thiết bị',
                dataIndex: 'name',
                key: 'name',
                width: '15%',
                render: text => <Tag color='blue'>{text}</Tag>,
              },
              {
                title: 'Loại thiết bị',
                dataIndex: 'type',
                key: 'type',
                width: '20%',
                render: text => <Text style={{ fontSize: '14px' }}>{text}</Text>,
              },
              {
                title: 'Số Seri',
                dataIndex: 'serial',
                key: 'serial',
                width: '15%',
                render: text => <Text style={{ fontSize: '14px' }}>{text}</Text>,
              },
              {
                title: 'Vị trí',
                dataIndex: 'location',
                key: 'location',
                width: '15%',
                render: text => (
                  <Text style={{ fontSize: '14px', whiteSpace: 'pre-line' }}>{text}</Text>
                ),
              },
              {
                title: 'IP',
                dataIndex: 'ip',
                key: 'ip',
                width: '12%',
                render: text => <Text style={{ fontSize: '14px' }}>{text}</Text>,
              },
              {
                title: 'Hợp đồng bảo trì hiện tại',
                dataIndex: 'contract',
                key: 'contract',
                width: '23%',
                render: text => (
                  <Text style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{text}</Text>
                ),
              },
            ]}
            rowKey='key'
            pagination={{
              pageSize: 10,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thiết bị`,
            }}
            size='small'
            bordered
          />
        </Card>
      </div>

      <div id='section-4-4' className='subsection'>
        <Title level={3}>4.4. Xem và thiết lập thông số của các điều hòa qua Website</Title>

        <Card title='Hướng dẫn truy cập hệ thống điều hòa' style={{ marginBottom: '20px' }}>
          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            direction='vertical'
            size='small'
            items={[
              {
                title: 'Remote vào máy chủ trung gian',
                description: 'Sử dụng địa chỉ: 10.10.40.32 hoặc 10.10.40.31',
              },
              {
                title: 'Remote vào máy điều khiển',
                description: (
                  <div>
                    <Paragraph style={{ marginBottom: '8px' }}>
                      <Text strong>Địa chỉ:</Text> 10.10.33.151
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Thông tin đăng nhập:</Text>
                    </Paragraph>
                    <ul style={{ marginLeft: '20px' }}>
                      <li>
                        <Text strong>Username:</Text> dce
                      </li>
                      <li>
                        <PasswordField password='Ab@13579' label='Password:' />
                      </li>
                    </ul>
                  </div>
                ),
              },
              {
                title: 'Truy cập điều hòa qua trình duyệt',
                description: 'Vào trình duyệt và nhập IP của điều hòa để truy cập',
              },
            ]}
          />
        </Card>

        {/* Đưa Card vào trong Collapse để gọn gàng hơn */}
        <Collapse
          bordered
          style={{ marginBottom: '20px' }}
          expandIconPosition='start'
          items={[
            {
              key: '1',
              label: (
                <span style={{ fontWeight: 600, fontSize: '16px' }}>
                  Thông tin đăng nhập cho từng loại điều hòa
                </span>
              ),
              children: (
                <Card bordered={false} style={{ padding: 0, marginBottom: 0 }}>
                  <Alert
                    message='Điều hòa FM (FM40H)'
                    description={
                      <div>
                        <Paragraph style={{ marginBottom: '8px' }}>
                          <Text strong>Username:</Text> Apc@123
                        </Paragraph>
                        <Paragraph>
                          <PasswordField password='Apc@123' label='Password:' />
                        </Paragraph>
                      </div>
                    }
                    type='info'
                    showIcon
                    style={{ marginBottom: '16px' }}
                  />

                  <Alert
                    message='Điều hòa Uniflair (TDAV, ACRP102)'
                    description={
                      <div>
                        <Paragraph style={{ marginBottom: '8px' }}>
                          <Text strong>Truy cập trực tiếp:</Text> Có thể vào trực tiếp bằng địa chỉ
                          IP và cài đặt nhiệt độ mà không cần đăng nhập.
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Để vào các mục khác:</Text>
                        </Paragraph>
                        <ul style={{ marginLeft: '20px' }}>
                          <li>
                            <Text strong>Username:</Text> admin
                          </li>
                          <li>
                            <PasswordField password='fadmin' label='Password:' />
                          </li>
                        </ul>
                      </div>
                    }
                    type='success'
                    showIcon
                  />
                </Card>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
};

export default ApplicationSection;
