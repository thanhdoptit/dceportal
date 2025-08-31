import React from 'react';
import { Typography, Card, Divider, Table, Tag, Space, Image, Row, Col, Carousel } from 'antd';
import { EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { PreviewGroup } = Image;

const { Title, Paragraph, Text } = Typography;

const LocationSection = () => {
  return (
    <section id="section-3" className="content-section">
      <Title level={2} style={{ color: '#1890ff', marginBottom: '24px' }}>
        <EnvironmentOutlined style={{ marginRight: '12px' }} />
        3. DÀN NÓNG VÀ ÁT ĐIỆN ĐIỀU HÒA - TTDL Hòa Lạc
      </Title>

      <div id="section-3.1" className="subsection">
        <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
          <EnvironmentOutlined style={{ marginRight: '8px' }} /> 3.1. Dàn nóng điều hòa
        </Title>

        <Card title="Tổng quan" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Dàn nóng của hệ thống điều hòa được nằm ở đằng sau và bên hông của trung tâm dữ liệu
          </Paragraph>
        </Card>

        <Card title="Vị trí chi tiết của từng dàn nóng hệ thống điều hòa" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              {
                key: '1',
                system: 'TDAV2242A – UNIFLAIR',
                location: 'Dàn nóng của hệ thống điều hòa TDAV2242A – UNIFLAIR',
                description: 'Hệ thống điều hòa chính cho phòng Server 1',
                image: '/cooling/dnuni.jpg'
              },
              {
                key: '2',
                system: 'FM ở phòng ISP',
                location: 'Dàn nóng của hệ thống điều hòa FM ở phòng ISP',
                description: 'Hệ thống điều hòa cho phòng ISP',
                image: '/cooling/fmips.jpg'
              },
              {
                key: '3',
                system: 'INROW',
                location: 'Dàn nóng của hệ thống điều hòa INROW',
                description: 'Hệ thống điều hòa InRow cho các rack server',
                image: '/cooling/dninrow.jpg'
              },
              {
                key: '4',
                system: 'TDAV1321A – UNIFLAIR',
                location: 'Dàn nóng của hệ thống điều hòa TDAV1321A – UNIFLAIR',
                description: 'Hệ thống điều hòa cho phòng UPS',
                image: '/cooling/dn1321.jpg'
              },
              {
                key: '5',
                system: 'TDAV2842A – UNIFLAIR',
                location: 'Dàn nóng của hệ thống điều hòa TDAV2842A – UNIFLAIR',
                description: 'Hệ thống điều hòa cho phòng Server 2',
                image: '/cooling/dn2842.jpg'
              },
              {
                key: '6',
                system: 'FM ở phòng PCCC',
                location: 'Dàn nóng của điều hòa FM ở phòng PCCC',
                description: 'Hệ thống điều hòa cho phòng Server 1',
                image: '/cooling/dnFM40.jpg'
              }
            ]}
            columns={[
              {
                title: 'STT',
                dataIndex: 'key',
                key: 'key',
                width: '4%',
                align: 'center',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Hệ thống điều hòa',
                dataIndex: 'system',
                key: 'system',
                width: '20%',
                render: (text) => <Tag color="blue">{text}</Tag>
              },
              {
                title: 'Vị trí dàn nóng',
                dataIndex: 'location',
                key: 'location',
                width: '35%',
                render: (text) => <Text>{text}</Text>
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '17%',
                render: (text) => <Text style={{ fontSize: '13px' }}>{text}</Text>
              },
              {
                title: 'Hình ảnh thực tế',
                dataIndex: 'image',
                key: 'image',
                width: '15%',
                render: (imagePath) => (
                  <Image
                    src={imagePath}
                    alt="Dàn nóng điều hòa"
                    width={80}
                    height={60}
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    preview={{
                      mask: 'Xem ảnh',
                      maskClassName: 'custom-mask'
                    }}
                  />
                )
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>

      <div id="section-3.2" className="subsection">
        <Title level={3}>
          <ThunderboltOutlined /> 3.2. Vị trí át điện điều hòa
        </Title>

        <Card title="Tổng quan hệ thống điện" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Hệ thống điện cho điều hòa được phân bố tại các vị trí khác nhau trong tòa nhà để đảm bảo cung cấp điện ổn định cho từng khu vực.
          </Paragraph>
        </Card>

        <Card title="Chi tiết vị trí át điện" style={{ marginBottom: '20px' }}>
          <Table
            dataSource={[
              // Thêm nhiều ảnh cho vị trí này bằng cách dùng mảng images thay vì 1 trường image
              {
                key: '1',
                location: 'Tầng hầm phòng điện',
                description: 'Vị trí Át tổng của hệ thống điều hòa',
                equipment: 'Át tổng điều khiển toàn bộ hệ thống',
                images: [
                  '/cooling/attong1.jpg',
                  '/cooling/attong2.jpg',
                ]
              },
              {
                key: '2',
                location: 'Tầng hầm',
                description: 'Vị trí Át cấp điện cho 3 điều hòa Uniflair TDAV2842A phòng cuối hành lang + 3 điều hòa FM40H phòng PCCC + 4 điều hòa INROW PMC1 + 6 quạt thổi sàn PMC1',
                equipment: 'TDAV2842A, FM40H, INROW PMC1, Quạt thổi sàn PMC1',
                images: [
                  '/cooling/attangham1.jpg',
                  '/cooling/attangham2.jpg'
                ]
              },
              {
                key: '3',
                location: 'Tầng hầm',
                description: 'Vị trí Át cấp điện cho 2 điều hòa FM40H phòng IPS cạnh PMC1',
                equipment: 'FM40H phòng ISP',
                images: [
                  '/cooling/atips1.jpg',
                  '/cooling/atips2.jpg'
                ]
              },
              {
                key: '4',
                location: 'Phòng UPS',
                description: 'Vị trí Át cấp điện cho 2 điều hòa TDAV1321A phòng UPS và 3 điều hòa TDAV2242A ở phòng PMC1 + 2',
                equipment: 'TDAV1321A, TDAV2242A',
                images: [
                  '/cooling/atups1.jpg',
                  '/cooling/atups2.jpg'
                ]
              },
              {
                key: '5',
                location: 'Phòng UPS',
                description: 'Vị trí Át cấp điện cho 4 quạt thổi sàn PMC2',
                equipment: 'Quạt thổi sàn PMC2',
                images: [
                  '/cooling/atquat1.jpg',
                  '/cooling/atquat2.jpg'
                ]
              }
            ]}
            columns={[
              {
                title: 'STT',
                dataIndex: 'key',
                key: 'key',
                align: 'center',
                width: '2%',
                render: (text) => <Text strong>{text}</Text>
              },
              {
                title: 'Vị trí',
                dataIndex: 'location',
                key: 'location',
                width: '5%',
                render: (text) => <Tag color="green">{text}</Tag>
              },
              {
                title: 'Mô tả',
                dataIndex: 'description',
                key: 'description',
                width: '25%',
                render: (text) => <Text style={{ fontSize: '13px' }}>{text}</Text>
              },
              {
                title: 'Thiết bị được cấp điện',
                dataIndex: 'equipment',
                key: 'equipment',
                width: '10%',
                render: (text) => <Text style={{ fontSize: '13px' }}>{text}</Text>
              },
              {
                title: 'Hình ảnh thực tế',
                dataIndex: 'images',
                key: 'images',
                width: '6%',
                render: (images, record) => {
                  // Debug: log ra để kiểm tra
                  console.log('Record:', record);
                  console.log('Images:', images);

                  // Nếu có mảng images thì hiển thị carousel với preview group
                  if (images && images.length > 0) {
                    return (
                      <div style={{ width: 100, height: 100, position: 'relative', alignItems: 'center' }}>
                        <PreviewGroup
                          preview={{
                            mask: 'Xem ảnh',
                            maskClassName: 'custom-mask',
                          }}
                        >
                          {images.map((img, index) => (
                            <Image
                              key={index}
                              src={img}
                              alt={`Át điện điều hòa ${index + 1}`}
                              width={100}
                              height={100}
                              style={{
                                objectFit: 'cover',
                                borderRadius: '4px',
                                display: index === 0 ? 'block' : 'none' // Chỉ hiển thị ảnh đầu tiên
                              }}
                              preview={{
                                mask: 'Xem ảnh',
                                maskClassName: 'custom-mask'
                              }}
                            />
                          ))}
                        </PreviewGroup>
                        {/* Hiển thị số lượng ảnh */}
                        {images.length > 1 && (
                          <div style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            fontSize: '10px'
                          }}>
                            {images.length} ảnh
                          </div>
                        )}
                      </div>
                    );
                  }
                  // Nếu có image đơn lẻ
                  if (record.image) {
                    return (
                      <Image
                        src={record.image}
                        alt="Át điện điều hòa"
                        width={80}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        preview={{
                          mask: 'Xem ảnh',
                          maskClassName: 'custom-mask'
                        }}
                      />
                    );
                  }
                  return <Text>Không có ảnh</Text>;
                }
              }
            ]}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>
    </section>
  );
};

export default LocationSection;
