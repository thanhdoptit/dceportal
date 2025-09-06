import { FileTextOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider, Row, Table, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const DocumentationSection = () => {
  // Dữ liệu tiêu chuẩn Việt Nam
  const tcvnData = [
    {
      key: '1',
      code: 'TCVN 5935-1:2013',
      title: 'Cáp điện lực',
      description: 'Cáp điện lực có vỏ bọc cách điện bằng nhựa tổng hợp - Phần 1: Yêu cầu chung',
      status: 'Áp dụng',
      category: 'Cáp điện',
    },
    {
      key: '2',
      code: 'TCVN 6483:1999',
      title: 'Cáp điều khiển',
      description: 'Cáp điều khiển có vỏ bọc cách điện bằng nhựa tổng hợp',
      status: 'Áp dụng',
      category: 'Cáp điều khiển',
    },
    {
      key: '3',
      code: 'QCVN 4:2009',
      title: 'Quy chuẩn kỹ thuật quốc gia',
      description: 'Quy chuẩn kỹ thuật quốc gia về an toàn điện',
      status: 'Áp dụng',
      category: 'An toàn',
    },
    {
      key: '4',
      code: 'TCVN 5064:1999',
      title: 'Hệ thống nối đất',
      description: 'Hệ thống nối đất cho các công trình viễn thông',
      status: 'Áp dụng',
      category: 'Nối đất',
    },
  ];

  // Dữ liệu tiêu chuẩn quốc tế
  const internationalData = [
    {
      key: '1',
      code: 'IEC 60502-1',
      title: 'Cáp điện lực',
      description:
        'Power cables with extruded insulation and their accessories for rated voltages from 1 kV up to 30 kV',
      status: 'Áp dụng',
      category: 'Cáp điện',
    },
    {
      key: '2',
      code: 'BS 6387',
      title: 'Cáp chống cháy',
      description:
        'Performance requirements for cables required to maintain circuit integrity under fire conditions',
      status: 'Áp dụng',
      category: 'Chống cháy',
    },
    {
      key: '3',
      code: 'AS/NZS 5000.1',
      title: 'Cáp điện',
      description:
        'Electric cables - Polymeric insulated - For working voltages up to and including 0.6/1 kV',
      status: 'Áp dụng',
      category: 'Cáp điện',
    },
    {
      key: '4',
      code: 'IEC 60317',
      title: 'Cáp điều khiển',
      description: 'Specifications for particular types of winding wires',
      status: 'Áp dụng',
      category: 'Cáp điều khiển',
    },
  ];

  // Dữ liệu chứng nhận sản phẩm
  const certificateData = [
    {
      key: '1',
      name: 'ISO 9001:2015',
      organization: 'Tổ chức tiêu chuẩn quốc tế',
      description: 'Hệ thống quản lý chất lượng',
      validity: '3 năm',
      status: 'Có hiệu lực',
    },
    {
      key: '2',
      name: 'Chứng nhận ACIT',
      organization: 'Tổ chức chứng nhận ACIT',
      description: 'Chứng nhận thiết bị điện',
      validity: '5 năm',
      status: 'Có hiệu lực',
    },
    {
      key: '3',
      name: 'Test Certificate',
      organization: 'Phòng thí nghiệm được công nhận',
      description: 'Chứng nhận thử nghiệm sản phẩm',
      validity: '1 năm',
      status: 'Có hiệu lực',
    },
    {
      key: '4',
      name: 'CE Marking',
      organization: 'Liên minh châu Âu',
      description: 'Tuân thủ tiêu chuẩn châu Âu',
      validity: 'Vĩnh viễn',
      status: 'Có hiệu lực',
    },
  ];

  // Cột cho bảng tiêu chuẩn
  const standardColumns = [
    {
      title: 'Mã tiêu chuẩn',
      dataIndex: 'code',
      key: 'code',
      render: text => <Tag color='blue'>{text}</Tag>,
    },
    {
      title: 'Tên tiêu chuẩn',
      dataIndex: 'title',
      key: 'title',
      render: text => <Text strong>{text}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: text => <Tag color='green'>{text}</Tag>,
    },
    {
      title: 'Phân loại',
      dataIndex: 'category',
      key: 'category',
      render: text => <Tag color='orange'>{text}</Tag>,
    },
  ];

  // Cột cho bảng chứng nhận
  const certificateColumns = [
    {
      title: 'Tên chứng nhận',
      dataIndex: 'name',
      key: 'name',
      render: text => <Text strong>{text}</Text>,
    },
    {
      title: 'Tổ chức cấp',
      dataIndex: 'organization',
      key: 'organization',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hiệu lực',
      dataIndex: 'validity',
      key: 'validity',
      render: text => <Tag color='cyan'>{text}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: text => <Tag color='green'>{text}</Tag>,
    },
  ];

  return (
    <div className='content-section'>
      <Title level={2} className='section-title'>
        <FileTextOutlined /> TÀI LIỆU VÀ TIÊU CHUẨN
      </Title>

      <Paragraph className='section-description'>
        Hệ thống điện tại Trung tâm Dữ liệu Vân Canh tuân thủ các tiêu chuẩn quốc gia và quốc tế,
        đảm bảo chất lượng, an toàn và hiệu quả vận hành. Tất cả thiết bị đều có chứng nhận chất
        lượng từ các tổ chức uy tín.
      </Paragraph>

      <Divider />

      {/* Tiêu chuẩn Việt Nam */}
      <div id='section-8-1' className='subsection'>
        <Title level={3} className='subsection-title'>
          8.1. Tiêu chuẩn Việt Nam (TCVN)
        </Title>
        <Card title='Tiêu chuẩn Việt Nam (TCVN)' className='subsection'>
          <Alert
            message='Tuân thủ tiêu chuẩn quốc gia'
            description='Hệ thống điện được thiết kế và thi công theo các tiêu chuẩn Việt Nam hiện hành'
            type='success'
            showIcon
          />

          <Divider />

          <Table
            dataSource={tcvnData}
            columns={standardColumns}
            pagination={false}
            size='small'
            className='standard-table'
          />

          <Divider />

          <Title level={4}>Các tiêu chuẩn TCVN chính áp dụng</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card size='small' title='TCVN 5935-1:2013' className='subsection'>
                <Paragraph>
                  <Text strong>Phạm vi:</Text> Cáp điện lực có vỏ bọc cách điện bằng nhựa tổng hợp
                </Paragraph>
                <Paragraph>
                  <Text strong>Điện áp:</Text> Từ 1 kV đến 30 kV
                </Paragraph>
                <Paragraph>
                  <Text strong>Ứng dụng:</Text> Hệ thống phân phối điện, trạm biến áp
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card size='small' title='QCVN 4:2009' className='subsection'>
                <Paragraph>
                  <Text strong>Phạm vi:</Text> Quy chuẩn kỹ thuật quốc gia về an toàn điện
                </Paragraph>
                <Paragraph>
                  <Text strong>Yêu cầu:</Text> An toàn cho người và thiết bị
                </Paragraph>
                <Paragraph>
                  <Text strong>Ứng dụng:</Text> Thiết kế, lắp đặt, vận hành hệ thống điện
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>

      <Divider />

      {/* Tiêu chuẩn quốc tế */}
      <div id='section-8-2' className='subsection'>
        <Title level={3} className='subsection-title'>
          8.2. Tiêu chuẩn quốc tế
        </Title>
        <Card title='Tiêu chuẩn quốc tế' className='subsection'>
          <Alert
            message='Tuân thủ tiêu chuẩn quốc tế'
            description='Hệ thống điện được thiết kế theo các tiêu chuẩn IEC, BS, AS/NZS được công nhận toàn cầu'
            type='info'
            showIcon
          />

          <Divider />

          <Table
            dataSource={internationalData}
            columns={standardColumns}
            pagination={false}
            size='small'
            className='standard-table'
          />

          <Divider />

          <Title level={4}>Các tiêu chuẩn quốc tế chính</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card size='small' title='IEC 60502-1' className='subsection'>
                <Paragraph>
                  <Text strong>Phạm vi:</Text> Cáp điện lực cách điện đùn
                </Paragraph>
                <Paragraph>
                  <Text strong>Điện áp:</Text> 1 kV đến 30 kV
                </Paragraph>
                <Paragraph>
                  <Text strong>Ứng dụng:</Text> Hệ thống phân phối điện
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card size='small' title='BS 6387' className='subsection'>
                <Paragraph>
                  <Text strong>Phạm vi:</Text> Yêu cầu hiệu suất cáp chống cháy
                </Paragraph>
                <Paragraph>
                  <Text strong>Mục đích:</Text> Duy trì tính toàn vẹn mạch điện khi có cháy
                </Paragraph>
                <Paragraph>
                  <Text strong>Ứng dụng:</Text> Hệ thống điện khẩn cấp
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card size='small' title='AS/NZS 5000.1' className='subsection'>
                <Paragraph>
                  <Text strong>Phạm vi:</Text> Cáp điện cách điện polyme
                </Paragraph>
                <Paragraph>
                  <Text strong>Điện áp:</Text> Đến 0.6/1 kV
                </Paragraph>
                <Paragraph>
                  <Text strong>Ứng dụng:</Text> Hệ thống điện hạ thế
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>

      <Divider />

      {/* Chứng nhận sản phẩm */}
      <div id='section-8-3' className='subsection'>
        <Title level={3} className='subsection-title'>
          8.3. Chứng nhận sản phẩm
        </Title>
        <Card title='Chứng nhận sản phẩm' className='subsection'>
          <Alert
            message='Chứng nhận chất lượng từ tổ chức uy tín'
            description='Tất cả thiết bị sử dụng trong hệ thống đều có chứng nhận chất lượng từ các tổ chức được công nhận'
            type='success'
            showIcon
          />

          <Divider />

          <Table
            dataSource={certificateData}
            columns={certificateColumns}
            pagination={false}
            size='small'
            className='certificate-table'
          />

          <Divider />

          <Title level={4}>Các loại chứng nhận chính</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card size='small' title='ISO 9001:2015' className='subsection'>
                <Paragraph>
                  <Text strong>Phạm vi:</Text> Hệ thống quản lý chất lượng
                </Paragraph>
                <Paragraph>
                  <Text strong>Yêu cầu:</Text> Quy trình sản xuất, kiểm soát chất lượng
                </Paragraph>
                <Paragraph>
                  <Text strong>Lợi ích:</Text> Đảm bảo chất lượng sản phẩm ổn định
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card size='small' title='Chứng nhận ACIT' className='subsection'>
                <Paragraph>
                  <Text strong>Phạm vi:</Text> Thiết bị điện và điện tử
                </Paragraph>
                <Paragraph>
                  <Text strong>Yêu cầu:</Text> An toàn điện, tương thích điện từ
                </Paragraph>
                <Paragraph>
                  <Text strong>Lợi ích:</Text> Đảm bảo an toàn cho người sử dụng
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>

      <Divider />

      {/* Tài liệu kỹ thuật */}
      <div id='section-8-4' className='subsection'>
        <Title level={3} className='subsection-title'>
          8.4. Tài liệu kỹ thuật
        </Title>
        <Card title='Tài liệu kỹ thuật' className='subsection'>
          <Title level={4}>Các loại tài liệu có sẵn</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card size='small' title='Bản vẽ kỹ thuật' className='subsection'>
                <ul>
                  <li>Sơ đồ đơn tuyến hệ thống điện</li>
                  <li>Bản vẽ bố trí thiết bị</li>
                  <li>Bản vẽ chi tiết tủ điện</li>
                  <li>Bản vẽ hệ thống cáp</li>
                  <li>Bản vẽ hệ thống tiếp địa</li>
                </ul>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card size='small' title='Hướng dẫn vận hành' className='subsection'>
                <ul>
                  <li>Quy trình khởi động hệ thống</li>
                  <li>Quy trình vận hành bình thường</li>
                  <li>Quy trình xử lý sự cố</li>
                  <li>Quy trình bảo trì định kỳ</li>
                  <li>Quy trình test hệ thống dự phòng</li>
                </ul>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card size='small' title='Tài liệu bảo trì' className='subsection'>
                <ul>
                  <li>Lịch bảo trì định kỳ</li>
                  <li>Quy trình bảo trì thiết bị</li>
                  <li>Danh mục vật tư thay thế</li>
                  <li>Biểu mẫu ghi chép bảo trì</li>
                  <li>Báo cáo bảo trì</li>
                </ul>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Title level={4}>Cập nhật tài liệu</Title>
          <Alert
            message='Tài liệu được cập nhật thường xuyên'
            description='Tài liệu kỹ thuật được cập nhật theo tiến độ dự án và các thay đổi trong hệ thống'
            type='info'
            showIcon
          />
        </Card>
      </div>

      <Divider />

      {/* Lưu ý quan trọng */}
      <div id='section-8-5' className='subsection'>
        <Title level={3} className='subsection-title'>
          8.5. Lưu ý quan trọng
        </Title>
        <Card title='Lưu ý quan trọng' className='subsection'>
          <Alert
            message='Tuân thủ tiêu chuẩn và quy định'
            description='Việc tuân thủ các tiêu chuẩn và quy định là bắt buộc để đảm bảo an toàn và hiệu quả vận hành hệ thống điện'
            type='warning'
            showIcon
          />

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Title level={4}>Trách nhiệm</Title>
              <ul>
                <li>Nhà thầu phải tuân thủ đầy đủ các tiêu chuẩn</li>
                <li>Giám sát phải kiểm tra việc tuân thủ</li>
                <li>Chủ đầu tư phải đảm bảo tuân thủ</li>
                <li>Vận hành phải theo đúng quy trình</li>
              </ul>
            </Col>

            <Col xs={24} lg={12}>
              <Title level={4}>Kiểm tra và nghiệm thu</Title>
              <ul>
                <li>Kiểm tra theo tiêu chuẩn thiết kế</li>
                <li>Nghiệm thu theo quy định</li>
                <li>Ghi chép đầy đủ quá trình</li>
                <li>Lưu trữ tài liệu theo quy định</li>
              </ul>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default DocumentationSection;
