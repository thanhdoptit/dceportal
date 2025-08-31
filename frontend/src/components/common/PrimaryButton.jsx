import React from 'react';
import { Button } from 'antd';

/**
 * PrimaryButton Component - Áp dụng styling standards cho buttons chính
 * 
 * @param {Object} props
 * @param {string} props.children - Text của button
 * @param {string} props.variant - 'primary' | 'secondary' | 'danger'
 * @param {string} props.size - 'small' | 'middle' | 'large'
 * @param {boolean} props.icon - Icon component
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 */
const PrimaryButton = ({
  children,
  variant = 'primary',
  size = 'middle',
  icon,
  onClick,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  // Brand color - VietinBank Blue
  const BRAND_COLOR = '#003c71';
  
  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: BRAND_COLOR,
      borderColor: BRAND_COLOR,
      color: 'white',
      hover: {
        backgroundColor: '#002a5a',
        borderColor: '#002a5a',
      }
    },
    secondary: {
      backgroundColor: '#2563eb',
      borderColor: '#2563eb',
      color: 'white',
      hover: {
        backgroundColor: '#1d4ed8',
        borderColor: '#1d4ed8',
      }
    },
    danger: {
      backgroundColor: '#dc2626',
      borderColor: '#dc2626',
      color: 'white',
      hover: {
        backgroundColor: '#b91c1c',
        borderColor: '#b91c1c',
      }
    }
  };

  const currentStyle = variantStyles[variant];
  const baseClassName = `flex items-center gap-2 whitespace-nowrap ${className}`;

  return (
    <Button
      type="primary"
      size={size}
      icon={icon}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      className={baseClassName}
      style={{
        backgroundColor: currentStyle.backgroundColor,
        borderColor: currentStyle.borderColor,
        color: currentStyle.color,
        ...props.style
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.backgroundColor = currentStyle.hover.backgroundColor;
          e.target.style.borderColor = currentStyle.hover.borderColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.backgroundColor = currentStyle.backgroundColor;
          e.target.style.borderColor = currentStyle.borderColor;
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

/**
 * ActionButton Component - Cho buttons trong table
 */
export const ActionButton = ({
  children,
  onClick,
  icon,
  size = 'small',
  type = 'primary',
  className = '',
  ...props
}) => {
  const baseClassName = `flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap ${className}`;

  return (
    <Button
      onClick={onClick}
      size={size}
      type={type}
      icon={icon}
      className={baseClassName}
      {...props}
    >
      {children}
    </Button>
  );
};

/**
 * StatusButton Component - Cho status indicators
 */
export const StatusButton = ({
  status,
  children,
  onClick,
  size = 'small',
  className = '',
  ...props
}) => {
  const statusColors = {
    success: 'bg-green-600 hover:bg-green-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-orange-600 hover:bg-orange-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  const colorClass = statusColors[status] || statusColors.info;
  const baseClassName = `flex items-center gap-2 text-white whitespace-nowrap ${colorClass} ${className}`;

  return (
    <Button
      onClick={onClick}
      size={size}
      type="primary"
      className={baseClassName}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton; 