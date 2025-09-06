import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ActionGuard = ({ action, children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const checkPermission = () => {
    // Danh sách các action và quyền tương ứng
    const actionPermissions = {
      edit_shift_check: ['datacenter', 'manager'],
      create_shift_check: ['datacenter'],
      delete_shift_check: ['datacenter', 'manager'],
      view_shift_check: ['datacenter', 'manager', 'be'],
    };

    const allowedRoles = actionPermissions[action] || [];
    return allowedRoles.includes(currentUser?.role?.toLowerCase());
  };

  if (!checkPermission()) {
    return (
      <Result
        status='403'
        title='Không có quyền truy cập'
        subTitle='Bạn không có quyền thực hiện hành động này'
        extra={[
          <Button type='primary' key='back' onClick={() => navigate('/dc/shift-check')}>
            Quay lại
          </Button>,
        ]}
      />
    );
  }

  return children;
};

export default ActionGuard;
