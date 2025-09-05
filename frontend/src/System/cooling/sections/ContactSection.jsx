import { PhoneOutlined } from '@ant-design/icons';
import { Alert, Card, Table, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const ContactSection = () => {
  return (
    <section id="section-5" className="content-section">
      <Title level={2} style={{ color: '#1890ff', marginBottom: '24px' }}>
        <PhoneOutlined style={{ marginRight: '12px' }} />
        5. LIÊN HỆ - TTDL Hòa Lạc
      </Title>

      {/*     <Card title="Thông tin liên hệ chính" style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Alert
              message="Phòng Kỹ thuật"
              description={
                <div>
                  <Paragraph style={{ marginBottom: '4px' }}>
                    <PhoneOutlined /> <Text strong>Điện thoại:</Text> 024-xxxx-xxxx
                  </Paragraph>
                  <Paragraph style={{ marginBottom: '4px' }}>
                    <MailOutlined /> <Text strong>Email:</Text> kythuat@vietinbank.vn
                  </Paragraph>
                  <Paragraph>
                    <EnvironmentOutlined /> <Text strong>Địa chỉ:</Text> TTDL Hòa Lạc, Thạch Thất, Hà Nội
                  </Paragraph>
                </div>
              }
              type="info"
              showIcon
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Alert
              message="Bộ phận Bảo trì"
              description={
                <div>
                  <Paragraph style={{ marginBottom: '4px' }}>
                    <PhoneOutlined /> <Text strong>Điện thoại:</Text> 024-xxxx-xxxx
                  </Paragraph>
                  <Paragraph style={{ marginBottom: '4px' }}>
                    <MailOutlined /> <Text strong>Email:</Text> baotri@vietinbank.vn
                  </Paragraph>
                  <Paragraph>
                    <TeamOutlined /> <Text strong>Phụ trách:</Text> Kỹ thuật viên bảo trì
                  </Paragraph>
                </div>
              }
              type="warning"
              showIcon
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Alert
              message="Hỗ trợ khẩn cấp"
              description={
                <div>
                  <Paragraph style={{ marginBottom: '4px' }}>
                    <PhoneOutlined /> <Text strong>Hotline:</Text> 1900-xxxx
                  </Paragraph>
                  <Paragraph style={{ marginBottom: '4px' }}>
                    <MailOutlined /> <Text strong>Email:</Text> emergency@vietinbank.vn
                  </Paragraph>
                  <Paragraph>
                    <UserOutlined /> <Text strong>Phụ trách:</Text> Trưởng ca trực
                  </Paragraph>
                </div>
              }
              type="error"
              showIcon
            />
          </Col>
        </Row>
      </Card> */}

      <Card title="Thông tin nhà thầu và người phụ trách theo thiết bị" style={{ marginBottom: '20px' }}>
        <Table
          dataSource={[
            {
              key: '1',
              device: 'TDAV1321A',
              company: 'Công ty cổ phần tư vấn và đầu tư South Street',
              contact: 'South Street: Vũ Hải Phong',
              email: 'DungVV@SouthStreet.vn',
              phone: '0918682829',
              status: 'Đang bảo trì'
            },
            {
              key: '2',
              device: 'TDAV2842A',
              company: 'Công ty cổ phần tư vấn và đầu tư South Street',
              contact: 'South Street: Vũ Hải Phong',
              email: 'DungVV@SouthStreet.vn',
              phone: '0918682829',
              status: 'Đang bảo trì'
            },
            {
              key: '3',
              device: 'TDAV2242A',
              company: 'Công ty cổ phần phát triển công nghệ viễn thông tin học Sun Việt',
              contact: 'Nguyễn Tiến Dũng, Phan Mai Đức, Nguyễn Hoàng Diệu',
              email: 'hanh.nh@svtech.com.vn',
              phone: '0364014203',
              status: 'Sau 07/09/2025'
            },
            {
              key: '4',
              device: 'TDAV2242A (Trước 07/09/2025)',
              company: 'Công ty cổ phần phát triển công nghệ viễn thông tin học Sun Việt',
              contact: 'Lê Tuấn Hoàng',
              email: 'hanh.nh@svtech.com.vn',
              phone: '0936111426',
              status: 'Trước 07/09/2025'
            },
            {
              key: '5',
              device: 'FM40H-AGB-ESD (FM01-03)',
              company: 'Công ty cổ phần ứng dụng khoa học và công nghệ MITEC',
              contact: 'MITEC: Nguyễn Hải Sơn',
              email: '-',
              phone: '-',
              status: 'Đã hết hạn bảo trì'
            },
            {
              key: '6',
              device: 'FM40H-AGB-ESD (FM04-05)',
              company: 'Liên danh Sun Việt-HDL',
              contact: 'Đỗ Hồng Hải, Nguyễn Quang Minh',
              email: 'hanh.nh@svtech.com.vn',
              phone: '0364014203',
              status: 'Đang bảo trì'
            },
            {
              key: '7',
              device: 'ACRP102',
              company: 'Công ty cổ phần tư vấn và đầu tư South Street',
              contact: 'South Street: Vũ Hải Phong',
              email: 'DungVV@SouthStreet.vn',
              phone: '0918682829',
              status: 'Đang bảo trì'
            },
            {
              key: '8',
              device: 'AFM4500B (AF01-04)',
              company: 'Công ty cổ phần phát triển công nghệ viễn thông tin học Sun Việt',
              contact: 'Nguyễn Tiến Dũng, Phan Mai Đức, Nguyễn Hoàng Diệu',
              email: 'hanh.nh@svtech.com.vn',
              phone: '0364014203',
              status: 'Sau 07/09/2025'
            },
            {
              key: '9',
              device: 'AFM4500B (AF01-04) (Trước 07/09/2025)',
              company: 'Công ty cổ phần phát triển công nghệ viễn thông tin học Sun Việt',
              contact: 'Lê Tuấn Hoàng',
              email: 'hanh.nh@svtech.com.vn',
              phone: '0936111426',
              status: 'Trước 07/09/2025'
            },
            {
              key: '10',
              device: 'AFM4500B (AF05-10)',
              company: 'Công ty cổ phần tư vấn và đầu tư South Street',
              contact: 'South Street: Vũ Hải Phong',
              email: 'DungVV@SouthStreet.vn',
              phone: '0918682829',
              status: 'Đang bảo trì'
            }
          ]}
          columns={[
            {
              title: 'Tên thiết bị',
              dataIndex: 'device',
              key: 'device',
              width: '18%',
              render: (text) => <Tag color="blue">{text}</Tag>
            },
            {
              title: 'Công ty / Nhà thầu',
              dataIndex: 'company',
              key: 'company',
              width: '25%',
              render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
            },
            {
              title: 'Người phụ trách',
              dataIndex: 'contact',
              key: 'contact',
              width: '20%',
              render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
              width: '15%',
              render: (text) => <Text style={{ fontSize: '10px' }}>{text}</Text>
            },
            {
              title: 'Số điện thoại',
              dataIndex: 'phone',
              key: 'phone',
              width: '12%',
              render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              key: 'status',
              width: '10%',
              render: (text) => {
                let color = 'green';
                if (text.includes('hết hạn')) color = 'red';
                if (text.includes('Trước')) color = 'orange';
                return <Tag color={color}>{text}</Tag>;
              }
            }
          ]}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thiết bị`
          }}
          size="small"
          bordered
        />
      </Card>

      <Card title="Danh sách nhân viên phụ trách hệ thống làm mát" style={{ marginBottom: '20px' }}>
        <Table
          dataSource={[

            {
              key: '1',
              name: 'Nguyễn Trần Hòa',
              position: 'Chuyên Viên Cao Cấp',
              phone: '091-xxxx-xxxx',
              email: 'nguyentranhoa@vietinbank.vn',
            },

          ]}
          columns={[
            {
              title: 'Họ và tên',
              dataIndex: 'name',
              key: 'name',
              width: '20%',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Chức vụ',
              dataIndex: 'position',
              key: 'position',
              width: '20%',
              render: (text) => <Tag color="blue">{text}</Tag>
            },
            {
              title: 'Điện thoại',
              dataIndex: 'phone',
              key: 'phone',
              width: '15%',
              render: (text) => <Text>{text}</Text>
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
              width: '25%',
              render: (text) => <Text style={{ fontSize: '11px' }}>{text}</Text>
            },
          ]}
          pagination={false}
          size="small"
          bordered
        />
      </Card>

      <Card title="Quy trình liên hệ khẩn cấp" style={{ marginBottom: '20px' }}>
        <Alert
          message="Khi có sự cố nghiêm trọng với hệ thống làm mát"
          description={
            <div>
              <ol>
                <li>Quy trình 1</li>
                <li>Quy trình 2</li>
                <li>Quy trình 3</li>
                <li>Quy trình 4</li>
                <li>Quy trình 5</li>
              </ol>
            </div>
          }
          type="error"
          showIcon
        />
      </Card>
    </section>
  );
};

export default ContactSection;
