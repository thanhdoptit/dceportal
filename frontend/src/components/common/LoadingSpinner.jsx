import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = ({ tip }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '50px 0'
    }}>
      <Spin tip={tip} size="large">
        <div className="content" style={{ padding: '50px' }} />
      </Spin>
    </div>
  );
};

export default LoadingSpinner; 