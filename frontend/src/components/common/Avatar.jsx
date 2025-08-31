import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Avatar = ({
  src,
  alt,
  size = 'md',
  fallback,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-14 w-14',
    '2xl': 'h-16 w-16'
  };

  const fallbackSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={twMerge(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }

  if (fallback) {
    return (
      <div
        className={twMerge(
          'rounded-full bg-gray-100 flex items-center justify-center text-gray-600',
          sizes[size],
          className
        )}
        {...props}
      >
        <span className={fallbackSizes[size]}>{fallback}</span>
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        'rounded-full bg-gray-100',
        sizes[size],
        className
      )}
      {...props}
    >
      <svg
        className="h-full w-full text-gray-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl']),
  fallback: PropTypes.string,
  className: PropTypes.string
};

export default Avatar; 