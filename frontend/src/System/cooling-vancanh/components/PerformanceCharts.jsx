import React, { useState } from 'react';
import { Typography, Card, Table, Alert, Tag, Space, Tabs, Divider } from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  InfoCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const PerformanceCharts = () => {
  // SMARDT Performance Data từ tài liệu APC
  const smartdPerformanceData = [
    { key: '1', load: '100%', capacity: '632.0', cop: '3.238', power: '194.6', chwr: '16.00', chws: '10.00', ambTemp: '43.0', sound: '69.00' },
    { key: '2', load: '90%', capacity: '568.0', cop: '3.895', power: '145.8', chwr: '15.41', chws: '10.00', ambTemp: '38.6', sound: '68.90' },
    { key: '3', load: '80%', capacity: '505.0', cop: '4.597', power: '109.8', chwr: '14.80', chws: '10.00', ambTemp: '34.3', sound: '66.90' },
    { key: '4', load: '75%', capacity: '474.0', cop: '5.001', power: '94.78', chwr: '14.51', chws: '10.00', ambTemp: '32.1', sound: '66.20' },
    { key: '5', load: '70%', capacity: '442.0', cop: '5.457', power: '80.99', chwr: '14.21', chws: '10.00', ambTemp: '29.9', sound: '65.60' },
    { key: '6', load: '60%', capacity: '379.0', cop: '6.587', power: '57.54', chwr: '13.61', chws: '10.00', ambTemp: '25.6', sound: '65.20' },
    { key: '7', load: '50%', capacity: '316.0', cop: '8.318', power: '37.99', chwr: '13.01', chws: '10.00', ambTemp: '21.2', sound: '63.60' },
    { key: '8', load: '40%', capacity: '252.01', cop: '11.14', power: '22.63', chwr: '12.40', chws: '10.00', ambTemp: '16.8', sound: '63.10' },
    { key: '9', load: '30%', capacity: '188.99', cop: '14.18', power: '13.33', chwr: '11.80', chws: '10.00', ambTemp: '13.0', sound: '60.60' },
    { key: '10', load: '25%', capacity: '157.99', cop: '14.80', power: '10.68', chwr: '11.50', chws: '10.00', ambTemp: '13.0', sound: '59.90' },
    { key: '11', load: '20%', capacity: '126.00', cop: '14.25', power: '8.842', chwr: '11.20', chws: '10.00', ambTemp: '13.0', sound: '59.20' },
    { key: '12', load: '10%', capacity: '63.00', cop: '9.608', power: '6.557', chwr: '10.60', chws: '10.00', ambTemp: '13.0', sound: '57.30' }
  ];

  // UNIFLAIR LDCV Performance Data
  const ldcvPerformanceData = [
    { key: '1', model: 'LDCV0600A', netCapacity: '16.8', totalCapacity: '17.6', shr: '97.9', eer: '38.6', flowRate: '5950', pressure: '509', sound: '48.4' },
    { key: '2', model: 'LDCV1800A', netCapacity: '64.4', totalCapacity: '68.2', shr: '94.5', eer: '35.2', flowRate: '18500', pressure: '650', sound: '52.1' },
    { key: '3', model: 'LDCV3400A', netCapacity: '79.8', totalCapacity: '84.6', shr: '94.3', eer: '33.8', flowRate: '24800', pressure: '720', sound: '54.3' },
    { key: '4', model: 'LDCV4300A', netCapacity: '110.0', totalCapacity: '116.5', shr: '94.4', eer: '32.1', flowRate: '35200', pressure: '850', sound: '56.8' }
  ];

  // Sound Analysis Data
  const soundAnalysisData = [
    { key: '1', frequency: '63 Hz', smardt100: '46.7', smardt75: '44.2', smardt50: '41.8', smardt25: '38.5' },
    { key: '2', frequency: '125 Hz', smardt100: '48.7', smardt75: '46.1', smardt50: '43.4', smardt25: '40.2' },
    { key: '3', frequency: '250 Hz', smardt100: '54.7', smardt75: '52.8', smardt50: '49.6', smardt25: '46.1' },
    { key: '4', frequency: '500 Hz', smardt100: '61.5', smardt75: '59.2', smardt50: '56.8', smardt25: '53.4' },
    { key: '5', frequency: '1000 Hz', smardt100: '65.2', smardt75: '62.9', smardt50: '60.1', smardt25: '56.8' },
    { key: '6', frequency: '2000 Hz', smardt100: '62.7', smardt75: '60.4', smardt50: '57.9', smardt25: '54.6' },
    { key: '7', frequency: '4000 Hz', smardt100: '58.7', smardt75: '56.3', smardt50: '54.1', smardt25: '51.2' },
    { key: '8', frequency: '8000 Hz', smardt100: '55.8', smardt75: '53.4', smardt50: '51.0', smardt25: '48.3' }
  ];

  return (
    <div style={{ padding: '20px 0' }}>
      <div id="4.5" style={{ scrollMarginTop: '20px' }}>
        <Title level={3} style={{ color: '#1890ff', marginBottom: '24px' }}>
          <BarChartOutlined style={{ marginRight: '12px' }} />
          4.5. Biểu đồ hiệu suất và phân tích kỹ thuật - TTDL Vân Canh
        </Title>
      </div>

      <Alert
        message="Dữ liệu hiệu suất chính thức"
        description="Các biểu đồ và bảng số liệu dưới đây được trích xuất từ tài liệu kỹ thuật chính thức của các nhà sản xuất: APC Industry (SMARDT) và Schneider Electric (UNIFLAIR)."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Tabs defaultActiveKey="1">
        <TabPane tab="SMARDT Chiller Performance" key="1">
          <Card>
            <Title level={4} style={{ color: '#52c41a', marginBottom: '16px' }}>
              <ThunderboltOutlined style={{ marginRight: '8px' }} />
              SMARDT AE054.2B.F2HAJA.A010DX.E10 - Performance Curves
            </Title>
            
            <Alert
              message="Điều kiện thiết kế"
              description="Evap: 16.00/10.00°C - Condenser: 43.0°C - Flow rate: 25.1 L/s - Ambient: 43°C dry bulb"
              type="success"
              showIcon
              style={{ marginBottom: '20px' }}
            />

            <Table
              dataSource={smartdPerformanceData}
              columns={[
                {
                  title: 'Tải (%)',
                  dataIndex: 'load',
                  key: 'load',
                  width: '8%',
                  render: (text) => <Tag color="blue">{text}</Tag>
                },
                {
                  title: 'Capacity (kWr)',
                  dataIndex: 'capacity',
                  key: 'capacity',
                  width: '12%',
                  render: (text) => <Text strong>{text}</Text>
                },
                {
                  title: 'COP',
                  dataIndex: 'cop',
                  key: 'cop',
                  width: '10%',
                  render: (text) => {
                    const copValue = parseFloat(text);
                    let color = 'green';
                    if (copValue < 5) color = 'orange';
                    if (copValue < 3) color = 'red';
                    return <Tag color={color}>{text}</Tag>
                  }
                },
                {
                  title: 'Power (kW)',
                  dataIndex: 'power',
                  key: 'power',
                  width: '10%'
                },
                {
                  title: 'CHWR (°C)',
                  dataIndex: 'chwr',
                  key: 'chwr',
                  width: '10%'
                },
                {
                  title: 'CHWS (°C)',
                  dataIndex: 'chws',
                  key: 'chws',
                  width: '10%'
                },
                {
                  title: 'Amb Temp (°C)',
                  dataIndex: 'ambTemp',
                  key: 'ambTemp',
                  width: '12%'
                },
                {
                  title: 'Sound dB(A)',
                  dataIndex: 'sound',
                  key: 'sound',
                  width: '12%',
                  render: (text) => {
                    const soundLevel = parseFloat(text);
                    let color = 'green';
                    if (soundLevel > 65) color = 'orange';
                    if (soundLevel > 68) color = 'red';
                    return <Tag color={color}>{text}</Tag>
                  }
                }
              ]}
              pagination={false}
              size="small"
              bordered
              scroll={{ x: 800 }}
            />

            <Divider />

            <div style={{ marginTop: '20px' }}>
              <Title level={5} style={{ color: '#595959' }}>Phân tích hiệu suất:</Title>
              <Space direction="vertical" size="small">
                <Text>• <strong>COP tối ưu:</strong> 14.80 tại tải 25% (tiết kiệm năng lượng tối đa)</Text>
                <Text>• <strong>COP full load:</strong> 3.238 tại tải 100% (điều kiện thiết kế)</Text>
                <Text>• <strong>Vùng vận hành tối ưu:</strong> 40-75% tải (COP 5.0-11.14)</Text>
                <Text>• <strong>Sound level:</strong> Giảm từ 69.0 dB(A) xuống 57.3 dB(A) theo tải</Text>
                <Text>• <strong>Công suất tiêu thụ:</strong> Từ 194.6 kW (100%) xuống 6.557 kW (10%)</Text>
              </Space>
            </div>
          </Card>
        </TabPane>

        <TabPane tab="UNIFLAIR PAC Performance" key="2">
          <Card>
            <Title level={4} style={{ color: '#52c41a', marginBottom: '16px' }}>
              <LineChartOutlined style={{ marginRight: '8px' }} />
              UNIFLAIR LDCV Series - Performance Data
            </Title>
            
            <Alert
              message="Điều kiện thiết kế UNIFLAIR"
              description="Dry bulb: 25°C, Wet bulb: 17.9°C, Chilled water: 10/16°C, External static: 20 Pa"
              type="success"
              showIcon
              style={{ marginBottom: '20px' }}
            />

            <Table
              dataSource={ldcvPerformanceData}
              columns={[
                {
                  title: 'Model',
                  dataIndex: 'model',
                  key: 'model',
                  width: '15%',
                  render: (text) => <Tag color="purple">{text}</Tag>
                },
                {
                  title: 'Net Capacity (kW)',
                  dataIndex: 'netCapacity',
                  key: 'netCapacity',
                  width: '15%',
                  render: (text) => <Text strong>{text}</Text>
                },
                {
                  title: 'Total Capacity (kW)',
                  dataIndex: 'totalCapacity',
                  key: 'totalCapacity',
                  width: '15%'
                },
                {
                  title: 'SHR (%)',
                  dataIndex: 'shr',
                  key: 'shr',
                  width: '10%',
                  render: (text) => <Tag color="green">{text}</Tag>
                },
                {
                  title: 'EER',
                  dataIndex: 'eer',
                  key: 'eer',
                  width: '10%',
                  render: (text) => <Tag color="gold">{text}</Tag>
                },
                {
                  title: 'Flow Rate (m³/h)',
                  dataIndex: 'flowRate',
                  key: 'flowRate',
                  width: '15%'
                },
                {
                  title: 'Max Pressure (Pa)',
                  dataIndex: 'pressure',
                  key: 'pressure',
                  width: '15%'
                },
                {
                  title: 'Sound dB(A)',
                  dataIndex: 'sound',
                  key: 'sound',
                  width: '15%',
                  render: (text) => <Tag color="cyan">{text}</Tag>
                }
              ]}
              pagination={false}
              size="small"
              bordered
            />

            <div style={{ marginTop: '20px' }}>
              <Title level={5} style={{ color: '#595959' }}>Đặc điểm kỹ thuật UNIFLAIR:</Title>
              <Space direction="vertical" size="small">
                <Text>• <strong>LDCV0600A:</strong> 16.8kW - Phòng server nhỏ, EER cao nhất 38.6</Text>
                <Text>• <strong>LDCV1800A:</strong> 64.4kW - Phòng server trung bình</Text>
                <Text>• <strong>LDCV3400A:</strong> 79.8kW - Phòng server lớn</Text>
                <Text>• <strong>LDCV4300A:</strong> 110.0kW - Phòng server rất lớn</Text>
                <Text>• <strong>SHR:</strong> 94-98% (tỷ lệ nhiệt hiển cao, phù hợp IT load)</Text>
              </Space>
            </div>
          </Card>
        </TabPane>

        <TabPane tab="Sound Analysis" key="3">
          <Card>
            <Title level={4} style={{ color: '#52c41a', marginBottom: '16px' }}>
              <InfoCircleOutlined style={{ marginRight: '8px' }} />
              SMARDT Sound Frequency Analysis @ 1m
            </Title>

            <Table
              dataSource={soundAnalysisData}
              columns={[
                {
                  title: 'Frequency',
                  dataIndex: 'frequency',
                  key: 'frequency',
                  width: '15%',
                  render: (text) => <Tag color="blue">{text}</Tag>
                },
                {
                  title: '100% Load',
                  dataIndex: 'smardt100',
                  key: 'smardt100',
                  width: '20%',
                  render: (text) => <Text strong>{text} dB</Text>
                },
                {
                  title: '75% Load',
                  dataIndex: 'smardt75',
                  key: 'smardt75',
                  width: '20%',
                  render: (text) => <Text>{text} dB</Text>
                },
                {
                  title: '50% Load',
                  dataIndex: 'smardt50',
                  key: 'smardt50',
                  width: '20%',
                  render: (text) => <Text>{text} dB</Text>
                },
                {
                  title: '25% Load',
                  dataIndex: 'smardt25',
                  key: 'smardt25',
                  width: '20%',
                  render: (text) => <Text type="success">{text} dB</Text>
                }
              ]}
              pagination={false}
              size="small"
              bordered
            />

            <div style={{ marginTop: '20px' }}>
              <Title level={5} style={{ color: '#595959' }}>Phân tích tần số âm thanh:</Title>
              <Space direction="vertical" size="small">
                <Text>• <strong>Tần số cao nhất:</strong> 1000 Hz (65.2 dB @ 100% load)</Text>
                <Text>• <strong>Tần số thấp nhất:</strong> 63 Hz (46.7 dB @ 100% load)</Text>
                <Text>• <strong>Giảm âm theo tải:</strong> ~7-8 dB khi giảm từ 100% xuống 25%</Text>
                <Text>• <strong>Tần số ảnh hưởng nhiều:</strong> 500-2000 Hz (phạm vi nghe rõ nhất)</Text>
                <Text>• <strong>Khuyến nghị:</strong> Vận hành &lt;75% load để giảm tiếng ồn</Text>
              </Space>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      <Divider />

      <Alert
        message="Khuyến nghị vận hành tối ưu"
        description={
          <div>
            <p><strong>SMARDT Chiller:</strong> Vận hành ở 40-60% tải để đạt COP cao (6.5-8.3) và giảm tiếng ồn.</p>
            <p><strong>UNIFLAIR PAC:</strong> Sử dụng nhiều unit nhỏ thay vì ít unit lớn để tăng độ dự phòng.</p>
            <p><strong>Tổng thể:</strong> Load balancing giữa các thiết bị để tối ưu hiệu suất và tuổi thọ.</p>
          </div>
        }
        type="success"
        showIcon
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default PerformanceCharts;