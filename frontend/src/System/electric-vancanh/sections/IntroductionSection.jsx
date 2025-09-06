import { InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const IntroductionSection = () => {
  return (
    <div className='content-section'>
      <Title level={2} className='section-title'>
        <InfoCircleOutlined /> GIỚI THIỆU CHUNG HỆ THỐNG ĐIỆN
      </Title>

      <Paragraph className='section-description'>
        Hệ thống điện tại Trung tâm Dữ liệu Vân Canh - VietinBank được thiết kế theo tiêu chuẩn quốc
        tế với khả năng cung cấp điện liên tục 24/7, đảm bảo hoạt động ổn định cho các thiết bị IT
        và hệ thống điều hòa không khí.
      </Paragraph>

      <Divider />

      {/* Sơ đồ đơn tuyến hệ thống điện */}
      <div id='section-1-1' className='subsection'>
        <Title level={3} className='subsection-title'>
          1.1. Sơ đồ đơn tuyến hệ thống điện
        </Title>
        <Card title='Sơ đồ đơn tuyến hệ thống điện' className='subsection'>
          <Alert
            message='Cấu trúc hệ thống điện chính'
            description='Hệ thống sử dụng 2 nguồn lưới từ 2 trạm biến áp độc lập với khả năng chuyển đổi tự động'
            type='info'
            showIcon
          />

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Title level={4}>Nguồn điện chính</Title>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Tag color='green'>Trạm biến áp A: 22kV/0.4kV</Tag>
                <Tag color='green'>Trạm biến áp B: 22kV/0.4kV</Tag>
                <Tag color='blue'>ACB 4000A tại mỗi trạm</Tag>
                <Tag color='orange'>Hệ thống ATS tự động</Tag>
              </Space>
            </Col>

            <Col xs={24} lg={12}>
              <Title level={4}>Hệ thống dự phòng</Title>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Tag color='red'>Máy phát điện 1: Diesel</Tag>
                <Tag color='red'>Máy phát điện 2: Diesel</Tag>
                <Tag color='purple'>UPS với ắc quy</Tag>
                <Tag color='cyan'>Hệ thống chuyển đổi tự động</Tag>
              </Space>
            </Col>
          </Row>

          <Divider />

          <Title level={4}>Sơ đồ đơn tuyến</Title>
          <Paragraph>Hệ thống điện được thiết kế với sơ đồ đơn tuyến rõ ràng, thể hiện:</Paragraph>
          <ul>
            <li>Đường dây cấp nguồn từ 2 trạm biến áp</li>
            <li>Hệ thống tủ điện hạ thế (MainLT A và B)</li>
            <li>Hệ thống chuyển đổi nguồn tự động (Tie Breaker)</li>
            <li>Hệ thống máy phát dự phòng</li>
            <li>Hệ thống UPS và ắc quy</li>
            <li>Hệ thống phân phối đến các tải</li>
          </ul>
        </Card>
      </div>

      <Divider />

      {/* Cấu trúc tổng quan hệ thống */}
      <div id='section-1-2' className='subsection'>
        <Title level={3} className='subsection-title'>
          1.2. Cấu trúc tổng quan hệ thống
        </Title>
        <Card title='Cấu trúc tổng quan hệ thống' className='subsection '>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card size='small' title='Phòng điện A' className='subsection card-blue'>
                <ul>
                  <li>Tủ MainLT A</li>
                  <li>Hệ thống chiếu sáng</li>
                  <li>Hệ thống ổ cắm</li>
                  <li>Hệ thống Exit & Emergency</li>
                  <li>UPS Output</li>
                </ul>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card size='small' title='Phòng điện B' className='subsection card-blue'>
                <ul>
                  <li>Tủ MainLT B</li>
                  <li>Hệ thống chiếu sáng</li>
                  <li>Hệ thống ổ cắm</li>
                  <li>Hệ thống Exit & Emergency</li>
                  <li>UPS Output</li>
                </ul>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card size='small' title='Hệ thống chung' className='subsection card-blue'>
                <ul>
                  <li>Máy phát điện</li>
                  <li>Hệ thống ATS</li>
                  <li>Hệ thống giám sát</li>
                  <li>Hệ thống bảo vệ</li>
                  <li>Hệ thống tiếp địa</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>

      <Divider />

      {/* Thông số kỹ thuật chung */}
      <div id='section-1-3' className='subsection'>
        <Title level={3} className='subsection-title'>
          1.3. Thông số kỹ thuật chung
        </Title>
        <Card title='Thông số kỹ thuật chung' className='subsection'>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Title level={4}>Thông số điện lưới</Title>
              <ul>
                <li>
                  <Text strong>Điện áp lưới:</Text> 22kV
                </li>
                <li>
                  <Text strong>Điện áp hạ thế:</Text> 400V/230V
                </li>
                <li>
                  <Text strong>Tần số:</Text> 50Hz
                </li>
                <li>
                  <Text strong>Công suất tổng:</Text> Theo thiết kế
                </li>
              </ul>
            </Col>

            <Col xs={24} lg={12}>
              <Title level={4}>Thông số máy phát</Title>
              <ul>
                <li>
                  <Text strong>Loại nhiên liệu:</Text> Diesel
                </li>
                <li>
                  <Text strong>Công suất:</Text> Theo thiết kế
                </li>
                <li>
                  <Text strong>Điện áp:</Text> 400V/230V
                </li>
                <li>
                  <Text strong>Khởi động:</Text> Tự động
                </li>
              </ul>
            </Col>
          </Row>

          <Divider />

          <Title level={4}>Thông số UPS</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <ul>
                <li>
                  <Text strong>Loại UPS:</Text> Online Double Conversion
                </li>
                <li>
                  <Text strong>Điện áp đầu vào:</Text> 400V AC
                </li>
                <li>
                  <Text strong>Điện áp đầu ra:</Text> 400V AC
                </li>
                <li>
                  <Text strong>Thời gian dự phòng:</Text> Theo thiết kế
                </li>
              </ul>
            </Col>

            <Col xs={24} md={12}>
              <ul>
                <li>
                  <Text strong>Hệ thống ắc quy:</Text> VRLA hoặc Lithium
                </li>
                <li>
                  <Text strong>Tuổi thọ ắc quy:</Text> Theo nhà sản xuất
                </li>
                <li>
                  <Text strong>Hiệu suất:</Text> {'>'}95%
                </li>
                <li>
                  <Text strong>Bảo vệ:</Text> Quá tải, ngắn mạch
                </li>
              </ul>
            </Col>
          </Row>
        </Card>
      </div>

      <Divider />

      {/* Tiêu chuẩn và quy định */}
      <div id='section-1-4' className='subsection'>
        <Title level={3} className='subsection-title'>
          1.4. Tiêu chuẩn và quy định
        </Title>
        <Card title='Tiêu chuẩn và quy định' className='subsection'>
          <Alert
            message='Tuân thủ tiêu chuẩn quốc gia và quốc tế'
            description='Hệ thống điện được thiết kế và thi công theo các tiêu chuẩn hiện hành'
            type='success'
            showIcon
          />

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Title level={4}>Tiêu chuẩn Việt Nam</Title>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Tag color='blue'>TCVN 5935-1:2013 - Cáp điện lực</Tag>
                <Tag color='blue'>TCVN 6483:1999 - Cáp điều khiển</Tag>
                <Tag color='blue'>QCVN 4:2009 - Quy chuẩn kỹ thuật quốc gia</Tag>
                <Tag color='blue'>TCVN 5064:1999 - Hệ thống nối đất</Tag>
              </Space>
            </Col>

            <Col xs={24} lg={12}>
              <Title level={4}>Tiêu chuẩn quốc tế</Title>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Tag color='green'>IEC 60502-1 - Cáp điện lực</Tag>
                <Tag color='green'>BS 6387 - Cáp chống cháy</Tag>
                <Tag color='green'>AS/NZS 5000.1 - Cáp điện</Tag>
                <Tag color='green'>IEC 60317 - Cáp điều khiển</Tag>
              </Space>
            </Col>
          </Row>

          <Divider />

          <Title level={4}>Chứng nhận sản phẩm</Title>
          <Paragraph>Các thiết bị sử dụng trong hệ thống đều có chứng nhận chất lượng:</Paragraph>
          <ul>
            <li>ISO 9001:2015 - Hệ thống quản lý chất lượng</li>
            <li>Chứng nhận ACIT - Thiết bị điện</li>
            <li>Test certificate - Chứng nhận thử nghiệm</li>
            <li>CE marking - Tuân thủ tiêu chuẩn châu Âu</li>
          </ul>
        </Card>
      </div>

      <Divider />

      {/* Thông tin dự án */}
      <div id='section-1-5' className='subsection'>
        <Title level={3} className='subsection-title'>
          1.5. Thông tin dự án
        </Title>
        <Card title='Thông tin dự án' className='subsection'>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Title level={4}>Thông tin chung</Title>
              <ul>
                <li>
                  <Text strong>Dự án:</Text> Đầu tư hạ tầng công nghệ Trung tâm Dữ liệu VietinBank
                </li>
                <li>
                  <Text strong>Gói thầu:</Text> Cung cấp, triển khai hệ thống điện
                </li>
                <li>
                  <Text strong>Địa điểm:</Text> Xã Vân Canh, Huyện Hoài Đức, TP. Hà Nội
                </li>
                <li>
                  <Text strong>Chủ đầu tư:</Text> Ngân hàng TMCP Công thương Việt Nam
                </li>
              </ul>
            </Col>

            <Col xs={24} lg={12}>
              <Title level={4}>Đơn vị thực hiện</Title>
              <ul>
                <li>
                  <Text strong>Nhà thầu thi công:</Text> Công ty CP Kỹ thuật Công nghiệp Á Châu
                </li>
                <li>
                  <Text strong>Tư vấn giám sát:</Text> Tổng công ty Tư vấn Xây dựng Việt Nam
                </li>
                <li>
                  <Text strong>Thời gian:</Text> Theo tiến độ dự án
                </li>
                <li>
                  <Text strong>Trạng thái:</Text> Đã hoàn thành và đưa vào vận hành
                </li>
              </ul>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default IntroductionSection;
