import React from 'react';
import PropTypes from 'prop-types';

/**
 * MainLayout component that provides a consistent layout for all pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered inside the layout
 */
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý tài khoản
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
