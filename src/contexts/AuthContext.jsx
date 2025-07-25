import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthAPI from '../API/apiAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hàm load thông tin người dùng từ token
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      if (AuthAPI.isAuthenticated()) {
        const userData = await AuthAPI.getMe();
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          avatar: userData.avatar
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Lỗi tải thông tin người dùng:', error);
      AuthAPI.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Kiểm tra token từ localStorage khi khởi tạo
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { user: userData, token } = await AuthAPI.login(credentials);
      
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        avatar: userData.avatar
      });
      
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWithCode = async (code) => {
    try {
      setLoading(true);
      // Giả sử API hỗ trợ đăng nhập bằng code
      // Nếu không, có thể sử dụng login thông thường với email/password
      const response = await AuthAPI.login({ code });
      
      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        avatar: response.user.avatar
      });
      
      setIsAuthenticated(true);
      return { success: true, user: response.user };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await AuthAPI.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'user' // Mặc định là user
      });
      
      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        avatar: response.user.avatar
      });
      
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Đăng ký thất bại. Vui lòng thử lại.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Thêm các hàm mới cho cập nhật thông tin và mật khẩu
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const updatedUser = await AuthAPI.updateDetails(userData);
      
      setUser(prev => ({
        ...prev,
        ...updatedUser,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email
      }));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await AuthAPI.updatePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      await AuthAPI.forgotPassword(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await AuthAPI.resetPassword(token, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: AuthAPI.isAuthenticated(),
    loading,
    login,
    loginWithCode,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
