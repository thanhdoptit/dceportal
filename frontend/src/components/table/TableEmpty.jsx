import React from 'react';
import PropTypes from 'prop-types';
import { Empty } from 'antd';
import { twMerge } from 'tailwind-merge';

export default function TableEmpty({ description = 'Không có dữ liệu', className }) {
  return (
    <div className={twMerge('py-8', className)}>
      <Empty description={description} />
    </div>
  );
}

TableEmpty.propTypes = {
  description: PropTypes.string,
  className: PropTypes.string
}; 