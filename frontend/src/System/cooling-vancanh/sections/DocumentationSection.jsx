import {
    DownloadOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { Alert, Button, Card, Col, Divider, Row, Space, Tabs, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const DocumentationSection = () => {
  // Style chung cho các button download
  const downloadButtonStyle = {
    whiteSpace: 'normal',
    height: 'auto',
    lineHeight: '1.4',
    padding: '8px 12px',
    textAlign: 'left'
  };

  // Component wrapper cho button download
  const DownloadButton = ({ children, onClick }) => (
    <Button 
      block
      icon={<DownloadOutlined />}
      style={downloadButtonStyle}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  return (
    <div className="content-section">
      <Title level={2}>
        <FileTextOutlined style={{ marginRight: '12px' }} />
        7. TÀI LIỆU & THAM KHẢO - TTDL Vân Canh
      </Title>

      <Alert
        message="Tài liệu kèm theo"
        description="Các tài liệu kỹ thuật, catalog và bản vẽ liên quan đến hệ thống làm mát TTDL Vân Canh."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <div style={{ marginBottom: '24px' }}>
        <Card>
          <Title level={3}>
            <DownloadOutlined style={{ marginRight: '8px' }} />
            Thư viện bản vẽ HVAC
          </Title>

          <Alert
            message="Thư viện bản vẽ HVAC TTDL Vân Canh"
            description="Tất cả 32 bản vẽ kỹ thuật chính thức đã được số hóa và có sẵn để tải về định dạng PDF. Bao gồm: sơ đồ hệ thống, mặt bằng tầng, chi tiết lắp đặt, hệ thống nước lạnh, thông gió, thoát khói, thoát nước và bản vẽ hoàn công."
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Tabs defaultActiveKey="1">
            <TabPane tab="Sơ đồ hệ thống" key="1">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" title="Tổng quan hệ thống">
                    <Space direction="vertical" size="small">
                      <DownloadButton
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-201 - Chiller water system schematic-Layout1.pdf';
                          link.download = 'VTB-FC-M-201 - Chiller water system schematic-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-201 - Sơ đồ hệ thống nước lạnh
                      </DownloadButton>
                                              <DownloadButton
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = '/documents/hvac-drawings/VTB-FC-M-202 - Ventilation system schematic-Layout1.pdf';
                            link.download = 'VTB-FC-M-202 - Ventilation system schematic-Layout1.pdf';
                            link.click();
                          }}
                        >
                          VTB-FC-M-202 - Sơ đồ hệ thống thông gió
                        </DownloadButton>
                    </Space>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="Danh sách thiết bị & Ký hiệu">
                    <Space direction="vertical" size="small">
                      <DownloadButton
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-301 - Mechanical equipment list -Layout1.pdf';
                          link.download = 'VTB-FC-M-301 - Mechanical equipment list -Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-301 - Danh sách thiết bị cơ khí
                      </DownloadButton>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-100 - Legend and symbol-Layout1.pdf';
                          link.download = 'VTB-FC-M-100 - Legend and symbol-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-100 - Ký hiệu và chú giải
                      </Button>
                    </Space>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="Chi tiết lắp đặt">
                    <Space direction="vertical" size="small">
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-101 - Detail of installation 1-Layout1.pdf';
                          link.download = 'VTB-FC-M-101 - Detail of installation 1-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-101 - Chi tiết lắp đặt 1
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-102 - Detail of installation 2-Layout1.pdf';
                          link.download = 'VTB-FC-M-102 - Detail of installation 2-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-102 - Chi tiết lắp đặt 2
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Hệ thống thông gió & Khói" key="2">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card size="small" title="Hệ thống thông gió">
                    <Space direction="vertical" size="small">
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-701 - Ventilation system in 1st FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-701 - Ventilation system in 1st FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-701 - Thông gió tầng 1
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-702 - Ventilation system in 2nd FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-702 - Ventilation system in 2nd FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-702 - Thông gió tầng 2
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-703 - Ventilation system in 3rd FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-703 - Ventilation system in 3rd FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-703 - Thông gió tầng 3
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-704 - Ventilation system in 4th FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-704 - Ventilation system in 4th FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-704 - Thông gió tầng 4
                      </Button>
                    </Space>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="Hệ thống thoát khói">
                    <Space direction="vertical" size="small">
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-801 - Smoke exhaust system in 1st FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-801 - Smoke exhaust system in 1st FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-801 - Thoát khói tầng 1
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-802 - Smoke exhaust system in 2nd FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-802 - Smoke exhaust system in 2nd FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-802 - Thoát khói tầng 2
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-803 - Smoke exhaust system in 3rd FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-803 - Smoke exhaust system in 3rd FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-803 - Thoát khói tầng 3
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-804 - Smoke exhaust system in 4th FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-804 - Smoke exhaust system in 4th FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-804 - Thoát khói tầng 4
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Bản vẽ hoàn công" key="3">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card size="small" title="Bản vẽ hoàn công HVAC">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Row gutter={[8, 8]}>
                        <Col span={8}>
                          <Button 
                            block
                            type="dashed"
                            icon={<DownloadOutlined />}
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = '/documents/hvac-drawings/VTB-AS-HVAC-Asbuilt drawing 04.Dec.pdf';
                              link.download = 'VTB-AS-HVAC-Asbuilt drawing 04.Dec.pdf';
                              link.click();
                            }}
                          >
                            Hoàn công 04.Dec
                          </Button>
                        </Col>
                        <Col span={8}>
                          <Button 
                            block
                            type="dashed"
                            icon={<DownloadOutlined />}
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = '/documents/hvac-drawings/VTB-AS-HVAC-Asbuilt drawing 31.Dec.pdf';
                              link.download = 'VTB-AS-HVAC-Asbuilt drawing 31.Dec.pdf';
                              link.click();
                            }}
                          >
                            Hoàn công 31.Dec
                          </Button>
                        </Col>
                        <Col span={8}>
                          <Button 
                            block
                            type="dashed"
                            icon={<DownloadOutlined />}
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = '/documents/hvac-drawings/VTB-AS-HVAC-Asbuilt drawing 31.Dec - R1.pdf';
                              link.download = 'VTB-AS-HVAC-Asbuilt drawing 31.Dec - R1.pdf';
                              link.click();
                            }}
                          >
                            Hoàn công 31.Dec R1
                          </Button>
                        </Col>
                      </Row>
                      <Alert
                        message="Bản vẽ hoàn công"
                        description="Các bản vẽ hoàn công thực tế phản ánh trạng thái cuối cùng của hệ thống sau khi thi công và nghiệm thu"
                        type="warning"
                        showIcon
                        size="small"
                      />
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Mặt bằng & Nước lạnh" key="4">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card size="small" title="Mặt bằng tầng">
                    <Space direction="vertical" size="small">
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-302- Layout of equipment on 1st FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-302- Layout of equipment on 1st FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-302 - Bố trí thiết bị tầng 1
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-303- Layout of equipment on 2nd FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-303- Layout of equipment on 2nd FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-303 - Bố trí thiết bị tầng 2
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-304- Layout of equipment on 4th FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-304- Layout of equipment on 4th FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-304 - Bố trí thiết bị tầng thượng
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-306- Layout of equipment on ceiling 1st FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-306- Layout of equipment on ceiling 1st FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-306 - Bố trí thiết bị trần tầng 1
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-307- Layout of equipment on ceiling 2nd FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-307- Layout of equipment on ceiling 2nd FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-307 - Bố trí thiết bị trần tầng 2
                      </Button>
                    </Space>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="Hệ thống nước lạnh">
                    <Space direction="vertical" size="small">
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-501 - Chiller water system for CRAC 1st FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-501 - Chiller water system for CRAC 1st FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-501 - Hệ thống nước lạnh tầng 1
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-502 - Chiller water system for CRAC 2nd FP rev1-Layout1.pdf';
                          link.download = 'VTB-FC-M-502 - Chiller water system for CRAC 2nd FP rev1-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-502 - Hệ thống nước lạnh tầng 2
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-503 - Chiller water system for CRAC 3rd FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-503 - Chiller water system for CRAC 3rd FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-503 - Hệ thống nước lạnh tầng 3
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-504 - Chiller water system for CRAC 4th FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-504 - Chiller water system for CRAC 4th FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-504 - Hệ thống nước lạnh tầng 4
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-505 - Chiller water system from TES water tank - Copy-Layout1.pdf';
                          link.download = 'VTB-FC-M-505 - Chiller water system from TES water tank - Copy-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-505 - Hệ thống nước lạnh từ bể TES
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Hệ thống khác" key="5">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card size="small" title="Hệ thống thoát nước">
                    <Space direction="vertical" size="small">
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-601 - Condenser drain pipe for CRAC 1st FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-601 - Condenser drain pipe for CRAC 1st FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-601 - Thoát nước CRAC tầng 1
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-602 - Condenser drain pipe for CRAC 2nd FP-Layout1.pdf';
                          link.download = 'VTB-FC-M-602 - Condenser drain pipe for CRAC 2nd FP-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-602 - Thoát nước CRAC tầng 2
                      </Button>
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-602-1 - Emergency drain pipe of 2nd floor-Layout1.pdf';
                          link.download = 'VTB-FC-M-602-1 - Emergency drain pipe of 2nd floor-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-602-1 - Thoát nước khẩn cấp tầng 2
                      </Button>
                    </Space>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="Shaft & Tài liệu tham khảo">
                    <Space direction="vertical" size="small">
                      <Button 
                        block
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-M-904 - HVAC shaft section view-Layout1.pdf';
                          link.download = 'VTB-FC-M-904 - HVAC shaft section view-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-M-904 - Mặt cắt shaft HVAC
                      </Button>
                      <Button 
                        block
                        type="default"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = '/documents/hvac-drawings/VTB-FC-001 - Drawing list-Layout1.pdf';
                          link.download = 'VTB-FC-001 - Drawing list-Layout1.pdf';
                          link.click();
                        }}
                      >
                        VTB-FC-001 - Danh sách bản vẽ
                      </Button>
                      
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      <Divider />

      <Alert
        message="Tham khảo bản vẽ kỹ thuật - Thư viện HVAC hoàn chỉnh"
        description={
          <div>
            <p><strong>Danh sách bản vẽ:</strong> VTB-FC-001 - Danh mục đầy đủ các bản vẽ HVAC</p>
            <p><strong>Ký hiệu & Chú giải:</strong> VTB-FC-M-100 - Ký hiệu và chú giải kỹ thuật</p>
            <p><strong>Chi tiết lắp đặt:</strong> VTB-FC-M-101, VTB-FC-M-102 - Chi tiết lắp đặt thiết bị</p>
            <p><strong>Sơ đồ hệ thống:</strong> VTB-FC-M-201 (nước lạnh), VTB-FC-M-202 (thông gió)</p>
            <p><strong>Danh sách thiết bị:</strong> VTB-FC-M-301 - Danh sách thiết bị cơ khí</p>
            <p><strong>Mặt bằng tầng:</strong> 5 bản vẽ bố trí thiết bị (VTB-FC-M-302~307)</p>
            <p><strong>Hệ thống nước lạnh:</strong> 5 bản vẽ schematic theo tầng (VTB-FC-M-501~505)</p>
            <p><strong>Hệ thống thoát nước:</strong> 3 bản vẽ đường ống thoát nước (VTB-FC-M-601~602)</p>
            <p><strong>Hệ thống thông gió:</strong> 4 bản vẽ thông gió theo tầng (VTB-FC-M-701~704)</p>
            <p><strong>Hệ thống thoát khói:</strong> 4 bản vẽ thoát khói theo tầng (VTB-FC-M-801~804)</p>
            <p><strong>Shaft HVAC:</strong> VTB-FC-M-904 - Mặt cắt shaft kỹ thuật</p>
            <p><strong>Bản vẽ hoàn công:</strong> 3 phiên bản bản vẽ as-built (VTB-AS-HVAC)</p>
            <br />            
          </div>
        }
        type="success"
        showIcon
        style={{ marginTop: '10px' }}
      />
    </div>
  );
};

export default DocumentationSection;
