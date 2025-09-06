import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function TableBody({ children, className }) {
  return (
    <tbody className={twMerge('bg-white divide-y divide-gray-200', className)}>{children}</tbody>
  );
}

TableBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
