import React from 'react';
import { Layout, Card, Row, Col, Typography, Space, Button } from 'antd';
import {
  CloudOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  WifiOutlined,
  DatabaseOutlined,
  ToolOutlined,
  SettingOutlined,
  RightOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
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
      key: 'electrical',
      title: 'Hệ thống điện',
      icon: <ThunderboltOutlined />,
      description: 'UPS, ATS, tủ điện phân phối',
      route: '/dc/system-info/ELECTRICAL',
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
    },
    {
      key: 'fire',
      title: 'Hệ thống PCCC',
      icon: <SafetyOutlined />,
      description: 'Báo cháy, chữa cháy tự động',
      route: '/dc/system-info/FIRE',
      color: '#fa541c',
      gradient: 'linear-gradient(135deg, #fa541c 0%, #d4380d 100%)'
    },
    /* {
      key: 'network',
      title: 'Hệ thống mạng',
      icon: <WifiOutlined />,
      description: 'Switch, router, cáp mạng',
      route: '/dc/system-info/NETWORK',
      color: '#722ed1',
      gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)'
    },
    {
       key: 'server',
       title: 'Hệ thống máy chủ',
       icon: <DatabaseOutlined />,
       description: 'Server, storage, backup',
       route: '/dc/system-info/SERVER',
       color: '#13c2c2',
       gradient: 'linear-gradient(135deg, #13c2c2 0%, #08979c 100%)'
     },
     {
       key: 'maintenance',
       title: 'Bảo trì bảo dưỡng',
       icon: <ToolOutlined />,
       description: 'Lịch trình và quy trình bảo trì',
       route: '/dc/system-info/MAINTENANCE',
       color: '#fa8c16',
       gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)'
     },*/
    {
      key: 'monitoring',
      title: 'Giám sát hệ thống',
      icon: <SettingOutlined />,
      description: 'DCIM, cảm biến, cảnh báo',
      route: '/dc/system-info/MONITORING',
      color: '#eb2f96',
      gradient: 'linear-gradient(135deg, #eb2f96 0%, #c41d7f 100%)'
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
      color: '#1890ff',
      gradient: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
    },
    {
      key: 'electrical',
      title: 'Hệ thống điện',
      icon: <ThunderboltOutlined />,
      description: 'UPS, ATS, tủ điện phân phối',
      route: '/dc/system-info/ELECTRICAL',
      color: '#52c41a',
      gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
    }
  ];

  const handleCardClick = (route, datacenter) => {
    // Lấy prefix từ URL hiện tại (dc, manager, be)
    const currentPath = window.location.pathname;
    const prefix = currentPath.split('/')[1] || 'dc';

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
    } else {
      // Chuyển về trang chính của role hiện tại
      navigate(`/${prefix}/shifts`);
    }
  };

  const renderMenuSection = (title, items, datacenterIcon) => (
    <div style={{ marginBottom: '40px' }}>
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
      </div>

      {/* Menu items */}
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col xs={24} sm={12} key={item.key}>
            <Card
              hoverable
              className="system-menu-card"
              style={{
                height: '120px',
                backgroundColor: '#ffffff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                '--card-gradient': item.gradient
              }}
              styles={{
                body: {
                  padding: '18px',
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
                  display: 'block'
                }}>
                  {item.description}
                </Text>

                {/* Arrow icon */}
                <div className="card-arrow" style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  color: item.color,
                  fontSize: '14px',
                  opacity: '0.6',
                  transition: 'all 0.3s ease'
                }}>
                  <RightOutlined />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Main header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          padding: '40px 30px',
          background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 30%, #0050b3 70%, #003a8c 100%)',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(24, 144, 255, 0.25), 0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(24, 144, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden'
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
