import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function TableHeaderCell({ children, className }) {
  return (
    <th className={twMerge('px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', className)}>
      {children}
    </th>
  );
}

TableHeaderCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}; 