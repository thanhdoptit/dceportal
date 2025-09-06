import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import FormGroup from './FormGroup';
import FormRow from './FormRow';
import FormActions from './FormActions';

const Form = ({
  children,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  loading = false,
  className = '',
  ...props
}) => {
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={twMerge('space-y-6', className)} {...props}>
      {children}
      <FormActions
        onSubmit={handleSubmit}
        onCancel={onCancel}
        submitLabel={submitLabel}
        cancelLabel={cancelLabel}
        loading={loading}
      />
    </form>
  );
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

Form.Group = FormGroup;
Form.Row = FormRow;

export default Form;
