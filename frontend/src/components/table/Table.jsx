import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function Table({ children, className }) {
  return (
    <div className={twMerge('w-full overflow-x-auto', className)}>
      <table className='min-w-full divide-y divide-gray-200'>{children}</table>
    </div>
  );
}

Table.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
