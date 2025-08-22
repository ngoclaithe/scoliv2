import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthAPI from '../API/apiAuth';
import AccessCodeAPI from '../API/apiAccessCode';
import { toast } from 'react-toastify';

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

  const [authType, setAuthType] = useState(null); 
  const [matchCode, setMatchCode] = useState(null); 
  const [codeOnly, setCodeOnly] = useState(false); 
  const [typeMatch, setTypeMatch] = useState('soccer'); 

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      if (AuthAPI.isAuthenticated()) {
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
          setAuthType('account');
          setCodeOnly(false);
        } catch (apiError) {
          AuthAPI.logout();
        }
      }
    } catch (error) {
      console.error('Lỗi tải thông tin người dùng:', error);
      AuthAPI.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    try {
      setLoading(true);

      const { user: userData } = await AuthAPI.login(credentials);

      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        avatar: userData.avatar
      });

      setCodeOnly(false);
      setAuthType('account'); 
      setIsAuthenticated(true);
      
      toast.success('Đăng nhập thành công!');
      return { success: true, user: userData };
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      
      // Chỉ hiển thị message lỗi từ server
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWithCode = async (code) => {
    try {
      setLoading(true);

      const response = await AccessCodeAPI.verifyCodeForLogin(code);

      if (response.success && response.isValid) {
        const matchInfo = response.data?.match;
        const typeMatch = response.data?.type_match || 'soccer';
        const userData = {
          id: 'code-user-' + code,
          email: null,
          name: matchInfo ? `${matchInfo.teamAName} vs ${matchInfo.teamBName}` : `Code User - ${code}`,
          role: 'code-only',
          avatar: null
        };

        setUser(userData);
        setMatchCode(code);
        setCodeOnly(true);
        setAuthType('code');
        setIsAuthenticated(true);
        setTypeMatch(typeMatch);

        toast.success('Đăng nhập bằng mã thành công!');

        return {
          success: true,
          user: userData,
          matchInfo: matchInfo,
          typeMatch: typeMatch
        };
      } else {
        const errorMessage = response.message || 'Mã không hợp lệ. Vui lòng thử lại.';
        toast.error(errorMessage);
        
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Lỗi đăng nhập với code:', error);
      
      // Chỉ hiển thị message lỗi từ server
      const errorMessage = error.response?.data?.message || 'Mã không hợp lệ. Vui lòng thử lại.';
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
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
        role: 'user' 
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
      
      toast.success('Đăng ký thành công!');
      return { success: true, user: userData };
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      
      // Chỉ hiển thị message lỗi từ server, không hiển thị mã trạng thái
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setAuthType(null);
      setMatchCode(null);
      setCodeOnly(false);
      setTypeMatch('soccer');
    }
  };

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
      
      toast.success('Cập nhật thông tin thành công!');
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Lỗi cập nhật profile:', error);
      
      // Chỉ hiển thị message lỗi từ server
      const errorMessage = error.response?.data?.message || 'Cập nhật thông tin thất bại.';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      
      await AuthAPI.updatePassword({ currentPassword, newPassword });
      
      toast.success('Đổi mật khẩu thành công!');
      return { success: true };
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      
      // Chỉ hiển thị message lỗi từ server
      const errorMessage = error.response?.data?.message || 'Đổi mật khẩu thất bại.';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      
      await AuthAPI.forgotPassword(email);
      
      toast.success('Email đặt lại mật khẩu đã được gửi!');
      return { success: true };
    } catch (error) {
      console.error('Lỗi gửi email reset mật khẩu:', error);
      
      // Chỉ hiển thị message lỗi từ server
      const errorMessage = error.response?.data?.message || 'Gửi email thất bại.';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      
      await AuthAPI.resetPassword(token, newPassword);
      
      toast.success('Đặt lại mật khẩu thành công!');
      return { success: true };
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu:', error);
      
      // Chỉ hiển thị message lỗi từ server
      const errorMessage = error.response?.data?.message || 'Đặt lại mật khẩu thất bại.';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const enterMatchCode = async (code) => {
    try {
      setLoading(true);

      const response = await AccessCodeAPI.verifyCodeForLogin(code);
      if (response.success && response.isValid) {
        const typeMatch = response.data?.type_match || 'soccer';
        setMatchCode(code);
        setAuthType('full');
        setTypeMatch(typeMatch);
        
        toast.success('Nhập mã trận đấu thành công!');
        
        return {
          success: true,
          matchData: response.data?.match,
          codeInfo: response.data,
          typeMatch: typeMatch
        };
      } else {
        const errorMessage = response.message || 'Mã trận đấu không hợp lệ.';
        toast.error(errorMessage);
        
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Lỗi xác thực mã trận đấu:', error);
      
      // Chỉ hiển thị message lỗi từ server
      const errorMessage = error.response?.data?.message || 'Mã trận đấu không hợp lệ.';
      
      toast.error(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const clearMatchCode = () => {
    setMatchCode(null);
    setTypeMatch('soccer');
    if (authType === 'full') {
      setAuthType('account');
    }
  };

  const handleExpiredAccess = useCallback((error) => {
    if (error?.message && error.message.includes('Mã truy cập đã bị hết hạn')) {
      toast.error('Mã truy cập đã hết hạn. Đang đăng xuất...');

      setTimeout(() => {
        logout();
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }, 1000);

      return true; 
    }
    return false; 
  }, [logout]);

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
    authType,
    matchCode,
    codeOnly,
    typeMatch,
    hasAccountAccess,
    hasMatchAccess,
    canAccessProfile,
    enterMatchCode,
    clearMatchCode,
    handleExpiredAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;