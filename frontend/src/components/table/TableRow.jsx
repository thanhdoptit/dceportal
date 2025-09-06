import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function TableRow({ children, className }) {
  return <tr className={twMerge('hover:bg-gray-50', className)}>{children}</tr>;
}

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
