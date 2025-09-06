import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ items, className = '', ...props }) => {
  const location = useLocation();

  return (
    <div className={twMerge('w-64 bg-gray-800 min-h-screen', className)} {...props}>
      <div className='flex flex-col h-full'>
        <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
          <nav className='mt-5 flex-1 px-2 space-y-1'>
            {items.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={twMerge(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  {item.icon && (
                    <span
                      className={twMerge(
                        'mr-3 flex-shrink-0 h-6 w-6',
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default Sidebar;
