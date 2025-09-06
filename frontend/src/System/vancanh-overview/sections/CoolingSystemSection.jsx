import {
  CheckCircleOutlined,
  CloudOutlined,
  PictureOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Alert, Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import { ImagePreview } from '../../shared';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const CoolingSystemSection = () => {
  return (
    <div id='section-4' className='content-section'>
      <Title level={2}>
        <SettingOutlined style={{ marginRight: '8px' }} />
        4. HỆ THỐNG LÀM MÁT TTDL VÂN CANH
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card
            title={
              <Space>
                <PictureOutlined />
                Hình ảnh hệ thống làm mát
              </Space>
            }
          >
            <div style={{ textAlign: 'center' }}>
              <ImagePreview
                src='/vancanh-overview/chiller1.jpg'
                alt='Hệ thống làm mát DC'
                width='100%'
                height='auto'
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <Space>
                <PictureOutlined />
                Hình ảnh hệ thống Chiller
              </Space>
            }
          >
            <div style={{ textAlign: 'center' }}>
              <ImagePreview
                src='/vancanh-overview/chiller2.jpg'
                alt='Chiller SMARDT 632kW'
                width='100%'
                height='auto'
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <div id='section-4-1' className='subsection'>
        <Title level={3}>
          <CloudOutlined style={{ marginRight: '8px' }} /> 4.1 Hệ thống Chiller
        </Title>

        <Alert
          message='HỆ LÀM MÁT SỬ DỤNG CÁC THIẾT BỊ HÃNG NỔI TIẾNG'
          description='Chiller SMARDT, điều hòa chính xác Schneider, BMS Siemens tự động hóa hoàn toàn.'
          type='info'
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Card title='Thông số kỹ thuật Chiller' style={{ marginBottom: '20px' }}>
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div>
              <Tag color='blue'>Hãng sản xuất</Tag>
              <Text>SMARDT</Text>
            </div>
            <div>
              <Tag color='blue'>Loại</Tag>
              <Text>Giải nhiệt gió</Text>
            </div>
            <div>
              <Tag color='blue'>Số lượng</Tag>
              <Text>3 hệ thống</Text>
            </div>
            <div>
              <Tag color='blue'>Công suất mỗi hệ thống</Tag>
              <Text>180 tấn lạnh (2.160 nghìn Btu, 630 nghìn Kw/h)</Text>
            </div>
            <div>
              <Tag color='blue'>Tổng công suất</Tag>
              <Text>540 tấn lạnh</Text>
            </div>
            <div>
              <Tag color='blue'>Môi chất lạnh</Tag>
              <Text>R134a</Text>
            </div>
            <div>
              <Tag color='blue'>Cấu tạo</Tag>
              <Text>2 máy nén, giàn tỏa nhiệt, 10 quạt dàn ngưng, van tiết lưu, bình bay hơi</Text>
            </div>
            <div>
              <Tag color='blue'>Nhiệt độ nước cấp</Tag>
              <Text>7-10°C</Text>
            </div>
            <div>
              <Tag color='blue'>Nhiệt độ nước hồi</Tag>
              <Text>12-14°C</Text>
            </div>
          </Space>
        </Card>

        <Card title='Hệ thống bơm' style={{ marginBottom: '20px' }}>
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div>
              <Tag color='green'>Số lượng bơm</Tag>
              <Text>3 bơm biến tần Teco</Text>
            </div>
            <div>
              <Tag color='green'>Công suất mỗi bơm</Tag>
              <Text>22 kW</Text>
            </div>
            <div>
              <Tag color='green'>Chế độ hoạt động</Tag>
              <Text>Dự phòng 2-1, luân phiên không tắt toàn bộ</Text>
            </div>
            <div>
              <Tag color='green'>Nhiệm vụ</Tag>
              <Text>Bơm tuần hoàn nước từ chiller qua TES, cấp cho tải, hồi về chiller</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id='section-4-2' className='subsection'>
        <Title level={3}>
          <CloudOutlined style={{ marginRight: '8px' }} /> 4.2 Hệ thống điều hòa chính xác
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title='PAC UNIFLAIR SDCV Series' style={{ marginBottom: '20px' }}>
              <Space direction='vertical' size='middle' style={{ width: '100%' }}>
                <div>
                  <Tag color='green'>Công suất</Tag>
                  <Text>3-15.6kW</Text>
                </div>
                <div>
                  <Tag color='green'>Độ chính xác</Tag>
                  <Text>±0.5°C</Text>
                </div>
                <div>
                  <Tag color='green'>Độ ẩm</Tag>
                  <Text>45-55%</Text>
                </div>
                <div>
                  <Tag color='green'>Ứng dụng</Tag>
                  <Text>Phòng server nhỏ</Text>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title='PAC UNIFLAIR LDCV Series' style={{ marginBottom: '20px' }}>
              <Space direction='vertical' size='middle' style={{ width: '100%' }}>
                <div>
                  <Tag color='purple'>Công suất</Tag>
                  <Text>16.8-110kW</Text>
                </div>
                <div>
                  <Tag color='purple'>Độ chính xác</Tag>
                  <Text>±0.5°C</Text>
                </div>
                <div>
                  <Tag color='purple'>Độ ẩm</Tag>
                  <Text>45-55%</Text>
                </div>
                <div>
                  <Tag color='purple'>Ứng dụng</Tag>
                  <Text>Phòng server lớn</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Card title='Đặc điểm kỹ thuật PAC' style={{ marginBottom: '20px' }}>
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div>
              <Tag color='green'>✅ Điều khiển chính xác</Tag>
              <Text>Nhiệt độ ±0.5°C, độ ẩm ±5%</Text>
            </div>
            <div>
              <Tag color='green'>✅ Tiết kiệm năng lượng</Tag>
              <Text>EC fan, inverter compressor</Text>
            </div>
            <div>
              <Tag color='green'>✅ Tích hợp BMS</Tag>
              <Text>Giao tiếp Modbus RTU/TCP</Text>
            </div>
            <div>
              <Tag color='green'>✅ Bảo trì dễ dàng</Tag>
              <Text>Thiết kế modular, thay thế nhanh</Text>
            </div>
            <div>
              <Tag color='green'>✅ Hoạt động liên tục</Tag>
              <Text>24/7 operation, N+1 redundancy</Text>
            </div>
            <div>
              <Tag color='green'>✅ UPS3B cấp nguồn</Tag>
              <Text>Đảm bảo điều hòa chính xác hoạt động liên tục</Text>
            </div>
            <div>
              <Tag color='green'>✅ Hệ thống bơm biến tần</Tag>
              <Text>Bơm biến tần Teco 22kW dự phòng 2-1</Text>
            </div>
          </Space>
        </Card>
      </div>

      <div id='section-4-3' className='subsection'>
        <Title level={3}>
          <CheckCircleOutlined style={{ marginRight: '8px' }} /> 4.3 Hệ thống trữ nhiệt TES
        </Title>

        <Alert
          message='HỆ TRỮ NHIỆT ĐÓNG VAI TRÒ NUÔI HỆ LÀM MÁT CHÍNH XÁC'
          description='Ngay cả khi hệ Chiller gặp sự cố trong thời gian tối thiểu 10 phút.'
          type='warning'
          showIcon
          style={{ marginBottom: '20px' }}
        />

        {/* Image placeholder cho TES */}
        <Card
          title={
            <Space>
              <PictureOutlined />
              Hình ảnh hệ thống TES
            </Space>
          }
          style={{ marginBottom: '20px' }}
        >
          <div style={{ textAlign: 'center', width: '100%', height: '530px', margin: '0 auto' }}>
            <ImagePreview
              src='/vancanh-overview/tes.jpg'
              alt='Hệ thống trữ nhiệt TES'
              width='800px'
              height='500px'
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'block',
                margin: '0 auto',
              }}
            />
            <p
              style={{
                color: '#666',
                margin: '8px 0 0 0',
                fontSize: '12px',
                fontStyle: 'italic',
              }}
            >
              Hệ thống trữ nhiệt TES đặt ở bên hông trái TTDL
            </p>
          </div>
        </Card>

        <Card title='Thông số kỹ thuật TES' style={{ marginBottom: '20px' }}>
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div>
              <Tag color='blue'>Số lượng</Tag>
              <Text>2 bình TES (A & B)</Text>
            </div>
            <div>
              <Tag color='blue'>Dung tích mỗi bình</Tag>
              <Text>20 m³</Text>
            </div>
            <div>
              <Tag color='blue'>Tổng dung tích</Tag>
              <Text>40 m³</Text>
            </div>
            <div>
              <Tag color='blue'>Thời gian dự phòng</Tag>
              <Text>10 phút đầy tải khi mất điện hoặc tạm dừng Chiller</Text>
            </div>
            <div>
              <Tag color='blue'>Chế độ hoạt động</Tag>
              <Text>BT và Xả, Nạp, ByPass</Text>
            </div>
            <div>
              <Tag color='blue'>Vị trí</Tag>
              <Text>Tầng mái</Text>
            </div>
          </Space>
        </Card>

        <Card title='Nguyên lý hoạt động' style={{ marginBottom: '10px' }}>
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div>
              <Tag color='green'>✅ Chế độ bình thường</Tag>
              <Text>Chiller làm lạnh nước và lưu trữ trong TES</Text>
            </div>
            <div>
              <Tag color='green'>✅ Chế độ dự phòng</Tag>
              <Text>Khi Chiller lỗi, TES cung cấp nước lạnh</Text>
            </div>
            <div>
              <Tag color='green'>✅ Chế độ nạp</Tag>
              <Text>Sau khi Chiller hoạt động lại, nạp lại TES</Text>
            </div>
            <div>
              <Tag color='green'>✅ Điều khiển tự động</Tag>
              <Text>BMS điều khiển chuyển đổi chế độ</Text>
            </div>
          </Space>
        </Card>
      </div>

      <Divider />

      <Alert
        message='Tóm tắt hệ thống làm mát'
        description='Hệ thống làm mát TTDL Vân Canh được thiết kế hiện đại với Chiller SMARDT 632kW, PAC UNIFLAIR chính xác ±0.5°C, và TES dự phòng 10 phút. Hệ thống đảm bảo môi trường tối ưu cho thiết bị IT với độ tin cậy cao.'
        type='success'
        showIcon
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default CoolingSystemSection;
