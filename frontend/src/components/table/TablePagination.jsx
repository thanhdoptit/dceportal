import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import { twMerge } from 'tailwind-merge';

export default function TablePagination({ current, total, onChange, className }) {
  return (
    <div className={twMerge('mt-4 flex justify-end', className)}>
      <Pagination
        current={current}
        total={total}
        onChange={onChange}
        showSizeChanger
        showQuickJumper
        showTotal={total => `Tổng số ${total} mục`}
      />
    </div>
  );
}

TablePagination.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
