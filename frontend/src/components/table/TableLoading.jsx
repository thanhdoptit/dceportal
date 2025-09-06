import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { twMerge } from 'tailwind-merge';

export default function TableLoading({ className }) {
  return (
    <div className={twMerge('flex justify-center items-center py-8', className)}>
      <Spin size='large' />
    </div>
  );
}

TableLoading.propTypes = {
  className: PropTypes.string,
};
