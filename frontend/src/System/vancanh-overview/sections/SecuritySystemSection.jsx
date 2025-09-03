import { AppstoreOutlined, PictureOutlined, SafetyOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Row, Space, Tag, Typography } from 'antd';
import React from 'react';
import { ImageGallery, ImagePreview } from '../../shared';

const { Title, Text } = Typography;

const SecuritySystemSection = () => {
  return (
    <div id="section-6" className="device-section">
      <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
        <SafetyOutlined style={{ marginRight: '8px' }} />
        6. HỆ THỐNG AN NINH TTDL VÂN CANH
      </Title>

      <Alert
        message="HỆ THỐNG CAM VÀ HỆ ACS GIÁM SÁT TOÀN BỘ TRONG, NGOÀI DC VÂN CANH"
        description="Đáp ứng tiêu chuẩn Thông tư 09 của NHNN về an ninh ngân hàng."
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      {/* Hình ảnh hệ thống an ninh */}

      <div id="section-6.1" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <AppstoreOutlined style={{ marginRight: '8px' }} /> 6.1 Hệ thống CCTV
        </Title>
        
        {/* Hiển thị gallery ảnh CCTV */}
        <Card
          title={
            <Space>
              <PictureOutlined />
              Hình ảnh hệ thống CCTV
            </Space>
          }
          style={{ marginBottom: '20px' }}
        >
          <ImageGallery
            images={[
              '/vancanh-overview/cctv1.jpg',             
            ]}
            columns={1}
            imageWidth= '100%'
            imageHeight= 'auto'  
            maskText="Click để xem chi tiết"
          />
        </Card>
        <Card title="Hệ thống CCTV" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Số lượng camera</Tag>
              <Text>110 Camera từ vòng ngoài, hành lang, các phòng chức năng</Text>
            </div>
            <div>
              <Tag color="blue">Phân vùng</Tag>
              <Text>Chia làm 2 vùng: vùng trong và vùng ngoài</Text>
            </div>
            <div>
              <Tag color="blue">Server recording</Tag>
              <Text>2 server: 10.0.208.5 (tầng 1), 10.0.208.6 (tầng 2,3,4)</Text>
            </div>
            <div>
              <Tag color="blue">Lưu trữ</Tag>
              <Text>Thời gian lưu trữ 100 ngày</Text>
            </div>
            <div>
              <Tag color="blue">Phần mềm</Tag>
              <Text>Xprotect Managerment Client để view camera</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-6.2" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <AppstoreOutlined style={{ marginRight: '8px' }} /> 6.2 Hệ thống kiểm soát vào ra ACS
        </Title>
        <Card
          title={
            <Space>
              <PictureOutlined />
              Hệ thống kiểm soát vào ra
            </Space>
          } >
          <div style={{ textAlign: 'center' }}>
            <ImagePreview
              src="/vancanh-overview/cctv2.jpg"
              alt="Hệ thống cấp nguồn gồm 2 trạm biến áp 2500KVA"
              width='80%'
                height= 'auto'  
                style={{                
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>
        </Card>
        <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
          <Col span={12}  >
            <div style={{ textAlign: 'center' }}>
              <ImagePreview
                src="/vancanh-overview/cctv3.jpg"
                alt="Hệ thống cấp nguồn gồm 2 trạm biến áp 2500KVA"
                width='100%'
                height= 'auto'  
                style={{                  
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'block',
                  margin: '0 auto'
                }}
              />

            </div>
          </Col>
          <Col span={12} >
            <div style={{ textAlign: 'center' }}>
              <ImagePreview
                src="/vancanh-overview/cctv4.jpg"
                alt="Hệ thống cấp nguồn gồm 2 trạm biến áp 2500KVA"
                width='100%'
                height= 'auto'  
                style={{                  
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </div>
          </Col>
        </Row>
        <Card title="Hệ thống kiểm soát vào ra (ACS)" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="green">Phần cứng</Tag>
              <Text>Khóa từ, đầu đọc vân tay, nút exit, nút mở cửa khẩn cấp</Text>
            </div>
            <div>
              <Tag color="green">Controller</Tag>
              <Text>Đặt ở phòng Hub1 và Hub2, kết nối với nhau bởi các switch</Text>
            </div>
            <div>
              <Tag color="green">Server</Tag>
              <Text>Đặt ở phòng security monitor, IP: 10.0.208.200</Text>
            </div>
            <div>
              <Tag color="green">Phần mềm</Tag>
              <Text>AS Manager giám sát ra, điều khiển vào ra, xác thực bằng vân tay và hình ảnh</Text>
            </div>
            <div>
              <Tag color="green">Bảo mật cao</Tag>
              <Text>Phòng máy chủ tầng 2 có cửa xác thực bằng hình ảnh chỉ cho 1 người vào</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id="section-6.3" className="subsection">
        <Title level={4} style={{ color: '#1890ff', marginBottom: '12px' }}>
          <AppstoreOutlined style={{ marginRight: '8px' }} /> 6.3 Hệ thống thông báo PA
        </Title>

        <Card title="Hệ thống thông báo PA" style={{ marginBottom: '20px' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="orange">Thiết bị</Tag>
              <Text>Đặt ở phòng security monitor tầng 1</Text>
            </div>
            <div>
              <Tag color="orange">Phòng NOC</Tag>
              <Text>Có Mic nói bằng cách chọn 1,2,3 ấn giữ nói, chỉ nói và phát nhạc</Text>
            </div>
            <div>
              <Tag color="orange">Phát nhạc</Tag>
              <Text>Phát 1 bản nhạc xuống tầng 1, cắm USB phát nhạc vào thiết bị</Text>
            </div>
            <div>
              <Tag color="orange">Bộ phát nhạc nền</Tag>
              <Text>Model: PLE-SDT</Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySystemSection;
