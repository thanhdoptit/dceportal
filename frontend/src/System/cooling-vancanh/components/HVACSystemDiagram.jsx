import React, { useState } from 'react';
import { Card, Tooltip, Tag, Row, Col } from 'antd';

const HVACSystemDiagram = () => {
  const [selectedFloor, setSelectedFloor] = useState(null);

  const floorData = {
    'tangThuong': {
      name: 'Tầng thượng (Terrace Floor)',
      equipment: [
        '3x Chiller SMARDT AE Series (632kW/180RT)',
        '3x Pump PCH-01,02,03 (25.3L/s, 40mH2O)',
        '1x PAU-01 (850L/s) - Xử lý không khí tươi',
        'Hệ thống TES (360m³) - Bể dự trữ nước lạnh'
      ],
      color: '#1890ff'
    },
    'tang3': {
      name: 'Tầng 3 (3rd Floor)',
      equipment: [
        'Khu vực văn phòng',
        'Phòng Hub (Hub Room)',
        'Hệ thống thông gió và hút khói'
      ],
      color: '#52c41a'
    },
    'tang2': {
      name: 'Tầng 2 (2nd Floor)',
      equipment: [
        '2x FCU-TL (Fan Coil Unit)',
        '4x FCU-HR (Fan Coil Unit)',
        'Phòng Hub (Hub Room)',
        'Thư viện băng (Tape Library)',
        'Phòng ắc quy (Battery Room A)',
        'Phòng điện (Electrical Room A)',
        'Hệ thống thông gió và hút khói'
      ],
      color: '#13c2c2'
    },
    'tang1': {
      name: 'Tầng 1 (1st Floor) - DC Hall',
      equipment: [
        '8x CRAC-DCH (102.8kW/32RT) - DC Hall chính',
        '6x INROW-DCH (21.6kW) - DC Hall chính',
        '4x CRAC-ER (64.4-79.8kW) - Phòng điện',
        '4x CRAC-BR (9.5-15.6kW) - Phòng ắc quy',
        '4x CRAC-ISP (15.6-16.8kW) - Phòng ISP',
        '2x CRAC-STR (11.8kW) - Phòng server',
        '2x CRAC-SMR (7.2kW) - Phòng server',
        'Phòng an ninh (Security)',
        'Phòng giám sát (Monitoring Room)'
      ],
      color: '#f5222d'
    }
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <Card>
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#1890ff' }}>
          🏢 Sơ đồ bố trí tổng thể - TTDL Vân Canh
        </h3>
        
        {/* Main HVAC System Diagram */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <svg width="1000" height="600" viewBox="0 0 1000 600" style={{ border: '2px solid #d9d9d9', borderRadius: '8px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            
            {/* Building Structure */}
            <rect x="300" y="50" width="400" height="335" fill="none" stroke="#595959" strokeWidth="3" rx="5"/>
            
            {/* Tầng thượng - Thiết bị chính */}
            <rect 
              x="310" y="60" width="380" height="60" 
              fill={selectedFloor === 'tangThuong' ? '#1890ff' : '#e6f7ff'} 
              stroke="#1890ff" strokeWidth="2" rx="5"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedFloor(selectedFloor === 'tangThuong' ? null : 'tangThuong')}
            />
            <text x="500" y="85" textAnchor="middle" fontSize="14" fontWeight="bold" fill={selectedFloor === 'tangThuong' ? 'white' : '#1890ff'}>Tầng thượng</text>
            <text x="500" y="105" textAnchor="middle" fontSize="12" fill={selectedFloor === 'tangThuong' ? 'white' : '#1890ff'}>3×Chiller + 3×Pump + 1×PAU</text>
            

            
            {/* Tầng 3 */}
            <rect 
              x="310" y="140" width="380" height="50" 
              fill={selectedFloor === 'tang3' ? '#52c41a' : '#f6ffed'} 
              stroke="#52c41a" strokeWidth="2" rx="5"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedFloor(selectedFloor === 'tang3' ? null : 'tang3')}
            />
            <text x="500" y="165" textAnchor="middle" fontSize="14" fontWeight="bold" fill={selectedFloor === 'tang3' ? 'white' : '#52c41a'}>Tầng 3</text>
            <text x="500" y="180" textAnchor="middle" fontSize="11" fill={selectedFloor === 'tang3' ? 'white' : '#52c41a'}>Khu vực văn phòng, Phòng Hub</text>
            
            {/* Tầng 2 */}
            <rect 
              x="310" y="210" width="380" height="50" 
              fill={selectedFloor === 'tang2' ? '#13c2c2' : '#e6fffb'} 
              stroke="#13c2c2" strokeWidth="2" rx="5"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedFloor(selectedFloor === 'tang2' ? null : 'tang2')}
            />
            <text x="500" y="235" textAnchor="middle" fontSize="14" fontWeight="bold" fill={selectedFloor === 'tang2' ? 'white' : '#13c2c2'}>Tầng 2</text>
            <text x="500" y="250" textAnchor="middle" fontSize="11" fill={selectedFloor === 'tang2' ? 'white' : '#13c2c2'}>FCU-TL, FCU-HR, Phòng Hub</text>
            
            {/* Tầng 1 - Tầng DC chính */}
            <rect 
              x="310" y="280" width="380" height="80" 
              fill={selectedFloor === 'tang1' ? '#f5222d' : '#fff2f0'} 
              stroke="#f5222d" strokeWidth="3" rx="5"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedFloor(selectedFloor === 'tang1' ? null : 'tang1')}
            />
            <text x="500" y="305" textAnchor="middle" fontSize="14" fontWeight="bold" fill={selectedFloor === 'tang1' ? 'white' : '#f5222d'}>Tầng 1 - DC Hall</text>
            <text x="500" y="325" textAnchor="middle" fontSize="11" fill={selectedFloor === 'tang1' ? 'white' : '#f5222d'}>8×CRAC-DCH + 6×INROW</text>
            <text x="500" y="340" textAnchor="middle" fontSize="10" fill={selectedFloor === 'tang1' ? 'white' : '#f5222d'}>CRAC-ER, CRAC-BR, CRAC-ISP</text>
            
            {/* Chilled Water Flow Arrows */}
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#000000" />
              </marker>
            </defs>
            
            {/* Main chilled water supply lines - Nước từ tầng thượng xuống các tầng */}
            <line x1="500" y1="120" x2="500" y2="140" stroke="#000000" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="500" y1="190" x2="500" y2="210" stroke="#000000" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            <line x1="500" y1="260" x2="500" y2="280" stroke="#000000" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            
            {/* Side Equipment Labels */}
            <text x="50" y="90" fontSize="12" fontWeight="bold" fill="#1890ff">❄️ Chiller System</text>
            <text x="50" y="110" fontSize="10" fill="#666">• 3×632kW/180RT Air-cooled</text>
            <text x="50" y="125" fontSize="10" fill="#666">• SMARDT AE Series Oil-free</text>
            <text x="50" y="140" fontSize="10" fill="#666">• 2 running, 1 backup (N+1)</text>
            
            <text x="750" y="90" fontSize="12" fontWeight="bold" fill="#52c41a">🌊 Pump System</text>
            <text x="750" y="110" fontSize="10" fill="#666">• 3×25.3 L/s, 40mH2O</text>
            <text x="750" y="125" fontSize="10" fill="#666">• 22kW each, VFD control</text>
            <text x="750" y="140" fontSize="10" fill="#666">• 2 running, 1 standby (2N+1)</text>
            
            <text x="50" y="200" fontSize="12" fontWeight="bold" fill="#faad14">🏭 PAU System</text>
            <text x="50" y="220" fontSize="10" fill="#666">• 1×850 L/s</text>
            <text x="50" y="235" fontSize="10" fill="#666">• Xử lý không khí tươi</text>
            
            <text x="750" y="200" fontSize="12" fontWeight="bold" fill="#f5222d">🏢 CRAC Systems</text>
            <text x="750" y="220" fontSize="10" fill="#666">• 8×DCH: 102.8kW/32RT</text>
            <text x="750" y="235" fontSize="10" fill="#666">• 6×INROW: 21.6kW</text>
            <text x="750" y="250" fontSize="10" fill="#666">• 4×ER: 64.4-79.8kW</text>
            <text x="750" y="265" fontSize="10" fill="#666">• 4×BR: 9.5-15.6kW</text>
            
            {/* TES Tank */}
            <circle cx="150" cy="390" r="25" fill="#13c2c2" stroke="#13c2c2" strokeWidth="2"/>
            <text x="150" y="395" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">TES</text>
            <text x="150" y="425" textAnchor="middle" fontSize="10" fill="#13c2c2">Bể TES</text>
            
            {/* TES Connection - Nước từ TES: lên → ngang → xuống đến khung trên tầng thượng */}
            <line x1="175" y1="390" x2="200" y2="390" stroke="#000000" strokeWidth="3"/>
            <line x1="200" y1="390" x2="200" y2="30" stroke="#000000" strokeWidth="3"/>
            <line x1="200" y1="30" x2="500" y2="30" stroke="#000000" strokeWidth="3"/>
            <line x1="500" y1="30" x2="500" y2="60" stroke="#000000" strokeWidth="3"/>
            
            {/* Temperature indicators */}
            <text x="50" y="520" fontSize="11" fontWeight="bold" fill="#1890ff">🌡️ Nước lạnh:</text>
            <text x="50" y="535" fontSize="10" fill="#666">• Cấp: 12°C</text>
            <text x="50" y="550" fontSize="10" fill="#666">• Hồi: 18°C</text>
            
            <text x="750" y="520" fontSize="11" fontWeight="bold" fill="#f5222d">⚡ Tổng công suất:</text>
            <text x="750" y="535" fontSize="10" fill="#666">• Làm lạnh: ~1,896kW</text>
            <text x="750" y="550" fontSize="10" fill="#666">• Dự phòng: N+1 cho Chiller, 2N+1 cho bơm</text>
            
          </svg>
        </div>
        
        {/* Equipment Details Panel */}
        {selectedFloor && (
          <Card 
            title={`Chi tiết thiết bị - ${floorData[selectedFloor].name}`}
            style={{ 
              marginTop: '20px', 
              borderColor: floorData[selectedFloor].color,
              borderWidth: '2px'
            }}
            headStyle={{ 
              backgroundColor: floorData[selectedFloor].color + '20',
              color: floorData[selectedFloor].color
            }}
          >
            <Row gutter={[16, 16]}>
              {floorData[selectedFloor].equipment.map((item, index) => (
                <Col span={24} key={index}>
                  <Tag 
                    color={floorData[selectedFloor].color} 
                    style={{ 
                      padding: '8px 12px', 
                      fontSize: '12px',
                      marginBottom: '8px',
                      borderRadius: '6px'
                    }}
                  >
                    {item}
                  </Tag>
                </Col>
              ))}
            </Row>
          </Card>
        )}
        
        {/* Legend */}
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          background: '#fafafa', 
          borderRadius: '8px',
          border: '1px solid #d9d9d9'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#595959' }}>📋 Chú giải:</h4>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <span style={{ color: '#000000' }}>⬇️</span> <strong>Đường nước lạnh chính</strong> - Từ tầng thượng xuống các tầng
            </Col>
            <Col span={12}>
              <span style={{ color: '#13c2c2' }}>🔵</span> <strong>Đường kết nối TES</strong> - Nước từ bể TES lên tầng thượng
            </Col>
            <Col span={12}>
              <span>❄️</span> <strong>Chiller:</strong> Máy làm lạnh nước trung tâm
            </Col>
            <Col span={12}>
              <span>🌊</span> <strong>Pump:</strong> Bơm tuần hoàn nước lạnh
            </Col>
            <Col span={12}>
              <span>🏢</span> <strong>CRAC:</strong> Máy điều hòa phòng máy tính
            </Col>
            <Col span={12}>
              <span>📦</span> <strong>INROW:</strong> Điều hòa dạng hàng (InRow)
            </Col>
          </Row>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
            💡 <strong>Lưu ý:</strong> Click vào từng tầng để xem chi tiết thiết bị. Hệ thống được thiết kế với độ dự phòng N+1 cho Chiller và 2N+1 cho bơm để đảm bảo hoạt động liên tục 24/7. Tổng công suất làm lạnh ~1,896kW.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HVACSystemDiagram;