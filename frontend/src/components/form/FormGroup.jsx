import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const FormGroup = ({
  label,
  name,
  error,
  required = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={twMerge('mb-4', className)} {...props}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

FormGroup.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default FormGroup; 