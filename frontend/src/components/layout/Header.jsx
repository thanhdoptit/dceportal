import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';

const Header = ({ user, onLogout, className = '', ...props }) => {
  return (
    <header className={twMerge('bg-white shadow-sm', className)} {...props}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <img className='h-8 w-auto' src='/logo.svg' alt='Logo' />
            </div>
          </div>
          <div className='flex items-center'>
            <Dropdown
              trigger={
                <div className='flex items-center space-x-3 cursor-pointer'>
                  <Avatar src={user?.avatar} alt={user?.name} fallback={user?.name?.[0]} />
                  <span className='text-sm font-medium text-gray-700'>{user?.name}</span>
                </div>
              }
              items={[
                {
                  label: 'Hồ sơ',
                  onClick: () => {
                    // Handle profile click
                  },
                },
                {
                  label: 'Cài đặt',
                  onClick: () => {
                    // Handle settings click
                  },
                },
                {
                  label: 'Đăng xuất',
                  onClick: onLogout,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Header;
