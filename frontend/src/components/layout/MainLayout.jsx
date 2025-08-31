import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout = ({
  children,
  user,
  onLogout,
  sidebarItems,
  className = '',
  ...props
}) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main
          className={twMerge(
            'flex-1 p-6',
            className
          )}
          {...props}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string
  }),
  onLogout: PropTypes.func.isRequired,
  sidebarItems: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node
    })
  ).isRequired,
  className: PropTypes.string
};

export default MainLayout; 