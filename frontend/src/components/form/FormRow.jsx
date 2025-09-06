import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const FormRow = ({ children, className = '', ...props }) => {
  return (
    <div
      className={twMerge('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}
      {...props}
    >
      {children}
    </div>
  );
};

FormRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default FormRow;
