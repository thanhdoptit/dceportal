import {
  ApiOutlined,
  BulbOutlined,
  CloudOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  FireOutlined,
  KeyOutlined,
  MonitorOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Layout, Row, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DataCenterMenuPage.css';

const { Title, Text } = Typography;
const { Content } = Layout;

const DataCenterMenuPage = () => {
  const navigate = useNavigate();

  // Dữ liệu menu cho TTDL Hòa Lạc
  const hoaLacMenuItems = [
    {
      key: 'cooling',
      title: 'Hệ thống làm mát',
      icon: <CloudOutlined />,
      description: 'Quản lý và vận hành hệ thống điều hòa',
      route: '/dc/system-info/COOLING',
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
    },
    {
      key: 'UPS_DISTRIBUTION',
      title: 'Hệ thống phân phối điện',
      icon: <BulbOutlined />,
      description: 'UPS, ATS, tủ điện phân phối',
      route: '/dc/system-info/UPS_DISTRIBUTION',
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
    },
    
    {
      key: 'UPS',
      title: 'Hệ thống UPS',
      icon: <ThunderboltOutlined />,
      description: 'UPS, ATS, tủ điện phân phối',
      route: '/dc/system-info/UPS',
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)'
    },
    {
      key: 'FIRE_PROTECTION',
      title: 'Hệ thống PCCC',
      icon: <FireOutlined />,
      description: 'Báo cháy, chữa cháy tự động',
      route: '/dc/system-info/FIRE',
      color: '#fa541c',
      gradient: 'linear-gradient(135deg, #fa541c 0%, #d4380d 100%)'
    },
    {
       key: 'camera',
       title: 'Hệ thống giám sát hình ảnh',
       icon: <MonitorOutlined />,
       description: 'Camera, dụng cụ giám sát',
       route: '/dc/system-info/CAMERA',
       color: '#13c2c2',
       gradient: 'linear-gradient(135deg, #13c2c2 0%, #08979c 100%)'
     },
     {
       key: 'ACCESS_CONTROL',
       title: 'Hệ thống kiểm soát truy cập',
       icon: <KeyOutlined />,
       description: 'Kiểm soát truy cập, camera',
       route: '/dc/system-info/MAINTENANCE',
       color: '#fa8c16',
       gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)'
     },
    {
      key: 'INFRASTRUCTURE_MONITORING',
      title: 'Hệ thống giám sát hạ tầng',
      icon: <DashboardOutlined />,
      description: 'Giám sát hạ tầng ',
      route: '/dc/system-info/MONITORING',
      color: '#eb2f96',
      gradient: 'linear-gradient(135deg, #eb2f96 0%, #c41d7f 100%)'
    },
    {
      key: 'another',
      title: 'Hệ thống khác',
      icon: <ApiOutlined />,
      description: 'Hệ thống khác',
      route: '/dc/system-info/ANOTHER',
      color: '#eb2f99',
      gradient: 'linear-gradient(135deg, #eb2f99 0%, #c41d79 100%)'
    }
  ];

  // Dữ liệu menu cho TTDL Vân Canh
  const vanCanhMenuItems = [
    {
      key: 'cooling',
      title: 'Hệ thống làm mát',
      icon: <CloudOutlined />,
      description: 'Quản lý và vận hành hệ thống điều hòa',
      route: '/dc/system-info/COOLING',
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
    },
    {
      key: 'ups',
      title: 'Hệ thống UPS & Ắc quy',
      icon: <ThunderboltOutlined />,
      description: 'UPS Galaxy VL, ắc quy BMS, giám sát',
      route: '/dc/system-info/UPS',
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)'
    },
    {
      key: 'electric',
      title: 'Hệ thống phân phối điện',
      icon: <ThunderboltOutlined />,
      description: 'Tủ điện hạ thế, bảo vệ, điều khiển, chiếu sáng',
      route: '/dc/system-info/ELECTRIC',
      color: '#0072BC',
      gradient: 'linear-gradient(135deg, #0072BC 0%, #005c9b 100%)'
    }
  ];

  const handleCardClick = (route, datacenter) => {
    // Lấy prefix từ URL hiện tại (dc, manager, be)
    const currentPath = window.location.pathname;
    const prefix = currentPath.split('/')[1] || 'dc';
    
    console.log('handleCardClick - Route:', route);
    console.log('handleCardClick - Datacenter:', datacenter);
    console.log('handleCardClick - Prefix:', prefix);

    // Chỉ navigate đến prefix phù hợp với role hiện tại
    if (route === '/dc/system-info/COOLING') {
      // Chuyển đến cooling-system với prefix hiện tại và datacenter
      if (datacenter === 'hoalac') {
        navigate(`/${prefix}/cooling-system`);
      } else if (datacenter === 'vancanh') {
        navigate(`/${prefix}/cooling-system-vancanh`);
      } else {
        navigate(`/${prefix}/cooling-system`);
      }
    } else if (route === '/dc/system-info/UPS') {
      // Chuyển đến UPS system với prefix hiện tại và datacenter
      if (datacenter === 'vancanh') {
        console.log('Navigating to ups-vancanh');
        navigate(`/${prefix}/ups-vancanh`);
      } else {
        console.log('Navigating to ups-system');
        navigate(`/${prefix}/ups-system`);
      }
    } else if (route === '/dc/system-info/ELECTRIC') {
      // Chuyển đến Electric system với prefix hiện tại và datacenter
      if (datacenter === 'vancanh') {
        console.log('Navigating to electric-vancanh');
        navigate(`/${prefix}/electric-vancanh`);
      } else {
        console.log('Navigating to electric-system');
        navigate(`/${prefix}/electric-system`);
      }
    } else if (route === '/dc/system-info/UPS_DISTRIBUTION') {
      // Chuyển đến UPS distribution system
      navigate(`/${prefix}/ups-distribution`);
    } else if (route === '/dc/vancanh-overview') {
      // Chuyển đến Van Canh Overview
      navigate(`/${prefix}/vancanh-overview`);
    } else {
      // Chuyển về trang chính của role hiện tại
      navigate(`/${prefix}/shifts`);
    }
  };

  const renderMenuSection = (title, items, datacenterIcon) => (
    <div >
      {/* Header section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            color: 'white',
            fontSize: '20px'
          }}>
            {datacenterIcon}
          </div>
          <div>
            <Title level={4} style={{
              margin: 0,
              color: '#1a1a1a',
              fontWeight: '600',
              fontSize: '20px'
            }}>
              {title}
            </Title>
            <Text style={{
              color: '#666',
              fontSize: '13px'
            }}>
              Tài liệu hệ thống và hướng dẫn vận hành
            </Text>
          </div>
        </div>

        {/* System count badge and overview button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* System count badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'rgba(24, 144, 255, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(24, 144, 255, 0.2)'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#1890ff'
            }} />
            <Text style={{
              fontSize: '11px',
              color: '#1890ff',
              fontWeight: '600'
            }}>
              {items.length} hệ thống
            </Text>
          </div>

          {/* Overview button - chỉ hiển thị cho TTDL Vân Canh */}
          {title === 'TTDL Vân Canh' && (
            <Button
              type="primary"
              size="small"
              icon={<DatabaseOutlined />}
              style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                borderRadius: '16px',
                height: '32px',
                padding: '0 16px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={() => {
                const currentPath = window.location.pathname;
                const prefix = currentPath.split('/')[1] || 'dc';
                navigate(`/${prefix}/vancanh-overview`);
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(24, 144, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.3)';
              }}
            >
              Giới thiệu chung
            </Button>
          )}
        </div>
      </div>

      {/* Menu items */}
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col xs={24} sm={12} key={item.key}>
            <Card
              hoverable
              className="system-menu-card"
              style={{
                height: '90px',
                backgroundColor: '#ffffff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                padding: '5px',
                '--card-gradient': item.gradient
              }}
              styles={{
                body: {
                  padding: '10px',
                  height: '100%'
                }
              }}
              onClick={() => handleCardClick(item.route, title === 'TTDL Hòa Lạc' ? 'hoalac' : 'vancanh')}
            >
              {/* Content */}
              <div className="card-content">
                {/* Icon and title on same line */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    fontSize: '26px',
                    color: item.color,
                    marginRight: '14px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${item.color}10`
                  }}>
                    {item.icon}
                  </div>
                  <Title level={5} style={{
                    margin: 0,
                    color: '#1a1a1a',
                    fontSize: '16px',
                    fontWeight: '600',
                    lineHeight: '1.3',
                    flex: 1
                  }}>
                    {item.title}
                  </Title>
                </div>

                {/* Description */}
                <Text style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.4',
                  display: 'block',
                }}>
                  {item.description}
                </Text>

               
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <div style={{
      minHeight: 'calc(100vh - 73px)',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1480px',
        margin: '0 auto'
      }}>
        {/* Main header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          padding: '40px 30px',
          height: '270px',
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 30%, #0050b3 70%, #003a8c 100%)',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(24, 144, 255, 0.25), 0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(24, 144, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 40%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(255,255,255,0.08) 0%, transparent 30%)',
            animation: 'float 6s ease-in-out infinite',
            pointerEvents: 'none'
          }} />

          {/* Floating particles */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            width: '8px',
            height: '8px',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '50%',
            animation: 'pulse 3s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '20%',
            width: '6px',
            height: '6px',
            background: 'rgba(255,255,255,0.4)',
            borderRadius: '50%',
            animation: 'pulse 4s ease-in-out infinite 1s'
          }} />
          <div style={{
            position: 'absolute',
            top: '30%',
            right: '10%',
            width: '4px',
            height: '4px',
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '50%',
            animation: 'pulse 5s ease-in-out infinite 2s'
          }} />

          {/* Main content */}
          <div style={{
            position: 'relative',
            zIndex: 2
          }}>
            {/* Icon container with glow effect */}
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#1890ff',
              fontSize: '32px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)',
              position: 'relative',
              animation: 'float 4s ease-in-out infinite'
            }}>
              <EnvironmentOutlined />
              {/* Glow effect */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                right: '-8px',
                bottom: '-8px',
                background: 'radial-gradient(circle, rgba(24, 144, 255, 0.3) 0%, transparent 70%)',
                borderRadius: '26px',
                filter: 'blur(6px)',
                zIndex: -1
              }} />
            </div>

            {/* Title with enhanced styling */}
            <Title level={1} style={{
              margin: '0 0 12px 0',
              fontWeight: '800',
              fontSize: '32px',
              color: '#ffffff',
              textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
              letterSpacing: '-0.5px',
              lineHeight: '1.2'
            }}>
              Tài liệu các hệ thống Trung Tâm Dữ Liệu
            </Title>

            {/* Subtitle with modern styling */}
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <Text style={{
                fontSize: '14px',
                color: '#ffffff',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                margin: 0
              }}>
                🚀 Tổng hợp tài liệu hướng dẫn và quy trình vận hành 🚀
              </Text>
            </div>
          </div>
        </div>

        {/* Menu sections */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              {renderMenuSection('TTDL Hòa Lạc', hoaLacMenuItems, <EnvironmentOutlined />)}
            </Col>
            <Col xs={24} lg={12}>
              {renderMenuSection('TTDL Vân Canh', vanCanhMenuItems, <EnvironmentOutlined />)}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default DataCenterMenuPage;
