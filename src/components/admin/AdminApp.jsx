import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AccessCodeManagement from './AccessCodeManagement';
import AccountManagement from './AccountManagement';
import CodePurchaseManagement from './CodePurchaseManagement';
import PaymentInfoManagement from './PaymentInfoManagement';
import ActiveRoomManagement from './ActiveRoomManagement';
import adminAPI from '../../API/apiAdmin';
import Loading from '../common/Loading';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      setLoading(true);
      
      // Check if admin token exists
      if (adminAPI.isAuthenticated()) {
        // For demo purposes, we'll use a mock admin
        const mockAdmin = {
          id: 'admin-1',
          name: 'Admin Demo',
          email: 'admin@demo.com',
          role: 'admin'
        };
        
        setAdminInfo(mockAdmin);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      adminAPI.logout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const mockAdmin = {
        id: 'admin-1',
        name: 'Admin Demo',
        email: 'admin@demo.com',
        role: 'admin'
      };
      
      // Set fake token
      localStorage.setItem('admin_token', 'fake-admin-token');
      
      setAdminInfo(mockAdmin);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminAPI.logout();
    setIsAuthenticated(false);
    setAdminInfo(null);
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
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Show admin dashboard
  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      adminInfo={adminInfo}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminApp;
