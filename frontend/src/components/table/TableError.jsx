import React from 'react';
import PropTypes from 'prop-types';
import { Result, Button } from 'antd';
import { twMerge } from 'tailwind-merge';

export default function TableError({ message = 'Có lỗi xảy ra', className }) {
  return (
    <div className={twMerge('py-8', className)}>
      <Result
        status='error'
        title='Lỗi'
        subTitle={message}
        extra={[
          <Button type='primary' key='reload' onClick={() => window.location.reload()}>
            Thử lại
          </Button>,
        ]}
      />
    </div>
  );
}

TableError.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};
