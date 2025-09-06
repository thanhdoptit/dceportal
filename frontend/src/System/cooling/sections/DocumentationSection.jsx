import {
  DownloadOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Table, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const DocumentationSection = () => {
  // Dữ liệu tài liệu kỹ thuật
  const technicalDocuments = [
    {
      key: '1',
      name: 'Catalog kỹ thuật Uniflair TDAV Series',
      fileName: 'Catalog_Uniflair_TDAV_Series.pdf',
      filePath: '/cooling/docs/Catalog kỹ thuật Uniflair TDAV Series.pdf',
      type: 'PDF',
      size: '2.5 MB',
      description: 'Thông số kỹ thuật chi tiết của các model TDAV1321A, TDAV2242A, TDAV2842A',
      category: 'Catalog',
    },
    {
      key: '2',
      name: 'Installation Manual – Uniflair DX Units',
      fileName: 'Installation Manual – Uniflair DX Units.pdf',
      filePath: '/cooling/docs/Installation Manual – Uniflair DX Units.pdf',
      type: 'PDF',
      size: '2.5 MB',
      description: 'Installation Manual – Uniflair DX Units',
      category: 'Catalog',
    },

    {
      key: '3',
      name: 'Hướng dẫn lắp đặt và vận hành APC FM40H',
      fileName: 'Huong_dan_APC_FM40H.pdf',
      filePath: '/cooling/docs/Install FM40.pdf',
      type: 'PDF',
      size: '1.8 MB',
      description: 'Hướng dẫn chi tiết lắp đặt, cấu hình và vận hành điều hòa FM40H',
      category: 'Hướng dẫn',
    },
    {
      key: '4',
      name: 'Manual vận hành InRow ACRP102',
      fileName: 'Manual_InRow_ACRP102.pdf',
      filePath: '/cooling/docs/InRow ACRP10X Installation OCT 14.pdf',
      type: 'PDF',
      size: '3.2 MB',
      description: 'Hướng dẫn lắp đặt hệ thống điều hòa InRow',
      category: 'Manual',
    },
    {
      key: '5',
      name: 'Operation ACRP102',
      fileName: 'Operation ACRP102.pdf',
      filePath: '/cooling/docs/Operation ACRP102.pdf',
      type: 'PDF',
      size: '3.2 MB',
      description: 'Hướng dẫn vận hành hệ thống điều hòa InRow',
      category: 'Manual',
    },
    {
      key: '6',
      name: 'ACRP Tech Data Manual',
      fileName: 'ACRP Tech Data Manual.pdf',
      filePath: '/cooling/docs/ACRP Tech Data Manual.pdf',
      type: 'PDF',
      size: '3.2 MB',
      description: 'Tài liệu ACRP',
      category: 'Manual',
    },
    {
      key: '7',
      name: 'AFM4500B Manual',
      fileName: 'AFM4500B Manual.pdf',
      filePath: '/cooling/docs/AFM4500B Manual.pdf',
      type: 'PDF',
      size: '3.2 MB',
      description: 'Tài liệu quạt thổi sàn AFM4500B',
      category: 'Manual',
    },
    {
      key: '8',
      name: 'e-catalog Room Cooling_2025',
      fileName: 'e-catalog Room Cooling_2025.pdf',
      filePath: '/cooling/docs/e-catalog Room Cooling_2025.pdf',
      type: 'PDF',
      size: '3.2 MB',
      description: 'e-catalog Room Cooling_2025',
      category: 'Manual',
    },
  ];

  // Hàm xử lý download file
  const handleDownload = (fileName, filePath) => {
    // Kiểm tra xem file có tồn tại không
    fetch(filePath, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          const link = document.createElement('a');
          link.href = filePath;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Hiển thị thông báo nếu file chưa có
          alert(
            `Tài liệu "${fileName}" đang được chuẩn bị. Vui lòng liên hệ phòng Kỹ thuật để được cung cấp.`
          );
        }
      })
      .catch(() => {
        alert(
          `Tài liệu "${fileName}" đang được chuẩn bị. Vui lòng liên hệ phòng Kỹ thuật để được cung cấp.`
        );
      });
  };

  // Hàm lấy icon theo loại file
  const getFileIcon = fileType => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: 'orange' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#1890ff' }} />;
      case 'xls':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileImageOutlined style={{ color: '#722ed1' }} />;
      case 'dwg':
        return <FileTextOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <FileTextOutlined style={{ color: '#faad14' }} />;
    }
  };

  return (
    <section id='section-6' className='content-section'>
      <Title level={2} style={{ color: '#1890ff', marginBottom: '24px' }}>
        <FileTextOutlined style={{ marginRight: '12px' }} />
        6. TÀI LIỆU KÈM THEO - TTDL Hòa Lạc
      </Title>

      <Card title='Tài liệu kỹ thuật hệ thống làm mát' style={{ marginBottom: '20px' }}>
        <Paragraph>
          Dưới đây là các tài liệu kỹ thuật quan trọng liên quan đến hệ thống làm mát của trung tâm
          dữ liệu. Các tài liệu này cung cấp thông tin chi tiết về thiết kế, lắp đặt, vận hành và
          bảo trì hệ thống.
        </Paragraph>
      </Card>

      <Card title='Catalog và tài liệu kỹ thuật thiết bị' style={{ marginBottom: '20px' }}>
        <Table
          dataSource={technicalDocuments}
          rowKey='name'
          columns={[
            {
              title: 'Tên tài liệu',
              dataIndex: 'name',
              key: 'name',
              width: '35%',
              render: (text, record) => (
                <Space>
                  {getFileIcon(record.type)}
                  <Text strong style={{ fontSize: '13px' }}>
                    {text}
                  </Text>
                </Space>
              ),
            },
            {
              title: 'Mô tả',
              dataIndex: 'description',
              key: 'description',
              width: '35%',
              render: text => <Text style={{ fontSize: '13px' }}>{text}</Text>,
            },
            {
              title: 'Phân loại',
              dataIndex: 'category',
              key: 'category',
              width: '8%',
              render: text => <Tag color='green'>{text}</Tag>,
            },
            {
              title: 'File',
              dataIndex: 'type',
              key: 'type',
              width: '4%',
              render: text => <Tag color='blue'>{text}</Tag>,
            },
            {
              title: 'Tải ',
              key: 'download',
              width: '4%',
              align: 'center',
              render: (_, record) => (
                <Button
                  type='primary'
                  size='small'
                  style={{
                    width: '100%',
                    backgroundColor: '#003c71',
                    color: 'white',
                    borderColor: '#003c71',
                  }}
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(record.fileName, record.filePath)}
                  title='Tải xuống tài liệu'
                />
              ),
            },
          ]}
          pagination={{
            pageSize: 15,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tài liệu`,
          }}
          size='small'
          bordered
        />
      </Card>

      <Card title='Tài liệu đào tạo và hướng dẫn' style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card size='small' title='Tài liệu đào tạo' extra={<Tag color='blue'>DOCX</Tag>}>
              {/* Đặt Paragraph và Button trên cùng một dòng bằng Row + Col của Ant Design */}
              <Row align='middle' gutter={8} style={{ marginBottom: '1px' }}>
                <Col flex='auto'>
                  <Paragraph
                    style={{ fontSize: '14px', margin: 0 }}
                    className='whitespace-pre-line break-words'
                  >
                    Tài liệu hệ thống làm mát TTDL Hòa Lạc
                  </Paragraph>
                  <span style={{ fontSize: '12px', margin: 0 }}>
                    (Ngô Quang Hoàng Sơn - Nguyễn Đăng Hiếu)
                  </span>
                </Col>
                <Col flex='none'>
                  <Button
                    type='primary'
                    size='small'
                    style={{ backgroundColor: '#003c71', color: 'white', borderColor: '#003c71' }}
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(
                        'Tài liệu hệ thống làm mát TTDL Hòa Lạc.docx',
                        '/cooling/docs/Tài liệu hệ thống làm mát TTDL Hòa Lạc.docx'
                      )
                    }
                  >
                    Tải xuống
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* <Col xs={24} sm={12} md={8}>
            <Card size="small" title="Hướng dẫn xử lý sự cố" extra={<Tag color="blue">DOCX</Tag>}>
              <Row align="middle" gutter={8} style={{ marginBottom: '12px' }}>
                <Col flex="auto">
                  <Paragraph style={{ fontSize: '12px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Hướng dẫn chi tiết xử lý các sự cố thường gặp
                  </Paragraph>
                </Col>
                <Col flex="none">
                  <Button
                    type="primary"
                    size="small"
                    style={{ backgroundColor: '#003c71', color: 'white', borderColor: '#003c71' }}
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload('Huong_dan_xu_ly_su_co.docx', '/cooling/docs/Huong_dan_xu_ly_su_co.docx')}
                  >
                    Tải xuống
                  </Button>
                </Col>
              </Row>
            </Card>
        </Col> */}

          <Col xs={24} sm={12} md={8}>
            <Card size='small' title='Checklist kiểm tra' extra={<Tag color='green'>XLSX</Tag>}>
              <Row align='middle' gutter={8} style={{ marginBottom: '1px' }}>
                <Col flex='auto'>
                  <Paragraph
                    style={{
                      fontSize: '12px',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Ha tang TTDL Hoa Lac.xlsx
                  </Paragraph>
                </Col>
                <Col flex='none'>
                  <Button
                    type='primary'
                    size='small'
                    style={{
                      width: '100%',
                      backgroundColor: '#003c71',
                      color: 'white',
                      borderColor: '#003c71',
                    }}
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      handleDownload(
                        'Ha tang TTDL Hoa Lac.xlsx',
                        '/cooling/docs/Ha tang TTDL Hoa Lac.xlsx'
                      )
                    }
                    block
                  >
                    Tải xuống
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </section>
  );
};

export default DocumentationSection;
