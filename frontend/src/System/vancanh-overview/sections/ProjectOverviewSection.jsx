import React from 'react';
import { Typography, Card, Table, Tag, Alert, Space, Divider, Image } from 'antd';
import { 
  InfoCircleOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  TrophyOutlined,
  PictureOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ProjectOverviewSection = () => {
  // Dữ liệu các mốc quan trọng
  const milestones = [
    {
      key: '1',
      stt: '01',
      content: 'Ký hợp đồng gói Điện',
      time: '05/2024'
    },
    {
      key: '2',
      stt: '02',
      content: 'Đóng điện trạm 02 biến áp',
      time: '12/2024'
    },
    {
      key: '3',
      stt: '03',
      content: 'Nghiệm thu PCCC với CA',
      time: '02/01/2025'
    },
    {
      key: '4',
      stt: '04',
      content: 'Nghiệm thu công trình với Sở Xây dựng',
      time: '24/02/2025'
    },
    {
      key: '5',
      stt: '05',
      content: 'Dịch chuyển DC 108 về hoạt động chính thức tại DC Vân Canh',
      time: '11/04/2025'
    }
  ];

  // Dữ liệu so sánh với tiêu chuẩn Uptime
  const uptimeComparison = [
    {
      criteria: 'Minimum Capacity Components to Support the IT Load',
      tier1: 'N',
      tier2: 'N+1',
      tier3: 'N+1',
      tier4: 'N+1 After any Failure',
      vancanh: 'N+1'
    },
    {
      criteria: 'Distribution Paths - Electrical Power Backbone',
      tier1: '1',
      tier2: '1',
      tier3: '1 Active and 1 Alternate',
      tier4: '2 Simultaneously Active',
      vancanh: '2 Simultaneously Active'
    },
    {
      criteria: 'Critical Power Distribution',
      tier1: '1',
      tier2: '1',
      tier3: '2 Simultaneously Active',
      tier4: '2 Simultaneously Active',
      vancanh: '2 Simultaneously Active'
    },
    {
      criteria: 'Concurrently Maintainable',
      tier1: 'No',
      tier2: 'No',
      tier3: 'Yes',
      tier4: 'Yes',
      vancanh: 'Yes'
    },
    {
      criteria: 'Fault Tolerance',
      tier1: 'No',
      tier2: 'No',
      tier3: 'No',
      tier4: 'Yes',
      vancanh: 'Yes'
    },
    {
      criteria: 'Compartmentalization',
      tier1: 'No',
      tier2: 'No',
      tier3: 'No',
      tier4: 'Yes',
      vancanh: 'Yes'
    }
  ];

  return (
    <div id="section-1" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <InfoCircleOutlined style={{ marginRight: '8px' }} />
        1. TỔNG QUAN DỰ ÁN TTDL VÂN CANH
      </Title>

      {/* Image placeholder từ PPTX */}
      <Card 
        title={
          <Space>
            <PictureOutlined />
            Hình ảnh dự án TTDL Vân Canh
          </Space>
        } 
        style={{ marginBottom: '20px' }}
      >
        <div style={{ textAlign: 'center' }}>
                          <img 
                  src="/vancanh-overview/project_overview_3.jpg"
                  alt="Tổng quan dự án TTDL Vân Canh"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
          <p style={{ 
            color: '#666', 
            margin: '8px 0 0 0', 
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            Hình ảnh tổng quan dự án TTDL Vân Canh (từ slide PPTX gốc)
          </p>
        </div>
      </Card>

      <div id="section-1.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <InfoCircleOutlined style={{ marginRight: '8px' }} /> 1.1 Khái quát dự án
        </Title>

        <Alert
          message="DỰ ÁN ĐƯỢC THIẾT KẾ BỞI CHUYÊN GIA COC CỦA IBM"
          description="Giám sát tác giả bởi Kyndryl. Đặt trong khuân viên trường ĐT & PTNNL tại Vân Canh."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="Thông tin dự án" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Vị trí</Tag>
              <Text>Trường Đào tạo và Phát triển Nguồn nhân lực Vietinbank</Text>
            </div>
            <div>
              <Tag color="blue">Kích thước</Tag>
              <Text>54m x 65m (rộng x sâu)</Text>
            </div>
            <div>
              <Tag color="blue">Diện tích sàn</Tag>
              <Text>952m²/tầng (34m x 28m)</Text>
            </div>
            <div>
              <Tag color="blue">Quy mô</Tag>
              <Text>3 tầng + 1 tầng mái</Text>
            </div>
            <div>
              <Tag color="blue">Tổng số phòng</Tag>
              <Text>29 phòng chức năng</Text>
            </div>
            <div>
              <Tag color="blue">Tiêu chuẩn</Tag>
              <Text>Tier 3 - Uptime / TCVN 9250:2012 mức 3</Text>
            </div>
            <div>
              <Tag color="blue">Công suất UPS</Tag>
              <Text>2500KVA (2N redundancy)</Text>
            </div>
            <div>
              <Tag color="blue">Công suất Chiller</Tag>
              <Text>540 tấn lạnh (3 x 180 tấn)</Text>
            </div>
          </Space>
        </Card>

        <Card title="Cấu trúc tòa nhà" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">Tầng 1</Tag>
              <Text>11 phòng: Điện A/B, Ác quy A/B, IPS A/B, HUD, Giám sát an ninh, PCCC, Dỡ hàng, An ninh tòa nhà</Text>
            </div>
            <div>
              <Tag color="green">Tầng 2</Tag>
              <Text>8 phòng: Máy chủ, Cơ A/B, PCCC, Tape, HUD, Staging, NOC</Text>
            </div>
            <div>
              <Tag color="green">Tầng 3</Tag>
              <Text>10 phòng: 3 phòng nghỉ, Lãnh đạo, Máy chủ dự phòng, Cơ, Pantry, Họp, Sự cố, Office</Text>
            </div>
            <div>
              <Tag color="green">Tầng mái</Tag>
              <Text>Hệ thống Chiller, đường ống nước, bể nước, quạt hút khí thải, tủ điện</Text>
            </div>
          </Space>
        </Card>

        <Card title="Hệ thống bên ngoài" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="orange">Phía sau</Tag>
              <Text>2 TBA 2500KVA (A & B), 2 Máy phát điện 2500KVA (A & B), đường điện 2 lộ</Text>
            </div>
            <div>
              <Tag color="orange">Hông trái</Tag>
              <Text>2 Tank chứa nước lạnh Chiller (40m³), 1 bể ngầm (150m³)</Text>
            </div>
            <div>
              <Tag color="orange">Hông phải</Tag>
              <Text>2 Bể dầu ngầm (15.000 lít), 2 Bồn dầu ngày (1.000 lít/bồn)</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-1.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ClockCircleOutlined style={{ marginRight: '8px' }} /> 1.2 Các mốc quan trọng
        </Title>

        <Card title="Lịch trình dự án" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={milestones}
            rowKey="key"
            columns={[
              {
                title: 'STT',
                dataIndex: 'stt',
                key: 'stt',
                width: '10%',
                render: (text) => <Tag color="blue">{text}</Tag>
              },
              {
                title: 'Nội dung',
                dataIndex: 'content',
                key: 'content',
                width: '70%'
              },
              {
                title: 'Thời gian',
                dataIndex: 'time',
                key: 'time',
                width: '20%',
                render: (text) => <Tag color="green">{text}</Tag>
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>

      <div id="section-1.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <TrophyOutlined style={{ marginRight: '8px' }} /> 1.3 So sánh với tiêu chuẩn Uptime
        </Title>

        <Alert
          message="DC VÂN CANH ĐÁP ỨNG CAO HƠN TIÊU CHUẨN UPTIME TIER III"
          description="Đạt được nhiều tiêu chí của Tier IV như Fault Tolerance và Compartmentalization."
          type="success"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title="Bảng so sánh chi tiết với tiêu chuẩn Uptime Institute" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={uptimeComparison}
            rowKey="criteria"
            columns={[
              {
                title: 'Tiêu chí',
                dataIndex: 'criteria',
                key: 'criteria',
                width: '25%',
                render: (text) => <Text strong style={{ fontSize: '12px' }}>{text}</Text>
              },
              {
                title: 'Tier I',
                dataIndex: 'tier1',
                key: 'tier1',
                width: '12%',
                render: (text) => <Tag color="red">{text}</Tag>
              },
              {
                title: 'Tier II',
                dataIndex: 'tier2',
                key: 'tier2',
                width: '12%',
                render: (text) => <Tag color="orange">{text}</Tag>
              },
              {
                title: 'Tier III',
                dataIndex: 'tier3',
                key: 'tier3',
                width: '12%',
                render: (text) => <Tag color="blue">{text}</Tag>
              },
              {
                title: 'Tier IV',
                dataIndex: 'tier4',
                key: 'tier4',
                width: '15%',
                render: (text) => <Tag color="purple">{text}</Tag>
              },
              {
                title: 'DC Vân Canh',
                dataIndex: 'vancanh',
                key: 'vancanh',
                width: '15%',
                render: (text) => <Tag color="green">{text}</Tag>
              }
            ]}
            pagination={false}
            size="small"
            bordered
            scroll={{ x: 800 }}
          />
        </Card>

        <Card title="Điểm nổi bật của TTDL Vân Canh" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">✅ Fault Tolerance</Tag>
              <Text>Đạt tiêu chuẩn Tier IV - khả năng chịu lỗi cao</Text>
            </div>
            <div>
              <Tag color="green">✅ Compartmentalization</Tag>
              <Text>Phân vùng độc lập theo tiêu chuẩn Tier IV</Text>
            </div>
            <div>
              <Tag color="green">✅ Concurrently Maintainable</Tag>
              <Text>Bảo trì đồng thời không ảnh hưởng hoạt động</Text>
            </div>
            <div>
              <Tag color="green">✅ N+1 Redundancy</Tag>
              <Text>Dự phòng N+1 cho tất cả thành phần quan trọng</Text>
            </div>
            <div>
              <Tag color="green">✅ Active-Active Distribution</Tag>
              <Text>2 đường phân phối điện hoạt động đồng thời</Text>
            </div>
          </Space>
        </Card>
      </div>

      <Divider />

      <Alert
        message="Kết luận"
        description="TTDL Vân Canh được thiết kế theo tiêu chuẩn quốc tế cao nhất, vượt trội so với yêu cầu Tier III và đạt được nhiều tiêu chí của Tier IV. Điều này đảm bảo độ tin cậy và khả năng hoạt động liên tục cao cho hệ thống CNTT của VietinBank."
        type="success"
        showIcon
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default ProjectOverviewSection;
