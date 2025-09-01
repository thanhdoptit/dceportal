import React from 'react';
import { Typography, Card, Tag, Alert, Space, Divider, Row, Col } from 'antd';
import { 
  ThunderboltOutlined, 
  BulbOutlined, 
  CheckCircleOutlined,
  PictureOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const PowerSystemSection = () => {
  return (
    <div id="section-3" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <ThunderboltOutlined style={{ marginRight: '8px' }} />
        3. HỆ THỐNG CẤP NGUỒN TTDL VÂN CANH
      </Title>

      <div id="section-3.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <BulbOutlined style={{ marginRight: '8px' }} /> 3.1 Nguồn điện và trạm biến áp
        </Title>

        <Alert
          message="HỆ THỐNG ĐIỆN ĐƯỢC SỐ HÓA, GIÁM SÁT, ĐIỀU KHIỂN TỰ ĐỘNG 100%"
          description="2 trạm biến áp 2500KVA cung cấp nguồn điện ổn định cho toàn bộ hệ thống."
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        {/* Image placeholders từ PPTX */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <PictureOutlined />
                  Hình ảnh hệ thống điện
                </Space>
              }
            >
              <div style={{ textAlign: 'center' }}>
                <img 
                  src="/vancanh-overview/electrical_system_digital.jpg"
                  alt="Hệ thống điện được số hóa, giám sát, điều khiển tự động 100%"
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
                  Hệ thống điện được số hóa, giám sát, điều khiển tự động 100% (từ slide PPTX)
                </p>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <PictureOutlined />
                  Hình ảnh trạm biến áp
                </Space>
              }
            >
              <div style={{ textAlign: 'center' }}>
                <img 
                  src="/vancanh-overview/transformer_station_2500kva_3.jpg"
                  alt="Hệ thống cấp nguồn gồm 2 trạm biến áp 2500KVA"
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
                  Hệ thống cấp nguồn gồm 2 trạm biến áp 2500KVA (từ slide PPTX)
                </p>
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="Thông số kỹ thuật trạm biến áp" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Số lượng</Tag>
              <Text>2 TBA 2500KVA (A & B)</Text>
            </div>
            <div>
              <Tag color="blue">Công suất mỗi trạm</Tag>
              <Text>2500KVA</Text>
            </div>
            <div>
              <Tag color="blue">Tổng công suất</Tag>
              <Text>5000KVA</Text>
            </div>
            <div>
              <Tag color="blue">Vị trí</Tag>
              <Text>Phía sau tòa nhà</Text>
            </div>
            <div>
              <Tag color="blue">Đường điện</Tag>
              <Text>Kéo vào theo cống ngầm 2 lộ</Text>
            </div>
            <div>
              <Tag color="blue">Chế độ hoạt động</Tag>
              <Text>2 TBA cung cấp cho cả 2 phòng Điện A và B</Text>
            </div>
            <div>
              <Tag color="blue">Dự phòng</Tag>
              <Text>1 TBA còn lại cung cấp đủ điện qua TIE BREAKER</Text>
            </div>
          </Space>
        </Card>

        <Card title="Hệ thống máy phát điện" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">Số lượng</Tag>
              <Text>2 MPĐ 2500KVA (A & B)</Text>
            </div>
            <div>
              <Tag color="green">Vị trí</Tag>
              <Text>Phía sau tòa nhà</Text>
            </div>
            <div>
              <Tag color="green">Kích hoạt</Tag>
              <Text>Chỉ khi cả 2 TBA bị cắt điện</Text>
            </div>
            <div>
              <Tag color="green">Dự phòng</Tag>
              <Text>MPĐ này dự phòng cho máy phát điện kia và ngược lại</Text>
            </div>
          </Space>
        </Card>

        <Card title="Hệ thống bồn dầu" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="orange">Bể dầu ngầm</Tag>
              <Text>2 bể ngầm dưới mặt đất nối thông nhau (15.000 lít)</Text>
            </div>
            <div>
              <Tag color="orange">Bồn dầu ngày</Tag>
              <Text>2 bồn mỗi bồn 1000 lít</Text>
            </div>
            <div>
              <Tag color="orange">Thời gian hoạt động</Tag>
              <Text>16.000 lít dầu chạy liên tục khoảng 40 giờ cho 1 MPĐ ở mức tải 70%</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-3.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <ThunderboltOutlined style={{ marginRight: '8px' }} /> 3.2 Hệ thống UPS
        </Title>

        <Alert
          message="HỆ THỐNG UPS SCHNEIDER GỒM 05 UPS 500 KVA"
          description="Tạo thành 2 nhánh cấp nguồn cho tải IT và các hệ thống quan trọng như tủ BMS, NOC, CRAC, bơm tuần hoàn."
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        {/* Image placeholders cho UPS */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <PictureOutlined />
                  Hình ảnh hệ thống UPS
                </Space>
              }
            >
              <div style={{ textAlign: 'center' }}>
                <img 
                  src="/vancanh-overview/ups_schneider_500kva_3.jpg"
                  alt="Hệ thống UPS Schneider gồm 05 UPS 500 KVA"
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
                  Hệ thống UPS Schneider (từ slide PPTX)
                </p>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <PictureOutlined />
                  Hình ảnh tủ phân phối
                </Space>
              }
            >
              <div style={{ textAlign: 'center' }}>
                <img 
                  src="/vancanh-overview/ups_distribution_3.jpg"
                  alt="Tủ phân phối điện UPS"
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
                  Tủ phân phối điện (từ slide PPTX)
                </p>
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="Thông số kỹ thuật UPS" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Hãng sản xuất</Tag>
              <Text>Schneider Electric</Text>
            </div>
            <div>
              <Tag color="blue">Số lượng</Tag>
              <Text>05 UPS</Text>
            </div>
            <div>
              <Tag color="blue">Công suất mỗi UPS</Tag>
              <Text>500KVA</Text>
            </div>
            <div>
              <Tag color="blue">Tổng công suất</Tag>
              <Text>2500KVA</Text>
            </div>
            <div>
              <Tag color="blue">Cấu hình</Tag>
              <Text>2 nhánh song song</Text>
            </div>
            <div>
              <Tag color="blue">Thời gian dự phòng</Tag>
              <Text>15-30 phút</Text>
            </div>
            <div>
              <Tag color="blue">Tải được bảo vệ</Tag>
              <Text>IT, BMS, NOC, CRAC, Bơm tuần hoàn</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-3.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <DatabaseOutlined style={{ marginRight: '8px' }} /> 3.3 Máy phát điện và bồn dầu
        </Title>

        <Alert
          message="HỆ THỐNG BỒN DẦU NGẦM 1500 LÍT, BƠM TỰ ĐỘNG"
          description="Đáp ứng 40 giờ chạy máy liên tục với điều kiện full tải toàn bộ DC."
          type="success"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        {/* Image placeholders cho máy phát và bồn dầu */}
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <PictureOutlined />
                  Hình ảnh máy phát điện
                </Space>
              }
            >
              <div style={{ textAlign: 'center' }}>
                <img 
                  src="/vancanh-overview/fuel_tank_1500l_3.jpg"
                  alt="Hệ thống bồn dầu ngầm 1500 lít"
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
                  Hệ thống bồn dầu ngầm 1500 lít, bơm tự động (từ slide PPTX)
                </p>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <PictureOutlined />
                  Hình ảnh bồn dầu
                </Space>
              }
            >
              <div style={{ textAlign: 'center' }}>
                <img 
                  src="/vancanh-overview/fuel_tank_details_3.jpg"
                  alt="Bồn dầu ngầm 1500 lít"
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
                  Bồn dầu ngầm 1500 lít (từ slide PPTX)
                </p>
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="Thông số kỹ thuật máy phát điện" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Số lượng</Tag>
              <Text>02 máy phát điện</Text>
            </div>
            <div>
              <Tag color="blue">Công suất mỗi máy</Tag>
              <Text>2500KVA</Text>
            </div>
            <div>
              <Tag color="blue">Tổng công suất</Tag>
              <Text>5000KVA</Text>
            </div>
            <div>
              <Tag color="blue">Nhiên liệu</Tag>
              <Text>Diesel</Text>
            </div>
            <div>
              <Tag color="blue">Bồn dầu</Tag>
              <Text>1500 lít (ngầm)</Text>
            </div>
            <div>
              <Tag color="blue">Thời gian chạy</Tag>
              <Text>40 giờ (full tải)</Text>
            </div>
            <div>
              <Tag color="blue">Hệ thống bơm</Tag>
              <Text>Tự động</Text>
            </div>
            <div>
              <Tag color="blue">Khởi động</Tag>
              <Text>Tự động khi mất điện</Text>
            </div>
          </Space>
        </Card>
      </div>

      <Divider />

      <Alert
        message="Tóm tắt hệ thống cấp nguồn"
        description="Hệ thống cấp nguồn TTDL Vân Canh được thiết kế hoàn chỉnh với 2 trạm biến áp 2500KVA, 5 UPS Schneider 500KVA, 2 máy phát điện 2500KVA và bồn dầu 1500 lít. Hệ thống đảm bảo cung cấp điện liên tục 24/7 với độ tin cậy cao."
        type="success"
        showIcon
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default PowerSystemSection;
