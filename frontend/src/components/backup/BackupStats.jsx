import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { 
  DatabaseOutlined, 
  SyncOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const BackupStats = ({ stats }) => {
  const {
    total = 0,
    running = 0,
    completed = 0,
    failed = 0,
    pending = 0,
    completed_with_warnings = 0
  } = stats;

  // Tính phần trăm
  const getPercentage = (value) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  // Tính tỷ lệ thành công
  const successRate = total > 0 ? Math.round(((completed + completed_with_warnings) / total) * 100) : 0;

  return (
    <div className="backup-stats">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số Jobs"
              value={total}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress 
              percent={100} 
              showInfo={false} 
              strokeColor="#1890ff"
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang chạy"
              value={running}
              prefix={<SyncOutlined spin />}
              valueStyle={{ color: '#faad14' }}
            />
            <Progress 
              percent={getPercentage(running)} 
              showInfo={false} 
              strokeColor="#faad14"
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={getPercentage(completed)} 
              showInfo={false} 
              strokeColor="#52c41a"
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lỗi"
              value={failed}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <Progress 
              percent={getPercentage(failed)} 
              showInfo={false} 
              strokeColor="#ff4d4f"
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#8c8c8c' }}
            />
            <Progress 
              percent={getPercentage(pending)} 
              showInfo={false} 
              strokeColor="#8c8c8c"
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Hoàn thành có cảnh báo"
              value={completed_with_warnings}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <Progress 
              percent={getPercentage(completed_with_warnings)} 
              showInfo={false} 
              strokeColor="#fa8c16"
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={12}>
          <Card>
            <Statistic
              title="Tỷ lệ thành công"
              value={successRate}
              suffix="%"
              valueStyle={{ color: successRate >= 90 ? '#52c41a' : successRate >= 70 ? '#faad14' : '#ff4d4f' }}
            />
            <Progress 
              percent={successRate} 
              showInfo={false} 
              strokeColor={successRate >= 90 ? '#52c41a' : successRate >= 70 ? '#faad14' : '#ff4d4f'}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BackupStats; 