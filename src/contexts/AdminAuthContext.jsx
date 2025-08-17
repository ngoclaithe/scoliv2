import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AdminAuthAPI from '../API/apiAdminAuth';
import { toast } from 'react-toastify';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth phải được sử dụng trong AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadAdmin = useCallback(async () => {
    try {
      setLoading(true);
      
      if (AdminAuthAPI.isAuthenticated()) {
        const response = await AdminAuthAPI.getMe();
        if (response.success && response.user.role === 'admin') {
          setAdmin(response.user);
          setIsAuthenticated(true);
        } else {
          AdminAuthAPI.logout();
          setAdmin(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Lỗi tải thông tin admin:', error);
      AdminAuthAPI.logout();
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  const login = async (credentials) => {
    try {
      setLoading(true);

      const response = await AdminAuthAPI.login(credentials);

      if (response.success && response.user.role === 'admin') {
        setAdmin(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        return {
          success: false,
          error: response.message || 'Đăng nhập admin thất bại'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Đăng nhập admin thất bại. Vui lòng thử lại.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AdminAuthAPI.logout();
    } catch (error) {
      console.error('Lỗi khi đăng xuất admin:', error);
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
    loadAdmin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
