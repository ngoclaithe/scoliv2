import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AccessCodeManagement from './AccessCodeManagement';
import AccountManagement from './AccountManagement';
import CodePurchaseManagement from './CodePurchaseManagement';
import PaymentInfoManagement from './PaymentInfoManagement';
import ActiveRoomManagement from './ActiveRoomManagement';
import LogoManagement from './LogoManagement';
import SocketStatusManagement from './SocketStatusManagement';
import { AdminAuthProvider, useAdminAuth } from '../../contexts/AdminAuthContext';
import Loading from '../common/Loading';

const AdminAppContent = () => {
  const { admin, isAuthenticated, loading, logout } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogout = () => {
    logout();
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'access-codes':
        return <AccessCodeManagement />;
      case 'accounts':
        return <AccountManagement />;
      case 'code-purchases':
        return <CodePurchaseManagement />;
      case 'payment-info':
        return <PaymentInfoManagement />;
      case 'active-rooms':
        return <ActiveRoomManagement />;
      case 'logo-management':
        return <LogoManagement />;
      case 'socket-status':
        return <SocketStatusManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading size="lg" />
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Show admin dashboard
  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      adminInfo={admin}
    >
      {renderPage()}
    </AdminLayout>
  );
};

const AdminApp = () => {
  return (
    <AdminAuthProvider>
      <AdminAppContent />
    </AdminAuthProvider>
  );
};

export default AdminApp;
