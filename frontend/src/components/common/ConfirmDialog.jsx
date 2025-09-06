import React from 'react';
import { Modal } from 'antd';

const ConfirmDialog = ({
  visible,
  title,
  content,
  onOk,
  onCancel,
  okText = 'Xác nhận',
  cancelText = 'Hủy',
  okType = 'danger',
}) => (
  <Modal
    title={title}
    open={visible}
    onOk={onOk}
    onCancel={onCancel}
    okText={okText}
    cancelText={cancelText}
    okType={okType}
  >
    <p>{content}</p>
  </Modal>
);

export default ConfirmDialog;
