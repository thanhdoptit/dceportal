import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { useState } from 'react';

const PasswordField = ({ password, label = 'Password:', style = {} }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Space style={style}>
        <span style={{ fontWeight: 'bold' }}>{label}</span>
        <Input
          value={password}
          type={showPassword ? 'text' : 'password'}
          readOnly
          style={{
            width: '120px',
            fontFamily: 'monospace',
            backgroundColor: '#f5f5f5',
          }}
          suffix={
            <Button
              type='text'
              size='small'
              icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={togglePasswordVisibility}
              style={{ border: 'none', padding: '0 4px' }}
            />
          }
        />
      </Space>
    </form>
  );
};

export default PasswordField;
