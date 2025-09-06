import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Alert, Card, Collapse, Divider, Input, Space, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const ErrorCodesGuide = () => {
  const [searchText, setSearchText] = useState('');

  // SMARDT Chiller Error Codes từ tài liệu
  const smartdErrorCodes = [
    {
      key: '1',
      code: 'System 1 LP Fault',
      description: 'Low evaporator pressure fault (Refrigeration system 1)',
      severity: 'Trung bình',
      cause: 'Thiếu gas lạnh, bộ bay hơi bẩn, lưu lượng nước thấp',
      solution: 'Kiểm tra mức gas R134a, làm sạch evaporator, kiểm tra bơm nước lạnh',
      autoReset: 'Có',
      category: 'System Pressure',
    },
    {
      key: '2',
      code: 'System 1 HP Fault',
      description: 'High condenser pressure fault (Refrigeration system 1)',
      severity: 'Cao',
      cause: 'Quạt tản nhiệt lỗi, condenser bẩn, nhiệt độ môi trường cao',
      solution: 'Kiểm tra hoạt động 10 quạt EBM, làm sạch condenser coil',
      autoReset: 'Có',
      category: 'System Pressure',
    },
    {
      key: '3',
      code: 'Low Water Temperature Fault',
      description: 'Leaving chilled water temperature reached low limit',
      severity: 'Trung bình',
      cause: 'Set point quá thấp, sensor lỗi, tải làm lạnh thấp',
      solution: 'Kiểm tra set point (>6°C), test sensor, điều chỉnh tải',
      autoReset: 'Có',
      category: 'Temperature',
    },
    {
      key: '4',
      code: 'ChW Temperature Sensor Fault',
      description: 'Chilled water temperature sensors reading incorrectly',
      severity: 'Cao',
      cause: 'Sensor hỏng, kết nối lỏng, nhiễu điện',
      solution: 'Thay sensor, kiểm tra dây cáp, chống nhiễu',
      autoReset: 'Không',
      category: 'Sensor',
    },
    {
      key: '5',
      code: 'CoW Flow Lockout Fault',
      description: 'No condenser water flow detected after 5 attempts',
      severity: 'Nghiêm trọng',
      cause: 'Không có nước làm mát, bơm nước lỗi, van đóng',
      solution: 'Kiểm tra hệ thống nước, khởi động bơm, mở van',
      autoReset: 'Không',
      category: 'Water Flow',
    },
    {
      key: '6',
      code: 'C1 Lockout - Fault Count',
      description: 'Compressor locked out due to excessive auto-reset faults',
      severity: 'Nghiêm trọng',
      cause: 'Lỗi lặp lại nhiều lần, hệ thống không ổn định',
      solution: 'Reset compressor, kiểm tra toàn bộ hệ thống',
      autoReset: 'Không',
      category: 'Compressor',
    },
    {
      key: '7',
      code: 'C1 - Generator Mode',
      description: 'DC Bus voltage low, compressor using shaft energy',
      severity: 'Nghiêm trọng',
      cause: 'Điện áp DC thấp, sự cố nguồn điện',
      solution: 'Kiểm tra nguồn điện 400V, kiểm tra DC bus',
      autoReset: 'Không',
      category: 'Electrical',
    },
    {
      key: '8',
      code: 'C1 - Memory Checksum Error',
      description: 'EEPROM calibration data error detected',
      severity: 'Cao',
      cause: 'EEPROM lỗi, dữ liệu bị hỏng',
      solution: 'Reset EEPROM, tải lại calibration data',
      autoReset: 'Không',
      category: 'System',
    },
    {
      key: '9',
      code: 'C1 - 24VDC Out Of Range',
      description: '24VDC supply voltage outside acceptable range',
      severity: 'Cao',
      cause: 'Nguồn 24VDC lỗi, biến áp hỏng',
      solution: 'Kiểm tra nguồn 24VDC (20-28VDC), thay biến áp',
      autoReset: 'Có',
      category: 'Electrical',
    },
    {
      key: '10',
      code: 'C1 - High Current',
      description: 'RMS Current exceeded High Current Fault Limit',
      severity: 'Nghiêm trọng',
      cause: 'Quá tải, motor bị kẹt, điện áp thấp',
      solution: 'Giảm tải, kiểm tra motor, ổn định điện áp',
      autoReset: 'Không',
      category: 'Electrical',
    },
    {
      key: '11',
      code: 'C1 - Motor Winding Temperature',
      description: 'Motor thermal exceeded 155°C limit',
      severity: 'Nghiêm trọng',
      cause: 'Motor quá nóng, làm mát kém',
      solution: 'Tắt máy ngay, kiểm tra làm mát motor, thay motor',
      autoReset: 'Không',
      category: 'Temperature',
    },
    {
      key: '12',
      code: 'C1 - Discharge Pressure',
      description: 'Discharge pressure exceeded fault limit',
      severity: 'Nghiêm trọng',
      cause: 'Áp suất xả quá cao, tắc nghẽn, condenser bẩn',
      solution: 'Tắt máy, làm sạch condenser, kiểm tra hệ thống',
      autoReset: 'Không',
      category: 'System Pressure',
    },
  ];

  // UNIFLAIR PAC Error Codes
  const uniflairErrorCodes = [
    {
      key: '13',
      code: 'AL01 - High Room Temperature',
      description: 'Room temperature too high',
      severity: 'Trung bình',
      cause: 'Tải nhiệt cao, chiller không đủ công suất',
      solution: 'Kiểm tra tải phòng, tăng công suất làm lạnh',
      autoReset: 'Có',
      category: 'Temperature',
    },
    {
      key: '14',
      code: 'AL02 - Low Room Temperature',
      description: 'Room temperature too low',
      severity: 'Thấp',
      cause: 'Set point thấp, tải phòng thấp',
      solution: 'Điều chỉnh set point, kiểm tra sensor',
      autoReset: 'Có',
      category: 'Temperature',
    },
    {
      key: '15',
      code: 'AL10 - Water Flow Alarm',
      description: 'Chilled water flow too low',
      severity: 'Cao',
      cause: 'Van đóng, bơm lỗi, đường ống tắc',
      solution: 'Mở van, kiểm tra bơm, thông đường ống',
      autoReset: 'Có',
      category: 'Water Flow',
    },
    {
      key: '16',
      code: 'AL15 - Fan Fault',
      description: 'EC fan motor fault detected',
      severity: 'Cao',
      cause: 'Motor fan lỗi, điều khiển EC lỗi',
      solution: 'Thay motor EC, kiểm tra điều khiển',
      autoReset: 'Không',
      category: 'Fan',
    },
  ];

  // Combine all error codes
  const allErrorCodes = [...smartdErrorCodes, ...uniflairErrorCodes];

  // Filter function
  const filteredCodes = allErrorCodes.filter(
    error =>
      error.code.toLowerCase().includes(searchText.toLowerCase()) ||
      error.description.toLowerCase().includes(searchText.toLowerCase()) ||
      error.cause.toLowerCase().includes(searchText.toLowerCase())
  );

  // Severity colors
  const getSeverityColor = severity => {
    switch (severity) {
      case 'Nghiêm trọng':
        return 'red';
      case 'Cao':
        return 'orange';
      case 'Trung bình':
        return 'yellow';
      case 'Thấp':
        return 'green';
      default:
        return 'blue';
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Mã lỗi',
      dataIndex: 'code',
      key: 'code',
      width: 200,
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Tag color={getSeverityColor(record.severity)} size='small'>
            {record.severity}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 250,
    },
    {
      title: 'Nguyên nhân',
      dataIndex: 'cause',
      key: 'cause',
      width: 300,
      render: text => <Text type='warning'>{text}</Text>,
    },
    {
      title: 'Giải pháp',
      dataIndex: 'solution',
      key: 'solution',
      width: 350,
      render: text => <Text type='success'>{text}</Text>,
    },
    {
      title: 'Auto Reset',
      dataIndex: 'autoReset',
      key: 'autoReset',
      width: 100,
      render: text => (
        <Tag
          color={text === 'Có' ? 'green' : 'red'}
          icon={text === 'Có' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {text}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px 0' }}>
      <div id='4.2' style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#1890ff', marginBottom: '24px' }}>
          <ExclamationCircleOutlined style={{ marginRight: '12px' }} />
          4.2. Tổng hợp mã lỗi, nguyên nhân và cách giải quyết - TTDL Vân Canh
        </Title>
      </div>

      <Alert
        message='Hướng dẫn xử lý lỗi hệ thống'
        description='Dưới đây là tổng hợp đầy đủ các mã lỗi của SMARDT Chiller và UNIFLAIR PAC tại TTDL Vân Canh. Vui lòng thực hiện đúng trình tự xử lý và tuân thủ an toàn.'
        type='info'
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* Search */}
      <Space style={{ marginBottom: '20px' }}>
        <Input
          placeholder='Tìm kiếm mã lỗi, mô tả hoặc nguyên nhân...'
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 400 }}
        />
        <Text>Tìm thấy: {filteredCodes.length} mã lỗi</Text>
      </Space>

      {/* Error Categories */}
      <Collapse style={{ marginBottom: '24px' }}>
        <Panel header='📊 Phân loại mã lỗi theo category' key='categories'>
          <Space wrap>
            <Tag color='red'>System Pressure (3)</Tag>
            <Tag color='orange'>Temperature (3)</Tag>
            <Tag color='blue'>Electrical (3)</Tag>
            <Tag color='green'>Compressor (1)</Tag>
            <Tag color='purple'>Water Flow (2)</Tag>
            <Tag color='cyan'>Sensor (1)</Tag>
            <Tag color='magenta'>Fan (1)</Tag>
            <Tag color='gold'>System (1)</Tag>
          </Space>
        </Panel>

        <Panel header='⚠️ Quy trình xử lý sự cố' key='procedure'>
          <div>
            <Paragraph>
              <Text strong>1. Xác định mức độ nghiêm trọng:</Text>
              <ul>
                <li>
                  <Tag color='red'>Nghiêm trọng</Tag>: Tắt máy ngay lập tức, liên hệ kỹ thuật
                </li>
                <li>
                  <Tag color='orange'>Cao</Tag>: Theo dõi sát, chuẩn bị phương án
                </li>
                <li>
                  <Tag color='yellow'>Trung bình</Tag>: Xử lý trong ca, báo cáo
                </li>
                <li>
                  <Tag color='green'>Thấp</Tag>: Ghi nhận, xử lý khi có thời gian
                </li>
              </ul>
            </Paragraph>

            <Paragraph>
              <Text strong>2. Quy trình xử lý:</Text>
              <ol>
                <li>Ghi nhận thời gian, mã lỗi, điều kiện vận hành</li>
                <li>Kiểm tra Auto Reset (nếu có)</li>
                <li>Thực hiện giải pháp theo bảng hướng dẫn</li>
                <li>Theo dõi 30 phút sau xử lý</li>
                <li>Báo cáo ca trực và ghi biên bản</li>
              </ol>
            </Paragraph>
          </div>
        </Panel>
      </Collapse>

      {/* Main Error Codes Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredCodes}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mã lỗi`,
          }}
          scroll={{ x: 1200 }}
          size='small'
        />
      </Card>

      <Divider />

      {/* Emergency Contact */}
      <Alert
        message='Liên hệ khẩn cấp'
        description={
          <div>
            <p>
              <strong>Lỗi nghiêm trọng:</strong> Liên hệ ngay Trưởng ca và Kỹ thuật HVAC
            </p>
            <p>
              <strong>SMARDT Service:</strong> APC Industry - 028.3722.3600
            </p>
            <p>
              <strong>UNIFLAIR Service:</strong> Schneider Electric - 028.3823.9575
            </p>
            <p>
              <strong>24/7 Support:</strong> Hotline Data Center - 1900.xxxx
            </p>
          </div>
        }
        type='error'
        showIcon
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default ErrorCodesGuide;
