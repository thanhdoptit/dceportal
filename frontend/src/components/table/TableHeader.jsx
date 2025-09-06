import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function TableHeader({ children, className }) {
  return <thead className={twMerge('bg-gray-50', className)}>{children}</thead>;
}

TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
