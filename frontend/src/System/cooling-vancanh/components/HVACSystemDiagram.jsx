import React, { useState } from 'react';
import { Card, Tooltip, Tag, Row, Col } from 'antd';

const HVACSystemDiagram = () => {
  const [selectedFloor, setSelectedFloor] = useState(null);

  const floorData = {
    'tangThuong': {
      name: 'Tầng thượng',
      equipment: ['3x Chiller CH-01,02,03 (632kW)', '3x Pump P-01,02,03 (25.3L/s)', '1x PAU-01 (850L/s)'],
      color: '#1890ff'
    },
    'tang4': {
      name: 'Tầng 4', 
      equipment: ['Khu vực kỹ thuật', 'Thiết bị HVAC'],
      color: '#faad14'
    },
    'tang3': {
      name: 'Tầng 3',
      equipment: ['Khu vực văn phòng', 'Phòng Hub'],
      color: '#52c41a'
    },
    'tang2': {
      name: 'Tầng 2',
      equipment: ['2x FCU-TL', '4x FCU-HR', 'Phòng Hub', 'Thư viện băng'],
      color: '#13c2c2'
    },
    'tang1': {
      name: 'Tầng 1',
      equipment: [
        '8x CRAC-DCH (102.8kW) - DC Hall',
        '6x INROW-DCH (21.6kW) - DC Hall', 
        '4x CRAC-ER (64.4-79.8kW) - Phòng điện',
        '4x CRAC-BR (9.5-15.6kW) - Phòng ắc quy',
        '4x CRAC-ISP - Phòng ISP'
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
          <svg width="800" height="500" viewBox="0 0 800 500" style={{ border: '2px solid #d9d9d9', borderRadius: '8px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            
            {/* Building Structure */}
            <rect x="250" y="50" width="300" height="400" fill="none" stroke="#595959" strokeWidth="3" rx="5"/>
            
            {/* Tầng thượng - Thiết bị chính */}
            <rect 
              x="260" y="60" width="280" height="60" 
              fill={selectedFloor === 'tangThuong' ? '#1890ff' : '#e6f7ff'} 
              stroke="#1890ff" strokeWidth="2" rx="5"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedFloor(selectedFloor === 'tangThuong' ? null : 'tangThuong')}
            />
            <text x="400" y="85" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1890ff">Tầng thượng</text>
            <text x="400" y="105" textAnchor="middle" fontSize="12" fill="#1890ff">3×Chiller + 3×Pump + 1×PAU</text>
            
            {/* Tầng 4 */}
            <rect 
              x="260" y="140" width="280" height="50" 
              fill={selectedFloor === 'tang4' ? '#faad14' : '#fff7e6'} 
              stroke="#faad14" strokeWidth="2" rx="5"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedFloor(selectedFloor === 'tang4' ? null : 'tang4')}
            />
            <text x="400" y="165" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#faad14">Tầng 4</text>
            <text x="400" y="180" textAnchor="middle" fontSize="11" fill="#faad14">Khu vực kỹ thuật</text>
            
            {/* Tầng 3 */}
            <rect 
              x="260" y="210" width="280" height="50" 
              fill={selectedFloor === 'tang3' ? '#52c41a' : '#f6ffed'} 
              stroke="#52c41a" strokeWidth="2" rx="5"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedFloor(selectedFloor === 'tang3' ? null : 'tang3')}
            />
            <text x="400" y="235" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#52c41a">Tầng 3</text>
            <text x="400" y="250" textAnchor="middle" fontSize="11" fill="#52c41a">Khu vực văn phòng, Phòng Hub</text>
            
            {/* Tầng 2 */}
            <rect 
              x="260" y="280" width="280" height="50" 
              fill={selectedFloor === 'tang2' ? '#13c2c2' : '#e6fffb'} 
              stroke="#13c2c2" strokeWidth="2" rx="5"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedFloor(selectedFloor === 'tang2' ? null : 'tang2')}
            />
            <text x="400" y="305" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#13c2c2">Tầng 2</text>
            <text x="400" y="320" textAnchor="middle" fontSize="11" fill="#13c2c2">FCU-TL, FCU-HR, Phòng Hub</text>
            
            {/* Tầng 1 - Tầng DC chính */}
            <rect 
              x="260" y="350" width="280" height="80" 
              fill={selectedFloor === 'tang1' ? '#f5222d' : '#fff2f0'} 
              stroke="#f5222d" strokeWidth="3" rx="5"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedFloor(selectedFloor === 'tang1' ? null : 'tang1')}
            />
            <text x="400" y="375" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#f5222d">Tầng 1 - DC Hall</text>
            <text x="400" y="395" textAnchor="middle" fontSize="11" fill="#f5222d">8×CRAC-DCH + 6×INROW</text>
            <text x="400" y="410" textAnchor="middle" fontSize="10" fill="#f5222d">CRAC-ER, CRAC-BR, CRAC-ISP</text>
            
            {/* Chilled Water Flow Arrows */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#1890ff" />
              </marker>
            </defs>
            
            {/* Main chilled water supply lines */}
            <line x1="400" y1="120" x2="400" y2="140" stroke="#1890ff" strokeWidth="4" markerEnd="url(#arrowhead)"/>
            <line x1="400" y1="190" x2="400" y2="210" stroke="#1890ff" strokeWidth="4" markerEnd="url(#arrowhead)"/>
            <line x1="400" y1="260" x2="400" y2="280" stroke="#1890ff" strokeWidth="4" markerEnd="url(#arrowhead)"/>
            <line x1="400" y1="330" x2="400" y2="350" stroke="#1890ff" strokeWidth="4" markerEnd="url(#arrowhead)"/>
            
            {/* Side Equipment Labels */}
            <text x="80" y="90" fontSize="12" fontWeight="bold" fill="#1890ff">❄️ Chiller System</text>
            <text x="80" y="110" fontSize="10" fill="#666">• 3×632kW Air-cooled</text>
            <text x="80" y="125" fontSize="10" fill="#666">• VFD driven</text>
            <text x="80" y="140" fontSize="10" fill="#666">• 2 running, 1 backup</text>
            
            <text x="580" y="90" fontSize="12" fontWeight="bold" fill="#52c41a">🌊 Pump System</text>
            <text x="580" y="110" fontSize="10" fill="#666">• 3×25.3 L/s, 40mH2O</text>
            <text x="580" y="125" fontSize="10" fill="#666">• 22kW each, VSD</text>
            <text x="580" y="140" fontSize="10" fill="#666">• 2 running, 1 standby</text>
            
            <text x="80" y="200" fontSize="12" fontWeight="bold" fill="#faad14">🏭 PAU System</text>
            <text x="80" y="220" fontSize="10" fill="#666">• 1×850 L/s</text>
            <text x="80" y="235" fontSize="10" fill="#666">• Xử lý không khí tươi</text>
            
            <text x="580" y="200" fontSize="12" fontWeight="bold" fill="#f5222d">🏢 CRAC Systems</text>
            <text x="580" y="220" fontSize="10" fill="#666">• 8×DCH: 102.8kW</text>
            <text x="580" y="235" fontSize="10" fill="#666">• 6×INROW: 21.6kW</text>
            <text x="580" y="250" fontSize="10" fill="#666">• 4×ER: 64.4-79.8kW</text>
            <text x="580" y="265" fontSize="10" fill="#666">• 4×BR: 9.5-15.6kW</text>
            
            {/* TES Tank */}
            <circle cx="150" cy="390" r="25" fill="#13c2c2" stroke="#13c2c2" strokeWidth="2"/>
            <text x="150" y="395" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">TES</text>
            <text x="150" y="425" textAnchor="middle" fontSize="10" fill="#13c2c2">Bể TES</text>
            
            {/* TES Connection */}
            <line x1="175" y1="390" x2="260" y2="390" stroke="#13c2c2" strokeWidth="3" strokeDasharray="5,5" markerEnd="url(#arrowhead)"/>
            
            {/* Temperature indicators */}
            <text x="50" y="460" fontSize="11" fontWeight="bold" fill="#1890ff">🌡️ Nước lạnh:</text>
            <text x="50" y="475" fontSize="10" fill="#666">• Cấp: 12°C</text>
            <text x="50" y="490" fontSize="10" fill="#666">• Hồi: 18°C</text>
            
            <text x="600" y="460" fontSize="11" fontWeight="bold" fill="#f5222d">⚡ Tổng công suất:</text>
            <text x="600" y="475" fontSize="10" fill="#666">• Làm lạnh: ~1500kW</text>
            <text x="600" y="490" fontSize="10" fill="#666">• Dự phòng: N+1</text>
            
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
              <span style={{ color: '#1890ff' }}>🔵</span> <strong>Đường nước lạnh chính</strong> - Từ tầng thượng xuống các tầng
            </Col>
            <Col span={12}>
              <span style={{ color: '#13c2c2' }}>🔵</span> <strong>Đường kết nối TES</strong> - Hệ thống dự trữ nhiệt
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
            💡 <strong>Lưu ý:</strong> Click vào từng tầng để xem chi tiết thiết bị. Hệ thống được thiết kế với độ dự phòng N+1 để đảm bảo hoạt động liên tục.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HVACSystemDiagram;