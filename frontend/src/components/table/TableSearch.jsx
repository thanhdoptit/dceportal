import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { twMerge } from 'tailwind-merge';

export default function TableSearch({ value, onChange, placeholder = 'Tìm kiếm...', className }) {
  return (
    <div className={twMerge('mb-4', className)}>
      <Input
        prefix={<SearchOutlined />}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-md"
      />
    </div>
  );
}

TableSearch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string
}; 