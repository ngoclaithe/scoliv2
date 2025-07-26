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

  // Trạng thái mới cho việc phân biệt loại đăng nhập
  const [authType, setAuthType] = useState(null); // 'account', 'code', 'full'
  const [matchCode, setMatchCode] = useState(null); // Code trận đấu hiện tại
  const [codeOnly, setCodeOnly] = useState(false); // Đăng nhập chỉ bằng code

  // Hàm load thông tin người dùng từ token
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      if (AuthAPI.isAuthenticated()) {
        // Kiểm tra xem có phải là demo user account không
        const token = AuthAPI.getToken();
        if (token && (token.includes('user-token') || token.includes('admin-token'))) {
          // Demo user account - set authType là 'account'
          const userData = {
            id: 'user-demo',
            email: 'demo@user.com',
            name: 'User Demo',
            role: 'user',
            avatar: null
          };
          setUser(userData);
          setIsAuthenticated(true);
          setAuthType('account');
          setCodeOnly(false);
        } else {
          // Thực tế call API
          try {
            const userData = await AuthAPI.getMe();
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              avatar: userData.avatar
            });
            setIsAuthenticated(true);
            setAuthType('account'); // User account từ API
            setCodeOnly(false);
          } catch (apiError) {
            // Nếu API fail, clear token
            AuthAPI.logout();
          }
        }
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

      // Demo: Đăng nhập user demo
      if (credentials.email === 'demo@user.com' && credentials.password === 'demo123') {
        const userData = {
          id: 'user-demo',
          email: 'demo@user.com',
          name: 'User Demo',
          role: 'user',
          avatar: null
        };

        setUser(userData);
        setCodeOnly(false);
        setAuthType('account'); // User đăng nhập thành công
        setIsAuthenticated(true);

        // Fake token for demo
        localStorage.setItem('token', 'fake-user-token');

        return { success: true, user: userData };
      }

      // Đăng nhập thực tế thông qua API
      const { user: userData, token } = await AuthAPI.login(credentials);

      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        avatar: userData.avatar
      });

      setCodeOnly(false);
      setAuthType('account'); // Chỉ đăng nhập tài khoản
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
      // Giả lập đăng nhập chỉ bằng code (không có tài khoản)
      // Trong thực tế, API sẽ xác thực code và trả về thông tin trận đấu

      // Gọi API để xác thực access code
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Mã không hợp lệ hoặc đã hết hạn');
      }

      const data = await response.json();

      setUser({
        id: data.userId || 'code-user',
        email: null,
        name: data.userName || `Code User - ${code}`,
        role: 'code-only',
        avatar: null
      });

      setMatchCode(code);
      setCodeOnly(true);
      setAuthType('code');
      setIsAuthenticated(true);

      return { success: true, user: { name: data.userName || `Code User - ${code}`, role: 'code-only' } };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Mã không hợp lệ. Vui lòng thử lại.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);

      // Đăng ký thực tế thông qua API
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

      setCodeOnly(false);
      setAuthType('account');
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
      setAuthType(null);
      setMatchCode(null);
      setCodeOnly(false);
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

  // Hàm mới để nhập code trận đấu sau khi đã đăng nhập tài khoản
  const enterMatchCode = async (code) => {
    try {
      setLoading(true);
      // Xác thực code trận đấu
      if (code.toLowerCase() === 'ffff' || code.toLowerCase() === 'demo') {
        setMatchCode(code);
        setAuthType('full'); // Có cả tài khoản và code
        return { success: true };
      } else {
        throw new Error('Mã trận đấu không hợp lệ');
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Mã trận đấu không hợp lệ.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Hàm để clear code trận đấu
  const clearMatchCode = () => {
    setMatchCode(null);
    if (authType === 'full') {
      setAuthType('account');
    }
  };

  // Computed values
  const hasAccountAccess = authType === 'account' || authType === 'full';
  const hasMatchAccess = authType === 'code' || authType === 'full';
  const canAccessProfile = hasAccountAccess && !codeOnly;

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    loginWithCode,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    // Thêm các giá trị mới
    authType,
    matchCode,
    codeOnly,
    hasAccountAccess,
    hasMatchAccess,
    canAccessProfile,
    enterMatchCode,
    clearMatchCode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
