import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import Button from '../common/Button';

const FormActions = ({
  onSubmit,
  onCancel,
  submitLabel = 'Lưu',
  cancelLabel = 'Hủy',
  loading = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'flex justify-end space-x-3',
        className
      )}
      {...props}
    >
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        onClick={onSubmit}
        loading={loading}
      >
        {submitLabel}
      </Button>
    </div>
  );
};

FormActions.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default FormActions; 