import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function TableCell({ children, className }) {
  return (
    <td className={twMerge('px-6 py-4 whitespace-nowrap text-sm text-gray-500', className)}>
      {children}
    </td>
  );
}

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}; 